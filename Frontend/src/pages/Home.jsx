import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/Socket.context';
import { useNavigate } from 'react-router-dom';
import {Failed} from '../components';
export default function Home() {
  const navigate = useNavigate();

  const socket = useSocket();
  const [roomInput, setRoomInput] = useState('');
  const [roomNotFound, setRoomNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAllowPermission = async () => {
    try {
      const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      tempStream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err) {
      console.log(err)
      return false;
    }
  };


  async function handleCreateRoom() {
    const res = await handleAllowPermission();
    if (res)
      socket.emit('create-room');
    else {
      setErrorMessage('Please Allow Permissions for Camera and Mic');
      setRoomNotFound(true)
    }
  }

  async function handleJoinRoom() {
    const res = await handleAllowPermission();
    if (res)
      socket.emit('join-room', roomInput);
    else {
      setErrorMessage('Please Allow Permissions for Camera and Mic');
      setRoomNotFound(true)
    }
  }

  const handleRoomExists = useCallback(roomId => {
    navigate(`/r/${roomId}`);
  }, [navigate])

  const handleRoomIdFromServer = useCallback(roomId => {
    navigate(`/r/${roomId}`);
  }, [navigate]);

  const handleRoomNotExists = useCallback(() => {
    setRoomInput('');
    setErrorMessage("No room not found")
    setRoomNotFound(true)
  }, []);

  useEffect(() => {
    socket.on('get-room-id', handleRoomIdFromServer);
    socket.on('room-not-exists', handleRoomNotExists);
    socket.on('room-exists', handleRoomExists);

    return () => {
      socket.off('room-not-exists', handleRoomNotExists);
      socket.off('get-room-id', handleRoomIdFromServer);
      socket.off('room-exists', handleRoomExists);
    }
  }, [socket, handleRoomIdFromServer, handleRoomNotExists, handleRoomExists]);


  return (
    <div className='text-center p-2 mt-12'>
      {roomNotFound && <Failed message={errorMessage} />}
      <input value={roomInput} onChange={e => {
        setRoomInput(e.target.value)
        roomNotFound ? setRoomNotFound(false) : '';
      }}
        className='border border-gray-300 p-2 m-4 rounded-lg w-1/2' placeholder='Enter room Id' />
      <br />
      <button onClick={handleJoinRoom} className='px-3 py-2 m-1 font-medium bg-blue-400 text-white rounded-lg active:scale-[1.02] hover:cursor-pointer'>Join room</button>
      <button onClick={handleCreateRoom} className='px-3 py-2 m-1 font-medium bg-orange-400 text-white rounded-lg active:scale-[1.02] hover:cursor-pointer'>Create room</button>
    </div>
  )
}