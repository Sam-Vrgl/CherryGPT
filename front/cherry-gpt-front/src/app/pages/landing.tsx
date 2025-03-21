'use client';

import React from 'react';
import Link from 'next/link';
// import Image from 'next/image'; // Commented out for now

export default function LandingClient() {
  return (
    <div
      style={{
        backgroundColor: '#121212',
        backgroundRepeat: 'repeat',
        minHeight: '100vh',
        color: '#fff',
        position: 'relative',
      }}
    >
      {/* Header with logo commented out */}
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
        {/*
        <Image
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
          style={{ marginRight: '0.5rem' }}
        />
        */}
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Organoid Research Helper
          </div>
          <div style={{ fontSize: '0.8rem', color: '#ccc' }}>
            (powered by CherryBiotech)
          </div>
        </div>
      </header>

      {/* Centered content */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '80px' }}>
        <div
          style={{
            width: '100%',
            maxWidth: '600px',
            padding: '1rem',
            border: '2px solid white',
            borderRadius: '8px',
            backgroundColor: '#333',
          }}
        >
          <h1 style={{ textAlign: 'center' }}>Welcome to Do You Organoid</h1>
          <p style={{ textAlign: 'center' }}>
            My mission is to help you discover which organoid solution is best suited
            to help you with your scientific research.
          </p>
          <p style={{ textAlign: 'center' }}>
            To do that I have analysed over 70 companies around the world building
            innovative organoids and micro physiological solutions.
          </p>
          <p style={{ textAlign: 'center' }}>
            I will ask you some simple questions and then, if relevant, recommend you
            the best tools out there.
          </p>
          <p style={{ textAlign: 'center' }}>Are you ready to start?</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <Link href="/chat">
              <button
                style={{
                  fontSize: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Go to Chat
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
