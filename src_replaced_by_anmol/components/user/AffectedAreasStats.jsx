import React, { useState } from "react";
import {
  ThemeProvider,
  createTheme,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Paper,
  Stack,
  Divider,
  Container,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DownloadIcon from "@mui/icons-material/Download";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AgricultureIcon from "@mui/icons-material/Agriculture";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#000000",
      paper: "#121212",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
    success: {
      main: "#4caf50",
    },
  },
});

export default function AffectedAreasStats() {
  const [loading, setLoading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    setReportGenerated(false);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/dataAddition/api/affected/villages/pdf/`
      );

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      // Get the blob from response
      const pdfUrl = await response.text();

      // Create a download link
      const link = document.createElement('a');
    link.href = pdfUrl.trim();
    link.download = `Affected_Villages_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

      setLoading(false);
    setReportGenerated(true);
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setReportGenerated(false);
    }, 5000);
    
  } catch (error) {
    console.error('Error generating report:', error);
    setLoading(false);
    alert('Failed to generate report. Please try again.');
  }
};

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          py: { xs: 3, sm: 4, md: 6 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Container maxWidth="md">
          {/* Header Section */}
          <Box
            sx={{
              mb: { xs: 4, md: 6 },
              textAlign: "center",
            }}
          >
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={1.5}
              sx={{ mb: 2 }}
            >
              <AgricultureIcon
                sx={{
                  fontSize: { xs: 32, md: 40 },
                  color: "primary.main",
                }}
              />
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
                }}
              >
                Affected Villages
              </Typography>
            </Stack>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                mb: 2,
                fontSize: { xs: "0.95rem", sm: "1.1rem" },
                px: { xs: 1, sm: 2 },
              }}
            >
              Farmers List Report Generator
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              justifyContent="center"
              sx={{ mt: 2 }}
            >
              <Chip
                icon={<LocationOnIcon />}
                label="Area Coverage Report"
                color="primary"
                variant="outlined"
                sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
              />
              <Chip
                icon={<PictureAsPdfIcon />}
                label="PDF Export"
                color="secondary"
                variant="outlined"
                sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
              />
            </Stack>
          </Box>

          {/* Main Card */}
          <Card
            sx={{
              bgcolor: "background.paper",
              boxShadow: "0 8px 32px rgba(144, 202, 249, 0.15)",
              borderRadius: 3,
              border: "1px solid rgba(144, 202, 249, 0.2)",
              overflow: "hidden",
            }}
          >
            <CardContent
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
              }}
            >
              {/* Info Section */}
              <Paper
                elevation={0}
                sx={{
                  bgcolor: "rgba(144, 202, 249, 0.05)",
                  border: "1px solid rgba(144, 202, 249, 0.2)",
                  borderRadius: 2,
                  p: { xs: 2, sm: 3 },
                  mb: 4,
                }}
              >
                <Stack spacing={2}>
                  <Box>
                    <Typography
                      variant="overline"
                      sx={{
                        color: "primary.main",
                        fontWeight: 600,
                        letterSpacing: 1.2,
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                      }}
                    >
                      Report Contents
                    </Typography>
                    <Divider
                      sx={{ my: 1.5, borderColor: "rgba(144, 202, 249, 0.2)" }}
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CheckCircleIcon
                          sx={{ color: "success.main", fontSize: 20 }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: { xs: "0.85rem", sm: "0.875rem" } }}
                        >
                          Complete farmers listing
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CheckCircleIcon
                          sx={{ color: "success.main", fontSize: 20 }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: { xs: "0.85rem", sm: "0.875rem" } }}
                        >
                          Village-wise breakdown
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CheckCircleIcon
                          sx={{ color: "success.main", fontSize: 20 }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: { xs: "0.85rem", sm: "0.875rem" } }}
                        >
                          Contact information
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CheckCircleIcon
                          sx={{ color: "success.main", fontSize: 20 }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: { xs: "0.85rem", sm: "0.875rem" } }}
                        >
                          Statistical summary
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Paper>
              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <DownloadIcon />
                    )
                  }
                  onClick={generateReport}
                  disabled={loading}
                  sx={{
                    py: { xs: 1.5, sm: 2 },
                    px: 4,
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(144, 202, 249, 0.4)",
                    maxWidth: { sm: 400 },
                    mx: "auto",
                    "&:hover": {
                      boxShadow: "0 6px 16px rgba(144, 202, 249, 0.5)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {loading
                    ? "Generating PDF Report..."
                    : "Download Farmers List (PDF)"}
                </Button>

                {/* Success Message */}
                {reportGenerated && (
                  <Alert
                    icon={<CheckCircleIcon fontSize="inherit" />}
                    severity="success"
                    sx={{
                      mt: 3,
                      borderRadius: 2,
                      fontSize: { xs: "0.85rem", sm: "0.875rem" },
                    }}
                  >
                    Report downloaded successfully!
                  </Alert>
                )}
              </Box>
              {/* Footer Info */}
              <Box
                sx={{
                  mt: 4,
                  pt: 3,
                  borderTop: "1px solid rgba(144, 202, 249, 0.1)",
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Chip
                    icon={<WarningAmberIcon />}
                    label="Comprehensive Data"
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
                  />
                  <Chip
                    icon={<PictureAsPdfIcon />}
                    label="PDF Format"
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
                  />
                  <Chip
                    icon={<AssessmentIcon />}
                    label="Detailed Analytics"
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
                  />
                </Stack>
              </Box>
            </CardContent>
          </Card>

          {/* Additional Info Card */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              bgcolor: "rgba(244, 143, 177, 0.05)",
              border: "1px solid rgba(244, 143, 177, 0.2)",
              borderRadius: 2,
              p: { xs: 2, sm: 3 },
            }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <WarningAmberIcon sx={{ color: "secondary.main", mt: 0.5 }} />
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "secondary.main",
                    fontWeight: 600,
                    mb: 0.5,
                    fontSize: { xs: "0.875rem", sm: "0.95rem" },
                  }}
                >
                  Note
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                >
                  The generated report includes all affected villages with
                  complete farmer details, contact information, and land
                  records. Please ensure secure handling of this sensitive data.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
