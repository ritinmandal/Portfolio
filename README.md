# Ritin Kumar Mandal · Portfolio

Single-page portfolio built with React 19, Vite, Tailwind CSS v4, GSAP (ScrollTrigger + SplitText) and Lenis.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the build
npm run lint
```

## Content

All personal content lives in [`src/data/profile.js`](src/data/profile.js) and comes from
`Ritin_Resume_2026_Updated.pdf` in the parent folder. Update that file (not the components) when
the resume changes. Do not add companies, dates, numbers or projects that are not in the resume.

Project previews in `src/assets/projects/` are screenshots of the live demos (1600 and 800px WebP).
Groove Music Player uses a designed cover (`GrooveCover` in `Projects.jsx`) because its live demo
showed a data-loading error when captured; swap in a screenshot once it loads.

## Structure

```
src/
  App.jsx                 page composition, preloader gating, Lenis provider
  data/profile.js         all copy and links
  lib/gsap.js             plugin registration, shared media queries
  hooks/
    useLenis.js           Lenis on the GSAP ticker + scrollTo helper
    useActiveSection.js   nav active-section tracking
    useMagnetic.js        magnetic hover
    useLocalTime.js       live Kolkata clock
  components/
    Preloader, Navbar, Hero (+ DotField canvas), About, Skills, Experience,
    Education, Projects, Contact, Footer, CustomCursor, Grain
    ui/                   Button, Magnetic, RollText, SectionHeader, BrandIcons
  styles/index.css        Tailwind theme tokens + effects that need plain CSS
```

## Motion

Each section has its own motion:

- **Preloader:** counter and drawing ring, scrambled labels, then a six-column shutter (ink, then accent) rising from the centre.
- **Hero:** letters rise from masks over the cursor-reactive dot field; layers drift with the pointer at different depths; the name's letters swell in weight near the cursor (variable font); on scroll every letter tears off into 3D space.
- **Manifesto** (new, after the hero): pinned kinetic type. "Scalable." flips in, "Responsive." grows out of the floor on an accent disc that floods the screen, "High-performance." flies in from in front of the camera as an ink disc closes back.
- **About:** a giant title line drifts across, words rise and brighten on scroll, the badge spins faster with scroll speed, facts count up.
- **Skills:** pinned horizontal track on desktop; panels swing in on their Y axis, giant outline numbers parallax behind them, titles flip up letter by letter.
- **Experience:** cards tip in from 3D, role titles decode, a glowing comet rides the timeline rail.
- **Education:** outlined years fill and glide sideways, languages flip up.
- **Ribbons** (new, before Work): two crossing tech-stack bands that loop, speed up and reverse with the scroll.
- **Work:** turns from ink to paper; previews enter in 3D perspective, tilt toward the cursor with a moving glare, and outline numbers drift behind each project.
- **Contact:** rises as an arch that flattens out, letters converge, an accent spotlight trails the cursor, the email scrambles on hover, a text ring spins round "Say hello".
- **Footer:** the giant name (Playfair Display 800, dark glass letters with a faint outline) rises letter by letter; an orange light follows the cursor over the footer and lights the letters it passes, and drifts across the name on its own when there is no cursor (`.glow-text` in `index.css`).
- **Site-wide:** big headings and previews skew with scroll velocity (`[data-skew]`, `hooks/useScrollFx.js`), section labels decode on entry, a right-edge rail shows progress and the current section.

Every animation is created inside `useGSAP` + `gsap.matchMedia()`, so it is reverted on unmount
and skipped under `prefers-reduced-motion` (no preloader, no Lenis, everything static and
visible; the Manifesto becomes a plain list). The horizontal Skills pin only runs at 1024px and
wider. Pointer effects (depth, tilt, weight swell, spotlight, custom cursor) run on fine pointers only.

`ScrollTrigger.refresh()` after the preloader runs on the next frame on purpose: called inside the
preloader's GSAP context, it recorded every scroll tween into that context, and unmounting the
preloader then wiped their styles.
