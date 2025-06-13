import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../context/Socket.context';
export default function JoinRedirect() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAllowPermission = useCallback(async () => {
    try {
      const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      tempStream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err) {
      console.log(err)
      return false;
    }
  }, []);

  const handleRedirect = useCallback(async () => {
    setError(null);
    const res = await handleAllowPermission();
    if (res) {
      socket.emit('join-room', roomId);
      setLoading(false)
    }
    else {
      setLoading(false);
      setError("Camera/Mic permission was denied. Please enable it from your browser settings and click 'Try Again'.");
    }
  }, [handleAllowPermission, roomId, socket]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect])

  const handleRoomExists = useCallback(roomId => {
    navigate(`/room/${roomId}`);
  }, [navigate]);

  const handleRoomNotExists = useCallback(() => {
    setError("No Room found, Redirecting to home page.")
    setTimeout(() => navigate('/'), 2000);
  }, [navigate]);

  const handleRoomFull = useCallback(() => {
    setError("Oops! room is already full, Redirecting to home page.")
    setTimeout(() => navigate('/'), 2000);
  }, [navigate]);


  useEffect(() => {
    socket.on('room-not-exists', handleRoomNotExists);
    socket.on('room-exists', handleRoomExists);
    socket.on('room-full', handleRoomFull);
    return () => {
      socket.off('room-not-exists', handleRoomNotExists);
      socket.off('room-exists', handleRoomExists);
      socket.off('room-full', handleRoomFull);
    }
  }, [handleRoomExists, handleRoomFull, handleRoomNotExists, socket])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600 text-lg p-4">
        Requesting camera and mic permissions...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <p className="text-red-500 text-center mb-4">{error}</p>
        <button
          onClick={handleRedirect}
          className="w-62 max-w-sm bg-[#5350a1] text-white py-3 rounded-lg text-lg font-medium hover:opacity-90 active:scale-[0.98] transition"
        >
          Try Again
        </button>
      </div>
    );
  }
}