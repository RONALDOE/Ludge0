import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6',
    },
    secondary: {
      main: '#A1A1AA',
    },
  },
});

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MUIThemeProvider theme={theme}>
      {children}
    </MUIThemeProvider>
  )
}