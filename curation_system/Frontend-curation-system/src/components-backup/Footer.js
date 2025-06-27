import React from 'react';
import { Box, Typography, Container, Stack } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#0f6588', 
        color: 'white',
        paddingY: 6,
        textAlign: 'center',
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Developing Team
        </Typography>
        <Stack direction="column" alignItems="center" spacing={1}>
          <Box
            component="img"
            src="http://lit-evi.hzau.edu.cn/static/BioNLP_Django/img/home/BioNLP_logo.png" 
            alt="BioNLP Lab Logo"
            sx={{ width: 100, height: 100 }}
          />
          <Typography variant="h6" fontWeight="bold">
            HZAU BioNLP Lab
          </Typography>
        </Stack>
        <Box mt={4}>
          <Typography>
            <strong>Affiliation:</strong> College of Informatics, Huazhong Agricultural University, Wuhan, Hubei, China
          </Typography>
          <Typography>
            <strong>Main Developer:</strong> Muhammad Ahmad Javeed
          </Typography>
          <Typography>
            <strong>Lab PI:</strong> Jingbo Xia
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
