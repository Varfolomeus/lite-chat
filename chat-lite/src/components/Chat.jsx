import React from 'react';
import socket from '../socket';

function Chat({ users, messages, user, roomId, onAddMessage }) {
  const [messageValue, setMessageValue] = React.useState('');
  const messagesRef = React.useRef(null);
  const onSendMessage = () => {
    socket.emit('ROOM:NEW_MESSAGE', {
      user,
      roomId,
      text: messageValue,
    });

    onAddMessage({ user, text: messageValue });
    setMessageValue('');
  };

  React.useEffect(() => {
    messagesRef.current.scrollTo(0, 99999);
  }, [messages]);
  // console.log('state', state);
  return (
    <div className="chat">
      <div className="chat-users">
        Chat-room: <b>{roomId}</b>
        <hr />
        <b>Online ({users.length}):</b>
        <ol>
          {users.map((name, index) => (
            <li
              className="message-user"
              style={{
                backgroundColor: name.userColor,
              }}
              key={name.userName + index}
            >
              {name.userName}
            </li>
          ))}
        </ol>
      </div>
      <div className="chat-messages">
        <div ref={messagesRef} className="messages">
          {messages.map((message, i) => (
            <div key={message.user.userName + i} className="message">
              <p style={{ background: message.user.userColor }}>
                {message.text}
              </p>
              <div>
                <span
                  className="message-user"
                  style={{
                    marginLeft: '30px',
                    background: message.user.userColor,
                  }}
                >
                  {message.user.userName}
                </span>
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
