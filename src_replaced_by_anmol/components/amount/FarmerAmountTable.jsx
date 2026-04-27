import React, { useState, useEffect, useCallback } from "react";
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
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Container,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  AddCircleOutline as AddAmountIcon,
} from "@mui/icons-material";
import axios from "axios";
import debounce from "lodash.debounce";

import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FarmerAmountUpdateScreen from './FarmerAmountUpdateScreen';
import { useNavigate } from "react-router-dom";

const statusConfig = {
  "Completely Destroyed": {
    color: "error",
    icon: <ErrorIcon />,
    bgColor: "#ffebee",
  },
  "Partially Damaged": {
    color: "warning",
    icon: <WarningIcon />,
    bgColor: "#fff3e0",
  },
  "No Damage": {
    color: "success",
    icon: <CheckCircleIcon />,
    bgColor: "#e8f5e8",
  },
};

const FarmerAmountTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [cropLossRange, setCropLossRange] = useState("All");
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amountScreenOpen, setAmountScreenOpen] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState(null);

  const debouncedFetchData = useCallback(
    debounce(async (search, status, cropLoss, currentPage) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (status !== "All") params.append("house_status", status);
        if (cropLoss !== "All" && cropLoss !== "100000+")
          params.append("estimatedCropLoss", cropLoss.replace("+", ""));
        else if (cropLoss === "100000+")
          params.append("estimatedCropLoss", "100000-");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/floods/api/show/person/on/user/page/with/filters/?page=${
            currentPage + 1
          }&page_size=${rowsPerPage}`,
          { params }
        );
        setData(response.data.results || []);
        setTotalCount(response.data.count || 0);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error fetching farmer data:", err);
        setData([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    }, 500),
    [rowsPerPage]
  );

  useEffect(() => {
    debouncedFetchData(searchTerm, statusFilter, cropLossRange, page);
    return () => debouncedFetchData.cancel();
  }, [
    searchTerm,
    statusFilter,
    cropLossRange,
    page,
    debouncedFetchData,
    rowsPerPage,
  ]);

  const handleRefresh = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setCropLossRange("All");
    setPage(0);
    debouncedFetchData("", "All", "All", 0);
  };

  const navigate = useNavigate();
  
  const handleViewAmount = (person_id) => {
    setSelectedPersonId(person_id);
    setAmountScreenOpen(true);
    navigate(`/amount/person/${person_id}/`)
  };

  const handleCloseAmountScreen = () => {
    setAmountScreenOpen(false);
    setSelectedPersonId(null);
    handleRefresh();
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
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1, sm: 2 } }}>
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

  // Mobile Card View
  const MobileCardView = ({ row }) => (
    <Card sx={{ mb: 2, boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
              {row.form_data[0].farmer_name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {row.village_data[0].display_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {row.form_data[0].mobileNumber}
            </Typography>
          </Box>
          <Chip
            label={row.form_data[0].houseStatus}
            color={statusConfig[row.form_data[0].houseStatus]?.color}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Amount Received
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              ₹ {row.form_data[0]?.amount_received || "-"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Amount Needed
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              ₹ {row.form_data[0]?.amount_needed || "-"}
            </Typography>
          </Grid>
        </Grid>
        
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddAmountIcon />}
          onClick={() => handleViewAmount(row.person_id)}
          size="small"
        >
          Add Amount
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1, sm: 2 } }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 3 }}>
        <Toolbar sx={{ 
          p: { xs: 1, sm: 2 }, 
          bgcolor: "#d4edff",
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' }
        }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            sx={{ flexGrow: 1, width: { xs: '100%', md: 'auto' } }}
          >
            <TextField
              label="Search Farmer/Village/Mobile"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
              sx={{ minWidth: { xs: '100%', sm: 200 } }}
              fullWidth={isMobile}
            />
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }} fullWidth={isMobile}>
              <InputLabel>House Status</InputLabel>
              <Select
                value={statusFilter}
                label="House Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Completely Destroyed">
                  Completely Destroyed
                </MenuItem>
                <MenuItem value="Partially Damaged">Partially Damaged</MenuItem>
                <MenuItem value="Minor Damage">Minor Damage</MenuItem>
                <MenuItem value="No Damage">No Damage</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }} fullWidth={isMobile}>
              <InputLabel>Crop Loss Range</InputLabel>
              <Select
                value={cropLossRange}
                label="Crop Loss Range"
                onChange={(e) => setCropLossRange(e.target.value)}
              >
                <MenuItem value="All">All Ranges</MenuItem>
                <MenuItem value="0-10000">₹0 - ₹10,000</MenuItem>
                <MenuItem value="10000-25000">₹10,000 - ₹25,000</MenuItem>
                <MenuItem value="25000-50000">₹25,000 - ₹50,000</MenuItem>
                <MenuItem value="50000-100000">₹50,000 - ₹100,000</MenuItem>
                <MenuItem value="100000+">₹100,000+</MenuItem>
              </Select>
            </FormControl>
            <Tooltip title="Refresh Data">
              <IconButton onClick={handleRefresh} disabled={loading}>
                {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {isMobile || isTablet ? (
              <Box sx={{ p: 2 }}>
                {data.map((row) => (
                  <MobileCardView key={row.person_id} row={row} />
                ))}
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          bgcolor: "primary.main",
                          color: "black",
                          fontWeight: 600,
                        }}
                      >
                        Farmer Name
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: "primary.main",
                          color: "black",
                          fontWeight: 600,
                        }}
                      >
                        Village
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: "primary.main",
                          color: "black",
                          fontWeight: 600,
                        }}
                      >
                        Mobile
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: "primary.main",
                          color: "black",
                          fontWeight: 600,
                        }}
                      >
                        Amount Received
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: "primary.main",
                          color: "black",
                          fontWeight: 600,
                        }}
                      >
                        Amount Needed
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: "primary.main",
                          color: "black",
                          fontWeight: 600,
                        }}
                      >
                        House Status
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: "primary.main",
                          color: "black",
                          fontWeight: 600,
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row) => (
                      <TableRow key={row.person_id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {row.form_data[0].farmer_name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {row.village_data[0].display_name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {row.form_data[0].mobileNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            ₹ {row.form_data[0]?.amount_received || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            ₹ {row.form_data[0]?.amount_needed || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.form_data[0].houseStatus}
                            color={
                              statusConfig[row.form_data[0].houseStatus]?.color
                            }
                            size="small"
                            variant="soft"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Add Amount">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewAmount(row.person_id)}
                            >
                              <AddAmountIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

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
                borderColor: "divider",
                bgcolor: "background.paper",
                '.MuiTablePagination-toolbar': {
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  minHeight: { xs: 'auto', sm: 52 },
                  paddingTop: { xs: 1, sm: 0 },
                  paddingBottom: { xs: 1, sm: 0 }
                },
                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  marginBottom: { xs: 0.5, sm: 0 }
                }
              }}
            />
          </>
        )}
      </Paper>

      {amountScreenOpen && (
        <FarmerAmountUpdateScreen
          personId={selectedPersonId}
          onClose={handleCloseAmountScreen}
        />
      )}
    </Container>
  );
};

export default FarmerAmountTable;