import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const initialMessages = [
  {
    id: 1,
    content: 'Mensagem 1',
    username: 'teste',
  },
  {
    id: 2,
    content: 'Mensagem 2',
    username: 'teste',
  },
]

function App() {
  const [messages, setMessages] = useState(initialMessages)
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const socketUrl = 'http://localhost:3000'
  const socket = useRef(null)
  
  useEffect(() => {
    if (!socket.current) {
      socket.current = io(socketUrl, {
        reconnectionDelayMax: 10000,
      })
    }

    socket.current.on('connect', () => {
      console.log('Socket connected!')
    })
    socket.current.on('chat', (data) => {
      console.log('teste')
      setMessages(prevState => {
        return [
        ...prevState,
        data
      ]})
    })

    return () => {
      socket.current.close()
    }
  }, [])


  function handleSubmit(event) {
    event.preventDefault()
    let newMessage = {
      id: new Date().getTime(),
      content: message,
      username: username,
    }

    socket.current.emit('chat', newMessage)
  }

  return (
    <>
      <div>
        <h3>Username</h3>
        <input
          type="text"
          name='username'
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <h1>Mensagens</h1>
      <div>
        {messages.map(msg => {
          return (
            <div key={msg.id}>
              <strong>{msg.username}</strong> - {msg.content}
            </div>
          )
        })}
        <form
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name='message'
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type='submit'
          >Enviar</button>
        </form>
      </div>
    </>
  );
}

export default App;
