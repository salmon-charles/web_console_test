var app = require('express').createServer(), 
    io = require('socket.io').listen(app),
    spawn = require('child_process').spawn;

app.listen(process.env.C9_PORT);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

 
io.sockets.on('connection', function (socket) {
    // echo the message
    socket.on('message', function (data) {
        console.info(data);
        socket.send("[ECHO] "+data);
    });
    
    // commands
    socket.on('cmd', function (data) {
        try {
            var process = spawn(data.cmd, data.options);
            process.stdout.on('data', function(data) {
                socket.send(data);
            });
        } catch(err) {
            console.log(err);
            socket.send("[ERROR] "+err);
        }


    });
  
});