import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, MessageCircle, Loader2 } from "lucide-react";

import { chatWithAssistant } from "../../api/ai.api";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your Inventory Assistant. How can I help you today?",
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    const message = input.trim();

    if (!message || loading) return;

    const userMessage = {
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await chatWithAssistant(message);

      /*
        Change this after you show me
        the backend response shape.
    */

      const aiResponse =
        res.data.data.message || res.data.data.response || res.data.data;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiResponse,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong while contacting the assistant.",
        },
      ]);

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transition flex items-center justify-center"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-full text-white">
                <Bot size={18} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Inventory Assistant
                </h3>

                <p className="text-xs text-slate-500">AI powered assistant</p>
              </div>
            </div>

            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3 flex gap-2">
            <textarea
              rows={1}
              style={{
                maxHeight: "120px",
              }}
              value={input}
              disabled={loading}
              placeholder="Ask anything..."
              onChange={(e) => {
                setInput(e.target.value);

                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Send size={18} />
              )}
            </button>
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl px-4 py-3 text-sm text-slate-500 flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Thinking...
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
