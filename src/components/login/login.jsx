import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { loginUser } from '../../api/api';
import logo from '../../assets/merapind.jpg'

// Create a custom theme matching Mera Pind colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#2d5f3f', // Dark green from logo
      light: '#4a8c5f',
      dark: '#1a3d28',
    },
    secondary: {
      main: '#f5c518', // Golden yellow from logo
      light: '#ffd54f',
      dark: '#c79100',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

// Icon component for custom icons
const IconifyIcon = ({ icon, ...props }) => {
  return (
    <Box
      component="span"
      className="iconify"
      data-icon={icon}
      {...props}
      sx={{
        display: 'inline-block',
        width: '1em',
        height: '1em',
        ...props.sx
      }}
    />
  );
};

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser(formData.username, formData.password);
      
      // Store in memory instead of sessionStorage for artifact compatibility
      // In production, use sessionStorage as in original code
      const tokens = {
        access_token: response.accessToken,
        refresh_token: response.refreshToken,
        username: formData.username,
        user_id: response.user.id || 'unknown'
      };
      
      // For production, uncomment these lines:
      // sessionStorage.setItem('access_token', response.accessToken);
      // sessionStorage.setItem('refresh_token', response.refreshToken);
      // sessionStorage.setItem('username', formData.username);
      // sessionStorage.setItem('user_id', response.user.id || 'unknown');

      setTimeout(() => {
        navigate('/affectedvillages/admin');
        setLoading(false);
      }, 500);
    } catch (err) {
      setError(err.message || 'Invalid username or password');
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          overflow: 'hidden'
        }}
      >
        {/* Left Side - Logo & Branding */}
        <Box
          sx={{
            flex: { xs: '0 0 auto', md: '1 1 50%' },
            background: 'linear-gradient(135deg, #2d5f3f 0%, #1a3d28 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 4, md: 6 },
            position: 'relative',
            overflow: 'hidden',
            minHeight: { xs: '30vh', md: '100vh' }
          }}
        >
          {/* Decorative circles */}
          <Box
            sx={{
              position: 'absolute',
              top: '-10%',
              left: '-10%',
              width: '40%',
              height: '40%',
              borderRadius: '50%',
              background: 'rgba(245, 197, 24, 0.1)',
              filter: 'blur(60px)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '-10%',
              right: '-10%',
              width: '50%',
              height: '50%',
              borderRadius: '50%',
              background: 'rgba(245, 197, 24, 0.08)',
              filter: 'blur(80px)',
            }}
          />

          <Zoom in timeout={800}>
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                textAlign: 'center'
              }}
            >
              {/* Logo Container */}
              <Box
                sx={{
                  mb: 4,
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Box
                  component="img"
                  src={logo} // Replace with your actual logo path
                  alt="Mera Pind Logo"
                  sx={{
                    width: { xs: '200px', sm: '280px', md: '320px' },
                    height: 'auto',
                    filter: 'drop-shadow(0px 8px 24px rgba(0, 0, 0, 0.3))',
                    borderRadius:'90px'
                  }}
                />
              </Box>

              {/* Organization Name */}
              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                  textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
                  letterSpacing: '0.02em'
                }}
              >
                MERA PIND
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: 'secondary.main',
                  fontWeight: 600,
                  mb: 1,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  textShadow: '1px 1px 4px rgba(0, 0, 0, 0.3)'
                }}
              >
                Empowering Rural Punjab
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  maxWidth: '400px',
                  mx: 'auto',
                  mt: 3,
                  lineHeight: 1.7,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                Digital platform for rural farmers' welfare and empowerment
              </Typography>

              {/* Decorative line */}
              <Box
                sx={{
                  width: '100px',
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent, #f5c518, transparent)',
                  mx: 'auto',
                  mt: 4,
                  borderRadius: '2px'
                }}
              />
            </Box>
          </Zoom>
        </Box>

        {/* Right Side - Login Form */}
        <Box
          sx={{
            flex: { xs: '1 1 auto', md: '1 1 50%' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 3, sm: 4, md: 6 },
            background: 'linear-gradient(to bottom right, #f8f9fa 0%, #e9ecef 100%)',
            minHeight: { xs: '70vh', md: '100vh' }
          }}
        >
          <Container maxWidth="sm">
            <Fade in timeout={1000}>
              <Paper
                elevation={8}
                sx={{
                  p: { xs: 3, sm: 5 },
                  width: '100%',
                  maxWidth: 480,
                  mx: 'auto',
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(45, 95, 63, 0.1)',
                  boxShadow: '0 8px 32px rgba(45, 95, 63, 0.12)'
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 4
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2d5f3f 0%, #4a8c5f 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      boxShadow: '0 4px 12px rgba(45, 95, 63, 0.3)'
                    }}
                  >
                    <LoginIcon sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                  
                  <Typography 
                    component="h1" 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      color: 'primary.main',
                      mb: 1,
                      fontSize: { xs: '1.75rem', sm: '2.125rem' }
                    }}
                  >
                    Admin Login
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary',
                      textAlign: 'center'
                    }}
                  >
                    Sign in to access your dashboard
                  </Typography>
                </Box>

                {/* Error Alert */}
                {error && (
                  <Fade in>
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 3,
                        borderRadius: 2
                      }}
                    >
                      {error}
                    </Alert>
                  </Fade>
                )}

                {/* Login Form */}
                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconifyIcon 
                            icon="mdi:account-outline" 
                            sx={{ 
                              color: 'primary.main',
                              fontSize: '1.5rem'
                            }} 
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      mb: 2.5,
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      }
                    }}
                  />
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconifyIcon 
                            icon="mdi:lock-outline" 
                            sx={{ 
                              color: 'primary.main',
                              fontSize: '1.5rem'
                            }} 
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                            edge="end"
                            sx={{
                              color: 'primary.main'
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      mb: 1,
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.75,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #2d5f3f 0%, #4a8c5f 100%)',
                      boxShadow: '0 4px 12px rgba(45, 95, 63, 0.3)',
                      textTransform: 'none',
                      letterSpacing: '0.5px',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1a3d28 0%, #2d5f3f 100%)',
                        boxShadow: '0 6px 16px rgba(45, 95, 63, 0.4)',
                        transform: 'translateY(-1px)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                      transition: 'all 0.2s ease',
                      '&.Mui-disabled': {
                        background: 'rgba(45, 95, 63, 0.5)',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }
                    }}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>

                  {/* Footer note */}
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5
                      }}
                    >
                      Secured by Mera Pind
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: 'secondary.main'
                        }}
                      />
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Fade>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}