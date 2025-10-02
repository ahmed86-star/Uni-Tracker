import { useState, useEffect, useRef } from 'react';

export type SoundType = 'rain' | 'brownnoise' | 'ocean' | 'whitenoise' | 'pinknoise' | 'none';

// Generate ambient sounds using Web Audio API
class AmbientSoundGenerator {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;

  async start(type: Exclude<SoundType, 'none'>, volume: number) {
    this.stop();
    
    this.audioContext = new AudioContext();
    
    // Resume audio context (required for browsers' autoplay policy)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = volume / 100;
    this.gainNode.connect(this.audioContext.destination);

    switch (type) {
      case 'rain':
        this.generateRainSound();
        break;
      case 'brownnoise':
        this.generateBrownNoise();
        break;
      case 'ocean':
        this.generateOceanWaves();
        break;
      case 'whitenoise':
        this.generateWhiteNoise();
        break;
      case 'pinknoise':
        this.generatePinkNoise();
        break;
    }
  }

  private generateRainSound() {
    if (!this.audioContext || !this.gainNode) return;
    
    // Rain is essentially filtered white noise with some randomness
    const bufferSize = this.audioContext.sampleRate * 2;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    this.noiseNode = this.audioContext.createBufferSource();
    this.noiseNode.buffer = buffer;
    this.noiseNode.loop = true;
    
    this.filterNode = this.audioContext.createBiquadFilter();
    this.filterNode.type = 'bandpass';
    this.filterNode.frequency.value = 1000;
    this.filterNode.Q.value = 0.5;
    
    this.noiseNode.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    this.noiseNode.start();
  }

  private generateBrownNoise() {
    if (!this.audioContext || !this.gainNode) return;
    
    const bufferSize = this.audioContext.sampleRate * 2;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }
    
    this.noiseNode = this.audioContext.createBufferSource();
    this.noiseNode.buffer = buffer;
    this.noiseNode.loop = true;
    this.noiseNode.connect(this.gainNode);
    this.noiseNode.start();
  }

  private generateOceanWaves() {
    if (!this.audioContext || !this.gainNode) return;
    
    // Ocean waves: low frequency oscillation with filtered noise
    const bufferSize = this.audioContext.sampleRate * 4;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      const wave = Math.sin(i * 0.005) * Math.sin(i * 0.002);
      const noise = (Math.random() * 2 - 1) * 0.3;
      output[i] = wave + noise;
    }
    
    this.noiseNode = this.audioContext.createBufferSource();
    this.noiseNode.buffer = buffer;
    this.noiseNode.loop = true;
    
    this.filterNode = this.audioContext.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.value = 500;
    
    this.noiseNode.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    this.noiseNode.start();
  }

  private generateWhiteNoise() {
    if (!this.audioContext || !this.gainNode) return;
    
    const bufferSize = this.audioContext.sampleRate * 2;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    this.noiseNode = this.audioContext.createBufferSource();
    this.noiseNode.buffer = buffer;
    this.noiseNode.loop = true;
    this.noiseNode.connect(this.gainNode);
    this.noiseNode.start();
  }

  private generatePinkNoise() {
    if (!this.audioContext || !this.gainNode) return;
    
    const bufferSize = this.audioContext.sampleRate * 2;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }
    
    this.noiseNode = this.audioContext.createBufferSource();
    this.noiseNode.buffer = buffer;
    this.noiseNode.loop = true;
    this.noiseNode.connect(this.gainNode);
    this.noiseNode.start();
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = volume / 100;
    }
  }

  stop() {
    if (this.noiseNode) {
      this.noiseNode.stop();
      this.noiseNode.disconnect();
      this.noiseNode = null;
    }
    
    this.oscillators.forEach(osc => {
      osc.stop();
      osc.disconnect();
    });
    this.oscillators = [];
    
    if (this.filterNode) {
      this.filterNode.disconnect();
      this.filterNode = null;
    }
    
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export function useFocusSounds() {
  const [activeSound, setActiveSound] = useState<SoundType>('none');
  const [volume, setVolume] = useState(60);
  const [isMuted, setIsMuted] = useState(false);
  const soundGenerator = useRef<AmbientSoundGenerator>(new AmbientSoundGenerator());

  useEffect(() => {
    if (activeSound === 'none') {
      soundGenerator.current.stop();
      return;
    }

    const effectiveVolume = isMuted ? 0 : volume;
    soundGenerator.current.start(activeSound, effectiveVolume);

    return () => {
      soundGenerator.current.stop();
    };
  }, [activeSound]);

  useEffect(() => {
    const effectiveVolume = isMuted ? 0 : volume;
    soundGenerator.current.setVolume(effectiveVolume);
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
