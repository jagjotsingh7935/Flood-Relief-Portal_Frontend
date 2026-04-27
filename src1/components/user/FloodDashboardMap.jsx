import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Box,
  Snackbar,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  useMediaQuery,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import AppBarComponent from "./AppBarComponent";
import StatisticsCards from "./StatisticsCards";
import SearchSection from "./SearchSection";
import MapSection from "./MapSection";
import FarmerDataSection from "./FarmerDataSection";
import LocationDetailsDialog from "./LocationDetailsDialog";
import { Icon } from "@iconify/react";
import MostAffectedVillages from "../map/MostAffectedVillages";
// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});



const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#00d4ff", dark: "#00b8e6", light: "#33dcff" },
    secondary: { main: "#ff4081", dark: "#c60055", light: "#ff79b0" },
    background: { default: "#0a0a0a", paper: "#1a1a1a" },
    error: { main: "#ff5252" },
    warning: { main: "#ffb74d" },
    success: { main: "#69f0ae" },
    text: { primary: "#ffffff", secondary: "#b0b0b0" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: "linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)",
          border: "1px solid #333",
          borderRadius: 16,
          backdropFilter: "blur(10px)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
  },
});

const FloodDashboardMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(new Map());
  const placeMarkerRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
 const [mapCollapsed, setMapCollapsed] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesError, setPlacesError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");
  const [locationNameInput, setLocationNameInput] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [farmersData, setFarmersData] = useState([]);
  const [count, setCount] = useState(0);
  const [farmersLoading, setFarmersLoading] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [villageData, setVillageData] = useState({});
  const [defaultAffectedVillages, setDefaultAffectedVillages] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [cropLossRange, setCropLossRange] = useState("All");
  const [tableSearchTerm, setTableSearchTerm] = useState("");
  const [selectedVillageId, setSelectedVillageId] = useState(null); 
 const isMobile = useMediaQuery('(max-width:768px)');
  const [statsData, setStatsData] = useState([
    {
      title: "Affected Population",
      value: "-",
      change: "-",
      color: "#ff4081",
      icon: "mdi:account-group",
    },
    {
      title: "Rescue Operations",
      value: "-",
      change: "-",
      color: "#69f0ae",
      icon: "mdi:lifebuoy",
    },
    {
      title: "Houses Partially Damaged",
      value: "-",
      change: "-",
      color: "#ffb74d",
      icon: "mdi:home-alert",
    },
    {
      title: "Houses Fully Damaged",
      value: "-",
      change: "-",
      color: "#ff5252",
      icon: "mdi:home-remove",
    },
    {
      title: "Land Owned / Land Affected",
      value: "- / -",
      change: "-",
      color: "#00d4ff",
      icon: "mdi:land-plots",
    },
    {
      title: "Estimated Crop Loss",
      value: "-",
      change: "-",
      color: "#ff4081",
      icon: "mdi:currency-inr",
    },
  ]);

  const statisticsData = useMemo(
    () => [
      {
        title: "Total Farmers",
        value: "1,247",
        icon: "mdi:farmer",
        color: "#00d4ff",
        change: "+12%",
        link:'/totalfarmers'
      },
      {
        title: "Affected Areas",
        value: "45",
        icon: "mdi:map-marker-radius",
        color: "#ff5252",
        change: "+5",
        link:null
      },
      {
        title: "Verified Cases",
        value: "892",
        icon: "mdi:check-circle",
        color: "#69f0ae",
        change: "+8%",
        link:null

      },
      {
        title: "Pending Verification",
        value: "355",
        icon: "mdi:clock",
        color: "#ffb74d",
        change: "-3%",
        link:null

      },
      {
        title: "Total Land Affected",
        value: "2,456 acres",
        icon: "mdi:land-plots",
        color: "#ff4081",
        change: "+15%",
        link:null

      },
      {
        title: "Relief Camps",
        value: "28",
        icon: "mdi:home-group",
        color: "#9c27b0",
        change: "+2",
        link:null

      },
    ],
    []
  );

  const fetchStatsData = useCallback(async (query = "") => {
    try {
      const apiUrl = `${
        import.meta.env.VITE_API_URL
      }/floods/api/show/person/stats/?${
        query ? `search=${encodeURIComponent(query)}` : ""
      }`;
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setStatsData([
          {
            title: "Affected Population",
            value: data.affected_person_count.toString(),
            change: "-",
            color: "#ff4081",
            icon: "mdi:account-group",
          },
          {
            title: "Rescue Operations",
            value: "-",
            change: "-",
            color: "#69f0ae",
            icon: "mdi:lifebuoy",
          },
          {
            title: "Houses Partially Damaged",
            value: data.partially_damaged_count.toString(),
            change: "-",
            color: "#ffb74d",
            icon: "mdi:home-alert",
          },
          {
            title: "Houses Fully Damaged",
            value: data.fully_damaged_count.toString(),
            change: "-",
            color: "#ff5252",
            icon: "mdi:home-remove",
          },
          {
            title: "Land Owned / Land Affected",
            value: `${data.total_land_owned_sum} / ${data.land_affected_sum}`,
            change: `${data.percentage_affected_land.toFixed(2)}%`,
            color: "#00d4ff",
            icon: "mdi:land-plots",
          },
          {
            title: "Estimated Crop Loss",
            value: `${data.crops_lost_sum.toLocaleString("en-IN")} crops`,
            change: "",
            color: "#ff4081",
            icon: "mdi:currency-inr",
          },
        ]);
      } else {
        throw new Error("Failed to fetch stats data");
      }
    } catch (error) {
      console.error("Error fetching stats data:", error);
      setPlacesError("Unable to load stats data");
    }
  }, []);
 const toggleMapCollapse = useCallback(() => {
    setMapCollapsed((prev) => !prev);
  }, []);
  const fetchFarmersData = useCallback(
    async (query = "", status = "All", cropLoss = "All") => {
      setFarmersLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage,
          page_size: rowsPerPage,
        });
        // Combine searchQuery and tableSearchTerm for the search parameter
        // Join non-empty search terms
        
        if (searchQuery) params.append("search", searchQuery);
        if (query) params.append("farmer_name", query);
        if(selectedVillageId) params.append("village_id", selectedVillageId);
        if (status !== "All") params.append("house_status", status);
        if (cropLoss !== "All") params.append("crop_loss_range", cropLoss);
        const apiUrl = `${
          import.meta.env.VITE_API_URL
        }/floods/api/show/person/on/user/page/with/filters/uisng/village/id/?${params.toString()}`;

        console.log("Fetching farmers data with URL:", apiUrl);
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          console.log("API response:", data);
          setFarmersData(data.results || []);
          setCount(data.count);
        } else {
          throw new Error("Failed to fetch farmers data");
        }
      } catch (error) {
        console.error("Error fetching farmers data:", error);
        setPlacesError("Unable to load farmers data");
        setFarmersData([]);
        setCount(0);
      } finally {
        setFarmersLoading(false);
      }
    },
    [currentPage, rowsPerPage, searchQuery]
  );
  const handlePlaceDragEnd = (updatedPlace) => {
    setSelectedPlace(updatedPlace);
  };
  
 const handleVillageSelect = useCallback((villageData) => {
  console.log("Selected Village Data:", villageData);
  setSelectedVillageId(villageData?.villageData?.id); // Store selected village ID
  if (!villageData) {
    console.error("No village data provided");
    return;
  }

  // Extract coordinates - handle different data structures
  let lat, lng, villageName;
  
  if (villageData.center) {
    // Handle data from MostAffectedVillages component
    lat = parseFloat(villageData.center.latitude);
    lng = parseFloat(villageData.center.longitude);
    villageName = villageData.popup || villageData.name || "Selected Village";
  } else if (villageData.latitude && villageData.longitude) {
    // Handle direct village data
    lat = parseFloat(villageData.latitude);
    lng = parseFloat(villageData.longitude);
    villageName = villageData.name || villageData.popup || "Selected Village";
  } else if (villageData.lat && villageData.lng) {
    // Handle place format data
    lat = villageData.lat;
    lng = villageData.lng;
    villageName = villageData.label || villageData.name || "Selected Village";
  } else {
    console.error("Invalid village data structure:", villageData);
    return;
  }

  // Validate coordinates
  if (isNaN(lat) || isNaN(lng)) {
    console.error("Invalid coordinates:", lat, lng);
    return;
  }

  // Create place object
  const place = {
    label: villageName,
    lat: lat,
    lng: lng,
    type: 'village',
    villageData: villageData
  };

  console.log("Processed Place:", place);

  // Set the selected place state
  setSelectedPlace(place);
  setSearchQuery(villageName);
  setLocationNameInput(villageName);
  setLatInput(lat.toString());
  setLngInput(lng.toString());
  setDrawerOpen(true);

  // If map is initialized, center and add marker
  if (mapInstanceRef.current) {
    // Center map on selected village
    mapInstanceRef.current.flyTo([lat, lng], 14);

    // Remove existing place marker if any
    if (placeMarkerRef.current) {
      mapInstanceRef.current.removeLayer(placeMarkerRef.current);
    }

    // Add new marker for selected village
    placeMarkerRef.current = L.marker([lat, lng], {
      icon: L.divIcon({
        className: "custom-village-marker",
        html: `<div style="background-color: #00d4ff; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0, 212, 255, 0.5);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      }),
      draggable: true,
    })
      .addTo(mapInstanceRef.current)
      .bindPopup(
        `
        <div style="background: #1a1a1a; color: white; border-radius: 8px; padding: 12px; max-width: 250px;">
          <h4 style="margin: 0 0 8px 0; color: #00d4ff;">${villageName}</h4>
          <p style="margin: 4px 0;"><strong>Type:</strong> Village</p>
          <p style="margin: 4px 0;"><strong>Latitude:</strong> ${lat.toFixed(6)}</p>
          <p style="margin: 4px 0;"><strong>Longitude:</strong> ${lng.toFixed(6)}</p>
        </div>
      `
      )
      .openPopup();

    // Add dragend event for the marker
    placeMarkerRef.current.on("dragend", function (event) {
      const marker = event.target;
      const position = marker.getLatLng();
      const updatedPlace = {
        ...place,
        lat: position.lat,
        lng: position.lng,
      };
      handlePlaceDragEnd(updatedPlace);
    });

    // Show snackbar message
    setSnackbarMessage(`Selected village: ${villageName}`);
    setSnackbarOpen(true);
  }
}, [handlePlaceDragEnd]);

  const fetchSuggestions = useCallback(
    async (query) => {
      if (!query) {
        setSuggestions([]);
        return;
      }
      setPlacesLoading(true);
      setPlacesError(null);
      try {
        await Promise.all([
          fetchFarmersData(tableSearchTerm, statusFilter, cropLossRange),
          fetchStatsData(query),
        ]);
        const bbox = "74.5,29.5,77.0,32.5";
        const nominatimResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query
          )}&format=json&limit=5&bounded=1&viewbox=${bbox}&countrycodes=in&accept-language=en`
        );
        if (!nominatimResponse.ok)
          throw new Error("Failed to fetch suggestions from Nominatim");
        const nominatimData = await nominatimResponse.json();
        const filteredNominatimSuggestions = nominatimData
          .filter((place) =>
            place.display_name.toLowerCase().includes(query.toLowerCase())
          )
          .map((place) => {
            const parts = place.display_name.split(",");
            const label =
              parts.length > 1
                ? `${parts[0].trim()}, ${parts[1].trim()}`
                : parts[0].trim();
            return {
              label,
              lat: parseFloat(place.lat),
              lng: parseFloat(place.lon),
              type: place.type,
            };
          });
        setSuggestions(filteredNominatimSuggestions);
      } catch (error) {
        setPlacesError("Unable to load suggestions. Please try again later.");
        console.error("Error fetching suggestions:", error);
      } finally {
        setPlacesLoading(false);
      }
    },
    [
      fetchFarmersData,
      fetchStatsData,
      statusFilter,
      cropLossRange,
      tableSearchTerm,
    ]
  );

  const handlePlaceChange = useCallback(
    (place) => {
      console.log("Selected Place:", place);
      console.log("Current farmersData:", farmersData);
      setSelectedPlace(place);
      setSearchQuery(place.label);
      setSuggestions([]);
      setLocationNameInput(place.label);
      setLatInput(place.lat.toString());
      setLngInput(place.lng.toString());
      setDrawerOpen(true);
    },
    [farmersData]
  );



  useEffect(() => {
    const fetchVillageData = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/floods/api/affected/village/map/data/`
        );
        if (response.ok) {
          const data = await response.json();
          setVillageData(data);
          const villageNames = Object.values(data).map(
            (village) => village.popup
          );
          setDefaultAffectedVillages(villageNames);
        }
      } catch (error) {
        console.error("Error fetching village data:", error);
      }
    };
    fetchVillageData();
  }, []);

  useEffect(() => {
    console.log("Search Query Changed:", searchQuery);
    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      if (searchQuery.length >= 1) {
        console.log("Fetching suggestions for:", searchQuery);
        fetchSuggestions(searchQuery);
      } else if (!searchQuery) {
        console.log("Clearing suggestions and farmersData");
        setSuggestions([]);
        setFarmersData([]);
        setStatsData([
          {
            title: "Affected Population",
            value: "-",
            change: "-",
            color: "#ff4081",
            icon: "mdi:account-group",
          },
          {
            title: "Rescue Operations",
            value: "-",
            change: "-",
            color: "#69f0ae",
            icon: "mdi:lifebuoy",
          },
          {
            title: "Houses Partially Damaged",
            value: "-",
            change: "-",
            color: "#ffb74d",
            icon: "mdi:home-alert",
          },
          {
            title: "Houses Fully Damaged",
            value: "-",
            change: "-",
            color: "#ff5252",
            icon: "mdi:home-remove",
          },
          {
            title: "Land Owned / Land Affected",
            value: "- / -",
            change: "-",
            color: "#00d4ff",
            icon: "mdi:land-plots",
          },
          {
            title: "Estimated Crop Loss",
            value: "-",
            change: "-",
            color: "#ff4081",
            icon: "mdi:currency-inr",
          },
        ]);
      }
    }, 300);
    return () => clearTimeout(debounceTimeoutRef.current);
  }, [searchQuery, fetchSuggestions, selectedPlace]);

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  const resetMap = useCallback(() => {
    setSelectedPlace(null);
    setSearchQuery("");
    setSuggestions([]);
    setLocationNameInput("");
    setLatInput("");
    setLngInput("");
    setDrawerOpen(false);
    setFarmersData([]);
    setStatusFilter("All");
    setCropLossRange("All");
    setStatsData([
      {
        title: "Affected Population",
        value: "-",
        change: "-",
        color: "#ff4081",
        icon: "mdi:account-group",
      },
      {
        title: "Rescue Operations",
        value: "-",
        change: "-",
        color: "#69f0ae",
        icon: "mdi:lifebuoy",
      },
      {
        title: "Houses Partially Damaged",
        value: "-",
        change: "-",
        color: "#ffb74d",
        icon: "mdi:home-alert",
      },
      {
        title: "Houses Fully Damaged",
        value: "-",
        change: "-",
        color: "#ff5252",
        icon: "mdi:home-remove",
      },
      {
        title: "Land Owned / Land Affected",
        value: "- / -",
        change: "-",
        color: "#00d4ff",
        icon: "mdi:land-plots",
      },
      {
        title: "Estimated Crop Loss",
        value: "-",
        change: "-",
        color: "#ff4081",
        icon: "mdi:currency-inr",
      },
    ]);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds([
        [29.5, 74.5],
        [32.5, 77.0],
      ]);
      if (placeMarkerRef.current) {
        mapInstanceRef.current.removeLayer(placeMarkerRef.current);
        placeMarkerRef.current = null;
      }
    }
  }, []);

  const toggleLegend = useCallback(() => {
    setShowLegend((prev) => !prev);
  }, []);

  const centerMap = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds([
        [29.5, 74.5],
        [32.5, 77.0],
      ]);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && suggestions.length > 0) {
        handlePlaceChange(suggestions[0]);
      }
    },
    [suggestions, handlePlaceChange]
  );

  const handleFormClick = useCallback(() => {
    navigate("/usersurveyform");
  }, [navigate]);

  const handleUploadExcelClick = useCallback(() => {
    if (selectedPlace) {
      setDialogOpen(true);
    }
  }, [selectedPlace]);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handlePageChange = useCallback((event, newPage) => {
    console.log("Page changed to:", newPage);
    setCurrentPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  }, []);

  const toggleMapVisibility = useCallback(() => {
    setShowMap((prev) => !prev);
  }, []);

  const handleTableRefresh = useCallback(() => {
    fetchFarmersData(tableSearchTerm, statusFilter, cropLossRange);
  }, [fetchFarmersData, tableSearchTerm, statusFilter, cropLossRange]);

  useEffect(() => {
    fetchFarmersData(tableSearchTerm, statusFilter, cropLossRange);
  }, [
    currentPage,
    rowsPerPage,
    tableSearchTerm,
    statusFilter,
    cropLossRange,
    searchQuery,
    fetchFarmersData,
  ]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current.clear();
      if (placeMarkerRef.current) {
        placeMarkerRef.current = null;
      }
    };
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ height: "auto", display: "flex", flexDirection: "column" }}>
        <AppBarComponent
          showMap={showMap}
          toggleMapVisibility={toggleMapVisibility}
        />
        <StatisticsCards statisticsData={statisticsData} />
        <SearchSection
          placesLoading={placesLoading}
          placesError={placesError}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          suggestions={suggestions}
          handlePlaceChange={handlePlaceChange}
          resetMap={resetMap}
          handleKeyPress={handleKeyPress}
           onVillageSelect={handleVillageSelect}
        />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            p: 2,
            pt: 0,
            overflow: "hidden",
            gap: 2,
          }}
        >
          <Grid container spacing={2} sx={{ flex: 1, minHeight: "600px" }}>
            <Grid
              item
              xs={12}
              md={8}
              sx={{ width: { xs: "100%", md: "70vw" }, mt: 5 }}
            >
               <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: mapCollapsed?"0px":"500px",
                }}
              >
                {isMobile && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1 }}>
                    <Typography variant="h6" sx={{ color: "white" }}>
                      Map Section
                    </Typography>
                    <IconButton onClick={toggleMapCollapse} sx={{ color: "white" }}>
                      {mapCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                    </IconButton>
                  </Box>
                )}
                <Collapse in={isMobile ? !mapCollapsed : true}>
                  <CardContent
                    sx={{
                      p: 0,
                      height: "100%",
                      width: "100%",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      "&:last-child": { pb: 0 },
                    }}
                  >
                    <Box sx={{ flex: 1, minHeight: isMobile ? "400px" : "700px", minWidth: "70vw" }} id="map-section">
                      <MapSection
                        showMap={true}
                        mapRef={mapRef}
                        mapInstanceRef={mapInstanceRef}
                        mapInitialized={mapInitialized}
                        setMapInitialized={setMapInitialized}
                        setLoading={setLoading}
                        showLegend={showLegend}
                        setShowLegend={setShowLegend}
                        centerMap={centerMap}
                        toggleFullscreen={toggleFullscreen}
                        selectedPlace={selectedPlace}
                        placeMarkerRef={placeMarkerRef}
                        markersRef={markersRef}
                        defaultAffectedVillages={defaultAffectedVillages}
                        villageData={villageData}
                        loading={loading}
                        onPlaceDragEnd={handlePlaceDragEnd}
                        onSnackbarMessage={(message) => console.log(message)}
                        isMobile={isMobile}
                      />
                    </Box>
                  </CardContent>
                </Collapse>
              </Card>
            </Grid>
            <Grid>
              <Grid
                item
                xs={12}
                md={4}
                sx={{ width: { xs: "100%", md: "25vw" }, mt: 1 }}
              >
                <MostAffectedVillages
                  onVillageSelect={(villageData) => {
                    handleVillageSelect(villageData);
                    document
                      .getElementById("map-section")
                      .scrollIntoView({ behavior: "smooth" });
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                sx={{ width: { xs: "100%", md: "25vw" }, mt: 5 }}
              >
                <Card
                  sx={{ height: "400px", width: { xs: "100%", md: "25vw" } }}
                >
                  <CardContent
                    sx={{
                      p: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 3,
                        textAlign: "center",
                        background: "linear-gradient(45deg, #00d4ff, #00b8e6)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                        fontWeight: "bold",
                      }}
                    >
                      Flood Statistics of Registered Persons
                    </Typography>
                    <Box
                      sx={{
                        flex: 1,
                        overflowY: "auto",
                        // Hide scrollbar by default
                        scrollbarWidth: "none", // Firefox
                        "&::-webkit-scrollbar": {
                          display: "none", // Chrome, Safari, Edge
                        },
                        // Show scrollbar on hover
                        "&:hover": {
                          scrollbarWidth: "thin", // Firefox
                          "&::-webkit-scrollbar": {
                            display: "block",
                            width: "8px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                            borderRadius: "4px",
                          },
                          "&::-webkit-scrollbar-track": {
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                          },
                        },
                      }}
                    >
                      {statsData.map((stat, index) => (
                        <Paper
                          key={index}
                          sx={{
                            p: 2,
                            background:
                              "linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)",
                            border: "1px solid #333",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            transition:
                              "transform 0.2s ease, border-color 0.2s ease",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              borderColor: stat.color,
                            },
                            mb: 2, // Add margin-bottom to prevent last item from being cut off
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              background: `linear-gradient(135deg, ${stat.color}30, ${stat.color}60)`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: `1px solid ${stat.color}40`,
                            }}
                          >
                            <Icon
                              icon={stat.icon}
                              width={20}
                              height={20}
                              color={stat.color}
                            />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "text.secondary",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                              }}
                            >
                              {stat.title}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "baseline",
                                gap: 1,
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: "bold", color: "white" }}
                              >
                                {stat.value}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: stat.change.startsWith("+")
                                    ? "#69f0ae"
                                    : "#ff5252",
                                  fontWeight: "bold",
                                  fontSize: "0.7rem",
                                }}
                              >
                                {stat.change}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Box>
            <FarmerDataSection
              page={currentPage}
              onChange={handlePageChange}
              count={count}
              farmersData={farmersData}
              farmersLoading={farmersLoading}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              setRowsPerPage={setRowsPerPage}
              searchTerm={tableSearchTerm}
              setSearchTerm={setTableSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              cropLossRange={cropLossRange}
              setCropLossRange={setCropLossRange}
              onRefresh={handleTableRefresh}
              searchQuery={searchQuery}
              selectedVillageId={selectedVillageId}
            />
          </Box>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          sx={{
            "& .MuiSnackbarContent-root": {
              backgroundColor: "primary.main",
              color: "white",
              fontWeight: "bold",
            },
          }}
        />
        <LocationDetailsDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          selectedPlace={selectedPlace}
        />
      </Box>
    </ThemeProvider>
  );
};

export default FloodDashboardMap;