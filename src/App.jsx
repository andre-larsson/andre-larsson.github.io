import './App.css'

function App() {
  return (
    <main className="page">
      <h1>André Larsson</h1>
      <p>Projects and experiments.</p>
      <section className="links">
        <div className="link-item">
          <a href="https://andre-larsson.github.io/mandelbrot/">Mandelbrot</a>
          <span>Interactive fractal explorer and demo.</span>
        </div>
        <div className="link-item">
          <a href="https://andre-larsson.github.io/interval-trainer/">Interval Trainer</a>
          <span>Öva gehör med intervallträning direkt i webbläsaren (på svenska 🇸🇪).</span>
        </div>
        <div className="link-item">
          <a href="https://andre-larsson.github.io/quiz-system/">Quiz System</a>
          <span>Modulärt quiz med frågor i enkla JSON-filer (på svenska 🇸🇪).</span>
        </div>
      </section>
    </main>
  )
}

export default App
