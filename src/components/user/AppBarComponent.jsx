import React, { useContext } from 'react';
import { AppBar, Toolbar, Box, Typography, Button, Icon, Select, MenuItem, IconButton } from '@mui/material';
import logo from '../../assets/logo.png';
import { LanguageContext } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';
const AppBarComponent = ({ showMap, toggleMapVisibility }) => {
  const { t } = useTranslation();

  const { language, changeLanguage } = useContext(LanguageContext);

  const handleLanguageChange = (event) => {
    changeLanguage(event.target.value);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Toolbar sx={{ px: 3 }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, p: 1 }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ height: 80, marginRight: 16 }}
          />
          <Typography sx={{ fontSize: 20 }}>
           {t('floodDashboard.appbar.title')}
          </Typography>
        </Box>
  
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Select
                    value={language}
                    onChange={handleLanguageChange}
                    size="small"
                    sx={{
                      color: 'white',
                      '.MuiSelect-icon': { color: 'white' },
                      '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                    }}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="pa">Punjabi</MenuItem>
                  </Select>
                  
                </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;