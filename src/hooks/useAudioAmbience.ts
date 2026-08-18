import { useState, useRef, useEffect, useCallback } from 'react';

export const useAudioAmbience = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<AudioNode[]>([]);

  const startAudio = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.2, ctx.currentTime);
      gainNodeRef.current = masterGain;

      // Layer 1: Warm Brown/Pink noise for cozy café room acoustic floor
      const bufferSize = ctx.sampleRate * 3;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // Lowpass filter for warm intimate acoustic ambiance
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(320, ctx.currentTime);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(masterGain);
      noiseSource.start();

      // Layer 2: Soft harmonic room drone (gentle warm A1 / 110Hz & E2 / 164.81Hz)
      const osc1 = ctx.createOscillator();
      const osc1Gain = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(110, ctx.currentTime);
      osc1Gain.gain.setValueAtTime(0.015, ctx.currentTime);

      const osc2 = ctx.createOscillator();
      const osc2Gain = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(164.81, ctx.currentTime);
      osc2Gain.gain.setValueAtTime(0.01, ctx.currentTime);

      // Slow LFO for subtle breathing modulation
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.15, ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.005, ctx.currentTime);
      lfo.connect(osc1Gain.gain);

      osc1.connect(osc1Gain);
      osc2.connect(osc2Gain);
      osc1Gain.connect(masterGain);
      osc2Gain.connect(masterGain);

      osc1.start();
      osc2.start();
      lfo.start();

      masterGain.connect(ctx.destination);
      sourcesRef.current = [noiseSource, osc1, osc2, lfo];
      setIsPlaying(true);
    } catch (e) {
      console.warn('AudioContext not allowed or supported', e);
    }
  }, [volume]);

  const stopAudio = useCallback(() => {
    if (audioCtxRef.current) {
      sourcesRef.current.forEach((src) => {
        try {
          if ('stop' in src && typeof (src as AudioScheduledSourceNode).stop === 'function') {
            (src as AudioScheduledSourceNode).stop();
          }
        } catch (_) {}
      });
      sourcesRef.current = [];
      audioCtxRef.current.close();
      audioCtxRef.current = null;
      setIsPlaying(false);
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  }, [isPlaying, startAudio, stopAudio]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(volume * 0.2, audioCtxRef.current.currentTime, 0.1);
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return { isPlaying, toggleAudio, volume, setVolume };
};
