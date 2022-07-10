import { createContext, useContext, useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'

interface Context {
  socket: Socket
  username?: string
  setUsername: Function
  messages?: { message: string; time: string; username: string }[]
  setMessages: Function
  roomId?: string
  rooms: object
}

const SOCKET_URL = process.env.SOCKET_URL || '/'

const socket = io(SOCKET_URL)

const SocketContext = createContext<Context>({
  socket,
  setUsername: () => false,
  setMessages: () => false,
  rooms: {},
  messages: [],
})

function SocketsProvider(props: any) {
  const [username, setUsername] = useState('')
  const [roomId, setRoomId] = useState('')
  const [rooms, setRooms] = useState({})
  const [messages, setMessages] = useState([])

  useEffect(() => {
    window.onfocus = function () {
      document.title = 'UFO Chat'
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  socket.on('ROOMS', (value) => {
    setRooms(value)
  })

  socket.on('JOINED_ROOM', (value) => {
    setRoomId(value)

    setMessages([])
  })

  useEffect(() => {
    socket.on('ROOM_MESSAGE', ({ message, username, time }) => {
      if (!document.hasFocus()) {
        document.title = 'New message...'
      }

      setMessages((messages) => [...messages, { message, username, time }])
    })
  }, [])

  return (
    <SocketContext.Provider
      value={{
        socket,
        username,
        setUsername,
        rooms,
        roomId,
        messages,
        setMessages,
      }}
      {...props}
    />
  )
}

export const useSockets = () => useContext(SocketContext)

export default SocketsProvider
