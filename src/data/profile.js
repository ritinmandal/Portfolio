// Single source of truth for the portfolio copy.
// Every fact here comes from Ritin_Resume_2026_Updated.pdf (project root). Do not add
// companies, dates, numbers or projects that are not in that document.

import abs800 from '../assets/projects/abs-800.webp'
import abs1600 from '../assets/projects/abs-1600.webp'
import gobongo800 from '../assets/projects/gobongo-800.webp'
import gobongo1600 from '../assets/projects/gobongo-1600.webp'
import hooqx800 from '../assets/projects/hooqx-800.webp'
import hooqx1600 from '../assets/projects/hooqx-1600.webp'
import petverse800 from '../assets/projects/petverse-800.webp'
import petverse1600 from '../assets/projects/petverse-1600.webp'

export const profile = {
  name: 'Ritin Kumar Mandal',
  firstName: 'Ritin',
  middleName: 'Kumar',
  lastName: 'Mandal',
  title: 'Frontend Developer',
  location: 'Barasat, Kolkata',
  country: 'India',
  timeZone: 'Asia/Kolkata',
  email: 'ritinmandal26@gmail.com',
  phone: '+91 79785 43313',
  phoneHref: 'tel:+917978543313',
  linkedin: 'https://www.linkedin.com/in/ritin-mandal/',
  linkedinLabel: 'linkedin.com/in/ritin-mandal',
  github: 'https://github.com/ritinmandal',
  githubLabel: 'github.com/ritinmandal',
  // Copy of Ritin_Resume_2026_Updated.pdf served from public/. Replace both when the resume changes.
  resume: '/Ritin-Kumar-Mandal-Resume.pdf',
  resumeFile: 'Ritin-Kumar-Mandal-Resume.pdf',

  // Hero line, condensed from the Profile paragraph.
  intro:
    'I build scalable, responsive and high-performance web applications with modern design, premium animation and highly interactive user experiences.',

  // Profile paragraph, split for the editorial About layout. `em` segments render in italic serif.
  statement: [
    { text: 'Frontend Developer with professional experience in building' },
    { text: 'scalable, responsive, and high-performance', em: true },
    { text: 'web applications across e-commerce, logistics, enterprise, and corporate domains. Proven expertise in delivering' },
    { text: '20+ production-ready websites', em: true },
    { text: 'featuring modern designs, premium animations, and highly interactive user experiences.' },
  ],
  summary: [
    'Skilled in developing reusable UI components, integrating backend technologies, and collaborating with cross-functional teams to build intuitive, visually engaging, and performance-optimized digital solutions.',
    'Passionate about writing clean, maintainable code and leveraging modern web technologies and AI-assisted development tools to create exceptional user experiences.',
  ],
  domains: ['E-commerce', 'Logistics', 'Enterprise', 'Corporate'],
}

// Pinned kinetic-type section after the hero. Words and notes are taken from the Profile
// paragraph and the Core Concepts / Frontend skills in the resume.
export const manifesto = [
  { word: 'Scalable.', note: 'Reusable UI components and component-based architecture.' },
  { word: 'Responsive.', note: 'Responsive web design and cross-browser compatibility.' },
  { word: 'High-performance.', note: 'Performance optimization, premium animations and highly interactive user experiences.' },
]

export const facts = [
  // 25+ and 20+ come from Ritin directly and replace the resume's 10+ (Nov 2026); update the PDF to match.
  { value: 25, suffix: '+', label: 'Projects completed' },
  { value: 20, suffix: '+', label: 'Production-ready websites delivered' },
  { value: 3, suffix: '', label: 'Professional roles since 2022' },
  { value: 4, suffix: '', label: 'Languages spoken' },
]

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
]

export const expertise = [
  {
    title: 'Frontend Development',
    short: 'Frontend',
    items: ['React.js', 'Next.js', 'JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Material UI', 'Bootstrap'],
  },
  {
    title: 'Backend & APIs',
    short: 'Backend',
    items: ['REST APIs', 'Supabase', 'MS SQL Server', 'Postman', 'Stripe Payment Gateway'],
  },
  {
    title: 'Libraries & Frameworks',
    short: 'Libraries',
    items: ['React Hook Form', 'Axios', 'Framer Motion', 'GSAP'],
  },
  {
    title: 'Version Control & Tools',
    short: 'Tools',
    items: ['Git', 'GitHub', 'VS Code'],
  },
  {
    title: 'Design & CMS',
    short: 'Design',
    items: ['WordPress', 'WooCommerce', 'Elementor', 'Figma', 'Canva', 'Freepik', 'Photoshop'],
  },
  {
    title: 'AI-Assisted Development',
    short: 'AI',
    items: ['ChatGPT', 'Claude', 'Gemini', 'Cursor AI', 'Antigravity'],
  },
  {
    title: 'Core Concepts',
    short: 'Concepts',
    items: [
      'Responsive Web Design',
      'Component-Based Architecture',
      'API Integration',
      'Performance Optimization',
      'Cross-Browser Compatibility',
    ],
  },
]

export const experience = [
  {
    company: 'Dynamics Hooqx Digital Private Ltd.',
    role: 'Frontend Developer',
    start: 'Dec 2025',
    end: 'Present',
    location: null,
    current: true,
    points: [
      'Developed and delivered 20+ production-ready websites using React.js, Next.js, JavaScript, Tailwind CSS, Material UI, and WordPress, building scalable, responsive, and visually engaging user interfaces.',
      'Collaborated with backend teams to develop enterprise applications including an HR Dashboard, Employee Attendance System, Admin Panels, and PDF Invoice Generation, while integrating REST APIs and testing endpoints using Postman.',
      'Developed and maintained WordPress websites using Elementor and WooCommerce, including the integration of a secure Stripe Payment Gateway for seamless online payment processing.',
    ],
    stack: ['React.js', 'Next.js', 'Tailwind CSS', 'Material UI', 'WordPress', 'WooCommerce', 'Stripe', 'REST APIs'],
  },
  {
    company: 'Webskitters Technology',
    role: 'Frontend Developer Intern',
    start: 'Oct 2025',
    end: 'Nov 2025',
    location: 'Kolkata, India',
    points: [
      'Completed a 2-month Frontend Development Internship, building responsive web applications using React.js, JavaScript, Tailwind CSS, and Material UI.',
      'Worked as a Frontend Lead alongside another developer, converting Figma designs into reusable React components while collaborating through Git and GitHub.',
    ],
    stack: ['React.js', 'JavaScript', 'Tailwind CSS', 'Material UI', 'Figma', 'Git'],
  },
  {
    company: 'ZINFI Software Systems Pvt. Ltd.',
    role: 'Software Engineer',
    start: 'Jul 2022',
    end: 'Aug 2023',
    location: 'Kolkata, India',
    points: [
      'Worked as a SQL Developer using Microsoft SQL Server and MySQL, developing stored procedures, views, and optimized database queries.',
      'Contributed to frontend bug fixes in .NET applications, improving UI functionality and overall application performance.',
    ],
    stack: ['MS SQL Server', 'MySQL', '.NET'],
  },
]

export const education = [
  {
    kind: 'Degree',
    title: 'Bachelor of Technology (B.Tech)',
    field: 'Computer Science & Engineering',
    school: 'Adamas University',
    location: null,
    from: '2018',
    to: '2022',
    period: 'Aug 2018 to Jun 2022',
    detail: null,
  },
  {
    kind: 'Course & Certification',
    title: 'Full Frontend Development Course',
    field: 'One-year intensive program',
    school: 'Webskitters Academy',
    location: 'Kolkata, India',
    from: '2024',
    to: '2025',
    period: 'Oct 2024 to Sep 2025',
    detail:
      'Completed a one-year intensive Frontend Development program with hands-on training in React.js, Next.js, JavaScript, TypeScript, Tailwind CSS, Material UI, REST APIs, Git/GitHub, and responsive web development.',
  },
]

export const softSkills = [
  'Team Collaboration',
  'Communication',
  'Problem Solving',
  'Leadership',
  'Time Management',
  'Adaptability',
  'Critical Thinking',
  'Attention to Detail',
  'Agile Development',
  'Quick Learner',
]

export const languages = ['English', 'Bengali', 'Hindi', 'Odia']

export const projects = [
  {
    name: 'Hooqx Technologies',
    category: 'Technology company',
    url: 'https://hooqx.com/',
    host: 'hooqx.com',
    tint: '#7c4dd8',
    points: [
      'Developed responsive pages for a technology solutions company specializing in web development, mobile applications, cloud solutions, and AI-powered systems.',
      'Implemented reusable UI components, modern layouts, and a performance-optimized frontend using React.js, Next.js, and Tailwind CSS.',
    ],
    stack: ['React.js', 'Next.js', 'Tailwind CSS'],
    image: { src: hooqx1600, srcSet: `${hooqx800} 800w, ${hooqx1600} 1600w` },
    alt: 'Graphics and brand design page of the Hooqx website: "Design That Speaks Before You Do" beside an illustration of a designer at a monitor.',
    focus: 'center',
  },
  {
    name: 'ABS Corporate Services',
    category: 'Corporate services website',
    url: null, // not live yet (abscsp.com has no site); the card shows "Launching soon" until a URL is added
    host: 'abscsp.com',
    tint: '#2dd4bf',
    points: [
      'Built a multi-page website for ABS Partners Corporate Services, a Dubai corporate services provider, covering business setup, corporate administration and compliance across five service pillars.',
      'Created a WebGL hero, pinned scroll scenes and a distinct GSAP animation for every section with Lenis smooth scrolling, tuned to stay smooth on low-end laptops.',
    ],
    stack: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
    image: { src: abs1600, srcSet: `${abs800} 800w, ${abs1600} 1600w` },
    alt: 'Homepage of the ABS Corporate Services website: "Where Your Business Vision Takes Shape." over the Dubai skyline at sunrise.',
    focus: 'center',
  },
  {
    name: 'GoBongo VC',
    category: 'Corporate website',
    url: 'https://gobongo.vc/',
    host: 'gobongo.vc',
    tint: '#6396e0', // sampled from the screenshot; colours the card glow
    points: [
      'Developed a modern, fully animated corporate website for a Delaware-headquartered holding group investing in e-commerce, logistics, technology, trade, and communications.',
      'Built responsive interfaces with smooth animations and optimized performance using Next.js, Tailwind CSS, GSAP, and Framer Motion.',
    ],
    stack: ['Next.js', 'Tailwind CSS', 'GSAP', 'Framer Motion'],
    image: { src: gobongo1600, srcSet: `${gobongo800} 800w, ${gobongo1600} 1600w` },
    alt: 'About section of the GoBongo VC website: "A Holding Group Built for Scale" beside an orbit of portfolio company logos.',
    focus: 'center', // object-position for the card crop (default top)
  },
  {
    name: 'PetVerse',
    category: 'Pet care platform',
    url: 'https://pet-verse-web-app-next-js.vercel.app/',
    host: 'pet-verse-web-app-next-js.vercel.app',
    tint: '#14b8c9',
    points: [
      'Built a modern pet care platform featuring pet adoption, pet services, veterinary support, and community engagement.',
      'Developed responsive user interfaces using Next.js, Tailwind CSS, and reusable React components with an optimized user experience.',
    ],
    stack: ['Next.js', 'Tailwind CSS', 'React'],
    image: { src: petverse1600, srcSet: `${petverse800} 800w, ${petverse1600} 1600w` },
    alt: 'Homepage of the PetVerse web app: "Welcome to Petverse" over a photo of a woman hugging her dog.',
  },
  {
    name: 'Groove Music Player',
    category: 'Music streaming app',
    url: 'https://groove-music-player-next-js.vercel.app/',
    host: 'groove-music-player-next-js.vercel.app',
    tint: '#1ed760',
    points: [
      'Developed a modern music streaming web application with playlists, album browsing, artist pages, and an interactive audio player.',
      'Built a responsive UI with smooth animations and reusable components using Next.js, Tailwind CSS, and modern frontend practices.',
    ],
    stack: ['Next.js', 'Tailwind CSS'],
    image: null, // typographic cover, see GrooveCover
    alt: 'Groove Music Player cover artwork',
  },
]
