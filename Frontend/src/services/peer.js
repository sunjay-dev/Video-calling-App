const iceServers = [
  {
    urls: [
      "stun:stun.l.google.com:19302",
      "stun:global.stun.twilio.com:3478",
    ]
  },
  {
        urls: "turn:global.relay.metered.ca:80",
        username: "27f119cf6c90ddebd24b934d",
        credential: "Of6VqsrBok1//7Vt",
      },
      {
        urls: "turn:global.relay.metered.ca:80?transport=tcp",
        username: "27f119cf6c90ddebd24b934d",
        credential: "Of6VqsrBok1//7Vt",
      },
      {
        urls: "turn:global.relay.metered.ca:443",
        username: "27f119cf6c90ddebd24b934d",
        credential: "Of6VqsrBok1//7Vt",
      },
      {
        urls: "turns:global.relay.metered.ca:443?transport=tcp",
        username: "27f119cf6c90ddebd24b934d",
        credential: "Of6VqsrBok1//7Vt",
      },
]

class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({ iceServers });
    }
  }

  async getAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const ans = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(ans));
      return ans;
    }
  }

  reset() {
    this.peer = new RTCPeerConnection({ iceServers });
  }

  async setRemoteDescription(ans) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }  
}
export default new PeerService();