import React from 'react';
import reducer from './reducer';
import JoinBlock from './components/JoinBlock';
import Chat from './components/Chat';
import axios from 'axios';
import socket from './socket';

function App() {
  const [state, dispatch] = React.useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
  });

  const onLogin = async (loginToSocketData) => {
    dispatch({
      type: 'JOINED',
      payload: loginToSocketData,
    });
    socket.emit('ROOM:JOIN', loginToSocketData);
    const { data } = await axios.get(`/rooms/${loginToSocketData.roomId}`);
    dispatch({
      type: 'SET_DATA',
      payload: data,
    });
  };
  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users,
    });
  };

  const addMessage = (message) => {
    dispatch({
      type: 'NEW_MESSAGE',
      payload: message,
    });
    console.log(message);
  };

  React.useEffect(() => {
    socket.on('ROOM:SET_USERS', setUsers);
    socket.on('ROOM:NEW_MESSAGE', addMessage);
  }, []);

  // window.socket = socket;
  // console.log(state.users);
  return (
    <div className="wrapper">
      {!state.joined ? (
        <JoinBlock onLogin={onLogin} />
      ) : (
        <Chat {...state} onAddMessage={addMessage} />
      )}
    </div>
  );
}

export default App;
