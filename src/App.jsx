import { useEffect, useRef, useState } from 'react'
import './App.css'
import Backdrop from './Backdrop.jsx'
import PolyViewer from './PolyViewer.jsx'
import { projects, sections } from './projects.js'

const number = (index) => String(index + 1).padStart(2, '0')
const address = (href) => href.replace(/^https?:\/\//, '').replace(/\/$/, '')

function App() {
  const [selected, setSelected] = useState(0)
  const listRef = useRef(null)

  // Console-style input: the arrow keys move the cursor from anywhere on the
  // page, and Enter starts the highlighted title even before anything has
  // focus.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      const rows = Array.from(listRef.current.querySelectorAll('.entry'))
      const active = document.activeElement
      const idle = active === document.body
      const row = active.closest?.('.entry')
      if (!idle && !row) return
      const current = row ? rows.indexOf(row) : selected

      let next = null
      if (event.key === 'ArrowDown') next = (current + 1) % rows.length
      else if (event.key === 'ArrowUp') next = (current - 1 + rows.length) % rows.length
      else if (event.key === 'Home' && row) next = 0
      else if (event.key === 'End' && row) next = rows.length - 1
      else if (event.key === 'Enter' && idle) {
        window.location.assign(projects[selected].href)
        return
      }
      if (next === null) return
      event.preventDefault()
      rows[next].querySelector('.entry-link').focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selected])

  const current = projects[selected]

  return (
    <>
      <Backdrop />
      <main className="screen">
        <header className="masthead">
          <p className="eyebrow label">
            <span className="pips" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            Project Index
          </p>
          <h1>Main Menu</h1>
          <p className="subtitle">Projects and experiments collected in one place.</p>
        </header>

        <section className="menu panel" aria-labelledby="menu-title">
          <div className="panel-head label">
            <h2 id="menu-title">Select a title</h2>
            <span>{projects.length} titles</span>
          </div>

          <div className="entries" ref={listRef}>
            {sections.map((section, sectionIndex) => (
              <div
                key={section.title}
                className={section.title === current.group ? 'group is-current' : 'group'}
              >
                <h3 className="group-title label" id={`group-${sectionIndex}`}>{section.title}</h3>
                <ul className="group-list" role="list" aria-labelledby={`group-${sectionIndex}`}>
                  {section.projects.map((project) => (
                    <li
                      key={project.href}
                      className={project.index === selected ? 'entry is-selected' : 'entry'}
                      onMouseMove={() => setSelected(project.index)}
                      onFocus={() => setSelected(project.index)}
                    >
                      <span className="entry-cursor" aria-hidden="true" />
                      <span className="entry-index" aria-hidden="true">{number(project.index)}</span>
                      <a
                        className="entry-link"
                        href={project.href}
                        aria-describedby={`entry-desc-${project.index}`}
                      >
                        {project.title}
                      </a>
                      <p className="entry-desc" id={`entry-desc-${project.index}`}>{project.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Mirrors the highlighted row for sighted pointer and keyboard users;
            the same text is exposed to assistive tech through each row. */}
        <aside className="preview panel" aria-hidden="true">
          <div className="viewer">
            <PolyViewer model={selected} />
          </div>
          <div className="preview-info">
            <p className="preview-meta label">
              <span>{number(selected)}</span>
              <span>{current.group}</span>
            </p>
            <p className="preview-title">{current.title}</p>
            <p className="preview-desc">{current.description}</p>
            <p className="preview-address">{address(current.href)}</p>
          </div>
        </aside>

        <footer className="footer">
          <p className="hints">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd> Select
            </span>
            <span>
              <kbd>Enter</kbd> Start
            </span>
          </p>
          <p className="footer-note">Minimal launcher for standalone GitHub Pages projects.</p>
        </footer>
      </main>
    </>
  )
}

export default App
