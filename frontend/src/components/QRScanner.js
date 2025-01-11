import React, { useState, useEffect, useRef } from 'react'; 
import { BrowserMultiFormatReader , BarcodeFormat, DecodeHintType } from '@zxing/library';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const [error, setError] = useState('');
  const [isFront, setIsFront] = useState(false); // Estado para controlar la cámara
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const streamRef = useRef(null); // Para guardar el stream de la cámara y detenerlo cuando cambiamos

  useEffect(() => {
    const startScanner = async () => {
      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.PDF_417, BarcodeFormat.QR_CODE]);

      codeReader.current = new BrowserMultiFormatReader (hints);

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
        )?.deviceId; // Busca la cámara frontal o trasera según el estado
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            deviceId: { ideal: selectedDeviceId },
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: isFront ? 'user' : 'environment', // Según la cámara seleccionada
          },
        });
        

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop()); // Detener el stream anterior
        }

        streamRef.current = stream;
        videoRef.current.srcObject = stream;

        await codeReader.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              setScanResult(result.getText());
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
        streamRef.current.getTracks().forEach(track => track.stop()); // Detener el stream al desmontar
      }
    };
  }, [isFront]); // Dependencia en isFront para reiniciar el escáner cuando se cambia de cámara

  const toggleCamera = () => {
    setIsFront(!isFront); // Cambiar el estado de la cámara
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Escáner de QR / PDF417</h1>

      <div style={styles.videoContainer}>
        <video ref={videoRef} style={styles.video} autoPlay muted playsInline />
      </div>

      <button onClick={toggleCamera} style={styles.button}>
        Cambiar a {isFront ? 'Cámara Trasera' : 'Cámara Frontal'}
      </button>

      {scanResult && (
        <div style={styles.resultContainer}>
          <h2>Resultado Escaneado:</h2>
          <p style={styles.resultText}>{scanResult}</p>
        </div>
      )}

      {error && (
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>{error}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  videoContainer: {
    display: 'inline-block',
    width: '100%',
    maxWidth: '500px',
    border: '2px solid #ddd',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  video: {
    width: '100%',
    height: 'auto',
  },
  button: {
    marginTop: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '5px',
  },
  resultContainer: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #4caf50',
    borderRadius: '5px',
    backgroundColor: '#e8f5e9',
  },
  resultText: {
    color: '#388e3c',
    fontWeight: 'bold',
  },
  errorContainer: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #f44336',
    borderRadius: '5px',
    backgroundColor: '#ffebee',
  },
  errorText: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
};

export default QRScanner;
