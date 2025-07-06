// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#B299FF',   // lavender purple
    },
    secondary: {
      main: '#F6E1A8',   // pastel yellow
    },
    background: {
      default: '#F6E1A8',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

export default theme;
