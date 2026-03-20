"use client";
import React from "react";

interface SidebarProps {
	onlineUsers: { [id: string]: string };
	currentUser: string;
	startChat: (id: string) => void;
	isRegistered: boolean;
}

const Sidebar = ({ onlineUsers, currentUser, startChat, isRegistered }: SidebarProps) => {
	return (
		<div
			style={{
				width: "260px",
				background: "#1e1f22",
				color: "#fff",
				display: "flex",
				flexDirection: "column",
				borderRight: "1px solid #2b2d31",
				padding: "1rem 0",
			}}
		>
			{/* SECTION 'Online Users' – visible only to registered users */}
			{isRegistered ? (
				<>
					{/* HEADER */}
					<div
						style={{
							padding: "0 1.2rem 1rem",
							fontSize: "1.2rem",
							fontWeight: 600,
							color: "#b5b6b8",
							borderBottom: "1px solid #2b2d31",
						}}
					>
						Online Users
					</div>

					{/* USER LIST */}
					<div style={{ flex: 1, overflowY: "auto", marginTop: "0.5rem" }}>
						{Object.entries(onlineUsers).map(([id, name]) => {
							const isSelf = name === currentUser;

							return (
								<div
									key={id}
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										padding: "0.6rem 1rem",
										cursor: isSelf ? "default" : "pointer",
										background: "transparent",
										transition: "0.2s",
									}}
									onMouseEnter={(e) =>
										(e.currentTarget.style.background = "#2b2d31")
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.background = "transparent")
									}
								>
									{/* Avatar + Name */}
									<div style={{ display: "flex", alignItems: "center" }}>
										<div
											style={{
												width: "35px",
												height: "35px",
												borderRadius: "50%",
												background: "#5865F2",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												fontWeight: 700,
												marginRight: "0.8rem",
												textTransform: "uppercase",
											}}
										>
											{name.charAt(0)}
										</div>

										<span
											style={{
												fontWeight: isSelf ? 700 : 400,
												color: isSelf ? "#43b581" : "#dcddde",
											}}
										>
											{name}
										</span>
									</div>

									{/* Chat button */}
									{!isSelf && (
										<button
											onClick={() => startChat(id)}
											style={{
												background: "#5865F2",
												border: "none",
												padding: "0.3rem 0.7rem",
												borderRadius: "4px",
												color: "#fff",
												cursor: "pointer",
												fontSize: "0.8rem",
												transition: "0.2s",
											}}
										>
											Chat
										</button>
									)}
								</div>
							);
						})}
					</div>
				</>
			) : (
				/* If user not registered: */
				<div
					style={{
						flex: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "#b5b6b8",
						fontStyle: "italic",
						textAlign: "center",
						padding: "1rem",
					}}
				>
					Join a room to see online users
				</div>
			)}

			{/* FOOTER — Current User info */}
			<div
				style={{
					padding: "1rem",
					borderTop: "1px solid #2b2d31",
					display: "flex",
					alignItems: "center",
					background: "#232428",
				}}
			>
				{isRegistered ? (
					<>
						<div
							style={{
								width: "40px",
								height: "40px",
								borderRadius: "50%",
								background: "#43b581",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontWeight: 700,
								marginRight: "0.8rem",
								textTransform: "uppercase",
							}}
						>
							{currentUser.charAt(0)}
						</div>

						<div>
							<div style={{ fontWeight: 700 }}>{currentUser}</div>
							<div style={{ fontSize: "0.8rem", color: "#43b581" }}>
								Online
							</div>
						</div>
					</>
				) : (
					<div style={{ color: "#b5b6b8", fontStyle: "italic" }}>
						Not registered
					</div>	
				)}
			</div>
		</div>
	);
};

export default Sidebar;