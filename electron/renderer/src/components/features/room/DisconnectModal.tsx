import React from 'react';
import { Modal } from "../../Modal";

interface DisconnectModalProps {
  open: boolean;
  onClose: () => void;
  message?: string;
}

export const DisconnectModal: React.FC<DisconnectModalProps> = ({ open, onClose, message }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 text-red-600">Disconnected</h2>
      <p className="mb-6">{message || 'The server has been closed or you have been disconnected from the network.'}</p>
      <button
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
        onClick={onClose}
      >
        OK
      </button>
    </Modal>
  );
}; 