import dotenv from 'dotenv';
import QRCode from 'qrcode';
import axios from 'axios';
dotenv.config();

const QR_API = process.env.QR_API || 'https://api.qrserver.com/v1/create-qr-code/?data=';

export async function generateQrExternal(codeText) {
  
  return `${QR_API}${encodeURIComponent(codeText)}`;
}

export async function generateQrBase64(codeText) {
  
  try {
    const dataUrl = await QRCode.toDataURL(codeText);
    return dataUrl; 
  } catch (err) {
    throw err;
  }
}
