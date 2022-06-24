import { createMuiTheme } from '@material-ui/core/styles';
import type { DefaultTheme } from 'styled-components';
import { muiThemeBase } from '@libs/neumorphism-ui/themes/muiThemeBase';

export const darkTheme: DefaultTheme = {
  ...createMuiTheme({
    ...muiThemeBase,
    typography: {
        fontFamily:'SF UI Text',
        
        body1: {},
        body2: {},
        subtitle1: {},
        subtitle2: {},
    },
    palette: {
      type: 'dark',
    },

    overrides: {
      MuiTouchRipple: {
        root: {
          opacity: 0.15,
        },
      },
      MuiInputBase: {
        input: {
            fontWeight:800,
            fontFamily:'SF UI Text',
        },
      },
    },

  }),

  intensity: 0.45,

  backgroundColor: '#000000',
  sectionBackgroundColor: '#212121',
  highlightBackgroundColor: '#363c5f',
  hoverBackgroundColor: '#CEBFBF',

  textColor: '#ffffff',
  dimTextColor: '#CEC0C0',

  colors: {
    positive: '#F9D85E',
    negative: '#F9D85E',
    warning: '#ff9a63',
    primary: '#FBD85D',
    primaryDark: '#15cc93',
    secondary: '#FBD85D',
    secondaryDark: '#15cc93',
  },

  header: {
    backgroundColor: '#000000',
    textColor: '#4BDB4B',
  },

  messageBox: {
    borderColor: '#4BDB4B',
    backgroundColor: 'rgba(75, 219, 75, 0.1)',
    textColor: '#285e28',
    linkColor: '#4BDB4B',
  },

  chart: [
    '#4bdb4b',
    '#36a337',
    '#2d832d',
    '#246d25',
    '#174f1a',
    '#0e3311',
    '#101010',
  ],

  //errorTextColor: '#ac2b45',
  //positiveTextColor: '#15cc93',
  //pointColor: '#15cc93',

  label: {
    backgroundColor: '#493c3c',
    textColor: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },

  actionButton: {
    backgroundColor: '#493C3C',
    backgroundHoverColor: '#cbc0bf',
    textColor: '#ffffff',
    hoverTextColor: '#ffffff',
  },

  textButton: {
    textColor: '#ffffff',
  },

  borderButton: {
    borderColor: '#cbc0bf',
    borderHoverColor: '#cbc0bf',
    textColor: '#ffffff',
    hoverTextColor: '#ffffff',
  },

  selector: {
    backgroundColor: '#493B3B',
    textColor: '#ffffff',
  },

  formControl: {
    labelColor: 'rgba(255, 255, 255, 0.5)',
    labelFocusedColor: '#CBC0BF',
    labelErrorColor: '#ac2b45',
  },

  textInput: {
    backgroundColor: '#493C3C',
    textColor: '#ffffff',
  },

  table: {
    head: {
      textColor: 'rgba(255, 255, 255, 0.5)',
    },
    body: {
      textColor: '#ffffff',
    },
  },

  slider: {
    thumb: {
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      thumbColor: '#F9D85E',
    },
  },

  skeleton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    lightColor: 'rgba(255, 255, 255, 0.2)',
  },

  dialog: {
    normal: {
      backgroundColor: '#212121',
      textColor: '#ffffff',
    },
    warning: {
      backgroundColor: '#1f2237',
      textColor: '#d69f34',
    },
    error: {
      backgroundColor: '#1f2237',
      textColor: '#ac2b45',
    },
    success: {
      backgroundColor: '#1f2237',
      textColor: '#3e9bba',
    },
  },

  tooltip: {
    normal: {
      backgroundColor: '#C4C4C4',
      textColor: '#493C3C',
    },
    warning: {
      backgroundColor: '#d69f34',
      textColor: '#ffffff',
    },
    error: {
      backgroundColor: '#ac2b45',
      textColor: '#ffffff',
    },
    success: {
      backgroundColor: '#3e9bba',
      textColor: '#ffffff',
    },
  },

  snackbar: {
    normal: {
      backgroundColor: '#221B1B',
      textColor: '#ffffff',
    },
    warning: {
      backgroundColor: '#d69f34',
      textColor: '#ffffff',
    },
    error: {
      backgroundColor: '#ac2b45',
      textColor: '#ffffff',
    },
    success: {
      backgroundColor: '#3e9bba',
      textColor: '#ffffff',
    },
  },
};
