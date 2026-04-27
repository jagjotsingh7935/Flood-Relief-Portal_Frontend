import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import axios from 'axios';

export default function TotalFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const fetchFarmerData = async (pageNum = 1, search = '') => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/floods/api/show/person/on/user/page/with/filters/uisng/village/id/`, {
        params: {
          page: pageNum,
          page_size: rowsPerPage,
          search: search || undefined,
        },
      });

      const { results, count } = response.data;
      // Transform API data to match table structure
      const transformedData = results.map((item) => ({
        id: item.person_id,
        name: item.form_data[0]?.farmer_name || 'N/A',
        location: item.village_data[0]?.tehsil_data[0]?.city_data[0]?.name || 'N/A',
        landSize: item.form_data[0]?.totalLandOwned ? `${item.form_data[0].totalLandOwned} acres` : 'N/A',
        crop: item.form_data[0]?.cropsPlanted || 'N/A',
        phone: item.form_data[0]?.mobileNumber || 'N/A',
        status: item.is_active ? 'Active' : 'Inactive',
      }));

      setFarmers(transformedData);
      setTotalCount(count);
    } catch (error) {
      console.error('Error fetching farmer data:', error);
    } finally {
      setLoading(false);
    }
  };

const handleGeneratePDF = async () => {
  setPdfLoading(true);
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/floods/api/generate/person/data/pdf/`, {
      params: {
        search: searchTerm || undefined,
      },
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
    fetchFarmerData(page + 1, searchTerm);
  }, [page, rowsPerPage, searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reset to first page on new search
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Total Farmers
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          fullWidth
          label="Search Farmers"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flex: 1, minWidth: { xs: '100%', sm: '300px' } }}
          placeholder="Search by name, location, or crop..."
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleGeneratePDF}
          disabled={loading || pdfLoading}
          sx={{ height: 'fit-content', alignSelf: 'center' }}
        >
          {pdfLoading ? 'Generating PDF...' : 'Generate PDF'}
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Location</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Land Size</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Crop</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : (
              farmers.map((farmer) => (
                <TableRow
                  key={farmer.id}
                  sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                >
                  <TableCell>{farmer.id}</TableCell>
                  <TableCell>{farmer.name}</TableCell>
                  <TableCell>{farmer.location}</TableCell>
                  <TableCell>{farmer.landSize}</TableCell>
                  <TableCell>{farmer.crop}</TableCell>
                  <TableCell>{farmer.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={farmer.status}
                      color={farmer.status === 'Active' ? 'success' : 'default'}
                      size="small"
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
      />

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={pdfLoading}
      >
        <CircularProgress color="inherit" />
        <Typography sx={{ ml: 2 }}>Generating PDF...</Typography>
      </Backdrop>
    </Box>
  );
}