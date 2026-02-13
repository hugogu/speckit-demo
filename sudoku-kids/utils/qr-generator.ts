import QRCode from 'qrcode'

export async function generateQRCode(gameId: string): Promise<string> {
  const url = `${window.location.origin}/answer/${gameId}`
  return await QRCode.toDataURL(url, {
    width: 200,
    margin: 1,
    errorCorrectionLevel: 'H'
  })
}
