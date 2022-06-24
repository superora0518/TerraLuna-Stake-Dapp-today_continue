import { horizontalRuler } from '@libs/styled-neumorphism';
import styled from 'styled-components';

/**
 * Styled `<hr/>` tag
 */
export const HorizontalRuler = styled.hr`
  ${({ theme }) =>
    horizontalRuler({
      color: '#493c3c',
      intensity: theme.intensity,
    })};
`;
