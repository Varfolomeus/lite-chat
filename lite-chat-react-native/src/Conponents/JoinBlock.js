import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { currentIp } from './socket';
import axios from 'axios';

function JoinBlock({ onLogin }) {
  const [roomId, setRoomId] = React.useState('Main');
  const [userName, setUserName] = React.useState('Ivan');
  const [isLoading, setLoading] = React.useState(false);

  const onEnter = async () => {
    if (!userName || !roomId) {
      return alert('Wrong chat enter data.');
    }
    let userColors = await axios.get(`${currentIp}/color`);
    userColors = userColors.data;
    const userColor = userColors.backgroundColor;
    const userTextColor = userColors.textColor;
    const loginToSocketData = {
      roomId,
      user: { userName, userColor, userTextColor },
    };

    setLoading(true);
    await axios.post(`${currentIp}/rooms`, loginToSocketData);
    onLogin(loginToSocketData);
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputs}
        placeholder="Room ID"
        value={roomId}
        onChangeText={setRoomId}
      />
      <TextInput
        style={styles.inputs}
        placeholder="UserName"
        value={userName}
        onChangeText={setUserName}
      />
      <TouchableOpacity
        disabled={isLoading}
        activeOpacity={0.7}
        onPress={onEnter}
        style={styles.button}
      >
        <Text style={styles.text}>
          {isLoading ? "You're Entered" : 'Enter chat'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
export default JoinBlock;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    maxWidth: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#44768f',
    paddingTop: 40,
    paddingBottom: 40,
  },
  inputs: {
    color: '#000',
    backgroundColor: '#fff',
    marginBottom: 5,
    borderColor: '#33f',
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 15,
    height: 45,
    width: '60%',
    fontSize: 18,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  button: {
    color: '#fff',
    borderRadius: 15,
    width: '40%',
    height: 50,
    textTransform: 'uppercase',
    backgroundColor: '#112c60',
    marginBottom: 5,
    justifyContent: 'center',
    fontSize: 18,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  text: { color: '#fff', fontWeight: '700', textAlign: 'center' },
});
