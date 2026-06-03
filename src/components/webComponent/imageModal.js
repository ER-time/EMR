import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ImageModal = ({ open, onClose, imageSrc }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="image-modal-title"
      aria-describedby="image-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',  // Adjust the width as needed
          height: '70%', // Adjust the height as needed
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>
        <img
          src={imageSrc}
          alt="Preview"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </Box>
    </Modal>
  );
};

export default ImageModal;
