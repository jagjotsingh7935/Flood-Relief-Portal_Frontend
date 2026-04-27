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
  ListItemIcon,
  Avatar,
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
  Link,
  Input,
  FormControl,
  InputLabel,
  Divider,
  Snackbar
} from '@mui/material';
import { Icon } from '@iconify/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 420;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00d4ff',
      dark: '#00b8e6',
      light: '#33dcff',
    },
    secondary: {
      main: '#ff4081',
      dark: '#c60055',
      light: '#ff79b0',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    error: {
      main: '#ff5252',
    },
    warning: {
      main: '#ffb74d',
    },
    success: {
      main: '#69f0ae',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
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
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

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

const SeverityIcon = React.memo(({ severity }) => {
  const iconProps = useMemo(() => {
    switch (severity) {
      case 'high': return { icon: "mdi:alert-circle", color: '#ff5252' };
      case 'medium': return { icon: "mdi:alert", color: '#ffb74d' };
      case 'low': return { icon: "mdi:information", color: '#69f0ae' };
      default: return { icon: "mdi:circle", color: '#00d4ff' };
    }
  }, [severity]);

  return <Icon icon={iconProps.icon} style={{ color: iconProps.color, fontSize: '20px' }} />;
});

const VillageListItem = React.memo(({ villageKey, data, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect(villageKey);
  }, [villageKey, onSelect]);

  const villageName = useMemo(() => data.popup, [data.popup]);
  const firstLetter = useMemo(() => villageName.charAt(0).toUpperCase(), [villageName]);

  return (
    <ListItem
      button
      onClick={handleClick}
      sx={{
        border: '1px solid',
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
        mb: 2,
        bgcolor: 'transparent',
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.05)',
          borderColor: 'primary.main'
        },
        transition: 'all 0.3s ease'
      }}
    >
      <ListItemIcon>
        <Avatar sx={{ 
          bgcolor: getSeverityColor(data.severity), 
          width: 40, 
          height: 40,
          fontWeight: 'bold',
          fontSize: '1rem'
        }}>
          {firstLetter}
        </Avatar>
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
            {villageName}
          </Typography>
        }
        secondary={
          <Stack spacing={0.5}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SeverityIcon severity={data.severity} />
              <Typography variant="caption" sx={{ ml: 1, color: getSeverityColor(data.severity), fontWeight: 600 }}>
                {getSeverityLabel(data.severity)} Risk
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Icon icon="mdi:account-group" style={{ fontSize: '14px', marginRight: '4px', color: '#b0b0b0' }} />
              <Typography variant="caption" color="text.secondary">
                Population: {data.population.toLocaleString()}
              </Typography>
            </Box>
          </Stack>
        }
      />
      <Icon icon="mdi:chevron-right" style={{ fontSize: '20px', color: '#b0b0b0' }} />
    </ListItem>
  );
});

const AffectedVillagesMap = () => {
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
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesError, setPlacesError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [villageData, setVillageData] = useState({});
  const [totalVillages, setTotalVillages] = useState(0);
  const [totalPopulation, setTotalPopulation] = useState(0);
  const [defaultAffectedVillages, setDefaultAffectedVillages] = useState([]);
  const [darkMode, setDarkMode] = useState(false); // Default to light theme

  // Fetch village data from API
  useEffect(() => {
    const fetchVillageData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/floods/api/affected/village/map/data/admin/`);
        if (response.ok) {
          const data = await response.json();
          // Extract total_villages and total_population
          const { total_villages, total_population, ...villages } = data;
          setVillageData(villages);
          setTotalVillages(total_villages || Object.keys(villages).length);
          setTotalPopulation(total_population || 0);
          
          // Set default affected villages from popup values in response
          const villageNames = Object.values(villages).map(village => village.popup);
          setDefaultAffectedVillages(villageNames);
        } else {
          console.error('Failed to fetch village data');
        }
      } catch (error) {
        console.error('Error fetching village data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVillageData();
  }, []);

  const filteredVillages = useMemo(() => {
    return Object.entries(villageData).filter(([key, data]) => {
      if (filterSeverity === 'all') return true;
      return data.severity === filterSeverity;
    });
  }, [filterSeverity, villageData]);

  // Helper function to get coordinates from village data
  const getCoordinates = (villageData) => {
    // Handle different coordinate formats from API
    if (villageData.center && villageData.center.latitude && villageData.center.longitude) {
      return [
        parseFloat(villageData.center.latitude),
        parseFloat(villageData.center.longitude)
      ];
    } else if (villageData.center && villageData.center.lat && villageData.center.lng) {
      return [
        parseFloat(villageData.center.lat),
        parseFloat(villageData.center.lng)
      ];
    } else if (villageData.marker && villageData.marker.latitude && villageData.marker.longitude) {
      return [
        parseFloat(villageData.marker.latitude),
        parseFloat(villageData.marker.longitude)
      ];
    } else if (villageData.marker && villageData.marker.lat && villageData.marker.lng) {
      return [
        parseFloat(villageData.marker.lat),
        parseFloat(villageData.marker.lng)
      ];
    }
    // Return default coordinates if none found
    return [30.9000, 75.8500];
  };

  // Fetch suggestions with pincode or village name
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
        const filteredSuggestions = Object.entries(data).map(([village, details]) => {
          const coords = getCoordinates(details);
          return {
            label: details.popup,
            lat: coords[0],
            lng: coords[1],
            type: 'village',
            severity: details.severity,
            population: details.population,
            radius: details.radius,
          };
        });
        if (filteredSuggestions.length > 0) {
          setSuggestions(filteredSuggestions);
          return;
        }
      }
      // Fallback to Nominatim API
      const bbox = '74.5,29.5,77.0,32.5';
      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&bounded=1&viewbox=${bbox}&countrycodes=in&accept-language=en`,
        {
          method: 'GET',
          headers: {
            'User-Agent': 'FloodMonitoringApp/1.0 (jagjotsingh7935@gmail.com)',
          },
        }
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

  
  // Debounced search
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

  // Handle place selection with draggable marker
  const handlePlaceChange = useCallback((place) => {
    setSelectedPlace(place);
    setSearchQuery('');
    setSuggestions([]);
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

  const handleVillageSelect = useCallback((villageKey) => {
    const data = villageData[villageKey];
    if (mapInstanceRef.current && data) {
      const coords = getCoordinates(data);
      mapInstanceRef.current.setView(coords, data.zoom || 14);
      setSelectedPlace({
        label: data.popup,
        lat: coords[0],
        lng: coords[1],
        type: 'village',
        severity: data.severity,
        population: data.population,
        radius: data.radius
      });
    }
    if (isMobile) {
      setDrawerOpen(false);
    }
  }, [villageData, isMobile]);

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  const resetMap = useCallback(() => {
    setSelectedPlace(null);
    setSearchQuery('');
    setSuggestions([]);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds([[29.5, 74.5], [32.5, 77.0]]);
      if (placeMarkerRef.current) {
        mapInstanceRef.current.removeLayer(placeMarkerRef.current);
        placeMarkerRef.current = null;
      }
    }
  }, []);

  const toggleDrawer = useCallback(() => {
    setDrawerOpen(prev => !prev);
  }, []);

  const centerMap = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds([[29.5, 74.5], [32.5, 77.0]]);
    }
  }, []);

  const refreshData = useCallback(() => {
    setLoading(true);
    // Re-fetch village data
    fetch(`${import.meta.env.VITE_API_URL}/floods/api/affected/village/map/data/`)
      .then(response => response.ok ? response.json() : {})
      .then(data => {
        const { total_villages, total_population, ...villages } = data;
        setVillageData(villages);
        setTotalVillages(total_villages || Object.keys(villages).length);
        setTotalPopulation(total_population || 0);
        const villageNames = Object.values(villages).map(village => village.popup);
        setDefaultAffectedVillages(villageNames);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error refreshing data:', error);
        setLoading(false);
      });
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Toggle between light and dark map mode
  const toggleMapMode = useCallback(() => {
    setDarkMode(prev => !prev);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
          mapInstanceRef.current.removeLayer(layer);
          const newTileLayer = L.tileLayer(!darkMode 
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: !darkMode 
              ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
            detectRetina: true,
          });
          newTileLayer.addTo(mapInstanceRef.current);
        }
      });
    }
  }, [darkMode, mapInstanceRef]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handlePlaceChange(suggestions[0]);
    }
  }, [suggestions, handlePlaceChange]);

  const handleDashboardClick = useCallback(() => {
    navigate('/surveyform');
  }, [navigate]);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  // Apply map style based on darkMode state
  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
          mapInstanceRef.current.removeLayer(layer);
          const tileLayer = L.tileLayer(!darkMode 
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: !darkMode 
              ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
            detectRetina: true,
          });
          tileLayer.addTo(mapInstanceRef.current);
        }
      });
    }
  }, [darkMode]);

  useEffect(() => {
    if (!mapRef.current || mapInitialized || Object.keys(villageData).length === 0) return;
    const initializeMap = async () => {
      try {
        setLoading(true);
        const punjabBounds = [[29.5, 74.5], [32.5, 77.0]];
        const map = L.map(mapRef.current, {
          maxBounds: punjabBounds,
          maxBoundsViscosity: 1.0,
          minZoom: 7,
          maxZoom: 20
        }).fitBounds(punjabBounds);
        mapInstanceRef.current = map;

        // Initialize with light theme by default
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
          detectRetina: true,
        }).addTo(map);

        try {
          const response = await fetch('https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@bcbcba3/geojson/states/punjab.geojson');
          if (response.ok) {
            const geojson = await response.json();
            L.geoJSON(geojson, {
              style: {
                color: '#b94949',
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.05,
                fillColor: 'rgba(0, 212, 255, 0.05)'
              }
            }).addTo(map);
          }
        } catch (error) {
          console.warn('Could not load Punjab boundary:', error);
        }

        const markersGroup = L.featureGroup();
        defaultAffectedVillages.forEach(villageName => {
          const villageEntry = Object.entries(villageData).find(([key, data]) => data.popup === villageName);
          if (!villageEntry) return;
          const [key, data] = villageEntry;
          const coords = getCoordinates(data);
          const popupContent = `
            <div style="background: #1A1A1A; color: white; border-radius: 8px; padding: 12px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #00D4FF;">${data.popup}</h3>
              <p style="margin: 4px 0;"><strong>Severity:</strong> <span style="color: ${getSeverityColor(data.severity)}">${getSeverityLabel(data.severity)}</span></p>
              <p style="margin: 4px 0;"><strong>Population:</strong> ${(data.population || 0).toLocaleString()}</p>
            </div>
          `;
          const marker = L.marker(coords).bindPopup(popupContent);
          markersGroup.addLayer(marker);
          markersRef.current.set(key, marker);
          const circle = L.circle(coords, {
            color: getSeverityColor(data.severity),
            fillColor: getSeverityColor(data.severity),
            fillOpacity: 0.3,
            radius: data.radius || 500,
            weight: 2
          }).bindPopup(`
            <div style="background: #1A1A1A; color: white; border-radius: 8px; padding: 12px;">
              <h4 style="margin: 0 0 8px 0; color: #00D4FF;">Flood Zone: ${data.popup}</h4>
              <p style="margin: 4px 0;">Affected radius: ${data.radius || 500} meters</p>
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
  }, [mapInitialized, villageData, defaultAffectedVillages]);

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
  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
    <Box sx={{ flex: 1, overflow: 'auto', p: 3, bgcolor: 'background.default' }}>
      <Card elevation={8} sx={{ mb: 3, overflow: 'hidden' }}>
        <CardContent sx={{ pb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Icon icon="mdi:flood" style={{ fontSize: '28px', marginRight: '12px', color: '#00d4ff' }} />
            <Typography variant="h6" fontWeight="bold">
              Flood Overview
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Paper sx={{ 
                p: 3, 
                textAlign: 'center', 
                background: 'linear-gradient(135deg, #00d4ff 0%, #0091ea 100%)',
                color: 'white',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                height: '120px', // Fixed height
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Icon icon="mdi:home-group" style={{ fontSize: '32px', marginBottom: '8px' }} />
                <Typography variant="h3" fontWeight="bold">{totalVillages}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Villages</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ 
                p: 3, 
                textAlign: 'center', 
                background: 'linear-gradient(135deg, #ff4081 0%, #f50057 100%)',
                color: 'white',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                height: '120px', // Fixed height
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Icon icon="mdi:account-group" style={{ fontSize: '32px', marginBottom: '8px' }} />
                <Typography variant="h3" fontWeight="bold" sx={{ fontSize: '1.8rem' }}>
                  {totalPopulation.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>People Affected</Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card elevation={8}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Icon icon="mdi:format-list-bulleted" style={{ fontSize: '24px', marginRight: '12px', color: '#00d4ff' }} />
            <Typography variant="h6" fontWeight="bold">
              Most Affected Villages
            </Typography>
          </Box>
          
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredVillages.map(([key, data]) => (
              <VillageListItem
                key={key}
                villageKey={key}
                data={data}
                onSelect={handleVillageSelect}
              />
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  </Box>
), [totalVillages, totalPopulation, filteredVillages, handleVillageSelect]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
        <AppBar 
          position="fixed" 
          sx={{ 
            width: { md: drawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
            ml: { md: drawerOpen ? `${DRAWER_WIDTH}px` : 0 },
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            zIndex: darkTheme.zIndex.drawer + 1,
          }}
        >
          <Toolbar sx={{ px: 3 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer}
              sx={{ 
                mr: 2,
                bgcolor: 'rgba(0, 212, 255, 0.1)',
                '&:hover': { bgcolor: 'rgba(0, 212, 255, 0.2)' }
              }}
            >
              <Icon icon="mdi:menu" style={{ fontSize: '24px' }} />
            </IconButton>
            
            <Typography variant={isMobile ? "h6" : "h5"} component="h1" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Flood Monitoring 
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDashboardClick}
              >
                Go to Dashboard
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
        >
          <Drawer
            variant={isMobile ? "temporary" : "persistent"}
            open={drawerOpen}
            onClose={toggleDrawer}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: DRAWER_WIDTH,
                border: 'none',
                bgcolor: 'background.default',
                backgroundImage: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%)'
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: drawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
            minHeight: '100vh',
            bgcolor: 'background.default'
          }}
        >
          <Toolbar />
          
          {loading && (
            <LinearProgress 
              sx={{
                bgcolor: 'rgba(0, 212, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'primary.main'
                }
              }}
            />
          )}
          
          <Box sx={{ height: 'calc(100vh - 64px)', position: 'relative' }}>
            <Paper 
              elevation={0}
              sx={{ 
                height: '100%', 
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                bgcolor: '#0a0a0a',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div 
                ref={mapRef}
                id="map" 
                style={{ 
                  height: '100%', 
                  width: '100%',
                  borderRadius: '0'
                }} 
              />
              
              <Box sx={{
                position: 'absolute',
                bottom: 24,
                right: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                zIndex: 1000
              }}>
                {/* Toggle Map Mode Button */}
                <Tooltip title={darkMode ?  "Switch to Dark Mode" : "Switch to Light Mode"} placement="left">
                  <Fab
                    sx={{
                      background: darkMode 
                      ? 'linear-gradient(135deg, #424242 0%, #212121 100%)'
                      : 'linear-gradient(135deg, #ffb74d 0%, #ff9800 100%)' ,
                      color: 'white',
                      '&:hover': {
                        background: darkMode 
                        ? 'linear-gradient(135deg, #616161 0%, #424242 100%)'
                        : 'linear-gradient(135deg, #ffcc80 0%, #ffb74d 100%)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                    size="small"
                    onClick={toggleMapMode}
                  >
                    <Icon 
                      icon={darkMode ? "mdi:weather-night":"mdi:weather-sunny"} 
                      style={{ fontSize: '20px' }} 
                    />
                  </Fab>
                </Tooltip>
                
                <Tooltip title="Center Map" placement="left">
                  <Fab
                    sx={{
                      background: 'linear-gradient(135deg, #00d4ff 0%, #0091ea 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #33dcff 0%, #42a5f5 100%)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                    size="small"
                    onClick={centerMap}
                  >
                    <Icon icon="mdi:crosshairs-gps" style={{ fontSize: '20px' }} />
                  </Fab>
                </Tooltip>
                
                <Tooltip title="Refresh Data" placement="left">
                  <Fab
                    sx={{
                      background: 'linear-gradient(135deg, #69f0ae 0%, #4caf50 100%)',
                      color: 'black',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #81f7b3 0%, #66bb6a 100%)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.3s ease'
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
                        '&:hover': {
                          background: 'linear-gradient(135deg, #ff79b0 0%, #ff5983 100%)',
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.3s ease'
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
                      background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.3s ease'
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
                    backdropFilter: 'blur(10px)'
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
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                      }}
                    >
                      <Icon icon="mdi:close" style={{ fontSize: '16px' }} />
                    </IconButton>
                  </Box>
                  
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 2, bgcolor: 'rgba(255, 82, 82, 0.1)' }}>
                      <Icon icon="mdi:circle" style={{ color: '#ff5252', marginRight: '12px', fontSize: '16px' }} />
                      <Box>
                        <Typography variant="body2" fontWeight="600">Critical </Typography>
                        <Typography variant="caption" color="text.secondary">Immediate evacuation needed</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 2, bgcolor: 'rgba(255, 183, 77, 0.1)' }}>
                      <Icon icon="mdi:circle" style={{ color: '#ffb74d', marginRight: '12px', fontSize: '16px' }} />
                      <Box>
                        <Typography variant="body2" fontWeight="600">Moderate </Typography>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 2, bgcolor: 'rgba(156, 39, 176, 0.1)' }}>
                      <Icon icon={darkMode ? "mdi:weather-sunny" : "mdi:weather-night"} style={{ color: '#9c27b0', marginRight: '12px', fontSize: '16px' }} />
                      <Box>
                        <Typography variant="body2" fontWeight="600">
                          {darkMode ? "Dark Mode" : "Light Mode"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Click sun/moon icon to toggle
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Paper>
              )}
            </Paper>
          </Box>
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
      </Box>
    </ThemeProvider>
  );
};

export default AffectedVillagesMap;