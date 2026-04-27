import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Paper, Box, Fab, Tooltip, Typography, IconButton, LinearProgress, Snackbar } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Iconify from '../iconify';

const MapSection = ({
  showMap,
  mapRef,
  mapInstanceRef,
  mapInitialized,
  setMapInitialized,
  setLoading,
  showLegend,
  setShowLegend,
  centerMap,
  toggleFullscreen,
  selectedPlace,
  placeMarkerRef,
  markersRef,
  defaultAffectedVillages,
  villageData,
  loading,
  onPlaceDragEnd,
  onSnackbarMessage,
  isMobile = false, // Add isMobile prop with default value

}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const getCoordinates = useCallback((villageData) => {
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
    return [30.9000, 75.8500];
  }, []);

  const getSeverityColor = useCallback((severity) => {
    switch (severity) {
      case 'high': return '#ff5252';
      case 'medium': return '#ffb74d';
      case 'low': return '#69f0ae';
      default: return '#00d4ff';
    }
  }, []);

  const getSeverityLabel = useCallback((severity) => {
    switch (severity) {
      case 'high': return 'Critical';
      case 'medium': return 'Moderate';
      case 'low': return 'Mild';
      default: return 'Unknown';
    }
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  const showMessage = useCallback((message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
    if (onSnackbarMessage) {
      onSnackbarMessage(message);
    }
  }, [onSnackbarMessage]);

const updateMarker = useCallback(() => {
  if (selectedPlace && mapInstanceRef.current) {
    // Center the map on the selected place with proper zoom
    mapInstanceRef.current.setView([selectedPlace.lat, selectedPlace.lng], 12, {
      animate: true,
      duration: 1
    });
    
    // Remove existing marker if any
    if (placeMarkerRef.current) {
      mapInstanceRef.current.removeLayer(placeMarkerRef.current);
    }
    
    // Create new marker
    placeMarkerRef.current = L.marker([selectedPlace.lat, selectedPlace.lng], {
      draggable: true,
      icon: L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: #00d4ff; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      }),
    }).addTo(mapInstanceRef.current);

    // Bind popup content
    placeMarkerRef.current.bindPopup(
      `
      <div style="background: #1a1a1a; color: white; border-radius: 8px; padding: 12px;">
        <h4 style="margin: 0 0 8px 0; color: #00d4ff;">${selectedPlace.label}</h4>
        <p style="margin: 4px 0;">${selectedPlace.type}</p>
        ${selectedPlace.severity ? `<p style="margin: 4px 0;"><strong>Severity:</strong> <span style="color: ${getSeverityColor(selectedPlace.severity)}">${getSeverityLabel(selectedPlace.severity)}</span></p>` : ''}
        ${selectedPlace.population ? `<p style="margin: 4px 0;"><strong>Population:</strong> ${selectedPlace.population.toLocaleString()}</p>` : ''}
      </div>
      `
    ).openPopup();

    // Ensure the marker is in the center of the viewport
    mapInstanceRef.current.panTo([selectedPlace.lat, selectedPlace.lng], {
      animate: true,
      duration: 1
    });

    // Add dragend event listener
    placeMarkerRef.current.on('dragend', async () => {
      const newLatLng = placeMarkerRef.current.getLatLng();
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
      
      if (onPlaceDragEnd) {
        onPlaceDragEnd({
          ...selectedPlace,
          lat: newLatLng.lat,
          lng: newLatLng.lng,
          label: newLabel,
          type: newType,
        });
      }
      
      placeMarkerRef.current.setPopupContent(`
        <div style="background: #1a1a1a; color: white; border-radius: 8px; padding: 12px;">
          <h4 style="margin: 0 0 8px 0; color: #00d4ff;">${newLabel}</h4>
          <p style="margin: 4px 0;">${newType}</p>
          ${selectedPlace.severity ? `<p style="margin: 4px 0;"><strong>Severity:</strong> <span style="color: ${getSeverityColor(selectedPlace.severity)}">${getSeverityLabel(selectedPlace.severity)}</span></p>` : ''}
          ${selectedPlace.population ? `<p style="margin: 4px 0;"><strong>Population:</strong> ${selectedPlace.population.toLocaleString()}</p>` : ''}
        </div>
      `).openPopup();
      
      showMessage(`Location updated to: ${newLabel}`);
    });
  }
}, [selectedPlace, mapInstanceRef, placeMarkerRef, getSeverityColor, getSeverityLabel, onPlaceDragEnd, showMessage]);
  useEffect(() => {
    if (!mapRef.current || mapInitialized || Object.keys(villageData).length === 0) return;
    const initializeMap = async () => {
      try {
        setLoading(true);
        const punjabBounds = [[29.5, 74.5], [32.5, 77.0]];
        const map = L.map(mapRef.current, {
          // maxBounds: punjabBounds,
          // maxBoundsViscosity: 1.0,
          minZoom: 7,
          maxZoom: 25,
            dragging: !isMobile,
          touchZoom: !isMobile,
          scrollWheelZoom: !isMobile,
          doubleClickZoom: !isMobile,
          boxZoom: !isMobile,
          keyboard: !isMobile,
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
    updateMarker();
  }, [selectedPlace, updateMarker]);

  const resetMap = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds([[29.5, 74.5], [32.5, 77.0]]);
      if (placeMarkerRef.current) {
        mapInstanceRef.current.removeLayer(placeMarkerRef.current);
        placeMarkerRef.current = null;
      }
    }
  }, [mapInstanceRef, placeMarkerRef]);

  const toggleTheme = useCallback(() => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
          mapInstanceRef.current.removeLayer(layer);
          const newTileLayer = L.tileLayer(newTheme 
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: newTheme 
              ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
            detectRetina: true,
          });
          newTileLayer.addTo(mapInstanceRef.current);
        }
      });
    }
  }, [isDarkTheme, mapInstanceRef]);

  return (
    <>
      <Box
        sx={{
         height: isMobile ? '600px' : '700px',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2,
          display: showMap ? 'block' : 'none',
        }}
      >
        {loading && (
          <LinearProgress 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1001,
              bgcolor: 'rgba(0, 212, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'primary.main'
              }
            }}
          />
        )}
        
        <div
          ref={mapRef}
          id="map"
          style={{ 
            height: '100%', 
            width: '100%', 
            borderRadius: '8px',
            minHeight: '700px'
          }}
        />

        

        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            right: 50,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            zIndex: 1000,
          }}
        >
          <Tooltip title="Toggle Theme" placement="left">
            <Fab
              sx={{
                background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                color: 'white',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%)',
                  transform: 'scale(1.1)' 
                },
                transition: 'all 0.3s ease',
              }}
              size="small"
              onClick={toggleTheme}
            >
              <Iconify icon={isDarkTheme ? "mdi:weather-sunny" : "mdi:weather-night"} />
            </Fab>
          </Tooltip>
          <Tooltip title="Toggle Legend" placement="left">
            <Fab
              sx={{
                background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                color: 'white',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%)',
                  transform: 'scale(1.1)' 
                },
                transition: 'all 0.3s ease',
              }}
              size="small"
              onClick={() => setShowLegend(!showLegend)}
            >
              <Iconify icon="mdi:map-legend" />
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
                transition: 'all 0.3s ease',
              }}
              size="small"
              onClick={centerMap}
            >
              <Iconify icon="mdi:crosshairs-gps" />
            </Fab>
          </Tooltip>

          <Tooltip title="Refresh Map" placement="left">
            <Fab
              sx={{
                background: 'linear-gradient(135deg, #69f0ae 0%, #4caf50 100%)',
                color: 'black',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #81f7b3 0%, #66bb6a 100%)',
                  transform: 'scale(1.1)' 
                },
                transition: 'all 0.3s ease',
              }}
              size="small"
              onClick={() => window.location.reload()}
            >
              <Iconify icon="mdi:refresh" />
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
                  transition: 'all 0.3s ease',
                }}
                size="small"
                onClick={resetMap}
              >
                <Iconify icon="mdi:close" />
              </Fab>
            </Tooltip>
          )}

          <Tooltip title="Toggle Fullscreen" placement="left">
            <Fab
              sx={{
                background: 'linear-gradient(135deg, #ffb74d 0%, #ff9800 100%)',
                color: 'white',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #ffcc80 0%, #ffb74d 100%)',
                  transform: 'scale(1.1)' 
                },
                transition: 'all 0.3s ease',
              }}
              size="small"
              onClick={toggleFullscreen}
            >
              <Iconify icon="mdi:fullscreen" />
            </Fab>
          </Tooltip>
        </Box>

        {showLegend && (
          <Paper
            sx={{
              position: 'absolute',
              top: 16,
              right: 55,
              p: 2,
              zIndex: 1000,
              maxWidth: 280,
              background: 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              borderRadius: 2,
              backdropFilter: 'blur(10px)'
            }}
            elevation={8}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Iconify 
                  icon="mdi:map-legend" 
                  style={{ fontSize: '16px', marginRight: '8px', color: '#00d4ff' }} 
                />
                <Typography variant="subtitle2" fontWeight="bold">
                  Legend
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => setShowLegend(false)}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                }}
              >
                <Iconify icon="mdi:close" style={{ fontSize: '16px' }} />
              </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 1, bgcolor: 'rgba(255, 82, 82, 0.1)' }}>
                <Iconify 
                  icon="mdi:circle" 
                  style={{ color: '#ff5252', marginRight: '8px', fontSize: '12px' }} 
                />
                <Box>
                  <Typography variant="caption" fontWeight="600">Critical</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">Immediate evacuation</Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 1, bgcolor: 'rgba(255, 183, 77, 0.1)' }}>
                <Iconify 
                  icon="mdi:circle" 
                  style={{ color: '#ffb74d', marginRight: '8px', fontSize: '12px' }} 
                />
                <Box>
                  <Typography variant="caption" fontWeight="600">Moderate</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">Close monitoring</Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 1, bgcolor: 'rgba(105, 240, 174, 0.1)' }}>
                <Iconify 
                  icon="mdi:circle" 
                  style={{ color: '#69f0ae', marginRight: '8px', fontSize: '12px' }} 
                />
                <Box>
                  <Typography variant="caption" fontWeight="600">Mild</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">Precautionary measures</Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 1, bgcolor: 'rgba(0, 212, 255, 0.1)' }}>
                <Iconify 
                  icon="mdi:circle" 
                  style={{ color: '#00d4ff', marginRight: '8px', fontSize: '12px' }} 
                />
                <Box>
                  <Typography variant="caption" fontWeight="600">Selected Place</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">Draggable marker</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        )}
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
    </>
  );
};

export default MapSection;