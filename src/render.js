// A tiny software renderer in the spirit of 32-bit console hardware:
// low internal resolution, vertices snapped to whole pixels, gouraud-shaded
// triangles sorted back to front (no z-buffer), and 15-bit colour with
// ordered dithering.

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]

// Quantise a float RGB buffer (0..255 per channel) to 5 bits per channel
// with a 4x4 ordered dither, writing the result into `image`.
function dither(rgb, image) {
  const { width, height, data } = image
  let i = 0
  let o = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const threshold = BAYER[((y & 3) << 2) | (x & 3)] / 2
      for (let c = 0; c < 3; c++) {
        let q = (rgb[i + c] + threshold) >> 3
        q = q < 0 ? 0 : q > 31 ? 31 : q
        data[o + c] = (q << 3) | (q >> 2)
      }
      data[o + 3] = 255
      i += 3
      o += 4
    }
  }
}

// A strip that fades a colour out from left to right through the same
// ordered dither, as a data URL for CSS backgrounds.
export function ditherFadeUrl([r, g, b], width = 96) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = 4
  const ctx = canvas.getContext('2d')
  const image = ctx.createImageData(width, 4)
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < width; x++) {
      const coverage = 1 - x / (width - 1)
      const o = (y * width + x) * 4
      image.data[o] = r
      image.data[o + 1] = g
      image.data[o + 2] = b
      image.data[o + 3] = BAYER[(y << 2) | (x & 3)] < coverage * 16 ? 255 : 0
    }
  }
  ctx.putImageData(image, 0, 0)
  return canvas.toDataURL('image/png')
}

const lerp = (a, b, t) => a + (b - a) * t
const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]

// ---------------------------------------------------------------------------
// Backdrop: one screen-sized gouraud quad, a colour at each corner.

const BACKDROP = {
  topLeft: [24, 40, 132],
  topRight: [10, 16, 66],
  bottomLeft: [6, 7, 26],
  bottomRight: [34, 12, 62],
}

export function paintBackdrop(ctx, width, height) {
  const image = ctx.createImageData(width, height)
  const rgb = new Float32Array(width * height * 3)
  let i = 0
  for (let y = 0; y < height; y++) {
    const v = height > 1 ? y / (height - 1) : 0
    const left = mix(BACKDROP.topLeft, BACKDROP.bottomLeft, v)
    const right = mix(BACKDROP.topRight, BACKDROP.bottomRight, v)
    for (let x = 0; x < width; x++) {
      const u = width > 1 ? x / (width - 1) : 0
      rgb[i++] = lerp(left[0], right[0], u)
      rgb[i++] = lerp(left[1], right[1], u)
      rgb[i++] = lerp(left[2], right[2], u)
    }
  }
  dither(rgb, image)
  ctx.putImageData(image, 0, 0)
}

// ---------------------------------------------------------------------------
// Meshes

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]

// Scale to unit radius and wind every face so its normal points away from
// `inside(centroid)` (the origin unless the shape says otherwise).
function finish(verts, faces, inside = () => [0, 0, 0]) {
  const radius = Math.max(...verts.map((v) => Math.hypot(v[0], v[1], v[2])))
  const scaled = verts.map((v) => v.map((n) => n / radius))
  const wound = faces.map(([a, b, c]) => {
    const normal = cross(sub(scaled[b], scaled[a]), sub(scaled[c], scaled[a]))
    const centroid = [0, 1, 2].map((k) => (scaled[a][k] + scaled[b][k] + scaled[c][k]) / 3)
    const scaledInside = inside(centroid.map((n) => n * radius)).map((n) => n / radius)
    return dot(normal, sub(centroid, scaledInside)) < 0 ? [a, c, b] : [a, b, c]
  })
  return { verts: scaled, faces: wound }
}

const quad = (a, b, c, d) => [[a, b, c], [a, c, d]]

function ring(count, radius, y, phase = 0) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + phase
    return [Math.cos(angle) * radius, y, Math.sin(angle) * radius]
  })
}

function icosahedron() {
  const t = (1 + Math.sqrt(5)) / 2
  const verts = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ]
  const faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ]
  return finish(verts, faces)
}

function cube() {
  const verts = Array.from({ length: 8 }, (_, i) => [i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1])
  const faces = [
    ...quad(1, 3, 7, 5), ...quad(0, 2, 6, 4),
    ...quad(2, 3, 7, 6), ...quad(0, 1, 5, 4),
    ...quad(4, 5, 7, 6), ...quad(0, 1, 3, 2),
  ]
  return finish(verts, faces)
}

function octahedron() {
  const verts = [...ring(4, 1, 0), [0, 1.25, 0], [0, -1.25, 0]]
  const faces = []
  for (let i = 0; i < 4; i++) {
    const next = (i + 1) % 4
    faces.push([i, next, 4], [next, i, 5])
  }
  return finish(verts, faces)
}

// A cut gem: flat table, sloped crown, long pavilion down to a point.
function gem() {
  const sides = 6
  const table = ring(sides, 0.55, 0.5)
  const girdle = ring(sides, 1, 0.12, Math.PI / sides)
  const verts = [...table, ...girdle, [0, 0.5, 0], [0, -1.1, 0]]
  const top = sides * 2
  const culet = top + 1
  const faces = []
  for (let i = 0; i < sides; i++) {
    const next = (i + 1) % sides
    faces.push([top, i, next])
    faces.push([i, sides + i, next], [i, sides + (i + sides - 1) % sides, sides + i])
    faces.push([sides + i, sides + next, culet])
  }
  return finish(verts, faces)
}

function torus() {
  const major = 0.7
  const minor = 0.32
  const around = 10
  const tube = 6
  const verts = []
  for (let i = 0; i < around; i++) {
    const theta = (i / around) * Math.PI * 2
    for (let j = 0; j < tube; j++) {
      const phi = (j / tube) * Math.PI * 2
      const r = major + minor * Math.cos(phi)
      verts.push([r * Math.cos(theta), minor * Math.sin(phi), r * Math.sin(theta)])
    }
  }
  const faces = []
  for (let i = 0; i < around; i++) {
    for (let j = 0; j < tube; j++) {
      const a = i * tube + j
      const b = ((i + 1) % around) * tube + j
      const c = ((i + 1) % around) * tube + ((j + 1) % tube)
      const d = i * tube + ((j + 1) % tube)
      faces.push(...quad(a, b, c, d))
    }
  }
  // "Inside" for a torus is the nearest point on the ring through the tube.
  const inside = ([x, , z]) => {
    const length = Math.hypot(x, z) || 1
    return [(x / length) * major, 0, (z / length) * major]
  }
  return finish(verts, faces, inside)
}

// An octahedron with a spike raised on every face.
function star() {
  const core = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].map((v) =>
    v.map((n) => n * 0.62),
  )
  const verts = [...core]
  const faces = []
  for (const x of [0, 1]) {
    for (const y of [2, 3]) {
      for (const z of [4, 5]) {
        const tip = [0, 1, 2].map((k) => (core[x][k] + core[y][k] + core[z][k]) * 0.93)
        const index = verts.push(tip) - 1
        faces.push([x, y, index], [y, z, index], [z, x, index])
      }
    }
  }
  return finish(verts, faces)
}

const TEAL = [52, 208, 170]
const RED = [240, 78, 104]
const SKY = [92, 152, 255]
const PINK = [232, 136, 216]
const GOLD = [255, 214, 70]
const VIOLET = [142, 108, 255]

const MESHES = [icosahedron(), gem(), torus(), cube(), star(), octahedron()]

// [top, bottom, side] vertex colours.
const PALETTES = [
  [TEAL, SKY, GOLD],
  [PINK, VIOLET, SKY],
  [GOLD, RED, PINK],
  [SKY, VIOLET, TEAL],
  [RED, PINK, GOLD],
]

function colourise(mesh, [top, bottom, side]) {
  const colours = mesh.verts.map(([x, y]) => mix(mix(bottom, top, (y + 1) / 2), side, (x + 1) / 4))
  return { ...mesh, colours }
}

// Six meshes against five palettes: thirty distinct models before any repeat.
function modelFor(index) {
  return colourise(MESHES[index % MESHES.length], PALETTES[index % PALETTES.length])
}

// ---------------------------------------------------------------------------
// Viewer

const CAMERA_DISTANCE = 3.2
const FLOOR_Y = -1.3
const FLOOR_TILE = 0.9
const SKY_TOP = [5, 6, 24]
const HORIZON = [24, 36, 116]
const FLOOR_LIGHT = [50, 70, 184]
const FLOOR_DARK = [12, 18, 66]
const LIGHT = (() => {
  const v = [-0.45, 0.75, -0.5]
  const length = Math.hypot(...v)
  return v.map((n) => n / length)
})()
const FRAME_MS = 1000 / 30
const POP_SECONDS = 0.16

function fillTriangle(rgb, width, height, p0, p1, p2, c0, c1, c2) {
  const area = (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p2[0] - p0[0]) * (p1[1] - p0[1])
  if (area === 0) return
  const inverse = 1 / area
  const minX = Math.max(0, Math.min(p0[0], p1[0], p2[0]))
  const maxX = Math.min(width - 1, Math.max(p0[0], p1[0], p2[0]))
  const minY = Math.max(0, Math.min(p0[1], p1[1], p2[1]))
  const maxY = Math.min(height - 1, Math.max(p0[1], p1[1], p2[1]))
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const w0 = ((p1[0] - x) * (p2[1] - y) - (p2[0] - x) * (p1[1] - y)) * inverse
      const w1 = ((p2[0] - x) * (p0[1] - y) - (p0[0] - x) * (p2[1] - y)) * inverse
      const w2 = 1 - w0 - w1
      if (w0 < 0 || w1 < 0 || w2 < 0) continue
      const i = (y * width + x) * 3
      rgb[i] = w0 * c0[0] + w1 * c1[0] + w2 * c2[0]
      rgb[i + 1] = w0 * c0[1] + w1 * c1[1] + w2 * c2[1]
      rgb[i + 2] = w0 * c0[2] + w1 * c1[2] + w2 * c2[2]
    }
  }
}

function drawScene(rgb, width, height, model, spin, tilt, scale) {
  const focal = Math.min(width, height) * 0.33 * CAMERA_DISTANCE
  const centreX = width / 2
  const centreY = Math.round(height * 0.46)
  const cosSpin = Math.cos(spin)
  const sinSpin = Math.sin(spin)

  // Sky above the horizon, a fogged checker floor below it. The floor turns
  // with the model so the whole scene reads as a turntable.
  let i = 0
  for (let y = 0; y < height; y++) {
    const below = y - centreY
    const depth = below > 0 ? (-FLOOR_Y * focal) / below : 0
    const fog = below > 0 ? Math.max(0, 1 - depth / 9) ** 2 : 0
    const sky = mix(SKY_TOP, HORIZON, Math.min(1, y / centreY))
    for (let x = 0; x < width; x++) {
      let colour = sky
      if (below > 0) {
        const viewX = ((x - centreX) * depth) / focal
        const viewZ = depth - CAMERA_DISTANCE
        const floorX = viewX * cosSpin - viewZ * sinSpin
        const floorZ = viewX * sinSpin + viewZ * cosSpin
        const light = (Math.floor(floorX / FLOOR_TILE) + Math.floor(floorZ / FLOOR_TILE)) & 1
        colour = mix(HORIZON, light ? FLOOR_LIGHT : FLOOR_DARK, fog)
        // Blob shadow under the model.
        if (floorX * floorX + floorZ * floorZ < 0.7 * scale * scale) colour = mix(colour, [0, 0, 0], 0.5)
      }
      rgb[i++] = colour[0]
      rgb[i++] = colour[1]
      rgb[i++] = colour[2]
    }
  }

  const cosTilt = Math.cos(tilt)
  const sinTilt = Math.sin(tilt)
  const view = model.verts.map(([x, y, z]) => {
    const x1 = (x * cosSpin + z * sinSpin) * scale
    const z1 = (-x * sinSpin + z * cosSpin) * scale
    const y1 = y * scale
    return [x1, y1 * cosTilt - z1 * sinTilt, y1 * sinTilt + z1 * cosTilt]
  })
  // Snapping to whole pixels is what makes the polygons wobble as they turn.
  const screen = view.map(([x, y, z]) => {
    const depth = z + CAMERA_DISTANCE
    return [Math.round(centreX + (x * focal) / depth), Math.round(centreY - (y * focal) / depth)]
  })

  const visible = []
  for (const [a, b, c] of model.faces) {
    const normal = cross(sub(view[b], view[a]), sub(view[c], view[a]))
    const toCamera = [-view[a][0], -view[a][1], -CAMERA_DISTANCE - view[a][2]]
    if (dot(normal, toCamera) <= 0) continue
    const length = Math.hypot(...normal) || 1
    const shade = 0.48 + 0.6 * Math.max(0, dot(normal, LIGHT) / length)
    visible.push({ a, b, c, shade, depth: view[a][2] + view[b][2] + view[c][2] })
  }
  visible.sort((first, second) => second.depth - first.depth)

  for (const { a, b, c, shade } of visible) {
    fillTriangle(
      rgb, width, height,
      screen[a], screen[b], screen[c],
      model.colours[a].map((n) => n * shade),
      model.colours[b].map((n) => n * shade),
      model.colours[c].map((n) => n * shade),
    )
  }
}

// Drives a canvas: sizes its low-resolution buffer from its CSS box, animates
// at 30fps, and holds a still frame when the user prefers reduced motion.
export function createViewer(canvas) {
  const ctx = canvas.getContext('2d')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let model = modelFor(0)
  let width = 0
  let height = 0
  let image = null
  let rgb = null
  let frame = 0
  let lastPaint = -Infinity
  let poppedAt = -Infinity

  function fit() {
    const cssWidth = canvas.clientWidth
    const cssHeight = canvas.clientHeight
    if (!cssWidth || !cssHeight) return
    const pixel = cssWidth < 160 ? 2 : 3
    const nextWidth = Math.max(8, Math.round(cssWidth / pixel))
    const nextHeight = Math.max(8, Math.round(cssHeight / pixel))
    if (nextWidth === width && nextHeight === height) return
    width = nextWidth
    height = nextHeight
    canvas.width = width
    canvas.height = height
    image = ctx.createImageData(width, height)
    rgb = new Float32Array(width * height * 3)
  }

  function paint(now) {
    if (!image) return
    const seconds = now / 1000
    const still = reducedMotion.matches
    const spin = still ? 0.6 : seconds * 0.8
    const tilt = still ? 0.38 : 0.38 + Math.sin(seconds * 0.6) * 0.16
    const pop = still ? 1 : Math.min(1, (seconds - poppedAt) / POP_SECONDS)
    const scale = 0.72 + 0.28 * (1 - (1 - pop) ** 2)
    drawScene(rgb, width, height, model, spin, tilt, scale)
    dither(rgb, image)
    ctx.putImageData(image, 0, 0)
    lastPaint = now
  }

  function loop(now) {
    frame = requestAnimationFrame(loop)
    if (now - lastPaint >= FRAME_MS - 1) paint(now)
  }

  function restart() {
    cancelAnimationFrame(frame)
    frame = 0
    if (reducedMotion.matches) paint(performance.now())
    else frame = requestAnimationFrame(loop)
  }

  const observer = new ResizeObserver(() => {
    fit()
    if (reducedMotion.matches) paint(performance.now())
  })
  observer.observe(canvas)
  reducedMotion.addEventListener('change', restart)
  fit()
  restart()

  return {
    setModel(index) {
      model = modelFor(index)
      poppedAt = performance.now() / 1000
      if (reducedMotion.matches) paint(performance.now())
    },
    destroy() {
      cancelAnimationFrame(frame)
      observer.disconnect()
      reducedMotion.removeEventListener('change', restart)
    },
  }
}
