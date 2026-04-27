import React, { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Avatar,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Grid,
  Stack,
  LinearProgress,
  Chip,
  Card,
  Divider,
  Alert,
  Skeleton,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  HandshakeOutlined as HandshakeIcon,
  VerifiedUser as VerifiedIcon,
  Description as DescriptionIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Agriculture as AgricultureIcon,
  Terrain as TerrainIcon,
  LocalFlorist as CropIcon,
  Build as BuildIcon,
  Pets as PetsIcon,
  WaterDrop as WaterIcon,
  Group as GroupIcon,
  HelpOutline as HelpIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
} from '@mui/icons-material';

// TabPanel component for the tabs
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`farmer-details-tabpanel-${index}`}
      aria-labelledby={`farmer-details-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>}
    </div>
  );
}

// Info Row Component
const InfoRow = ({ label, value, icon: Icon }) => (
  <Box>
    <Typography 
      variant="subtitle2" 
      color="text.secondary" 
      sx={{ 
        mb: 0.5, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        fontSize: { xs: '0.75rem', sm: '0.875rem' }
      }}
    >
      {Icon && <Icon sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.secondary' }} />}
      {label}
    </Typography>
    <Typography 
      variant="body1" 
      fontWeight="medium"
      sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
    >
      {value || 'Not provided'}
    </Typography>
  </Box>
);

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color = 'primary', progress }) => (
  <Card 
    sx={{ 
      p: { xs: 1.5, sm: 2 }, 
      height: '100%', 
      transition: 'all 0.3s', 
      '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' } 
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, sm: 2 } }}>
      <Avatar 
        sx={{ 
          bgcolor: `${color}.main`, 
          width: { xs: 40, sm: 48 }, 
          height: { xs: 40, sm: 48 }, 
          mr: { xs: 1.5, sm: 2 } 
        }}
      >
        <Icon sx={{ fontSize: { xs: 20, sm: 24 } }} />
      </Avatar>
      <Box flex={1}>
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
        >
          {label}
        </Typography>
        <Typography 
          variant="h6" 
          fontWeight="bold" 
          color={`${color}.main`}
          sx={{ fontSize: { xs: '0.95rem', sm: '1.25rem' } }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
    {progress !== undefined && (
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ height: { xs: 4, sm: 6 }, borderRadius: 3 }}
        color={color}
      />
    )}
  </Card>
);

const FarmerDetailsDialog = ({ open, onClose, farmerId }) => {
  const [tabValue, setTabValue] = useState(0);
  const [farmerData, setFarmerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchFarmerDetails = useCallback(async (personId) => {
    if (!personId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/floods/api/person/data/by/id/?person_id=${personId}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setFarmerData(data[0]);
        } else {
          setError('No farmer data found');
        }
      } else {
        throw new Error('Failed to fetch farmer details');
      }
    } catch (error) {
      console.error('Error fetching farmer details:', error);
      setError('Failed to load farmer details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (farmerId && open) {
      fetchFarmerDetails(farmerId);
      setTabValue(0);
    }
    return () => {
      if (!open) {
        setFarmerData(null);
        setError(null);
      }
    };
  }, [farmerId, open, fetchFarmerDetails]);

  const handleExport = () => {
    console.log('Export farmer data:', farmerData);
    alert('Export functionality would be implemented here');
  };

  const handlePrint = () => {
    window.print();
  };

   const handleShare = () => {
    if (navigator.share && farmerData) {
      const formData = farmerData?.form_data?.[0] || {};
      const villageData = farmerData?.village_data?.[0] || {};
      const verificationData = farmerData?.verification_data?.[0]?.verified_by_data?.[0] || {};
      const landAffectedPercentage = formData.totalLandOwned
        ? ((formData.landAffected / formData.totalLandOwned) * 100).toFixed(1)
        : 0;

      const shareText = `
Farmer Details:

Personal Information:
- Name: ${formData.farmer_name || 'Not provided'}
- Father's Name: ${formData.fatherName || 'Not provided'}
- Mobile: ${formData.mobileNumber || 'Not provided'}
- Email: ${formData.email || 'Not provided'}
- Village: ${villageData.display_name || 'Not provided'}

Damage Status:
- House Status: ${formData.houseStatus || 'Not provided'}
- Total Land: ${formData.totalLandOwned || 0} acres
- Land Affected: ${formData.landAffected || 0} acres (${landAffectedPercentage}%)
- Crops Planted: ${formData.cropsPlanted || 'Not provided'}
- Crops Lost: ${formData.cropsLost || 'Not provided'}
- Estimated Loss: ₹${formData.estimatedCropLoss?.toLocaleString() || 0}

Help Needed:
- Tractor Leveling: ${formData.tractorLeveling || 'Not specified'}
- Manure/Fertilizer: ${formData.manureFertilizer || 'Not specified'}
- Seeds Required: ${formData.seedsRequired || 'Not specified'}
- Fertilizers/Pesticides: ${formData.fertilizersPesticides || 'Not specified'}
- Labor Requirement: ${formData.laborRequirement || 'Not specified'}
- Irrigation Repair: ${formData.irrigationRepair || 'Not specified'}
- Livestock Damage: ${formData.livestockDamage || 'Not specified'}
- Household Needs: ${formData.householdNeeds || 'Not specified'}
- Housing Repair: ${formData.housingRepair || 'Not specified'}
- Other Support: ${formData.otherSupport || 'Not specified'}

Verification Status:
- Status: ${verificationData.is_verified ? 'Verified' : 'Pending Verification'}
- Surveyor: ${verificationData.surveyor_name || 'Not provided'}
- Surveyor Mobile: ${verificationData.surveyor_mobile || 'Not provided'}
- Verification Date: ${verificationData.date || 'Not provided'}

Additional Notes:
${formData.additionalNotes || 'No additional notes provided.'}
      `.trim();

      navigator.share({
        title: `${formData?.farmer_name || 'Farmer'} - Details`,
        text: shareText,
      }).catch((error) => {
        console.error('Error sharing:', error);
        alert('Error sharing farmer details');
      });
    } else {
      alert('Share functionality not supported on this device or no farmer data available');
    }
  };

  const formData = farmerData?.form_data?.[0] || {};
  const villageData = farmerData?.village_data?.[0] || {};
  const verificationData = farmerData?.verification_data?.[0]?.verified_by_data?.[0] || {};

  const landAffectedPercentage = formData.totalLandOwned
    ? ((formData.landAffected / formData.totalLandOwned) * 100).toFixed(1)
    : 0;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={window.innerWidth < 600}
      sx={{
        '& .MuiDialog-paper': {
          m: { xs: 0, sm: 2 },
          maxHeight: { xs: '100%', sm: '90vh' }
        }
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: 'primary.',
          color: 'white',
          fontWeight: 'bold',
          p: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: { xs: 1.5, sm: 2 },
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            gap: { xs: 1, sm: 0 }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
            <Avatar
              src={formData.farmer_image}
              sx={{ 
                width: { xs: 40, sm: 48 }, 
                height: { xs: 40, sm: 48 }, 
                mr: { xs: 1.5, sm: 2 }, 
                border: '2px solid white' 
              }}
              alt={formData.farmer_name}
            >
              <PersonIcon />
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography 
                variant="h6" 
                fontWeight="bold"
                sx={{ 
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {loading ? 'Loading...' : formData.farmer_name || 'Farmer Details'}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  opacity: 0.9,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {villageData.display_name || 'Village'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, flexShrink: 0 }}>
            {/* <Tooltip title="Export">
              <IconButton 
                onClick={handleExport} 
                sx={{ color: 'white', p: { xs: 0.5, sm: 1 } }} 
                size="small"
              >
                <DownloadIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
              </IconButton>
            </Tooltip> */}
            {/* <Tooltip title="Print">
              <IconButton 
                onClick={handlePrint} 
                sx={{ color: 'white', p: { xs: 0.5, sm: 1 } }} 
                size="small"
              >
                <PrintIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
              </IconButton>
            </Tooltip> */}
            <Tooltip title="Share">
              <IconButton 
                onClick={handleShare} 
                sx={{ color: 'white', p: { xs: 0.5, sm: 1 } }} 
                size="small"
              >
                <ShareIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
              </IconButton>
            </Tooltip>
            <IconButton 
              onClick={onClose} 
              sx={{ color: 'white', p: { xs: 0.5, sm: 1 } }}
            >
              <CloseIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="farmer details tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ 
            '& .MuiTab-root': { 
              minHeight: { xs: 56, sm: 64 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              minWidth: { xs: 'auto', sm: 120 },
              px: { xs: 1, sm: 2 }
            },
            '& .MuiSvgIcon-root': {
              fontSize: { xs: '1.1rem', sm: '1.5rem' }
            }
          }}
        >
          <Tab
            label="Personal"
            icon={<PersonIcon />}
            iconPosition="start"
          />
          <Tab
            label="Damage"
            icon={<WarningIcon />}
            iconPosition="start"
          />
          <Tab
            label="Help Needed"
            icon={<HandshakeIcon />}
            iconPosition="start"
          />
          <Tab
            label="Verification"
            icon={<VerifiedIcon />}
            iconPosition="start"
          />
          <Tab
            label="Notes"
            icon={<DescriptionIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 0, minHeight: { xs: '300px', sm: '400px' } }}>
        {loading ? (
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack spacing={2}>
              <Skeleton variant="rectangular" height={120} />
              <Skeleton variant="text" height={40} />
              <Skeleton variant="text" height={40} />
              <Skeleton variant="rectangular" height={200} />
            </Stack>
          </Box>
        ) : error ? (
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Alert severity="error" action={
              <Button color="inherit" size="small" onClick={() => fetchFarmerDetails(farmerId)}>
                Retry
              </Button>
            }>
              {error}
            </Alert>
          </Box>
        ) : farmerData ? (
          <>
            {/* Personal Information Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Avatar
                      src={formData.farmer_image}
                      sx={{ 
                        width: { xs: 100, sm: 140 }, 
                        height: { xs: 100, sm: 140 }, 
                        mb: 2, 
                        boxShadow: 3 
                      }}
                      alt={formData.farmer_name}
                    >
                      <PersonIcon sx={{ fontSize: { xs: 60, sm: 80 } }} />
                    </Avatar>
                    <Typography 
                      variant="h5" 
                      fontWeight="bold" 
                      textAlign="center" 
                      gutterBottom
                      sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                    >
                      {formData.farmer_name}
                    </Typography>
                    <Chip 
                      label={villageData.display_name} 
                      color="primary" 
                      variant="outlined"
                      size="small"
                      sx={{ fontSize: { xs: '0.7rem', sm: '0.8125rem' } }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Stack spacing={{ xs: 2, sm: 3 }}>
                    <InfoRow label="Farmer Name" value={formData.farmer_name} icon={PersonIcon} />
                    <InfoRow label="Father's Name" value={formData.fatherName} icon={PersonIcon} />
                    <InfoRow label="Mobile Number" value={formData.mobileNumber} icon={PhoneIcon} />
                    <InfoRow label="Email" value={formData.email} icon={EmailIcon} />
                    <InfoRow label="Village" value={villageData.display_name} icon={HomeIcon} />
                  </Stack>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Damage Status Tab */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12}>
                  <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
                      <StatCard
                        icon={HomeIcon}
                        label="House Status"
                        value={formData.houseStatus}
                        color={
                          formData.houseStatus === 'Safe'
                            ? 'success'
                            : formData.houseStatus === 'Partially Damaged'
                            ? 'warning'
                            : 'error'
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <StatCard
                        icon={TerrainIcon}
                        label="Total Land"
                        value={`${formData.totalLandOwned || 0} acres`}
                        color="info"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                      <StatCard
                        icon={WarningIcon}
                        label="Land Affected"
                        value={`${formData.landAffected || 0} acres`}
                        color="error"
                        progress={parseFloat(landAffectedPercentage)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                
                <Grid item xs={12}>
                  <Card sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        fontSize: { xs: '1rem', sm: '1.25rem' }
                      }}
                    >
                      <CropIcon color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />
                      Crop Damage Details
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoRow label="Crops Planted" value={formData.cropsPlanted} />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoRow label="Crops Lost" value={formData.cropsLost} />
                      </Grid>
                      <Grid item xs={12} sm={12} md={4}>
                        <Box>
                          <Typography 
                            variant="subtitle2" 
                            color="text.secondary" 
                            sx={{ 
                              mb: 1,
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}
                          >
                            Estimated Loss
                          </Typography>
                          <Chip
                            label={`₹ ${formData.estimatedCropLoss?.toLocaleString() || 0}`}
                            color="error"
                            sx={{ 
                              fontSize: { xs: '0.875rem', sm: '1rem' }, 
                              fontWeight: 'bold', 
                              px: { xs: 1.5, sm: 2 }, 
                              py: { xs: 2, sm: 2.5 } 
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Help Required Tab */}
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                {[
                  { label: 'Tractor Leveling', value: formData.tractorLeveling, icon: AgricultureIcon },
                  { label: 'Manure/Fertilizer', value: formData.manureFertilizer, icon: CropIcon },
                  { label: 'Seeds Required', value: formData.seedsRequired, icon: CropIcon },
                  { label: 'Fertilizers/Pesticides', value: formData.fertilizersPesticides, icon: WaterIcon },
                  { label: 'Labor Requirement', value: formData.laborRequirement, icon: GroupIcon },
                  { label: 'Irrigation Repair', value: formData.irrigationRepair, icon: WaterIcon },
                  { label: 'Livestock Damage', value: formData.livestockDamage, icon: PetsIcon },
                  { label: 'Household Needs', value: formData.householdNeeds, icon: HomeIcon },
                  { label: 'Housing Repair', value: formData.housingRepair, icon: BuildIcon },
                  { label: 'Other Support', value: formData.otherSupport, icon: HelpIcon },
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} sx={{width:{xs:'100%',md:'49%'}}} key={index}>
                    <Card 
                      sx={{ 
                        p: { xs: 1.5, sm: 2 }, 
                        display: 'flex', 
                        alignItems: 'center',
                        transition: 'all 0.3s',
                        '&:hover': { boxShadow: 3, transform: 'translateX(4px)' }
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          bgcolor: 'primary.light', 
                          mr: { xs: 1.5, sm: 2 },
                          width: { xs: 40, sm: 48 },
                          height: { xs: 40, sm: 48 }
                        }}
                      >
                        <item.icon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                      </Avatar>
                      <Box flex={1}>
                        <Typography 
                          variant="subtitle2" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                          {item.label}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          fontWeight="bold"
                          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                        >
                          {item.value || 'Not specified'}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            {/* Verified By Tab */}
            <TabPanel value={tabValue} index={3}>
              <Card sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <VerifiedIcon 
                    sx={{ 
                      fontSize: { xs: 32, sm: 40 }, 
                      mr: 2,
                      color: verificationData.is_verified ? 'success.main' : 'warning.main'
                    }} 
                  />
                  <Box>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold"
                      sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                    >
                      Verification Status
                    </Typography>
                    <Chip
                      label={verificationData.is_verified ? 'Verified' : 'Pending Verification'}
                      color={verificationData.is_verified ? 'success' : 'warning'}
                      sx={{ 
                        mt: 1,
                        fontSize: { xs: '0.7rem', sm: '0.8125rem' }
                      }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {verificationData.surveyor_name ? (
                  <Grid container spacing={{ xs: 2, sm: 3 }}>
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <Avatar
                          src={verificationData.verification_image}
                          sx={{ 
                            width: { xs: 80, sm: 100 }, 
                            height: { xs: 80, sm: 100 }, 
                            mb: 2, 
                            boxShadow: 2 
                          }}
                          alt={verificationData.surveyor_name}
                        >
                          <VerifiedIcon sx={{ fontSize: { xs: 40, sm: 50 } }} />
                        </Avatar>
                        <Typography 
                          variant="h6" 
                          fontWeight="bold" 
                          textAlign="center"
                          sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                        >
                          {verificationData.surveyor_name}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                        >
                          Surveyor
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Stack spacing={{ xs: 2, sm: 3 }}>
                        <InfoRow label="Surveyor Name" value={verificationData.surveyor_name} />
                        <InfoRow 
                          label="Surveyor Mobile" 
                          value={verificationData.surveyor_mobile} 
                          icon={PhoneIcon}
                        />
                        <InfoRow label="Verification Date" value={verificationData.date} />
                      </Stack>
                    </Grid>
                  </Grid>
                ) : (
                  <Alert severity="info">
                    No verification details available yet.
                  </Alert>
                )}
              </Card>
            </TabPanel>

            {/* Notes Tab */}
            <TabPanel value={tabValue} index={4}>
              <Card sx={{ p: { xs: 2, sm: 3 }, minHeight: { xs: '150px', sm: '200px' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DescriptionIcon 
                    color="primary" 
                    sx={{ mr: 1, fontSize: { xs: 20, sm: 24 } }} 
                  />
                  <Typography 
                    variant="h6" 
                    fontWeight="bold"
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                  >
                    Additional Notes
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Typography
                  variant="body1"
                  sx={{ 
                    whiteSpace: 'pre-wrap', 
                    minHeight: { xs: '80px', sm: '100px' },
                    lineHeight: 1.8,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    color: formData.additionalNotes ? 'text.primary' : 'text.secondary'
                  }}
                >
                  {formData.additionalNotes || 'No additional notes provided.'}
                </Typography>
              </Card>
            </TabPanel>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default FarmerDetailsDialog;