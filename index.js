var http = require('http'),
  fs = require('fs'),
  port = 3000,
  html = fs.readFileSync(__dirname + '/html/page.html', {encoding: 'utf8'}),
  css = fs.readFileSync(__dirname + '/css/styles.css', {encoding: 'utf8'});

var app = http.createServer(function (req, res) {
  if(req.url === '/styles.css') {
    res.writeHead(200, {'Content-type': 'text/css'});
    res.end(css);
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
  }
}).listen(port, '127.0.0.1');

var io = require('socket.io').listen(app);
io.sockets.on('connection', function (socket) {
  socket.emit('welcome', { message: 'Welcome!' });
  socket.on('send', function (data) {
    io.sockets.emit('receive', data);
  });
});
