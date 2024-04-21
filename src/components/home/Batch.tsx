import { Button, styled } from '@mui/material';
import React from 'react';

type BatchProps = {
  label: string;
  onClick: () => void;
  active?: boolean;
};

type ButtonProps = {
  activeProp?: boolean;
};

const ButtonStyled = styled(Button)<ButtonProps>(({ theme, activeProp }) => ({
  backgroundColor: activeProp ? '#FF6854 !important' : 'transparent',
  color: activeProp ? '#fff' : '#FF6854',
  padding: '5px 10px',
  margin: '0 3px',
  borderRadius: 20,
  fontSize: '12px',
  textTransform: 'capitalize',

  '&:hover': {
    backgroundColor: '#FF6854 !important',
    color: '#fff',
  },

  '&:focus': {
    backgroundColor: '#FF6854 !important',
    color: '#fff',
  },

  '&:active': {
    backgroundColor: '#FF6854 !important',
    color: '#fff',
  },
}));

const Batch: React.FC<BatchProps> = (props) => {
  const { label, onClick, active } = props;
  return (
    <ButtonStyled variant="text" activeProp={active} onClick={onClick}>
      {label}
    </ButtonStyled>
  );
};

export default Batch;
