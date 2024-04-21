import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';

type BenefitCardProps = {
  title: string;
  icon: any;
  description: string;
  color: string;
};

const BenefitCard = (props: BenefitCardProps) => {
  const { title, icon, description, color } = props;
  return (
    <Box sx={{ ...benefitsCardStyles.card, borderColor: color }}>
      <Box>
        <div
          className={`flex items-center justify-center p-4 w-fit mb-5 ${
            color === '#F9AD56'
              ? 'bg-[#F9AD56]'
              : color === '#16C79A'
              ? 'bg-[#16C79A]'
              : 'bg-[#FF5E78]'
          } rounded-full`}
        >
          <Image src={icon} alt={title} height={20} width={20} />
        </div>

        <Typography variant="h6" sx={benefitsCardStyles.title}>
          {title}
        </Typography>
        <Typography variant="body2" sx={benefitsCardStyles.description}>
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default BenefitCard;

const benefitsCardStyles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: 3,
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    p: 3,
    border: '2px solid',
    width: '100%',
    minHeight: '275px',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
    },
  },
  icon: {
    fontSize: '3rem',
    borderRadius: '50%',
    padding: 2,
    marginBottom: 2,
    zIndex: -1,
  },
  title: {
    fontWeight: 'bold',
    mb: 2,
  },
  description: {
    textAlign: 'left',
  },
};
