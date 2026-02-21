// src/components/Generator.js
import React, { useState } from 'react';
import axios from 'axios';

const Generator = () => {
  const [courseData, setCourseData] = useState({ title: '', level: 'Introductory' });
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    // Note: You'd pass the Firebase Auth token in headers here
    const response = await axios.post('http://localhost:8080/api/generate', courseData);
    setResult(response.data);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">CurricuForge AI</h1>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
        <input 
          className="w-full border p-2 mb-4 rounded"
          placeholder="Course Title (e.g. Cloud Computing)"
          onChange={(e) => setCourseData({...courseData, title: e.target.value})}
        />
        <button 
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Generate Industry-Aligned Syllabus
        </button>
      </div>

      {result && (
        <div className="mt-8 p-6 bg-white rounded shadow">
          <h2 className="text-xl font-bold">{result.course_name}</h2>
          <pre className="whitespace-pre-wrap mt-4">{result.content}</pre>
        </div>
      )}
    </div>
  );
};

export default Generator;