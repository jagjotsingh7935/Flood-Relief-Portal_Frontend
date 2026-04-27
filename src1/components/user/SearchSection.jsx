import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Icon,
  LinearProgress,
  Alert,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Autocomplete,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import axios from 'axios';

const SearchSection = ({
  placesLoading,
  placesError,
  searchQuery,
  setSearchQuery,
  suggestions,
  handlePlaceChange,
  resetMap,
  handleKeyPress,
  onVillageSelect, // Add this prop
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for dropdown data and selections
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTehsil, setSelectedTehsil] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);

  // Fetch districts
  const fetchDistrict = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/floods/api/district/list/`);
      setDistricts(response.data);
    } catch (error) {
      console.error('Error fetching districts:', error);
      setDistricts([]);
    }
  };

  // Fetch tehsils based on selected district
  const fetchTehsil = async (districtId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/floods/api/tehsil/list/`, {
        params: { district_name: districtId },
      });
      setTehsils(response.data);
    } catch (error) {
      console.error('Error fetching tehsils:', error);
      setTehsils([]);
    }
  };

  // Fetch villages based on selected tehsil
  const fetchVillage = async (tehsilId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/floods/api/village/list/`, {
        params: { tehsil_name: tehsilId },
      });
      setVillages(response.data);
    } catch (error) {
      console.error('Error fetching villages:', error);
      setVillages([]);
    }
  };

  // Handle village selection
  const handleVillageChange = (event, newValue) => {
    setSelectedVillage(newValue);
    if (newValue && onVillageSelect) {
      // Create a place object with village data
      const place = {
        label: newValue.name,
        lat: parseFloat(newValue.latitude),
        lng: parseFloat(newValue.longitude),
        type: 'village',
        villageData: newValue
      };
      onVillageSelect(place);
    }
  };

  // Fetch districts on component mount
  useEffect(() => {
    fetchDistrict();
  }, []);

  // Fetch tehsils when district changes
  useEffect(() => {
    if (selectedDistrict) {
      fetchTehsil(selectedDistrict.name);
      setTehsils([]);
      setSelectedTehsil(null);
      setVillages([]);
      setSelectedVillage(null);
    } else {
      setTehsils([]);
      setSelectedTehsil(null);
      setVillages([]);
      setSelectedVillage(null);
    }
  }, [selectedDistrict]);

  // Fetch villages when tehsil changes
  useEffect(() => {
    if (selectedTehsil) {
      fetchVillage(selectedTehsil.name);
      setVillages([]);
      setSelectedVillage(null);
    } else {
      setVillages([]);
      setSelectedVillage(null);
    }
  }, [selectedTehsil]);

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, pb: 0 }}>
      <Card elevation={8} sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon
            icon="mdi:map-search"
            style={{
              fontSize: isMobile ? '20px' : '24px',
              marginRight: '8px',
              color: '#00D4FF',
            }}
          />
          <Typography
            variant={isMobile ? 'subtitle1' : 'h6'}
            fontWeight="bold"
            sx={{ fontSize: { xs: '0.95rem', sm: '1.25rem' } }}
          >
            Search Village/City or Pincode
          </Typography>
        </Box>
        {placesLoading && (
          <LinearProgress
            sx={{
              mb: 2,
              bgcolor: 'rgba(0, 212, 255, 0.1)',
              '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' },
            }}
          />
        )}
        {placesError && (
          <Alert severity="error" sx={{ mb: 2, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            {placesError}
          </Alert>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'center' },
            gap: { xs: 1.5, sm: 1 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: { md: '1 1 auto' } }}>
            {/* <TextField
              label="Search Villages/Cities or Pincode"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              size={isMobile ? 'small' : 'medium'}
              aria-label="Search for villages, cities, or pincode in Punjab"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover .MuiOutlinedInput-root': {
                  borderColor: 'primary.main',
                },
              }}
            /> */}
            {/* {searchQuery && (
              <IconButton
                onClick={resetMap}
                aria-label="Clear search"
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                }}
              >
                <Icon icon="mdi:close" style={{ fontSize: isMobile ? '18px' : '20px' }} />
              </IconButton>
            )} */}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1.5, sm: 1 },
              minWidth: { xs: '100%', md: '100%' },
            }}
          >
            <Autocomplete
              options={districts}
              getOptionLabel={(option) => option.name || ''}
              value={selectedDistrict}
               fullWidth
              onChange={(event, newValue) => setSelectedDistrict(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}

                  label="District"
                  size={isMobile ? 'small' : 'medium'}
                  aria-label="Select district"
                  sx={{
                    // minWidth: { xs: '100%', sm: '100%' },
                    // flex: { xs: '1', sm: 'initial' },
                    '& .MuiOutlinedInput-root': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover .MuiOutlinedInput-root': {
                      borderColor: 'primary.main',
                    },
                  }}
                />
              )}
              noOptionsText="No districts available"
            />
            <Autocomplete
              options={tehsils}
              getOptionLabel={(option) => option.name || ''}
              value={selectedTehsil}
               fullWidth
              onChange={(event, newValue) => setSelectedTehsil(newValue)}
              disabled={!selectedDistrict}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tehsil"
                  size={isMobile ? 'small' : 'medium'}
                  aria-label="Select tehsil"
                  sx={{
                    // minWidth: { xs: '100%', sm: 120 },
                    // flex: { xs: '1', sm: 'initial' },
                    '& .MuiOutlinedInput-root': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover .MuiOutlinedInput-root': {
                      borderColor: 'primary.main',
                    },
                  }}
                />
              )}
              noOptionsText="No tehsils available"
            />
            <Autocomplete
              options={villages}
              getOptionLabel={(option) => option.name || ''}
               fullWidth
              value={selectedVillage}
              onChange={handleVillageChange} // Use the new handler
              disabled={!selectedTehsil}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Village"
                  size={isMobile ? 'small' : 'medium'}
                  aria-label="Select village"
                  sx={{
                    // minWidth: { xs: '100%', sm: 120 },
                    // flex: { xs: '1', sm: 'initial' },
                    '& .MuiOutlinedInput-root': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover .MuiOutlinedInput-root': {
                      borderColor: 'primary.main',
                    },
                  }}
                />
              )}
              noOptionsText="No villages available"
            />
          </Box>
        </Box>
        {/* {suggestions.length > 0 && (
          <List
            sx={{
              maxHeight: { xs: 150, sm: 200 },
              overflow: 'auto',
              mt: 2,
            }}
          >
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
                  py: { xs: 1, sm: 1.5 },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                    >
                      {place.label}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                    >
                      {place.type}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
        {searchQuery && suggestions.length === 0 && !placesLoading && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 2,
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            }}
          >
            No places found matching "{searchQuery}" in Punjab, India.
          </Typography>
        )} */}
      </Card>
    </Box>
  );
};

export default SearchSection;