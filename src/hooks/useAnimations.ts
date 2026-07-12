import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

export const useAnimations = () => {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {

      // Heading char reveals
      document.querySelectorAll('h1, h2').forEach((el) => {
        const split = new SplitType(el as HTMLElement, { types: 'chars' })
        gsap.from(split.chars, {
          y: '110%',
          opacity: 0,
          stagger: 0.018,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        })
      })

      // Fade reveals
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el as Element, {
          y: 32,
          opacity: 0,
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el as Element,
            start: 'top 90%',
            once: true,
          },
        })
      })

      // Card stagger
      gsap.utils.toArray('[data-cards]').forEach((group) => {
        const cards = (group as Element).querySelectorAll('[data-card]')
        gsap.from(cards, {
          y: 40,
          opacity: 0,
          stagger: 0.09,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: group as Element,
            start: 'top 85%',
            once: true,
          },
        })
      })

      // Stat count-ups
      gsap.utils.toArray('[data-count]').forEach((el) => {
        const element = el as HTMLElement
        const target = parseFloat(element.dataset.count || '0')
        const prefix = element.dataset.prefix || ''
        const suffix = element.dataset.suffix || ''
        const counter = { val: 0 }
        gsap.to(counter, {
          val: target,
          duration: 1.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            element.textContent = `${prefix}${Math.round(counter.val).toLocaleString()}${suffix}`
          },
        })
      })

      // Gold line draws
      gsap.utils.toArray('[data-line]').forEach((el) => {
        gsap.from(el as Element, {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el as Element,
            start: 'top 92%',
            once: true,
          },
        })
      })

      // Nav scroll behavior
      ScrollTrigger.create({
        start: 80,
        onEnter: () => document.getElementById('main-nav')?.classList.add('nav-scrolled'),
        onLeaveBack: () => document.getElementById('main-nav')?.classList.remove('nav-scrolled'),
      })

    })

    return () => ctx.revert()
  }, [])
}
