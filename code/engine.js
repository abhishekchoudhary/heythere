var constraints = {video:true};

var callerVideo = document.getElementById("caller");
var calleeVideo = document.getElementById("callee");

var localStream, localPeerConnection, remotePeerConnection;

var startButton = document.getElementById("startButton");
var endButton = document.getElementById("endButton");

startButton.disabled = false;
startButton.onclick = start;
endButton.disabled = true;
endButton.onclick = end;

getUserMedia(constraints, gotStream,function(error) {console.log("getUserMedia error: ", error);});

function gotStream(stream){
  callerVideo.src = URL.createObjectURL(stream);
  localStream = stream;
  callButton.disabled = false;
}

function start() {
  startButton.disabled = true;
  endButton.disabled = false;

  var servers = null;

  localPeerConnection = new RTCPeerConnection(servers);
  localPeerConnection.onicecandidate = gotLocalIceCandidate;

  remotePeerConnection = new RTCPeerConnection(servers);
  remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
  remotePeerConnection.onaddstream = gotRemoteStream;

  localPeerConnection.addStream(localStream);
  localPeerConnection.createOffer(gotLocalDescription,handleError);
}

function gotLocalDescription(description){
  localPeerConnection.setLocalDescription(description);
  remotePeerConnection.setRemoteDescription(description);
  remotePeerConnection.createAnswer(gotRemoteDescription,handleError);
}

function gotRemoteDescription(description){
  remotePeerConnection.setLocalDescription(description);
  localPeerConnection.setRemoteDescription(description);
}

function end() {
  localPeerConnection.close();
  remotePeerConnection.close();
  localPeerConnection = null;
  remotePeerConnection = null;
  endButton.disabled = true;
  startButton.disabled = false;
}

function gotRemoteStream(event){
  calleeVideo.src = URL.createObjectURL(event.stream);
}

function gotLocalIceCandidate(event){
  if (event.candidate) {
    remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
  }
}

function gotRemoteIceCandidate(event){
  if (event.candidate) {
    localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
  }
}

function handleError(){}
