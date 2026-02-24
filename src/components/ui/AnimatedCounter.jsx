import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

const AnimatedCounter = ({ end, suffix = '', duration = 2, formatNumber = false }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isInView) {
      let start = 0
      const increment = end / (duration * 60)
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 1000 / 60)
      return () => clearInterval(timer)
    }
  }, [isInView, end, duration])

  const displayValue = formatNumber ? count.toLocaleString('en-US') : count
  return <span ref={ref}>{displayValue}{suffix}</span>
}

export default AnimatedCounter
