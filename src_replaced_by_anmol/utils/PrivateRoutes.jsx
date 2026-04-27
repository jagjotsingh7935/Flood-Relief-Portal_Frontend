import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: 2
    }}
  >
    <CircularProgress />
    <Typography variant="body1" color="text.secondary">
      Loading...
    </Typography>
  </Box>
);

const ProtectedRoute = ({ children }) => {
  const access = sessionStorage.getItem('accessToken');
  const location = useLocation();

  if (!access) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;