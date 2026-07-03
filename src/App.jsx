import './App.css'

const projects = [
  {
    href: 'https://github.com/andre-larsson/tomtemacro',
    title: 'TomteMacro',
    description: 'Cross-platform auto-clicker and mouse/keyboard macro recorder written in Rust.',
    type: 'Desktop App',
    downloads: [
      { label: 'Linux', href: 'https://github.com/andre-larsson/tomtemacro/releases/latest/download/tomte-linux-x86_64.tar.gz' },
      { label: 'Windows', href: 'https://github.com/andre-larsson/tomtemacro/releases/latest/download/tomte-windows-x86_64.zip' },
      { label: 'macOS', href: 'https://github.com/andre-larsson/tomtemacro/releases/latest/download/tomte-macos-universal.tar.gz' },
    ],
  },
  {
    href: 'https://andre-larsson.github.io/font-lab/',
    title: 'Font Lab',
    description: 'Experiment with font stacks, uploaded fonts, and type settings.',
    type: 'Typography Tool',
  },
  {
    href: 'https://andre-larsson.github.io/hsl-shade-lab/',
    title: 'HSL Shade Lab',
    description: 'Generate HSL shade ranges and tune each color manually.',
    type: 'Color Tool',
  },
  {
    href: 'https://andre-larsson.github.io/relativity-visualizer/',
    title: 'Relativity Visualizer',
    description: 'Interactive Lorentz boost explorer for Minkowski coordinates and invariants.',
    type: 'Physics Demo',
  },
  {
    href: 'https://andre-larsson.github.io/mandelbrot/',
    title: 'Mandelbrot',
    description: 'Interactive fractal explorer and demo.',
    type: 'Visualization',
  },
  {
    href: 'https://andre-larsson.github.io/interval-trainer/',
    title: 'Interval Trainer',
    description: 'Ear training for intervals in your browser.',
    type: 'Music Tool',
  },
  {
    href: 'https://andre-larsson.github.io/quiz-system/',
    title: 'Quiz System',
    description: 'Modular quiz engine with JSON-based question files.',
    type: 'Framework',
  },
  {
    href: 'https://andre-larsson.github.io/musicians-toolbox/',
    title: 'Musicians Toolbox',
    description: 'Browser metronome, tap tempo, tuner, and speaker check.',
    type: 'Utility Pack',
  },
  {
    href: 'https://andre-larsson.github.io/json-object-arrayifier/',
    title: 'JSON Object Arrayifier',
    description: 'Convert whitespace-separated JSON objects into a valid array.',
    type: 'Data Tool',
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
            {projects.map((project, index) => {
              // Cards with download links render as a <div> because <a>
              // elements can't nest; the title carries the main link instead.
              const Card = project.downloads ? 'div' : 'a'
              return (
                <Card
                  key={project.href}
                  className={project.downloads ? 'link-item link-item-static' : 'link-item'}
                  href={project.downloads ? undefined : project.href}
                >
                  <span className="link-index">{String(index + 1).padStart(2, '0')}</span>
                  <div className="link-copy">
                    <div className="link-title-row">
                      <strong>
                        {project.downloads ? (
                          <a className="link-title-link" href={project.href}>{project.title}</a>
                        ) : (
                          project.title
                        )}
                      </strong>
                    </div>
                    <span>{project.description}</span>
                    {project.downloads && (
                      <div className="link-downloads">
                        {project.downloads.map((dl) => (
                          <a key={dl.href} className="link-download" href={dl.href}>{dl.label}</a>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="link-meta">{project.type}</div>
                </Card>
              )
            })}
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
