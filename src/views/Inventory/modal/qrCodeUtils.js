import QRCode from 'qrcode'

// Default logo URL (you can replace this with the actual path to your default logo)
const defaultLogoUrl = '../../../assets/images/logo/denr_logo.png';

export async function generateQRCodeWithLogo(text, logoUrl = defaultLogoUrl) {
  const qrCanvas = document.createElement('canvas')
  await QRCode.toCanvas(qrCanvas, text, {
    width: 400,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'H'
  })

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = qrCanvas.width
  canvas.height = qrCanvas.height

  ctx.drawImage(qrCanvas, 0, 0)

  return new Promise((resolve, reject) => {
    const logo = new Image()
    logo.onload = () => {
      const logoSize = qrCanvas.width * 0.25
      const logoX = (qrCanvas.width - logoSize) / 2
      const logoY = (qrCanvas.height - logoSize) / 2

      ctx.save()
      ctx.beginPath()
      ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(logoX, logoY, logoSize, logoSize)

      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize)
      ctx.restore()

      resolve(canvas.toDataURL('image/png'))
    }
    logo.onerror = reject
    logo.src = logoUrl
  })
}

export function formatQRCodeText(baseNumber, increment) {
  const formattedBase = String(baseNumber).padStart(2, '0')
  const formattedIncrement = String(increment).padStart(5, '0')
  return `4AICT-${formattedBase}-${formattedIncrement}`
}
