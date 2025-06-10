import { useState, useCallback } from 'react'
import peer from '../services/peer';
import { useSocket } from '../context/Socket.context';
import { useNavigate } from 'react-router-dom';

import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicOffIcon from '@mui/icons-material/MicOff';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';


export default function RoomToggles({setMyStream, setRemoteStream, zoomState, setZoomState}) {
    const socket = useSocket();
    const navigate = useNavigate();
    const [videoState, setVideoState] = useState(true);
    const [voiceState, setVoiceState] = useState(true);

    const handleVideoState = useCallback((val) => {
        setVideoState(val);
        peer.peer.getSenders().forEach(sender => {
            if (sender.track?.kind === 'video')
                sender.track.enabled = val;
        });
    }, []);

    const handleMicState = useCallback((val) => {
        setVoiceState(val);
        peer.peer.getSenders().forEach(sender => {
            if (sender.track?.kind === 'audio')
                sender.track.enabled = val;
        });
    }, []);

    const handleEndCall = useCallback(() => {
        const audio = new Audio('/sounds/call-end.mp3');
        audio.play();
        socket.emit('call-end')
        setTimeout(() => {
            peer.peer.getSenders().forEach(sender => {
                if (sender.track) sender.track.stop();
            });
            peer.peer.close();
            peer.reset();
            setMyStream(null);
            setRemoteStream(null);
            navigate('/');
        }, 1000);

    }, [navigate, setMyStream, setRemoteStream, socket]);

    return (
        <div className={`fixed bottom-3 left-1/2 transform -translate-x-1/2 z-10 flex gap-4 bg-white backdrop-blur-sm p-3 rounded-full shadow-md`}>

            {zoomState ? (
                <button onClick={() => setZoomState(false)} className="p-2 rounded-full hover:bg-gray-200">
                    <ZoomOutMapIcon />
                </button>
            ) : (
                <button onClick={() => setZoomState(true)} className="p-2 rounded-full hover:bg-gray-200">
                    <ZoomInMapIcon />
                </button>
            )}
            {voiceState ? (
                <button onClick={() => handleMicState(false)} className="p-2 rounded-full hover:bg-gray-200">
                    <KeyboardVoiceIcon />
                </button>
            ) : (
                <button onClick={() => handleMicState(true)} className="p-2 rounded-full hover:bg-gray-200">
                    <MicOffIcon />
                </button>
            )}

            {videoState ? (
                <button onClick={() => handleVideoState(false)} className="p-2 rounded-full hover:bg-gray-200">
                    <VideocamIcon />
                </button>
            ) : (
                <button onClick={() => handleVideoState(true)} className="p-2 rounded-full hover:bg-gray-200">
                    <VideocamOffIcon />
                </button>
            )}

            <button onClick={handleEndCall} className="px-2.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full">
                <LocalPhoneIcon />
            </button>
        </div>
    )
}
