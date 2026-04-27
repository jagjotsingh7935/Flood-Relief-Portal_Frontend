import React, { useState, useEffect } from 'react';
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
  Typography,
  Toolbar,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  PersonAdd as PersonAddIcon,
  Edit,
  Delete,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deleteAdmin, getAdmins } from '../../api/api';
import AdminForm from './AdminForm';
import debounce from 'lodash.debounce';

// Blue theme aligned with FarmerResponseTable
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#f5c518',
      light: '#ffd54f',
      dark: '#c79100',
    },
    error: {
      main: '#d32f2f',
    },
    success: {
      main: '#2e7d32',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

// Status configuration for admin status
const statusConfig = {
  true: { color: 'success', icon: null, bgColor: '#e8f5e8' },
  false: { color: 'error', icon: null, bgColor: '#ffebee' },
};

// Enhanced Toolbar Component
const AdminToolbar = ({ 
  searchTerm, 
  onSearchChange, 
  onRefresh, 
  totalRecords, 
  loading, 
  onCreate 
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
            <PersonAddIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Admin Management
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {totalRecords} admin records
            </Typography>
          </Box>
        </Box>
        
        <Stack 
          direction={isMobile ? 'column' : 'row'} 
          spacing={2} 
          sx={{ width: isMobile ? '100%' : 'auto' }}
        >
          <TextField
            label="Search Admin/Email/Phone"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={onSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
            sx={{ minWidth: isMobile ? '100%' : 200 }}
          />
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={onCreate}
              disabled={loading}
              sx={{
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.25 },
                fontWeight: 700,
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                  boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(25, 118, 210, 0.5)',
                  color: 'rgba(255, 255, 255, 0.7)',
                }
              }}
            >
              Create New Admin
            </Button>
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
const AdminCard = ({ admin, onEdit, onDelete }) => (
  <Fade in timeout={300}>
    <Card 
      sx={{ 
        mb: 2, 
        borderLeft: 4, 
        borderLeftColor: admin.is_active ? 'success.main' : 'error.main',
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
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
              {admin.full_name?.charAt(0)?.toUpperCase() || 'A'}
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                {admin.full_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID: {admin.id}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={admin.is_active ? 'Active' : 'Inactive'}
            color={statusConfig[admin.is_active].color}
            size="small"
            variant="outlined"
          />
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon fontSize="small" color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">Email</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
                  {admin.email}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            {admin.phone_number && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {admin.phone_number}
                  </Typography>
                </Box>
              </Box>
            )}
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon fontSize="small" color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">Created At</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {new Date(admin.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Tooltip title="Edit Admin">
            <IconButton 
              onClick={() => onEdit(admin.admin_id)}
              size="small"
              color="primary"
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Admin">
            <IconButton 
              onClick={() => onDelete(admin.admin_id, admin.full_name)}
              size="small"
              color="error"
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  </Fade>
);

// Enhanced Table Row Component
const AdminRow = ({ admin, onEdit, onDelete }) => (
  <TableRow 
    hover 
    sx={{ 
      '&:hover': { 
        bgcolor: statusConfig[admin.is_active].bgColor,
        transform: 'scale(1.002)',
        transition: 'all 0.1s ease-in-out'
      }
    }}
  >
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
          {admin.full_name?.charAt(0)?.toUpperCase() || 'A'}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {admin.full_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {admin.id}
          </Typography>
        </Box>
      </Box>
    </TableCell>
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <EmailIcon fontSize="small" color="action" />
        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
          {admin.email}
        </Typography>
      </Box>
    </TableCell>
    <TableCell>
      {admin.phone_number && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhoneIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {admin.phone_number}
          </Typography>
        </Box>
      )}
    </TableCell>
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CalendarIcon fontSize="small" color="action" />
        <Typography variant="body2">
          {new Date(admin.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </Typography>
      </Box>
    </TableCell>
    <TableCell>
      <Chip
        label={admin.is_active ? 'Active' : 'Inactive'}
        color={statusConfig[admin.is_active].color}
        size="small"
        variant="soft"
        sx={{ fontWeight: 600 }}
      />
    </TableCell>
    <TableCell>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="Edit Admin">
          <IconButton 
            onClick={() => onEdit(admin.admin_id)}
            size="small"
            color="primary"
          >
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Admin">
          <IconButton 
            onClick={() => onDelete(admin.admin_id, admin.full_name)}
            size="small"
            color="error"
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    </TableCell>
  </TableRow>
);

// Enhanced Table Component
const AdminTable = ({ data, rowsPerPage, page, onEdit, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  if (isMobile) {
    return (
      <Box>
        {data.map((admin) => (
          <AdminCard 
            key={admin.admin_id} 
            admin={admin} 
            onEdit={onEdit} 
            onDelete={onDelete} 
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
            <TableCell sx={{ bgcolor: 'default', color: 'black', fontWeight: 600 }}>
              Admin Details
            </TableCell>
            <TableCell sx={{ bgcolor: 'default', color: 'black', fontWeight: 600 }}>
              Email
            </TableCell>
            <TableCell sx={{ bgcolor: 'default', color: 'black', fontWeight: 600 }}>
              Phone Number
            </TableCell>
            <TableCell sx={{ bgcolor: 'default', color: 'black', fontWeight: 600 }}>
              Created At
            </TableCell>
            <TableCell sx={{ bgcolor: 'default', color: 'black', fontWeight: 600 }}>
              Status
            </TableCell>
            <TableCell sx={{ bgcolor: 'default', color: 'black', fontWeight: 600 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((admin) => (
            <AdminRow 
              key={admin.admin_id} 
              admin={admin} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteAdminName, setDeleteAdminName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  // Debounced search handler
  const debouncedSearch = debounce((value) => {
    const filtered = admins.filter(admin => 
      admin.full_name.toLowerCase().includes(value.toLowerCase()) ||
      admin.email.toLowerCase().includes(value.toLowerCase()) ||
      (admin.phone_number && admin.phone_number.includes(value))
    );
    setFilteredAdmins(filtered);
    setPage(0);
  }, 500);

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, admins]);

  const fetchAdmins = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdmins();
      const results = data.results || data;
      setAdmins(results);
      setFilteredAdmins(results);
    } catch (err) {
      setError(err.message || 'Failed to fetch admins');
      setFilteredAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedAdminId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (id) => {
    setSelectedAdminId(id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteConfirm = (id, fullName) => {
    setDeleteId(id);
    setDeleteAdminName(fullName);
    setOpenDeleteConfirm(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteAdmin(deleteId);
      await fetchAdmins();
      setOpenDeleteConfirm(false);
    } catch (err) {
      setError(err.message || 'Failed to delete admin');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = (shouldRefresh = false) => {
    setShowForm(false);
    setSelectedAdminId(null);
    if (shouldRefresh) {
      fetchAdmins();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (error && !filteredAdmins.length && !loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">Error loading data</Typography>
          <Typography>{error}</Typography>
          <Button onClick={fetchAdmins} sx={{ mt: 1 }}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ py: 3, minHeight: '100vh' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3,boxShadow:'none' }}>
          {!showForm && (
            <AdminToolbar
              searchTerm={searchTerm}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              onRefresh={fetchAdmins}
              totalRecords={filteredAdmins.length}
              loading={loading}
              onCreate={handleCreate}
            />
          )}
          
          {showForm && (
            <Fade in>
              <Box sx={{ mb: 3 }}>
                <AdminForm 
                  adminId={selectedAdminId} 
                  onClose={handleCloseForm} 
                />
              </Box>
            </Fade>
          )}

          {!showForm && loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : !showForm && (
            <>
              <AdminTable 
                data={filteredAdmins.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                rowsPerPage={rowsPerPage}
                page={page}
                onEdit={handleEdit}
                onDelete={handleDeleteConfirm}
              />
              
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredAdmins.length}
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

              <Box sx={{ 
                mt: 3, 
                px: 2,
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Total Admins: <strong style={{ color: theme.palette.primary.main }}>{filteredAdmins.length}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Active: <strong style={{ color: theme.palette.success.main }}>
                    {filteredAdmins.filter(a => a.is_active).length}
                  </strong>
                  {' | '}
                  Inactive: <strong style={{ color: theme.palette.error.main }}>
                    {filteredAdmins.filter(a => !a.is_active).length}
                  </strong>
                </Typography>
              </Box>
            </>
          )}
        </Paper>

        <Dialog 
          open={openDeleteConfirm} 
          onClose={() => setOpenDeleteConfirm(false)}
          maxWidth="xs"
          fullWidth
          fullScreen={isSmallMobile}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              borderRadius: isSmallMobile ? 0 : 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            }
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
              color: 'error.main',
              pt: 3,
              pb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            }}
          >
            <Delete />
            Confirm Delete
          </DialogTitle>
          <DialogContent sx={{ pt: 2, pb: 3 }}>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              Are you sure you want to delete admin <strong>"{deleteAdminName}"</strong>?
            </Typography>
            <Typography variant="body2" color="error.main" sx={{ mt: 2, fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button
              onClick={() => setOpenDeleteConfirm(false)}
              variant="outlined"
              fullWidth={isSmallMobile}
              sx={{
                borderColor: 'grey.400',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'grey.600',
                  background: 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              disabled={loading}
              fullWidth={isSmallMobile}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Delete />}
              sx={{
                background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #c62828 0%, #d32f2f 100%)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(211, 47, 47, 0.5)',
                  color: 'rgba(255, 255, 255, 0.7)',
                }
              }}
            >
              Delete Admin
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}