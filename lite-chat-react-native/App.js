import React from 'react';
import { StyleSheet, View } from 'react-native';
import axios from 'axios';
import reducer from './src/Conponents/reducer';
import Chat from './src/Conponents/Chat';
import JoinBlock from './src/Conponents/JoinBlock';
import { currentIp, socket } from './src/Conponents/socket';

export default function App() {
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
    const res = await axios.get(
      `${currentIp}/rooms/${loginToSocketData.roomId}`
    );

    dispatch({
      type: 'SET_DATA',
      payload: res.data,
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
  };

  React.useEffect(() => {
    socket.on('ROOM:SET_USERS', setUsers);
    socket.on('ROOM:NEW_MESSAGE', addMessage);
  }, []);

  return (
    <View style={styles.rootstyle}>
      {!state.joined ? (
        <JoinBlock onLogin={onLogin} />
      ) : (
        <Chat {...state} onAddMessage={addMessage} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rootstyle: {
    maxHeight: '100%',
    maxWidth: '100%',
  },
});
