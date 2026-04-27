import React from 'react';
import { Box } from '@mui/material';
import FarmerDetailsTable from './FarmerTable';

const FarmerDataSection = ({ 
  farmersData, 
  farmersLoading, 
  count, 
  page, 
  onChange, 
  rowsPerPage, 
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
  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    onChange(event, 1); // Reset to first page (1-based)
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        pt: 0,
      }}
    >
      <FarmerDetailsTable
        farmers={farmersData}
        loading={farmersLoading}
        count={count}
        page={page - 1} // Convert 1-based to 0-based for TablePagination
        onChange={(event, newPage) => onChange(event, newPage + 1)} // Convert 0-based back to 1-based
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        setRowsPerPage={setRowsPerPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        cropLossRange={cropLossRange}
        setCropLossRange={setCropLossRange}
        onRefresh={onRefresh}
        searchQuery={searchQuery}
        selectedVillageId={selectedVillageId}
      />
    </Box>
  );
};

export default FarmerDataSection;