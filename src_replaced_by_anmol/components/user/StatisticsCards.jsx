import React from 'react';
import { Container, Grid, Card, CardContent, Typography, Box, Chip, Icon, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import Iconify from '../iconify';

const StatisticsCards = ({ statisticsData }) => {
  const handleroute = (link) => {
    window.open(link, "_blank");
  }

  return (
    <Container
      maxWidth="xl"
      sx={{ 
        p: { xs: 1, sm: 2, md: 3 }, 
        display: 'flex', 
        justifyContent: 'center' 
      }}
    >
      <Grid
        container
        spacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {statisticsData.map((stat, index) => (
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            lg={3}
            key={index}
            sx={{
              display: 'flex',
              width: {xs:'47%',md:'15%'},
              justifyContent: 'center',
            }}
          >
            <Card
              elevation={8}
              sx={{
                width: '100%',
                maxWidth: { xs: '100%', sm: '240px', md: '280px' },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: { sm: 'translateY(-4px)' },
                },
              }}
            >
              {stat.link && (
                <IconButton 
                  onClick={() => handleroute(stat.link)}
                  sx={{
                    position: 'absolute',
                    top: { xs: 4, sm: 8 },
                    right: { xs: 4, sm: 8 },
                    zIndex: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <Iconify icon='eva:arrow-forward-fill' />
                </IconButton>
              )}
             
              <CardContent 
                sx={{ 
                  textAlign: 'center', 
                  p: { xs: 1.5, sm: 2, md: 3 },
                  '&:last-child': {
                    pb: { xs: 1.5, sm: 2, md: 3 }
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: { xs: 0.5, sm: 1 },
                    gap: { xs: 0.5, sm: 1 },
                    flexWrap: 'wrap',
                  }}
                >
                  <Icon
                    icon={stat.icon}
                    style={{
                      fontSize: '20px',
                      color: stat.color,
                    }}
                    sx={{
                      fontSize: { xs: '18px', sm: '20px', md: '24px' },
                    }}
                  />
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '1rem', md: '1.25rem' },
                      lineHeight: 1.2,
                    }}
                  >
                    {stat.title}
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color={stat.color}
                  sx={{
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' },
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </Typography>
                <Chip
                  label={stat.change}
                  size="small"
                  color={stat.change.includes('+') ? 'success' : 'error'}
                  variant="outlined"
                  sx={{ 
                    fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem' },
                    height: { xs: '20px', sm: '24px', md: '28px' },
                    '& .MuiChip-label': {
                      px: { xs: 0.5, sm: 1 },
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StatisticsCards;