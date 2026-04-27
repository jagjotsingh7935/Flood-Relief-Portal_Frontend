import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Toolbar,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Container,
  Stack,
  Avatar,
  Alert,
  Fade,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Visibility as ViewIcon,
  Agriculture as AgricultureIcon,
} from '@mui/icons-material';
import axios from 'axios';
import debounce from 'lodash.debounce';

import FarmerDetailsDialog from '../user/FarmerDetailDialog';
// import FarmerDetailsDialog from '../.user/FarmerDetailsDialog';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Status configuration based on damage levels
const statusConfig = {
  'Fully Damaged': { color: 'error', icon: <ErrorIcon />, bgColor: '#ffebee' },
  'Partially Damaged': { color: 'warning', icon: <WarningIcon />, bgColor: '#fff3e0' },
  'No Damage': { color: 'success', icon: <CheckCircleIcon />, bgColor: '#e8f5e8' },
};

// Enhanced Toolbar Component
const FarmerToolbar = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange, 
  onRefresh,
  totalRecords,
  loading,
  cropLossRange,
  onCropLossRangeChange
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Paper elevation={2} sx={{ mb: 2, bgcolor: '#d4edff' }}>
      <Toolbar sx={{ 
        flexDirection: isMobile ? 'column' : 'row', 
        gap: 2, 
        py: 2,
        alignItems: isMobile ? 'stretch' : 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            <AgricultureIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Farmer Response Data
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {totalRecords} farmer records
            </Typography>
          </Box>
        </Box>
        
        <Stack 
          direction={isMobile ? 'column' : 'row'} 
          spacing={2} 
          sx={{ width: isMobile ? '100%' : 'auto' }}
        >
          <TextField
            label="Search Farmer/Village/Mobile"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={onSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
            sx={{ minWidth: isMobile ? '100%' : 200 }}
          />
          
          <FormControl size="small" sx={{ minWidth: isMobile ? '100%' : 150 }}>
            <InputLabel>House Status</InputLabel>
            <Select
              value={statusFilter}
              label="House Status"
              onChange={onStatusFilterChange}
            >
              <MenuItem value="Fully Damaged">Fully Damaged</MenuItem>
              <MenuItem value="Partially Damaged">Partially Damaged</MenuItem>
              <MenuItem value="No Damage">No Damage</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: isMobile ? '100%' : 150 }}>
            <InputLabel>Crop Loss Range</InputLabel>
            <Select
              value={cropLossRange}
              label="Crop Loss Range"
              onChange={onCropLossRangeChange}
            >
              <MenuItem value="All">All Ranges</MenuItem>
              <MenuItem value="0-10000">₹0 - ₹10,000</MenuItem>
              <MenuItem value="10000-25000">₹10,000 - ₹25,000</MenuItem>
              <MenuItem value="25000-50000">₹25,000 - ₹50,000</MenuItem>
              <MenuItem value="50000-100000">₹50,000 - ₹100,000</MenuItem>
              <MenuItem value="100000+">₹100,000+</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh Data">
              <IconButton 
                onClick={onRefresh}
                disabled={loading}
                sx={{ 
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      </Toolbar>
    </Paper>
  );
};

// Enhanced Mobile Card Component
const FarmerCard = ({ row, onViewDetails }) => (
  <Fade in timeout={300}>
    <Card 
      sx={{ 
        mb: 2, 
        borderLeft: 4, 
        borderLeftColor: statusConfig[row.form_data[0].houseStatus]?.color === 'error' ? 'error.main' : 
                        statusConfig[row.form_data[0].houseStatus]?.color === 'success' ? 'success.main' : 
                        statusConfig[row.form_data[0].houseStatus]?.color === 'warning' ? 'warning.main' : 'info.main',
        '&:hover': { 
          boxShadow: 6,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={row.form_data[0].farmer_image} sx={{ width: 40, height: 40 }}>
              <AgricultureIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                {row.form_data[0].farmer_name}
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={statusConfig[row.form_data[0].houseStatus]?.icon}
            label={row.form_data[0].houseStatus}
            color={statusConfig[row.form_data[0].houseStatus]?.color}
            size="small"
            variant="outlined"
          />
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationIcon fontSize="small" color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">Village</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {row.village_data[0].display_name}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon fontSize="small" color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">Mobile</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {row.form_data[0].mobileNumber}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip title="View Details">
            <IconButton size="small" color="primary" onClick={() => onViewDetails(row.person_id)}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  </Fade>
);

// Enhanced Table Row Component
const FarmerRow = ({ row, onViewDetails }) => (
  <TableRow 
    hover 
    sx={{ 
      '&:hover': { 
        bgcolor: statusConfig[row.form_data[0].houseStatus]?.bgColor,
        transform: 'scale(1.002)',
        transition: 'all 0.1s ease-in-out'
      }
    }}
  >
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar src={row.form_data[0].farmer_image} sx={{ width: 32, height: 32 }}>
          <AgricultureIcon />
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.form_data[0].farmer_name}
          </Typography>
        </Box>
      </Box>
    </TableCell>
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocationIcon color="primary" fontSize="small" />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.village_data[0].display_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.village_data[0].pin_code}
          </Typography>
        </Box>
      </Box>
    </TableCell>
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PhoneIcon fontSize="small" color="action" />
        <Typography variant="body2">
          {row.form_data[0].mobileNumber}
        </Typography>
      </Box>
    </TableCell>
    <TableCell>
      <Chip
        icon={statusConfig[row.form_data[0].houseStatus]?.icon}
        label={row.form_data[0].houseStatus}
        color={statusConfig[row.form_data[0].houseStatus]?.color}
        size="small"
        variant="soft"
        sx={{ fontWeight: 600 }}
      />
    </TableCell>
    <TableCell>
      <Tooltip title="View Details">
        <IconButton size="small" color="primary" onClick={() => onViewDetails(row.person_id)}>
          <ViewIcon />
        </IconButton>
      </Tooltip>
    </TableCell>
  </TableRow>
);

// Enhanced Table Component
const FarmerTable = ({ data, rowsPerPage, page, onViewDetails }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  if (isMobile) {
    return (
      <Box>
        {data.map((row) => (
          <FarmerCard key={row.person_id} row={row} onViewDetails={onViewDetails} />
        ))}
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ bgcolor: 'primary.main', color: 'black', fontWeight: 600 }}>
              Farmer Details
            </TableCell>
            <TableCell sx={{ bgcolor: 'primary.main', color: 'black', fontWeight: 600 }}>
              Location
            </TableCell>
            <TableCell sx={{ bgcolor: 'primary.main', color: 'black', fontWeight: 600 }}>
              Contact
            </TableCell>
            <TableCell sx={{ bgcolor: 'primary.main', color: 'black', fontWeight: 600 }}>
              House Status
            </TableCell>
            <TableCell sx={{ bgcolor: 'primary.main', color: 'black', fontWeight: 600 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <FarmerRow key={row.person_id} row={row} onViewDetails={onViewDetails} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Main Enhanced Component
const EnhancedFarmerResponseTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [cropLossRange, setCropLossRange] = useState('All');
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedFarmerId, setSelectedFarmerId] = useState(null);

  // Debounced search handler
  const debouncedFetchData = useCallback(
    debounce(async (search, status, cropLoss, currentPage) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (status !== 'All') params.append('house_status', status);
        if (cropLoss !== 'All' && cropLoss !== '100000+') params.append('estimatedCropLoss', cropLoss.replace('+', ''));
        else if (cropLoss === '100000+') params.append('estimatedCropLoss', '100000-');

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/floods/api/show/person/on/user/page/with/filters/?page=${currentPage + 1}&page_size=${rowsPerPage}`,
          { params }
        );
        setData(response.data.results || []);
        setTotalCount(response.data.count || 0);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching farmer data:', err);
        setData([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    }, 500),
    [rowsPerPage]
  );

  // Fetch data when search, filters, or page changes
  useEffect(() => {
  debouncedFetchData(searchTerm, statusFilter, cropLossRange, page);
  return () => debouncedFetchData.cancel();
}, [searchTerm, statusFilter, cropLossRange, page, debouncedFetchData, rowsPerPage]);

  const handleRefresh = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setCropLossRange('All');
    setPage(0);
    debouncedFetchData('', 'All', 'All', 0);
  };

  const handleViewDetails = (person_id) => {
    setSelectedFarmerId(person_id);
    setViewDetailsOpen(true);
  };

  const handleCloseViewDetails = () => {
    setViewDetailsOpen(false);
    setSelectedFarmerId(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (error && !data.length && !loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">Error loading data</Typography>
          <Typography>{error}</Typography>
          <Button onClick={handleRefresh} sx={{ mt: 1 }}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3 }}>
        <FarmerToolbar
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          statusFilter={statusFilter}
          onStatusFilterChange={(e) => setStatusFilter(e.target.value)}
          onRefresh={handleRefresh}
          totalRecords={totalCount}
          loading={loading}
          cropLossRange={cropLossRange}
          onCropLossRangeChange={(e) => setCropLossRange(e.target.value)}
        />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <FarmerTable 
              data={data} 
              rowsPerPage={rowsPerPage} 
              page={page} 
              onViewDetails={handleViewDetails}
            />
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ 
                borderTop: 1, 
                borderColor: 'divider',
                bgcolor: 'background.paper'
              }}
            />
          </>
        )}
      </Paper>

      <FarmerDetailsDialog 
        open={viewDetailsOpen} 
        onClose={handleCloseViewDetails} 
        farmerId={selectedFarmerId}
      />
    </Container>
  );
};

export default EnhancedFarmerResponseTable;