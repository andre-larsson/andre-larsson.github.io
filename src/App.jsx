import './App.css'

const projects = [
  {
    href: 'https://andre-larsson.github.io/mandelbrot/',
    title: 'Mandelbrot',
    description: 'Interactive fractal explorer and demo.',
    type: 'Visualization',
    status: 'Stable',
  },
  {
    href: 'https://andre-larsson.github.io/interval-trainer/',
    title: 'Interval Trainer',
    description: 'Ear training for intervals in your browser.',
    type: 'Music Tool',
    status: 'Arcade',
  },
  {
    href: 'https://andre-larsson.github.io/quiz-system/',
    title: 'Quiz System',
    description: 'Modular quiz engine with JSON-based question files.',
    type: 'Framework',
    status: 'Customizable',
  },
  {
    href: 'https://andre-larsson.github.io/musicians-toolbox/',
    title: 'Musicians Toolbox',
    description: 'Browser metronome, tap tempo, tuner, and speaker check.',
    type: 'Utility Pack',
    status: 'Live',
  },
  {
    href: 'https://andre-larsson.github.io/json-object-arrayifier/',
    title: 'JSON Object Arrayifier',
    description: 'Convert whitespace-separated JSON objects into a valid array.',
    type: 'Data Tool',
    status: 'Fast',
  },
]

function App() {
  return (
    <main className="page">
      <div className="shell">
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">Project Index</p>
            <h1>Menu</h1>
            <p className="subtitle">Projects and experiments collected in one place.</p>
          </div>
        </section>

        <section className="menu-panel">
          <div className="menu-header">
            <span className="menu-kicker">Projects</span>
            <p>Select a project.</p>
          </div>

          <div className="links">
            {projects.map((project, index) => (
              <a key={project.href} className="link-item" href={project.href}>
                <span className="link-index">{String(index + 1).padStart(2, '0')}</span>
                <div className="link-copy">
                  <div className="link-title-row">
                    <strong>{project.title}</strong>
                    <span className="link-chip">{project.status}</span>
                  </div>
                  <span>{project.description}</span>
                </div>
                <div className="link-meta">{project.type}</div>
              </a>
            ))}
          </div>
        </section>
      </div>
      <div className="scanlines" aria-hidden="true" />
      <div className="orbs" aria-hidden="true">
        <span className="orb orb-a" />
        <span className="orb orb-b" />
        <span className="orb orb-c" />
      </div>
      <section className="footer-note">
        <p>Minimal launcher for standalone GitHub Pages projects.</p>
      </section>
    </main>
  )
}

export default App
