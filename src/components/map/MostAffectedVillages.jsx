import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Box, Card, CardContent, List, Typography, Stack, ListItem, ListItemText } from '@mui/material';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'high': return '#ff5252';
    case 'medium': return '#ffb74d';
    case 'low': return '#69f0ae';
    default: return '#00d4ff';
  }
};

const getSeverityLabel = (severity, t) => {
  switch (severity) {
    case 'high': return t('floodDashboard.villages.severity.critical');
    case 'medium': return t('floodDashboard.villages.severity.moderate');
    case 'low': return t('floodDashboard.villages.severity.mild');
    default: return t('floodDashboard.villages.severity.unknown');
  }
};

const VillageListItem = React.memo(({ villageKey, data, onSelect, t }) => {
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
                {getSeverityLabel(data.severity, t)} {t('floodDashboard.villages.risk')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Icon icon="mdi:account-group" style={{ fontSize: '14px', marginRight: '4px', color: '#b0b0b0' }} />
              <Typography variant="caption" color="text.secondary">
                {t('floodDashboard.villages.population')}: {data.population.toLocaleString()}
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
  const { t } = useTranslation();
  const [villageData, setVillageData] = useState({});
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [loading, setLoading] = useState(true);
  const [defaultAffectedVillages, setDefaultAffectedVillages] = useState([]);
  const [error, setError] = useState(null);

  // Fetch village data from API
  useEffect(() => {
    const fetchVillageData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/floods/api/affected/village/map/data/`);
        if (response.ok) {
          const data = await response.json();
          setVillageData(data);
          const villageNames = Object.values(data).map(village => village.popup);
          setDefaultAffectedVillages(villageNames);
        } else {
          throw new Error('Failed to fetch village data');
        }
      } catch (error) {
        console.error('Error fetching village data:', error);
        setError(t('floodDashboard.errors.unable_to_load_villages'));
      } finally {
        setLoading(false);
      }
    };

    fetchVillageData();
  }, [t]);

  const filteredVillages = useMemo(() => {
    return Object.entries(villageData).filter(([key, data]) => {
      if (filterSeverity === 'all') return true;
      return data.severity === filterSeverity;
    });
  }, [filterSeverity, villageData]);

  const handleVillageSelect = useCallback((villageKey, data) => {
    if (onVillageSelect) {
      onVillageSelect(data);
    }
    console.log(`Selected village: ${data.popup}`);
  }, [onVillageSelect]);

  return (
    <Card elevation={8} sx={{ height: '290px' }}>
      <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Icon icon="mdi:format-list-bulleted" style={{ fontSize: '24px', marginRight: '12px', color: '#00d4ff' }} />
          <Typography variant="h6" fontWeight="bold">
            {t('floodDashboard.villages.title')}
          </Typography>
        </Box>
        
        {loading && (
          <Typography variant="body2" color="text.secondary">
            {t('floodDashboard.villages.loading')}
          </Typography>
        )}
        
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
        
        {!loading && !error && filteredVillages.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            {t('floodDashboard.villages.no_results')}
          </Typography>
        )}
        
        <List
          sx={{
            flex: 1,
            overflowY: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            '&:hover': {
              scrollbarWidth: 'thin',
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
              t={t}
            />
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default MostAffectedVillages;