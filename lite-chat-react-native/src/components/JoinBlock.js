import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import socket from './socket';
import axios from 'axios';

function JoinBlock({ onLogin }) {
  const randomColor = () => {
    let tempColor = '#';
    const lettersForColor = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
    ];

    for (let i = 0; i < 6; i++) {
      tempColor += lettersForColor[Math.floor(Math.random() * 16)];
    }
    // console.log('tempColor', tempColor);
    return tempColor;
  };
  const [roomId, setRoomId] = React.useState('Main');
  const [userName, setUserName] = React.useState('Ivan');
  const [isLoading, setLoading] = React.useState(false);

  const onEnter = async () => {
    if (!userName || !roomId) {
      return alert('Wrong chat enter data.');
    }
    const userColor = randomColor();
    const userTextColor = colorbackgTextarea(userColor)
    const loginToSocketData = {
      roomId,
      user: { userName, userColor, userTextColor },
    };
    setLoading(true);
    await axios.post('http://192.168.42.30:3001/rooms', loginToSocketData);
    onLogin(loginToSocketData);
  };

  const colorbackgTextarea = (color) => {
    // console.log(color);
    let color1;
    if (color.length < 5) {
      color1 =
        '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    } else {
      color1 = color;
    }
    let triggEr = 160;
    let kr = parseInt(color1.slice(1, 3), 16) > triggEr;
    let kg = parseInt(color1.slice(3, 5), 16) > triggEr;
    let kb = parseInt(color1.slice(5, 7), 16) > triggEr+20;
    let averColor = kr + kg + kb
    if (averColor > 0) {
      color1 = '#000';
    } else {
      color1 = '#fff';
    }
    // console.log(
    //   'kr ',
    //   kr,
    //   'kg ',
    //   kg,
    //   'kb ',
    //   kb,
    //   'color1',
    //   color1,
    //   'averColor',
    //   averColor,
    //   'color1',
    //   color1
    // );
    return color1;
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
    // flex: 1,
    height: '100%',
    maxWidth: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#555',
  },
  inputs: {
    color: '#000',
    backgroundColor: '#fff',
    marginBottom: 5,
    borderColor: '#33f',
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 15,
    width: '60%',
    fontSize: 18,
    lineHeight: '1.2em',
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  button: {
    color: '#fff',
    borderRadius: 15,
    width: '40%',
    textTransform: 'uppercase',
    backgroundColor: '#55f',
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 18,
    lineHeight: '1.2em',
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  text: { color: '#fff', fontWeight: 700 },
});
