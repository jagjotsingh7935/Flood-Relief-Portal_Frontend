import React, { useEffect, useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  Alert,
  LinearProgress,
  InputAdornment,
  Divider,
  Chip,
  Snackbar,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import { Icon } from '@iconify/react';

const steps = [
  { 
    label: 'Personal Details', 
    icon: 'mdi:account', 
    description: 'Basic information about the farmer/landowner'
  },
  { 
    label: 'Land & Crop Details', 
    icon: 'mdi:sprout', 
    description: 'Information about land and crops affected'
  },
  { 
    label: 'Recovery Requirement', 
    icon: 'mdi:map-marker', 
    description: 'Agricultural recovery and support needs'
  },
  { 
    label: 'Additional Support', 
    icon: 'mdi:help-circle', 
    description: 'Other support and assistance needed'
  },
  { 
    label: 'Verification & Notes', 
    icon: 'mdi:clipboard-check', 
    description: 'Survey verification and additional notes'
  },
  { 
    label: 'Review', 
    icon: 'mdi:eye', 
    description: 'Overview of all filled information'
  },
];

const FloodDamageSurveyForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    farmerName: '',
    fatherName: '',
    mobileNumber: '',
    email: '',
    stateName: '',
    state_id: null,
    villageName: '',
    pincode: '',
    latitude: '',
    longitude: '',
    cityName: '',
    tehsilName: '',
    houseStatus: 'Safe',
    totalLandOwned: '',
    landAffected: '',
    cropsPlanted: '',
    cropsLost: '',
    estimatedCropLoss: 'Under 10,000',
    tractorLeveling: 'Not Required',
    manureFertilizer: 'Not Required',
    seedsRequired: 'Not Required',
    fertilizersPesticides: 'Not Required',
    laborRequirement: 'Not Required',
    irrigationRepair: 'No',
    livestockDamage: 'No Damage',
    householdNeeds: 'Not Required',
    housingRepair: 'No Repair Needed',
    otherSupport: 'Not Required',
    surveyorName: '',
    surveyDate: '',
    verifiedBy: null,
    farmerImage: null,
    additionalNotes: '',
    amount_needed:0,
     district_id: null,
    tehsil_id: null,
    village_id: null,

  });
  const [errors, setErrors] = useState({});
  const [pincodeError, setPincodeError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTehsil, setSelectedTehsil] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0:
        if (!formData.farmerName) newErrors.farmerName = 'Farmer name is required';
        if (!formData.mobileNumber) {
          newErrors.mobileNumber = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
          newErrors.mobileNumber = 'Mobile number must be exactly 10 digits';
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Invalid email format';
        }
        // if (!formData.stateName) newErrors.stateName = 'State name is required';
        // if (!formData.villageName) newErrors.villageName = 'Village name is required';
        // if (!formData.cityName) newErrors.cityName = 'City name is required';
        // if (!formData.tehsilName) newErrors.tehsilName = 'Tehsil name is required';
        if (!formData.pincode) newErrors.pincode = 'Pincode is required';
        break;
      case 1:
        if (!formData.totalLandOwned) newErrors.totalLandOwned = 'Total land owned is required';
        if (!formData.landAffected) newErrors.landAffected = 'Land affected is required';
        break;
      case 4:
        if (!formData.surveyorName) newErrors.surveyorName = 'Surveyor name is required';
        if (!formData.surveyDate) newErrors.surveyDate = 'Survey date is required';
        if (!formData.verifiedBy) newErrors.verifiedBy = 'Verification image is required';
        if (!formData.farmerImage) newErrors.farmerImage = 'Farmer image is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const fetchStates = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/floods/api/state/list/`);
      const data = await response.json();
      setStates(data); // Array of { state_id, name }
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
    }
  };

  const fetchDistrict = async (stateId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/floods/api/district/list/?state_id=${stateId}`);
      const data = await response.json();
      setDistricts(data); // Array of { id, name }
    } catch (error) {
      console.error('Error fetching districts:', error);
      setDistricts([]);
    }
  };

  const fetchTehsil = async (districtId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/floods/api/tehsil/list/?district_name=${districtId}`);
      const data = await response.json();
      setTehsils(data); // Array of { id, name }
    } catch (error) {
      console.error('Error fetching tehsils:', error);
      setTehsils([]);
    }
  };

  const fetchVillage = async (tehsilId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/floods/api/village/list/?tehsil_name=${tehsilId}`);
      const data = await response.json();
      setVillages(data); // Array of { id, name }
    } catch (error) {
      console.error('Error fetching villages:', error);
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
      setFormData(prev => ({
        ...prev,
        state_id: selectedState.state_id,
        stateName: selectedState.name,
        district_id: null,
        tehsil_id: null,
        village_id: null,
        tehsilName: "",
        villageName: ""
      }));
    } else {
      setDistricts([]);
      setSelectedDistrict(null);
      setTehsils([]);
      setSelectedTehsil(null);
      setVillages([]);
      setSelectedVillage(null);
      setFormData(prev => ({
        ...prev,
        state_id: null,
        stateName: "",
        district_id: null,
        tehsil_id: null,
        village_id: null,
        tehsilName: "",
        villageName: ""
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
      setFormData(prev => ({
        ...prev,
        district_id: selectedDistrict.id,
        tehsil_id: null,
        village_id: null,
        tehsilName: "",
        villageName: ""
      }));
    } else {
      setTehsils([]);
      setSelectedTehsil(null);
      setVillages([]);
      setSelectedVillage(null);
      setFormData(prev => ({
        ...prev,
        district_id: null,
        tehsil_id: null,
        village_id: null,
        tehsilName: "",
        villageName: ""
      }));
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedTehsil) {
      fetchVillage(selectedTehsil.name);
      setVillages([]);
      setSelectedVillage(null);
      setFormData(prev => ({
        ...prev,
        tehsil_id: selectedTehsil.id,
        village_id: null,
        villageName: ""
      }));
    } else {
      setVillages([]);
      setSelectedVillage(null);
      setFormData(prev => ({
        ...prev,
        tehsil_id: null,
        village_id: null,
        villageName: ""
      }));
    }
  }, [selectedTehsil]);

  useEffect(() => {
    if (selectedVillage) {
      setFormData(prev => ({
        ...prev,
        village_id: selectedVillage.id,
        villageName: selectedVillage.name
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        village_id: null,
        villageName: ""
      }));
    }
  }, [selectedVillage]);

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep < steps.length - 1) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        setActiveStep(steps.length);
      }
    }
  };
 const initialFormData = {
    farmerName: "",
    fatherName: "",
    mobileNumber: "",
    email: "",
    stateName: "",
    state_id: null,
    villageName: "",
    pincode: "",
    latitude: "",
    longitude: "",
    cityName: "",
    tehsilName: "",
    houseStatus: "Safe",
    totalLandOwned: "",
    landAffected: "",
    cropsPlanted: "",
    cropsLost: "",
    estimatedCropLoss: "Under 10,000",
    tractorLeveling: "Not Required",
    manureFertilizer: "Not Required",
    seedsRequired: "Not Required",
    fertilizersPesticides: "Not Required",
    laborRequirement: "Not Required",
    irrigationRepair: "No",
    livestockDamage: "No Damage",
    householdNeeds: "Not Required",
    housingRepair: "No Repair Needed",
    otherSupport: "Not Required",
    surveyorName: "",
    surveyDate: "",
    verifiedBy: null,
    farmerImage: null,
    additionalNotes: "",
    amount_needed: 0,
    district_id: null,
    tehsil_id: null,
    village_id: null,
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setErrors({});
    setPincodeError('');
  };

  const handleChange = async (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }

    if (name === 'pincode' && value) {
      if (!/^\d{5,10}$/.test(value)) {
        setPincodeError('Pincode must be 5-10 digits');
        setFormData({
          ...formData,
          pincode: value,
          latitude: '',
          longitude: ''
        });
        return;
      }

      setPincodeError('');
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&postalcode=${value}&limit=1`, {
          headers: { 'User-Agent': 'FloodDamageSurveyApp/1.0 (your.email@example.com)' }
        });
        const data = await response.json();
        if (data.length > 0) {
          setFormData({
            ...formData,
            pincode: value,
            latitude: data[0].lat,
            longitude: data[0].lon
          });
        } else {
          setPincodeError('No coordinates found for this pincode');
          setFormData({
            ...formData,
            pincode: value,
            latitude: '',
            longitude: ''
          });
        }
      } catch (error) {
        setPincodeError('Error fetching coordinates');
        setFormData({
          ...formData,
          pincode: value,
          latitude: '',
          longitude: ''
        });
      }
    }
  };

  const handleFileChange = (event) => {
    const { name } = event.target;
    const file = event.target.files[0];
    
    if (file && file.type.startsWith('image/')) {
      setFormData({
        ...formData,
        [name]: file
      });
      setErrors({
        ...errors,
        [name]: ''
      });
    } else if (file) {
      setErrors({
        ...errors,
        [name]: 'Please upload a valid image file'
      });
    }
  };

  const createPayload = () => {
    const payload = {
      data: [{
        farmerName: formData.farmerName,
        fatherName: formData.fatherName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
            state_id:formData.state_id, 
          // city: formData.cityName ,
          tehsil_id: formData.tehsil_id, 
          village_id: formData.village_id,
           
          city_id: formData.district_id,
        houseStatus: formData.houseStatus,
        totalLandOwned: formData.totalLandOwned,
        landAffected: formData.landAffected,
        cropsPlanted: formData.cropsPlanted,
        cropsLost: formData.cropsLost,
        estimatedCropLoss: formData.estimatedCropLoss,
        tractorLeveling: formData.tractorLeveling,
        manureFertilizer: formData.manureFertilizer,
        seedsRequired: formData.seedsRequired,
        fertilizersPesticides: formData.fertilizersPesticides,
        laborRequirement: formData.laborRequirement,
        irrigationRepair: formData.irrigationRepair,
        livestockDamage: formData.livestockDamage,
        householdNeeds: formData.householdNeeds,
        housingRepair: formData.housingRepair,
        otherSupport: formData.otherSupport,
        verifiedBy: [{
          surveyorName: formData.surveyorName,
          date: formData.surveyDate
        }],
        additionalNotes: formData.additionalNotes,
        amount_needed: formData.amount_needed
      }]
    };

    return payload;
  };

    const resetForm = () => {
    setFormData(initialFormData);
    setActiveStep(0);
    setErrors({});
    setPincodeError("");
    setIsSubmitting(false);
    setSelectedState(null);
    setSelectedDistrict(null);
    setSelectedTehsil(null);
    setSelectedVillage(null);
  };
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const payload = createPayload();
      const formDataToSend = new FormData();
      
      formDataToSend.append('data', JSON.stringify(payload.data));
      if (formData.verifiedBy) {
        formDataToSend.append('verification_image', formData.verifiedBy);
      }
      if (formData.farmerImage) {
        formDataToSend.append('farmer_image', formData.farmerImage);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/floods/api/farmer/data/add/admin/`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Form submitted successfully:', result);
        setSnackbar({
          open: true,
          message: 'Survey submitted successfully!',
          severity: 'success'
        });

         setTimeout(() => {
          resetForm();
        }, 2000);
      } else {
        throw new Error('Failed to submit survey');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSnackbar({
        open: true,
        message: 'Failed to submit survey. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormSection = (title, icon, children) => (
    <Card elevation={2} sx={{ 
      width: '100%', 
      mx: 'auto', 
      maxWidth: { xs: '100%', sm: 600, md: 900, lg: 1200 },
      p: { xs: 2, sm: 3 }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
          <Icon icon={icon} width={{ xs: 20, sm: 24 }} height={{ xs: 20, sm: 24 }} style={{ marginRight: 8 }} />
          <Typography 
            variant="h6" 
            color="primary" 
            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
          >
            {title}
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {children}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderRadioField = (label, name, options, xs = 12, md = 6) => (
    <Grid item xs={xs} md={md} key={name}>
      <FormControl fullWidth>
        <FormLabel sx={{ mb: 1, fontWeight: 'medium', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          {label}
        </FormLabel>
        <RadioGroup
          name={name}
          value={formData[name]}
          onChange={handleChange}
          sx={{ flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap' }}
        >
          {options.map((option) => (
            <FormControlLabel 
              key={option} 
              value={option} 
              control={<Radio size="small" />} 
              label={option}
              sx={{ mb: { xs: 0.5, sm: 0 }, mr: { sm: 2 } }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Grid>
  );

   const renderOverview = () => (
     <Card elevation={2}>
       <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
         <Box
           sx={{ display: "flex", alignItems: "center", mb: { xs: 2, sm: 3 } }}
         >
           <Icon
             icon="mdi:eye"
             width={24}
             height={24}
             style={{ marginRight: 8 }}
           />
           <Typography
             variant="h6"
             color="primary"
             sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
           >
             Form Overview
           </Typography>
         </Box>
 
         <Box sx={{ mb: { xs: 2, sm: 3 } }}>
           <Typography
             variant="h6"
             color="text.primary"
             sx={{
               mb: 2,
               display: "flex",
               alignItems: "center",
               fontSize: { xs: "1rem", sm: "1.25rem" },
             }}
           >
             <Icon
               icon="mdi:account"
               width={20}
               height={20}
               style={{ marginRight: 8 }}
             />
             Personal Information
           </Typography>
           <Grid container spacing={{ xs: 1.5, sm: 2 }}>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Farmer Name:
               </Typography>
               <Typography
                 variant="body2"
                 color="text.secondary"
                 sx={{ fontSize: { xs: "0.813rem", sm: "0.875rem" } }}
               >
                 {formData.farmerName || "Not provided"}
               </Typography>
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Father's Name:
               </Typography>
               <Typography
                 variant="body2"
                 color="text.secondary"
                 sx={{ fontSize: { xs: "0.813rem", sm: "0.875rem" } }}
               >
                 {formData.fatherName || "Not provided"}
               </Typography>
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Mobile Number:
               </Typography>
               <Typography
                 variant="body2"
                 color="text.secondary"
                 sx={{ fontSize: { xs: "0.813rem", sm: "0.875rem" } }}
               >
                 {formData.mobileNumber || "Not provided"}
               </Typography>
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Email:
               </Typography>
               <Typography
                 variant="body2"
                 color="text.secondary"
                 sx={{ fontSize: { xs: "0.813rem", sm: "0.875rem" } }}
               >
                 {formData.email || "Not provided"}
               </Typography>
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 State:
               </Typography>
               <Typography
                 variant="body2"
                 color="text.secondary"
                 sx={{ fontSize: { xs: "0.813rem", sm: "0.875rem" } }}
               >
                 {formData.stateName || "Not provided"}
               </Typography>
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 District:
               </Typography>
               <Typography
                 variant="body2"
                 color="text.secondary"
                 sx={{ fontSize: { xs: "0.813rem", sm: "0.875rem" } }}
               >
                 {selectedDistrict?.name || "Not provided"}
               </Typography>
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Tehsil:
               </Typography>
               <Typography
                 variant="body2"
                 color="text.secondary"
                 sx={{ fontSize: { xs: "0.813rem", sm: "0.875rem" } }}
               >
                 {selectedTehsil?.name || "Not provided"}
               </Typography>
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Village:
               </Typography>
               <Typography
                 variant="body2"
                 color="text.secondary"
                 sx={{ fontSize: { xs: "0.813rem", sm: "0.875rem" } }}
               >
                 {formData.villageName || "Not provided"}
               </Typography>
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Pincode:
               </Typography>
               <Typography
                 variant="body2"
                 color="text.secondary"
                 sx={{ fontSize: { xs: "0.813rem", sm: "0.875rem" } }}
               >
                 {formData.pincode || "Not provided"}
               </Typography>
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 City:
               </Typography>
               {/* <Typography
                 variant="body2"
                 color="text.secondary"
                 sx={{ fontSize: { xs: "0.813rem", sm: "0.875rem" } }}
               >
                 {formData.cityName || "Not provided"}
               </Typography> */}
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 House Status:
               </Typography>
               <Chip
                 label={formData.houseStatus}
                 color={
                   formData.houseStatus === "Safe"
                     ? "success"
                     : formData.houseStatus === "Partially Damaged"
                     ? "warning"
                     : "error"
                 }
                 size="small"
                 variant="outlined"
                 sx={{ fontSize: { xs: "0.75rem", sm: "0.813rem" } }}
               />
             </Grid>
           </Grid>
         </Box>
 
         <Divider sx={{ my: { xs: 2, sm: 3 } }} />
 
         <Box sx={{ mb: { xs: 2, sm: 3 } }}>
           <Typography
             variant="h6"
             color="text.primary"
             sx={{
               mb: 2,
               display: "flex",
               alignItems: "center",
               fontSize: { xs: "1rem", sm: "1.25rem" },
             }}
           >
             <Icon
               icon="mdi:sprout"
               width={20}
               height={20}
               style={{ marginRight: 8 }}
             />
             Land & Crop Information
           </Typography>
           <Grid container spacing={{ xs: 1.5, sm: 2 }}>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Total Land Owned:
               </Typography>
               <Typography
                 variant="body2"
                 color="text.secondary"
                 sx={{ fontSize: { xs: "0.813rem", sm: "0.875rem" } }}
               >
                 {formData.totalLandOwned
                   ? `${formData.totalLandOwned} acres`
                   : "Not provided"}
               </Typography>
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Land Affected:
               </Typography>
               <Typography
                 variant="body2"
                 color="text.secondary"
                 sx={{ fontSize: { xs: "0.813rem", sm: "0.875rem" } }}
               >
                 {formData.landAffected
                   ? `${formData.landAffected} acres`
                   : "Not provided"}
               </Typography>
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Crops Planted:
               </Typography>
               <Typography
                 variant="body2"
                 color="text.secondary"
                 sx={{ fontSize: { xs: "0.813rem", sm: "0.875rem" } }}
               >
                 {formData.cropsPlanted || "Not provided"}
               </Typography>
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Estimated Crop Loss:
               </Typography>
               <Chip
                 label={formData.estimatedCropLoss}
                 color="error"
                 size="small"
                 variant="outlined"
                 sx={{ fontSize: { xs: "0.75rem", sm: "0.813rem" } }}
               />
             </Grid>
           </Grid>
         </Box>
 
         <Divider sx={{ my: { xs: 2, sm: 3 } }} />
 
         <Box sx={{ mb: { xs: 2, sm: 3 } }}>
           <Typography
             variant="h6"
             color="text.primary"
             sx={{
               mb: 2,
               display: "flex",
               alignItems: "center",
               fontSize: { xs: "1rem", sm: "1.25rem" },
             }}
           >
             <Icon
               icon="mdi:map-marker"
               width={20}
               height={20}
               style={{ marginRight: 8 }}
             />
             Recovery Requirements
           </Typography>
           <Grid container spacing={{ xs: 1.5, sm: 2 }}>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Tractor/Leveling:
               </Typography>
               <Chip
                 label={formData.tractorLeveling}
                 color={
                   formData.tractorLeveling === "Not Required"
                     ? "default"
                     : "primary"
                 }
                 size="small"
                 variant="outlined"
                 sx={{ fontSize: { xs: "0.75rem", sm: "0.813rem" } }}
               />
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Seeds Required:
               </Typography>
               <Chip
                 label={formData.seedsRequired}
                 color={
                   formData.seedsRequired === "Not Required"
                     ? "default"
                     : "primary"
                 }
                 size="small"
                 variant="outlined"
                 sx={{ fontSize: { xs: "0.75rem", sm: "0.813rem" } }}
               />
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Labor Requirement:
               </Typography>
               <Chip
                 label={formData.laborRequirement}
                 color={
                   formData.laborRequirement === "Not Required"
                     ? "default"
                     : "warning"
                 }
                 size="small"
                 variant="outlined"
                 sx={{ fontSize: { xs: "0.75rem", sm: "0.813rem" } }}
               />
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Irrigation Repair:
               </Typography>
               <Chip
                 label={formData.irrigationRepair}
                 color={formData.irrigationRepair === "No" ? "default" : "error"}
                 size="small"
                 variant="outlined"
                 sx={{ fontSize: { xs: "0.75rem", sm: "0.813rem" } }}
               />
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{
                   fontSize: { xs: "0.85rem", sm: "0.875rem" },
                   overflowWrap: "break-word",
                 }}
               >
                 Amount Needed For Recovery:
               </Typography>
               <Chip
                 label={`₹${formData.amount_needed}`}
                 size="small"
                 variant="outlined"
                 sx={{
                   fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                   maxWidth: "100%",
                   overflow: "hidden",
                   textOverflow: "ellipsis",
                 }}
               />
             </Grid>
           </Grid>
         </Box>
 
         <Divider sx={{ my: { xs: 2, sm: 3 } }} />
 
         <Box sx={{ mb: { xs: 2, sm: 3 } }}>
           <Typography
             variant="h6"
             color="text.primary"
             sx={{
               mb: 2,
               display: "flex",
               alignItems: "center",
               fontSize: { xs: "1rem", sm: "1.25rem" },
             }}
           >
             <Icon
               icon="mdi:help-circle"
               width={20}
               height={20}
               style={{ marginRight: 8 }}
             />
             Additional Support
           </Typography>
           <Grid container spacing={{ xs: 1.5, sm: 2 }}>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Livestock Damage:
               </Typography>
               <Chip
                 label={formData.livestockDamage}
                 color={
                   formData.livestockDamage === "No Damage" ? "default" : "error"
                 }
                 size="small"
                 variant="outlined"
                 sx={{ fontSize: { xs: "0.75rem", sm: "0.813rem" } }}
               />
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Housing Repair:
               </Typography>
               <Chip
                 label={formData.housingRepair}
                 color={
                   formData.housingRepair === "No Repair Needed"
                     ? "default"
                     : "warning"
                 }
                 size="small"
                 variant="outlined"
                 sx={{ fontSize: { xs: "0.75rem", sm: "0.813rem" } }}
               />
             </Grid>
             <Grid item xs={12}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Other Support:
               </Typography>
               <Chip
                 label={formData.otherSupport}
                 color={
                   formData.otherSupport === "Not Required"
                     ? "default"
                     : "secondary"
                 }
                 size="small"
                 variant="outlined"
                 sx={{ fontSize: { xs: "0.75rem", sm: "0.813rem" } }}
               />
             </Grid>
           </Grid>
         </Box>
 
         <Divider sx={{ my: { xs: 2, sm: 3 } }} />
 
         <Box>
           <Typography
             variant="h6"
             color="text.primary"
             sx={{
               mb: 2,
               display: "flex",
               alignItems: "center",
               fontSize: { xs: "1rem", sm: "1.25rem" },
             }}
           >
             <Icon
               icon="mdi:clipboard-check"
               width={20}
               height={20}
               style={{ marginRight: 8 }}
             />
             Verification Details
           </Typography>
           <Grid container spacing={{ xs: 1.5, sm: 2 }}>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Surveyor Name:
               </Typography>
               <Typography
                 variant="body2"
                 color="text.secondary"
                 sx={{ fontSize: { xs: "0.813rem", sm: "0.875rem" } }}
               >
                 {formData.surveyorName || "Not provided"}
               </Typography>
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Survey Date:
               </Typography>
               <Typography
                 variant="body2"
                 color="text.secondary"
                 sx={{ fontSize: { xs: "0.813rem", sm: "0.875rem" } }}
               >
                 {formData.surveyDate || "Not provided"}
               </Typography>
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Verification Image:
               </Typography>
               <Typography
                 variant="body2"
                 color="text.secondary"
                 sx={{ fontSize: { xs: "0.813rem", sm: "0.875rem" } }}
               >
                 {formData.verifiedBy
                   ? `✓ ${formData.verifiedBy.name}`
                   : "Not uploaded"}
               </Typography>
             </Grid>
             <Grid item xs={12} sm={6}>
               <Typography
                 variant="subtitle2"
                 sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
               >
                 Farmer Image:
               </Typography>
               <Typography
                 variant="body2"
                 color="text.secondary"
                 sx={{ fontSize: { xs: "0.813rem", sm: "0.875rem" } }}
               >
                 {formData.farmerImage
                   ? `✓ ${formData.farmerImage.name}`
                   : "Not uploaded"}
               </Typography>
             </Grid>
             {formData.additionalNotes && (
               <Grid item xs={12}>
                 <Typography
                   variant="subtitle2"
                   sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                 >
                   Additional Notes:
                 </Typography>
                 <Typography
                   variant="body2"
                   color="text.secondary"
                   sx={{ fontSize: { xs: "0.813rem", sm: "0.875rem" } }}
                 >
                   {formData.additionalNotes}
                 </Typography>
               </Grid>
             )}
           </Grid>
         </Box>
       </CardContent>
     </Card>
   );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderFormSection('Personal Information', 'mdi:account', [
          <Grid item xs={12} sm={6} key="farmerName">
            <TextField
              label="Farmer/Landowner Name"
              name="farmerName"
              value={formData.farmerName}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.farmerName}
              helperText={errors.farmerName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon icon="mdi:account" width={{ xs: 18, sm: 20 }} height={{ xs: 18, sm: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
            />
          </Grid>,
          <Grid item xs={12} sm={6} key="fatherName">
            <TextField
              label="Father's Name"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              fullWidth
              sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
            />
          </Grid>,
          <Grid item xs={12} sm={6} key="mobileNumber">
            <TextField
              label="Mobile Number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.mobileNumber}
              helperText={errors.mobileNumber}
              inputProps={{ maxLength: 10, pattern: "\\d*" }}
              sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
            />
          </Grid>,
          <Grid item xs={12} sm={6} key="email">
            <TextField
              label="Email (Optional)"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
              sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
            />
          </Grid>,
           <Grid item xs={12} md={6} sx={{width:{xs:'100%',md:'20%'}}} key="stateName">
                     <Autocomplete
                       options={states}
                       getOptionLabel={(option) => option.name || ''}
                       value={selectedState}
                       onChange={(event, newValue) => setSelectedState(newValue)}
                       renderInput={(params) => (
                         <TextField
                           {...params}
                           label="State"
                           required
                           error={!!errors.stateName}
                           helperText={errors.stateName}
                           size="medium"
                           aria-label="Select state"
                         />
                       )}
                       noOptionsText="No states available"
                     />
                   </Grid>,
                   <Grid item xs={12} key="location" >
                     <Box
                       sx={{
                         display: 'flex',
                         flexDirection: { xs: 'column', sm: 'row' },
                         gap: { xs: 1.5, sm: 1 },
                         width: { xs: '100%', md: 'auto' },
                       }}
                     >
                       <Autocomplete
                         options={districts}
                         getOptionLabel={(option) => option.name || ''}
                         value={selectedDistrict}
                         onChange={(event, newValue) => setSelectedDistrict(newValue)}
                         disabled={!selectedState}
                         renderInput={(params) => (
                           <TextField
                             {...params}
                             label="District"
                             required
                             error={!!errors.district}
                             helperText={errors.district}
                             size="medium"
                             aria-label="Select district"
                             sx={{
                               minWidth: { xs: '300%', sm: 120 },
                               flex: { xs: '1', sm: 'initial' },
                               '& .MuiOutlinedInput-root': {
                                 borderColor: 'rgba(255,255,255,0.3)',
                               },
                               '&:hover .MuiOutlinedInput-root': {
                                 borderColor: 'primary.main',
                               },
                             }}
                           />
                         )}
                         noOptionsText="No districts available"
                       />
                       <Autocomplete
                         options={tehsils}
                         getOptionLabel={(option) => option.name || ''}
                         value={selectedTehsil}
                         onChange={(event, newValue) => setSelectedTehsil(newValue)}
                         disabled={!selectedDistrict}
                         renderInput={(params) => (
                           <TextField
                             {...params}
                             label="Tehsil"
                             required
                             error={!!errors.tehsil}
                             helperText={errors.tehsil}
                             size="medium"
                             aria-label="Select tehsil"
                             sx={{
                               minWidth: { xs: '300%', sm: 120 },
                               flex: { xs: '1', sm: 'initial' },
                               '& .MuiOutlinedInput-root': {
                                 borderColor: 'rgba(255,255,255,0.3)',
                               },
                               '&:hover .MuiOutlinedInput-root': {
                                 borderColor: 'primary.main',
                               },
                             }}
                           />
                         )}
                         noOptionsText="No tehsils available"
                       />
                       <Autocomplete
                         options={villages}
                         getOptionLabel={(option) => option.name || ''}
                         value={selectedVillage}
                         onChange={(event, newValue) => setSelectedVillage(newValue)}
                         disabled={!selectedTehsil}
                         renderInput={(params) => (
                           <TextField
                             {...params}
                             label="Village"
                             required
                             error={!!errors.village}
                             helperText={errors.village}
                             size="medium"
                             aria-label="Select village"
                             sx={{
                               minWidth: { xs: '300%', sm: 120 },
                               flex: { xs: '1', sm: 'initial' },
                               '& .MuiOutlinedInput-root': {
                                 borderColor: 'rgba(255,255,255,0.3)',
                               },
                               '&:hover .MuiOutlinedInput-root': {
                                 borderColor: 'primary.main',
                               },
                             }}
                           />
                         )}
                         noOptionsText="No villages available"
                       />
                     </Box>
                   </Grid>,
          <Grid item xs={12} sm={6} key="pincode">
            <TextField
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.pincode || !!pincodeError}
              helperText={errors.pincode || pincodeError}
              inputProps={{ maxLength: 10, pattern: "\\d*" }}
              sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
            />
          </Grid>,
         
          renderRadioField('House Status', 'houseStatus', ['Safe', 'Partially Damaged', 'Fully Damaged'], 12, 12)
        ]);

      case 1:
        return renderFormSection('Land & Crop Information', 'mdi:sprout', [
          <Grid item xs={12} sm={6} key="totalLandOwned">
            <TextField
              label="Total Land Owned (acres)"
              name="totalLandOwned"
              value={formData.totalLandOwned}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.totalLandOwned}
              helperText={errors.totalLandOwned}
              type="number"
              sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
            />
          </Grid>,
          <Grid item xs={12} sm={6} key="landAffected">
            <TextField
              label="Land Affected by Flood (acres)"
              name="landAffected"
              value={formData.landAffected}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.landAffected}
              helperText={errors.landAffected}
              type="number"
              sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
            />
          </Grid>,
          <Grid item xs={12} sm={6} key="cropsPlanted">
            <TextField
              label="Crops Planted Before Flood"
              name="cropsPlanted"
              value={formData.cropsPlanted}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
            />
          </Grid>,
          <Grid item xs={12} sm={6} key="cropsLost">
            <TextField
              label="Crops Lost/Damaged"
              name="cropsLost"
              value={formData.cropsLost}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
            />
          </Grid>,
          renderRadioField('Estimated Crop Loss Value', 'estimatedCropLoss', [
            'Under 10,000',
            '10,000 - 25,000',
            '25,000 - 50,000',
            '50,000 - 1,00,000',
            'Above 1,00,000'
          ], 12, 12)
        ]);

      case 2:
        
        return renderFormSection('Agricultural Recovery Requirements', 'mdi:map-marker',
          [

            <TextField
              label="Amount Needed for Recovery (INR)"
              name="amount_needed"
              value={formData.amount_needed}
              onChange={handleChange}
              fullWidth
              type="number"
              inputProps={{ min: 0 }}
              sx={{ '& .MuiInputBase-input': { fontSize: { xs: '2.2rem', sm: '1rem' } } }}
            />,
          renderRadioField('Tractor/Leveling Required', 'tractorLeveling', [
            'Not Required',
            'Required (1-2 hours)',
            'Required (3-5 hours)',
            'Required (More than 5 hours)'
          ]),
          
          renderRadioField('Manure/Organic Fertilizer Needed', 'manureFertilizer', [
            'Not Required',
            'Required (Basic)',
            'Required (Moderate)',
            'Required (Extensive)'
          ]),
          renderRadioField('Seeds Required', 'seedsRequired', [
            'Not Required',
            'Required (Wheat/Rice)',
            'Required (Vegetables)',
            'Required (Mixed Crops)'
          ]),
          renderRadioField('Fertilizers/Pesticides Needed', 'fertilizersPesticides', [
            'Not Required',
            'Basic Requirements',
            'Moderate Requirements',
            'Extensive Requirements'
          ]),
          renderRadioField('Labor Requirement', 'laborRequirement', [
            'Not Required',
            'Required (1-2 days)',
            'Required (3-7 days)',
            'Required (More than 7 days)'
          ]),
          renderRadioField('Irrigation Repair Needed', 'irrigationRepair', [
            'No',
            'Minor Repairs',
            'Major Repairs',
            'Complete Reconstruction'
          ]),
          
          
           ]);

      case 3:
        return renderFormSection('Additional Support Needed', 'mdi:help-circle', [
          renderRadioField('Livestock Damage / Fodder Requirement', 'livestockDamage', [
            'No Damage',
            'Minor Loss/Damage',
            'Moderate Loss/Damage',
            'Severe Loss/Damage'
          ]),
          renderRadioField('Household Needs', 'householdNeeds', [
            'Not Required',
            'Food Supplies',
            'Medical Supplies',
            'Clothing & Basic Needs'
          ]),
          renderRadioField('Housing Repair/Reconstruction Requirement', 'housingRepair', [
            'No Repair Needed',
            'Minor Repairs',
            'Major Repairs',
            'Complete Reconstruction'
          ]),
          renderRadioField('Any Other Urgent Support', 'otherSupport', [
            'Not Required',
            'Financial Assistance',
            'Medical Support',
            'Transportation Support',
            'Other Emergency Support'
          ], 12, 12)
        ]);

      case 4:
        return renderFormSection('Verification & Notes', 'mdi:clipboard-check', [
          <Grid item xs={12} sm={6} key="surveyorName">
            <TextField
              label="Surveyor Name"
              name="surveyorName"
              value={formData.surveyorName}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.surveyorName}
              helperText={errors.surveyorName}
              sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
            />
          </Grid>,
          <Grid item xs={12} sm={6} key="surveyDate">
            <TextField
              label="Survey Date"
              name="surveyDate"
              value={formData.surveyDate}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.surveyDate}
              helperText={errors.surveyDate}
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
            />
          </Grid>,
          <Grid item xs={12} sm={6} key="verifiedBy">
            <TextField
              label="Verification Image (Sarpanch/Pradhan Signature)"
              name="verifiedBy"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              fullWidth
              required
              error={!!errors.verifiedBy}
              helperText={errors.verifiedBy}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
            />
            {formData.verifiedBy && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, overflowWrap: 'break-word' }}>
                  Selected: {formData.verifiedBy.name}
                </Typography>
              </Box>
            )}
          </Grid>,
          <Grid item xs={12} sm={6} key="farmerImage">
            <TextField
              label="Farmer Image"
              name="farmerImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              fullWidth
              required
              error={!!errors.farmerImage}
              helperText={errors.farmerImage}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
            />
            {formData.farmerImage && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, overflowWrap: 'break-word' }}>
                  Selected: {formData.farmerImage.name}
                </Typography>
              </Box>
            )}
          </Grid>,
          <Grid item xs={12} key="additionalNotes">
            <TextField
              label="Additional Notes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              placeholder="Any additional observations or comments..."
              sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
            />
          </Grid>
        ]);

      case 5:
        return renderOverview();

      default:
        return 'Unknown step';
    }
  };

  const progress = activeStep < steps.length ? ((activeStep + 1) / steps.length) * 100 : 100;

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        py: { xs: 2, sm: 4 }, 
        px: { xs: 1, sm: 2 }, 
        width: '100%', 
        maxWidth: { xs: '100%', sm: 600, md: 900, lg: 1200, xl: 1400 } 
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 1, sm: 2, md: 3 }, 
          width: '100%', 
          mx: 'auto',
          borderRadius: { xs: 2, sm: 3 },
          overflowX: 'hidden'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 4 } }}>
          <Typography 
            variant="h4" 
            color="primary" 
            sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}
          >
            Flood Damage Survey Form
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            sx={{ mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}
          >
            Individual Landowner Assessment
          </Typography>
          <Alert 
            severity="info" 
            sx={{ mb: 2, fontSize: { xs: '0.8rem', sm: '0.875rem' }, px: { xs: 1, sm: 2 } }}
          >
            <Typography variant="body2">
              This survey is conducted by <strong>Mera Pind Research and Welfare Society Punjab</strong> to collect 
              authentic data of individual farmers/landowners affected by flooding.
            </Typography>
          </Alert>
        </Box>

        {activeStep < steps.length && (
          <Box sx={{ mb: { xs: 2, sm: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography 
                variant="h5" 
                color="text.secondary" 
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                Step {activeStep + 1} of {steps.length}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: { xs: 6, sm: 8 }, borderRadius: 4 }}
            />
          </Box>
        )}

        <Stepper 
          activeStep={activeStep} 
          alternativeLabel
          sx={{ 
            mb: { xs: 2, sm: 4 }, 
            flexWrap: 'wrap',
            '& .MuiStep-root': { flex: { xs: '100%', sm: 'auto' } },
            overflowX: 'hidden'
          }}
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={({ active, completed }) => (
                  <Box
                    sx={{
                      width: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: completed ? '#4caf50' : 
                                     active ? '#1976d2' : 
                                     '#e0e0e0',
                      color: 'white'
                    }}
                  >
                    {completed ? <Icon icon="mdi:check" width={{ xs: 16, sm: 20 }} height={{ xs: 16, sm: 20 }} /> : 
                                 <Icon icon={step.icon} width={{ xs: 16, sm: 20 }} height={{ xs: 16, sm: 20 }} />}
                  </Box>
                )}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, overflowWrap: 'break-word' }}>
                    {step.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, overflowWrap: 'break-word' }}>
                    {step.description}
                  </Typography>
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length ? (
          <Card 
            elevation={2} 
            sx={{ 
              textAlign: 'center', 
              p: { xs: 2, sm: 3 }, 
              maxWidth: { xs: '100%', sm: 600, md: 900, lg: 1200 },
              mx: 'auto',
              overflowX: 'hidden'
            }}
          >
            <Icon icon="mdi:check" width={{ xs: 48, sm: 64 }} height={{ xs: 48, sm: 64 }} style={{ color: '#4caf50', marginBottom: 16 }} />
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
            >
              Survey Completed!
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 3, fontSize: { xs: '0.9rem', sm: '1rem' } }}
            >
              All steps have been completed. Please review your information and submit the form.
            </Typography>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              size="large"
              disabled={isSubmitting}
              sx={{ 
                minWidth: { xs: 150, sm: 200 }, 
                fontSize: { xs: '0.9rem', sm: '1rem' }, 
                py: { xs: 1, sm: 1.5 } 
              }}
              startIcon={isSubmitting ? <CircularProgress size={{ xs: 18, sm: 20 }} color="inherit" /> : 
                                     <Icon icon="mdi:send" width={{ xs: 18, sm: 20 }} height={{ xs: 18, sm: 20 }} />}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Survey'}
            </Button>
          </Card>
        ) : (
          <Box sx={{ overflowX: 'hidden' }}>
            {getStepContent(activeStep)}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: { xs: 2, sm: 4 }, 
              pt: { xs: 2, sm: 3 },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}>
              <Button 
                disabled={activeStep === 0} 
                onClick={handleBack}
                size="large"
                sx={{ 
                  fontSize: { xs: '0.9rem', sm: '1rem' }, 
                  py: { xs: 1, sm: 1.5 },
                  width: { xs: '100%', sm: 'auto' }
                }}
                startIcon={<Icon icon="mdi:chevron-left" width={{ xs: 18, sm: 20 }} height={{ xs: 18, sm: 20 }} />}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                onClick={handleNext}
                size="large"
                sx={{ 
                  minWidth: { xs: '100%', sm: 120 }, 
                  fontSize: { xs: '0.9rem', sm: '1rem' }, 
                  py: { xs: 1, sm: 1.5 }
                }}
                endIcon={<Icon icon={activeStep === steps.length - 1 ? "mdi:check" : "mdi:chevron-right"} 
                              width={{ xs: 18, sm: 20 }} height={{ xs: 18, sm: 20 }} />}
              >
                {activeStep === steps.length - 1 ? 'Complete' : 'Next'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: { xs: '90%', sm: '100%' }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FloodDamageSurveyForm;