'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatPage() {
  const [sessionId, setSessionId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Initialize the session and set the first bot message
  useEffect(() => {
    setSessionId(uuidv4());
    // First message from the bot to start the conversation
    setChatHistory([
      {
        sender: 'bot',
        text: 'What aspects of organoid research interest you the most?',
      },
    ]);
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
    <div
      style={{
        backgroundColor: '#121212',
        // Biology-themed background pattern (light grey cells overlay)
        backgroundImage: "url('https://www.transparenttextures.com/patterns/cells.png')",
        backgroundRepeat: 'repeat',
        minHeight: '100vh',
        color: '#fff',
        position: 'relative',
      }}
    >
      {/* Header at top left of the page with Next.js Image */}
      <header
        style={{
          padding: '1rem',
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
          style={{ marginRight: '0.5rem' }}
        />
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Organoid research helper
          </div>
          <div style={{ fontSize: '0.8rem', color: '#ccc' }}>
            (powered by CherryBiotech)
          </div>
        </div>
      </header>

      {/* Centered chat container */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
        <div style={{ width: '100%', maxWidth: '600px', padding: '1rem' }}>
          <div
            style={{
              border: '1px solid #444',
              padding: '1rem',
              height: '400px',
              overflowY: 'scroll',
              marginBottom: '1rem',
              backgroundColor: '#1e1e1e',
            }}
          >
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '0.5rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: msg.sender === 'user' ? '#3b82f6' : '#4b5563',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    maxWidth: '70%',
                  }}
                >
                  <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              style={{
                flexGrow: 1,
                padding: '0.5rem',
                backgroundColor: '#333',
                border: '1px solid #555',
                color: '#fff',
                borderRadius: '4px',
              }}
              required
            />
            <button
              type="submit"
              style={{
                padding: '0.5rem 1rem',
                marginLeft: '1rem',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Short paragraph on Cherry Biotech, positioned to the right of the chat */}
      <div
        style={{
          position: 'absolute',
          top: '80px',
          right: '1rem',
          maxWidth: '300px',
          color: '#fff',
          fontSize: '0.9rem',
          lineHeight: '1.4',
        }}
      >
        <p>
          Cherry Biotech is a pioneering biotechnology company specializing in advanced
          microfluidic and thermal control solutions. Our mission is to empower organoid
          research by providing precise, reliable tools that facilitate complex in vitro
          models, fostering cutting-edge discoveries in biomedical science.
        </p>
      </div>
    </div>
  );
}
