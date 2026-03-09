import './App.css'

function App() {
  return (
    <main className="page">
      <h1>André Larsson</h1>
      <p>Projects and experiments.</p>
      <section className="links">
        <div className="link-item">
          <a href="https://andre-larsson.github.io/mandelbrot/">Mandelbrot</a>
          <span>Interactive fractal explorer and demo (English 🇬🇧).</span>
        </div>
        <div className="link-item">
          <a href="https://andre-larsson.github.io/interval-trainer/">Interval Trainer</a>
          <span>Ear training for intervals in your browser (Swedish 🇸🇪 UI).</span>
        </div>
        <div className="link-item">
          <a href="https://andre-larsson.github.io/quiz-system/">Quiz System</a>
          <span>Modular quiz engine with JSON-based question files (Swedish 🇸🇪 UI).</span>
        </div>
      </section>
    </main>
  )
}

export default App
