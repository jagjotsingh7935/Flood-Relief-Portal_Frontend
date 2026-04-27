import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  AlertTitle,
  Paper,
  LinearProgress,
  Avatar,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Home as HomeIcon,
  Water as WaterIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Emergency as EmergencyIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import UserFloodMap from '../usermapview/usermapview';
import FloodDamageUserSurveyForm from '../user/FloodDamageUserSurveyForm';

const UserHomePage = () => {
  const stats = [
    { 
      label: 'Areas Affected', 
      value: '125', 
      unit: 'Districts', 
      icon: <LocationIcon />,
      color: '#e53935',
      progress: 85
    },
    { 
      label: 'Water Level', 
      value: '3.2', 
      unit: 'Meters', 
      icon: <WaterIcon />,
      color: '#1e88e5',
      progress: 65
    },
    { 
      label: 'Active Alerts', 
      value: '47', 
      unit: 'Warnings', 
      icon: <WarningIcon />,
      color: '#fb8c00',
      progress: 90
    },
    { 
      label: 'Homes Impacted', 
      value: '2,340', 
      unit: 'Families', 
      icon: <HomeIcon />,
      color: '#8e24aa',
      progress: 75
    },
  ];

  const emergencyContacts = [
    { service: 'Emergency Helpline', number: '108', available: '24/7' },
    { service: 'Flood Control Room', number: '0161-2444444', available: '24/7' },
    { service: 'Disaster Management', number: '112', available: '24/7' },
  ];

  const quickActions = [
    { title: 'Report Flood Damage', icon: <AssessmentIcon />, color: '#d32f2f' },
    { title: 'Emergency Evacuation', icon: <EmergencyIcon />, color: '#1976d2' },
    { title: 'Relief Center Locations', icon: <LocationIcon />, color: '#388e3c' },
    { title: 'Weather Updates', icon: <TrendingUpIcon />, color: '#f57c00' },
  ];

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: '100vh',
          backgroundImage: 'url(https://static.theprint.in/wp-content/uploads/2025/09/trucks-696x392.jpg?compress=true&quality=80&w=376&dpr=2.6)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(133, 202, 255, 0.6))',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ mb: 4 }}>
            <Chip
              label="ACTIVE MONITORING"
              color="error"
              variant="filled"
              sx={{ 
                mb: 3, 
                fontWeight: 'bold',
                fontSize: '0.9rem',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.7 },
                  '100%': { opacity: 1 },
                },
              }}
            />
          </Box>
          
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2.8rem', sm: '4rem', md: '5rem' },
              letterSpacing: '-0.02em',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Punjab Flood
          </Typography>
          
          <Typography
            variant="h2"
            sx={{
              fontWeight: 600,
              mb: 3,
              fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
              color: '#ffeb3b',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            Relief Portal
          </Typography>
          
          <Typography
            variant="h4"
            sx={{
              fontWeight: 400,
              mb: 1,
              fontSize: { xs: '1.3rem', sm: '1.8rem', md: '2.2rem' },
              opacity: 0.95,
              fontFamily: 'serif',
            }}
          >
            ਪੰਜਾਬ ਹੜ੍ਹ ਰਾਹਤ ਪੋਰਟਲ
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              mt: 3,
              mb: 4,
              fontWeight: 300,
              fontSize: { xs: '1.1rem', sm: '1.4rem' },
              opacity: 0.9,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Real-time flood monitoring, emergency assistance, and community support for Punjab
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" gap={2}>
            <Button
              variant="contained"
              size="large"
              startIcon={<EmergencyIcon />}
              sx={{
                bgcolor: '#d32f2f',
                '&:hover': { bgcolor: '#b71c1c' },
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(211, 47, 47, 0.4)',
              }}
            >
              Emergency Help
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<AssessmentIcon />}
              sx={{
                color: '#fff',
                borderColor: '#fff',
                '&:hover': { 
                  borderColor: '#fff',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                borderWidth: 2,
              }}
            >
              Report Damage
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Emergency Alert Banner */}
      <Box sx={{ bgcolor: '#d32f2f', py: 2 }}>
        <Container maxWidth="lg">
          <Alert 
            severity="error" 
            sx={{ 
              bgcolor: 'transparent', 
              color: '#fff',
              '& .MuiAlert-icon': { color: '#fff' }
            }}
          >
            <AlertTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
              FLOOD ALERT - HIGH RISK AREAS
            </AlertTitle>
            Ludhiana, Jalandhar, and Patiala districts are experiencing severe flooding. Evacuate immediately if advised by authorities.
          </Alert>
        </Container>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ py: 6, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 4,
              color: '#1a237e',
              fontSize: { xs: '1.8rem', sm: '2.2rem' },
            }}
          >
            Quick Actions
          </Typography>
          <Grid container spacing={3}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 4,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: `2px solid transparent`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      border: `2px solid ${action.color}`,
                      boxShadow: `0 8px 30px ${action.color}20`,
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: action.color,
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {action.icon}
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#424242',
                      fontSize: '1rem',
                    }}
                  >
                    {action.title}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, bgcolor: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
              color: '#1a237e',
            }}
          >
            Live Flood Impact Data
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 6,
              color: '#666',
              fontWeight: 400,
            }}
          >
            Real-time monitoring across Punjab state
          </Typography>
          
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 4,
                    background: '#fff',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    border: '1px solid #f5f5f5',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      bgcolor: stat.color,
                    },
                  }}
                >
                  <CardContent>
                    <Avatar
                      sx={{
                        bgcolor: `${stat.color}15`,
                        color: stat.color,
                        width: 56,
                        height: 56,
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#424242',
                        mb: 1,
                        fontSize: '1rem',
                      }}
                    >
                      {stat.label}
                    </Typography>
                    
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 800,
                        color: stat.color,
                        mb: 1,
                        fontSize: '2.5rem',
                      }}
                    >
                      {stat.value}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: '#666',
                        fontSize: '0.9rem',
                        mb: 2,
                      }}
                    >
                      {stat.unit}
                    </Typography>

                    <LinearProgress
                      variant="determinate"
                      value={stat.progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: '#f5f5f5',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: stat.color,
                          borderRadius: 4,
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#888',
                        mt: 1,
                        display: 'block',
                      }}
                    >
                      {stat.progress}% Capacity
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Emergency Contacts */}
      <Box sx={{ py: 6, bgcolor: '#1a237e' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 4,
              color: '#fff',
              fontSize: { xs: '1.8rem', sm: '2.2rem' },
            }}
          >
            Emergency Contacts
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {emergencyContacts.map((contact, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    bgcolor: '#fff',
                    borderRadius: 3,
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: 'scale(1.02)' },
                  }}
                >
                  <PhoneIcon sx={{ fontSize: 40, color: '#d32f2f', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {contact.service}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      color: '#d32f2f',
                      mb: 1,
                    }}
                  >
                    {contact.number}
                  </Typography>
                  <Chip
                    label={contact.available}
                    color="success"
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Flood Map Section */}
      <Box sx={{ py: 8, bgcolor: '#f8fafc' }}>
        <Container maxWidth="xl">
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
              color: '#1a237e',
            }}
          >
            Live Flood Monitoring Map
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 6,
              color: '#666',
              fontWeight: 400,
            }}
          >
            Track flood zones and water levels across Punjab in real-time
          </Typography>
          <Paper
            elevation={8}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid #e0e0e0',
            }}
          >
            <UserFloodMap />
          </Paper>
        </Container>
      </Box>

      {/* Survey Form Section */}
      <Box sx={{ py: 8, bgcolor: 'linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%)' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
              color: '#1a237e',
            }}
          >
            Report Flood Damage
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 6,
              color: '#666',
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Help us assess the situation by reporting damage in your area. Your information helps coordinate relief efforts.
          </Typography>
          <Paper
            elevation={8}
            sx={{
              p: 4,
              borderRadius: 4,
              bgcolor: '#fff',
              border: '1px solid #e0e0e0',
            }}
          >
            <FloodDamageUserSurveyForm />
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, bgcolor: '#263238', color: '#fff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Punjab Flood Relief Portal
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Government of Punjab | Department of Water Resources & Disaster Management
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} textAlign={{ xs: 'left', md: 'right' }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                24/7 Emergency Support Available
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.6, mt: 0.5 }}>
                Last updated: {new Date().toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default UserHomePage;