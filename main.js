//var constraints = { video: { frameRate: { ideal: 10, max: 15 } } };
//import Peer from 'peerjs';
// Older browsers might not implement mediaDevices at all, so we set an empty object first
const socket = io('http://localhost:3000');
$('#div-chat').hide();

socket.on('DANH_SACH_ONLINE',arr =>{
  $('#div-chat').show();
  $('#div-dk').hide();
  arr.forEach(username=>{
    const {ten,peerid} = username;
    $('#uluser').append(`<li id="${peerid}">${ten}</li>`);
  });

  socket.on('CO_NGUOI_DUNG_MOI',username =>{
    const {ten,peerid} = username;
    $('#uluser').append(`<li id="${peerid}">${ten}</li>`);
  });

  socket.on('CO_NGUOI_NGAT_KET_NOI',peerid=>{
    $(`#${peerid}`).remove();
  });

});

socket.on('DANG_KI_THAT_BAI',()=>alert('vui long chon user name khac'));
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {

    // First get ahold of the legacy getUserMedia, if present
    var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}

function playStream(videoTag,stream) {
  var video = document.getElementById(videoTag);

  if ("srcObject" in video) {
    video.srcObject = stream;
  } else {
    // Avoid using this in new browsers, as it is going away.
    video.src = window.URL.createObjectURL(stream);
  }
  video.onloadedmetadata = function(e) {
    video.play();
  };
}

//navigator.mediaDevices.getUserMedia({ audio: false, video: true })
//.then(stream =>playStream('localStream',stream));

const peer = new Peer({key: 'lwjd5qra8257b9'},80);

peer.on('open', id=>{
  $('#my-peer').append(id);
  $('#username').click(() =>{
  var username = $('#username1').val();
    socket.emit('NGUOI_DANG_KI',{ten: username,peerid: id});
  });

});

//caller
$('#btcall').click(()=>{
  const id = $('#remoteid').val();
  navigator.mediaDevices.getUserMedia({ audio: false, video: true })
  .then(stream =>{
    playStream('localStream',stream)
    const call = peer.call(id,stream)
    call.on('stream',remoteStream=>{playStream('remoteStream',remoteStream )})
  })
})

//callee
peer.on('call',call =>{
  navigator.mediaDevices.getUserMedia({ audio: false, video: true })
  .then(stream => {
      playStream('localStream',stream);
      call.answer(stream);
      call.on('stream',remoteStream=>{playStream( 'remoteStream',remoteStream )});
    });
});

$('#uluser').on('click','li',function(){
  const id = $(this).attr('id');
  navigator.mediaDevices.getUserMedia({ audio: false, video: true })
  .then(stream =>{
    playStream('localStream',stream)
    const call = peer.call(id,stream)
    call.on('stream',remoteStream=>{playStream('remoteStream',remoteStream )})
  })
})
