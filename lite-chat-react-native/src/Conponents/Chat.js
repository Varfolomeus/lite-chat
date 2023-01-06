import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  FlatList,
} from 'react-native';
import { socket } from './socket';

function Chat({ users, messages, user, roomId, onAddMessage }) {
  const [messageValue, setMessageValue] = React.useState('');
  const messagesRef = React.useRef(null);
  // console.log('user', user);

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
    // console.log('messages', messages);
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
        <Text style={styles.chauUsersItems}>Chat-room:</Text>
        <Text style={styles.chauUsersItemsValues}>{`${roomId}`}</Text>
        <View style={styles.chatUsersDividers} />
        <Text style={styles.chauUsersItems}>Online:</Text>
        <Text style={styles.chauUsersItemsValues}>{`${users.length}`}</Text>
        <View style={styles.chatUsersDividers} />
        <View>
          {users.map((name, index) => (
            <Text
              style={[
                styles.chatUsersNames,
                { backgroundColor: name.userColor, color: name.userTextColor },
              ]}
              key={name.userName + index}
            >
              {name.userName}
            </Text>
          ))}
        </View>
        <View style={styles.chatUsersDividers} />
      </View>
      <View style={styles.messagesWrapper}>
        <View>
          <FlatList
            style={styles.chatMessagesFlatList}
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
                  style={[
                    styles.chatMessagesItemsText,
                    {
                      color: item.user.userTextColor,
                      backgroundColor: item.user.userColor,
                    },
                  ]}
                >
                  {item.text}
                </Text>
                <Text
                  style={[
                    styles.chatMessagesItemsUsers,
                    {
                      color: item.user.userTextColor,
                      backgroundColor: item.user.userColor,
                    },
                  ]}
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
              maxHeight: '100%',
              maxWidth: '100%',
              borderWidth: 1,
              padding: 15,
              // lineHeight: '1.2em',
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
    height: '100%',
    width: '100%',
    position: 'relative',
    // overflow: 'hidden',
  },
  chatUsers: {
    backgroundColor: 'lightgray',
    borderWidth: 1,
    height: 500,
    width: 100,
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
    width: 300,
    height: 500,
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
  chatMessagesFlatList: { maxHeight: 350, maxWidth: '95%', marginTop: 15 },
  chatUsersDividers: {
    maxWidth: '100%',
    maxHeight: 2,
    borderBottomWidth: 2,
    marginBottom: 4,
  },
  chatMessagesItemsText: {
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 3,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingLeft: 15,
    paddingBottom: 5,
    paddingTop: 5,
  },
  chatMessagesItemsUsers: {
    marginLeft: 30,
    marginRight: 70,
    marginBottom: 13,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    paddingBottom: 5,
    paddingTop: 5,
    paddingLeft: 15,
  },
  chauUsersItems: { fontWeight: '700' },
  chauUsersItemsValues: { textAlign: 'right', paddingRight: 15 },
  chatUsersNames: {
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    paddingLeft: 15,
    paddingBottom: 3,
    marginBottom: 4,
  },
  messageUser: {
    borderTopLeftRadius: 10,
    fontSize: 30,
    padding: 5,
  },
});
