import { useEffect, useRef } from 'react'
import { createViewer } from './render.js'

function PolyViewer({ model }) {
  const canvasRef = useRef(null)
  const viewerRef = useRef(null)

  useEffect(() => {
    const viewer = createViewer(canvasRef.current)
    viewerRef.current = viewer
    return () => {
      viewer.destroy()
      viewerRef.current = null
    }
  }, [])

  // Declared after the effect above so the viewer exists on first run.
  useEffect(() => {
    viewerRef.current?.setModel(model)
  }, [model])

  return <canvas ref={canvasRef} className="viewer-canvas" />
}

export default PolyViewer
