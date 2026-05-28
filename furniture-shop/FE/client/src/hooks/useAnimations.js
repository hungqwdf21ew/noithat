import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Custom hook that observes an element and triggers visibility state
 * when it enters the viewport. Used for scroll-reveal animations.
 */
export function useScrollReveal(options = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = options
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, isVisible]
}

/**
 * Custom hook to animate a number counting up from 0 to target.
 */
export function useCountUp(target, duration = 2000, startOnVisible = false, isVisible = true) {
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (startOnVisible && !isVisible) return
    if (hasAnimated.current) return
    hasAnimated.current = true

    const startTime = performance.now()
    const numTarget = parseFloat(target)

    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(eased * numTarget)
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [target, duration, startOnVisible, isVisible])

  return count
}

/**
 * Custom hook for parallax scroll effect.
 */
export function useParallax(speed = 0.3) {
  const ref = useRef(null)
  const [offset, setOffset] = useState(0)

  const handleScroll = useCallback(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const elementCenter = rect.top + rect.height / 2
    const distFromCenter = elementCenter - windowHeight / 2
    setOffset(distFromCenter * speed)
  }, [speed])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return [ref, offset]
}
