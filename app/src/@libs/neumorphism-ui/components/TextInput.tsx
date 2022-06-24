import { softPressed } from '@libs/styled-neumorphism';
import { TextField, TextFieldProps } from '@material-ui/core';
import { ComponentType } from 'react';
import styled from 'styled-components';

/**
 * Styled component of the `<TextField/>` of the Material-UI
 *
 * @see https://material-ui.com/api/text-field/
 */
export const TextInput: ComponentType<TextFieldProps> = styled(TextField)`
  border-radius: 15px;
    background-color: #493C3C;

  .MuiFormLabel-root {
    opacity: 1;
    color: ${({ theme }) => theme.formControl.labelColor};
  }

  .MuiFormLabel-root.Mui-focused {
    opacity: 1;
    color: ${({ theme }) => theme.formControl.labelFocusedColor};
  }

  .MuiFormLabel-root.Mui-error {
    color: ${({ theme }) => theme.formControl.labelErrorColor};
  }

  .MuiInputLabel-formControl {
    transform: translate(24px, 16px) scale(1);
    font-weight: 860;
  }

  .MuiInputLabel-shrink {
    transform: translate(20px ,5px) scale(0.5);
  }

  .MuiInputLabel-shrink + .MuiInputBase-root {
    .MuiInputBase-input {
      transform: translateY(0px);
    }
  }

  .MuiInput-root {
    height:45px;
    margin: 10px 20px;
    color: ${({ theme }) => theme.textInput.textColor};
  }
  .MuiInputAdornment-root {
    color: ${({ theme }) => theme.textInput.textColor};
    padding-bottom:7px;
    > p {font-weight: 860;}
  }
  .MuiFormControl-root {
        height: 45px !important;
  }

  .MuiInput-root.MuiInput-fullWidth {
    width: auto;
  }

  .MuiInput-root.Mui-error {
    color: ${({ theme }) => theme.formControl.labelErrorColor};
  }

  .MuiInput-underline:before,
  .MuiInput-underline:after {
    display: none;
  }

  .MuiFormHelperText-root {
    position: absolute;
    right: 0;
    bottom: -20px;
  }

    .MuiTextField-root {
      /* 14.5px = 18.5px - 4px (note: 18.5px is the input's default padding top and bottom) */
      padding-top: 4.5px;
      padding-bottom: 14.5px; 
      height:45px;
    }

  ${({ disabled }) => (disabled ? 'opacity: 0.5' : '')};

  .Mui-disabled {
    opacity: 0.5;
  }
` as any;
