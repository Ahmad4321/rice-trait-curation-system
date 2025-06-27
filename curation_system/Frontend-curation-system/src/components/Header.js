import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Link,
} from "@mui/material";
import { useLocation } from "react-router-dom";

const Header = () => {
  let location = useLocation()
  return (
    <Box position="relative">
      <Box>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src="http://lit-evi.hzau.edu.cn/static/RiceTraitOntology/img/RTOlogo.png"
                alt="Logo"
                style={{ height: 60 }}
              />
              <Box
                sx={{ display: "flex", alignItems: "center", paddingLeft: 50,gap:1 }} 
              >
                <Link href="/rice_trait_ontology_curation_system/" color="inherit" underline="none">
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ display: { xs: "none", md: "flex"},
                    fontSize:"x-large",
                    fontWeight: location.pathname === '/' ? 'bold' : 'normal', }}
                  >
                    Main Page
                  </Typography>
                </Link>
                <Typography
                    variant="h6"
                    component="div"
                  >
                    |
                  </Typography>
                <Link
                  href="/rice_trait_ontology_curation_system/guidlines/"
                  color="inherit"
                  underline="none"
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ 
                      display: { xs: "none", md: "flex"},
                      fontWeight: location.pathname === '/guidlines/' ? 'bold' : 'normal',
                      fontSize:"x-large"
                    }}
                      
                  >
                    Guidelines
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </Box>
  );
};

export default Header;
