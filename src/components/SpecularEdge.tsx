import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Color, Mesh, Program, Renderer, Triangle } from 'ogl'

/**
 * The specular edge highlight from React Bits' <SpecularButton />, lifted out
 * of the button so it can sit inside whatever element the host renders.
 *
 * That is the whole reason this is not a drop-in: the upstream component *is*
 * a <button>, but 16 of this site's 18 buttons are navigation — router Links
 * and mailto/tel anchors. Rendering those as <button onClick={navigate}> would
 * lose middle-click, open-in-new-tab, copy-link-address and the crawlable href
 * on what is a marketing site. Here the canvas is an absolutely positioned
 * child, so <Link>, <a> and <button> all keep their own semantics and all get
 * the same effect.
 *
 * Three additions over the upstream version, all forced by using it at scale
 * (a page mounts 5–7 buttons — header CTA, page buttons, and the CTA band that
 * closes every page):
 *
 *   1. Reduced motion skips WebGL entirely — no context, no RAF loop. The
 *      upstream loop runs unconditionally.
 *   2. The renderer is created on first intersection and torn down when the
 *      button leaves the viewport, so live WebGL contexts stay near what is
 *      actually on screen rather than 7 at once.
 *   3. One shared window pointermove listener for every instance, rather than
 *      one each. The upstream handler also calls getBoundingClientRect() on
 *      every pointer move; with seven buttons that is seven forced layouts per
 *      mouse move, so the rect is cached and refreshed on resize/scroll.
 */

const PAD = 20

/* ── shared pointer tracker ─────────────────────────────────────────────── */

let pointerX = 0
let pointerY = 0
let pointerSeen = false
let listeners = 0

const onWindowPointerMove = (event: PointerEvent) => {
  pointerX = event.clientX
  pointerY = event.clientY
  pointerSeen = true
}

function subscribePointer() {
  if (listeners === 0) {
    window.addEventListener('pointermove', onWindowPointerMove, { passive: true })
  }
  listeners += 1
  return () => {
    listeners -= 1
    if (listeners === 0) window.removeEventListener('pointermove', onWindowPointerMove)
  }
}

/* ── shaders (unchanged from the source component) ──────────────────────── */

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float shapeSDF(vec2 p) { return sdRoundedRect(p, uHalfSize, uRadius); }

float gaussianLine(float d, float sigma) {
  float x = d / (sigma + 1e-6);
  float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));
  return exp(-k * x * x);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = shapeSDF(p);
  vec2 L = vec2(cos(uAngle), sin(uAngle));

  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.45;

  vec2 nEll = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float line = gaussianLine(d, uThickness);
  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float hi = line * rim * edgeClamp * uIntensity;

  vec3 col = uBaseColor * base + uLineColor * hi;
  float a = clamp(base + hi, 0.0, 1.0);
  fragColor = vec4(col, a);
}
`

export type SpecularEdgeProps = {
  radius?: number
  lineColor?: string
  baseColor?: string
  intensity?: number
  shineSize?: number
  shineFade?: number
  thickness?: number
  speed?: number
  followMouse?: boolean
  proximity?: number
  autoAnimate?: boolean
}

export function SpecularEdge({
  radius = 18,
  lineColor = '#ffffff',
  baseColor = '#525252',
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
}: SpecularEdgeProps) {
  const hostRef = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const propsRef = useRef<Required<SpecularEdgeProps>>(null as never)

  propsRef.current = {
    radius, lineColor, baseColor, intensity, shineSize,
    shineFade, thickness, speed, followMouse, proximity, autoAnimate,
  }

  useEffect(() => {
    /* A permanently running RAF loop is exactly what this setting asks us not
       to do, and the effect is decoration — so it is skipped, not shortened. */
    if (reduced) return

    const fx = hostRef.current
    const btn = fx?.parentElement
    if (!fx || !btn) return

    let teardown: (() => void) | null = null

    const start = () => {
      if (teardown) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      let renderer: Renderer
      try {
        renderer = new Renderer({
          alpha: true, premultipliedAlpha: true, antialias: true, dpr,
        })
      } catch {
        return /* no WebGL — the button still renders, just without the shine */
      }

      const gl = renderer.gl
      /* The shaders are GLSL ES 3.00 and will not compile on WebGL1. */
      if (!(gl instanceof WebGL2RenderingContext)) {
        gl.getExtension('WEBGL_lose_context')?.loseContext()
        return
      }

      gl.clearColor(0, 0, 0, 0)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

      const geometry = new Triangle(gl)
      if (geometry.attributes.uv) delete geometry.attributes.uv

      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uCenter: { value: [0, 0] },
          uHalfSize: { value: [1, 1] },
          uRadius: { value: 0 },
          uAngle: { value: 2.4 },
          uPx: { value: dpr },
          uLineColor: { value: [1, 1, 1] },
          uBaseColor: { value: [0.32, 0.32, 0.32] },
          uIntensity: { value: 1 },
          uShineSize: { value: 0.17 },
          uShineFade: { value: 0.7 },
          uThickness: { value: 1 },
          uBaseWidth: { value: dpr },
        },
      })

      const mesh = new Mesh(gl, { geometry, program })
      fx.appendChild(gl.canvas)

      /* Cached so the pointer handler never forces a layout. */
      let rect = btn.getBoundingClientRect()
      const size = { w: 1, h: 1 }

      const resize = () => {
        rect = btn.getBoundingClientRect()
        const { width: w, height: h } = rect
        if (w === 0 || h === 0) return
        size.w = w
        size.h = h
        renderer.setSize(w + PAD * 2, h + PAD * 2)
        program.uniforms.uCenter.value = [(PAD + w / 2) * dpr, (PAD + h / 2) * dpr]
        program.uniforms.uHalfSize.value = [(w / 2) * dpr, (h / 2) * dpr]
      }

      const ro = new ResizeObserver(resize)
      ro.observe(btn)
      resize()

      /* Scroll fires far more often than the screen repaints, and
         getBoundingClientRect() forces a synchronous layout. Reading it in the
         handler meant one forced layout per button per scroll event — with
         five to seven buttons on a page that is enough to visibly stall a
         phone. The handler now only raises a flag; the rect is read at most
         once per frame, inside the RAF loop that was already running. */
      let rectDirty = false
      const refreshRect = () => {
        rectDirty = true
      }
      window.addEventListener('scroll', refreshRect, { passive: true })
      const unsubscribe = subscribePointer()

      let angle = 2.4
      let idleAngle = 2.4
      let bright = 0
      let last = performance.now()
      let raf = 0

      const lineC = new Color()
      const baseC = new Color()

      const update = (now: number) => {
        raf = requestAnimationFrame(update)
        const dt = Math.min((now - last) / 1000, 0.05)
        last = now
        const p = propsRef.current

        if (rectDirty) {
          rect = btn.getBoundingClientRect()
          rectDirty = false
        }

        let pointerAngle: number | null = null
        let proximityT = 0
        if (pointerSeen) {
          const cx = rect.left + rect.width / 2
          const cy = rect.top + rect.height / 2
          const dx = Math.max(rect.left - pointerX, 0, pointerX - rect.right)
          const dy = Math.max(rect.top - pointerY, 0, pointerY - rect.bottom)
          const dist = Math.hypot(dx, dy)
          if (dist === 0) {
            /* Over the button the light settles on the diagonal, framing the
               corners, and sways a little with the cursor inside it. */
            const nx = (pointerX - cx) / (rect.width / 2)
            const ny = (cy - pointerY) / (rect.height / 2)
            pointerAngle =
              Math.atan2(2 / rect.height, -2 / rect.width) + nx * 0.3 + ny * 0.15
          } else {
            pointerAngle = Math.atan2(cy - pointerY, pointerX - cx)
          }
          const t = Math.max(0, 1 - dist / Math.max(p.proximity, 1))
          proximityT = t * t * (3 - 2 * t)
        }

        idleAngle += p.speed * dt
        const steer =
          p.followMouse && pointerAngle !== null && (!p.autoAnimate || proximityT > 0)
        const target = steer ? (pointerAngle as number) : idleAngle
        const diff = ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI
        angle += diff * (1 - Math.exp(-dt * 7))

        const brightTarget = p.autoAnimate ? 1 : proximityT
        bright += (brightTarget - bright) * (1 - Math.exp(-dt * 8))

        lineC.set(p.lineColor)
        baseC.set(p.baseColor)
        program.uniforms.uAngle.value = angle
        program.uniforms.uRadius.value =
          Math.min(p.radius, Math.min(size.w, size.h) / 2) * dpr
        program.uniforms.uLineColor.value = [lineC.r, lineC.g, lineC.b]
        program.uniforms.uBaseColor.value = [baseC.r, baseC.g, baseC.b]
        program.uniforms.uIntensity.value = p.intensity * bright
        program.uniforms.uShineSize.value = (p.shineSize * Math.PI) / 180
        program.uniforms.uShineFade.value = (p.shineFade * Math.PI) / 180
        program.uniforms.uThickness.value = p.thickness * dpr
        renderer.render({ scene: mesh })
      }
      raf = requestAnimationFrame(update)

      teardown = () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        window.removeEventListener('scroll', refreshRect)
        unsubscribe()
        if (gl.canvas.parentNode === fx) fx.removeChild(gl.canvas)
        gl.getExtension('WEBGL_lose_context')?.loseContext()
        teardown = null
      }
    }

    const stop = () => teardown?.()

    /* Only buttons on screen hold a context. Rendering a hidden button's
       highlight is invisible work, and WebGL contexts are a capped resource. */
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: '120px' },
    )
    io.observe(btn)

    return () => {
      io.disconnect()
      stop()
    }
  }, [reduced])

  if (reduced) return null

  return <span ref={hostRef} className="btn__fx" aria-hidden="true" />
}
