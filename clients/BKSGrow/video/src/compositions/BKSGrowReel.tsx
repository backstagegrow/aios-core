import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {HookScene} from '../scenes/HookScene';
import {BodyScene} from '../scenes/BodyScene';
import {CTAScene} from '../scenes/CTAScene';

const HOOK_START  = 0;
const HOOK_DUR    = 90;   // 3s

const BODY_START  = 90;
const BODY_DUR    = 510;  // 17s

const CTA_START   = 600;
const CTA_DUR     = 240;  // 8s

export const REEL_DURATION = CTA_START + CTA_DUR; // 840 frames = 28s

const FADE = 15; // frames de fade in/out em cada cena

const FadeSequence: React.FC<{
  from: number;
  duration: number;
  children: React.ReactNode;
}> = ({from, duration, children}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - from;

  const opacity = interpolate(
    localFrame,
    [0, FADE, duration - FADE, duration],
    [0,    1,              1,        0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <Sequence from={from} durationInFrames={duration}>
      <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>
    </Sequence>
  );
};

export const BKSGrowReel: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#080808'}}>
      <FadeSequence from={HOOK_START} duration={HOOK_DUR}>
        <HookScene />
      </FadeSequence>
      <FadeSequence from={BODY_START} duration={BODY_DUR}>
        <BodyScene />
      </FadeSequence>
      <FadeSequence from={CTA_START} duration={CTA_DUR}>
        <CTAScene />
      </FadeSequence>
    </AbsoluteFill>
  );
};
