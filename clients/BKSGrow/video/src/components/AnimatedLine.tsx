import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

type Props = {
  text: string;
  delay?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number | string;
  align?: React.CSSProperties['textAlign'];
};

export const AnimatedLine: React.FC<Props> = ({
  text,
  delay = 0,
  fontSize = 52,
  color = '#ffffff',
  fontWeight = 400,
  align = 'left',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: {damping: 200},
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const translateY = interpolate(entrance, [0, 1], [24, 0]);

  return (
    <p
      style={{
        margin: '0 0 8px 0',
        padding: 0,
        fontSize,
        fontWeight,
        color,
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        lineHeight: 1.25,
        letterSpacing: '-0.02em',
        textAlign: align,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {text}
    </p>
  );
};
