import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  useTheme,
  alpha,
  Tooltip,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import logo from "../../assets/logo.png";
const drawerWidth = 280;

// Styled components (unchanged, omitted for brevity)
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    boxSizing: "border-box",
    width: drawerWidth,
    background: `linear-gradient(145deg, ${
      theme.palette.background.paper
    } 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
    borderRight: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
    backdropFilter: "blur(10px)",
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
  backdropFilter: "blur(20px)",
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 12,
  margin: "4px 12px",
  padding: "12px 16px",
  position: "relative",
  overflow: "hidden",

  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(45deg, ${alpha(
      theme.palette.primary.main,
      0.1
    )}, ${alpha(theme.palette.primary.main, 0.05)})`,
    opacity: 0,
    transition: "opacity 0.3s ease",
    zIndex: 0,
  },

  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: "translateX(4px)",
    "&:before": {
      opacity: 1,
    },
    "& .MuiListItemIcon-root": {
      transform: "scale(1.1)",
      color: theme.palette.primary.main,
    },
  },

  "&.Mui-selected": {
    color: "black",

    "& .MuiListItemIcon-root": {
      color: "black",
      transform: "scale(1.2)",
    },

    "&:hover": {
      transform: "translateX(8px)",
    },

    "&:after": {
      content: '""',
      position: "absolute",
      right: 0,
      top: "50%",
      transform: "translateY(-50%)",
      width: 4,
      height: "60%",
    },
  },
}));

const menuItems = [
  { text: "Map", icon: "mdi:map-outline", id: "map", path: "/affectedvillages/admin" },
  {
    text: "Survey Form",
    icon: "mdi:water",
    id: "surveyform",
    path: "/surveyform",
  },
  {
    text: "Responses",
    icon: "fluent-mdl2:feedback-response-solid",
    id: "responses",
    path: "/responses",
  },
  {
    text: "Requests",
    icon: "ic:sharp-pending-actions",
    id: "requests",
    path: "/requests",
  },
  {
    text: "Add Data",
    icon: 'streamline-ultimate:data-file-bars-add-bold',
    id: "pincodeadddataadmin",
    path: "/pincodeadddataadmin",
  },
  {
    text: "Bulk Upload",
    icon: "icon-park-outline:excel",
    id: "bulkupload",
    path: "/bulkupload",
  },
  {
    text: "Amount Add",
    icon: "lsicon:amount-up-two-filled",
    id: "amountadd",
    path: "/amount",
  },

  {
    text: "Admin List",
    icon: "subway:admin-1",
    id: "amountadd",
    path: "/admin/list",
  },
];

function FloodDashboard({ showDrawer = true, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified path
    setMobileOpen(false); // Close mobile drawer
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ p: 3, pb: 2, display: "flex", justifyContent: "center" }}>
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            width: 120,
            height: 120,
          }}
        />
      </Box>

      <Divider sx={{ opacity: 0.6 }} />

      {/* Navigation */}
      <List sx={{ flex: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <StyledListItemButton
              onClick={() => handleNavigation(item.path)} // Use path for navigation
              selected={window.location.pathname === item.path} // Use window.location.pathname for highlighting
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon
                  icon={item.icon}
                  width={22}
                  height={22}
                  style={{ transition: "all 0.3s ease" }}
                />
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight:
                    window.location.pathname === item.path ? 600 : 500,
                  fontSize: "0.95rem",
                }}
              />
              {item.badge && (
                <Chip
                  label={item.badge}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    backgroundColor:
                      window.location.pathname === item.path
                        ? "rgba(255,255,255,0.2)"
                        : alpha(theme.palette.primary.main, 0.1),
                    color:
                      window.location.pathname === item.path
                        ? "white"
                        : theme.palette.primary.main,
                  }}
                />
              )}
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <StyledAppBar
        position="fixed"
        sx={{
          width: { md: showDrawer ? `calc(100% - ${drawerWidth}px)` : "100%" },
          ml: { md: showDrawer ? `${drawerWidth}px` : 0 },
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ minHeight: 70 }}>
          {showDrawer && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                display: { md: "none" },
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <Icon icon="mdi:menu" />
            </IconButton>
          )}

          {/* Page Title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* <Icon
              icon={
                menuItems.find((item) => item.path === window.location.pathname)
                  ?.icon || "mdi:map-outline"
              }
              width={24}
              height={24}
              color={theme.palette.primary.main}
            /> */}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {menuItems.find((item) => item.path === window.location.pathname)
                ?.text || "Mera Pind"}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Action Icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Admin Dashboard
            <Tooltip title="User Profile">
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 38,
                  height: 38,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: `0 4px 14px ${alpha(
                      theme.palette.primary.main,
                      0.3
                    )}`,
                  },
                }}
              >
                <Icon icon="mdi:account" width={20} height={20} />
              </Avatar>
            </Tooltip>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {showDrawer && (
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          <StyledDrawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            {drawer}
          </StyledDrawer>
          <StyledDrawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
            }}
            open
          >
            {drawer}
          </StyledDrawer>
        </Box>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          my: 10,
          p: 1,
          width: { md: showDrawer ? `calc(100% - ${drawerWidth}px)` : "100%" },
          bgcolor: alpha(theme.palette.background.default, 0.3),
          minHeight: "calc(100vh - 70px)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default FloodDashboard;
