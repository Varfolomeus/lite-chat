import React from 'react';
import axios from 'axios';

function JoinBlock({ onLogin }) {
  // const randomColor = () => {
  //   let tempColor = '#';
  //   const lettersForColor = [
  //     '0',
  //     '1',
  //     '2',
  //     '3',
  //     '4',
  //     '5',
  //     '6',
  //     '7',
  //     '8',
  //     '9',
  //     'A',
  //     'B',
  //     'C',
  //     'D',
  //     'E',
  //     'F',
  //   ];

  //   for (let i = 0; i < 6; i++) {
  //     tempColor += lettersForColor[Math.floor(Math.random() * 16)];
  //   }
  //   // console.log('tempColor', tempColor);
  //   return tempColor;
  // };
  // const colorbackgTextarea = (color) => {
  //   // console.log(color);
  //   let color1;
  //   if (color.length < 5) {
  //     color1 =
  //       '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
  //   } else {
  //     color1 = color;
  //   }
  //   let triggEr = 160;
  //   let kr = parseInt(color1.slice(1, 3), 16) > triggEr;
  //   let kg = parseInt(color1.slice(3, 5), 16) > triggEr;
  //   let kb = parseInt(color1.slice(5, 7), 16) > triggEr+20;
  //   let averColor = kr + kg + kb
  //   if (averColor > 0) {
  //     color1 = '#000';
  //   } else {
  //     color1 = '#fff';
  //   }
  //   // console.log(
  //   //   'kr ',
  //   //   kr,
  //   //   'kg ',
  //   //   kg,
  //   //   'kb ',
  //   //   kb,
  //   //   'color1',
  //   //   color1,
  //   //   'averColor',
  //   //   averColor,
  //   //   'color1',
  //   //   color1
  //   // );
  //   return color1;
  // };

  
  const [roomId, setRoomId] = React.useState('Main');
  const [userName, setUserName] = React.useState('Ivan');
  const [isLoading, setLoading] = React.useState(false);

  const onEnter = async () => {
    if (!userName || !roomId) {
      return alert('Wrong chat enter data.');
    }
    const {data} = await axios.get('/color');
    const userColor = data.backgroundColor;
    const userTextColor = data.textColor;
    const loginToSocketData = {
      roomId,
      user: { userName, userColor, userTextColor},
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
