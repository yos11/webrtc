var util = require('util');

var express = require('express');
var app = express();

var fs = require('fs');
var https = require('https');

var port = 8088;
//var http = require( 'http' ); // HTTPモジュール読み込み
var socketio = require( 'socket.io' ); // Socket.IOモジュール読み込み

var opts = {
  // SSL証明書と秘密鍵を準備する
  key: fs.readFileSync('./keys/server.key').toString(),
  cert: fs.readFileSync('./keys/server.crt').toString()
};

app.use(express.static('public'));

var ssl_server = https.createServer(opts, app);
ssl_server.listen(port, function() {
  console.log('Listening on ' + port);
});

/*
// 3000番ポートでHTTPサーバーを立てる
var server = https.createServer( opts, function( req, res ) {
    res.writeHead(200, { 'Content-Type' : 'text/html' }); // ヘッダ出力
    res.end( fs.readFileSync('./index.html', 'utf-8') );  // index.htmlの内容を出力
}).listen(8088);
*/
// サーバーをソケットに紐付ける
var io = socketio.listen( ssl_server );

// 接続確立後の通信処理部分を定義
io.sockets.on( 'connection', function( socket ) {

  // クライアントからのメッセージ受信したとき
  socket.on('message', function(data) {

    console.log('data');
//    console.log(JSON.parse(data));
    console.log("receive:");
    console.log(util.inspect(data));
//    console.log(JSON.parse(data));
//    console.log(data);
    // 受信したメッセージを全てのクライアントに送信する

    console.log("send:");
    console.log(data);
    socket.broadcast.emit('message', data);
//      client.send(JSON.parse(data));
  });
  socket.on('disconnect', function() {
    socket.broadcast.emit('user disconnected');
  });
});
