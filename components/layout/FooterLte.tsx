import { Box, Divider, Typography } from '@mui/material';
import React from 'react';

const FooterLte = () => {
  return (
    <Box mt={5} bgcolor="black" color={'white'}>
      <Divider sx={footerStyles.divider} />
      <Typography variant="body1" sx={footerStyles.center}>
        Powered By Horace | All Rights Reserved! &copy;{' '}
        {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};

export default FooterLte;
const footerStyles = {
  divider: {
    background: '#1A055F',
    height: '3px',
    my: 2,
  },
  center: { textAlign: 'center', py: 2 },
};
