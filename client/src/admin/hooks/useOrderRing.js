import { useRef, useCallback } from 'react';

/**
 * useOrderRing — Web Audio API synthetic ring tone.
 * No external audio file needed. Generates a "ding-dong" style alert.
 * Loops continuously until stopRing() is called.
 */
const useOrderRing = () => {
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);
  const isRingingRef = useRef(false);

  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  /**
   * Plays a single "ding" tone using Web Audio API.
   * @param {number} frequency - Hz
   * @param {number} startTime - seconds from now
   * @param {number} duration - seconds
   */
  const playTone = (frequency, startTime, duration) => {
    const ctx = getAudioCtx();
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + startTime);

    // Envelope: quick attack, smooth release
    gainNode.gain.setValueAtTime(0, ctx.currentTime + startTime);
    gainNode.gain.linearRampToValueAtTime(0.6, ctx.currentTime + startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

    oscillator.start(ctx.currentTime + startTime);
    oscillator.stop(ctx.currentTime + startTime + duration + 0.1);
  };

  /**
   * Plays a 2-tone "ding dong" alert.
   */
  const playAlert = useCallback(() => {
    try {
      // High ding
      playTone(880, 0, 0.4);
      // Low dong
      playTone(660, 0.5, 0.6);
    } catch (e) {
      console.warn('Audio play failed:', e);
    }
  }, []);

  /**
   * Start ringing — plays the alert every 2.5 seconds.
   */
  const startRing = useCallback(() => {
    if (isRingingRef.current) return;
    isRingingRef.current = true;

    // Play immediately on first call
    playAlert();

    // Then repeat
    intervalRef.current = setInterval(() => {
      if (isRingingRef.current) {
        playAlert();
      }
    }, 2500);
  }, [playAlert]);

  /**
   * Stop ringing immediately.
   */
  const stopRing = useCallback(() => {
    isRingingRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return { startRing, stopRing };
};

export default useOrderRing;
