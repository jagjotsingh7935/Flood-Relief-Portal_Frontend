import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  useMediaQuery,
  IconButton,
  Tooltip,
  AppBar,
  Toolbar,
  Fab,
  Stack,
  LinearProgress,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  createTheme,
  ThemeProvider,
  CssBaseline,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Input,
  FormControl,
  InputLabel,
  Snackbar,
} from '@mui/material';
import { Icon } from '@iconify/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'

const LocationDetailsDialog = ({ open, onClose, selectedPlace }) => {
  const [uploadFile, setUploadFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setUploadFile(file);
      console.log('Selected file:', file);
    } else {
      alert('Please select a valid Excel file (.xlsx or .xls)');
      event.target.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    window.open('/path/to/template.xlsx', '_blank');
  };

  const handleUpload = () => {
    if (uploadFile) {
      console.log('Uploading file:', uploadFile);
      alert('File uploaded successfully!');
      setUploadFile(null);
      onClose();
    } else {
      alert('Please select a file to upload.');
    }
  };

  if (!selectedPlace) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}>
        Location Details: {selectedPlace.label}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Location Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Name:</strong> {selectedPlace.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Type:</strong> {selectedPlace.type}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Latitude:</strong> {selectedPlace.lat.toFixed(4)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Longitude:</strong> {selectedPlace.lng.toFixed(4)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Download Template
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Download the Excel template for data entry:
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Icon icon="mdi:download" />}
              onClick={handleDownloadTemplate}
              fullWidth
            >
              Download Template.xlsx
            </Button>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Upload Excel File
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Upload your completed Excel file (only .xlsx or .xls allowed):
            </Typography>
            <FormControl fullWidth>
              <InputLabel htmlFor="upload-excel">Choose Excel File</InputLabel>
              <Input
                id="upload-excel"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                inputProps={{ 'aria-label': 'Upload Excel file' }}
              />
            </FormControl>
            {uploadFile && (
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                Selected: {uploadFile.name}
              </Typography>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleUpload} variant="contained" color="primary" disabled={!uploadFile}>
          Upload and Proceed to Dashboard
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DRAWER_WIDTH = 360;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00d4ff', dark: '#00b8e6', light: '#33dcff' },
    secondary: { main: '#ff4081', dark: '#c60055', light: '#ff79b0' },
    background: { default: '#0a0a0a', paper: '#1a1a1a' },
    error: { main: '#ff5252' },
    warning: { main: '#ffb74d' },
    success: { main: '#69f0ae' },
    text: { primary: '#ffffff', secondary: '#b0b0b0' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)',
          border: '1px solid #333',
          borderRadius: 16,
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
  },
});

const defaultAffectedVillages = ['kubba', 'goslan', 'madpur', 'ajnala', 'dode'];

const villageData = {
  kubba: { center: [30.9000, 75.8500], zoom: 14, marker: [30.9000, 75.8500], popup: 'Kubba, Ludhiana', radius: 500, severity: 'high', population: 3500 },
  goslan: { center: [30.9100, 75.8600], zoom: 14, marker: [30.9100, 75.8600], popup: 'Goslan, Ludhiana', radius: 600, severity: 'medium', population: 4200 },
  madpur: { center: [30.9200, 75.8700], zoom: 14, marker: [30.9200, 75.8700], popup: 'Madpur, Ludhiana', radius: 450, severity: 'high', population: 2800 },
  ajnala: { center: [31.8447, 74.7650], zoom: 14, marker: [31.8447, 74.7650], popup: 'Ajnala, Tarn Taran Tahsil', radius: 400, severity: 'medium', population: 3000 },
  dode: { center: [31.2000, 74.8500], zoom: 14, marker: [31.2000, 74.8500], popup: 'Dode, Patti Tahsil', radius: 450, severity: 'low', population: 2500 },
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'high': return '#ff5252';
    case 'medium': return '#ffb74d';
    case 'low': return '#69f0ae';
    default: return '#00d4ff';
  }
};

const getSeverityLabel = (severity) => {
  switch (severity) {
    case 'high': return 'Critical';
    case 'medium': return 'Moderate';
    case 'low': return 'Mild';
    default: return 'Unknown';
  }
};

const UserFloodMap = () => {
  const isMobile = useMediaQuery(darkTheme.breakpoints.down('md'));
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(new Map());
  const placeMarkerRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  const [mapInitialized, setMapInitialized] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesError, setPlacesError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const [locationNameInput, setLocationNameInput] = useState('');
  const [customStats, setCustomStats] = useState([
    { title: 'Flooded Area (km²)', value: '12.5' },
    { title: 'Relief Camps', value: '8' },
    { title: 'Rescued People', value: '450' },
  ]);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardValue, setNewCardValue] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const affectedCount = useMemo(() => Object.keys(villageData).length, []);
  const totalPopulation = useMemo(() => 
    Object.values(villageData).reduce((sum, v) => sum + v.population, 0), []
  );

  const fetchSuggestions = useCallback(async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    setPlacesLoading(true);
    setPlacesError(null);
    try {
      // First, try fetching from the local flood API
      const isPincode = /^\d{6}$/.test(query);
      const apiUrl = `${import.meta.env.VITE_API_URL}/floods/api/affected/village/map/data/?${isPincode ? `pin_code=${encodeURIComponent(query)}` : `village_name=${encodeURIComponent(query)}`}`;
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        const filteredSuggestions = Object.entries(data).map(([village, details]) => ({
          label: details.popup,
          lat: parseFloat(details.center.latitude),
          lng: parseFloat(details.center.longitude),
          type: 'village',
          severity: details.severity,
          population: details.population,
          radius: details.radius,
        }));
        if (filteredSuggestions.length > 0) {
          setSuggestions(filteredSuggestions);
          return;
        }
      }
      // Fallback to Nominatim API
      const bbox = '74.5,29.5,77.0,32.5';
      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&bounded=1&viewbox=${bbox}&countrycodes=in&accept-language=en`
      );
      if (!nominatimResponse.ok) throw new Error('Failed to fetch suggestions from Nominatim');
      const nominatimData = await nominatimResponse.json();
      const filteredNominatimSuggestions = nominatimData
        .filter(place => place.display_name.toLowerCase().startsWith(query.toLowerCase()))
        .map(place => {
          const parts = place.display_name.split(',');
          const label = parts.length > 1 ? `${parts[0].trim()}, ${parts[1].trim()}` : parts[0].trim();
          return { label, lat: parseFloat(place.lat), lng: parseFloat(place.lon), type: place.type };
        });
      setSuggestions(filteredNominatimSuggestions);
    } catch (error) {
      setPlacesError('Unable to load suggestions. Please try again later.');
      console.error('Error fetching suggestions:', error);
    } finally {
      setPlacesLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      if (searchQuery.length >= 1) {
        fetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(debounceTimeoutRef.current);
  }, [searchQuery, fetchSuggestions]);

  const handlePlaceChange = useCallback((place) => {
    setSelectedPlace(place);
    setSearchQuery('');
    setSuggestions([]);
    setLocationNameInput(place.label);
    setLatInput(place.lat.toString());
    setLngInput(place.lng.toString());
    setDrawerOpen(true);
    if (place && mapInstanceRef.current) {
      mapInstanceRef.current.setView([place.lat, place.lng], 12);
      if (placeMarkerRef.current) {
        mapInstanceRef.current.removeLayer(placeMarkerRef.current);
      }
      placeMarkerRef.current = L.marker([place.lat, place.lng], {
        draggable: true,
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: #00d4ff; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
      }).addTo(mapInstanceRef.current).bindPopup(`
        <div style="background: #1a1a1a; color: white; border-radius: 8px; padding: 12px;">
          <h4 style="margin: 0 0 8px 0; color: #00d4ff;">${place.label}</h4>
          <p style="margin: 4px 0;">${place.type}</p>
          ${place.severity ? `<p style="margin: 4px 0;"><strong>Severity:</strong> <span style="color: ${getSeverityColor(place.severity)}">${getSeverityLabel(place.severity)}</span></p>` : ''}
          ${place.population ? `<p style="margin: 4px 0;"><strong>Population:</strong> ${place.population.toLocaleString()}</p>` : ''}
        </div>
      `).openPopup();

      // Handle marker drag
      placeMarkerRef.current.on('dragend', async () => {
        const newLatLng = placeMarkerRef.current.getLatLng();
        setLatInput(newLatLng.lat.toString());
        setLngInput(newLatLng.lng.toString());
        setPlacesLoading(true);
        let newLabel, newType;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${newLatLng.lat}&lon=${newLatLng.lng}&format=json&addressdetails=1`);
          if (response.ok) {
            const data = await response.json();
            const parts = data.display_name.split(',');
            newLabel = parts.length > 1 ? `${parts[0].trim()}, ${parts[1].trim()}` : parts[0].trim();
            newType = data.type || 'custom';
          } else {
            newLabel = `Location at ${newLatLng.lat.toFixed(4)}, ${newLatLng.lng.toFixed(4)}`;
            newType = 'custom';
          }
        } catch (error) {
          console.error('Error reverse geocoding after drag:', error);
          newLabel = `Location at ${newLatLng.lat.toFixed(4)}, ${newLatLng.lng.toFixed(4)}`;
          newType = 'custom';
        }
        setLocationNameInput(newLabel);
        setSelectedPlace(prev => ({
          ...prev,
          lat: newLatLng.lat,
          lng: newLatLng.lng,
          label: newLabel,
          type: newType,
        }));
        // Update popup content
        placeMarkerRef.current.setPopupContent(`
          <div style="background: #1a1a1a; color: white; border-radius: 8px; padding: 12px;">
            <h4 style="margin: 0 0 8px 0; color: #00d4ff;">${newLabel}</h4>
            <p style="margin: 4px 0;">${newType}</p>
            ${place.severity ? `<p style="margin: 4px 0;"><strong>Severity:</strong> <span style="color: ${getSeverityColor(place.severity)}">${getSeverityLabel(place.severity)}</span></p>` : ''}
            ${place.population ? `<p style="margin: 4px 0;"><strong>Population:</strong> ${place.population.toLocaleString()}</p>` : ''}
          </div>
        `).openPopup();
        setSnackbarMessage(`Location updated to: ${newLabel}`);
        setSnackbarOpen(true);
        setPlacesLoading(false);
      });
    }
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  const resetMap = useCallback(() => {
    setSelectedPlace(null);
    setSearchQuery('');
    setSuggestions([]);
    setLocationNameInput('');
    setLatInput('');
    setLngInput('');
    setDrawerOpen(false);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds([[29.5, 74.5], [32.5, 77.0]]);
      if (placeMarkerRef.current) {
        mapInstanceRef.current.removeLayer(placeMarkerRef.current);
        placeMarkerRef.current = null;
      }
    }
  }, []);

  const toggleLegend = useCallback(() => {
    setShowLegend(prev => !prev);
  }, []);

  const centerMap = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds([[29.5, 74.5], [32.5, 77.0]]);
    }
  }, []);

  const refreshData = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handlePlaceChange(suggestions[0]);
    }
  }, [suggestions, handlePlaceChange]);

  const handleFormClick = useCallback(() => {
    navigate('/usersurveyform');
  }, [navigate]);

  const handleUploadExcelClick = useCallback(() => {
    if (selectedPlace) {
      setDialogOpen(true);
    }
  }, [selectedPlace]);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleCoordSearch = useCallback(async () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    const name = locationNameInput.trim() || `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    if (isNaN(lat) || isNaN(lng) || lat < 29.5 || lat > 32.5 || lng < 74.5 || lng > 77.0) {
      setPlacesError('Invalid coordinates for Punjab region.');
      return;
    }
    setPlacesLoading(true);
    setPlacesError(null);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`);
      if (!response.ok) throw new Error('Failed to reverse geocode');
      const data = await response.json();
      const parts = data.display_name.split(',');
      const label = parts.length > 1 ? `${parts[0].trim()}, ${parts[1].trim()}` : parts[0].trim();
      const type = data.type || 'location';
      handlePlaceChange({ label: name, lat, lng, type });
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      handlePlaceChange({ label: name, lat, lng, type: 'custom' });
    } finally {
      setPlacesLoading(false);
    }
  }, [latInput, lngInput, locationNameInput, handlePlaceChange]);

  const addNewCard = useCallback(() => {
    if (newCardTitle.trim() && newCardValue.trim()) {
      setCustomStats(prev => [...prev, { title: newCardTitle.trim(), value: newCardValue.trim() }]);
      setNewCardTitle('');
      setNewCardValue('');
    } else {
      alert('Please enter both a title and a value for the new card.');
    }
  }, [newCardTitle, newCardValue]);

  useEffect(() => {
    if (!mapRef.current || mapInitialized) return;
    const initializeMap = async () => {
      try {
        setLoading(true);
        const punjabBounds = [[29.5, 74.5], [32.5, 77.0]];
        const map = L.map(mapRef.current, {
          maxBounds: punjabBounds,
          maxBoundsViscosity: 1.0,
          minZoom: 8,
          maxZoom: 18,
        }).fitBounds(punjabBounds);
        mapInstanceRef.current = map;
        const tileLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>',
          maxZoom: 18,
          errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjIyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIERhdGE8L3RleHQ+PC9zdmc+'
        });
        tileLayer.addTo(map);
        try {
          const response = await fetch('https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@bcbcba3/geojson/states/punjab.geojson');
          if (response.ok) {
            const geojson = await response.json();
            L.geoJSON(geojson, {
              style: {
                color: '#00d4ff',
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.05,
                fillColor: 'rgba(0, 212, 255, 0.05)',
              },
            }).addTo(map);
          }
        } catch (error) {
          console.warn('Could not load Punjab boundary:', error);
        }
        const markersGroup = L.featureGroup();
        defaultAffectedVillages.forEach(village => {
          const data = villageData[village];
          if (!data) return;
          const popupContent = `
            <div style="background: #1a1a1a; color: white; border-radius: 8px; padding: 12px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #00d4ff;">${data.popup.split(', ')[0]}</h3>
              <p style="margin: 4px 0;"><strong>Severity:</strong> <span style="color: ${getSeverityColor(data.severity)}">${getSeverityLabel(data.severity)}</span></p>
              <p style="margin: 4px 0;"><strong>Population:</strong> ${data.population.toLocaleString()}</p>
            </div>
          `;
          const marker = L.marker(data.marker).bindPopup(popupContent);
          markersGroup.addLayer(marker);
          markersRef.current.set(village, marker);
          const circle = L.circle(data.center, {
            color: getSeverityColor(data.severity),
            fillColor: getSeverityColor(data.severity),
            fillOpacity: 0.3,
            radius: data.radius,
            weight: 2,
          }).bindPopup(`
            <div style="background: #1a1a1a; color: white; border-radius: 8px; padding: 12px;">
              <h4 style="margin: 0 0 8px 0; color: #00d4ff;">Flood Zone: ${data.popup.split(', ')[0]}</h4>
              <p style="margin: 4px 0;">Affected radius: ${data.radius} meters</p>
              <p style="margin: 4px 0;">Risk Level: <span style="color: ${getSeverityColor(data.severity)}">${getSeverityLabel(data.severity)}</span></p>
            </div>
          `);
          markersGroup.addLayer(circle);
        });
        markersGroup.addTo(map);
        setMapInitialized(true);
        setLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setLoading(false);
      }
    };
    if (window.requestIdleCallback) {
      window.requestIdleCallback(initializeMap);
    } else {
      setTimeout(initializeMap, 0);
    }
  }, [mapInitialized]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current.clear();
      if (placeMarkerRef.current) {
        placeMarkerRef.current = null;
      }
    };
  }, []);

  const drawerContent = useMemo(() => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: 'primary.main' }}>
          Flood Statistics: {selectedPlace?.label}
        </Typography>
        <IconButton
          size="small"
          onClick={() => setDrawerOpen(false)}
          sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
        >
          <Icon icon="mdi:close" style={{ fontSize: '16px' }} />
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Grid container spacing={2}>
          {customStats.map((stat, index) => (
            <Grid item xs={12} key={index}>
              <Card elevation={8}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h3" color="primary.main">
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            Add New Statistic
          </Typography>
          <TextField
            label="Statistic Title"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Statistic Value"
            value={newCardValue}
            onChange={(e) => setNewCardValue(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={addNewCard}
            disabled={!newCardTitle || !newCardValue}
            fullWidth
          >
            Add Statistic
          </Button>
        </Box>
      </Box>
    </Box>
  ), [customStats, newCardTitle, newCardValue, addNewCard, selectedPlace]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box>
        <AppBar
          position="fixed"
          sx={{
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Toolbar sx={{ px: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, p: 1 }}>
              <img src={logo} alt="Logo" style={{ height: 80, marginRight: 16 }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {/* <Button
                variant="contained"
                color="primary"
                onClick={handleFormClick}
              >
                Fill Survey Form
              </Button> */}
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ height: '100vh', position: 'relative' }}>
          {loading && (
            <LinearProgress
              sx={{
                bgcolor: 'rgba(0, 212, 255, 0.1)',
                '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' },
              }}
            />
          )}
          <Paper
            elevation={0}
            sx={{
              height: '100vh',
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              ref={mapRef}
              id="map"
              style={{ height: '100vh', width: '100%', borderRadius: '0' }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                zIndex: 1000,
                maxWidth: 360,
                width: '100%',
              }}
            >
              <Card elevation={8} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Icon icon="mdi:map-search" style={{ fontSize: '24px', marginRight: '8px', color: '#00d4ff' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Search Village/City or Pincode
                  </Typography>
                </Box>
                {placesLoading && (
                  <LinearProgress sx={{ mb: 2, bgcolor: 'rgba(0, 212, 255, 0.1)', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }} />
                )}
                {placesError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {placesError}
                  </Alert>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    label="Search Villages/Cities or Pincode"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    fullWidth
                    aria-label="Search for villages, cities, or pincode in Punjab"
                    sx={{
                      '& .MuiOutlinedInput-root': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover .MuiOutlinedInput-root': { borderColor: 'primary.main' },
                    }}
                  />
                  {searchQuery && (
                    <IconButton
                      onClick={resetMap}
                      aria-label="Clear search"
                      sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                    >
                      <Icon icon="mdi:close" style={{ fontSize: '20px' }} />
                    </IconButton>
                  )}
                </Box>
                {suggestions.length > 0 && (
                  <List sx={{ maxHeight: 200, overflow: 'auto', mt: 2 }}>
                    {suggestions.map((place) => (
                      <ListItem
                        key={place.label}
                        button
                        onClick={() => handlePlaceChange(place)}
                        sx={{
                          border: '1px solid',
                          borderColor: 'rgba(255,255,255,0.1)',
                          borderRadius: 2,
                          mb: 1,
                          bgcolor: 'transparent',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.05)',
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        <ListItemText
                          primary={<Typography variant="body1" fontWeight="bold">{place.label}</Typography>}
                          secondary={<Typography variant="caption" color="text.secondary">{place.type}</Typography>}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
                {searchQuery && suggestions.length === 0 && !placesLoading && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    No places found matching "{searchQuery}" in Punjab, India.
                  </Typography>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCoordSearch}
                  disabled={!locationNameInput || placesLoading}
                  sx={{ mt: 2, width: '100%' }}
                >
                  Locate
                </Button>
              </Card>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: 24,
                right: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                zIndex: 1000,
              }}
            >
              <Tooltip title="Center Map" placement="left">
                <Fab
                  sx={{
                    background: 'linear-gradient(135deg, #00d4ff 0%, #0091ea 100%)',
                    color: 'white',
                    '&:hover': { background: 'linear-gradient(135deg, #33dcff 0%, #42a5f5 100%)', transform: 'scale(1.1)' },
                    transition: 'all 0.3s ease',
                  }}
                  size="medium"
                  onClick={centerMap}
                >
                  <Icon icon="mdi:crosshairs-gps" style={{ fontSize: '24px' }} />
                </Fab>
              </Tooltip>
              <Tooltip title="Refresh Data" placement="left">
                <Fab
                  sx={{
                    background: 'linear-gradient(135deg, #69f0ae 0%, #4caf50 100%)',
                    color: 'black',
                    '&:hover': { background: 'linear-gradient(135deg, #81f7b3 0%, #66bb6a 100%)', transform: 'scale(1.1)' },
                    transition: 'all 0.3s ease',
                  }}
                  size="small"
                  onClick={refreshData}
                >
                  <Icon icon="mdi:refresh" style={{ fontSize: '20px' }} />
                </Fab>
              </Tooltip>
              {selectedPlace && (
                <Tooltip title="Clear Selection" placement="left">
                  <Fab
                    sx={{
                      background: 'linear-gradient(135deg, #ff4081 0%, #f50057 100%)',
                      color: 'white',
                      '&:hover': { background: 'linear-gradient(135deg, #ff79b0 0%, #ff5983 100%)', transform: 'scale(1.1)' },
                      transition: 'all 0.3s ease',
                    }}
                    size="small"
                    onClick={resetMap}
                  >
                    <Icon icon="mdi:close" style={{ fontSize: '20px' }} />
                  </Fab>
                </Tooltip>
              )}
              <Tooltip title="Toggle Fullscreen" placement="left">
                <Fab
                  sx={{
                    background: 'linear-gradient(135deg, #ffb74d 0%, #ff9800 100%)',
                    color: 'white',
                    '&:hover': { background: 'linear-gradient(135deg, #ffcc80 0%, #ffb74d 100%)', transform: 'scale(1.1)' },
                    transition: 'all 0.3s ease',
                  }}
                  size="small"
                  onClick={toggleFullscreen}
                >
                  <Icon icon="mdi:fullscreen" style={{ fontSize: '20px' }} />
                </Fab>
              </Tooltip>
            </Box>
            {showLegend && (
              <Paper
                sx={{
                  position: 'absolute',
                  top: 24,
                  right: 24,
                  p: 3,
                  zIndex: 1000,
                  maxWidth: 280,
                  background: 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  borderRadius: 4,
                  backdropFilter: 'blur(10px)',
                }}
                elevation={8}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Icon icon="mdi:map-legend" style={{ fontSize: '20px', marginRight: '8px', color: '#00d4ff' }} />
                    <Typography variant="subtitle1" fontWeight="bold">
                      Legend
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => setShowLegend(false)}
                    sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                  >
                    <Icon icon="mdi:close" style={{ fontSize: '16px' }} />
                  </IconButton>
                </Box>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 2, bgcolor: 'rgba(255, 82, 82, 0.1)' }}>
                    <Icon icon="mdi:circle" style={{ color: '#ff5252', marginRight: '12px', fontSize: '16px' }} />
                    <Box>
                      <Typography variant="body2" fontWeight="600">Critical</Typography>
                      <Typography variant="caption" color="text.secondary">Immediate evacuation needed</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 2, bgcolor: 'rgba(255, 183, 77, 0.1)' }}>
                    <Icon icon="mdi:circle" style={{ color: '#ffb74d', marginRight: '12px', fontSize: '16px' }} />
                    <Box>
                      <Typography variant="body2" fontWeight="600">Moderate</Typography>
                      <Typography variant="caption" color="text.secondary">Close monitoring required</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 2, bgcolor: 'rgba(105, 240, 174, 0.1)' }}>
                    <Icon icon="mdi:circle" style={{ color: '#69f0ae', marginRight: '12px', fontSize: '16px' }} />
                    <Box>
                      <Typography variant="body2" fontWeight="600">Mild</Typography>
                      <Typography variant="caption" color="text.secondary">Precautionary measures</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 2, bgcolor: 'rgba(0, 212, 255, 0.1)' }}>
                    <Icon icon="mdi:circle" style={{ color: '#00d4ff', marginRight: '12px', fontSize: '16px' }} />
                    <Box>
                      <Typography variant="body2" fontWeight="600">Selected Place</Typography>
                      <Typography variant="caption" color="text.secondary">Highlighted search result (Draggable)</Typography>
                    </Box>
                  </Box>
                </Stack>
              </Paper>
            )}
          </Paper>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            message={snackbarMessage}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={{
              '& .MuiSnackbarContent-root': {
                backgroundColor: 'primary.main',
                color: 'white',
                fontWeight: 'bold',
              },
            }}
          />
        </Box>
        <Drawer
          anchor="right"
          variant="persistent"
          open={drawerOpen}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              border: 'none',
              bgcolor: 'background.default',
              backgroundImage: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%)',
            },
          }}
        >
          {drawerContent}
        </Drawer>
        <LocationDetailsDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          selectedPlace={selectedPlace}
        />
      </Box>
    </ThemeProvider>
  );
};

export default UserFloodMap;