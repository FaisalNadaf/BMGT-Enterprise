/**
 * Checks the SMTP credentials without sending anything.
 *
 * `verify()` opens the connection, negotiates TLS and runs AUTH, then hangs up
 * — so a pass here means the contact form will deliver, and no test message
 * lands in the sales inbox.
 *
 *   npm run mail:verify
 *
 * Reads .env (see .env.example). Run it after changing the mailbox password,
 * and once against production values before announcing the form works.
 */
import nodemailer from 'nodemailer'

const { SMTP_HOST = 'smtp.hostinger.com', SMTP_PORT = '465', SMTP_USER, SMTP_PASS } = process.env

if (!SMTP_USER || !SMTP_PASS) {
  console.error('SMTP_USER / SMTP_PASS are not set. Copy .env.example to .env and fill them in.')
  process.exit(1)
}

const port = Number(SMTP_PORT)
console.log(`${SMTP_USER} → ${SMTP_HOST}:${port}`)

const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port,
  secure: port === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
  connectionTimeout: 15_000,
  greetingTimeout: 15_000,
})

try {
  await transport.verify()
  console.log('OK — host reachable and credentials accepted.')
  transport.close()
} catch (err) {
  transport.close()
  console.error(`FAILED — ${err.code ?? ''} ${err.message}`)

  /* The SMTP reply codes are terse and the causes are not guessable, so each
     one gets the short list of things that actually produce it. */
  if (err.code === 'EAUTH') {
    console.error(
      '\n535 means the connection worked and the login did not. Usually one of:\n' +
        '  - the password is the hPanel account password, not the mailbox password\n' +
        '  - the mailbox does not exist yet, or email hosting is not active for the domain\n' +
        '  - the password was rotated\n' +
        '  - the plan is Titan Email rather than Hostinger Email — then SMTP_HOST is smtp.titan.email\n' +
        '\nRepeated failures get the IP throttled. Confirm the password in hPanel before retrying.',
    )
  }
  if (err.code === 'ETIMEDOUT' || err.code === 'ESOCKET') {
    console.error('\nConnection never completed — port 465 may be blocked here. Try SMTP_PORT=587.')
  }
  process.exit(1)
}
