import { useState, useEffect, useRef } from 'react';

export type SoundType = 'rain' | 'fireplace' | 'wind' | 'cafe' | 'forest' | 'whitenoise' | 'none';

export function useFocusSounds() {
  const [activeSound, setActiveSound] = useState<SoundType>('none');
  const [volume, setVolume] = useState(60);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (activeSound === 'none') {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      return;
    }

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    const frequencies: Record<SoundType, number> = {
      rain: 200,
      fireplace: 150,
      wind: 100,
      cafe: 300,
      forest: 250,
      whitenoise: 0,
      none: 0,
    };

    if (activeSound === 'whitenoise') {
      const bufferSize = 4096;
      const noiseNode = audioContext.createScriptProcessor(bufferSize, 1, 1);
      noiseNode.onaudioprocess = (e) => {
        const output = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
      };
      noiseNode.connect(gainNode);
    } else {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequencies[activeSound], audioContext.currentTime);
      oscillator.connect(gainNode);
      oscillator.start();
      oscillatorRef.current = oscillator;
    }

    gainNode.gain.setValueAtTime(isMuted ? 0 : volume / 300, audioContext.currentTime);
    gainNode.connect(audioContext.destination);

    audioContextRef.current = audioContext;
    gainNodeRef.current = gainNode;

    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [activeSound]);

  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        isMuted ? 0 : volume / 300,
        audioContextRef.current.currentTime
      );
    }
  }, [volume, isMuted]);

  const toggleSound = (sound: SoundType) => {
    if (activeSound === sound) {
      setActiveSound('none');
    } else {
      setActiveSound(sound);
    }
  };

  return {
    activeSound,
    volume,
    isMuted,
    setVolume,
    setIsMuted,
    toggleSound,
  };
}
