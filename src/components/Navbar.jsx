import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Download } from 'lucide-react'
import { gsap, MQ, ScrollTrigger, useGSAP } from '../lib/gsap'
import { navLinks, profile } from '../data/profile'
import { useActiveSection } from '../hooks/useActiveSection'
import { useLenis, useScrollTo } from '../hooks/useLenis'
import { useLocalTime } from '../hooks/useLocalTime'
import Magnetic from './ui/Magnetic'
import RollText from './ui/RollText'
import { GithubIcon, LinkedinIcon } from './ui/BrandIcons'

const ids = navLinks.map((l) => l.id)

export default function Navbar({ start }) {
  const nav = useRef(null)
  const menu = useRef(null)
  const burger = useRef(null)
  const menuTl = useRef(null)
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const active = useActiveSection(ids)
  const scrollTo = useScrollTo()
  const lenis = useLenis()
  const time = useLocalTime(profile.timeZone)

  // Entrance after the preloader, then hide on scroll down / show on scroll up.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.set('[data-nav-item]', { yPercent: -160 })
      })

      const bar = nav.current
      let hidden = false
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const y = self.scroll()
          bar.classList.toggle('is-scrolled', y > 40)
          const hide = !openRef.current && self.direction === 1 && y > 240
          if (hide !== hidden) {
            hidden = hide
            gsap.to(bar, { yPercent: hide ? -110 : 0, duration: 0.7, ease: 'expo.out', overwrite: true })
          }
        },
      })
      return () => mm.revert()
    },
    { scope: nav },
  )

  useGSAP(
    () => {
      if (!start) return
      gsap.to('[data-nav-item]', { yPercent: 0, stagger: 0.06, duration: 1.2, ease: 'expo.out', delay: 0.5 })
    },
    { scope: nav, dependencies: [start], revertOnUpdate: false },
  )

  // Mobile menu: circular reveal from the burger, links rise in.
  useGSAP(
    () => {
      menuTl.current = gsap
        .timeline({ paused: true, defaults: { ease: 'expo.inOut' } })
        .set(menu.current, { autoAlpha: 1 })
        .fromTo(
          menu.current,
          { clipPath: 'circle(0% at calc(100% - 44px) 40px)' },
          { clipPath: 'circle(150% at calc(100% - 44px) 40px)', duration: 1 },
        )
        .from('[data-menu-link]', { yPercent: 110, stagger: 0.05, duration: 0.9, ease: 'expo.out' }, 0.35)
        .from('[data-menu-foot]', { opacity: 0, y: 16, stagger: 0.06, duration: 0.6, ease: 'power2.out' }, 0.55)
    },
    { scope: menu },
  )

  useEffect(() => {
    openRef.current = open
    const tl = menuTl.current
    if (!tl) return
    if (open) {
      tl.timeScale(1).play()
      lenis?.stop()
      document.documentElement.style.overflow = 'hidden'
      gsap.to(nav.current, { yPercent: 0, duration: 0.5, overwrite: true })
      menu.current.querySelector('a')?.focus({ preventScroll: true })
    } else {
      tl.timeScale(1.6).reverse()
      lenis?.start()
      document.documentElement.style.overflow = ''
    }
  }, [open, lenis])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        burger.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id) => (e) => {
    e.preventDefault()
    if (openRef.current) {
      // release the scroll lock now; the effect that would do it runs after this click
      lenis?.start()
      document.documentElement.style.overflow = ''
      setOpen(false)
      requestAnimationFrame(() => scrollTo(id))
    } else {
      scrollTo(id)
    }
  }

  return (
    <>
      <header
        ref={nav}
        className={`group/nav fixed inset-x-0 top-0 z-[80] transition-colors duration-500 will-change-transform before:absolute before:inset-0 before:-z-10 before:bg-ink/90 before:opacity-0 before:transition-opacity before:duration-500 [&.is-scrolled]:before:opacity-100 ${
          open ? 'is-open text-ink before:!opacity-0' : 'text-paper'
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex items-center justify-between gap-6 px-5 py-4 md:px-10 md:py-5"
        >
          <div className="overflow-hidden">
            <a
              href="#top"
              data-nav-item
              onClick={go('top')}
              className="roll-host flex items-center gap-3"
              aria-label={`${profile.name}, back to top`}
            >
              <span className="relative grid size-10 place-items-center rounded-full border border-current/25">
                <span className="serif-i text-xl leading-none">r</span>
                <span className="absolute right-[9px] bottom-[11px] size-1.5 rounded-full bg-accent" />
              </span>
              <span className="hidden text-[0.95rem] font-medium tracking-tight sm:block">
                <RollText>{profile.name}</RollText>
              </span>
            </a>
          </div>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => {
              const isActive = active === l.id
              return (
                <li key={l.id} className="overflow-hidden">
                  <a
                    href={`#${l.id}`}
                    data-nav-item
                    onClick={go(l.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`roll-host relative flex items-center gap-2 px-3 py-2 text-[0.92rem] transition-colors duration-500 ${
                      isActive ? 'text-paper' : 'text-paper/55 hover:text-paper'
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full bg-accent transition-transform duration-500 ease-out-expo ${
                        isActive ? 'scale-100' : 'scale-0'
                      }`}
                      aria-hidden="true"
                    />
                    <RollText>{l.label}</RollText>
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-4">
            <div className="hidden overflow-hidden transition-opacity group-[.is-open]/nav:opacity-0 md:block lg:hidden xl:block">
              <span data-nav-item className="label flex items-center gap-2 text-paper/55">
                <span className="pulse-dot size-1.5 rounded-full bg-accent" aria-hidden="true" />
                Kolkata {time}
              </span>
            </div>
            <div className="hidden overflow-hidden p-1 transition-opacity group-[.is-open]/nav:pointer-events-none group-[.is-open]/nav:opacity-0 sm:block lg:hidden xl:block">
              <span data-nav-item className="block">
                <Magnetic strength={0.3}>
                  <a
                    href={profile.resume}
                    download={profile.resumeFile}
                    className="roll-host group flex items-center gap-2 rounded-full border border-current/25 py-2.5 pr-3 pl-5 text-[0.9rem] font-medium transition-colors duration-500 hover:border-accent hover:text-accent"
                  >
                    <RollText>Resume</RollText>
                    <Download size={16} className="transition-transform duration-500 group-hover:translate-y-0.5" aria-hidden="true" />
                  </a>
                </Magnetic>
              </span>
            </div>
            <div className="hidden overflow-hidden p-1 transition-opacity group-[.is-open]/nav:pointer-events-none group-[.is-open]/nav:opacity-0 sm:block">
              <span data-nav-item className="block">
                <Magnetic strength={0.3}>
                  <a
                    href="#contact"
                    onClick={go('contact')}
                    className="roll-host flex items-center gap-2 rounded-full bg-paper py-2.5 pr-3 pl-5 text-[0.9rem] font-medium whitespace-nowrap text-ink transition-colors duration-500 hover:bg-accent"
                  >
                    <RollText>Let&apos;s talk</RollText>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </Magnetic>
              </span>
            </div>
            <div className="overflow-hidden lg:hidden">
              <button
                ref={burger}
                type="button"
                data-nav-item
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="grid size-12 place-items-center rounded-full border border-current/25"
              >
                <span className="relative block h-3 w-5" aria-hidden="true">
                  <span
                    className={`absolute left-0 h-px w-full bg-current transition-all duration-500 ease-out-expo ${
                      open ? 'top-1.5 rotate-45' : 'top-0'
                    }`}
                  />
                  <span
                    className={`absolute left-0 h-px w-full bg-current transition-all duration-500 ease-out-expo ${
                      open ? 'top-1.5 -rotate-45' : 'top-3'
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div
        ref={menu}
        id="mobile-menu"
        inert={!open}
        className="invisible fixed inset-0 z-[79] flex flex-col justify-between bg-paper px-5 pt-28 pb-8 text-ink will-change-transform lg:hidden"
      >
        <ul className="flex flex-col">
          {navLinks.map((l, i) => (
            <li key={l.id} className="overflow-hidden border-b border-ink/10">
              <a
                href={`#${l.id}`}
                data-menu-link
                onClick={go(l.id)}
                className="flex items-baseline gap-4 py-2.5"
              >
                <span className="label text-ink/45">0{i + 1}</span>
                <span className="display text-[clamp(2.6rem,11vw,4.5rem)] font-medium">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div data-menu-foot className="flex flex-col items-start gap-3">
            <a
              href={profile.resume}
              download={profile.resumeFile}
              className="flex items-center gap-2 rounded-full bg-ink py-2.5 pr-4 pl-5 text-[0.95rem] font-medium text-paper"
            >
              Download resume
              <Download size={16} aria-hidden="true" />
            </a>
            <a href={`mailto:${profile.email}`} className="u-line text-base">
              {profile.email}
            </a>
          </div>
          <div data-menu-foot className="flex gap-3">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="grid size-11 place-items-center rounded-full border border-ink/20"
            >
              <LinkedinIcon size={17} />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="grid size-11 place-items-center rounded-full border border-ink/20"
            >
              <GithubIcon size={17} />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
