var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded()) //đẻ sử dụng body
var server = require('http').createServer(app);
server.listen(3000);
/* GET home page. */
app.get('/', function(req, res, next) {
    res.render('trangchu', { title: 'Trang chủ' });
});
//kết nối sql
var UserLogin = [];
var PassLogin = [];


var io = require('socket.io')(server);


//Lăng nghe (on) kết nối server

io.on("connection", function(socket) {
    console.log('Có người vừa kết nối, ID là: ' + socket.id);
    socket.on("disconnect", function() {
        console.log(socket.id + " đã ngắt kết nối server!");
    });
    // socket.on('Client-send-username', (data) => {
    //     if (UserLogin.indexOf(data) >= 0) {
    //         socket.emit('server-send-false');
    //     } else {

    //         UserLogin.push(data);
    //         socket.emit('server-send-true');

    //     }
    // });
    // socket.on('Client-send-pass', (data) {
    //     PassLogin.push(data);
    //     socket.emit('server-send-true');
    // });

    socket.on('Client-send-login', function(data) {
        if (UserLogin.indexOf(data.user) >= 0) {
            socket.emit('server-res-loginErr');
        } else {
            UserLogin.push(data.user);
            PassLogin.push(data.pass);
            socket.Username = data.user;
            socket.emit('server-res-login', data.user);
            io.sockets.emit('server-send-list', UserLogin);
        }
    });
    socket.on('logout', function() {
        UserLogin.splice(UserLogin.indexOf(socket.Username), 1);
        socket.broadcast.emit('server-send-list', UserLogin);
    });
    socket.on('client-send-messages', function(data) {
        socket.emit('server-send-messages', { user: socket.Username, content: data });
    });
    socket.on('client-send-messages', function(data) {
        socket.broadcast.emit('server-send-messages-right', { user: socket.Username, content: data });
    });
    socket.on('dang-go-chu', function() {
        socket.broadcast.emit('write', socket.Username);
    });
    socket.on('dung-go-chu', function() {
        socket.broadcast.emit('Unwrite');
    });
});