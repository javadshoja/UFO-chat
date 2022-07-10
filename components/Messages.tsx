import { useEffect, useRef } from 'react'
import { useSockets } from '../context/socket.context'
import styles from '../styles/Messages.module.css'
import moment from 'moment'

function MessagesContainer() {
  const { socket, messages, roomId, username, setMessages } = useSockets()
  const newMessageRef = useRef(null)
  const messageEndRef = useRef(null)

  function handleSendMessage() {
    const message = newMessageRef.current.value

    if (!String(message).trim()) {
      return
    }

    socket.emit('SEND_ROOM_MESSAGE', { roomId, message, username })

    const date = new Date()

    setMessages([
      ...messages,
      {
        username: 'You',
        message,
        time: moment().format('LT'),
      },
    ])

    newMessageRef.current.value = ''
  }

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!roomId) {
    return <div />
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.messageList}>
        {messages.map(({ message, username, time }, index) => {
          return (
            <div key={index} className={styles.message}>
              <div key={index} className={styles.messageInner}>
                <span className={styles.messageSender}>
                  {username} - {time}
                </span>
                <span dir="auto" className={styles.messageBody}>
                  {message}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={messageEndRef} />
      </div>
      <div className={styles.messageBox}>
        <textarea dir="auto" rows={1} ref={newMessageRef} />
        <button onClick={handleSendMessage}>SEND</button>
      </div>
    </div>
  )
}

export default MessagesContainer
