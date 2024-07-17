import React from 'react';
import Modal from 'react-modal';
import LoginWithGoogle from './Login.tsx';
import { useToolTip } from './hooks/useToolTip.ts';
import { ToolTip } from './helpers/ToolTip.tsx';

interface LoginModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const GoogleLoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onRequestClose,
}) => {
  const { toolTipText, showTooltip, tooltipPosition } = useToolTip();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className="flex items-center justify-center h-full"
        contentLabel="GoogleLoginModal"
      >
        {/* extra div added to be able to close if clicked outside the loginWithGoogle */}
        <div onClick={onRequestClose} className="absolute  w-full h-full" />
        <div className="z-10" title="External login window with Google">
          <LoginWithGoogle />
        </div>
      </Modal>
      <ToolTip
        text={toolTipText}
        visible={showTooltip}
        position={tooltipPosition}
      />
    </>
  );
};

export default GoogleLoginModal;
