import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Box,
  Typography,
  Chip,
  Button,
  Backdrop,
  CircularProgress,
  Autocomplete,
  Card,
  CardContent,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import axios from "axios";
import AppBarComponent from "./AppBarComponent";
import {
  Phone,
  Landscape,
  Agriculture,
  Person,
  LocationOn,
} from "@mui/icons-material";

export default function TotalFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTehsil, setSelectedTehsil] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [formData, setFormData] = useState({
    state_id: null,
    stateName: "",
    district_id: null,
    tehsil_id: null,
    village_id: null,
    tehsilName: "",
    villageName: "",
  });

  const fetchStates = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/floods/api/state/list/`
      );
      const data = await response.json();
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
    }
  };

  const fetchDistrict = async (stateId) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/floods/api/district/list/?state_id=${stateId}`
      );
      const data = await response.json();
      setDistricts(data);
    } catch (error) {
      console.error("Error fetching districts:", error);
      setDistricts([]);
    }
  };

  const fetchTehsil = async (districtId) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/floods/api/tehsil/list/?district_name=${districtId}`
      );
      const data = await response.json();
      setTehsils(data);
    } catch (error) {
      console.error("Error fetching tehsils:", error);
      setTehsils([]);
    }
  };

  const fetchVillage = async (tehsilId) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/floods/api/village/list/?tehsil_name=${tehsilId}`
      );
      const data = await response.json();
      setVillages(data);
    } catch (error) {
      console.error("Error fetching villages:", error);
      setVillages([]);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchDistrict(selectedState.state_id);
      setDistricts([]);
      setSelectedDistrict(null);
      setTehsils([]);
      setSelectedTehsil(null);
      setVillages([]);
      setSelectedVillage(null);
      setFormData((prev) => ({
        ...prev,
        state_id: selectedState.state_id,
        stateName: selectedState.name,
        district_id: null,
        tehsil_id: null,
        village_id: null,
        tehsilName: "",
        villageName: "",
      }));
    } else {
      setDistricts([]);
      setSelectedDistrict(null);
      setTehsils([]);
      setSelectedTehsil(null);
      setVillages([]);
      setSelectedVillage(null);
      setFormData((prev) => ({
        ...prev,
        state_id: null,
        stateName: "",
        district_id: null,
        tehsil_id: null,
        village_id: null,
        tehsilName: "",
        villageName: "",
      }));
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchTehsil(selectedDistrict.name);
      setTehsils([]);
      setSelectedTehsil(null);
      setVillages([]);
      setSelectedVillage(null);
      setFormData((prev) => ({
        ...prev,
        district_id: selectedDistrict.id,
        tehsil_id: null,
        village_id: null,
        tehsilName: "",
        villageName: "",
      }));
    } else {
      setTehsils([]);
      setSelectedTehsil(null);
      setVillages([]);
      setSelectedVillage(null);
      setFormData((prev) => ({
        ...prev,
        district_id: null,
        tehsil_id: null,
        village_id: null,
        tehsilName: "",
        villageName: "",
      }));
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedTehsil) {
      fetchVillage(selectedTehsil.name);
      setVillages([]);
      setSelectedVillage(null);
      setFormData((prev) => ({
        ...prev,
        tehsil_id: selectedTehsil.id,
        village_id: null,
        tehsilName: selectedTehsil.name,
        villageName: "",
      }));
    } else {
      setVillages([]);
      setSelectedVillage(null);
      setFormData((prev) => ({
        ...prev,
        tehsil_id: null,
        village_id: null,
        tehsilName: "",
        villageName: "",
      }));
    }
  }, [selectedTehsil]);

  useEffect(() => {
    if (selectedVillage) {
      setFormData((prev) => ({
        ...prev,
        village_id: selectedVillage.id,
        villageName: selectedVillage.name,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        village_id: null,
        villageName: "",
      }));
    }
  }, [selectedVillage]);

  const fetchFarmerData = async (pageNum = 1, search = "") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/floods/api/show/person/on/user/page/with/filters/uisng/village/id/`,
        {
          params: {
            page: pageNum,
            page_size: rowsPerPage,
            search: search || undefined,
            state_id: formData.state_id || undefined,
            city_id: formData.district_id || undefined,
            tehsil_id: formData.tehsil_id || undefined,
            village_id: formData.village_id || undefined,
          },
        }
      );

      const { results, count } = response.data;
      const transformedData = results.map((item) => ({
        image: item.form_data[0]?.farmer_image,
        name: item.form_data[0]?.farmer_name || "N/A",
        location:
          item.village_data[0]?.tehsil_data[0]?.city_data[0]?.name || "N/A",
        tehsil: item.village_data[0]?.tehsil_data[0]?.name || "N/A",
        village: item.village_data[0]?.display_name || "N/A",
        landSize: item.form_data[0]?.totalLandOwned
          ? `${item.form_data[0].totalLandOwned} acres`
          : "N/A",
        crop: item.form_data[0]?.cropsPlanted || "N/A",
        phone: item.form_data[0]?.mobileNumber || "N/A",
        houseStatus: item.form_data[0]?.houseStatus || "No Damage",
      }));

      setFarmers(transformedData);
      setTotalCount(count);
    } catch (error) {
      console.error("Error fetching farmer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    setPdfLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/floods/api/generate/person/data/pdf/`,
        {
          params: {
            search: searchTerm || undefined,
            state_id: formData.state_id || undefined,
            district_id: formData.district_id || undefined,
            tehsil_id: formData.tehsil_id || undefined,
            village_id: formData.village_id || undefined,
          },
        }
      );

      const pdfUrl = response.data;

      if (!pdfUrl) {
        throw new Error("No PDF URL received from server");
      }

      const downloadLink = document.createElement("a");
      downloadLink.href = pdfUrl;
      downloadLink.download = `farmers_data_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      downloadLink.target = "_blank";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerData(page + 1, searchTerm);
  }, [page, rowsPerPage, searchTerm, formData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#121212" }}>
      <AppBarComponent />
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#ffffff",
              mb: 1,
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
            }}
          >
            Total Farmers
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#b0b0b0",
              mb: 2,
            }}
          >
            Manage and view farmer information with advanced filtering options
          </Typography>
          <Divider sx={{ borderColor: "#424242" }} />
        </Box>

        {/* Stats Card */}
        <Card
          sx={{
            mb: 3,
            backgroundColor: "#1e1e1e",
            border: "1px solid #424242",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardContent>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
            >
              <Box>
                <Typography
                  variant="h3"
                  sx={{ color: "#90caf9", fontWeight: "bold" }}
                >
                  {totalCount}
                </Typography>
                <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                  Total Farmers
                </Typography>
              </Box>
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  borderColor: "#424242",
                  display: { xs: "none", sm: "block" },
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 1 }}>
                  Active Filters:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {selectedState && (
                    <Chip
                      label={selectedState.name}
                      size="small"
                      sx={{
                        backgroundColor: "#2a2a2a",
                        color: "#90caf9",
                        border: "1px solid #424242",
                      }}
                    />
                  )}
                  {selectedDistrict && (
                    <Chip
                      label={selectedDistrict.name}
                      size="small"
                      sx={{
                        backgroundColor: "#2a2a2a",
                        color: "#90caf9",
                        border: "1px solid #424242",
                      }}
                    />
                  )}
                  {selectedTehsil && (
                    <Chip
                      label={selectedTehsil.name}
                      size="small"
                      sx={{
                        backgroundColor: "#2a2a2a",
                        color: "#90caf9",
                        border: "1px solid #424242",
                      }}
                    />
                  )}
                  {selectedVillage && (
                    <Chip
                      label={selectedVillage.name}
                      size="small"
                      sx={{
                        backgroundColor: "#2a2a2a",
                        color: "#90caf9",
                        border: "1px solid #424242",
                      }}
                    />
                  )}
                  {!selectedState &&
                    !selectedDistrict &&
                    !selectedTehsil &&
                    !selectedVillage && (
                      <Typography
                        variant="body2"
                        sx={{ color: "#757575", fontStyle: "italic" }}
                      >
                        No filters applied
                      </Typography>
                    )}
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Filters Section */}
        <Card
          sx={{
            mb: 3,
            backgroundColor: "#1e1e1e",
            border: "1px solid #424242",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ color: "#ffffff", mb: 2, fontWeight: 600 }}
            >
              Filter Options
            </Typography>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr 1fr",
                },
              }}
            >
              <Autocomplete
                options={states}
                getOptionLabel={(option) => option.name || ""}
                value={selectedState}
                onChange={(event, newValue) => setSelectedState(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select State"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        backgroundColor: "#2a2a2a",
                        "& fieldset": { borderColor: "#424242" },
                        "&:hover fieldset": { borderColor: "#616161" },
                        "&.Mui-focused fieldset": { borderColor: "#ffffff" },
                      },
                      "& .MuiInputLabel-root": { color: "#b0b0b0" },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#ffffff" },
                    }}
                  />
                )}
              />
              <Autocomplete
                options={districts}
                getOptionLabel={(option) => option.name || ""}
                value={selectedDistrict}
                onChange={(event, newValue) => setSelectedDistrict(newValue)}
                disabled={!selectedState}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select District"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        backgroundColor: "#2a2a2a",
                        "& fieldset": { borderColor: "#424242" },
                        "&:hover fieldset": { borderColor: "#616161" },
                        "&.Mui-focused fieldset": { borderColor: "#ffffff" },
                      },
                      "& .MuiInputLabel-root": { color: "#b0b0b0" },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#ffffff" },
                    }}
                  />
                )}
              />
              <Autocomplete
                options={tehsils}
                getOptionLabel={(option) => option.name || ""}
                value={selectedTehsil}
                onChange={(event, newValue) => setSelectedTehsil(newValue)}
                disabled={!selectedDistrict}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Tehsil"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        backgroundColor: "#2a2a2a",
                        "& fieldset": { borderColor: "#424242" },
                        "&:hover fieldset": { borderColor: "#616161" },
                        "&.Mui-focused fieldset": { borderColor: "#ffffff" },
                      },
                      "& .MuiInputLabel-root": { color: "#b0b0b0" },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#ffffff" },
                    }}
                  />
                )}
              />
              <Autocomplete
                options={villages}
                getOptionLabel={(option) => option.name || ""}
                value={selectedVillage}
                onChange={(event, newValue) => setSelectedVillage(newValue)}
                disabled={!selectedTehsil}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Village"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        backgroundColor: "#2a2a2a",
                        "& fieldset": { borderColor: "#424242" },
                        "&:hover fieldset": { borderColor: "#616161" },
                        "&.Mui-focused fieldset": { borderColor: "#ffffff" },
                      },
                      "& .MuiInputLabel-root": { color: "#b0b0b0" },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#ffffff" },
                    }}
                  />
                )}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <TextField
                fullWidth
                label="Search Farmers"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    color: "#ffffff",
                    backgroundColor: "#2a2a2a",
                    "& fieldset": { borderColor: "#424242" },
                    "&:hover fieldset": { borderColor: "#616161" },
                    "&.Mui-focused fieldset": { borderColor: "#90caf9" },
                  },
                  "& .MuiInputLabel-root": { color: "#b0b0b0" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#ffffff" },
                }}
                placeholder="Search by name, location, or crop..."
              />
              <Button
                variant="contained"
                onClick={handleGeneratePDF}
                disabled={loading || pdfLoading}
                sx={{
                  backgroundColor: "#1a7cd5",
                  color: "#ffffff",
                  fontWeight: 600,
                  px: 4,
                  whiteSpace: "nowrap",
                  "&:hover": { backgroundColor: "#1d4fa0" },
                  "&:disabled": {
                    backgroundColor: "#424242",
                    color: "#757575",
                  },
                }}
              >
                {pdfLoading ? "Generating PDF..." : "Generate PDF"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Table Section */}
        <Card
          sx={{
            backgroundColor: "#1e1e1e",
            border: "1px solid #424242",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
          }}
        >
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "#90caf9",
                      fontWeight: "bold",
                      borderBottom: "2px solid #424242",
                      backgroundColor: "#1a1a1a",
                      py: 2,
                    }}
                  >
                    Image
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#90caf9",
                      fontWeight: "bold",
                      borderBottom: "2px solid #424242",
                      backgroundColor: "#1a1a1a",
                      py: 2,
                    }}
                  >
                    Farmer Details
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#90caf9",
                      fontWeight: "bold",
                      borderBottom: "2px solid #424242",
                      backgroundColor: "#1a1a1a",
                      py: 2,
                    }}
                  >
                    Location
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#90caf9",
                      fontWeight: "bold",
                      borderBottom: "2px solid #424242",
                      backgroundColor: "#1a1a1a",
                      py: 2,
                    }}
                  >
                    Land Size
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#90caf9",
                      fontWeight: "bold",
                      borderBottom: "2px solid #424242",
                      backgroundColor: "#1a1a1a",
                      py: 2,
                    }}
                  >
                    Crop
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#90caf9",
                      fontWeight: "bold",
                      borderBottom: "2px solid #424242",
                      backgroundColor: "#1a1a1a",
                      py: 2,
                    }}
                  >
                    Contact
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#90caf9",
                      fontWeight: "bold",
                      borderBottom: "2px solid #424242",
                      backgroundColor: "#1a1a1a",
                      py: 2,
                    }}
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{ color: "#ffffff", borderBottom: "none", py: 8 }}
                    >
                      <CircularProgress sx={{ color: "#90caf9" }} />
                      <Typography sx={{ mt: 2, color: "#b0b0b0" }}>
                        Loading farmer data...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : farmers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{ color: "#ffffff", borderBottom: "none", py: 8 }}
                    >
                      <Typography sx={{ color: "#b0b0b0" }}>
                        No farmers found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  farmers.map((farmer, index) => (
                    <TableRow
                      key={farmer.id}
                      sx={{
                        "&:hover": { backgroundColor: "#2a2a2a" },
                        backgroundColor:
                          index % 2 === 0 ? "#1a1a1a" : "#1e1e1e",
                      }}
                    >
                      <TableCell
                        sx={{
                          color: "#e0e0e0",
                          borderBottom: "1px solid #424242",
                          py: 2.5,
                        }}
                      >
                        {farmer.image ? (
                          <img
                            src={farmer.image}
                            alt={farmer.name}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              backgroundColor: "#2a2a2a",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#90caf9",
                              fontWeight: 600,
                              fontSize: "1.2rem",
                              border: "1px solid #424242",
                            }}
                          >
                            {farmer.name?.charAt(0).toUpperCase() || "N/A"}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{ borderBottom: "1px solid #424242", py: 2.5 }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Person sx={{ color: "#90caf9", fontSize: 20 }} />
                          <Typography
                            sx={{ color: "#ffffff", fontWeight: 500 }}
                          >
                            {farmer.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell
                        sx={{ borderBottom: "1px solid #424242", py: 2.5 }}
                      >
                        <Stack direction="column" spacing={0.5}>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <LocationOn
                              sx={{ color: "#90caf9", fontSize: 20 }}
                            />
                            <Typography sx={{ color: "#e0e0e0" }}>
                              {farmer.location}
                            </Typography>
                          </Stack>
                          <Typography
                            sx={{ color: "#b0b0b0", fontSize: "0.75rem" }}
                          >
                            Tehsil: {farmer.tehsil || "N/A"}
                          </Typography>
                          <Typography
                            sx={{ color: "#b0b0b0", fontSize: "0.75rem" }}
                          >
                            Village: {farmer.village || "N/A"}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell
                        sx={{ borderBottom: "1px solid #424242", py: 2.5 }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Landscape sx={{ color: "#90caf9", fontSize: 20 }} />
                          <Typography sx={{ color: "#e0e0e0" }}>
                            {farmer.landSize}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell
                        sx={{ borderBottom: "1px solid #424242", py: 2.5 }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Agriculture
                            sx={{ color: "#90caf9", fontSize: 20 }}
                          />
                          <Typography sx={{ color: "#e0e0e0" }}>
                            {farmer.crop}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell
                        sx={{ borderBottom: "1px solid #424242", py: 2.5 }}
                      >
                        <Chip
                          icon={
                            <Phone
                              sx={{ fontSize: 16, color: "#90caf9 !important" }}
                            />
                          }
                          label={farmer.phone}
                          sx={{
                            backgroundColor: "#2a2a2a",
                            color: "#ffffff",
                            border: "1px solid #424242",
                            fontWeight: 500,
                            "& .MuiChip-icon": {
                              color: "#90caf9",
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ borderBottom: "1px solid #424242", py: 2.5 }}
                      >
                        <Chip
                          label={farmer.houseStatus}
                          sx={{
                            backgroundColor:
                              farmer.houseStatus === "No Damage"
                                ? "#2e7d32"
                                : farmer.houseStatus === "Partially Damaged"
                                ? "#f57c00"
                                : "#d32f2f",
                            color: "#ffffff",
                            fontWeight: 600,
                            border:
                              farmer.houseStatus === "No Damage"
                                ? "1px solid #4caf50"
                                : farmer.houseStatus === "Partially Damaged"
                                ? "1px solid #ff9800"
                                : "1px solid #f44336",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              color: "#ffffff",
              backgroundColor: "#1a1a1a",
              borderTop: "1px solid #424242",
              "& .MuiTablePagination-select": {
                color: "#ffffff",
                backgroundColor: "#2a2a2a",
              },
              "& .MuiTablePagination-selectIcon": { color: "#ffffff" },
              "& .MuiTablePagination-actions": { color: "#ffffff" },
              "& .MuiTablePagination-displayedRows": { color: "#b0b0b0" },
            }}
          />
        </Card>
      </Box>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
        }}
        open={pdfLoading}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress color="inherit" size={60} />
          <Typography sx={{ mt: 2, fontSize: "1.2rem", fontWeight: 500 }}>
            Generating PDF...
          </Typography>
          <Typography sx={{ mt: 1, fontSize: "0.9rem", color: "#b0b0b0" }}>
            Please wait while we prepare your document
          </Typography>
        </Box>
      </Backdrop>
    </Box>
  );
}
