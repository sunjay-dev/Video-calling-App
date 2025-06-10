import { useEffect, useCallback, useState } from 'react'
import { useSocket } from '../context/Socket.context';
import ReactPlayer from 'react-player'
import { useNavigate } from 'react-router-dom';
import peer from '../services/peer';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicOffIcon from '@mui/icons-material/MicOff';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';

export default function Room() {
  const navigate = useNavigate();
  const socket = useSocket();
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [videoState, setVideoState] = useState(true);
  const [voiceState, setVoiceState] = useState(true);
  const [zoomState, setZoomState] = useState(true);
  // for Both
  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setMyStream(stream);

        const audioTrack = stream.getAudioTracks()[0];
        const videoTrack = stream.getVideoTracks()[0];

        if (audioTrack) peer.peer.addTrack(audioTrack, stream);
        if (videoTrack) peer.peer.addTrack(videoTrack, stream);

      } catch (err) {
        console.error("Error getting media stream:", err);
      }
    })();
  }, []);

  //for Creator
  const handleNewUser = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit('send-offer', offer);
  }, [socket]);

  //for joiner
  const handleAcceptOffer = useCallback(async (offer) => {
    const ans = await peer.getAnswer(offer);
    socket.emit('offer-accepted', ans);
  }, [socket]);

  //for creator
  const handleOfferAccepted = useCallback(async (ans) => {
    await peer.setLocalDescription(ans);
  }, []);

  //creator
  const handleNegoDone = useCallback(async (ans) => {
    await peer.setLocalDescription(ans);
  }, []);

  //joiner
  const handleNegoNeeded = useCallback(async (offer) => {
    const ans = await peer.getAnswer(offer);
    socket.emit("nego-done", ans);
  }, [socket]);

  // for other person  
  const handleCallEnd = useCallback(async () => {
    const audio = new Audio('/sounds/call-end.mp3');
    audio.play();
    setTimeout(() => {
      peer.peer.getSenders().forEach(sender => {
        if (sender.track) sender.track.stop();
      });
      peer.reset();
      setMyStream(null);
      setRemoteStream(null);
      navigate('/');
    }, 1000);
  }, [navigate]);
  

  useEffect(() => {
    socket.on('user-joined', handleNewUser);
    socket.on('accept-offer', handleAcceptOffer);
    socket.on('offer-accepted', handleOfferAccepted);
    socket.on('nego-needed', handleNegoNeeded);
    socket.on('nego-done', handleNegoDone);
    socket.on('call-end', handleCallEnd);

    return () => {
      socket.off('user-joined', handleNewUser);
      socket.off('accept-offer', handleAcceptOffer);
      socket.off('offer-accepted', handleOfferAccepted);
      socket.off('nego-needed', handleNegoNeeded);
      socket.off('nego-done', handleNegoDone);
      socket.off('call-end', handleCallEnd);
    };
  }, [socket, handleOfferAccepted, handleAcceptOffer, handleNewUser, handleNegoNeeded, handleNegoDone, handleCallEnd]);

  useEffect(() => {
    peer.peer.addEventListener("track", (e) => {
      setRemoteStream(e.streams[0]);
    });
  }, []);
  //creator
  const handleNegoNeededEventListner = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("nego-needed", offer);
  }, [socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeededEventListner);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeededEventListner);
    };
  }, [handleNegoNeededEventListner]);

  const handleMicState = useCallback((val) => {
    setVoiceState(val);
    peer.peer.getSenders().forEach(sender => {
      if (sender.track?.kind === 'audio')
        sender.track.enabled = val;
    });
  }, []);

  const handleVideoState = useCallback((val) => {
    setVideoState(val);
    peer.peer.getSenders().forEach(sender => {
      if (sender.track?.kind === 'video')
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
      console.log(peer)
      setMyStream(null);
      setRemoteStream(null);
      navigate('/');  
    }, 1000);

  }, [navigate, socket]);


  return (
    <>
      <div className="overflow-hidden w-dvw h-dvh" id={zoomState? 'myVideo': undefined}>
        {remoteStream ? (
          <ReactPlayer 
            url={remoteStream}
            playing
            width="100%"
            height="100%"
            className="-scale-x-100"
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black text-white text-xl font-semibold">
            Waiting for other person to join...
          </div>
        )}
      </div>

      <div className="fixed w-44 h-48 md:bottom-5 bottom-21 sm:right-3 right-1 z-10">
        <ReactPlayer
          url={myStream}
          playing
          muted
          width="100%"
          height="100%"
          className="-scale-x-100"
          style={{
            top: 0,
            left: 0
          }}
        />
      </div>

      <div className={`fixed bottom-3 left-1/2 transform -translate-x-1/2 z-10 flex gap-4 bg-white backdrop-blur-sm p-3 rounded-full shadow-md`}>
        
        {zoomState ? (
          <button disabled={!myStream} onClick={() => setZoomState(false)} className="p-2 rounded-full hover:bg-gray-200">
            <ZoomOutMapIcon />
          </button>
        ) : (
          <button disabled={!myStream} onClick={() => setZoomState(true)} className="p-2 rounded-full hover:bg-gray-200">
            <ZoomInMapIcon />
          </button>
        )}
        {voiceState ? (
          <button disabled={!myStream} onClick={() => handleMicState(false)} className="p-2 rounded-full hover:bg-gray-200">
            <KeyboardVoiceIcon />
          </button>
        ) : (
          <button disabled={!myStream} onClick={() => handleMicState(true)} className="p-2 rounded-full hover:bg-gray-200">
            <MicOffIcon />
          </button>
        )}

        {videoState ? (
          <button disabled={!myStream} onClick={() => handleVideoState(false)} className="p-2 rounded-full hover:bg-gray-200">
            <VideocamIcon />
          </button>
        ) : (
          <button disabled={!myStream} onClick={() => handleVideoState(true)} className="p-2 rounded-full hover:bg-gray-200">
            <VideocamOffIcon />
          </button>
        )}

        <button onClick={handleEndCall} className="px-2.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full">
          <LocalPhoneIcon />
        </button>
      </div>
    </>
  )
}