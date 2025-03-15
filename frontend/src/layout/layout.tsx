import React, { useState } from "react";
import { Link } from "react-router";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";

const drawerWidth = 240;

type routerProps = {
  id: number;
  name: string;
  nameRoute: string;
  icon: React.ReactNode;
  path?: string | undefined;
  children?:
    | {
        id: number;
        name: string;
        nameRoute: string;
        icon: React.ReactNode;
        path: string;
      }[]
    | undefined;
};

const router: routerProps[] = [
  {
    id: 1,
    name: "Dashboard",
    nameRoute: "dashboard",
    icon: <InboxIcon />,
    path: "/",
  },
  {
    id: 2,
    name: "Penduduk",
    nameRoute: "resident",
    icon: <InboxIcon />,
    children: [
      {
        id: 1,
        name: "Daftar Penduduk",
        nameRoute: "resident",
        icon: <InboxIcon />,
        path: "/resident",
      },
      {
        id: 2,
        name: "Riwayat",
        nameRoute: "history",
        icon: <InboxIcon />,
        path: "/resident-history",
      },
    ],
  },
  {
    id: 3,
    name: "Rumah",
    nameRoute: "house",
    icon: <InboxIcon />,
    path: "/house",
  },
  {
    id: 4,
    name: "Pembayaran",
    nameRoute: "payment",
    icon: <InboxIcon />,
    path: "/payment",
  },
  {
    id: 5,
    name: "Layanan",
    nameRoute: "service",
    icon: <InboxIcon />,
    path: "/service",
  },
  {
    id: 6,
    name: "Invoice",
    nameRoute: "invoice",
    icon: <InboxIcon />,
    path: "/invoice",
  },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const menu = (
    <>
      {router.map((route) => {
        if (route.children) {
          return <MenuItem key={route.id} router={route} />;
        } else {
          return (
            <ListItem key={route.id} disablePadding>
              <Link
                to={route.path || "#"}
                style={{
                  textDecoration: "none",
                  width: "100%",
                  color: "inherit",
                }}>
                <ListItemButton>
                  <ListItemIcon>{route.icon}</ListItemIcon>
                  <ListItemText primary={route.name} />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        }
      })}
    </>
  );

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>{menu}</List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Pengaturan" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Responsive drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}>
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open>
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

const MenuItem = ({ router }: { router: routerProps }) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary={router.name} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      {router.children ? (
        <Collapse in={open} timeout="auto" unmountOnExit>
          {router.children?.map((route) => (
            <List component="div" disablePadding key={route.id}>
              <Link
                to={route.path || "#"}
                style={{
                  textDecoration: "none",
                  width: "100%",
                  color: "inherit",
                }}>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary={route.name} />
                </ListItemButton>
              </Link>
            </List>
          ))}
        </Collapse>
      ) : null}
    </>
  );
};

export default Layout;
