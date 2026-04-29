export const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.4,0,0.2,1] } }
}

export const fadeScale = {
  hidden:  { opacity: 0, scale: 0.90 },
  visible: { opacity: 1, scale: 1,
    transition: { duration: 0.45, ease: [0.4,0,0.2,1] } }
}

export const springPop = {
  hidden:  { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1,
    transition: { type:'spring', stiffness:220, damping:18 } }
}

export const stagger = (delay = 0.09) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: delay } }
})

export const slideUp = {
  hidden:  { y: '100%' },
  visible: { y: 0,
    transition: { type:'spring', stiffness:300, damping:32 } },
  exit:    { y: '100%',
    transition: { duration: 0.25, ease: [0.4,0,1,1] } }
}
