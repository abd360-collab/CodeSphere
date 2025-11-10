import React, { useState } from 'react';
import axios from 'axios';

const AIAssistant = ({ currentCode, language, onCodeInsert }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('suggest');

//   

const handleSuggest = async () => {
  if (!prompt.trim()) return;
  
  setLoading(true);
  try {
    const res = await axios.post('/api/ai/generate', {
      prompt,
      language
    });
    setResponse(res.data.code);  // Updated response key!
  } catch (error) {
    setResponse('Error getting suggestion');
  } finally {
    setLoading(false);
  }
};


  const handleReview = async () => {
    if (!currentCode) return;
    
    setLoading(true);
    try {
      const res = await axios.post('/api/ai/review', {
        code: currentCode,
        language
      });
      setResponse(res.data.review);
    } catch (error) {
      setResponse('Error reviewing code');
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!currentCode) return;
    
    setLoading(true);
    try {
      const res = await axios.post('/api/ai/explain', {
        code: currentCode,
        language
      });
      setResponse(res.data.explanation);
    } catch (error) {
      setResponse('Error explaining code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('suggest')}
          className={`flex-1 py-2 ${activeTab === 'suggest' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          🤖 AI Suggest
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`flex-1 py-2 ${activeTab === 'review' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          🔍 Review
        </button>
        <button
          onClick={() => setActiveTab('explain')}
          className={`flex-1 py-2 ${activeTab === 'explain' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          💡 Explain
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 overflow-auto">
        {activeTab === 'suggest' && (
          <>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask AI: 'Write a function to reverse a string'"
              className="w-full p-2 border rounded mb-2"
              rows={3}
            />
            <button
              onClick={handleSuggest}
              disabled={loading}
              className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? 'Thinking...' : 'Get Suggestion'}
            </button>
          </>
        )}

        {activeTab === 'review' && (
          <button
            onClick={handleReview}
            disabled={loading || !currentCode}
            className="bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? 'Reviewing...' : 'Review Current Code'}
          </button>
        )}

        {activeTab === 'explain' && (
          <button
            onClick={handleExplain}
            disabled={loading || !currentCode}
            className="bg-purple-500 text-white py-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
          >
            {loading ? 'Analyzing...' : 'Explain Current Code'}
          </button>
        )}

        {/* Response */}
        {response && (
          <div className="mt-4 p-4 bg-gray-50 rounded border">
            <pre className="whitespace-pre-wrap text-sm">{response}</pre>
            {activeTab === 'suggest' && (
              <button
                onClick={() => onCodeInsert(response)}
                className="mt-2 bg-blue-500 text-white px-4 py-1 rounded text-sm"
              >
                Insert Code
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;