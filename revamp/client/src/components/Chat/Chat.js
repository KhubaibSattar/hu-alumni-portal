import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import io from "socket.io-client";

const ChatPage = () => {
  const theme = useTheme();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const authenticatedUser = useSelector((state) => state.auth.user);
  const [socket, setSocket] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = io("your_socket_server_url");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch online users or update the online status of users
  useEffect(() => {
    // Your logic to fetch or update online users

    // Example: Set online users
    setOnlineUsers([
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" },
      { id: 3, name: "User 3" },
    ]);
  }, []);

  // Send message to another user
  const sendMessage = (userId, message) => {
    socket.emit("send-message", { userId, message });
  };

  // Receive messages from other users
  useEffect(() => {
    if (socket) {
      socket.on("receive-message", ({ senderId, message }) => {
        // Handle received message
      });
    }
  }, [socket]);

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
        Online Users
      </Typography>
      {onlineUsers.map((user) => (
        <Typography
          key={user.id}
          component={Link}
          to={`/Chat/${user.id}`}
          variant="body1"
          sx={{
            color: theme.palette.primary.main,
            textDecoration: "none",
            display: "block",
            marginTop: "0.5rem",
          }}
        >
          {user.name}
        </Typography>
      ))}
      
      {authenticatedUser && (
        <Box>
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Logged in as: {authenticatedUser.email}
          </Typography>
          {/* Your additional chat components for the authenticated user */}
        </Box>
      )}
    </Box>
  );
};

export default ChatPage;
