import React from 'react';
import socket from '../socket';
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
    const loginToSocketData = {
      roomId,
      user: { userName, userColor },
    };
    setLoading(true);
    await axios.post('/rooms', loginToSocketData);
    onLogin(loginToSocketData);
  };

  return (
    <div className="join-block">
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <input
        type="text"
        placeholder="UserName"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button
        disabled={isLoading}
        onClick={onEnter}
        className="btn btn-success"
      >
        {isLoading ? "You're Entered" : 'Enter chat'}
      </button>
    </div>
  );
}
export default JoinBlock;
