import React, { useEffect, useState } from 'react';

export const NoiseCanvas: React.FC = () => {
  const [noiseUrl, setNoiseUrl] = useState<string>('');

  useEffect(() => {
    // Generate a static noise pattern on a small canvas once
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.createImageData(128, 128);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Grayscale noise values
      const val = Math.floor(Math.random() * 255);
      data[i] = val;     // Red
      data[i + 1] = val; // Green
      data[i + 2] = val; // Blue
      data[i + 3] = 10;  // Alpha (very subtle, approx 3.9% opacity)
    }

    ctx.putImageData(imgData, 0, 0);
    setNoiseUrl(canvas.toDataURL('image/png'));
  }, []);

  if (!noiseUrl) return null;

  return (
    <div
      className="noise-overlay"
      style={{
        backgroundImage: `url(${noiseUrl})`,
        backgroundRepeat: 'repeat',
      }}
      aria-hidden="true"
    />
  );
};
