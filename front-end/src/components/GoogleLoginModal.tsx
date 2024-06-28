import React from 'react';
import Modal from 'react-modal';
import LoginWithGoogle from './Login.tsx';

interface LoginModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const GoogleLoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onRequestClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center h-full"
      contentLabel="GoogleLoginModal"
    >
      <div
        onClick={onRequestClose}
        className="absolute border-2 w-full h-full"
      />
      <div className="z-10">
        <LoginWithGoogle />
      </div>
    </Modal>
  );
};

export default GoogleLoginModal;
