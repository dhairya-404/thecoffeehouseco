import { useState, useRef, useEffect, useCallback } from 'react';

export const useAudioAmbience = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  const initAudio = useCallback(() => {
    if (!audioElementRef.current) {
      const audio = new Audio('/assets/audio/ambience.mp3');
      audio.loop = true;
      audio.volume = 0;
      audio.preload = 'auto';

      audio.addEventListener('error', (e) => {
        console.warn('Ambience audio failed to load:', e);
      });

      audioElementRef.current = audio;
    }
    return audioElementRef.current;
  }, []);

  const fadeIn = useCallback((targetVol: number) => {
    const audio = audioElementRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    let currentVol = audio.volume;
    const step = 0.05;
    const intervalTime = 40;

    fadeIntervalRef.current = window.setInterval(() => {
      if (currentVol < targetVol) {
        currentVol = Math.min(targetVol, currentVol + step);
        audio.volume = currentVol;
      } else {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      }
    }, intervalTime);
  }, []);

  const fadeOut = useCallback((callback?: () => void) => {
    const audio = audioElementRef.current;
    if (!audio) {
      if (callback) callback();
      return;
    }

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    let currentVol = audio.volume;
    const step = 0.05;
    const intervalTime = 30;

    fadeIntervalRef.current = window.setInterval(() => {
      if (currentVol > 0.01) {
        currentVol = Math.max(0, currentVol - step);
        audio.volume = currentVol;
      } else {
        audio.volume = 0;
        audio.pause();
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        if (callback) callback();
      }
    }, intervalTime);
  }, []);

  const startAudio = useCallback(() => {
    try {
      const audio = initAudio();
      audio.play().then(() => {
        setIsPlaying(true);
        fadeIn(volume);
      }).catch((err) => {
        console.warn('Autoplay prevented or audio error:', err);
      });
    } catch (err) {
      console.warn('Audio play error:', err);
    }
  }, [initAudio, fadeIn, volume]);

  const stopAudio = useCallback(() => {
    fadeOut(() => {
      setIsPlaying(false);
    });
  }, [fadeOut]);

  const toggleAudio = useCallback(() => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  }, [isPlaying, startAudio, stopAudio]);

  useEffect(() => {
    if (audioElementRef.current && isPlaying) {
      audioElementRef.current.volume = volume;
    }
  }, [volume, isPlaying]);

  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
    };
  }, []);

  return { isPlaying, toggleAudio, volume, setVolume };
};
