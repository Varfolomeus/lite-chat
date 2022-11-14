import React from 'react';
import socket from '../socket';

function Chat({ users, messages, userName, roomId, onAddMessage }) {
  const [messageValue, setMessageValue] = React.useState('');
  const messagesRef = React.useRef(null);

  const onSendMessage = () => {
    socket.emit('ROOM:NEW_MESSAGE', {
      userName,
      roomId,
      text: messageValue,
    });

    onAddMessage({ userName, text: messageValue });
    setMessageValue('');
  };

  React.useEffect(() => {
    messagesRef.current.scrollTo(0, 99999);
  }, [messages]);
  // console.log(users);
  return (
    <div className="chat">
      <div className="chat-users">
        Chat-room: <b>{roomId}</b>
        <hr />
        <b>Online ({users.length}):</b>
        <ol>
          {users.map((name, index) => (
            <li key={name + index}>{name}</li>
          ))}
        </ol>
      </div>
      <div className="chat-messages">
        <div ref={messagesRef} className="messages">
          {messages.map((message) => (
            <div className="message">
              <p>{message.text}</p>
              <div>
                <span>{message.userName}</span>
              </div>
            </div>
          ))}
        </div>
        <form>
          <textarea
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
            className="form-control"
            rows="3"
          ></textarea>
          <button
            onClick={onSendMessage}
            type="button"
            className="btn btn-primary"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
