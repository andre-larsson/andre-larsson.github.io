import { useEffect, useRef } from 'react'
import { paintBackdrop } from './render.js'

// CSS pixels per backdrop pixel.
const PIXEL = 4

function Backdrop() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let frame = 0

    const paint = () => {
      frame = 0
      const width = Math.max(2, Math.ceil(window.innerWidth / PIXEL))
      const height = Math.max(2, Math.ceil(window.innerHeight / PIXEL))
      if (canvas.width === width && canvas.height === height) return
      canvas.width = width
      canvas.height = height
      paintBackdrop(ctx, width, height)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }

    canvas.width = 0
    paint()
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <canvas ref={canvasRef} className="backdrop" aria-hidden="true" />
}

export default Backdrop
