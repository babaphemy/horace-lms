import React, { ReactElement } from 'react';
import { Appcontext, AppDpx } from '../context/AppContext';
import { Backdrop, Box, Fade, Modal } from '@mui/material';
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

interface Props {
  children: ReactElement;
  type: 'login' | 'signup' | 'payment';
}

const ModalContainer = ({ type, children }: Props) => {
  const { modal } = React.useContext(Appcontext);
  const dispatch = React.useContext(AppDpx);

  const handleClose = () => {
    dispatch({
      type: 'MODAL_SET',
      data: {
        ...modal,
        open: false,
      },
    });
  };
  return (
    <Box>
      <Modal
        open={modal.type === type && modal.open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={modal.type === type && modal.open}>
          <Box
            className="py-10 px-3 md:p-8 border-2 rounded-2xl md:rounded border-t-red-500"
            sx={style}
          >
            {children}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ModalContainer;
