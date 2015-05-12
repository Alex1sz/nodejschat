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

var crypto = require('crypto');
var users = [];
var id = crypto.randomBytes(20).toString('hex');

var io = require('socket.io').listen(app);
io.sockets.on('connection', function (socket) {
  var id = crypto.randomBytes(20).toString('hex');
  users.push({ socket: socket, id: id, name: null });
  socket.emit('welcome', { message: 'Welcome!', id: id });
  sendUsers();
  socket.on('send', function (data) {
      if(data.username !== '') {
        setUsername(id, data.username);
      }
      if(data.toUser !== '') {
        users.forEach(function(user) {
      if(user.id === data.toUser || user.id === data.fromUser) {
        user.socket.emit('receive', data);
      }
    })
      } else {
        io.sockets.emit('receive', data);
      }
  });
});

var sendUsers = function() {
  io.sockets.emit('users', users.map(function(user) {
    return { id: user.id, name: user.username };
  }));
}
var setUsername = function(id, name) {
  users.forEach(function(user) {
    if(user.id === id) {
      user.username = name;
      sendUsers();
    }
  });
}