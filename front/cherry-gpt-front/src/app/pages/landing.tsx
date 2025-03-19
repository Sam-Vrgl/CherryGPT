'use client';

import React from 'react';
import { useRouter } from 'next/navigation';


export default function LandingClient() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/registration');
  };
  return (
    <>
     <div className="container">
        <h1>Welcome to Do You Organoid</h1>
        <p>
          My mission is to help you discover which organoid solution is best suited
          to help you with your scientific research.
        </p>
        <p>
          To do that I have analysed over 70 companies around the world building
          innovative organoids and micro physiological solutions.
        </p>
        <p>
          I will ask you some simple questions and then, if relevant, recommend you
          the best tools out there.
        </p>
        <p>Are you ready to start?</p>
        <button onClick={handleStart}>Yes</button>
      </div>
    </>
  );
}
