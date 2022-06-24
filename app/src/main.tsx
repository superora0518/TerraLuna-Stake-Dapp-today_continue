import SFfont from '@libs/neumorphism-ui/themes/GlobalFonts';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import reportWebVitals from './reportWebVitals';


ReactDOM.hydrate(<>
   

    <SFfont/>
    <App />


    </>, document.getElementById('root'));

reportWebVitals();
