import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// icons
import { Icon } from '@iconify/react'; 
// @mui
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

const Iconify = forwardRef(({ icon, width = 20, sx, ...other }, ref) => (
  <Box
    ref={ref}
    component="span"
    className="component-iconify"
    sx={{ width, height: width, ...sx }}
    {...other}
  >
    <Icon icon={icon} width={width} height={width} />
  </Box>
));

Iconify.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  sx: PropTypes.object,
  width: PropTypes.number,
};

export default Iconify;