import React, { useEffect, useState } from "react";
import Modal from './common/Modal';
import FileModal from './FileModal';
import AlumnoMesaUpdate from './alumnoMesaUpdate';
import QRScanner from './QRScanner';
import '../styles/components/QRScanner.css';

const ModalWrapper = ({ modalState, closeModal, handleQRCodeScanned, alumnos, mesa, alumnoInscripto }) => {
  const [scannerActive, setScannerActive] = useState(false);

  useEffect(() => {
    if (modalState.type === "qrScanner") {
      setScannerActive(true);
    } else {
      setScannerActive(false);
    }
  }, [modalState.type]);

  if (!modalState.type) return null;

  return (
    <Modal isOpen={true}>
      {modalState.type === 'qrScanner' && scannerActive && (
        <>
          <QRScanner onQRCodeScanned={handleQRCodeScanned} alumnoInscripto={alumnoInscripto} />      
          <button onClick={() => {
              setScannerActive(false);
              closeModal();
            }}>Cerrar
          </button>
        </>      
      )}
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
