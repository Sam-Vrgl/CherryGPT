'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sessionId, setSessionId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Grab sessionId and optional initial bot message from URL query
  useEffect(() => {
    const sId = searchParams.get('sessionId');
    const initialBotMessage = searchParams.get('message');

    if (!sId) {
      // If no sessionId found, redirect to registration or handle error
      router.push('/registration');
      return;
    }

    setSessionId(sId);

    // If the backend returned the first message upon registration,
    // display it as the first bot message
    if (initialBotMessage) {
      setChatHistory([{ sender: 'bot', text: initialBotMessage }]);
    }
  }, [router, searchParams]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sessionId) return;

    // Append user message to the chat
    setChatHistory((prev) => [...prev, { sender: 'user', text: message }]);

    try {
      // Call the external API for the next response
      const res = await fetch('http://localhost:3030/chat/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors', // if your backend is configured to allow CORS
        body: JSON.stringify({
          sessionId,
          userResponse: message,
        }),
      });

      const data = await res.json();

      // The backend sends back { "message": "..." }
      setChatHistory((prev) => [...prev, { sender: 'bot', text: data.message }]);
    } catch (error) {
      console.error('Error calling external API:', error);
    } finally {
      // Clear the input
      setMessage('');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#121212',
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
            Organoid Research Helper
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
    </div>
  );
}
