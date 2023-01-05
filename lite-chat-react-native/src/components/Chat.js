import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  FlatList,
} from 'react-native';
import socket from './socket';

function Chat({ users, messages, user, roomId, onAddMessage }) {
  const [messageValue, setMessageValue] = React.useState('');
  const messagesRef = React.useRef(null);
  const onSendMessage = () => {
    // console.log('user', user);
    socket.emit('ROOM:NEW_MESSAGE', {
      user,
      roomId,
      text: messageValue,
    });
    // console.log('user', user);
    onAddMessage({ user, text: messageValue });
    setMessageValue('');
  };

  React.useEffect(() => {
    // console.log('user', user);
    if (messages.length > 5) {
      messagesRef.current.scrollToIndex({
        animated: true,
        index: messages.length - 1,
      });
    }
  }, [messages]);
  return (
    <View style={styles.chat}>
      <View style={styles.chatUsers}>
        <Text style={{ fontWeight: 700 }}>{`Chat-room: `}</Text>
        <Text>{`${roomId}`}</Text>
        <View style={{ width: '100%', height: 2, borderBottomWidth: 2 }} />
        <Text style={{ fontWeight: 700 }}>{`Online: `}</Text>
        <Text>{`${users.length}`}</Text>
        <View style={{ width: '100%', height: 2, borderBottomWidth: 2, marginBottom:4 }} />
        <View>
          {users.map((name, index) => (
            <Text
              style={{
                backgroundColor: name.userColor,
                color: name.userTextColor,
                borderTopRightRadius: 15,
                borderBottomLeftRadius: 15,
                paddingLeft: 15,
                paddingBottom: 3,
                marginBottom: 4,
              }}
              key={name.userName + index}
            >
              {name.userName}
            </Text>
          ))}
        </View>
        <View style={{ width: '100%', height: 2, borderBottomWidth: 2 }} />
      </View>
      <View style={styles.messagesWrapper}>
        <View>
          <FlatList
            style={{ height: 350, width: '95%', marginTop: 15 }}
            initialScrollIndex={0}
            onScrollToIndexFailed={(info) => {
              const wait = new Promise((resolve) => setTimeout(resolve, 500));
              wait.then(() => {
                messagesRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                });
              });
            }}
            ref={messagesRef}
            data={messages}
            keyExtractor={(item, i) => item.user.userName + i}
            renderItem={({ item }) => (
              <View>
                <Text
                  style={{
                    marginLeft: 30,
                    marginRight: 30,
                    marginBottom: 3,
                    borderTopLeftRadius: 15,
                    borderBottomRightRadius: 15,
                    paddingLeft: 15,
                    paddingBottom: 5,
                    paddingTop: 5,
                    color: item.user.userTextColor,
                    backgroundColor: item.user.userColor,
                  }}
                >
                  {item.text}
                </Text>
                <Text
                  style={{
                    marginLeft: 30,
                    marginRight: 70,
                    marginBottom: 13,
                    borderTopRightRadius: 15,
                    borderBottomLeftRadius: 15,
                    paddingBottom: 5,
                    paddingTop: 5,
                    paddingLeft: 15,
                    color: item.user.userTextColor,
                    background: item.user.userColor,
                  }}
                >
                  {item.user.userName}
                </Text>
              </View>
            )}
          />
        </View>
        <View>
          <TextInput
            multiline={true}
            numberOfLines={3}
            style={{
              color: user.userTextColor,
              backgroundColor: user.userColor,
              height: '100%',
              width: '100%',
              borderWidth: 1,
              padding: 15,
              lineHeight: '1.2em',
            }}
            value={messageValue}
            onChangeText={setMessageValue}
          />
          <Button onPress={onSendMessage} title={'Send'} />
        </View>
      </View>
    </View>
  );
}

export default Chat;
const styles = StyleSheet.create({
  chat: {
    flex: 1,
    flexDirection: 'row',
    width: 500,
    // overflow: 'hidden',
  },
  chatUsers: {
    backgroundColor: 'lightgray',
    borderWidth: 1,
    borderColor: '#000',
    paddingLeft: 5,
    paddingRight: 15,
    paddingTop: 15,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
  },
  messagesWrapper: {
    borderColor: '#000',
    borderWidth: 1,
    width: '100%',
    height: '100%',
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  chatMessages: {
    backgroundColor: 'lightgray',
    borderWidth: 1,
    borderColor: '#000',
    paddingLeft: 5,
    paddingRight: 15,
    paddingTop: 15,
  },
  messageUser: {
    borderTopLeftRadius: 10,
    fontSize: 30,
    padding: 5,
  },
});
