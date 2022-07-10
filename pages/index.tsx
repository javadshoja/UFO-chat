import styles from '../styles/Home.module.css'
import { useSockets } from '../context/socket.context'
import RoomsContainer from '../components/Rooms'
import MessagesContainer from '../components/Messages'
import { useRef } from 'react'
import Image from 'next/image'
import Head from 'next/head'

export default function Home() {
  const { socket, username, setUsername } = useSockets()
  const usernameRef = useRef(null)

  function handleSetUsername() {
    const value = usernameRef.current.value
    if (!value) {
      return
    }

    setUsername(value)
  }

  return (
    <div>
      {!username && (
        <>
          <Head>
            <title>UFO Chat</title>
            <meta name="description" content="Chat Application with next.js" />
            <meta name="keywords" content="Web Sockets , Next.js , React" />
          </Head>
          <div className={styles.containerWrapper}>
            <h1 className={styles.heading}>
              <Image src="/192x192.png" alt="Icon" width={62} height={62} />
              UFO Chat
            </h1>
            <div className={styles.usernameInner}>
              <input dir="auto" placeholder="Username" ref={usernameRef} />
              <button className="cta" onClick={handleSetUsername}>
                START
              </button>
            </div>
          </div>
        </>
      )}
      {username && (
        <div className={styles.containerWrapper}>
          <div className={styles.container}>
            <RoomsContainer />
            <MessagesContainer />
          </div>
        </div>
      )}
    </div>
  )
}
