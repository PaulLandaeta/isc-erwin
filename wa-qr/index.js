const makeWASocket = require('@whiskeysockets/baileys').default
const {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
} = require('@whiskeysockets/baileys')
const P = require('pino')
const qrcodeTerminal = require('qrcode-terminal')
const QRCode = require('qrcode')
const express = require('express')
const cors = require('cors')

const PORT = process.env.PORT || 3000
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'
let sockGlobal = null
let isConnecting = false
let currentQR = null

async function startBot() {
  if (isConnecting) return
  isConnecting = true

  try {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info')
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
      version,
      auth: state,
      logger: P({ level: 'silent' }),
      printQRInTerminal: false,
      browser: ['MacOS', 'Chrome', '120.0.0'],
    })

    sockGlobal = sock

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
      if (qr) {
        currentQR = qr
        console.log('\nEscanea este QR con WhatsApp:\n')
        qrcodeTerminal.generate(qr, { small: true })
        console.log(`\n👉 O ábrelo en el navegador: /qr\n`)
      }

      if (connection === 'connecting') {
        console.log('Conectando a WhatsApp...')
      }

      if (connection === 'open') {
        console.log('✅ WhatsApp conectado')
        currentQR = null
        isConnecting = false
      }

      if (connection === 'close') {
        const statusCode =
          lastDisconnect?.error?.output?.statusCode ||
          lastDisconnect?.error?.output?.payload?.statusCode

        const shouldReconnect = statusCode !== DisconnectReason.loggedOut

        console.log('⚠️ Conexión cerrada. Código:', statusCode)

        sockGlobal = null
        isConnecting = false

        if (shouldReconnect) {
          console.log('🔄 Reconectando en 3 segundos...')
          setTimeout(() => {
            startBot().catch((err) => {
              console.error('❌ Error al reconectar:', err)
            })
          }, 3000)
        } else {
          console.log('❌ Sesión cerrada. Borra auth_info y vuelve a escanear el QR.')
        }
      }
    })
  } catch (error) {
    isConnecting = false
    console.error('❌ Error iniciando WhatsApp:', error)
  }
}

function startHttpServer() {
  const app = express()
  app.use(cors({ origin: ALLOWED_ORIGIN }))
  app.use(express.json({ limit: '10mb' }))

  app.get('/health', (req, res) => {
    res.json({
      ok: true,
      whatsappConnected: !!sockGlobal,
      hasQR: !!currentQR,
      service: 'whatsapp-baileys',
    })
  })

  app.get('/qr', async (req, res) => {
    if (!currentQR) {
      if (sockGlobal) {
        return res.status(200).send('✅ WhatsApp ya está conectado, no hay QR pendiente.')
      }
      return res.status(404).send('No hay QR disponible todavía. Refresca en unos segundos.')
    }
    try {
      const png = await QRCode.toBuffer(currentQR, { width: 400, margin: 2 })
      res.type('png').send(png)
    } catch (err) {
      res.status(500).send('Error generando QR: ' + err.message)
    }
  })

  app.get('/', (req, res) => {
    const connected = !!sockGlobal
    const hasQr = !!currentQR
    res.type('html').send(`<!doctype html>
<html><head><meta charset="utf-8"><title>WA QR</title>
<meta http-equiv="refresh" content="5">
<style>body{font-family:system-ui;text-align:center;padding:40px;background:#111;color:#eee}
img{border:8px solid #fff;border-radius:8px}
.ok{color:#25D366;font-size:22px}</style></head><body>
<h1>WhatsApp Baileys</h1>
${connected ? '<p class="ok">✅ Conectado</p>' : hasQr ? '<p>Escanea con WhatsApp:</p><img src="/qr" width="400" height="400"/>' : '<p>Esperando QR... (se refresca cada 5s)</p>'}
</body></html>`)
  })

  app.post('/send', async (req, res) => {
    try {
      const { numero, mensaje, pdf_url, filename } = req.body

      if (!numero) {
        return res.status(400).json({
          ok: false,
          error: 'Debes enviar el campo: numero',
        })
      }

      if (!sockGlobal) {
        return res.status(503).json({
          ok: false,
          error: 'WhatsApp no está conectado',
        })
      }

      const cleanNumber = String(numero).replace(/\D/g, '')

      if (!cleanNumber) {
        return res.status(400).json({
          ok: false,
          error: 'Número inválido',
        })
      }

      const jid = `${cleanNumber}@s.whatsapp.net`

      // Enviar PDF
      if (pdf_url) {
        await sockGlobal.sendMessage(jid, {
          document: { url: String(pdf_url) },
          mimetype: 'application/pdf',
          fileName: filename || 'archivo.pdf',
          caption: mensaje || '',
        })

        return res.json({
          ok: true,
          jid,
          tipo: 'pdf',
          mensaje: 'PDF enviado correctamente',
        })
      }

      // Enviar texto normal
      if (!mensaje) {
        return res.status(400).json({
          ok: false,
          error: 'Debes enviar mensaje si no mandas pdf_url',
        })
      }

      await sockGlobal.sendMessage(jid, {
        text: String(mensaje),
      })

      return res.json({
        ok: true,
        jid,
        tipo: 'texto',
        mensaje: 'Mensaje enviado correctamente',
      })
    } catch (error) {
      console.error('❌ Error enviando mensaje:', error)

      return res.status(500).json({
        ok: false,
        error: error.message || 'Error interno al enviar mensaje',
      })
    }
  })

  app.listen(PORT, () => {
    console.log(`🚀 API local lista en http://localhost:${PORT}`)
    console.log(`➡️ POST http://localhost:${PORT}/send`)
    console.log(`➡️ GET  http://localhost:${PORT}/health`)
  })
}

startHttpServer()
startBot().catch((err) => {
  console.error('❌ Error general:', err)
})