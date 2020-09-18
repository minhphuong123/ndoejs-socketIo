var socket = io('http://localhost:3000');

socket.on("server-res-loginErr", function() {
    alert('Tài khoản đã tồn tại');
});
socket.on("server-res-login", function(data) {
    // alert('Đăng nhập thành công!');
    $('#currentUser').html(data);
    $('#formDangNhap').hide();
    // $('#formDangKy').hide();
    $('#chatForm').show();
});
socket.on('server-send-list', function(data) {
    $('#listUser').html('');
    data.forEach(function(i) {
        $('#listUser').append('<div class="user">' + i + '</div>');
    });
});
socket.on('server-send-messages', function(data) {
    $('#listMessage').append('<strong>' + data.user + ': </strong>' + data.content + '<br><br>');
});
socket.on('server-send-messages-right', function(data) {
    $('#listMessage').append('<div class="float-right">' + data.content + ' <strong>:' + data.user + '</strong></div><br><br>');
});
socket.on('write', function(data) {
    $('#thongbao').html('<strong>' + data + '</strong>' + '<img src="./images/tenor.gif" width="30" height="30" >');
});
socket.on('Unwrite', function() {
    $('#thongbao').html('');
})
$(document).ready(function() {
    $('#formDangNhap').show();
    // $('#formDangKy').hide();
    $('#chatForm').hide();

    $('#dangky').click(function() {
        $('#formDangNhap').hide();
        // $('#formDangKy').show();

    });
    // $('#register').click(function() {
    //     socket.emit('Client-send-username', $('#ten').val());
    //     // socket.emit('Client-send-password', $('#matkhau').val());
    // });
    $('#login').click(function() {
        socket.emit('Client-send-login', {
            user: $('#user').val(),
            pass: $('#pass').val()
        });
        // socket.emit('Client-send-login', $('#pass').val());
    });
    $('#logOut').click(function() {
        socket.emit('logout');
        $('#formDangNhap').show();
        $('#chatForm').hide();
        // socket.emit('Client-send-login', $('#pass').val());
    });
    $('#btnSend').click(function() {

        socket.emit('client-send-messages', $('#txtMessages').val());
        $('#txtMessages').val('');
    });
    $('#txtMessages').focusin(function() {
        socket.emit('dang-go-chu');
    });
    $('#txtMessages').focusout(function() {
        socket.emit('dung-go-chu');
    })
});