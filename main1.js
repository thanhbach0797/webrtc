
function openStream(){
  const config = {audio: false, video: true};
  return navigator.mediaDevices.webkitGetUserMedia(config);
}

openStream()
.then(stream =>console.log(stream));
