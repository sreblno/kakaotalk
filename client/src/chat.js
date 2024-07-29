import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './chat.css';

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const nickname = location.state?.nickname || '익명';
  const [chats, setChats] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [numUsers, setNumUsers] = useState(0);
  const [userList, setUserList] = useState([]);
  const chatEndRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);

    newSocket.emit('add user', nickname);

    newSocket.on('login', (data) => {
      setIsConnected(true);
      setNumUsers(data.numUsers);
    });

    newSocket.on('user joined', (data) => {
      setNumUsers((prevNumUsers) => prevNumUsers + 1);
      addChatMessage({ nickname: 'System', message: `${data.username}님이 들어왔습니다.`, type: 'system-message' });
    });

    newSocket.on('user left', (data) => {
      setNumUsers((prevNumUsers) => prevNumUsers - 1);
      addChatMessage({ nickname: 'System', message: `${data.username}님이 나갔습니다.`, type: 'system-message' });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('new message', (data) => {
      addChatMessage({ nickname: data.username, message: data.message, type: data.username === nickname ? 'my-message' : 'other-message' });
    });

    newSocket.on('user list', (users) => {
      setUserList(users);
    });

    return () => {
      newSocket.off('login');
      newSocket.off('user joined');
      newSocket.off('user left');
      newSocket.off('disconnect');
      newSocket.off('new message');
      newSocket.off('user list');
      newSocket.close();
    };
  }, [nickname]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  useEffect(() => {
    messageInputRef.current?.focus();
  }, []);

  const addChatMessage = (chat) => {
    setChats((prevChats) => [...prevChats, chat]);
  };

  const sendMessage = () => {
    if (message && socket) {
      addChatMessage({ nickname, message, type: 'my-message' });
      socket.emit('new message', message);
      setMessage('');
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="Chat">
      <div className="Chat-header">
        <div className='topContainer'>
          <img src="/image/profile.png" alt="profile" className="top_profile" />
          <div className='chatname'>그룹채팅방</div>
          <img src="/image/person.png" alt="person" className="top_person" />
          <div className='topnum'>{numUsers}</div>
          <img src="/image/setting.png" alt="setting" className="top_setting" />
          <img src="/image/top.png" alt="top" className="top" />
          <img src="/image/x.png" alt="x" className="top_x" onClick={handleLogout} />
        </div>
        <div className="scrollBlind">
          <ul className="message">
            {chats.map((chat, index) => (
              <div
                key={index}
                className={`name ${chat.type}`}>
                {chat.type === 'other-message' && (
                  <img src="/image/profile.png" alt="profile" className="profile" />
                )}
                {chat.type !== 'my-message' && <div className='nick'>{chat.nickname}</div>}
                <div className='message-content'>{chat.message}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </ul>
        </div>
        <div className="inputContainer">
          <textarea
            ref={messageInputRef}
            onChange={handleChange}
            value={message}
            className="inputMessage"
            onKeyPress={handleKeyPress}
          />
          <div className='bottom'>
            <img src='/image/bottom.png' alt='bottom' />
            <button
              onClick={sendMessage}
              className={message ? 'active' : ''}
            >
              전송
            </button>
          </div>
        </div>
      </div>

      <p className='x'>
        Connected: {isConnected.toString()} <br />
        Nickname: {nickname} <br />
        ID: ({socket?.id}) <br />
        Participants: {numUsers}
        {userList.map((user, index) => (
          <li style={{ listStyleType: "square" }} key={index}>{user}</li>
        ))}
      </p>
    </div>
  );
};

export default Chat;
