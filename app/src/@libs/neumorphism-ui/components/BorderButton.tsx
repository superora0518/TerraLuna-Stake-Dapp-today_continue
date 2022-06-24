import { ButtonBase } from '@material-ui/core';
import styled from 'styled-components';
import { buttonBaseStyle } from './ActionButton';

/**
 * Styled component of the `<ButtonBase />` of the Material-UI
 *
 * @see https://material-ui.com/api/button-base/
 */
export const BorderButton = styled(ButtonBase).attrs({ disableRipple: true })`
  ${buttonBaseStyle};

  font-weight:860;
  color: #CEBFBF;
  border: 1px solid #CEBFBF;

  &:hover {
   border: 1px solid #CEBFBF;
    background-color: ${({ theme }) => theme.hoverBackgroundColor};
    color: ${({ theme }) => theme.borderButton.hoverTextColor};
  }

  &:disabled {
    opacity: 0.3;
  }
`;
