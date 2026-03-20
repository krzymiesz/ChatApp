const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const httpServer = http.createServer()
const users = {}; // socket.id->username

const io = new Server(httpServer, {
	cors: {
		origin: 'http://localhost:3000', // replace with your frontend URL
		methods: ['GET', 'POST'],
		allowedHeaders: ['my-custom-header'],
		credentials: true,
	},
})

io.on('connection', (socket) => {
	console.log('A user connected:', socket.id)

	socket.on('register_user', (username) => {
		users[socket.id] = username;
		io.emit('online_users', users); // broadcast updated users list
	});

	socket.on('join_room', (roomId) => {
		socket.join(roomId)
		console.log(`user with id-${socket.id} joined room - ${roomId}`)
	})

	socket.on('send_msg', (data) => {
		console.log(data, 'DATA')
		io.to(data.roomId).emit('receive_msg', data) // send a message to a specific room ID
	})

	socket.on('disconnect', () => {
		delete users[socket.id];
		io.emit('online_users', users);
		console.log('A user disconnected:', socket.id)
	})

	socket.on('start_private_chat', ({ targetSocketId }) => {
		const roomId = [socket.id, targetSocketId].sort().join('_');
		socket.join(roomId);
		io.to(targetSocketId).emit('invite_to_chat', { 
			roomId, 
			from: users[socket.id],
			fromSocketId: socket.id
		});
	})

	socket.on("accept_invite", ({ roomId, targetSocketId }) => {
		socket.join(roomId);
		io.to(targetSocketId).emit("private_chat_started", { roomId });
	});
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
	console.log(`Socket.io server is running on port ${PORT}`)
})