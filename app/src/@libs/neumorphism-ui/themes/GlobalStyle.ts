import { NeumorphismTheme } from './Theme';
import { createGlobalStyle, css } from 'styled-components';
function bodyStyleIfThemeExists(theme?: NeumorphismTheme): string {
  if (!theme) return '';

  const styles = [];

  if (theme?.backgroundColor) {
    styles.push(`background-color: ${theme.backgroundColor};`);
  }

  if (theme?.textColor) {
    styles.push(`color: ${theme.textColor};`);
  }

  return `body { ${styles.join('')} }`;
}

export const globalStyle = css`
  html,
  body {
    margin: 0;
  }


  ${({ theme }) => bodyStyleIfThemeExists(theme)};

  html {
      font-family:'SF UI Text';
    -moz-osx-font-smoothing: grayscale;
    letter-spacing: -0.06em !important;
    font-size: 16px;
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
      font-family:'SF UI Text';
    box-sizing: border-box;
    margin: 0;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }
`;

export const GlobalStyle = createGlobalStyle`
  ${globalStyle}
`;
