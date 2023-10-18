import React from 'react';
import { EffectComposer, SSR } from '@react-three/postprocessing';

export function Effects() {
  return (
    <EffectComposer disableNormalPass>
      <SSR />
    </EffectComposer>
  );
}
