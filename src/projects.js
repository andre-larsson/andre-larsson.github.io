// The menu, in display order. To add a site, add one entry to the group it
// belongs in. An entry normally needs only its `slug` (its path on SITE);
// give it a full `href` instead when it lives somewhere else.

const SITE = 'https://a403.space'

const groups = [
  {
    title: 'Play',
    projects: [
      {
        slug: 'games',
        title: 'Games',
        description: 'Small browser games: the push-puzzle Menhir and the deckbuilder Brinelight.',
      },
    ],
  },
  {
    title: 'News',
    projects: [
      {
        slug: 'times',
        title: 'The 403 Times',
        description: 'A daily personal newspaper on AI, tech, PC gaming and game deals.',
      },
    ],
  },
  {
    title: 'Demos',
    projects: [
      {
        slug: 'sandpile',
        title: 'Sandpile',
        description: 'Drop sand, change the toppling rules, and watch patterns form.',
      },
      {
        slug: 'mandelbrot',
        title: 'Mandelbrot',
        description: 'Interactive fractal explorer and demo.',
      },
      {
        slug: 'relativity-visualizer',
        title: 'Relativity Visualizer',
        description: 'Interactive Lorentz boost explorer for Minkowski coordinates and invariants.',
      },
    ],
  },
  {
    title: 'Music',
    projects: [
      {
        slug: 'interval-trainer',
        title: 'Interval Trainer',
        description: 'Ear training for intervals in your browser.',
      },
      {
        slug: 'musicians-toolbox',
        title: 'Music Toolbox',
        description: 'Browser metronome, tap tempo, tuner, and speaker check.',
      },
    ],
  },
  {
    title: 'Tools',
    projects: [
      {
        slug: 'font-lab',
        title: 'Font Lab',
        description: 'Experiment with font stacks, uploaded fonts, and type settings.',
      },
      {
        slug: 'hsl-shade-lab',
        title: 'HSL Shade Lab',
        description: 'Generate HSL shade ranges and tune each color manually.',
      },
      {
        slug: 'json-object-arrayifier',
        title: 'JSON Object Arrayifier',
        description: 'Convert whitespace-separated JSON objects into a valid array.',
      },
      {
        slug: 'quiz-system',
        title: 'Quiz System',
        description: 'Modular quiz engine with JSON-based question files.',
      },
      {
        slug: 'tomtemacro',
        title: 'TomteMacro',
        description: 'Cross-platform auto-clicker and mouse/keyboard macro recorder written in Rust.',
      },
    ],
  },
]

// Every project with its address resolved, its group's name, and its position
// in the menu as a whole (numbering runs straight through the groups).
export const projects = groups.flatMap((group) =>
  group.projects.map((project) => ({
    ...project,
    href: project.href ?? `${SITE}/${project.slug}/`,
    group: group.title,
  })),
).map((project, index) => ({ ...project, index }))

export const sections = groups.map((group) => ({
  title: group.title,
  projects: projects.filter((project) => project.group === group.title),
}))
