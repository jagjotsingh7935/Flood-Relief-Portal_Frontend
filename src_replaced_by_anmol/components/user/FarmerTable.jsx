import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  LinearProgress,
  TablePagination,
  IconButton,
  Tooltip,
  Icon,
  Paper,
  Toolbar,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Grid,
  Divider,
  Button,
  Backdrop,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Agriculture as AgricultureIcon,
} from "@mui/icons-material";
import FarmerDetailsDialog from "./FarmerDetailDialog";
import Iconify from "../iconify";
import axios from 'axios';

// Status configuration based on damage levels
const statusConfig = {
  "Fully Damaged": {
    color: "error",
    icon: <Icon icon="mdi:alert-circle" />,
    bgColor: "#ffebee",
  },
  "Partially Damaged": {
    color: "warning",
    icon: <Icon icon="mdi:alert" />,
    bgColor: "#fff3e0",
  },
  Safe: {
    color: "success",
    icon: <Icon icon="mdi:check-circle" />,
    bgColor: "#e8f5e8",
  },
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
  onCropLossRangeChange,
  onGeneratePDF,
  pdfLoading,
}) => {
  return (
    <Paper elevation={2} sx={{ mb: 2, bgcolor: "transparent" }}>
      <Toolbar
        sx={{
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          py: 2,
          px: { xs: 1, sm: 2 },
          alignItems: { xs: "stretch", md: "center" },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ width: "100%", flexWrap: "wrap" }}
        >
          <TextField
            label="Search Farmer/Village/Mobile"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={onSearchChange}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "action.active" }} />
              ),
            }}
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 200px" },
              minWidth: 0,
            }}
          />

          <FormControl
            size="small"
            sx={{ flex: { xs: "1 1 100%", sm: "1 1 150px" }, minWidth: 0 }}
          >
            <InputLabel>House Status</InputLabel>
            <Select
              value={statusFilter}
              label="House Status"
              onChange={onStatusFilterChange}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Fully Damaged">Fully Damaged</MenuItem>
              <MenuItem value="Partially Damaged">Partially Damaged</MenuItem>
              <MenuItem value="Safe">No Damage</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{ flex: { xs: "1 1 100%", sm: "1 1 150px" }, minWidth: 0 }}
          >
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
              <MenuItem value="100000+">₹100,000-₹10,000,00</MenuItem>
            </Select>
          </FormControl>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            <Tooltip title="Refresh Data">
              <IconButton
                onClick={onRefresh}
                disabled={loading || pdfLoading}
                sx={{
                  bgcolor: "background.paper",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              color="primary"
              onClick={onGeneratePDF}
              disabled={loading || pdfLoading}
              sx={{ height: 'fit-content' }}
            >
              {pdfLoading ? 'Generating PDF...' : 'Generate PDF'}
            </Button>
          </Box>
        </Stack>
      </Toolbar>
    </Paper>
  );
};

// Mobile Card View Component
const FarmerMobileCard = ({ farmer, onViewDetails }) => {
  return (
    <Card
      sx={{
        mb: 2,
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-2px)",
          transition: "all 0.3s",
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
          <Avatar
  src={farmer.form_data[0]?.farmer_image}
  sx={{ 
    width: 50, 
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: farmer.form_data[0]?.farmer_image ? 'transparent' : '#2a2a2a',
    color: '#90caf9',
    fontWeight: 600,
    fontSize: '1.2rem'
  }}
  alt={farmer.form_data[0]?.farmer_name}
>
  {farmer.form_data[0]?.farmer_image ? null : (farmer.form_data[0]?.farmer_name?.[0]?.toUpperCase() || 'N/A')}
</Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {farmer.form_data[0]?.farmer_name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {farmer.form_data[0]?.fatherName}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {farmer.form_data[0]?.mobileNumber}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Grid container spacing={1.5}>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Village
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {farmer.village_data[0]?.display_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {farmer.village_data[0]?.tehsil_data[0]?.name}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              House Status
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={farmer.form_data[0]?.houseStatus}
                size="small"
                color={statusConfig[farmer.form_data[0]?.houseStatus]?.color}
                icon={statusConfig[farmer.form_data[0]?.houseStatus]?.icon}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Land Affected
            </Typography>
            <Typography variant="body2">
              {farmer.form_data[0]?.landAffected} /{" "}
              {farmer.form_data[0]?.totalLandOwned} acres
            </Typography>
            <LinearProgress
              variant="determinate"
              value={
                (farmer.form_data[0]?.landAffected /
                  farmer.form_data[0]?.totalLandOwned) *
                  100 || 0
              }
              sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
              color="warning"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Amount
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Chip
                label={`Received: ₹${farmer.form_data[0]?.amount_received || 0}`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`Needed: ₹${farmer.form_data[0]?.amount_needed || 0}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={
                (farmer.form_data[0]?.amount_received /
                  farmer.form_data[0]?.amount_needed) *
                  100 || 0
              }
              sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
              color="primary"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Tooltip title="View Details">
            <IconButton
              onClick={() => onViewDetails(farmer.person_id)}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                "&:hover": { bgcolor: "primary.dark" },
              }}
              size="medium"
            >
              <Iconify icon="mdi:eye" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

const FarmerDetailsTable = ({
  farmers,
  loading,
  count,
  page,
  onChange,
  rowsPerPage,
  onRowsPerPageChange,
  setRowsPerPage,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  cropLossRange,
  setCropLossRange,
  onRefresh,
  searchQuery,
  selectedVillageId
}) => {
  const [selectedFarmerId, setSelectedFarmerId] = useState(null);
  const [farmerDialogOpen, setFarmerDialogOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

const handleGeneratePDF = async () => {
  setPdfLoading(true);
  try {
    // Create params object conditionally
    const params = {
      search: searchTerm || undefined,
    };
    
    // Add village_id only if selectedVillageId exists
    if (selectedVillageId) {
      params.village_id = selectedVillageId;
    }

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/floods/api/generate/person/data/pdf/`, {
      params: params,
    });

    const pdfUrl = response.data;
    
    if (!pdfUrl) {
      throw new Error('No PDF URL received from server');
    }

    // Force download approach
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfUrl;
    downloadLink.download = `farmers_data_${new Date().toISOString().split('T')[0]}.pdf`;
    downloadLink.target = '_blank';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  } finally {
    setPdfLoading(false);
  }
};
  useEffect(() => {
    console.log("FarmerDetailsTable farmers prop:", farmers);
    console.log("FarmerDetailsTable count:", count);
    console.log("FarmerDetailsTable filters:", {
      searchTerm,
      statusFilter,
      cropLossRange,
      searchQuery,
    });
  }, [farmers, count, searchTerm, statusFilter, cropLossRange, searchQuery]);

  const handleViewFarmerDetails = (farmerId) => {
    setSelectedFarmerId(farmerId);
    setFarmerDialogOpen(true);
  };

  const handleCloseFarmerDialog = () => {
    setFarmerDialogOpen(false);
    setSelectedFarmerId(null);
  };

  const isFiltered =
    searchTerm || statusFilter !== "All" || cropLossRange !== "All";

  if (!searchQuery) {
    return (
      <Card sx={{ mt: 2 }}>
        <CardContent sx={{ px: { xs: 1, sm: 2 } }}>
          <FarmerToolbar
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            statusFilter={statusFilter}
            onStatusFilterChange={(e) => setStatusFilter(e.target.value)}
            onRefresh={onRefresh}
            totalRecords={count}
            loading={loading}
            cropLossRange={cropLossRange}
            onCropLossRangeChange={(e) => setCropLossRange(e.target.value)}
            onGeneratePDF={handleGeneratePDF}
            pdfLoading={pdfLoading}
          />
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Please enter a search query in "Search Village/City or Pincode" to
              view farmer data
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card sx={{ mt: 2 }}>
        <CardContent sx={{ px: { xs: 1, sm: 2 } }}>
          <FarmerToolbar
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            statusFilter={statusFilter}
            onStatusFilterChange={(e) => setStatusFilter(e.target.value)}
            onRefresh={onRefresh}
            totalRecords={count}
            loading={loading}
            cropLossRange={cropLossRange}
            onCropLossRangeChange={(e) => setCropLossRange(e.target.value)}
            onGeneratePDF={handleGeneratePDF}
            pdfLoading={pdfLoading}
          />
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <LinearProgress sx={{ width: "100%" }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ mt: 2 }}>
        <CardContent sx={{ px: { xs: 1, sm: 2 } }}>
          <FarmerToolbar
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            statusFilter={statusFilter}
            onStatusFilterChange={(e) => setStatusFilter(e.target.value)}
            onRefresh={onRefresh}
            totalRecords={count}
            loading={loading}
            cropLossRange={cropLossRange}
            onCropLossRangeChange={(e) => setCropLossRange(e.target.value)}
            onGeneratePDF={handleGeneratePDF}
            pdfLoading={pdfLoading}
          />

          {!farmers || farmers.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                {isFiltered
                  ? "No results found for the applied filters"
                  : "No farmer data found"}
              </Typography>
            </Box>
          ) : (
            <>
              {/* Mobile View - Card Layout */}
              {isMobile ? (
                <Box sx={{ px: { xs: 1, sm: 2 } }}>
                  {farmers.map((farmer) => (
                    <FarmerMobileCard
                      key={farmer.person_id}
                      farmer={farmer}
                      onViewDetails={handleViewFarmerDetails}
                    />
                  ))}
                </Box>
              ) : (
                /* Desktop View - Table Layout */
                <TableContainer sx={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Farmer Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Mobile</TableCell>
                        <TableCell>Village</TableCell>
                        <TableCell>Land Affected</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {farmers.map((farmer) => (
                        <TableRow key={farmer.person_id} hover>
                          <TableCell>
                            <Avatar
                              src={farmer.form_data[0]?.farmer_image}
                              sx={{ width: 50, height: 50 }}
                              alt={farmer.form_data[0]?.farmer_name}
                            >
                              <Icon icon="mdi:user" />
                            </Avatar>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {farmer.form_data[0]?.farmer_name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {farmer.form_data[0]?.fatherName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {farmer.form_data[0]?.mobileNumber}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {farmer.village_data[0]?.display_name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {farmer.village_data[0]?.tehsil_data[0]?.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2">
                                {farmer.form_data[0]?.landAffected} /{" "}
                                {farmer.form_data[0]?.totalLandOwned} acres
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={
                                  (farmer.form_data[0]?.landAffected /
                                    farmer.form_data[0]?.totalLandOwned) *
                                    100 || 0
                                }
                                sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                                color="warning"
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={farmer.form_data[0]?.houseStatus}
                              size="small"
                              color={
                                statusConfig[farmer.form_data[0]?.houseStatus]
                                  ?.color
                              }
                              icon={
                                statusConfig[farmer.form_data[0]?.houseStatus]
                                  ?.icon
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Chip
                                label={`Received: ₹${
                                  farmer.form_data[0]?.amount_received || 0
                                }`}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ mr: 1 }}
                              />
                              <Chip
                                label={`Needed: ₹${
                                  farmer.form_data[0]?.amount_needed || 0
                                }`}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ mt: 0.5 }}
                              />
                              <LinearProgress
                                variant="determinate"
                                value={
                                  (farmer.form_data[0]?.amount_received /
                                    farmer.form_data[0]?.amount_needed) *
                                    100 || 0
                                }
                                sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                                color="primary"
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="View Details" placement="top">
                              <IconButton
                                onClick={() =>
                                  handleViewFarmerDetails(farmer.person_id)
                                }
                                sx={{
                                  bgcolor: "primary.main",
                                  color: "white",
                                  "&:hover": { bgcolor: "primary.dark" },
                                }}
                                size="small"
                              >
                                <Iconify icon="mdi:eye" />
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
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={Math.max(
                  0,
                  Math.min(page, Math.ceil(count / rowsPerPage) - 1)
                )} // Ensure page is within valid range
                onPageChange={onChange}
                onRowsPerPageChange={onRowsPerPageChange}
                sx={{
                  ".MuiTablePagination-toolbar": {
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                    justifyContent: { xs: "center", sm: "flex-end" },
                  },
                  ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                    {
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    },
                }}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={pdfLoading}
      >
        <CircularProgress color="inherit" />
        <Typography sx={{ ml: 2 }}>Generating PDF...</Typography>
      </Backdrop>

      <FarmerDetailsDialog
        open={farmerDialogOpen}
        onClose={handleCloseFarmerDialog}
        farmerId={selectedFarmerId}
      />
    </>
  );
};

export default FarmerDetailsTable;