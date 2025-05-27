import React, { useState } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";
import axios from "axios";

//System Prompt
const SYSTEM_PROMPT = `
You are HealthTalk’s virtual customer service agent. HealthTalk is a secure, HIPAA-compliant web platform developed by Team Technova at Amrapali University for the safe and private exchange of medical records between patients and doctors. The platform offers:
- Secure registration and login
- Encrypted upload, sharing, and access to medical records
- Appointment booking, cancellation, and rescheduling
- Searching for nearby doctors and clinics using maps
- Personalized doctor recommendations based on ratings, specialties, and location
- Feedback collection and viewing
- Health analytics dashboards
- Secure insurance claim management
- Mobile app access and blockchain-based audit logs

Always answer as a knowledgeable, friendly, and helpful HealthTalk support representative. Address questions about:
- Services offered
- Insurance acceptance
- Appointment scheduling and management
- Operating hours and location
- First visit requirements
- Telehealth availability
- Accessing medical records
- COVID-19 safety protocols
- Customer support contact options

Always provide clear, concise, and accurate information based on HealthTalk’s features and policies. If a question is outside the platform’s scope, politely guide the user back to HealthTalk services.
`;

// TruncatedMessage Component
const TruncatedMessage = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const limit = 50;

  if (text.length <= limit) {
    return <span>{text}</span>;
  }

  return (
    <span>
      {expanded ? (
        <>
          {text}{" "}
          <button
            onClick={() => setExpanded(false)}
            className="text-blue-600 hover:underline text-sm ml-1"
          >
            read less
          </button>
        </>
      ) : (
        <>
          {text.slice(0, limit)}...{" "}
          <button
            onClick={() => setExpanded(true)}
            className="text-blue-600 hover:underline text-sm ml-1"
          >
            more
          </button>
        </>
      )}
    </span>
  );
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCommonQuestions, setShowCommonQuestions] = useState(true);

  const toggleChat = () => setIsOpen(!isOpen);

  const commonQuestions = [
    "What services do you offer?",
    "Do you accept my insurance?",
    "How can I schedule an appointment?",
    "What are your operating hours?",
    "Where are you located?",
    "What should I bring to my first visit?",
    "Do you offer telehealth services?",
    "How can I access my medical records?",
    "What are your COVID-19 safety protocols?",
    "How can I contact customer support?"
  ];

  const handleCommonQuestionClick = (question) => {
    setInput(question);
    setShowCommonQuestions(false);
    generate(question);
  };

  const generate = async (overrideInput) => {
    const query = overrideInput || input;
    if (!query.trim()) return;

    const userMessage = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_AI_URL}`,
        {
          contents: [
  {
    parts: [{ text: `${SYSTEM_PROMPT}\nUser: ${query}` }],
  },
],

        }
      );

      let botText =
        response.data.candidates[0].content.parts[0].text || "No response";

      botText = botText.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " ").trim();

      const botMessage = { sender: "bot", text: botText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = {
        sender: "bot",
        text: "Sorry, there was an error processing your request.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && (
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
          onClick={toggleChat}
        >
          <FaRobot size={24} />
        </button>
      )}

      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-xl rounded-xl flex flex-col overflow-hidden">
          <div className="bg-blue-600 text-white flex justify-between items-center p-3">
            <h2 className="text-lg font-semibold">HealthTalk AI</h2>
            <FaTimes className="cursor-pointer" onClick={toggleChat} />
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-xs ${
                  msg.sender === "user"
                    ? "bg-blue-100 self-end text-right"
                    : "bg-gray-200 self-start text-left"
                }`}
              >
                {msg.sender === "bot" ? (
                  <TruncatedMessage text={msg.text} />
                ) : (
                  msg.text
                )}
              </div>
            ))}
            {isTyping && (
              <div className="p-2 rounded-lg max-w-xs bg-gray-200 self-start text-left italic text-gray-500">
                Typing...
              </div>
            )}
          </div>

          {showCommonQuestions && (
            <div className="p-2 border-t bg-gray-100">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold">Common Questions:</p>
                <button
                  onClick={() => setShowCommonQuestions(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {commonQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleCommonQuestionClick(question)}
                    className="bg-gray-200 text-sm px-3 py-1 rounded-full hover:bg-gray-300"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center p-2 border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border rounded-l-full focus:outline-none"
            />
            <button
              onClick={() => generate()}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-full hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
