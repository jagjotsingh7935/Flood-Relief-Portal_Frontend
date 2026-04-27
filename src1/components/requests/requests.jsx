import React, { useState, useEffect, useMemo } from 'react';
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
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Visibility as ViewIcon,
  Check as AcceptIcon,
  Close as DeclineIcon,
} from '@mui/icons-material';
import axios from 'axios';

// Status configuration
const statusConfig = {
  Pending: { color: 'warning', icon: <WarningIcon />, bgColor: '#fff3e0' },
  Accepted: { color: 'success', icon: <CheckCircleIcon />, bgColor: '#e8f5e8' },
  Declined: { color: 'error', icon: <ErrorIcon />, bgColor: '#ffebee' },
};

// Enhanced Toolbar Component
const RequestToolbar = ({ 
  searchTerm, 
  onSearchChange, 
  villageFilter,
  onVillageFilterChange,
  mobileFilter,
  onMobileFilterChange,
  totalRecords 
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
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Request Management
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {totalRecords} total requests
            </Typography>
          </Box>
        </Box>
        
        <Stack 
          direction={isMobile ? 'column' : 'row'} 
          spacing={2} 
          sx={{ width: isMobile ? '100%' : 'auto' }}
        >
          <TextField
            label="Search Farmer Name"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={onSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
            sx={{ minWidth: isMobile ? '100%' : 200 }}
          />
          <TextField
            label="Search Village Name"
            variant="outlined"
            size="small"
            value={villageFilter}
            onChange={onVillageFilterChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
            sx={{ minWidth: isMobile ? '100%' : 200 }}
          />
          <TextField
            label="Search Mobile Number"
            variant="outlined"
            size="small"
            value={mobileFilter}
            onChange={onMobileFilterChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
            sx={{ minWidth: isMobile ? '100%' : 200 }}
          />
        </Stack>
      </Toolbar>
    </Paper>
  );
};

// View Details Dialog Component
const ViewDetailsDialog = ({ open, onClose, details }) => {
  if (!details) return null;

  const { village_data, form_data, verified_by_data } = details;
  const village = village_data[0];
  const form = form_data[0];
  const verification = verified_by_data ? verified_by_data[0] : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Request Details</DialogTitle>
      <DialogContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Farmer Information</Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="Farmer Name" secondary={form.farmer_name} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Father's Name" secondary={form.fatherName} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Mobile Number" secondary={form.mobileNumber} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Email" secondary={form.email} />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>Village Information</Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="Village" secondary={village.display_name} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Pin Code" secondary={village.pin_code} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Tehsil" secondary={village.tehsil_data[0].name} />
          </ListItem>
          <ListItem>
            <ListItemText primary="City" secondary={village.tehsil_data[0].city_data[0].name} />
          </ListItem>
          <ListItem>
            <ListItemText primary="State" secondary={village.tehsil_data[0].city_data[0].state_data[0].name} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Coordinates" secondary={`Lat: ${village.latitude}, Lon: ${village.longitude}`} />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>Damage and Support Needs</Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="House Status" secondary={form.houseStatus} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Total Land Owned" secondary={`${form.totalLandOwned} acres`} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Land Affected" secondary={`${form.landAffected} acres`} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Crops Planted" secondary={form.cropsPlanted} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Crops Lost" secondary={form.cropsLost} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Estimated Crop Loss" secondary={form.estimatedCropLoss} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Tractor Leveling" secondary={form.tractorLeveling} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Manure/Fertilizer" secondary={form.manureFertilizer} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Seeds Required" secondary={form.seedsRequired} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Fertilizers/Pesticides" secondary={form.fertilizersPesticides} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Labor Requirement" secondary={form.laborRequirement} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Irrigation Repair" secondary={form.irrigationRepair} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Livestock Damage" secondary={form.livestockDamage} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Household Needs" secondary={form.householdNeeds} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Housing Repair" secondary={form.housingRepair} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Other Support" secondary={form.otherSupport} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Additional Notes" secondary={form.additionalNotes} />
          </ListItem>
        </List>

        {verification && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>Verification Details</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Surveyor Name" secondary={verification.surveyor_name} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Surveyor Mobile" secondary={verification.surveyor_mobile || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Verification Date" secondary={new Date(verification.date).toLocaleDateString()} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Verified" secondary={verification.is_verified ? 'Yes' : 'No'} />
              </ListItem>
            </List>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// Enhanced Mobile Card Component
const RequestCard = ({ row, onAccept, onDecline, onViewDetails, activeTab }) => {
  const [openAcceptDialog, setOpenAcceptDialog] = useState(false);
  const [openDeclineDialog, setOpenDeclineDialog] = useState(false);

  const handleOpenAcceptDialog = () => setOpenAcceptDialog(true);
  const handleCloseAcceptDialog = () => setOpenAcceptDialog(false);
  const handleOpenDeclineDialog = () => setOpenDeclineDialog(true);
  const handleCloseDeclineDialog = () => setOpenDeclineDialog(false);

  return (
    <>
      <Fade in timeout={300}>
        <Card 
          sx={{ 
            mb: 2, 
            borderLeft: 4, 
            borderLeftColor: statusConfig[row.status]?.color === 'warning' ? 'warning.main' : 
                            statusConfig[row.status]?.color === 'success' ? 'success.main' : 'error.main',
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
                <PersonIcon color="primary" />
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                  {row.form_data[0].farmer_name}
                </Typography>
              </Box>
              <Chip
                icon={statusConfig[row.status]?.icon}
                label={row.status}
                color={statusConfig[row.status]?.color}
                size="small"
                variant="outlined"
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
              Village: {row.village_data[0].display_name} <br />
              Mobile: {row.form_data[0].mobileNumber}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Requested</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              {activeTab !== 'All' && row.status === 'Pending' ? (
                <>
                  <Tooltip title="Accept Request">
                    <IconButton size="small" color="success" onClick={handleOpenAcceptDialog}>
                      <AcceptIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Decline Request">
                    <IconButton size="small" color="error" onClick={handleOpenDeclineDialog}>
                      <DeclineIcon />
                    </IconButton>
                  </Tooltip>
                </>
              ) : null}
              <Tooltip title="View Details">
                <IconButton size="small" color="primary" onClick={() => onViewDetails(row.temp_person_id)}>
                  <ViewIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>
      </Fade>

      {/* Accept Confirmation Dialog */}
      <Dialog
        open={openAcceptDialog}
        onClose={handleCloseAcceptDialog}
        aria-labelledby="accept-dialog-title"
      >
        <DialogTitle id="accept-dialog-title">Confirm Accept</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to accept the request from {row.form_data[0].farmer_name} for village {row.village_data[0].display_name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAcceptDialog}>Cancel</Button>
          <Button onClick={() => { onAccept(row.temp_person_id); handleCloseAcceptDialog(); }} color="success">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Decline Confirmation Dialog */}
      <Dialog
        open={openDeclineDialog}
        onClose={handleCloseDeclineDialog}
        aria-labelledby="decline-dialog-title"
      >
        <DialogTitle id="decline-dialog-title">Confirm Decline</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to decline the request from {row.form_data[0].farmer_name} for village {row.village_data[0].display_name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeclineDialog}>Cancel</Button>
          <Button onClick={() => { onDecline(row.temp_person_id); handleCloseDeclineDialog(); }} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Enhanced Table Row Component
const RequestRow = ({ row, onAccept, onDecline, onViewDetails, activeTab }) => {
  const [openAcceptDialog, setOpenAcceptDialog] = useState(false);
  const [openDeclineDialog, setOpenDeclineDialog] = useState(false);

  const handleOpenAcceptDialog = () => setOpenAcceptDialog(true);
  const handleCloseAcceptDialog = () => setOpenAcceptDialog(false);
  const handleOpenDeclineDialog = () => setOpenDeclineDialog(true);
  const handleCloseDeclineDialog = () => setOpenDeclineDialog(false);

  return (
    <>
      <TableRow 
        hover 
        sx={{ 
          '&:hover': { 
            bgcolor: statusConfig[row.status]?.bgColor,
            transform: 'scale(1.005)',
            transition: 'all 0.1s ease-in-out'
          }
        }}
      >
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {row.form_data[0].farmer_name}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Tooltip title={`Village: ${row.village_data[0].display_name} , Mobile: ${row.form_data[0].mobileNumber}`} arrow>
            <Typography 
              variant="body2" 
              sx={{ 
                maxWidth: 300,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {row.village_data[0].display_name}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {new Date().toLocaleDateString()}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Chip
            icon={statusConfig[row.status]?.icon}
            label={row.status}
            color={statusConfig[row.status]?.color}
            size="small"
            variant="soft"
            sx={{ fontWeight: 600 }}
          />
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {activeTab !== 'All' && row.status === 'Pending' ? (
              <>
                <Tooltip title="Accept">
                  <IconButton size="small" color="success" onClick={handleOpenAcceptDialog}>
                    <AcceptIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Decline">
                  <IconButton size="small" color="error" onClick={handleOpenDeclineDialog}>
                    <DeclineIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : null}
            <Tooltip title="View Details">
              <IconButton size="small" color="primary" onClick={() => onViewDetails(row.temp_person_id)}>
                <ViewIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>

      {/* Accept Confirmation Dialog */}
      <Dialog
        open={openAcceptDialog}
        onClose={handleCloseAcceptDialog}
        aria-labelledby="accept-dialog-title"
      >
        <DialogTitle id="accept-dialog-title">Confirm Accept</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to accept the request from {row.form_data[0].farmer_name} for village {row.village_data[0].display_name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAcceptDialog}>Cancel</Button>
          <Button onClick={() => { onAccept(row.temp_person_id); handleCloseAcceptDialog(); }} color="success">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Decline Confirmation Dialog */}
      <Dialog
        open={openDeclineDialog}
        onClose={handleCloseDeclineDialog}
        aria-labelledby="decline-dialog-title"
      >
        <DialogTitle id="decline-dialog-title">Confirm Decline</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to decline the request from {row.form_data[0].farmer_name} for village {row.village_data[0].display_name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeclineDialog}>Cancel</Button>
          <Button onClick={() => { onDecline(row.temp_person_id); handleCloseDeclineDialog(); }} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Enhanced Table Component
const RequestTable = ({ data, rowsPerPage, page, onAccept, onDecline, onViewDetails, activeTab }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  if (isMobile) {
    return (
      <Box>
        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
          <RequestCard 
            key={row.temp_person_id} 
            row={row} 
            onAccept={onAccept} 
            onDecline={onDecline} 
            onViewDetails={onViewDetails}
            activeTab={activeTab}
          />
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
              Farmer Name
            </TableCell>
            <TableCell sx={{ bgcolor: 'primary.main', color: 'black', fontWeight: 600 }}>
              Village
            </TableCell>
            <TableCell sx={{ bgcolor: 'primary.main', color: 'black', fontWeight: 600 }}>
              Date Requested
            </TableCell>
            <TableCell sx={{ bgcolor: 'primary.main', color: 'black', fontWeight: 600 }}>
              Status
            </TableCell>
            <TableCell sx={{ bgcolor: 'primary.main', color: 'black', fontWeight: 600 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
            <RequestRow 
              key={row.temp_person_id} 
              row={row} 
              onAccept={onAccept} 
              onDecline={onDecline} 
              onViewDetails={onViewDetails}
              activeTab={activeTab}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Main Enhanced Component
const RequestManagementTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [villageFilter, setVillageFilter] = useState('');
  const [mobileFilter, setMobileFilter] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('All');

  // Fetch initial data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/floods/api/temp/person/list/`, {
          params: {
            farmer_name: searchTerm,
            village_name: villageFilter,
            mobile_number: mobileFilter,
          }
        });
        const mappedData = response.data.results.map(item => ({
          ...item,
          status: item.is_processed ? 'Accepted' : 'Pending'
        }));
        setData(mappedData);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
      }
    };
    fetchData();
  }, [searchTerm, villageFilter, mobileFilter]);

  const filteredData = useMemo(() => {
    let filtered = data;

    if (activeTab === 'Pending') {
      filtered = filtered.filter((row) => row.status === 'Pending');
    } else if (activeTab === 'Accepted') {
      filtered = filtered.filter((row) => row.status === 'Accepted');
    }

    return filtered;
  }, [activeTab, data]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
  };

  const handleAccept = async (temp_person_id) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/floods/api/temp/to/permanent/create/`, {
        temp_person_data_form_id: temp_person_id
      });
      setData(prev => prev.map(item => 
        item.temp_person_id === temp_person_id ? { ...item, status: 'Accepted', is_processed: true } : item
      ));
      setPage(0);
    } catch (err) {
      setError('Failed to process request. Please try again.');
    }
  };

  const handleDecline = (temp_person_id) => {
    setData(prev => prev.map(item => 
      item.temp_person_id === temp_person_id ? { ...item, status: 'Declined' } : item
    ));
    setPage(0);
  };

  const handleViewDetails = async (temp_person_id) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/floods/api/temp/person/data/by/id/?temp_person_id=${temp_person_id}`);
      setSelectedDetails(response.data[0]);
      setViewDetailsOpen(true);
    } catch (err) {
      setError('Failed to fetch details. Please try again.');
    }
  };

  const handleCloseViewDetails = () => {
    setViewDetailsOpen(false);
    setSelectedDetails(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3 }}>
        
        
        <RequestToolbar
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          villageFilter={villageFilter}
          onVillageFilterChange={(e) => setVillageFilter(e.target.value)}
          mobileFilter={mobileFilter}
          onMobileFilterChange={(e) => setMobileFilter(e.target.value)}
          totalRecords={filteredData.length}
        />
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
        >
          <Tab label="All" value="All" />
          <Tab label="Pending" value="Pending" />
          <Tab label="Accepted" value="Accepted" />
        </Tabs>
        <RequestTable 
          data={filteredData} 
          rowsPerPage={rowsPerPage} 
          page={page} 
          onAccept={handleAccept}
          onDecline={handleDecline}
          onViewDetails={handleViewDetails}
          activeTab={activeTab}
        />
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredData.length}
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
      </Paper>

      <ViewDetailsDialog 
        open={viewDetailsOpen} 
        onClose={handleCloseViewDetails} 
        details={selectedDetails}
      />
    </Container>
  );
};

export default RequestManagementTable;