import React from 'react';
import Modal from './common/Modal';
import QRScanner from './QRScanner';
import FileModal from './FileModal';
import AlumnoMesaUpdate from './AlumnoMesaUpdate';

const ModalWrapper = ({ modalState, closeModal, handleQRCodeScanned, alumnos, mesa }) => {
  if (!modalState.type) return null;

  return (
    <Modal isOpen={true} onClose={closeModal}>
      {modalState.type === 'QRScanner' && (
        <>
          <QRScanner onQRCodeScanned={handleQRCodeScanned} />
          <button onClick={closeModal}>Cerrar</button>
        </>
      )}
      {modalState.type === 'FileModal' && (
        <FileModal
          alumnos={alumnos}
          onClose={closeModal}
          materia={mesa.materia}
          fecha={mesa.fecha}
        />
      )}
      {modalState.type === 'AlumnoUpdate' && (
        <AlumnoMesaUpdate
          onClose={closeModal}
          alumno={modalState.data}
          id_mesa={mesa.id_mesa}
        />
      )}
    </Modal>
  );
};

export default ModalWrapper;
