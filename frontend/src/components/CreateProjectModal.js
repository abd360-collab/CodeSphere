// // 📌 Big Picture First

// // This component is a popup modal that appears on top of the Dashboard when the user clicks “Create Project”.
// // It’s basically a form in a modal where the user types:
// // Project Name (required)
// // Description (optional)
// // Language (dropdown select)
// // When the form is submitted, it calls a function given by Dashboard (onSubmit) which makes the backend API request.

// // So:
// // ➡️ Dashboard controls the “what happens” (API call + updating project list + navigating).
// // ➡️ CreateProjectModal controls the “UI form” (collecting user input, validation, and passing data back up).



// import React, { useState } from 'react'; // Import useState for local state management.


// // The component receives two props:
// // onClose → function to close the modal (called when Cancel or X button is clicked).
// // onSubmit → function from Dashboard that handles API call and navigation after project creation.
// const CreateProjectModal = ({ onClose, onSubmit }) => {
    
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     language: 'javascript'
//   });


//   const [loading, setLoading] = useState(false);

//  //  A single change handler for all fields using the input’s name attribute as the key, 
//  // a standard “controlled component” pattern. When the user types or selects, 
//  // formData updates and the UI re-renders with the new value.
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // e.preventDefault() stops the browser from navigating/reloading on form submit.
//     setLoading(true);

//     try {
//       await onSubmit(formData);
//     } catch (error) {
//       console.error('Error creating project:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const languages = [
//     { value: 'javascript', label: 'JavaScript', icon: '🟨' },
//     { value: 'python', label: 'Python', icon: '🐍' },
//     { value: 'java', label: 'Java', icon: '☕' },
//     { value: 'cpp', label: 'C++', icon: '⚙️' },
//     { value: 'html', label: 'HTML', icon: '🌐' },
//     { value: 'css', label: 'CSS', icon: '🎨' },
//     { value: 'typescript', label: 'TypeScript', icon: '🔷' },
//     { value: 'json', label: 'JSON', icon: '📄' }
//   ];

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm sm:max-w-md md:max-w-lg">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-xl font-bold text-gray-900">Create New Project</h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//               Project Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               required
//               className="mt-1 input-field"
//               placeholder="Enter project name"
//               value={formData.name}
//               onChange={handleChange}
//             />
//           </div>

//           <div>
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//               Description (Optional)
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               rows={3}
//               className="mt-1 input-field"
//               placeholder="Enter project description"
//               value={formData.description}
//               onChange={handleChange}
//             />
//           </div>

//           <div>
//             <label htmlFor="language" className="block text-sm font-medium text-gray-700">
//               Programming Language
//             </label>
//             <select
//               id="language"
//               name="language"
//               className="mt-1 input-field"
//               value={formData.language}
//               onChange={handleChange}
//             >
//               {languages.map((lang) => (
//                 <option key={lang.value} value={lang.value}>
//                   {lang.icon} {lang.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="btn-secondary"
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="btn-primary"
//               disabled={loading || !formData.name}
//             >
//               {loading ? 'Creating...' : 'Create Project'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateProjectModal;





// // ✅ Flow Summary

// // Dashboard shows modal → passes onSubmit & onClose.
// // User fills form (state updates via handleChange).
// // User clicks "Create Project".
// // handleSubmit calls onSubmit(formData).
// // Dashboard does the real work (POST to backend, add project to list, navigate to editor).
// // Modal closes.



import React, { useState } from 'react';

const CreateProjectModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    language: 'javascript'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);
    try {
      // Dashboard.js receives this and handles the axios.post
      await onSubmit(formData);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'typescript', label: 'TypeScript', icon: '🔷' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'cpp', label: 'C++', icon: '⚙️' },
    { value: 'html', label: 'HTML', icon: '🌐' },
    { value: 'css', label: 'CSS', icon: '🎨' },
    { value: 'json', label: 'JSON', icon: '📄' }
  ];

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-800">New Project</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Project Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              autoFocus
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-800 placeholder-gray-400"
              placeholder="e.g. My Awesome App"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Description <span className="text-gray-300 font-normal">(Optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-800 placeholder-gray-400 resize-none"
              placeholder="What is this project about?"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="language" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Environment / Language
            </label>
            <div className="relative">
              <select
                id="language"
                name="language"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none appearance-none transition-all text-gray-800 cursor-pointer"
                value={formData.language}
                onChange={handleChange}
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.icon} &nbsp; {lang.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all disabled:bg-gray-300 disabled:shadow-none flex items-center"
              disabled={loading || !formData.name.trim()}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;