import { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/Socket.context';
import { useNavigate } from 'react-router-dom';
import { Failed } from '../components';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CircularProgress from '@mui/material/CircularProgress';

export default function Home() {
  const navigate = useNavigate();

  const socket = useSocket();
  const [roomInput, setRoomInput] = useState('');
  const [roomNotFound, setRoomNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false)

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
    setIsProcessing(true)
    const res = await handleAllowPermission();
    if (res)
      socket.emit('create-room');
    else {
      setErrorMessage('Please Allow Permissions for Camera and Mic');
      setRoomNotFound(true)
      setIsProcessing(false)
    }
  }

  async function handleJoinRoom(e) {
    e.preventDefault();
    if(roomInput === '') return;
    setIsProcessing(true);
    const res = await handleAllowPermission();
    if (res)
      socket.emit('join-room', roomInput);
    else {
      setErrorMessage('Please Allow Permissions for Camera and Mic');
      setRoomNotFound(true)
    }
  }

  const handleRoomExists = useCallback(roomId => {
    navigate(`/room/${roomId}`);
    setIsProcessing(false)
  }, [navigate])

  const handleRoomIdFromServer = useCallback(roomId => {
    navigate(`/room/${roomId}`);
    setIsProcessing(false)
  }, [navigate]);

  const handleRoomNotExists = useCallback(() => {
    setRoomInput('');
    setErrorMessage("No Room found")
    setRoomNotFound(true);
    setIsProcessing(false)
  }, []);

  const handleRoomFull = useCallback(() => {
    setRoomInput('');
    setErrorMessage("Oops! Room is already full")
    setRoomNotFound(true);
    setIsProcessing(false)
  }, []);

  useEffect(() => {
    socket.on('get-room-id', handleRoomIdFromServer);
    socket.on('room-not-exists', handleRoomNotExists);
    socket.on('room-full', handleRoomFull);
    socket.on('room-exists', handleRoomExists);

    return () => {
      socket.off('get-room-id', handleRoomIdFromServer);
      socket.off('room-not-exists', handleRoomNotExists);
      socket.off('room-full', handleRoomFull);
      socket.off('room-exists', handleRoomExists);
    }
  }, [socket, handleRoomIdFromServer, handleRoomNotExists, handleRoomExists, handleRoomFull]);


  return (
    <div className="w-dvw h-dvh flex flex-col text-gray-800 selection:text-white selection:bg-[#5350a1]">
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <CircularProgress size={60} color="primary" />
        </div>
      )}
      <header className="w-full p-4 flex items-center border-gray-200 select-none">
        <img src="/logo.png" alt="VideoMeet Logo" className="h-12" />
      </header>

      <main className="flex flex-col items-center sm:mt-12 mt-18 px-6 text-center">
        <h1 className="md:text-6xl text-5xl font-bold sm:font-semibold text-gray-600 sm:mb-2 mb-3">Start a Video Meeting</h1>
        <p className="text-gray-500 sm:text-lg text-sm mt-0.5 sm:mt-0 mb-8">Create a new room or join an existing one.</p>

        <div className="space-y-4 w-full sm:mt-0 mt-4 sm:px-0 px-6 max-w-sm mx-auto">
          {roomNotFound && <Failed message={errorMessage} />}
          {/* Create Room */}
          <button disabled={isProcessing} onClick={handleCreateRoom} className="w-full bg-[#5350a1] text-white px-6 py-3 rounded-lg flex justify-center items-center gap-2 hover:opacity-90 transition active:scale-[0.98]">
            <VideoCallIcon fontSize="small" />
            Create New Room
          </button>

          {/* Divider */}
          <div className="text-sm text-gray-400 text-center">OR</div>

          {/* Join Room */}
          <form onSubmit={e=> handleJoinRoom(e)}  className="flex flex-row gap-2 w-full">
            <input value={roomInput}
              onChange={e => {
                setRoomInput(e.target.value)
                roomNotFound ? setRoomNotFound(false) : '';
              }}
              name='roomId'
              type="text"
              placeholder="Enter Room ID"
              className="flex-4/5 min-w-0 border border-gray-300 px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#5350a1]"
            />
            <button disabled={isProcessing} type='submit' className="px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#5350a1] hover:text-white transition active:text-white active:bg-[#5350a1] active:scale-[0.98]">
              Join
            </button>
          </form>
        </div>
        {/* 3 dots */}
        <div className="sm:mt-12 mt-14 text-sm text-gray-500 flex items-center gap-2">
          <span className="text-gray-400">·</span>
          <span>Secure</span>
          <span className="text-gray-400">·</span>
          <span>Fast</span>
          <span className="text-gray-400">·</span>
          <span>No sign-up needed</span>
        </div>
      </main>
    </div>
  );
}