import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import '../styles/pages/MesaDetailPage.css';
import '../styles/components/QRScanner.css';
import AlumnosTable from '../components/AlumnosTable';
import ActionButtons from '../components/ActionButtons';
import Modal from '../components/common/Modal';
import FileModal from '../components/FileModal';
import AlumnoMesaUpdate from '../components/AlumnoMesaUpdate';
import { getAlumnos, updateAlumno, createAlumno } from '../services/apiService';

const MesasDetailPage = () => {
  const [alumnos, setAlumnos] = useState([]);
  const location = useLocation();
  const { mesa } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({
    type: null,
    data: null,
  });

  const [decodedScanResult, setDecodedScanResult] = useState('');
  const [scanError, setScanError] = useState('');
  const [isFront, setIsFront] = useState(false);
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const streamRef = useRef(null);

  const openModal = (type, data = null) => setModalState({ type, data });
  const closeModal = () => {
    setModalState({ type: null, data: null });
    fetchAlumnos();
  };

  const fetchAlumnos = async () => {
    try {
      setLoading(true);
      const data = await getAlumnos(mesa.id_mesa);
      setAlumnos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mesa) fetchAlumnos();
  }, [mesa]);

  useEffect(() => {
    const startScanner = async () => {
      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.PDF_417]);

      codeReader.current = new BrowserMultiFormatReader(hints);

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        if (videoDevices.length === 0) {
          setScanError('No se encontró ninguna cámara disponible.');
          return;
        }

        const selectedDeviceId = videoDevices.find(device => 
          (isFront && device.label.includes('front')) || 
          (!isFront && device.label.includes('back'))
        )?.deviceId;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            deviceId: { ideal: selectedDeviceId },
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: isFront ? 'user' : 'environment',
          },
        });

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }

        streamRef.current = stream;
        videoRef.current.srcObject = stream;

        await codeReader.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              const decodedText = result.getText();
              const dataParts = decodedText.split('@'); 
              const datosDiferenciados = {
                nombre_completo : (dataParts[1] || '') + ', ' +(dataParts[2] || ''),
                nro_identidad: dataParts[4] || '',
              };
              setDecodedScanResult(datosDiferenciados);
              setScanError('');
            } else if (err && err.name !== 'NotFoundException') {
              console.error('Decoding error:', err);
              setScanError('Error al decodificar el código.');
            }
          }
        );
      } catch (err) {
        console.error('Error al iniciar el escáner:', err);
        setScanError('Error al acceder a la cámara. Asegúrese de otorgar permisos.');
      }
    };

    if (modalState.type === 'qrScanner') startScanner();

    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [modalState.type, isFront]);

  const toggleCamera = () => {
    setIsFront(!isFront);
  };

  if (!mesa) return <p>No se encontró información de la mesa.</p>;
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="table-container">
      <h1>Alumnos de la Mesa</h1>
      {alumnos.length > 0 ? (
        <AlumnosTable alumnos={alumnos} openModal={openModal} />
      ) : (
        <p>No hay alumnos registrados en esta mesa.</p>
      )}
      <ActionButtons openModal={openModal} />

      {modalState.type === 'qrScanner' && (
        <Modal isOpen={true} onClose={closeModal}>
          <div className="modal-content">
            <h2>Escanear QR</h2>
            <div className="video-container">
              <video ref={videoRef} autoPlay muted playsInline />
            </div>
            <button onClick={toggleCamera}>
              Cambiar a {isFront ? 'Cámara Trasera' : 'Cámara Frontal'}
            </button>
            {decodedScanResult && (
              <div className="result-container">
                <h2>Alumno escaneado:</h2>
                <p>{decodedScanResult.nro_identidad}</p>
              </div>
            )}
            {scanError && (
              <div className="error-container">
                <p>{scanError}</p>
              </div>
            )}
          </div>
          <button onClick={closeModal} className="close-modal-btn">Cerrar</button>
        </Modal>
      )}

      {modalState.type === 'fileGenerator' && (
        <Modal isOpen={true} onClose={closeModal}>
          <div className="modal-content">
            <FileModal alumnos={alumnos} onClose={closeModal} materia={mesa.materia} fecha={mesa.fecha} />
          </div>
        </Modal>
      )}

      {modalState.type === 'AlumnoUpdate' && (
        <Modal isOpen={true} onClose={closeModal}>
          <div className="modal-content">
            <AlumnoMesaUpdate
              onClose={closeModal}
              alumno={modalState.data}
              id_mesa={mesa.id_mesa}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MesasDetailPage;
