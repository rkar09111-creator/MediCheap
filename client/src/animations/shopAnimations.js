export const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.46, ease: [0.4, 0, 0.2, 1] } 
  }
};

export const stagger = (delay = 0.06) => ({
  visible: { 
    transition: { staggerChildren: delay } 
  }
});

export const springScale = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 220, damping: 20 } 
  }
};

export const autocompleteAnim = {
  initial: { opacity: 0, y: -6, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.97 },
  transition: { duration: 0.17, ease: 'easeOut' }
};

export const filterChipAnim = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 350, damping: 25 } },
  exit: { opacity: 0, scale: 0, transition: { duration: 0.14 } }
};

export const collapseAnim = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1, transition: { duration: 0.28, ease: 'easeOut' } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.28, ease: 'easeIn' } }
};

export const drawerAnim = {
  initial: { x: '100%' },
  animate: { x: 0, transition: { type: 'spring', stiffness: 280, damping: 32 } },
  exit: { x: '100%', transition: { type: 'spring', stiffness: 280, damping: 32 } }
};

export const backdropAnim = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};
