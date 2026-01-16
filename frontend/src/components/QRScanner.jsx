/**
 * QR Scanner Component
 * Handles QR code scanning via webcam using html5-qrcode library
 */

import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export function QRScanner({ onScan, onCancel }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      fps: 10,
      qrbox: 250,
      disableFlip: false
    });

    scanner.render(
      (decodedText) => {
        // Success callback
        onScan(decodedText);
      },
      (error) => {
        // This is normal for scanning attempts
        if (error && !error.toString().includes('NotFoundException')) {
          setError('Camera error or invalid QR code');
        }
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onScan]);

  return (
    <div>
      <div id="reader" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}></div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {onCancel && (
        <button onClick={onCancel} style={{ marginTop: '10px' }}>
          Cancel QR Scanner
        </button>
      )}
    </div>
  );
}
