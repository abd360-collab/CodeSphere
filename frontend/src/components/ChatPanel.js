// This component shows the chat for a project: 
// it loads past messages, listens for new messages and typing events over the socket, 
// shows the message list grouped by date, allows you to type (with an emoji picker), 
// and sends messages and typing indicators to the server.



import React, { useState, useEffect, useRef } from "react"; // React tools for state, side effects, and persistent refs.
import { useAuth } from "../context/AuthContext"; // gives current user (so messages show your name/id).
import axios from "axios";
import { toast } from "react-toastify";

// emoji picker UI (emoji-mart library).
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const ChatPanel = ({ projectId, socket, userRole }) => {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]); // array of chat messages to render.
  const [newMessage, setNewMessage] = useState(""); // what you are typing now.
  const [loading, setLoading] = useState(true); // true while chat history is being fetched.
  const [sending, setSending] = useState(false); // true while we are sending a message (used to disable UI).
  const [typingUsers, setTypingUsers] = useState([]); // list of usernames currently typing (shows "X is typing...").
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // whether emoji picker is visible.



//   1. messagesEndRef
// 👉 Think of this as a bookmark at the bottom of the chat page.
// Every time a new message comes, we say:
// “Hey browser, scroll to my bookmark please!”
// That’s how the chat window always scrolls down automatically, so you don’t need to manually drag the scrollbar.

// 2. typingTimeoutRef
// 👉 Imagine you are writing in the chat box… we don’t want to keep shouting “I’m typing! I’m typing!” every millisecond.
// So we make a timer:
// Every time you press a key, the timer resets.
// If you stop typing for 1 second, the timer finishes and says:
// → “Okay, this user has stopped typing, tell everyone to hide the typing indicator.”


// 3. isTypingRef
// 👉 Think of this as a small flag:
// At first, flag = ❌ (not typing).
// When you type your first character → we flip flag ✅ and send “I started typing” to others.
// As long as you keep typing, we don’t send again (because flag is already ✅).
// When you stop typing, we flip it back to ❌.

// So:
// It avoids sending “I’m typing” every single keypress.
// Just sends once when you start, and once when you stop.

// Flow in one sentence
// isTypingRef = remembers if you are currently typing or not.
// typingTimeoutRef = sets a short timer to detect when you stop typing.
// messagesEndRef = helps chat window scroll to the bottom automatically.

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  // Fetch messages and setup listeners
  // This useEffect is responsible for loading old messages, listening to new ones, 
  // and cleaning up properly whenever you switch project or socket.
  useEffect(() => {
    fetchMessages();
    setupSocketListeners();

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      if (socket) {
        socket.off("new-message");
        socket.off("user-typing");
        socket.off("user-stopped-typing");
      }
    };
  }, [projectId, socket]);



  // Fetch previous chat history
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/messages/${projectId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load chat history");
    } finally {
      setLoading(false);
    }
  };



  // Listen for socket events
  const setupSocketListeners = () => {
    if (!socket) return; // If there is no open phone line (socket connection), just quit.
// No point in listening if no phone is available. 📞


 // So before setting new listeners, we remove the old ones → “reset the ears.”
    socket.off("new-message");
    socket.off("user-typing");
    socket.off("user-stopped-typing");


    // When the server shouts: “Hey! A new message just came!” 📩
    // We take that message. Add it to the end of our current messages (prev). So the chat updates instantly on screen.
    socket.on("new-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

//     👉 When server whispers:
// “User 🧑 named John is typing...” ⌨️
// We add John to the list of people who are typing (if he’s not already there).
// This is why you see “John is typing...” below the chat box.
    socket.on("user-typing", ({ username }) => {
      setTypingUsers((prev) =>
        prev.includes(username) ? prev : [...prev, username]
      );
    });


//     👉 When server says:
// “Okay, John stopped typing now.” 🛑
// We remove John’s name from the typing list.
// So the “John is typing...” indicator disappears.
    socket.on("user-stopped-typing", ({ username }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== username));
    });
  };



  // Scroll chat to bottom
//   Imagine the chat screen 📱
// You have a chat window (like WhatsApp or Messenger).
// Messages are stacked from top to bottom.
// When a new message arrives, we want the screen to automatically scroll down so you always see the latest message — you don’t have to scroll manually.
// That’s exactly what this function does.
  const scrollToBottom = () => {

//     requestAnimationFrame ( browser function) is like saying:
// "Hey browser, wait until you’re ready to draw the next frame, then run this code."
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);






  // Send message
  // e is the event object that comes from the form submission (like pressing Enter or clicking Send).
  const handleSendMessage = async (e) => {

//     Normally, submitting a form reloads the page.
// preventDefault() stops the page from reloading.
// This lets us handle sending the message without refreshing the chat.
    e.preventDefault();

    if (!newMessage.trim() || sending) return; // if the message is empty or only spaces, don’t send or if we are already sending a message, don’t send again.

    setSending(true);
    try {
//       Checks if a socket connection exists.
// socket.emit("send-message", {...}) → sends the new message to the server in real-time.
// { message: newMessage.trim() } → sends the message text after removing extra spaces.
// The server can then broadcast this message to everyone in the chat.
      if (socket) {
        socket.emit("send-message", { message: newMessage.trim() });
      }
      setNewMessage("");
      setShowEmojiPicker(false);
      isTypingRef.current = false;
      socket.emit("typing-stop", { username: user.username });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };






  // Handle typing indicator
  // You type a character → handleTyping runs.
//   This defines a function called handleTyping.
// It runs every time the user types something in the chat input box.
// e is the event object, which contains info about what the user typed.
  const handleTyping = (e) => {
    const message = e.target.value;
    setNewMessage(message);

    if (socket) {
      // we are not already marked as typing and we are typing something visible, not just spaces.
      if (!isTypingRef.current && message.trim() !== "") {
        socket.emit("typing-start", { username: user.username }); // tells server: “Hey! This user started typing.”
        isTypingRef.current = true; // sets the flag so we don’t send typing-start again for every keystroke.
      }
  // ✅ This avoids spamming the server with typing events.

//   Every time we type a new character, we clear the previous timer.
// This ensures that the “stopped typing” timer resets on every keystroke.
      clearTimeout(typingTimeoutRef.current); // resets the previous timer.

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing-stop", { username: user.username });
        isTypingRef.current = false;
      }, 1000);
    }
  };



  // Emoji handler
  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };


  // Format helpers
//   It takes one input called timestamp (a date/time in milliseconds or a string).
// Its job: convert the timestamp into a readable time, like 10:45 AM.
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };



// It takes a timestamp as input (a number or string representing a date/time).
// Its job: turn the timestamp into a readable label like "Today", "Yesterday", or a date string.
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString();
  };



// It takes messages (an array of chat messages) as input.
// Each message has a timestamp (e.g., createdAt) showing when it was sent.
// Goal: organize messages into groups like
// Today → [all today’s messages]
// Yesterday → [all yesterday’s messages]
// 30/09/2025 → [all messages from that date]
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((message) => {
      const date = formatDate(message.createdAt);
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });
    return groups;
  };



  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);







  return (
    <div className="h-full flex flex-col relative">
      {/* Chat Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
        <p className="text-sm text-gray-600">
          {typingUsers.length > 0
            ? `${typingUsers.join(", ")} ${
                typingUsers.length > 1 ? "are" : "is"
              } typing...`
            : userRole === "viewer"
            ? "View only"
            : "Collaborate with your team"}
        </p>
      </div>



      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.keys(messageGroups).length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p className="mt-2">No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          Object.entries(messageGroups).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-3 text-xs text-gray-500 bg-gray-50 rounded-full">
                  {date}
                </span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              {dateMessages.map((message) => (
  <div
    key={message._id}
    className={`flex mb-3 ${
      message.sender._id === user.id
        ? "justify-end"
        : "justify-start"
    }`}
  >
    <div
      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg overflow-hidden ${
        message.sender._id === user.id
          ? "bg-primary-600 text-white"
          : "bg-gray-200 text-gray-900"
      }`}
      style={{
        wordWrap: 'break-word',
        wordBreak: 'break-word',
        overflowWrap: 'anywhere'
      }}
    >
      {message.sender._id !== user.id && (
        <p className="text-xs font-medium mb-1 opacity-75">
          {message.sender.username}
        </p>
      )}
      <p 
        className="text-sm whitespace-pre-wrap"
        style={{
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          overflowWrap: 'anywhere'
        }}
      >
        {message.message}
      </p>
      <p
        className={`text-xs mt-1 ${
          message.sender._id === user.id
            ? "text-primary-100"
            : "text-gray-500"
        }`}
      >
        {formatTime(message.createdAt)}
      </p>
    </div>
  </div>
))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} /> 
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 z-50">
          <Picker data={data} onEmojiSelect={addEmoji} theme="light" />
        </div>
      )}

      {/* Message Input */}
      {userRole !== "viewer" && (
        <div className="border-t border-gray-200 p-4 flex items-center space-x-2">
          {/* Emoji Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            😊
          </button>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="flex flex-1 space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type a message..."
              className="flex-1 input-field text-sm"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="btn-primary text-sm py-2 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatPanel;
