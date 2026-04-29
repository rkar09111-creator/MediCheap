export const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.48,
      ease: [0.4, 0, 0.2, 1] 
    } 
  }
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.35 } 
  }
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.42,
      ease: [0.34, 1.56, 0.64, 1] 
    } 
  }
};

export const springPop = {
  hidden:  { opacity: 0, scale: 0 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: 'spring',
      stiffness: 240, 
      damping: 20 
    } 
  }
};

export const slideRight = {
  hidden:  { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.42,
      ease: [0.4, 0, 0.2, 1] 
    } 
  }
};

export const stagger = (delay = 0.07) => ({
  visible: { transition: { staggerChildren: delay } }
});

export const gridExit = {
  opacity: 0, 
  scale: 0.96,
  transition: { duration: 0.14, ease: 'easeIn' }
};

export const gridEnter = {
  opacity: 1, 
  scale: 1,
  transition: { duration: 0.22, ease: 'easeOut' }
};
