"use client";

interface OnlineUsers {
	[socketId: string]: string; // socket.id -> username
}

interface ChatInvite {
	fromSocketId: string;
	roomId: string;
	from: string;
}

import styles from "./page.module.css";
import { io } from "socket.io-client";
import { useEffect, useMemo, useState } from "react";
import ChatPage from "@/components/page";
import Sidebar from "@/components/Sidebar";

export default function Home() {
	const [showChat, setShowChat] = useState(false);
	const [userName, setUserName] = useState("");
	const [showSpinner, setShowSpinner] = useState(false);
	const [roomId, setroomId] = useState("");
	const [invite, setInvite] = useState<ChatInvite | null>(null);
	const [showInviteModal, setShowInviteModal] = useState(false);
	const [isRegistered, setIsRegistered] = useState(false);
	const [inviteSentTo, setInviteSentTo] = useState<string | null>(null);
	const [showInviteSentModal, setShowInviteSentModal] = useState(false);
	const [showPrivateChatModal, setShowPrivateChatModal] = useState(false);
	const [mySocketId, setMySocketId] = useState<string | undefined>();
	const [privateRoomId, setPrivateRoomId] = useState<string>("");
	const [privateChatPartner, setPrivateChatPartner] = useState<string>("");

	const socket = useMemo(() => io("http://localhost:3001"), []);

	useEffect(() => {
		// If already connected, set it up immediately
		if (socket.id) {
			setMySocketId(socket.id);
		}
		// Listen for connect event (when socket connects later)
		const handleConnect = () => {
			if (socket.id) {
				setMySocketId(socket.id);
			}
		};
		socket.on("connect", handleConnect);
		return () => {
			socket.off("connect", handleConnect);
		};
	}, [socket]);

	const [onlineUsers, setOnlineUsers] = useState<OnlineUsers>({});

	useEffect(() => {
		socket.on("online_users", (users: OnlineUsers) => {
			setOnlineUsers(users);
		});
	}, [socket]);

	const handleJoin = () => {
		if (userName !== "" && roomId !== "") {
			console.log(userName, "userName", roomId, "roomId");

			socket.emit("register_user", userName);
			socket.emit("join_room", roomId);
			setShowSpinner(true);
			setIsRegistered(true);

			setTimeout(() => {
				setShowChat(true);
				setShowSpinner(false);
			}, 4000);
		} else {
			alert("Please fill in Username and Room Id");
		}
	};
	
	const startChat = (targetSocketId: string) => {
		const targetName = onlineUsers[targetSocketId];
		// Generate roomId the same way as in the backend
		const roomId = [mySocketId, targetSocketId].sort().join('_');
		setPrivateRoomId(roomId); // set up roomId for the initiator
		setPrivateChatPartner(targetName);	// set up Private Chat Username

		// socket.emit("invite_to_chat", targetSocketId);
		socket.emit("start_private_chat", { targetSocketId });

		setInviteSentTo(targetName);
		setShowInviteSentModal(true);

		// auto-hide modal after 5 seconds
		setTimeout(() => setShowInviteSentModal(false), 5000);
	};

	useEffect(() => {
		socket.on("invite_to_chat", (data: ChatInvite) => {
			setInvite(data);
			setPrivateRoomId(data.roomId);
			setShowInviteModal(true);
		});
	}, [socket]);

	useEffect(() => {
		socket.on("private_chat_started", ({ roomId }) => {
			setPrivateRoomId(roomId);
			setShowPrivateChatModal(true);
		});
	}, [socket]);

	const acceptInvite = () => {
		if (!invite) return;

		// notify the backend that the invitation has been accepted
		socket.emit("accept_invite", {
			roomId: invite.roomId,
			targetSocketId: invite.fromSocketId
		});

		setPrivateRoomId(invite.roomId);
		setPrivateChatPartner(invite.from);
		setShowInviteModal(false);

		// open the private chat modal
		setShowPrivateChatModal(true);
	};

	const declineInvite = () => {
		setShowInviteModal(false);
		setInvite(null);
	};

	return (
		<div style={{ display: "flex", height: "100vh" }}>
			{/* SIDEBAR */}
			<Sidebar
				onlineUsers={onlineUsers}
				currentUser={userName}
				startChat={startChat}
				isRegistered={isRegistered}
			/>

			{/* MAIN CONTENT */}
			<div style={{ flex: 1, position: "relative" }}>
				{/* JOIN FORM */}
				{!showChat && (
					<div
						className={styles.main_div}
						style={{ display: showChat ? "none" : "" }}
					>
						<input
							className={styles.main_input}
							type="text"
							placeholder="Username"
							onChange={(e) => setUserName(e.target.value)}
							disabled={showSpinner}
						/>
						<input
							className={styles.main_input}
							type="text"
							placeholder="Room id"
							onChange={(e) => setroomId(e.target.value)}
							disabled={showSpinner}
						/>
						<button className={styles.main_button} onClick={() => handleJoin()}>
							{!showSpinner ? (
								"Join"
							) : (
								<div className={styles.loading_spinner}></div>
							)}
						</button>
					</div>
				)}

				{/* CHAT PAGE */}
				{showChat && (
					<ChatPage socket={socket} roomId={roomId} username={userName} />
				)}
			</div>

			{/* MODALE */}
			{showInviteModal && invite && (
				<div style={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100vh",
					background: "rgba(0,0,0,0.6)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 9999
				}}>
					<div style={{
						background: "#fff",
						padding: "2rem",
						borderRadius: "10px",
						width: "350px",
						textAlign: "center",
						color: "#1f1c1c",
						boxShadow: "0 0 20px rgba(0,0,0,0.3)"
					}}>
						<h2 style={{ marginBottom: "1rem" }}>
							Private chat invitation
						</h2>

						<p style={{ marginBottom: "2rem" }}>
							User <b>{invite.from}</b> invites you to a private chat!
						</p>

						<button
							onClick={acceptInvite}
							style={{
								padding: "0.7rem 1.2rem",
								marginRight: "1rem",
								background: "#4CAF50",
								border: "none",
								borderRadius: "5px",
								cursor: "pointer"
							}}
							>
							Accept
						</button>

						<button
							onClick={declineInvite}
							style={{
								padding: "0.7rem 1.2rem",
								background: "#f44336",
								border: "none",
								borderRadius: "5px",
								cursor: "pointer"
							}}
							>
							Reject
						</button>
					</div>
				</div>
			)}

			{/* MODALS */}
			{showInviteSentModal && inviteSentTo && (
				<div style={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100vh",
					background: "rgba(0,0,0,0.6)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 9999
				}}>
					<div style={{
						background: "#fff",
						padding: "2rem",
						borderRadius: "10px",
						width: "350px",
						textAlign: "center",
						color: "#1f1c1c",
						boxShadow: "0 0 20px rgba(0,0,0,0.3)"
					}}>
						<h2 style={{ marginBottom: "1rem" }}>
							Invitation sent!
						</h2>

						<p style={{ marginBottom: "2rem" }}>
							You sent an invitation to <b>{inviteSentTo}</b>.
						</p>

						<button
							onClick={() => setShowInviteSentModal(false)}
							style={{
								padding: "0.7rem 1.2rem",
								background: "#5865F2",
								color: "#fff",
								border: "none",
								borderRadius: "5px",
								cursor: "pointer"
							}}
						>
							OK
						</button>
					</div>
				</div>
			)}

			{showPrivateChatModal && (
				<div style={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100vh",
					background: "rgba(0,0,0,0.7)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 99999
				}}>
					<div style={{
						width: "80%",
						height: "80%",
						background: "#1e1f22",
						borderRadius: "10px",
						overflow: "hidden",
						display: "flex",
						flexDirection: "column"
					}}>
						<div style={{
							padding: "1rem",
							background: "#2b2d31",
							color: "#fff",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center"
						}}>
							<span style={{ margin: 0 }}>
								Private chat with <b>{privateChatPartner}</b>
							</span>
							<button
								onClick={() => {
									setShowPrivateChatModal(false);
									// clear after exit:
									setPrivateRoomId("");
									setPrivateChatPartner("");
								}}
								style={{
									background: "transparent",
									border: "none",
									color: "#fff",
									fontSize: "1.2rem",
									cursor: "pointer"
								}}
							>
								✕
							</button>
						</div>

						<div style={{ flex: 1 }}>
							<ChatPage socket={socket} roomId={privateRoomId} username={userName} showRoomId={false} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
