import ReactPlayer from 'react-player'

export default function VideoPlayer({zoomState, remoteStream, myStream}) {
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

      <div className="fixed sm:w-56 w-44 h-48 md:bottom-5 bottom-21 sm:right-4 right-1 z-10">
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
      </>
  )
}
