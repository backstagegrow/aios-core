import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: {damping: 200},
  });

  const ctaEntrance = spring({
    frame: frame - 20,
    fps,
    config: {damping: 20, stiffness: 200},
  });

  const textOpacity = interpolate(entrance, [0, 1], [0, 1]);
  const textY = interpolate(entrance, [0, 1], [30, 0]);

  const ctaScale = interpolate(ctaEntrance, [0, 1], [0.85, 1]);
  const ctaOpacity = interpolate(ctaEntrance, [0, 1], [0, 1]);

  // Subtle pulse on the CTA pill
  const pulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 1.2),
    [-1, 1],
    [0.96, 1.0]
  );

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
          gap: 40,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 60,
            fontWeight: 700,
            color: '#ffffff',
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            lineHeight: 1.2,
            letterSpacing: '-0.03em',
            textAlign: 'center',
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
          }}
        >
          Clica no link.
        </p>

        {/* CTA pill */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `scale(${ctaScale * pulse})`,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 100,
              paddingTop: 24,
              paddingBottom: 24,
              paddingLeft: 64,
              paddingRight: 64,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 44,
                fontWeight: 700,
                color: '#080808',
                fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                letterSpacing: '-0.02em',
                textAlign: 'center',
              }}
            >
              Primeira análise é gratuita
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
