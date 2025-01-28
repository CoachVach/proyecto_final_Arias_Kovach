import React from 'react';

const ActionButtons = ({ openModal }) => {
  return (
    <div className="action-buttons">
      <button onClick={() => openModal('qrScanner')} className="open-modal-button">
        Abrir Escáner
      </button>
      <button onClick={() => openModal('fileGenerator')} className="open-modal-button">
        Generar Excel
      </button>
    </div>
  );
};

export default ActionButtons;
