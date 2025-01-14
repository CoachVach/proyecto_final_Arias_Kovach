import React, { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import '../styles/QRScanner.css';

const QRScanner = ({onQRCodeScanned}) => {
  const [decodedScanResult, setDecodedScanResult] = useState('');
  const [error, setError] = useState('');
  const [isFront, setIsFront] = useState(false); // Estado para controlar la cámara
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const streamRef = useRef(null);
  const handleScan = (data) => {
    if (data) {
        onQRCodeScanned(data); // Notificar a MesasDetailPage con el código escaneado
    }
  };

  useEffect(() => {
    const startScanner = async () => {
      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.PDF_417]);

      codeReader.current = new BrowserMultiFormatReader(hints);

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        if (videoDevices.length === 0) {
          setError('No se encontró ninguna cámara disponible.');
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
              }
              setDecodedScanResult(datosDiferenciados.dni);
              handleScan(datosDiferenciados);
              setError('');
            } else if (err && err.name !== 'NotFoundException') {
              console.error('Decoding error:', err);
              setError('Error al decodificar el código.');
            }
          }
        );
      } catch (err) {
        console.error('Error al iniciar el escáner:', err);
        setError('Error al acceder a la cámara. Asegúrese de otorgar permisos.');
      }
    };

    startScanner();

    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isFront]);

  const toggleCamera = () => {
    setIsFront(!isFront);
  };

  return (
    <div className="container">
      <h1 className="title">Escáner de QR / PDF417</h1>

      <div className="video-container">
        <video ref={videoRef} autoPlay muted playsInline />
      </div>

      <button onClick={toggleCamera}>
        Cambiar a {isFront ? 'Cámara Trasera' : 'Cámara Frontal'}
      </button>

      {decodedScanResult && (
        <div className="result-container">
          <h2>Resultado Escaneado:</h2>
          <p>{decodedScanResult}</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
