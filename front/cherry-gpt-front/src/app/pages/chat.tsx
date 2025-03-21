// pages/chat.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatPage() {
  const [sessionId, setSessionId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Append user message to chat
    setChatHistory((prev) => [...prev, { sender: 'user', text: message }]);

    try {
      // Call the external API directly
      const res = await fetch('http://localhost:3000/chat/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          userResponse: message,
        }),
      });

      const data = await res.json();

      // Append the bot's response to chat
      setChatHistory((prev) => [...prev, { sender: 'bot', text: data.botResponse }]);
    } catch (error) {
      console.error('Error calling external API:', error);
    } finally {
      // Clear input
      setMessage('');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h1>Chatbot</h1>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '1rem',
          height: '400px',
          overflowY: 'scroll',
          marginBottom: '1rem',
        }}
      >
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === 'user' ? 'right' : 'left',
              marginBottom: '0.5rem',
            }}
          >
            <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ width: '80%', padding: '0.5rem' }}
          required
        />
        <button type="submit" style={{ width: '18%', padding: '0.5rem', marginLeft: '2%' }}>
          Send
        </button>
      </form>
    </div>
  );
}
