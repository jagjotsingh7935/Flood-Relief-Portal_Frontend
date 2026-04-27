import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import { useMemo } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { palette } from './palette';
import { shadows } from './shadows';
import { typography } from './typography';
import { customShadows } from './custom-shadows';
import { componentsOverrides } from './overrides';
import { presets } from './options/presets';
import { darkMode } from './options/dark-mode';
import { contrast } from './options/contrast';


export default function ThemeProvider({ children, themeMode = 'light', themeColorPresets = 'default', themeContrast = 'normal'}) {
  
  const darkModeOption = darkMode(themeMode);
  const presetsOption = presets(themeColorPresets);
  const contrastOption = contrast(themeContrast === 'light', themeMode);


  const baseOption = useMemo(
    () => ({
      palette: palette('light'),
      shadows: shadows('light'),
      customShadows: customShadows('light'),
      typography,
      shape: { borderRadius: 8 },
    }),
    []
  );

  const memoizedValue = useMemo(
    () =>
      merge(
        baseOption,
     
        darkModeOption,
        presetsOption,
        contrastOption.theme
      ),
    [baseOption, darkModeOption, presetsOption, contrastOption.theme]
  );

  const theme = createTheme(memoizedValue);
  theme.components = merge(componentsOverrides(theme), contrastOption.components);

  const themeWithLocale = useMemo(() => createTheme(theme), [theme]);

  return (
    <MuiThemeProvider theme={themeWithLocale}>
      
        <CssBaseline />
        {children}
      
    </MuiThemeProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
  themeMode: PropTypes.string,
  themeColorPresets: PropTypes.string,
  themeContrast: PropTypes.string,
  themeDirection: PropTypes.string,
  settings: PropTypes.object,
};
