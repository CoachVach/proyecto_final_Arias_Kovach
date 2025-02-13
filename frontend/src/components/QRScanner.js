import React, { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import '../styles/components/QRScanner.css';

const QRScanner = ({ onQRCodeScanned, alumnoInscripto }) => {
  const [error, setError] = useState('');
  const [isFront, setIsFront] = useState(false);
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const streamRef = useRef(null);

  const handleScan = (data) => {
    if (data) {
      onQRCodeScanned(data);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      if (!videoRef.current) return;

      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.PDF_417]);

      // Evita inicializar el escáner si ya existe uno activo
      if (codeReader.current) {
        console.log('El escáner ya está activo.');
        return;
      }

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
            deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
            width: { min: 640, ideal: 1920, max: 2560 },
            height: { min: 480, ideal: 1080, max: 1440 },
            facingMode: isFront ? 'user' : 'environment',
            advanced: [{ focusMode: "continuous" }]
          },
        });

        if (!isMounted) return;

        // Solo asignamos el stream si aún no está activo
        if (!streamRef.current) {
          streamRef.current = stream;
          videoRef.current.srcObject = stream;
        }

        await codeReader.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err) => {
            if (!isMounted) return;

            if (result) {
              const decodedText = result.getText();
              const dataParts = decodedText.split('@');
              const datosDiferenciados = {
                nombre_completo: (dataParts[1] || '') + ', ' + (dataParts[2] || ''),
                nro_identidad: dataParts[4] || '',
              };
              onQRCodeScanned(datosDiferenciados);
              setError('');
            } else if (err && !err.message.includes('No MultiFormat Readers were able to detect the code.')) {
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
      isMounted = false;
      if (codeReader.current) {
        codeReader.current.reset();
        codeReader.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isFront]);

  const toggleCamera = () => {
    setIsFront(prev => !prev);
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

      {alumnoInscripto && (
        <div className={`${alumnoInscripto.inscripto ? 'result-container' : 'error-container'}`}>
          <h2>{alumnoInscripto.message}</h2>
          <p>{alumnoInscripto.nombre_completo}</p>
          <p>DNI: {alumnoInscripto.nro_identidad}</p>
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