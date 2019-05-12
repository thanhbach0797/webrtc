const io = require('socket.io')(3000);
const arr = [];
io.on('connection',socket =>{
  socket.on('NGUOI_DANG_KI', username =>{
    const isExist = arr.some(e => e.ten===username.ten);
    socket.peerid = username.peerid;
    if(isExist){
      return socket.emit('DANG_KI_THAT_BAI')
    }
    arr.push(username);
    console.log(arr);
    socket.emit('DANH_SACH_ONLINE', arr);
    socket.broadcast.emit('CO_NGUOI_DUNG_MOI',username);
  });
  socket.on('disconnect',()=>{
    const index = arr.findIndex (username =>username.peerid ===socket.peerid  )
    arr.splice(index,1);
    io.emit('CO_NGUOI_NGAT_KET_NOI',socket.peerid);
  })
});
