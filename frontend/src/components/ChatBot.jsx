import React, { useContext, useState } from "react";
import { Send, MessageCircle, Bot } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const ChatBot = ({ productId }) => {


    const { verifyUser, user, setUser, } = useContext(AuthContext)

    const [messages, setMessages] = useState([]);


    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [openChatbot, setOpenChatbot] = useState(false);


    async function handleSend() {

        if (!input.trim()) return;

        const userMessage = {
            id: Date.now(),
            sender: "user",
            text: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true)

        try {
            const response = await axios({
                method: 'post',
                url: `${import.meta.env.VITE_BASE_URL}/chatBot/message/${productId}`,
                data: { input },
                withCredentials: true
            })
            const { success, reply } = response.data;
            if (success) {
                const botMessage = {
                    id: Date.now() + 1,
                    sender: "bot",
                    text: reply
                };

                setMessages(prev => [...prev, botMessage]);
            }
        }
        catch (error) {
            setMessages(prev => [
                ...prev,
                { id: Date.now() + 2, sender: "bot", text: "⚠️ Something went wrong." }
            ]);
            console.error('ChatBot API error', error)
        }
        finally {
            setLoading(false)
        }
    }


    function handleChatbot() {
        if (openChatbot === true) {
            setOpenChatbot(false)
        }
        else {
            setOpenChatbot(true)
        }
    }

    return (
        <div className="max-w-7xl mx-auto mt-5 flex-col items-center justify-center pt-4">

            <button
                onClick={handleChatbot}
                className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0focus:outline-nonefocus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 mb-5"
            >
                {openChatbot ? "Close chatBot" : "Chat with AI"}
            </button>

            {/* chatbot */}
            {openChatbot && (<div className="w-full bg-white rounded-2xl shadow-lg flex flex-col">

                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white">
                    <MessageCircle size={22} />
                    <h2 className="font-semibold">Chat Support</h2>
                </div>


                {/* Messages Area */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                    <div className="text-center text-black text-lg font-bold">
                        <Bot className="mx-auto mb-2" />
                        {`Hey ${user?.name}`}
                    </div>

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}
                        >
                            <div
                                className={`px-4 py-2 rounded-xl text-sm max-w-[75%] ${msg.sender === "bot"
                                    ? "bg-gray-200 text-gray-800 rounded-tl-none"
                                    : "bg-indigo-600 text-white rounded-tr-none"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm italic">
                                Bot is typing...
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="flex items-center gap-2 p-3 border-t">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none"
                    />
                    <button onClick={() => { handleSend() }} className="bg-indigo-600 text-white p-2 rounded-xl">
                        <Send size={18} />
                    </button>
                </div>


            </div>)}

        </div>
    )
}

export default ChatBot
