var socket = function (server) {
    var io = require('socket.io')(server);

    io.on('connection', function (socket) {

        var room = socket.handshake['query']['r_var'];
        var publish = true;
        console.log(room);
        socket.join(room);
        console.log('user joined room #' + room);

        socket.on('disconnect', function () {
            socket.leave(room)
            publish = false;
            console.log('user disconnected');
        });

    });

    return io;

}
module.exports = {
    getSocket: socket
}

