import React from 'react';
import {Background} from '../components/Background';
import {AnimatedLine} from '../components/AnimatedLine';

const STAGGER = 12; // frames between each line

const painLines = [
  {text: 'A maioria dos donos de negócio faz isso:', weight: 400, size: 46},
  {text: 'impulsiona post, gasta R$300,', weight: 300, size: 46},
  {text: 'aparece um ou dois curiosos.', weight: 300, size: 46},
];

const solutionLines = [
  {text: 'A BKSGrow faz diferente.', weight: 700, size: 54},
  {
    text: 'Gerenciamos seu tráfego como se fosse o nosso dinheiro.',
    weight: 400,
    size: 44,
  },
];

const pillars = [
  {text: '→ Campanha estratégica.', weight: 500, size: 46},
  {text: '→ Segmentação cirúrgica.', weight: 500, size: 46},
  {text: '→ Resultado real.', weight: 700, size: 46},
];

// Offset delays for solution block (after pain block settles)
const SOLUTION_OFFSET = painLines.length * STAGGER + 20;
const PILLARS_OFFSET = SOLUTION_OFFSET + solutionLines.length * STAGGER + 20;

export const BodyScene: React.FC = () => {
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
          padding: '0 80px',
          gap: 0,
        }}
      >
        {/* Pain block */}
        <div style={{marginBottom: 56}}>
          {painLines.map((line, i) => (
            <AnimatedLine
              key={i}
              text={line.text}
              delay={i * STAGGER}
              fontSize={line.size}
              fontWeight={line.weight}
              color={i === 0 ? '#ffffff' : '#aaaaaa'}
            />
          ))}
        </div>

        {/* Solution block */}
        <div style={{marginBottom: 48}}>
          {solutionLines.map((line, i) => (
            <AnimatedLine
              key={i}
              text={line.text}
              delay={SOLUTION_OFFSET + i * STAGGER}
              fontSize={line.size}
              fontWeight={line.weight}
              color='#ffffff'
            />
          ))}
        </div>

        {/* Pillars */}
        <div>
          {pillars.map((line, i) => (
            <AnimatedLine
              key={i}
              text={line.text}
              delay={PILLARS_OFFSET + i * STAGGER}
              fontSize={line.size}
              fontWeight={line.weight}
              color={i === pillars.length - 1 ? '#ffffff' : '#cccccc'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
