import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Container,
  Stack,
  alpha,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CloudUpload,
  CloudDownload,
  CheckCircle,
  Error,
  Close,
  Description,
  Agriculture,
  FileUpload
} from '@mui/icons-material';

const ExcelUploadDownload = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile && (
      selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
      selectedFile.type === 'application/vnd.ms-excel'
    )) {
      setFile(selectedFile);
      setError('');
      setUploadMessage('');
    } else if (selectedFile) {
      setFile(null);
      setError('Please select a valid Excel file (.xlsx or .xls)');
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setError('Please select an Excel file to upload');
      return;
    }

    setIsUploading(true);
    setError('');
    setUploadMessage('');

    const formData = new FormData();
    formData.append('excel_file', file);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/floods/api/bulk/upload/excel/admin/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadMessage(`Successfully processed ${response.data.total_processed} records!`);
      setFile(null);
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err.response?.data?.error || 
        err.message === 'Network Error' 
          ? 'Failed to connect to the server. Please check if the backend is running.'
          : 'Failed to upload file. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Handle template download
 // Handle template download
const handleDownload = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/floods/api/download/excel/`);
    console.log('response', response.data);
    
    const { download_url, filename } = response.data;
    console.log('download_url', download_url);
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = download_url;
    link.setAttribute('download', filename);
    link.setAttribute('target', '_blank'); // Optional: open in new tab
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (err) {
    console.error('Download error:', err);
    setError(
      err.response?.data?.error || 
      err.message === 'Network Error' 
        ? 'Failed to connect to the server. Please check if the backend is running.'
        : 'Failed to download template. Please try again.'
    );
  }
};

const handleDownloadGuide = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/floods/api/export/location/data/excel/`);
    console.log('response', response.data);
    
    const { download_url, filename } = response.data;
    console.log('download_url', download_url);
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = download_url;
    link.setAttribute('download', filename);
    link.setAttribute('target', '_blank'); // Optional: open in new tab
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (err) {
    console.error('Download error:', err);
    setError(
      err.response?.data?.error || 
      err.message === 'Network Error' 
        ? 'Failed to connect to the server. Please check if the backend is running.'
        : 'Failed to download template. Please try again.'
    );
  }
};

  const clearFile = () => {
    setFile(null);
    setUploadMessage('');
    setError('');
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: { xs: 3, sm: 4 }, textAlign: 'center' }}>
        <Agriculture sx={{ fontSize: { xs: 36, sm: 42, md: 48 }, color: 'primary.main', mb: 1 }} />
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700, 
            color: 'text.primary',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          Farmer Data Management
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary', 
            maxWidth: 600, 
            mx: 'auto',
            fontSize: { xs: '0.875rem', sm: '1rem' },
            px: { xs: 2, sm: 0 }
          }}
        >
          Streamline your farmer data operations with our easy-to-use upload and download system
        </Typography>
      </Box>

      <Stack spacing={{ xs: 2, sm: 3 }}>
        {/* Download Template Card */}
        <Card 
          elevation={0} 
          sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.3s',
            '&:hover': {
              borderColor: 'primary.main',
              boxShadow: (theme) => `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`
            }
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: { xs: 1.5, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Box
                sx={{
                  p: { xs: 1, sm: 1.5 },
                  borderRadius: 2,
                  bgcolor: 'primary.50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: { xs: 'center', sm: 'flex-start' }
                }}
              >
                <CloudDownload sx={{ fontSize: { xs: 28, sm: 32 }, color: 'primary.main' }} />
              </Box>
              <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 0.5,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  Download Excel Template
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary', 
                    mb: 2,
                    fontSize: { xs: '0.813rem', sm: '0.875rem' }
                  }}
                >
                  Get the standardized template with all required fields to ensure proper data formatting
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                  <Chip label="XLSX Format" size="small" variant="outlined" />
                  <Chip label="Pre-formatted" size="small" variant="outlined" />
                  <Chip label="Easy to fill" size="small" variant="outlined" />
                </Box>
              </Box>
            </Box>
          </CardContent>
          <Divider />
          <CardActions sx={{ 
            p: { xs: 1.5, sm: 2 }, 
            justifyContent: { xs: 'center', sm: 'flex-end' }
          }}>
            <Button
              variant="contained"
              startIcon={!isMobile && <CloudDownload />}
              onClick={handleDownload}
              fullWidth={isMobile}
              sx={{ 
                textTransform: 'none',
                px: 3,
                py:{xs:1.5,md:0.8},
                fontWeight: 600,
                fontSize: { xs: '0.675rem', sm: '0.9375rem' }
              }}
            >
              Download Template
            </Button>
             <Button
              variant="contained"
              startIcon={!isMobile && <CloudDownload />}
              onClick={handleDownloadGuide}
              fullWidth={isMobile}
              sx={{ 
                textTransform: 'none',
                px: 3,
                fontWeight: 600,
                fontSize: { xs: '0.55rem', sm: '0.9375rem' }
              }}
            >
              Export State–District–Village Data
            </Button>
          </CardActions>
        </Card>

        {/* Upload File Card */}
        <Card 
          elevation={0}
          sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.3s',
            '&:hover': {
              borderColor: 'success.main',
              boxShadow: (theme) => `0 4px 20px ${alpha(theme.palette.success.main, 0.1)}`
            }
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: { xs: 1.5, sm: 2 }, 
              mb: { xs: 2, sm: 3 },
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Box
                sx={{
                  p: { xs: 1, sm: 1.5 },
                  borderRadius: 2,
                  bgcolor: 'success.50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: { xs: 'center', sm: 'flex-start' }
                }}
              >
                <CloudUpload sx={{ fontSize: { xs: 28, sm: 32 }, color: 'success.main' }} />
              </Box>
              <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 0.5,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  Upload Excel File
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: { xs: '0.813rem', sm: '0.875rem' }
                  }}
                >
                  Upload your completed Excel file with farmer data for bulk processing
                </Typography>
              </Box>
            </Box>

            {/* Drag and Drop Area */}
            <Paper
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                border: '2px dashed',
                borderColor: isDragging ? 'success.main' : 'divider',
                bgcolor: isDragging ? alpha('#2e7d32', 0.05) : 'grey.50',
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'success.main',
                  bgcolor: alpha('#2e7d32', 0.05)
                }
              }}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              
              {!file ? (
                <>
                  <FileUpload sx={{ 
                    fontSize: { xs: 36, sm: 42, md: 48 }, 
                    color: 'text.secondary', 
                    mb: 1 
                  }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 0.5,
                      fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                    }}
                  >
                    Drop your Excel file here
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary', 
                      mb: 2,
                      fontSize: { xs: '0.813rem', sm: '0.875rem' }
                    }}
                  >
                    or click to browse
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: { xs: '0.688rem', sm: '0.75rem' }
                    }}
                  >
                    Supported formats: .xlsx, .xls
                  </Typography>
                </>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: { xs: 1, sm: 1.5 },
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Description sx={{ color: 'success.main', fontSize: { xs: 28, sm: 32 } }} />
                  <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flex: 1 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        wordBreak: 'break-word'
                      }}
                    >
                      {file.name}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'text.secondary',
                        fontSize: { xs: '0.688rem', sm: '0.75rem' }
                      }}
                    >
                      {(file.size / 1024).toFixed(2)} KB
                    </Typography>
                  </Box>
                  <Tooltip title="Remove file">
                    <IconButton 
                      onClick={(e) => { e.stopPropagation(); clearFile(); }} 
                      size="small"
                    >
                      <Close />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Paper>

            {isUploading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary', 
                    mt: 1, 
                    textAlign: 'center',
                    fontSize: { xs: '0.813rem', sm: '0.875rem' }
                  }}
                >
                  Processing your file...
                </Typography>
              </Box>
            )}
          </CardContent>
          <Divider />
          <CardActions sx={{ 
            p: { xs: 1.5, sm: 2 }, 
            justifyContent: { xs: 'center', sm: 'flex-end' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 }
          }}>
            <Button
              variant="outlined"
              onClick={clearFile}
              disabled={!file || isUploading}
              fullWidth={isMobile}
              sx={{ 
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '0.9375rem' }
              }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : (!isMobile && <CloudUpload />)}
              onClick={handleUpload}
              disabled={!file || isUploading}
              fullWidth={isMobile}
              sx={{ 
                textTransform: 'none',
                px: 3,
                fontWeight: 600,
                fontSize: { xs: '0.875rem', sm: '0.9375rem' }
              }}
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </CardActions>
        </Card>

        {/* Success Message */}
        {uploadMessage && (
          <Alert 
            severity="success" 
            icon={<CheckCircle />}
            onClose={() => setUploadMessage('')}
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-message': { width: '100%' },
              fontSize: { xs: '0.813rem', sm: '0.875rem' }
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Upload Successful!
            </Typography>
            <Typography 
              variant="body2"
              sx={{ fontSize: { xs: '0.813rem', sm: '0.875rem' } }}
            >
              {uploadMessage}
            </Typography>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert 
            severity="error" 
            icon={<Error />}
            onClose={() => setError('')}
            sx={{ 
              borderRadius: 2,
              fontSize: { xs: '0.813rem', sm: '0.875rem' }
            }}
          >
            {error}
          </Alert>
        )}
      </Stack>
    </Container>
  );
};

export default ExcelUploadDownload;