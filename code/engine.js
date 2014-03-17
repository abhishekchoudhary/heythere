var constraints = {video: true};

var callerVideo = document.getElementById("caller");
var calleeVideo = document.getElementById("callee");

var localStream, localPC, remotePC;
  
var startButton = document.getElementById("begin");
var endButton = document.getElementById("end");

startButton.disabled = false;
startButton.onclick = begin;
endButton.disabled = true;
endButton.onclick = end;

getUserMedia(constraints, gotStream, errorCallback);

function gotStream(input)
{
  callerVideo.src = URL.createObjectURL(input);
  callerVideo = input;
  callerVideo.play();
}

function gotRemoteStream(event){
  calleeVideo.src = URL.createObjectURL(event.stream);
  calleeVideo.play();
}

function begin()
{
  startButton.disabled = true;
  endButton.disabled = false;

  var server = null;
  localPC = new RTCPeerConnection(server);
  localPC.onicecandidate = gotLocalIceCandidate;
  remotePC = new RTCPeerConnection(server);
  remotePC.onicecandidate = gotRemoteIceCandidate;
  
  remotePC.onaddstream = gotRemoteStream;
  localPC.addStream(localStream);
  localPC.createOffer(gotLocalDescription,errorCallback);
}

function end()
{
  localPC.close();
  remotePC.close();
  startButton.disabled = false;
  endButton.disabled = true;
}

function gotLocalDescription(description)
{
  localPC.setLocalDescription(description);
  remotePC.setRemoteDescription(description);
  remotePC.createAnswer(gotRemoteDescription,errorCallback);
}

function gotRemoteDescription(description){
    remotePC.setLocalDescription(description);
    localPC.setRemoteDescription(description);
}


function gotLocalIceCandidate(event)
{
  if (event.candidate)
  {
    remotePC.addIceCandidate(new RTCIceCandidate(event.candidate));
  }
}

function gotRemoteIceCandidate(event)
{
  if (event.candidate)
  {
    localPC.addIceCandidate(new RTCIceCandidate(event.candidate));
  }
}


function errorCallback(error)
{
  console.log("Error: ", error);
}
