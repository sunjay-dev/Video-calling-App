import { useEffect, useCallback, useState } from 'react'
import { useSocket } from '../context/Socket.context';
import { useNavigate } from 'react-router-dom';
import peer from '../services/peer';
import { VideoPlayer, RoomToggles, JoiningLink } from '../components';

export default function Room() {
  const socket = useSocket();
  const navigate = useNavigate();
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [zoomState, setZoomState] = useState(true);
  // const hasStartedRef = useRef(false);
  // for Both
  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setMyStream(stream);
        stream.getTracks().forEach(track => peer.peer.addTrack(track, stream));
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
    await peer.setRemoteDescription(ans);
    const offer = await peer.getOffer();
    socket.emit("nego-needed", offer);
  }, [socket]);

  //creator
  const handleNegoDone = useCallback(async (ans) => {
    await peer.setRemoteDescription(ans);
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
  // const handleNegoNeededEventListener = useCallback(async () => {
  //   if (!hasStartedRef.current) {
  //     hasStartedRef.current = true;
  //     return;
  //   }
  //   console.log("negotiationneeded triggered!");
  //   const offer = await peer.getOffer();
  //   socket.emit("nego-needed", offer);
  // }, [socket]);

  // useEffect(() => {
  //   peer.peer.addEventListener("negotiationneeded", handleNegoNeededEventListener);
  //   return () => {
  //     peer.peer.removeEventListener("negotiationneeded", handleNegoNeededEventListener);
  //   };
  // }, [handleNegoNeededEventListener]);

  return (
    <>
      <VideoPlayer myStream={myStream} remoteStream={remoteStream} zoomState={zoomState} />
      <RoomToggles setMyStream={setMyStream} setRemoteStream={setRemoteStream} zoomState={zoomState} setZoomState={setZoomState} />
      {!remoteStream && <JoiningLink />}
    </>
  )
}