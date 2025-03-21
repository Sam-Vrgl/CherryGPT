'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
}

interface ChangeEvent {
    target: {
        name: string;
        value: string;
    };
}

interface SubmitEvent {
    preventDefault: () => void;
}

const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    // Add your registration logic here (e.g., API call)
    console.log('Registration data:', formData);
};

const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
        ...prev,
        [name]: value,
    }));
};

  return (
    <div
      style={{
        backgroundColor: '#121212',
        backgroundImage: "url('https://www.transparenttextures.com/patterns/cells.png')",
        backgroundRepeat: 'repeat',
        minHeight: '100vh',
        color: '#fff',
        position: 'relative',
      }}
    >
      {/* Header with Next.js Image */}
      <header style={{ padding: '1rem', position: 'absolute', top: 0, left: 0, display: 'flex', alignItems: 'center' }}>
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

      {/* Centered form container */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
        <div style={{ width: '100%', maxWidth: '600px', padding: '1rem' }}>
          <div style={{ border: '1px solid #444', padding: '1rem', backgroundColor: '#1e1e1e', borderRadius: '8px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Register</h1>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="firstName" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  First Name:
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    color: '#fff',
                    borderRadius: '4px',
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="lastName" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Last Name:
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    color: '#fff',
                    borderRadius: '4px',
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Email:
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    color: '#fff',
                    borderRadius: '4px',
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
