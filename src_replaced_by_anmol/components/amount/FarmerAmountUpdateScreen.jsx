import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  Grid,
  Chip,
  Card,
  CardContent,
  Container,
  Stack,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const FarmerAmountUpdateScreen = ({ personId, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [amountData, setAmountData] = useState(null);
  const [newAmount, setNewAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAmountDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/floods/api/show/farmer/amount/?person_id=${id}`);
        setAmountData(response.data);
      } catch (err) {
        setError('Failed to fetch amount details. Please try again.');
        console.error('Error fetching amount data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAmountDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/floods/api/add/farmer/amount/?person_id=${id}&amount_received=${newAmount}`
      );
      setAmountData({
        ...amountData,
        amount_received: response.data.new_amount_received,
        remaining_amount: (parseFloat(amountData.amount_needed) - parseFloat(response.data.new_amount_received)).toFixed(1),
      });
      setNewAmount('');
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update amount. Please try again.');
      console.error('Error updating amount:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/amount');
  };

  if (loading && !amountData) {
    return (
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100%',
          gap: 2,
          bgcolor: '#f5f7fa',
          px: 2,
        }}
      >
        <CircularProgress size={isMobile ? 40 : 60} thickness={4} />
        <Typography 
          variant="body1" 
          color="#4a5568"
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          Loading farmer details...
        </Typography>
      </Box>
    );
  }

  if (!amountData && !loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100%',
          p: 2,
          bgcolor: '#f5f7fa',
        }}
      >
        <Alert 
          severity="error" 
          sx={{ 
            maxWidth: 500, 
            width: '100%',
            bgcolor: '#fef2f2', 
            color: '#4a5568',
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          No data available
        </Alert>
      </Box>
    );
  }

  const receivedPercentage = amountData 
    ? ((parseFloat(amountData.amount_received) / parseFloat(amountData.amount_needed)) * 100).toFixed(1)
    : 0;

  const remainingPercentage = amountData 
    ? ((parseFloat(amountData.remaining_amount) / parseFloat(amountData.amount_needed)) * 100).toFixed(1)
    : 0;

  const isFullyPaid = parseFloat(receivedPercentage) >= 100;

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: { xs: 2, sm: 3 }, 
        px: { xs: 1, sm: 2, md: 3 },
        bgcolor: '#f5f7fa', 
        minHeight: '100vh',
      }}
    >
      {/* Header Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 1.5, sm: 2, md: 3 },
          mb: { xs: 2, sm: 3 },
          borderRadius: 2,
          bgcolor: '#d4edff',
          border: '1px solid #e5e7eb',
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontSize: { xs: '1.125rem', sm: '1.5rem', md: '2rem' },
                fontWeight: 600,
                color: '#2d3748',
                mb: { xs: 0.5, sm: 1 },
                lineHeight: 1.2,
              }}
            >
              Farmer Amount Management
            </Typography>
            <Typography 
              variant="body2" 
              color="#4a5568"
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Track and update financial assistance for flood-affected farmers
            </Typography>
          </Box>
          <Tooltip title="Back to List">
            <IconButton
              onClick={handleClose}
              sx={{ 
                bgcolor: '#edf2f7',
                '&:hover': { bgcolor: '#d4edff' },
                p: { xs: 0.75, sm: 1 },
                borderRadius: '50%',
                alignSelf: { xs: 'flex-end', sm: 'center' },
              }}
              size={isMobile ? 'small' : 'medium'}
            >
              <ArrowBackIcon sx={{ color: '#2d3748', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Farmer Information Card */}
      <Paper 
        elevation={0}
        sx={{ 
          mb: { xs: 2, sm: 3 },
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
        }}
      >
        <Box 
          sx={{ 
            bgcolor: '#e2e8f0',
            p: { xs: 1.5, sm: 2 },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <PersonIcon sx={{ color: '#4a5568', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
              fontWeight: 600,
              color: '#2d3748',
            }}
          >
            Farmer Information
          </Typography>
        </Box>
        <Box sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#718096',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  fontSize: { xs: '0.625rem', sm: '0.75rem' },
                  mb: 0.5,
                  display: 'block',
                }}
              >
                Farmer Name
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                  fontWeight: 600,
                  color: '#2d3748',
                  wordBreak: 'break-word',
                }}
              >
                {amountData?.farmer_name}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Payment Status Card */}
      <Paper 
        elevation={0}
        sx={{ 
          mb: { xs: 2, sm: 3 },
          borderRadius: 2,
          border: '1px solid #e5e7eb',
        }}
      >
        <Box 
          sx={{ 
            bgcolor: isFullyPaid ? '#edf7ed' : '#fef7e6',
            p: { xs: 1.5, sm: 2 },
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {isFullyPaid ? (
            <CheckCircleIcon sx={{ color: '#48bb78', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
          ) : (
            <WarningIcon sx={{ color: '#ed8936', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
          )}
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
              fontWeight: 600,
              color: isFullyPaid ? '#2f855a' : '#c05621',
              flex: { xs: '1 1 100%', sm: '0 1 auto' },
            }}
          >
            Payment Status: {isFullyPaid ? 'Fully Paid' : 'Pending'}
          </Typography>
          <Chip 
            label={`${receivedPercentage}% Complete`}
            color={isFullyPaid ? 'success' : 'warning'}
            size="small"
            sx={{ 
              ml: { xs: 0, sm: 'auto' },
              fontWeight: 600, 
              bgcolor: isFullyPaid ? '#c6f6d5' : '#feebc8', 
              color: isFullyPaid ? '#2f855a' : '#c05621',
              fontSize: { xs: '0.625rem', sm: '0.75rem' },
            }}
          />
        </Box>
      </Paper>

      {/* Financial Summary Cards */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              borderRadius: 2,
              border: '1px solid #e5e7eb',
              bgcolor: '#edf2f7',
            }}
          >
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Stack 
                direction="row" 
                alignItems="center" 
                spacing={1} 
                sx={{ mb: { xs: 0.5, sm: 1 } }}
              >
                <AccountBalanceIcon sx={{ color: '#3182ce', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#718096',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    fontSize: { xs: '0.625rem', sm: '0.75rem' },
                  }}
                >
                  Amount Received
                </Typography>
              </Stack>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '1.125rem', sm: '1.5rem', md: '1.75rem' },
                  color: '#2b6cb0',
                  mb: { xs: 0.5, sm: 1 },
                  wordBreak: 'break-word',
                }}
              >
                ₹{parseFloat(amountData?.amount_received || 0).toLocaleString('en-IN')}
              </Typography>
              <Chip 
                label={`${receivedPercentage}% Received`}
                sx={{ 
                  bgcolor: '#bee3f8', 
                  color: '#2b6cb0', 
                  fontWeight: 600,
                  fontSize: { xs: '0.625rem', sm: '0.75rem' },
                  height: { xs: '20px', sm: '24px' },
                }}
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              borderRadius: 2,
              border: '1px solid #e5e7eb',
              bgcolor: '#edf2f7',
            }}
          >
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Stack 
                direction="row" 
                alignItems="center" 
                spacing={1} 
                sx={{ mb: { xs: 0.5, sm: 1 } }}
              >
                <TrendingUpIcon sx={{ color: '#38b2ac', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#718096',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    fontSize: { xs: '0.625rem', sm: '0.75rem' },
                  }}
                >
                  Total Required
                </Typography>
              </Stack>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '1.125rem', sm: '1.5rem', md: '1.75rem' },
                  color: '#2c7a7b',
                  mb: { xs: 0.5, sm: 1 },
                  wordBreak: 'break-word',
                }}
              >
                ₹{parseFloat(amountData?.amount_needed || 0).toLocaleString('en-IN')}
              </Typography>
              <Chip 
                label="Total Need"
                sx={{ 
                  bgcolor: '#b2f5ea', 
                  color: '#2c7a7b', 
                  fontWeight: 600,
                  fontSize: { xs: '0.625rem', sm: '0.75rem' },
                  height: { xs: '20px', sm: '24px' },
                }}
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              borderRadius: 2,
              border: '1px solid #e5e7eb',
              bgcolor: isFullyPaid ? '#edf7ed' : '#fef7e6',
            }}
          >
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Stack 
                direction="row" 
                alignItems="center" 
                spacing={1} 
                sx={{ mb: { xs: 0.5, sm: 1 } }}
              >
                {isFullyPaid ? (
                  <CheckCircleIcon sx={{ color: '#48bb78', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                ) : (
                  <WarningIcon sx={{ color: '#ed8936', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                )}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#718096',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    fontSize: { xs: '0.625rem', sm: '0.75rem' },
                  }}
                >
                  Remaining Amount
                </Typography>
              </Stack>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '1.125rem', sm: '1.5rem', md: '1.75rem' },
                  color: isFullyPaid ? '#2f855a' : '#c05621',
                  mb: { xs: 0.5, sm: 1 },
                  wordBreak: 'break-word',
                }}
              >
                ₹{parseFloat(amountData?.remaining_amount || 0).toLocaleString('en-IN')}
              </Typography>
              <Chip 
                label={`${remainingPercentage}% Pending`}
                sx={{ 
                  bgcolor: isFullyPaid ? '#c6f6d5' : '#feebc8', 
                  color: isFullyPaid ? '#2f855a' : '#c05621', 
                  fontWeight: 600,
                  fontSize: { xs: '0.625rem', sm: '0.75rem' },
                  height: { xs: '20px', sm: '24px' },
                }}
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Update Form */}
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 2,
          border: '1px solid #e5e7eb',
        }}
      >
        <Box 
          sx={{ 
            bgcolor: '#d4edff',
            p: { xs: 1.5, sm: 2 },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <AccountBalanceIcon sx={{ color: '#4a5568', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
              fontWeight: 600,
              color: '#2d3748',
            }}
          >
            Add New Payment
          </Typography>
        </Box>
        <Box sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  label="Amount to Add"
                  variant="outlined"
                  fullWidth
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  type="number"
                  InputProps={{ 
                    inputProps: { min: 0, step: 0.01 },
                    startAdornment: <Typography sx={{ mr: 1, color: '#718096' }}>₹</Typography>,
                  }}
                  placeholder="Enter amount received"
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#e5e7eb' },
                      '&:hover fieldset': { borderColor: '#cbd5e0' },
                      '&.Mui-focused fieldset': { borderColor: '#3182ce' },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    },
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !newAmount}
                  fullWidth
                  sx={{ 
                    height: { xs: '40px', sm: '56px' },
                    fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '1rem' },
                    fontWeight: 600,
                    bgcolor: '#3182ce',
                    '&:hover': { bgcolor: '#2b6cb0' },
                    '&:disabled': { bgcolor: '#a0aec0', color: '#e2e8f0' },
                    py: { xs: 1, sm: 1.5 },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={isMobile ? 20 : 24} sx={{ color: 'white' }} />
                  ) : (
                    isMobile ? 'Update' : 'Update Amount'
                  )}
                </Button>
              </Grid>
            </Grid>

            {/* Alerts */}
            {(error || success) && (
              <Box sx={{ mt: 2 }}>
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      bgcolor: '#fef2f2',
                      color: '#4a5568',
                      fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '1rem' },
                      borderRadius: 1,
                      border: '1px solid #fed7d7',
                      '& .MuiAlert-icon': {
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      },
                    }}
                  >
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert 
                    severity="success" 
                    sx={{ 
                      bgcolor: '#edf7ed',
                      color: '#2d3748',
                      fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '1rem' },
                      borderRadius: 1,
                      border: '1px solid #c6f6d5',
                      '& .MuiAlert-icon': {
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      },
                    }}
                  >
                    {success}
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default FarmerAmountUpdateScreen;