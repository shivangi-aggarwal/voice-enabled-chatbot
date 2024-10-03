"use client";

import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Chatbot = () => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [response, setResponse] = useState('');

  // Function to start listening when spacebar is held
  const startListening = () => SpeechRecognition.startListening({ continuous: false });

  // Function to handle speech recognition and response
  const handleSend = () => {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(transcript);
    synth.speak(utterThis);
    setResponse(transcript);
  };

  // Function to clear both transcript and response
  const handleClear = () => {
    resetTranscript();
    setResponse('');
  };

  // Add event listeners for spacebar press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.keyCode === 32) {
        startListening();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.keyCode === 32) {
        SpeechRecognition.stopListening();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">CognoTools ChatterBox</h1>

        {/* Transcript Section */}
        <div className="flex items-center space-x-2 border border-gray-300 p-4 rounded-md shadow-sm bg-white">
          <button 
            className={`p-3 rounded-full text-white transition ${
              listening ? 'bg-red-500 animate-pulse' : 'bg-blue-500 hover:bg-blue-700'
            }`}
            onMouseDown={startListening} 
            onMouseUp={SpeechRecognition.stopListening}
          >
            🎤
          </button>
          <div className="flex-1">
            <p className="text-gray-600 font-bold"><strong>Transcript:</strong></p>
            <p className="text-lg text-gray-800 font-semibold">{transcript || "Hold the mic button or press the spacebar to speak"}</p>
          </div>
        </div>

        {/* Send & Clear Buttons */}
        <div className="flex space-x-4 justify-center">
          <button 
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300"
            onClick={handleSend}
          >
            Send
          </button>
          <button 
            className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-300"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>

        {/* Chat Response Section */}
        <div className="p-4 bg-gray-50 rounded-md shadow-inner border border-gray-200">
          <p className="text-gray-600 font-bold"><strong>Response:</strong></p>
          <p className="text-lg text-gray-800 font-semibold">{response || "The response will appear here."}</p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
