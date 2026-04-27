
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Box, Card, CardContent, List, Typography, Stack, ListItem, ListItemText } from '@mui/material';
import { Icon } from '@iconify/react';

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

const VillageListItem = React.memo(({ villageKey, data, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect(villageKey, data);
  }, [villageKey, data, onSelect]);

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
      <ListItemText
        primary={
          <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
            {villageName}
          </Typography>
        }
        secondary={
          <Stack spacing={0.5}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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

const MostAffectedVillages = ({ onVillageSelect }) => {
  const [villageData, setVillageData] = useState({});
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [loading, setLoading] = useState(true);
  const [defaultAffectedVillages, setDefaultAffectedVillages] = useState([]);

  // Fetch village data from API
  useEffect(() => {
    const fetchVillageData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/floods/api/affected/village/map/data/`);
        if (response.ok) {
          const data = await response.json();
          setVillageData(data);
          
          // Set default affected villages from popup values in response
          const villageNames = Object.values(data).map(village => village.popup);
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

  const handleVillageSelect = useCallback((villageKey, data) => {
    // Call the parent callback if provided
    if (onVillageSelect) {
      onVillageSelect(data);
    }
    
    // You can keep the existing logic if needed
    console.log(`Selected village: ${data.popup}`);
  }, [onVillageSelect]);

  return (
    <Card elevation={8} sx={{ height: '290px' }}>
      <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Icon icon="mdi:format-list-bulleted" style={{ fontSize: '24px', marginRight: '12px', color: '#00d4ff' }} />
          <Typography variant="h6" fontWeight="bold">
            Most Affected Villages
          </Typography>
        </Box>
        
        {loading && (
          <Typography variant="body2" color="text.secondary">
            Loading villages...
          </Typography>
        )}
        
        {!loading && filteredVillages.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No villages found for the current filter.
          </Typography>
        )}
        
        <List
          sx={{
            flex: 1,
            overflowY: 'auto',
            scrollbarWidth: 'none', // Firefox
            '&::-webkit-scrollbar': {
              display: 'none', // Chrome, Safari, Edge
            },
            '&:hover': {
              scrollbarWidth: 'thin', // Firefox
              '&::-webkit-scrollbar': {
                display: 'block',
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              },
            },
          }}
        >
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
  );
};

export default MostAffectedVillages;