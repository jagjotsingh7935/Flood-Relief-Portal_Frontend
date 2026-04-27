import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
  Divider,
  Fade,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { createAdmin, getAdmin, updateAdmin } from '../../api/api';

// Blue theme to match #1976d2
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#f5c518',
      light: '#ffd54f',
      dark: '#c79100',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    error: {
      main: '#d32f2f',
    },
    success: {
      main: '#1976d2',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default function AdminForm({ adminId, onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    password: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  useEffect(() => {
    if (adminId) {
      fetchAdmin();
    } else {
      // Reset form when creating new admin
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        password: '',
        is_active: true,
      });
    }
  }, [adminId]);

  const fetchAdmin = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdmin(adminId);
      setFormData({
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        password: '',
        is_active: data.is_active,
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch admin details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const getFullName = () => {
    const firstName = formData.first_name.trim();
    const lastName = formData.last_name.trim();
    return `${firstName}${firstName && lastName ? ' ' : ''}${lastName}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const fullName = getFullName();
    const action = adminId ? 'update' : 'create';
    const actionText = adminId ? 'Update' : 'Create';

    setConfirmDialog({
      open: true,
      title: `${actionText} Admin`,
      message: `Are you sure you want to ${action} admin "${fullName}"?`,
      onConfirm: async () => {
        await performSubmit();
        setConfirmDialog({ ...confirmDialog, open: false });
      },
    });
  };

  const performSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const data = { 
        ...formData,
        full_name: getFullName() // Append full_name to payload
      };
      
      if (!adminId) {
        if (!data.password) {
          throw new Error('Password is required for new admin');
        }
      } else {
        // For update, remove password if empty
        if (!data.password) {
          delete data.password;
        }
      }

      if (adminId) {
        await updateAdmin(adminId, data);
      } else {
        await createAdmin(data);
      }
      
      // Reset form after successful creation/update
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        password: '',
        is_active: true,
      });
      
      onClose(true);
    } catch (err) {
      setError(err.message || 'Failed to save admin');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (Object.values(formData).some(val => val !== '' && val !== true)) {
      setConfirmDialog({
        open: true,
        title: 'Discard Changes',
        message: 'Are you sure you want to cancel? Any unsaved changes will be lost.',
        onConfirm: () => {
          setConfirmDialog({ ...confirmDialog, open: false });
          setFormData({
            email: '',
            first_name: '',
            last_name: '',
            phone_number: '',
            password: '',
            is_active: true,
          });
          onClose(false);
        },
      });
    } else {
      onClose(false);
    }
  };

  const handleConfirmClose = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ThemeProvider theme={theme}>
      <Card
        elevation={4}
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
          borderRadius: { xs: 2, sm: 3 },
          overflow: 'visible',
          border: '2px solid rgba(25, 118, 210, 0.15)',
          // borderColor: 'none',
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
        }}
      >
        {/* Header */}
        {/* <Box
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white',
            p: { xs: 2, sm: 3, md: 3 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTopLeftRadius: { xs: 8, sm: 12 },
            borderTopRightRadius: { xs: 8, sm: 12 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
            {adminId ? (
              <EditIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
            ) : (
              <PersonAddIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
            )}
            <Typography 
              variant={isSmallMobile ? 'h6' : 'h5'} 
              component="div"
              sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}
            >
              {adminId ? 'Edit Admin' : 'Create New Admin'}
            </Typography>
          </Box>
          <IconButton
            onClick={handleCancel}
            sx={{
              color: 'white',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box> */}

        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {error && (
            <Fade in>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  border: '1px solid rgba(211, 47, 47, 0.2)',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            </Fade>
          )}

          {loading && !error ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 4, sm: 6 } }}>
              <CircularProgress sx={{ color: 'primary.main' }} />
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} id="admin-form">
              {/* Full Name Display */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  mb: { xs: 2, sm: 3 },
                  background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(66, 165, 245, 0.05) 100%)',
                  border: '1px solid rgba(25, 118, 210, 0.1)',
                  borderRadius: 2,
                }}
              >
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }}
                >
                  Full Name Preview
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'primary.main', 
                    fontWeight: 700, 
                    mt: 0.5,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    wordBreak: 'break-word',
                  }}
                >
                  {getFullName() || 'Enter first and last name'}
                </Typography>
              </Paper>

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr 1fr' },
                gap: { xs: 2, sm: 2.5, md: 3 }
              }}>
                {/* First Name */}
                <TextField
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  fullWidth
                  size={isSmallMobile ? 'small' : 'medium'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'primary.main', fontSize: { xs: 20, sm: 24 } }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />

                {/* Last Name */}
                <TextField
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  fullWidth
                  size={isSmallMobile ? 'small' : 'medium'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'primary.main', fontSize: { xs: 20, sm: 24 } }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />

                {/* Email */}
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  size={isSmallMobile ? 'small' : 'medium'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'primary.main', fontSize: { xs: 20, sm: 24 } }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />

                {/* Phone Number */}
                <TextField
                  label="Phone Number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  fullWidth
                  size={isSmallMobile ? 'small' : 'medium'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: 'primary.main', fontSize: { xs: 20, sm: 24 } }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />

                {/* Password */}
                <TextField
                  label={adminId ? "New Password (leave blank to keep current)" : "Password"}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required={!adminId}
                  fullWidth
                  size={isSmallMobile ? 'small' : 'medium'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            width: { xs: 6, sm: 8 },
                            height: { xs: 6, sm: 8 },
                            borderRadius: '50%',
                            background: 'primary.main',
                          }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          size={isSmallMobile ? 'small' : 'medium'}
                          sx={{ color: 'primary.main' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />

                {/* Active Status */}
                {/* <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.is_active}
                      onChange={handleChange}
                      name="is_active"
                      size={isSmallMobile ? 'small' : 'medium'}
                      sx={{
                        color: 'primary.main',
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontWeight: 500, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      Active Admin Account
                    </Typography>
                  }
                  sx={{ alignSelf: 'center' }}
                /> */}
              </Box>
            </Box>
          )}
        </CardContent>

        <Divider />

        {/* Actions */}
        <CardActions 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            gap: { xs: 1.5, sm: 2 }, 
            justifyContent: 'flex-end',
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          <Button
            onClick={handleCancel}
            variant="outlined"
            fullWidth={isSmallMobile}
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              px: { xs: 3, sm: 4 },
              py: { xs: 0.75, sm: 1 },
              fontWeight: 600,
              fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              '&:hover': {
                borderColor: 'primary.dark',
                background: 'rgba(25, 118, 210, 0.05)',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="admin-form"
            variant="contained"
            disabled={loading}
            fullWidth={isSmallMobile}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            sx={{
              px: { xs: 3, sm: 4 },
              py: { xs: 0.75, sm: 1 },
              fontWeight: 700,
              fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
              },
              '&.Mui-disabled': {
                background: 'rgba(25, 118, 210, 0.5)',
                color: 'rgba(255, 255, 255, 0.7)',
              }
            }}
          >
            {adminId ? 'Update Admin' : 'Create Admin'}
          </Button>
        </CardActions>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleConfirmClose}
        maxWidth="xs"
        fullWidth
        fullScreen={isSmallMobile}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: isSmallMobile ? 0 : 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            m: { xs: 0, sm: 2 },
          }
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            pt: { xs: 2, sm: 3 },
            pb: 1,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          }}
        >
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            {confirmDialog.message}
          </Typography>
        </DialogContent>
        <DialogActions 
          sx={{ 
            px: { xs: 2, sm: 3 }, 
            pb: { xs: 2, sm: 3 }, 
            gap: { xs: 1.5, sm: 1 },
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          <Button
            onClick={handleConfirmClose}
            variant="outlined"
            fullWidth={isSmallMobile}
            sx={{
              borderColor: 'grey.400',
              color: 'text.secondary',
              fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              '&:hover': {
                borderColor: 'grey.600',
                background: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDialog.onConfirm}
            variant="contained"
            fullWidth={isSmallMobile}
            sx={{
              fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
              }
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}