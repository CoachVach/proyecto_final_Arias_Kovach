import React, { useState, useEffect, useRef } from 'react';
import Modal from './common/Modal';
import FileModal from './FileModal';
import AlumnoMesaUpdate from './AlumnoMesaUpdate';
import QRScanner from './QRScanner';
import '../styles/components/QRScanner.css';

const ModalWrapper = ({ modalState, closeModal, handleQRCodeScanned, alumnos, mesa, alumnoInscripto }) => {

  if (!modalState.type) return null;

  return (
    <Modal isOpen={true} onClose={closeModal}>
      {modalState.type === 'qrScanner' && (
        <>
          <QRScanner onQRCodeScanned={handleQRCodeScanned} alumnoInscripto={alumnoInscripto} />      
          <button onClick={closeModal}>Cerrar</button>
        </>      )}
        {modalState.type === 'fileGenerator' && (
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
