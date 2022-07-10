import express, { Express } from 'express'
import * as http from 'http'
import next, { NextApiHandler } from 'next'
import { Server } from 'socket.io'
import cors from 'cors'
import socket from './socket'

const PORT: number = parseInt(process.env.PORT || '3000', 10)

const dev: boolean = process.env.NODE_ENV !== 'production'

const nextApp = next({ dev })

const nextHandler: NextApiHandler = nextApp.getRequestHandler()

nextApp.prepare().then(async () => {
  const app: Express = express()

  const server: http.Server = http.createServer(app)

  const io: Server = new Server(server, {
    cors: {
      origin: process.env.ENDPOINT || '/',
      methods: ['GET', 'POST'],
    },
  })

  app.use(cors())

  app.all('*', (req: any, res: any) => nextHandler(req, res))

  server.listen(PORT, () => {
    console.log(`🚀  Server running on http://localhost:${PORT}`)

    socket({ io })
  })
})
