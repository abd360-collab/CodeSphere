// 📌 Big Picture First

// This component is a popup modal that appears on top of the Dashboard when the user clicks “Create Project”.
// It’s basically a form in a modal where the user types:
// Project Name (required)
// Description (optional)
// Language (dropdown select)
// When the form is submitted, it calls a function given by Dashboard (onSubmit) which makes the backend API request.

// So:
// ➡️ Dashboard controls the “what happens” (API call + updating project list + navigating).
// ➡️ CreateProjectModal controls the “UI form” (collecting user input, validation, and passing data back up).



import React, { useState } from 'react'; // Import useState for local state management.


// The component receives two props:
// onClose → function to close the modal (called when Cancel or X button is clicked).
// onSubmit → function from Dashboard that handles API call and navigation after project creation.
const CreateProjectModal = ({ onClose, onSubmit }) => {
    
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    language: 'javascript'
  });


  const [loading, setLoading] = useState(false);

 //  A single change handler for all fields using the input’s name attribute as the key, 
 // a standard “controlled component” pattern. When the user types or selects, 
 // formData updates and the UI re-renders with the new value.
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // e.preventDefault() stops the browser from navigating/reloading on form submit.
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'cpp', label: 'C++', icon: '⚙️' },
    { value: 'html', label: 'HTML', icon: '🌐' },
    { value: 'css', label: 'CSS', icon: '🎨' },
    { value: 'typescript', label: 'TypeScript', icon: '🔷' },
    { value: 'json', label: 'JSON', icon: '📄' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm sm:max-w-md md:max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Create New Project</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 input-field"
              placeholder="Enter project name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="mt-1 input-field"
              placeholder="Enter project description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
              Programming Language
            </label>
            <select
              id="language"
              name="language"
              className="mt-1 input-field"
              value={formData.language}
              onChange={handleChange}
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.icon} {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !formData.name}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;





// ✅ Flow Summary

// Dashboard shows modal → passes onSubmit & onClose.
// User fills form (state updates via handleChange).
// User clicks "Create Project".
// handleSubmit calls onSubmit(formData).
// Dashboard does the real work (POST to backend, add project to list, navigate to editor).
// Modal closes.