import QRCode from 'qrcode';

export async function generateQRCode(gameId: string): Promise<string> {
  const answerUrl = `${window.location.origin}/answer/${gameId}`;

  try {
    const dataUrl = await QRCode.toDataURL(answerUrl, {
      width: 200,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    return dataUrl;
  } catch (error) {
    console.error('QR Code generation failed:', error);
    throw new Error('Failed to generate QR code');
  }
}
