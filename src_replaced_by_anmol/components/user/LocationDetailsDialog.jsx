import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Input,
} from '@mui/material';
import { Icon } from '@iconify/react';

const LocationDetailsDialog = ({ open, onClose, selectedPlace }) => {
  const [uploadFile, setUploadFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setUploadFile(file);
      console.log('Selected file:', file);
    } else {
      alert('Please select a valid Excel file (.xlsx or .xls)');
      event.target.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    window.open('/path/to/template.xlsx', '_blank');
  };

  const handleUpload = () => {
    if (uploadFile) {
      console.log('Uploading file:', uploadFile);
      alert('File uploaded successfully!');
      setUploadFile(null);
      onClose();
    } else {
      alert('Please select a file to upload.');
    }
  };

  if (!selectedPlace) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}
      >
        Location Details: {selectedPlace.label}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Location Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Name:</strong> {selectedPlace.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Type:</strong> {selectedPlace.type}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Latitude:</strong> {selectedPlace.lat.toFixed(4)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Longitude:</strong> {selectedPlace.lng.toFixed(4)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Download Template
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Download the Excel template for data entry:
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Icon icon="mdi:download" />}
              onClick={handleDownloadTemplate}
              fullWidth
            >
              Download Template.xlsx
            </Button>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Upload Excel File
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Upload your completed Excel file (only .xlsx or .xls allowed):
            </Typography>
            <FormControl fullWidth>
              <InputLabel htmlFor="upload-excel">Choose Excel File</InputLabel>
              <Input
                id="upload-excel"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                inputProps={{ 'aria-label': 'Upload Excel file' }}
              />
            </FormControl>
            {uploadFile && (
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                Selected: {uploadFile.name}
              </Typography>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          color="primary"
          disabled={!uploadFile}
        >
          Upload and Proceed to Dashboard
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationDetailsDialog;