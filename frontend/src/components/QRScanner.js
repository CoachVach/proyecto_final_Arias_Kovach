import React, { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import '../styles/components/QRScanner.css';

const QRScanner = ({ onQRCodeScanned, alumnoInscripto }) => {
  const [error, setError] = useState('');
  const [isFront, setIsFront] = useState(false);
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      // Verificamos si el elemento de video está disponible
      if (!videoRef.current) return;

      // Configuramos los formatos de código de barras a escanear
      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.PDF_417]);

      // Evitamos reiniciar el escáner si ya hay uno activo
      if (codeReader.current) {
        console.log('El escáner ya está activo.');
        return;
      }

      // Se crea un nuevo lector de códigos de barras
      codeReader.current = new BrowserMultiFormatReader(hints);

      try {
        // Buscamos y filtramos los dispositivos disponibles quedándonos solo las cámaras
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        // Vemos si hay al menos una cámara disponible
        if (videoDevices.length === 0) {
          setError('No se encontró ninguna cámara disponible.');
          return;
        }

        // Seleccionamos el dispositivo de cámara adecuado según la cámara frontal o trasera
        const selectedDeviceId = videoDevices.find(device =>
          (isFront && device.label.includes('front')) ||
          (!isFront && device.label.includes('back'))
        )?.deviceId;

        // Solicitamos acceso a la cámara seleccionada
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
            width: { min: 640, ideal: 1920, max: 2560 },
            height: { min: 480, ideal: 1080, max: 1440 },
            facingMode: isFront ? 'user' : 'environment',
            advanced: [{ focusMode: "continuous" }]
          },
        });

        // Vemos si el componente aún está montado
        if (!isMounted) return;

        // Se asigna el stream de video solo si no hay uno activo
        if (!streamRef.current) {
          streamRef.current = stream;
          videoRef.current.srcObject = stream;
        }

        // El escáner de códigos de barras se activaa
        await codeReader.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err) => {
            // Verificar si el componente aún está montado
            if (!isMounted) return;

            // Manejo de resultados
            if (result) {
              //Decodificamos el resultado
              const decodedText = result.getText();
              const dataParts = decodedText.split('@');
              const datosDiferenciados = {
                nombre_completo: (dataParts[1] || '') + ', ' + (dataParts[2] || ''),
                nro_identidad: dataParts[4] || '',
              };
              // Notificar el código QR escaneado
              onQRCodeScanned(datosDiferenciados);
              setError('');
            } else if (err && !err.message.includes('No MultiFormat Readers were able to detect the code.')) {
              console.error('Error al decodificar el código:', err);
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