import { useRef } from 'react'
import { useSockets } from '../context/socket.context'
import styles from '../styles/Room.module.css'

function RoomsContainer() {
  const { socket, roomId, rooms } = useSockets()
  const newRoomRef = useRef(null)

  function handleCreateRoom() {
    //get the room name
    const roomName = newRoomRef.current.value || ''

    if (!String(roomName).trim()) return

    // emit room created event
    socket.emit('CREATE_ROOM', { roomName })

    // set room name input to empty string
    newRoomRef.current.value = ''
  }

  function handleJoinRoom(key) {
    if (key === roomId) return

    socket.emit('JOIN_ROOM', key)
  }

  return (
    <nav className={styles.wrapper}>
      <div className={styles.createRoomWrapper}>
        <input ref={newRoomRef} placeholder="Room name" dir="auto" />
        <button className="cta" onClick={handleCreateRoom}>
          CREATE ROOM
        </button>
      </div>

      <ul className={styles.roomList}>
        {Object.keys(rooms).map((key) => {
          return (
            <div dir="auto" key={key}>
              <button
                disabled={key === roomId}
                title={`Join ${rooms[key].name}`}
                onClick={() => handleJoinRoom(key)}
              >
                {rooms[key].name}
              </button>
            </div>
          )
        })}
      </ul>
    </nav>
  )
}

export default RoomsContainer
