/**
 * Contact form → the BMGT sales mailbox, over Hostinger SMTP.
 *
 * This is the only server-side code in the project, and it exists for one
 * reason: an SMTP password cannot live in `src/`. Everything under `src/` is
 * compiled into the JS bundle and served to every visitor, so a credential
 * placed there is public. Here it stays in the deploy environment and never
 * leaves the server.
 *
 * Reached at POST /api/contact — see public/_redirects for the rewrite.
 *
 * Local development: `netlify dev` (not `npm run dev`, which serves the static
 * app only and has no function runtime). Values come from .env; see .env.example.
 */
import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

/** Field caps. Generous for a human, tight enough that the body cannot be used as a payload. */
const LIMITS = { name: 120, company: 160, email: 254, phone: 40, message: 5000 } as const

/* Deliberately loose. Address validity is decided by whether the reply bounces,
   not by a regex — the strict RFC 5322 pattern rejects real addresses and is a
   well-known way to lose enquiries. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const RATE = { windowMs: 60_000, max: 5 }

/**
 * Burst brake, not a real rate limiter.
 *
 * Module scope survives only as long as a warm function instance, so a
 * determined attacker gets a fresh allowance whenever Netlify spins up another
 * container. What this does stop is the common case: one script hammering one
 * instance. Real abuse protection would need a shared store (Netlify Blobs or
 * Upstash) — worth adding if the mailbox ever starts filling up.
 */
const hits = new Map<string, number[]>()

function overRate(ip: string, now: number) {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE.windowMs)
  recent.push(now)
  hits.set(ip, recent)

  /* Evict cold keys so a long-lived instance cannot grow the map without bound. */
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < RATE.windowMs)) hits.delete(key)
    }
  }

  return recent.length > RATE.max
}

/* Anything interpolated into a mail header must not carry CR/LF: a newline in
   the subject is how an injected `Bcc:` line gets added to an outbound message. */
const oneLine = (value: string) => value.replace(/[\r\n]+/g, ' ').trim()

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => ESCAPES[c])

const str = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : ''

const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  })

/**
 * Built once per warm instance. `pool: true` keeps the TLS connection open
 * between invocations, which matters because the SMTP handshake costs more
 * than the send does.
 */
let cached: Transporter | null = null

function transport() {
  if (cached) return cached

  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) {
    throw new Error(
      'SMTP_USER / SMTP_PASS are not set. Add them under Site configuration → Environment variables.',
    )
  }

  const port = Number(process.env.SMTP_PORT ?? 465)
  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port,
    /* 465 is implicit TLS; 587 opens in the clear and upgrades via STARTTLS. */
    secure: port === 465,
    auth: { user, pass },
    pool: true,
  })
  return cached
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return json(405, { error: 'method_not_allowed' }, { allow: 'POST' })
  }

  /* Reject an oversized body before reading it into memory. */
  const declared = Number(req.headers.get('content-length') ?? 0)
  if (declared > 20_000) return json(413, { error: 'too_large' })

  let payload: Record<string, unknown>
  try {
    payload = (await req.json()) as Record<string, unknown>
  } catch {
    return json(400, { error: 'bad_json' })
  }

  /* Hidden field, invisible and unreachable by keyboard. A human never fills
     it; the bots that autofill every input in the DOM always do. Answering 200
     rather than 4xx means the bot logs a success and does not come back to
     probe for what tripped it. */
  if (str(payload.website, 200)) return json(200, { ok: true })

  const name = str(payload.name, LIMITS.name)
  const company = str(payload.company, LIMITS.company)
  const email = str(payload.email, LIMITS.email)
  const phone = str(payload.phone, LIMITS.phone)
  const message = str(payload.message, LIMITS.message)
  const locale = str(payload.locale, 8) === 'ar' ? 'ar' : 'en'

  const missing = [
    !name && 'name',
    !EMAIL.test(email) && 'email',
    !message && 'message',
  ].filter(Boolean)
  if (missing.length) return json(422, { error: 'invalid', fields: missing })

  const ip =
    req.headers.get('x-nf-client-connection-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  if (overRate(ip, Date.now())) {
    return json(429, { error: 'rate_limited' }, { 'retry-after': '60' })
  }

  const from = process.env.SMTP_USER as string
  const to = process.env.CONTACT_TO || from

  const subject = company
    ? `Enquiry from ${oneLine(name)} — ${oneLine(company)}`
    : `Enquiry from ${oneLine(name)}`

  const rows: Array<[string, string]> = [
    ['Name', name],
    ['Company', company || '—'],
    ['Email', email],
    ['Phone', phone || '—'],
    ['Language', locale === 'ar' ? 'Arabic' : 'English'],
  ]

  const text = [...rows.map(([k, v]) => `${k}: ${v}`), '', message].join('\n')

  const html = `<table style="font:15px/1.6 -apple-system,Segoe UI,sans-serif;border-collapse:collapse">
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="padding:2px 16px 2px 0;color:#5a6b7c">${k}</td><td style="padding:2px 0;color:#0b1f33"><strong>${escapeHtml(
        v,
      )}</strong></td></tr>`,
  )
  .join('\n')}
</table>
<p style="font:15px/1.65 -apple-system,Segoe UI,sans-serif;color:#0b1f33;white-space:pre-wrap;margin-top:20px">${escapeHtml(
    message,
  )}</p>`

  try {
    await transport().sendMail({
      /* From must be the authenticated mailbox or Hostinger refuses the send
         and SPF fails downstream. The visitor's address goes in Reply-To, so
         hitting reply in the inbox still answers them directly. */
      from: { name: `${oneLine(name)} via bmgt.ae`, address: from },
      to,
      replyTo: { name: oneLine(name), address: email },
      subject,
      text,
      html,
    })
  } catch (err) {
    /* Logged in full for the Netlify function log, never returned — an SMTP
       error can quote the host, the username and sometimes the auth mechanism. */
    console.error('contact: send failed', err)
    return json(502, { error: 'send_failed' })
  }

  return json(200, { ok: true })
}

/* Netlify v2 routing. The _redirects rule covers the same path and is what
   actually resolves today; this keeps the endpoint declared next to the code
   that serves it. */
export const config = { path: '/api/contact' }
