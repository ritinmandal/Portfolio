import {
  siAxios,
  siBootstrap,
  siClaude,
  siCss,
  siCursor,
  siDotnet,
  siElementor,
  siFigma,
  siFramer,
  siFreepik,
  siGit,
  siGithub,
  siGooglegemini,
  siGsap,
  siHtml5,
  siJavascript,
  siMui,
  siMysql,
  siNextdotjs,
  siPostman,
  siReact,
  siReacthookform,
  siStripe,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siWoocommerce,
  siWordpress,
} from 'simple-icons'
import { Bot, Boxes, Database, Gauge, Globe, Image, Orbit, Palette, Plug, Smartphone, SquareCode, Webhook } from 'lucide-react'

// Skill name (as written in profile.js) → brand mark from simple-icons. Brands whose marks
// simple-icons no longer ships (VS Code, Photoshop, Canva, ChatGPT, SQL Server) and the
// concepts get a generic Lucide icon instead, never an imitation logo.
export const brands = {
  'React.js': siReact,
  React: siReact,
  'Next.js': siNextdotjs,
  'JavaScript (ES6+)': siJavascript,
  JavaScript: siJavascript,
  TypeScript: siTypescript,
  HTML5: siHtml5,
  CSS3: siCss,
  'Tailwind CSS': siTailwindcss,
  'Material UI': siMui,
  Bootstrap: siBootstrap,
  Supabase: siSupabase,
  Postman: siPostman,
  Stripe: siStripe,
  'Stripe Payment Gateway': siStripe,
  'React Hook Form': siReacthookform,
  Axios: siAxios,
  'Framer Motion': siFramer,
  GSAP: siGsap,
  Git: siGit,
  GitHub: siGithub,
  WordPress: siWordpress,
  WooCommerce: siWoocommerce,
  Elementor: siElementor,
  Figma: siFigma,
  Freepik: siFreepik,
  Claude: siClaude,
  Gemini: siGooglegemini,
  'Cursor AI': siCursor,
  MySQL: siMysql,
  '.NET': siDotnet,
}

export const generic = {
  'REST APIs': Webhook,
  'MS SQL Server': Database,
  'VS Code': SquareCode,
  Canva: Palette,
  Photoshop: Image,
  ChatGPT: Bot,
  Antigravity: Orbit,
  'Responsive Web Design': Smartphone,
  'Component-Based Architecture': Boxes,
  'API Integration': Plug,
  'Performance Optimization': Gauge,
  'Cross-Browser Compatibility': Globe,
}

// Near-black brand colours vanish on the ink background, so those fall back to paper.
const visible = (hex) => {
  const n = parseInt(hex, 16)
  const lum = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255
  return lum < 0.22 ? 'var(--color-paper)' : `#${hex}`
}

/** CSS colour of the brand behind a skill name (for hover tints), or undefined. */
export const brandColor = (name) => (brands[name] ? visible(brands[name].hex) : undefined)
