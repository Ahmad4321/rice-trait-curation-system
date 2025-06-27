import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
} from '@mui/material';

const Header = () => {
  return (
    <Box>
      {/* Background container for header and title only */}
      <Box
        // sx={{
        //   backgroundImage: `url('/header-bg.jpg')`, // Replace with your image path
        //   backgroundSize: 'cover',
        //   backgroundPosition: 'center',
        //   color: 'white',
        // }}
      >
        {/* Top Header Bar */}
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="http://127.0.0.1:8000/static/RiceTraitOntology/img/RTOlogo.png"
                alt="Logo"
                style={{ height: 60 }}
              />
            </Box>

            {/* Menu */}
            {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button color="inherit">Home</Button>
              <Button color="inherit">About</Button>
              <Button color="inherit">Services</Button>
              <Button color="inherit">Contact</Button>
            </Box> */}

            {/* Wing In Button */}
            {/* <Button variant="contained" color="secondary">
              Wing In
            </Button> */}
          </Toolbar>
        </AppBar>

        {/* Page Title */}
        <Box sx={{ padding: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                A Curation System for Rice Trait Ontology
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
