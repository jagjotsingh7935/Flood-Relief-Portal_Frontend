import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  Button,
  Paper,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Divider,
  Stack,
  Card,
  CardContent,
  Tooltip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  LocationOn as LocationOnIcon,
  Cancel as CancelIcon,
  Public as PublicIcon,
  LocationCity as LocationCityIcon,
  Landscape as LandscapeIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  MyLocation as MyLocationIcon,
} from '@mui/icons-material';
import axios from 'axios';

export default function AddLocationData() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [villages, setVillages] = useState([]);

  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTehsil, setSelectedTehsil] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);

  const [newDistrictName, setNewDistrictName] = useState('');
  const [newTehsilName, setNewTehsilName] = useState('');
  const [newVillageName, setNewVillageName] = useState('');
  const [villageLat, setVillageLat] = useState('');
  const [villageLong, setVillageLong] = useState('');

  const [openLatLongDialog, setOpenLatLongDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [addingDistrict, setAddingDistrict] = useState(false);
  const [addingTehsil, setAddingTehsil] = useState(false);
  const [addingVillage, setAddingVillage] = useState(false);

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/floods/api/state/list/`);
      setStates(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch states. Please try again.',
        severity: 'error',
      });
      console.error('Error fetching states:', error);
    }
  };

  const fetchDistricts = async (stateId) => {
    try {
      const url = stateId
        ? `${import.meta.env.VITE_API_URL}/floods/api/district/list/?state_id=${stateId}`
        : `${import.meta.env.VITE_API_URL}/floods/api/district/list/`;
      const response = await axios.get(url);
      setDistricts(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch districts. Please try again.',
        severity: 'error',
      });
      console.error('Error fetching districts:', error);
    }
  };

  const fetchTehsils = async (districtId) => {
    try {
      const url = districtId
        ? `${import.meta.env.VITE_API_URL}/floods/api/tehsil/list/?district_name=${districtId}`
        : `${import.meta.env.VITE_API_URL}/floods/api/tehsil/list/`;
      const response = await axios.get(url);
      setTehsils(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch tehsils. Please try again.',
        severity: 'error',
      });
      console.error('Error fetching tehsils:', error);
    }
  };

  const fetchVillages = async (tehsilname) => {
    try {
      const url = tehsilname
        ? `${import.meta.env.VITE_API_URL}/floods/api/village/list/?tehsil_name=${tehsilname}`
        : `${import.meta.env.VITE_API_URL}/floods/api/village/list/`;
      const response = await axios.get(url);
      setVillages(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch villages. Please try again.',
        severity: 'error',
      });
      console.error('Error fetching villages:', error);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchDistricts(selectedState.state_id);
    } else {
      setDistricts([]);
      setSelectedDistrict(null);
      setTehsils([]);
      setSelectedTehsil(null);
      setVillages([]);
      setSelectedVillage(null);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchTehsils(selectedDistrict.name);
    } else {
      setTehsils([]);
      setSelectedTehsil(null);
      setVillages([]);
      setSelectedVillage(null);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedTehsil) {
      fetchVillages(selectedTehsil.name);
    } else {
      setVillages([]);
      setSelectedVillage(null);
    }
  }, [selectedTehsil]);

  const validateCoordinates = (lat, lon) => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    if (isNaN(latNum) || latNum < -90 || latNum > 90) {
      return 'Latitude must be a number between -90 and 90.';
    }
    if (isNaN(lonNum) || lonNum < -180 || lonNum > 180) {
      return 'Longitude must be a number between -180 and 180.';
    }
    return null;
  };

  const handleAddDistrict = async () => {
    if (!selectedState) {
      setSnackbar({
        open: true,
        message: 'Please select a state before adding a district.',
        severity: 'error',
      });
      return;
    }
    if (!newDistrictName) {
      setSnackbar({
        open: true,
        message: 'Please enter a district name.',
        severity: 'error',
      });
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/dataAddition/api/data/add/district/`, {
        state_id: selectedState.state_id,
        name: newDistrictName,
      });
      setSnackbar({
        open: true,
        message: 'District added successfully!',
        severity: 'success',
      });
      setDistricts([...districts, response.data]);
      setSelectedDistrict(response.data);
      setNewDistrictName('');
      setAddingDistrict(false);
      fetchDistricts(selectedState.state_id);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data || 'Failed to add district.',
        severity: 'error',
      });
      console.error('Error adding district:', error);
    }
  };

  const handleAddTehsil = async () => {
    if (!selectedDistrict) {
      setSnackbar({
        open: true,
        message: 'Please select a district before adding a tehsil.',
        severity: 'error',
      });
      return;
    }
    if (!newTehsilName) {
      setSnackbar({
        open: true,
        message: 'Please enter a tehsil name.',
        severity: 'error',
      });
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/dataAddition/api/data/add/tehsil/`, {
        district_id: selectedDistrict.id,
        name: newTehsilName,
      });
      setSnackbar({
        open: true,
        message: 'Tehsil added successfully!',
        severity: 'success',
      });
      setTehsils([...tehsils, response.data]);
      setSelectedTehsil(response.data);
      setNewTehsilName('');
      setAddingTehsil(false);
      fetchTehsils(selectedDistrict.name);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data || 'Failed to add tehsil.',
        severity: 'error',
      });
      console.error('Error adding tehsil:', error);
    }
  };

  const handleAddVillage = async () => {
    if (!selectedTehsil) {
      setSnackbar({
        open: true,
        message: 'Please select a tehsil before adding a village.',
        severity: 'error',
      });
      return;
    }
    if (!newVillageName) {
      setSnackbar({
        open: true,
        message: 'Please enter a village name.',
        severity: 'error',
      });
      return;
    }
    if (villageLat && villageLong) {
      const coordError = validateCoordinates(villageLat, villageLong);
      if (coordError) {
        setSnackbar({
          open: true,
          message: coordError,
          severity: 'error',
        });
        return;
      }
    }

    try {
      const payload = {
        tehsil_id: selectedTehsil.id,
        name: newVillageName,
      };
      if (villageLat && villageLong) {
        payload.latitude = parseFloat(villageLat);
        payload.longitude = parseFloat(villageLong);
      }
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/dataAddition/api/data/add/village/`, payload);
      setSnackbar({
        open: true,
        message: 'Village added successfully!',
        severity: 'success',
      });
      setVillages([...villages, response.data]);
      setSelectedVillage(response.data);
      setNewVillageName('');
      setVillageLat('');
      setVillageLong('');
      setAddingVillage(false);
      fetchVillages(selectedTehsil.name);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data || 'Failed to add village.',
        severity: 'error',
      });
      console.error('Error adding village:', error);
    }
  };

  const resetForm = () => {
    setSelectedState(null);
    setSelectedDistrict(null);
    setSelectedTehsil(null);
    setSelectedVillage(null);
    setNewDistrictName('');
    setNewTehsilName('');
    setNewVillageName('');
    setVillageLat('');
    setVillageLong('');
    setAddingDistrict(false);
    setAddingTehsil(false);
    setAddingVillage(false);
  };

  const handleStartAddingDistrict = () => {
    setAddingDistrict(true);
    setNewDistrictName('');
  };

  const handleStartAddingTehsil = () => {
    setAddingTehsil(true);
    setNewTehsilName('');
  };

  const handleStartAddingVillage = () => {
    setAddingVillage(true);
    setNewVillageName('');
  };

  const handleCancelAddingDistrict = () => {
    setAddingDistrict(false);
    setNewDistrictName('');
  };

  const handleCancelAddingTehsil = () => {
    setAddingTehsil(false);
    setNewTehsilName('');
  };

  const handleCancelAddingVillage = () => {
    setAddingVillage(false);
    setNewVillageName('');
    setVillageLat('');
    setVillageLong('');
  };

  const hasData = selectedState || newDistrictName || newTehsilName || newVillageName;

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}>
            <LocationOnIcon sx={{ fontSize: { xs: 40, sm: 48 }, color: 'primary.main' }} />
            <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
              Location Data Management
            </Typography>
          </Box>
          
        </Box>

        {/* Main Form */}
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 3, borderRadius: 3, bgcolor: 'white' }}>
          <Stack spacing={3}>
            {/* State Selection */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <PublicIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  State
                </Typography>
                <Chip label="Required" size="small" color="error" sx={{ height: 20, fontSize: '0.7rem' }} />
                <Tooltip title="Select the state from the dropdown" placement="right">
                  <InfoIcon sx={{ fontSize: 18, color: 'text.secondary', cursor: 'help' }} />
                </Tooltip>
              </Box>
              <Autocomplete
                options={states}
                getOptionLabel={(option) => option.name || ''}
                value={selectedState}
                onChange={(e, newValue) => {
                  setSelectedState(newValue);
                  setSelectedDistrict(null);
                  setSelectedTehsil(null);
                  setSelectedVillage(null);
                  setAddingDistrict(false);
                  setAddingTehsil(false);
                  setAddingVillage(false);
                }}
                disabled={addingDistrict || addingTehsil || addingVillage}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Choose a state to begin"
                    size="medium"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <PublicIcon sx={{ color: 'action.active' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                fullWidth
              />
              {selectedState && (
                <Chip
                  label={selectedState.name}
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* District Selection */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <LocationCityIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  District
                </Typography>
                <Chip label="Required" size="small" color="error" sx={{ height: 20, fontSize: '0.7rem' }} />
                <Tooltip title="Select an existing district or add a new one" placement="right">
                  <InfoIcon sx={{ fontSize: 18, color: 'text.secondary', cursor: 'help' }} />
                </Tooltip>
              </Box>
              
              {!addingDistrict ? (
                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Autocomplete
                      options={districts}
                      getOptionLabel={(option) => option.name || ''}
                      value={selectedDistrict}
                      onChange={(e, newValue) => {
                        setSelectedDistrict(newValue);
                        setSelectedTehsil(null);
                        setSelectedVillage(null);
                        setAddingTehsil(false);
                        setAddingVillage(false);
                      }}
                      disabled={!selectedState || addingTehsil || addingVillage}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select existing district"
                          size="medium"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationCityIcon sx={{ color: 'action.active' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      sx={{ flex: 1 }}
                    />
                    <Tooltip title="Add a new district">
                      <span>
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={handleStartAddingDistrict}
                          disabled={!selectedState || addingTehsil || addingVillage}
                          sx={{ minWidth: { xs: '100%', sm: 140 }, height: 56 }}
                        >
                          Add New
                        </Button>
                      </span>
                    </Tooltip>
                  </Stack>
                  {selectedDistrict && (
                    <Chip
                      label={selectedDistrict.name}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Stack>
              ) : (
                <Card variant="outlined" sx={{ p: 2, bgcolor: 'primary.50', borderColor: 'primary.main' }}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                      Adding New District
                    </Typography>
                    <TextField
                      fullWidth
                      label="District Name"
                      value={newDistrictName}
                      onChange={(e) => setNewDistrictName(e.target.value)}
                      size="medium"
                      placeholder="Enter district name"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationCityIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Tooltip title="Save the new district">
                        <span style={{ flex: 1 }}>
                          <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleAddDistrict}
                            disabled={!newDistrictName}
                            fullWidth
                          >
                            Save District
                          </Button>
                        </span>
                      </Tooltip>
                      <Tooltip title="Cancel adding district">
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={handleCancelAddingDistrict}
                          sx={{ flex: 1 }}
                        >
                          Cancel
                        </Button>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Card>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Tehsil Selection */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <LandscapeIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Tehsil / Taluka
                </Typography>
                <Chip label="Required" size="small" color="error" sx={{ height: 20, fontSize: '0.7rem' }} />
                <Tooltip title="Select an existing tehsil or add a new one" placement="right">
                  <InfoIcon sx={{ fontSize: 18, color: 'text.secondary', cursor: 'help' }} />
                </Tooltip>
              </Box>
              
              {!addingTehsil ? (
                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Autocomplete
                      options={tehsils}
                      getOptionLabel={(option) => option.name || ''}
                      value={selectedTehsil}
                      onChange={(e, newValue) => {
                        setSelectedTehsil(newValue);
                        setSelectedVillage(null);
                        setAddingVillage(false);
                      }}
                      disabled={(!selectedDistrict && !addingDistrict) || addingVillage}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select existing tehsil"
                          size="medium"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <LandscapeIcon sx={{ color: 'action.active' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      sx={{ flex: 1 }}
                    />
                    <Tooltip title="Add a new tehsil">
                      <span>
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={handleStartAddingTehsil}
                          disabled={(!selectedDistrict && !addingDistrict) || addingVillage}
                          sx={{ minWidth: { xs: '100%', sm: 140 }, height: 56 }}
                        >
                          Add New
                        </Button>
                      </span>
                    </Tooltip>
                  </Stack>
                  {selectedTehsil && (
                    <Chip
                      label={selectedTehsil.name}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Stack>
              ) : (
                <Card variant="outlined" sx={{ p: 2, bgcolor: 'primary.50', borderColor: 'primary.main' }}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                      Adding New Tehsil
                    </Typography>
                    <TextField
                      fullWidth
                      label="Tehsil Name"
                      value={newTehsilName}
                      onChange={(e) => setNewTehsilName(e.target.value)}
                      size="medium"
                      placeholder="Enter tehsil name"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LandscapeIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Tooltip title="Save the new tehsil">
                        <span style={{ flex: 1 }}>
                          <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleAddTehsil}
                            disabled={!newTehsilName}
                            fullWidth
                          >
                            Save Tehsil
                          </Button>
                        </span>
                      </Tooltip>
                      <Tooltip title="Cancel adding tehsil">
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={handleCancelAddingTehsil}
                          sx={{ flex: 1 }}
                        >
                          Cancel
                        </Button>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Card>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Village Selection */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <HomeIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Village
                </Typography>
                <Chip label="Required" size="small" color="error" sx={{ height: 20, fontSize: '0.7rem' }} />
                <Tooltip title="Select an existing village or add a new one with optional coordinates" placement="right">
                  <InfoIcon sx={{ fontSize: 18, color: 'text.secondary', cursor: 'help' }} />
                </Tooltip>
              </Box>
              
              {!addingVillage ? (
                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Autocomplete
                      options={villages}
                      getOptionLabel={(option) => option.name || ''}
                      value={selectedVillage}
                      onChange={(e, newValue) => {
                        setSelectedVillage(newValue);
                      }}
                      disabled={(!selectedTehsil && !addingTehsil)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select existing village"
                          size="medium"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <HomeIcon sx={{ color: 'action.active' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      sx={{ flex: 1 }}
                    />
                    <Tooltip title="Add a new village">
                      <span>
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={handleStartAddingVillage}
                          disabled={(!selectedTehsil && !addingTehsil)}
                          sx={{ minWidth: { xs: '100%', sm: 140 }, height: 56 }}
                        >
                          Add New
                        </Button>
                      </span>
                    </Tooltip>
                  </Stack>
                  {selectedVillage && (
                    <Chip
                      label={selectedVillage.name}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Stack>
              ) : (
                <Card variant="outlined" sx={{ p: 2, bgcolor: 'primary.50', borderColor: 'primary.main' }}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                      Adding New Village
                    </Typography>
                    <TextField
                      fullWidth
                      label="Village Name"
                      value={newVillageName}
                      onChange={(e) => setNewVillageName(e.target.value)}
                      size="medium"
                      placeholder="Enter village name"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <MyLocationIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Coordinates (Optional)
                      </Typography>
                    </Box>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Tooltip title="Enter latitude between -90 and 90">
                        <TextField
                          fullWidth
                          label="Latitude"
                          type="number"
                          value={villageLat}
                          onChange={(e) => setVillageLat(e.target.value)}
                          placeholder="-90 to 90"
                          inputProps={{ min: -90, max: 90, step: 'any' }}
                          size="medium"
                        />
                      </Tooltip>
                      <Tooltip title="Enter longitude between -180 and 180">
                        <TextField
                          fullWidth
                          label="Longitude"
                          type="number"
                          value={villageLong}
                          onChange={(e) => setVillageLong(e.target.value)}
                          placeholder="-180 to 180"
                          inputProps={{ min: -180, max: 180, step: 'any' }}
                          size="medium"
                        />
                      </Tooltip>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Tooltip title="Save the new village">
                        <span style={{ flex: 1 }}>
                          <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleAddVillage}
                            disabled={!newVillageName}
                            fullWidth
                          >
                            Save Village
                          </Button>
                        </span>
                      </Tooltip>
                      <Tooltip title="Cancel adding village">
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={handleCancelAddingVillage}
                          sx={{ flex: 1 }}
                        >
                          Cancel
                        </Button>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Card>
              )}
            </Box>
          </Stack>

          {/* Action Buttons */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="flex-end"
            >
              <Tooltip title="Reset all fields and start over">
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={resetForm}
                  sx={{ minWidth: { xs: '100%', sm: 120 } }}
                >
                  Reset Form
                </Button>
              </Tooltip>
            </Stack>
          </Box>
        </Paper>

        {/* Summary Card */}
        {/* {hasData && (
          <Card 
            elevation={2} 
            sx={{ 
              borderRadius: 3, 
              border: '2px solid', 
              borderColor: 'primary.main',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ bgcolor: 'primary.main', color: 'white', px: 3, py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Location Hierarchy Summary
                </Typography>
              </Box>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                {selectedState && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
                      <PublicIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        State:
                      </Typography>
                    </Box>
                    <Chip
                      label={selectedState.name}
                      color="primary"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>
                )}
                
                {(selectedDistrict || newDistrictName) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
                      <LocationCityIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        District:
                      </Typography>
                    </Box>
                    <Chip
                      label={selectedDistrict?.name || newDistrictName}
                      color={newDistrictName ? 'secondary' : 'primary'}
                      sx={{ fontWeight: 500 }}
                    />
                    {newDistrictName && (
                      <Chip
                        label="New Entry"
                        size="small"
                        color="success"
                        sx={{ height: 24 }}
                      />
                    )}
                  </Box>
                )}
                
                {(selectedTehsil || newTehsilName) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
                      <LandscapeIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        Tehsil:
                      </Typography>
                    </Box>
                    <Chip
                      label={selectedTehsil?.name || newTehsilName}
                      color={newTehsilName ? 'secondary' : 'primary'}
                      sx={{ fontWeight: 500 }}
                    />
                    {newTehsilName && (
                      <Chip
                        label="New Entry"
                        size="small"
                        color="success"
                        sx={{ height: 24 }}
                      />
                    )}
                  </Box>
                )}
                
                {(selectedVillage || newVillageName) && (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
                        <HomeIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          Village:
                        </Typography>
                      </Box>
                      <Chip
                        label={selectedVillage?.name || newVillageName}
                        color={newVillageName ? 'secondary' : 'primary'}
                        sx={{ fontWeight: 500 }}
                      />
                      {newVillageName && (
                        <Chip
                          label="New Entry"
                          size="small"
                          color="success"
                          sx={{ height: 24 }}
                        />
                      )}
                    </Box>
                    {(villageLat || villageLong) && (
                      <Box sx={{ ml: { xs: 0, sm: 15 }, mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Tooltip title="Geographic coordinates">
                          <Chip
                            icon={<MyLocationIcon />}
                            label={`Lat: ${villageLat || 'N/A'}, Long: ${villageLong || 'N/A'}`}
                            variant="outlined"
                            size="small"
                            color="info"
                          />
                        </Tooltip>
                      </Box>
                    )}
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        )} */}
      </Box>

      {/* Dialogs and Notifications */}
      <Dialog 
        open={openLatLongDialog} 
        onClose={() => setOpenLatLongDialog(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon color="warning" />
          Coordinates Required
        </DialogTitle>
        <DialogContent>
          <Typography>
            Please provide both latitude and longitude for the new village before saving.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenLatLongDialog(false)} variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}