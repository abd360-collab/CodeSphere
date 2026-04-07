// import React, { useState } from 'react';
// import axios from 'axios';

// const AIAssistant = ({ currentCode, language, onCodeInsert }) => {
//   const [prompt, setPrompt] = useState('');
//   const [response, setResponse] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('suggest');

// //   

// const handleSuggest = async () => {
//   if (!prompt.trim()) return;
  
//   setLoading(true);
//   try {
//     const res = await axios.post('/api/ai/generate', {
//       prompt,
//       language
//     });
//     setResponse(res.data.code);  // Updated response key!
//   } catch (error) {
//     setResponse('Error getting suggestion');
//   } finally {
//     setLoading(false);
//   }
// };


//   const handleReview = async () => {
//     if (!currentCode) return;
    
//     setLoading(true);
//     try {
//       const res = await axios.post('/api/ai/review', {
//         code: currentCode,
//         language
//       });
//       setResponse(res.data.review);
//     } catch (error) {
//       setResponse('Error reviewing code');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExplain = async () => {
//     if (!currentCode) return;
    
//     setLoading(true);
//     try {
//       const res = await axios.post('/api/ai/explain', {
//         code: currentCode,
//         language
//       });
//       setResponse(res.data.explanation);
//     } catch (error) {
//       setResponse('Error explaining code');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="h-full flex flex-col bg-white border-l">
//       {/* Tabs */}
//       <div className="flex border-b">
//         <button
//           onClick={() => setActiveTab('suggest')}
//           className={`flex-1 py-2 ${activeTab === 'suggest' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
//         >
//           🤖 AI Suggest
//         </button>
//         <button
//           onClick={() => setActiveTab('review')}
//           className={`flex-1 py-2 ${activeTab === 'review' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
//         >
//           🔍 Review
//         </button>
//         <button
//           onClick={() => setActiveTab('explain')}
//           className={`flex-1 py-2 ${activeTab === 'explain' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
//         >
//           💡 Explain
//         </button>
//       </div>

//       {/* Content */}
//       <div className="flex-1 flex flex-col p-4 overflow-auto">
//         {activeTab === 'suggest' && (
//           <>
//             <textarea
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//               placeholder="Ask AI: 'Write a function to reverse a string'"
//               className="w-full p-2 border rounded mb-2"
//               rows={3}
//             />
//             <button
//               onClick={handleSuggest}
//               disabled={loading}
//               className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
//             >
//               {loading ? 'Thinking...' : 'Get Suggestion'}
//             </button>
//           </>
//         )}

//         {activeTab === 'review' && (
//           <button
//             onClick={handleReview}
//             disabled={loading || !currentCode}
//             className="bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
//           >
//             {loading ? 'Reviewing...' : 'Review Current Code'}
//           </button>
//         )}

//         {activeTab === 'explain' && (
//           <button
//             onClick={handleExplain}
//             disabled={loading || !currentCode}
//             className="bg-purple-500 text-white py-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
//           >
//             {loading ? 'Analyzing...' : 'Explain Current Code'}
//           </button>
//         )}

//         {/* Response */}
//         {response && (
//           <div className="mt-4 p-4 bg-gray-50 rounded border">
//             <pre className="whitespace-pre-wrap text-sm">{response}</pre>
//             {activeTab === 'suggest' && (
//               <button
//                 onClick={() => onCodeInsert(response)}
//                 className="mt-2 bg-blue-500 text-white px-4 py-1 rounded text-sm"
//               >
//                 Insert Code
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AIAssistant;




import React, { useState } from 'react';
import api from '../utils/api'; // ✅ Use the custom API utility with base URL
import { toast } from 'react-toastify';

const AIAssistant = ({ currentCode, language, onCodeInsert }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('suggest');

  // Helper to handle API calls and prevent repetition
  const handleAICall = async (endpoint, payload, responseKey) => {
    setLoading(true);
    setResponse(''); // Clear previous response
    try {
      const res = await api.post(endpoint, payload);
      // Access the specific key (code, review, or explanation)
      setResponse(res.data[responseKey]);
    } catch (error) {
      const msg = error.response?.data?.message || 'AI is currently unavailable';
      toast.error(msg);
      setResponse(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggest = () => {
    if (!prompt.trim()) return toast.warn('Please enter a prompt');
    handleAICall('/api/ai/generate', { prompt, language }, 'code');
  };

  const handleReview = () => {
    if (!currentCode) return toast.warn('No code to review');
    handleAICall('/api/ai/review', { code: currentCode, language }, 'review');
  };

  const handleExplain = () => {
    if (!currentCode) return toast.warn('No code to explain');
    handleAICall('/api/ai/explain', { code: currentCode, language }, 'explanation');
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Tabs */}
      <div className="flex border-b text-sm font-medium">
        <button
          onClick={() => setActiveTab('suggest')}
          className={`flex-1 py-3 transition-colors ${activeTab === 'suggest' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
        >
          🤖 Suggest
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`flex-1 py-3 transition-colors ${activeTab === 'review' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
        >
          🔍 Review
        </button>
        <button
          onClick={() => setActiveTab('explain')}
          className={`flex-1 py-3 transition-colors ${activeTab === 'explain' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
        >
          💡 Explain
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        {activeTab === 'suggest' && (
          <div className="space-y-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask AI: 'Write a React component for a login form'..."
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              rows={4}
            />
            <button
              onClick={handleSuggest}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {loading ? 'AI is thinking...' : 'Generate Code'}
            </button>
          </div>
        )}

        {(activeTab === 'review' || activeTab === 'explain') && (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
              This will analyze the code currently in your editor window.
            </div>
            <button
              onClick={activeTab === 'review' ? handleReview : handleExplain}
              disabled={loading || !currentCode}
              className={`w-full py-2 rounded-lg font-semibold text-white shadow-sm transition-colors disabled:bg-gray-300
                ${activeTab === 'review' ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              {loading ? 'Analyzing...' : `Perform ${activeTab === 'review' ? 'Review' : 'Explanation'}`}
            </button>
          </div>
        )}

        {/* Response Area */}
        {response && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Response</span>
              <button 
                onClick={() => setResponse('')}
                className="text-xs text-red-500 hover:underline"
              >
                Clear
              </button>
            </div>
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 shadow-inner">
              <pre className="whitespace-pre-wrap text-sm text-gray-100 font-mono leading-relaxed">
                {response}
              </pre>
              
              {activeTab === 'suggest' && (
                <button
                  onClick={() => {
                    onCodeInsert(response);
                    toast.success('Code inserted!');
                  }}
                  className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  Insert into Editor
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading Spinner for Response */}
        {loading && !response && (
          <div className="mt-10 flex flex-col items-center justify-center text-gray-400 space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-xs">Processing request...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;