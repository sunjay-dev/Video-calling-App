import { useEffect, useCallback, useState } from 'react'
import { useSocket } from '../context/Socket.context';
import ReactPlayer from 'react-player'
import { useNavigate } from 'react-router-dom';
import peer from '../services/peer';
import RoomToggles from '../components/RoomToggles';

export default function Room() {
  const socket = useSocket();
  const navigate = useNavigate();
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
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

  return (
    <>
      <div className="overflow-hidden w-dvw h-dvh" id={zoomState ? 'myVideo' : undefined}>
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
      <RoomToggles setMyStream={setMyStream} setRemoteStream={setRemoteStream} zoomState={zoomState} setZoomState={setZoomState} />
    </>
  )
}