import { useState } from "react";
import {
  FiSend,
  FiPaperclip,
  FiUser,
  FiHeadphones,
} from "react-icons/fi";

export default function ChatWindow() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "support",
      text: "Hello! We have received your complaint. Could you please provide more details about the issue?",
      time: "09:45 AM",
    },
    {
      id: 2,
      sender: "user",
      text: "The router keeps blinking red and there is no internet connection since yesterday.",
      time: "09:48 AM",
    },
    {
      id: 3,
      sender: "support",
      text: "Thank you. Our technical team has been assigned and is currently investigating the issue.",
      time: "10:10 AM",
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages([
      ...messages,
      {
        id: Date.now(),
        sender: "user",
        text: message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setMessage("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm">

      {/* Header */}

      <div className="border-b px-6 py-5 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-gray-800">
            Support Chat
          </h2>

          <p className="text-gray-500">
            Communicate with our support team
          </p>

        </div>

        <div className="flex items-center gap-2 text-green-600 font-semibold">

          <span className="w-3 h-3 rounded-full bg-green-500"></span>

          Online

        </div>

      </div>

      {/* Messages */}

      <div className="h-[450px] overflow-y-auto p-6 space-y-6 bg-gray-50">

        {messages.map((msg) => (

          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            {msg.sender === "support" && (
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                <FiHeadphones />
              </div>
            )}

            <div
              className={`max-w-md rounded-2xl px-5 py-4 ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >

              <p>{msg.text}</p>

              <p
                className={`text-xs mt-3 ${
                  msg.sender === "user"
                    ? "text-blue-100"
                    : "text-gray-400"
                }`}
              >
                {msg.time}
              </p>

            </div>

            {msg.sender === "user" && (
              <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center ml-3">
                <FiUser />
              </div>
            )}

          </div>

        ))}

      </div>

      {/* Input */}

      <div className="border-t p-5">

        <div className="flex items-center gap-3">

          <button className="w-12 h-12 rounded-xl border flex items-center justify-center hover:bg-gray-100">
            <FiPaperclip size={20} />
          </button>

          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border rounded-xl px-5 py-3 outline-none focus:border-blue-600"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <FiSend />
            Send
          </button>

        </div>

      </div>

    </div>
  );
}