import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: {damping: 200},
  });

  const opacity = interpolate(scale, [0, 1], [0, 1]);
  const scaleValue = interpolate(scale, [0, 1], [0.92, 1]);

  return (
    <div style={{width: '100%', height: '100%', position: 'relative'}}>
      <Background />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 80px',
          opacity,
          transform: `scale(${scaleValue})`,
        }}
      >
        {/* Accent line */}
        <div
          style={{
            width: 48,
            height: 3,
            backgroundColor: '#ffffff',
            marginBottom: 40,
            borderRadius: 2,
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: 72,
            fontWeight: 700,
            color: '#ffffff',
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            textAlign: 'center',
          }}
        >
          Você já jogou dinheiro em anúncio e não veio nenhum cliente?
        </p>
      </div>
    </div>
  );
};
