const makeWASocket = require('@whiskeysockets/baileys').default
const {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
} = require('@whiskeysockets/baileys')
const P = require('pino')
const qrcode = require('qrcode-terminal')
const express = require('express')
const cors = require('cors')

const PORT = process.env.PORT || 3000
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'
let sockGlobal = null
let isConnecting = false

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
        console.log('\nEscanea este QR con WhatsApp:\n')
        qrcode.generate(qr, { small: true })
      }

      if (connection === 'connecting') {
        console.log('Conectando a WhatsApp...')
      }

      if (connection === 'open') {
        console.log('✅ WhatsApp conectado')
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
      service: 'whatsapp-baileys',
    })
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