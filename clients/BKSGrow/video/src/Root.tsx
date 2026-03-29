import React from 'react';
import {Composition} from 'remotion';
import {BKSGrowReel, REEL_DURATION} from './compositions/BKSGrowReel';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="BKSGrowReel"
      component={BKSGrowReel}
      durationInFrames={REEL_DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
