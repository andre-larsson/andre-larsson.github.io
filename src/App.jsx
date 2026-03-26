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
          <span>Modular quiz engine with JSON-based question files (English 🇬🇧).</span>
        </div>
        <div className="link-item">
          <a href="https://andre-larsson.github.io/musicians-toolbox/">Musicians Toolbox</a>
          <span>Browser metronome, tap tempo, tuner, and speaker check (English 🇬🇧).</span>
        </div>
        <div className="link-item">
          <a href="https://andre-larsson.github.io/json-object-arrayifier/">JSON Object Arrayifier</a>
          <span>Convert whitespace-separated JSON objects into a valid array (English 🇬🇧).</span>
        </div>
      </section>
    </main>
  )
}

export default App
