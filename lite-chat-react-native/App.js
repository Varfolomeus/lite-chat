import React from 'react';
import reducer from './src/components/reducer';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, View, FlatList } from 'react-native';
import JoinBlock from './src/components/JoinBlock';
import Chat from './src/components/Chat';
import axios from 'axios';
import socket from './src/components/socket';

function App() {
  const [state, dispatch] = React.useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
  });

  const onLogin = async (loginToSocketData) => {
    // console.log('loginToSocketData', loginToSocketData);
    dispatch({
      type: 'JOINED',
      payload: loginToSocketData,
    });
    socket.emit('ROOM:JOIN', loginToSocketData);
    const { data } = await axios.get(
      `http://192.168.42.30:3001/rooms/${loginToSocketData.roomId}`
    );
    // console.log('data', data);
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
    // console.log(message);
  };

  React.useEffect(() => {
    socket.on('ROOM:SET_USERS', setUsers);
    socket.on('ROOM:NEW_MESSAGE', addMessage);
  }, []);

  // window.socket = socket;
  // console.log(state.users);
  return (
    <View style={styles.rootstyle}>
      {!state.joined ? (
        <JoinBlock onLogin={onLogin} />
      ) : (
        <Chat {...state} onAddMessage={addMessage} />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

export default App;

const styles = StyleSheet.create({

  rootstyle: {
    height: 500,
    maxWidth: 700,
  },

});
