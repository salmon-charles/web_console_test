var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , spawn = require('child_process').spawn;


var port = process.env.PORT || 8001;

app.listen(port);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200, {'Content-Type': 'text/html', "Content-Length": data.length});
    res.end(data);
  });
}

//app.get('/', function (req, res) {
//  res.sendfile('index.html');
//});

 
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