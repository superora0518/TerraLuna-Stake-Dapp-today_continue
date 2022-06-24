import { horizontalDashedRuler } from '@libs/styled-neumorphism';
import React from 'react';
import styled from 'styled-components';

export interface HorizontalDashedRulerProps {
  className?: string;
  dash?: number;
  gap?: number;
}

function HorizontalDashedRulerBase({
  className,
  dash,
  gap,
}: HorizontalDashedRulerProps) {
  return <div className={className} data-dash={dash} data-gap={gap} />;
}

export const HorizontalDashedRuler = styled(HorizontalDashedRulerBase)`
  ${({ theme, dash, gap }) =>
    horizontalDashedRuler({
      color: '#493C3C',
      intensity: 1,
      dash: 2,
      gap: 3,
    })};
`;
