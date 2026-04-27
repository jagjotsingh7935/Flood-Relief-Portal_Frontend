import React from 'react';
import { AppBar, Toolbar, Box, Typography, Button, Icon } from '@mui/material';
import logo from '../../assets/logo.png';

const AppBarComponent = ({ showMap, toggleMapVisibility }) => {
  return (
    <AppBar
      position="static"
      sx={{
        backdropFilter: 'blur(20px)',
        // border: '1px solid rgba(255,255,255,0.1)',
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
          <Typography sx={{ fontSize: 20,color:'white' }}>
            Punjab Flood Relief Portal<br />
            ਪੰਜਾਬ ਹੜ੍ਹ ਰਾਹਤ ਪੋਰਟਲ
          </Typography>
        </Box>
        {/* <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={toggleMapVisibility}
            startIcon={<Icon icon={showMap ? 'mdi:eye-off' : 'mdi:eye'} />}
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </Button>
        </Box> */}
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;