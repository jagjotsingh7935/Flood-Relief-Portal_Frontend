import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Container,
  TablePagination,
  FormHelperText,
  useTheme,
  useMediaQuery,
  Grid,
  Stack,
} from '@mui/material';
import { Icon } from '@iconify/react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PinCodeDataComponentAdmin = () => {
  const [villages, setVillages] = useState([]);
  const [selectedVillageId, setSelectedVillageId] = useState(null);
  const [selectedVillageName, setSelectedVillageName] = useState('');
  const [selectedVillageCoords, setSelectedVillageCoords] = useState({ latitude: null, longitude: null });
  const [farmerData, setFarmerData] = useState([]);
  const [affectedVillageData, setAffectedVillageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [severity, setSeverity] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(null);
  const [openSuggestionsDialog, setOpenSuggestionsDialog] = useState(false);
  const [coordinates, setCoordinates] = useState({ latitude: 'N/A', longitude: 'N/A' });
  const [coordLoading, setCoordLoading] = useState(false);
  const [coordError, setCoordError] = useState(null);
  const [population, setPopulation] = useState('');
  const [unpopulation, setUnPopulation] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [processedCount, setProcessedCount] = useState(0);
  const [unprocessedCount, setUnprocessedCount] = useState(0);
  const [updatePopulationLoading, setUpdatePopulationLoading] = useState(false);
  const [updatePopulationError, setUpdatePopulationError] = useState(null);
  const [updatePopulationSuccess, setUpdatePopulationSuccess] = useState(null);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Fetch villages on component mount
  useEffect(() => {
    const fetchVillages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/floods/api/village/list/for/add/data/`);
        setVillages(response.data);
      } catch (err) {
        setError('Failed to fetch villages. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchVillages();
  }, []);

  // Initialize map and update when village is selected
  useEffect(() => {
    if (typeof window !== 'undefined' && !mapRef.current) {
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        const map = L.map('map').setView([20.5937, 78.9629], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
        mapRef.current = map;
      }
    }

    // Update map when village coordinates are available
    if (selectedVillageCoords.latitude && selectedVillageCoords.longitude) {
      const { latitude, longitude } = selectedVillageCoords;
      
      try {
        setCoordLoading(true);
        setCoordError(null);
        
        // Use the coordinates directly from the village data
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          setCoordinates({ latitude: lat, longitude: lng });
          
          if (mapRef.current) {
            // Clear existing marker
            if (markerRef.current) {
              mapRef.current.removeLayer(markerRef.current);
            }
            
            // Set map view to the selected village coordinates
            mapRef.current.setView([lat, lng], 12);
            
            // Add marker for the selected village
            const marker = L.marker([lat, lng])
              .addTo(mapRef.current)
              .bindPopup(`Village: ${selectedVillageName}<br>Lat: ${lat}<br>Lon: ${lng}`)
              .openPopup();
            
            markerRef.current = marker;
          }
        } else {
          setCoordError('Invalid coordinates for this village.');
          setCoordinates({ latitude: 'N/A', longitude: 'N/A' });
        }
      } catch (err) {
        setCoordError('Failed to process coordinates. Please try again.');
        setCoordinates({ latitude: 'N/A', longitude: 'N/A' });
      } finally {
        setCoordLoading(false);
      }
    }
  }, [selectedVillageCoords, selectedVillageName]);

  // Fetch person data, affected village data, and counts when village is selected
  useEffect(() => {
    const fetchData = async (newPage = 0) => {
      if (selectedVillageId) {
        try {
          setLoading(true);
          setError(null);
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/floods/api/processed/unprocessed/count/?village_id=${selectedVillageId}`
          );
          setFarmerData(response.data.person_data || []);
          setPlaceName(response.data.affected_village_map_data[0]?.popup || selectedVillageName);
          setSeverity(response.data.affected_village_map_data[0]?.severity || '');
          setUnPopulation(response.data.unprocessed_count || 0);
          setAffectedVillageData(response.data.affected_village_map_data || []);
          setTotalCount(response.data.person_data_count || 0);
          setProcessedCount(response.data.processed_count || 0);
          setUnprocessedCount(response.data.unprocessed_count || 0);
          if (response.data.affected_village_map_data && response.data.affected_village_map_data.length > 0) {
            setPopulation(response.data.affected_village_map_data[0].population || 0);
          } else {
            setPopulation(0);
          }
        } catch (err) {
          setError('Failed to fetch data. Please try again.');
          setFarmerData([]);
          setAffectedVillageData([]);
          setTotalCount(0);
          setProcessedCount(0);
          setUnprocessedCount(0);
          setPopulation('');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData(page);
  }, [selectedVillageId, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleFetchSuggestions = async () => {
    if (selectedVillageId) {
      try {
        setSuggestionsLoading(true);
        setSuggestionsError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/floods/api/village/display/names/?village_id=${selectedVillageId}`
        );
        setSuggestions(response.data.display_names);
        setOpenSuggestionsDialog(true);
      } catch (err) {
        setSuggestionsError('Failed to fetch village name suggestions.');
      } finally {
        setSuggestionsLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (
      !placeName ||
      !severity ||
      coordinates.latitude === 'N/A' ||
      coordinates.longitude === 'N/A' ||
      unprocessedCount === 0
    ) {
      setSubmitError('Please fill in all fields, ensure valid coordinates, and unprocessed count > 0.');
      return;
    }

    const payload = {
      village_id: selectedVillageId,
      popup: placeName,
      center: coordinates,
      zoom: 10,
      marker: coordinates,
      radius: 600,
      severity: severity,
      population: unprocessedCount,
    };

    try {
      setSubmitLoading(true);
      setSubmitError(null);
      setSubmitSuccess(null);
      await axios.post(`${import.meta.env.VITE_API_URL}/floods/api/add/affected/village/`, payload);
      setSubmitSuccess('Village data added successfully!');
      setPlaceName('');
      setSeverity('');
    } catch (err) {
      setSubmitError('Failed to submit village data. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUpdatePopulation = async () => {
    if (!selectedVillageId || unprocessedCount === 0) {
      setUpdatePopulationError('Please enter a valid population number and ensure unprocessed count > 0.');
      return;
    }

    const payload = {
      village_id: selectedVillageId,
      population_increament: parseInt(unprocessedCount),
    };

    try {
      setUpdatePopulationLoading(true);
      setUpdatePopulationError(null);
      setUpdatePopulationSuccess(null);
      if (processedCount === 0) {
        const postPayload = {
          village_id: selectedVillageId,
          popup: placeName,
          center: coordinates,
          zoom: 13,
          marker: coordinates,
          radius: 800,
          severity: severity || 'low',
          population: parseInt(unprocessedCount),
        };
        await axios.post(`${import.meta.env.VITE_API_URL}/floods/api/add/affected/village/`, postPayload);
      } else {
        await axios.patch(`${import.meta.env.VITE_API_URL}/floods/api/update/affected/village/population/`, payload);
      }
      setUpdatePopulationSuccess('Population updated successfully!');
    } catch (err) {
      setUpdatePopulationError('Failed to update population. Please try again.');
    } finally {
      setUpdatePopulationLoading(false);
    }
  };

  const handleSuggestionSelect = (name) => {
    setPlaceName(name);
    setOpenSuggestionsDialog(false);
  };

  // Handle village selection
  const handleVillageSelect = (event, newValue) => {
    if (newValue) {
      setSelectedVillageId(newValue.id);
      setSelectedVillageName(newValue.name);
      setSelectedVillageCoords({
        latitude: newValue.latitude,
        longitude: newValue.longitude
      });
      setPage(0);
    } else {
      setSelectedVillageId(null);
      setSelectedVillageName('');
      setSelectedVillageCoords({ latitude: null, longitude: null });
      setCoordinates({ latitude: 'N/A', longitude: 'N/A' });
    }
  };

  // Responsive card component for mobile view
  const MobileCard = ({ data, type }) => {
    if (type === 'person') {
      return data.map((person) => (
        <Card key={person.id} sx={{ mb: 2, boxShadow: 2 }}>
          <CardContent>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon icon="mdi:account" width={20} height={20} color="#1976d2" />
                <Typography variant="subtitle2" color="text.secondary">Farmer Name:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{person.farmer_name || 'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon icon="mdi:map-marker" width={20} height={20} color="#1976d2" />
                <Typography variant="subtitle2" color="text.secondary">Village:</Typography>
                <Typography variant="body2">{person.village_display_name || 'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label={person.is_active ? 'Active' : 'Inactive'} size="small" color={person.is_active ? 'success' : 'default'} />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ));
    } else if (type === 'village') {
      return data.map((village, index) => (
        <Card key={index} sx={{ mb: 2, boxShadow: 2 }}>
          <CardContent>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon icon="mdi:city" width={20} height={20} color="#1976d2" />
                <Typography variant="subtitle2" color="text.secondary">Place:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{village.popup || 'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon icon="mdi:pin" width={20} height={20} color="#1976d2" />
                <Typography variant="subtitle2" color="text.secondary">Village ID:</Typography>
                <Typography variant="body2">{village.village_id || 'N/A'}</Typography>
              </Box>
              <Divider />
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Center Lat:</Typography>
                  <Typography variant="body2">{village.center?.latitude || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Center Lon:</Typography>
                  <Typography variant="body2">{village.center?.longitude || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Marker Lat:</Typography>
                  <Typography variant="body2">{village.marker?.latitude || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Marker Lon:</Typography>
                  <Typography variant="body2">{village.marker?.longitude || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">Zoom:</Typography>
                  <Typography variant="body2">{village.zoom || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">Radius:</Typography>
                  <Typography variant="body2">{village.radius || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">Population:</Typography>
                  <Typography variant="body2">{village.population || 'N/A'}</Typography>
                </Grid>
              </Grid>
              <Box>
                <Chip 
                  label={`Severity: ${village.severity || 'N/A'}`} 
                  size="small" 
                  color={village.severity === 'high' ? 'error' : village.severity === 'medium' ? 'warning' : 'success'} 
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ));
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1, sm: 2 } }}>
      <Card sx={{ mb: { xs: 2, sm: 4 }, borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
            <Icon icon="mdi:map-marker" width={isMobile ? 24 : 28} height={isMobile ? 24 : 28} color="#1976d2" />
            <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Village Data Explorer
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Autocomplete
              options={villages}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Village"
                  variant="outlined"
                  helperText="Select a village to fetch farmer data and coordinates."
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <Icon icon="mdi:city" width={20} height={20} color="#757575" style={{ marginRight: 8 }} />
                    ),
                  }}
                />
              )}
              value={villages.find(village => village.id === selectedVillageId) || null}
              onChange={handleVillageSelect}
              loading={loading}
              disabled={loading}
              fullWidth
            />
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress size={40} />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Icon icon="mdi:alert-circle" width={24} height={24} style={{ marginRight: 8 }} />
                {error}
              </Box>
            </Alert>
          )}
        </CardContent>
      </Card>

      {selectedVillageId && (
        <Card sx={{ mb: { xs: 2, sm: 4 }, borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Add Affected Village for: <Chip label={selectedVillageName} color="primary" size="small" />
            </Typography>
            
            <Box sx={{ mb: 3, height: { xs: 250, sm: 300, md: 400 }, borderRadius: 2, overflow: 'hidden' }}>
              <div id="map" style={{ height: '100%', width: '100%' }} />
              {coordLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                  <CircularProgress size={30} />
                </Box>
              )}
              {coordError && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                  {coordError}
                </Alert>
              )}
              {!coordLoading && !coordError && (
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Coordinates: Lat: {coordinates.latitude}, Lon: {coordinates.longitude}
                </Typography>
              )}
            </Box>

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  label="Place Name"
                  variant="outlined"
                  value={placeName}
                  disabled={true}
                  onChange={(e) => setPlaceName(e.target.value)}
                  color='#3c3c3c'
                  InputProps={{
                    startAdornment: (
                      <Icon icon="mdi:city" width={20} height={20} color="#757575" style={{ marginRight: 8 }} />
                    ),
                  }}
                  fullWidth
                  helperText="Enter the village or place name for the affected area."
                />
                {/* <Button
                  variant="outlined"
                  startIcon={<Icon icon="mdi:lightbulb" />}
                  onClick={handleFetchSuggestions}
                  disabled={suggestionsLoading || !selectedVillageId}
                  sx={{ 
                    borderRadius: 2, 
                    textTransform: 'none', 
                    px: 3, 
                    minWidth: { xs: '100%', sm: 'auto' },
                    whiteSpace: 'nowrap'
                  }}
                >
                  {suggestionsLoading ? <CircularProgress size={24} /> : 'Suggestions'}
                </Button> */}
              </Box>

              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  label="Severity"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
                <FormHelperText>Select the severity level of the flood impact.</FormHelperText>
              </FormControl>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Population Processed"
                    type="number"
                    variant="outlined"
                    disabled={true}
                    value={population}
                    onChange={(e) => setPopulation(e.target.value)}
                    InputProps={{
                      inputProps: { min: 0 },
                      startAdornment: (
                        <Icon icon="mdi:account-group" width={20} height={20} color="#757575" style={{ marginRight: 8 }} />
                      ),
                    }}
                    fullWidth
                    helperText="Population for the affected village."
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Population Unprocessed"
                    type="number"
                    variant="outlined"
                    disabled={true}
                    value={unpopulation}
                    onChange={(e) => setUnPopulation(e.target.value)}
                    InputProps={{
                      inputProps: { min: 0 },
                      startAdornment: (
                        <Icon icon="mdi:account-group" width={20} height={20} color="#757575" style={{ marginRight: 8 }} />
                      ),
                    }}
                    fullWidth
                    helperText="Unprocessed population count."
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip label={`Processed: ${processedCount}`} color={processedCount > 0 ? 'success' : 'default'} />
                <Chip label={`Unprocessed: ${unprocessedCount}`} color={unprocessedCount > 0 ? 'warning' : 'default'} />
              </Box>

              {updatePopulationError && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Icon icon="mdi:alert-circle" width={24} height={24} style={{ marginRight: 8 }} />
                    {updatePopulationError}
                  </Box>
                </Alert>
              )}

              {updatePopulationSuccess && (
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Icon icon="mdi:check-circle" width={24} height={24} style={{ marginRight: 8 }} />
                    {updatePopulationSuccess}
                  </Box>
                </Alert>
              )}

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'flex-end' }}>
                {processedCount === 0 && unprocessedCount > 0 && (
                  <Button
                    variant="contained"
                    startIcon={<Icon icon="mdi:content-save" />}
                    onClick={handleSubmit}
                    disabled={
                      submitLoading ||
                      coordLoading ||
                      coordinates.latitude === 'N/A' ||
                      unprocessedCount === 0 ||
                      !placeName ||
                      !severity
                    }
                    sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
                    fullWidth={isMobile}
                  >
                    {submitLoading ? <CircularProgress size={24} /> : 'Submit New Village'}
                  </Button>
                )}

                {processedCount > 0 && unprocessedCount > 0 && (
                  <Button
                    variant="contained"
                    startIcon={<Icon icon="mdi:update" />}
                    onClick={handleUpdatePopulation}
                    disabled={
                      updatePopulationLoading ||
                      !selectedVillageId ||
                      !population ||
                      unprocessedCount === 0
                    }
                    sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
                    fullWidth={isMobile}
                  >
                    {updatePopulationLoading ? <CircularProgress size={24} /> : 'Update Population'}
                  </Button>
                )}
              </Stack>

              {selectedVillageId && unprocessedCount === 0 && (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  <Icon icon="mdi:information" width={20} height={20} style={{ marginRight: 8 }} />
                  No unprocessed count available. Cannot submit or update.
                </Alert>
              )}

              {submitError && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Icon icon="mdi:alert-circle" width={24} height={24} style={{ marginRight: 8 }} />
                    {submitError}
                  </Box>
                </Alert>
              )}

              {submitSuccess && (
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Icon icon="mdi:check-circle" width={24} height={24} style={{ marginRight: 8 }} />
                    {submitSuccess}
                  </Box>
                </Alert>
              )}

              {suggestionsError && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Icon icon="mdi:alert-circle" width={24} height={24} style={{ marginRight: 8 }} />
                    {suggestionsError}
                  </Box>
                </Alert>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Rest of the component remains the same */}
      <Dialog
        open={openSuggestionsDialog}
        onClose={() => setOpenSuggestionsDialog(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Icon icon="mdi:lightbulb" width={24} height={24} color="#1976d2" style={{ marginRight: 8 }} />
            Village Name Suggestions
          </Box>
        </DialogTitle>
        <DialogContent>
          {suggestions.length > 0 ? (
            <List>
              {suggestions.map((name, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={() => handleSuggestionSelect(name)}
                  sx={{ borderRadius: 1, '&:hover': { bgcolor: 'grey.100' } }}
                >
                  <ListItemText primary={name} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No suggestions available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenSuggestionsDialog(false)}
            startIcon={<Icon icon="mdi:close" />}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {selectedVillageId && (
        <Card sx={{ borderRadius: 3, boxShadow: 3, mb: { xs: 2, sm: 4 } }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Affected Village Data for: <Chip label={selectedVillageName} color="primary" size="small" />
            </Typography>
            {affectedVillageData && affectedVillageData.length > 0 ? (
              <>
                {isMobile || isTablet ? (
                  <MobileCard data={affectedVillageData} type="village" />
                ) : (
                  <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 650 }}>
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.light' }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                              <Icon icon="mdi:pin" width={20} height={20} style={{ marginRight: 8 }} />
                              Village ID
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                              <Icon icon="mdi:city" width={20} height={20} style={{ marginRight: 8 }} />
                              Place Name
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                              <Icon icon="mdi:map-marker" width={20} height={20} style={{ marginRight: 8 }} />
                              Center Lat
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                              <Icon icon="mdi:map-marker" width={20} height={20} style={{ marginRight: 8 }} />
                              Center Lon
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                              <Icon icon="mdi:magnify-plus" width={20} height={20} style={{ marginRight: 8 }} />
                              Zoom
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                              <Icon icon="mdi:map-marker" width={20} height={20} style={{ marginRight: 8 }} />
                              Marker Lat
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                              <Icon icon="mdi:map-marker" width={20} height={20} style={{ marginRight: 8 }} />
                              Marker Lon
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                              <Icon icon="mdi:radius" width={20} height={20} style={{ marginRight: 8 }} />
                              Radius
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                              <Icon icon="mdi:alert" width={20} height={20} style={{ marginRight: 8 }} />
                              Severity
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                              <Icon icon="mdi:account-group" width={20} height={20} style={{ marginRight: 8 }} />
                              Population
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {affectedVillageData.map((village, index) => (
                          <TableRow key={index} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                            <TableCell>{village.village_id || 'N/A'}</TableCell>
                            <TableCell>{village.popup || 'N/A'}</TableCell>
                            <TableCell>{village.center?.latitude || 'N/A'}</TableCell>
                            <TableCell>{village.center?.longitude || 'N/A'}</TableCell>
                            <TableCell>{village.zoom || 'N/A'}</TableCell>
                            <TableCell>{village.marker?.latitude || 'N/A'}</TableCell>
                            <TableCell>{village.marker?.longitude || 'N/A'}</TableCell>
                            <TableCell>{village.radius || 'N/A'}</TableCell>
                            <TableCell>{village.severity || 'N/A'}</TableCell>
                            <TableCell>{village.population || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </>
            ) : (
              <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}>
                No affected village data available
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      {selectedVillageId && (
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Person Data for: <Chip label={selectedVillageName} color="primary" size="small" />
            </Typography>
            {farmerData && farmerData.length > 0 ? (
              <>
                {isMobile || isTablet ? (
                  <MobileCard data={farmerData} type="person" />
                ) : (
                  <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 650 }}>
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.light' }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                              <Icon icon="mdi:account" width={20} height={20} style={{ marginRight: 8 }} />
                              Farmer Name
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                              <Icon icon="mdi:map-marker" width={20} height={20} style={{ marginRight: 8 }} />
                              Village
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                              <Icon icon="mdi:pin" width={20} height={20} style={{ marginRight: 8 }} />
                              Village ID
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                              <Icon icon="mdi:check-circle" width={20} height={20} style={{ marginRight: 8 }} />
                              Active
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                              <Icon icon="mdi:account" width={20} height={20} style={{ marginRight: 8 }} />
                              Single User
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {farmerData.map((person) => (
                          <TableRow key={person.id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                            <TableCell>{person.farmer_name || 'N/A'}</TableCell>
                            <TableCell>{person.village_display_name || 'N/A'}</TableCell>
                            <TableCell>{person.village_id || 'N/A'}</TableCell>
                            <TableCell>{person.is_active ? 'Yes' : 'No'}</TableCell>
                            <TableCell>{person.is_single_user ? 'Yes' : 'No'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={totalCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }
                  }}
                />
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Icon icon="mdi:counter" width={22} height={22} color="#1976d2" />
                    Total Persons: <Chip label={totalCount} variant="soft" color='warning' />
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}>
                No person data available
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default PinCodeDataComponentAdmin;