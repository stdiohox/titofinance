import { useEffect } from 'react'

// Standalone scroll-reveal for the landing pages. Any element tagged
// [data-reveal] starts at opacity 0 / y+32 and animates in on view.
export function useReveal() {
  useEffect(() => {
    const reveals = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.1 },
    )
    reveals.forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(32px)'
      el.style.transition = 'opacity 0.75s ease, transform 0.75s ease'
      observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])
}
