import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setNickname(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    console.log('Submit button clicked');
    if (nickname) {
      console.log('Navigating to chat with nickname:', nickname);
      navigate('/chat', { state: { nickname } });
    } else {
      console.log('Nickname is required');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="Login">
      <div className='title'>
        <img src='/image/logo_kakao.png' alt="로고" />
      </div>
      <div className='box'>
        <input
          type="text"
          value={nickname}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="nickname"
          placeholder="아이디"
        />
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          onKeyDown={handleKeyDown}
          className="nickname"
          placeholder="비밀번호"
        />
        <div className='check'>
          <input className="checkbox round-checkbox" type="checkbox" />
          간편로그인 정보 저장
        </div>
        <button className='log' onClick={handleSubmit}>로그인</button>
        <div className='or'>또는</div>
        <button className='qr'>QR코드 로그인</button>
        <div className='bl'>회원가입</div>
        <div className='br'>계정 찾기 | 비밀번호 찾기</div>
      </div>
      <div className='l'>
        한국어&emsp;|&emsp;이용약관&emsp;|&emsp;<span className='bold'>개인정보 처리방침</span>&emsp;|&emsp;고객센터&emsp;&emsp;&emsp;© Kakao Corp.
      </div>
    </div>
  );
};

export default Login;
