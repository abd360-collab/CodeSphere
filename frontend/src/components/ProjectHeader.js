// // Big Picture: What is ProjectHeader?
// // Think of it like the top navigation bar of your editor page.
// // It shows:
// // A back button (to go to dashboard).
// // Project’s name, description, and language icon
// // Who’s online (avatars + count).
// // Who is typing right now (typing indicator).
// // Buttons to save code and manage members.
// // So it’s basically your control panel for the project.






// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const ProjectHeader = ({ 
//   project, 
//   onlineUsers, 
//   typingUsers, 
//   onSave, 
//   onManageMembers, 
//   canManageMembers 
// }) => {
//   const navigate = useNavigate();

//   const getLanguageIcon = (language) => {
//     const icons = {
//       javascript: '🟨',
//       python: '🐍',
//       java: '☕',
//       cpp: '⚙️',
//       html: '🌐',
//       css: '🎨',
//       typescript: '🔷',
//       json: '📄'
//     };
//     return icons[language] || '📝';
//   };

//   return (
//     <header className="bg-white shadow-sm border-b border-gray-200">
//       <div className="px-4 py-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">


//                {/* This is the back arrow button.
// When clicked → takes you back to /dashboard.
// The arrow is drawn with an inline SVG (like an icon). */}
//             <button
//               onClick={() => navigate('/dashboard')}
//               className="text-gray-500 hover:text-gray-700"
//             >

//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>
         


//             <div className="flex items-center space-x-2">
//               <span className="text-2xl">{getLanguageIcon(project.language)}</span>
//               <div>
//                 <h1 className="text-xl font-semibold text-gray-900">
//                   {project.name}
//                 </h1>
//                 {project.description && (
//                   <p className="text-sm text-gray-600">{project.description}</p>
//                 )}
//               </div>
//             </div>
//           </div>





// {/* It shows avatars of users currently online.
// How avatars are shown:
// Each user → a small circle with the first letter of their username.
// If more than 3 users are online → it shows +2 (or however many extra).
// On hover, the username is displayed (title={user.username}).
// Beside it → total number of online users.
// So it feels like a mini presence indicator (like Google Docs showing who’s in the doc). */}
//           <div className="flex items-center space-x-4">
//             {/* Online Users */}
//             <div className="flex items-center space-x-2">
//               <div className="flex -space-x-2">
//                 {onlineUsers.slice(0, 3).map((user) => (
//                   <div
//                     key={user.id}
//                     className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white"
//                     title={user.username}
//                   >
//                     {user.username.charAt(0).toUpperCase()}
//                   </div>
//                 ))}
//                 {onlineUsers.length > 3 && (
//                   <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
//                     +{onlineUsers.length - 3}
//                   </div>
//                 )}
//               </div>
//               <span className="text-sm text-gray-600">
//                 {onlineUsers.length} online
//               </span>
//             </div>




// {/* 
// If anyone is typing, it shows:
// Alice is typing... (if one user).
// Alice, Bob are typing... (if multiple).
// It makes collaboration feel alive. */}
//             {/* Typing Indicator */}
//             {typingUsers.length > 0 && (
//               <div className="text-sm text-gray-500">
//                 {typingUsers.map(u => u.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
//               </div>
//             )}



// {/* 

// Two buttons on the right:
// Save → calls the function onSave (this function is defined in ProjectEditor to save code).
// Manage Members → only shows if canManageMembers is true (meaning you’re the project owner). */}
//             {/* Action Buttons */}
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={onSave}
//                 className="btn-primary text-sm py-1 px-3"
//               >
//                 Save
//               </button>
              
//               {canManageMembers && (
//                 <button
//                   onClick={onManageMembers}
//                   className="btn-secondary text-sm py-1 px-3"
//                 >
//                   Manage Members
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default ProjectHeader;


import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectHeader = ({ 
  project, 
  // ✅ FIX: Added default empty arrays to prevent .length crashes
  onlineUsers = [], 
  typingUsers = [], 
  onSave, 
  onManageMembers, 
  canManageMembers 
}) => {
  const navigate = useNavigate();

  // Safety check: if project hasn't loaded yet, show a placeholder
  if (!project) return <div className="h-16 bg-white border-b animate-pulse" />;

  const getLanguageIcon = (language) => {
    const icons = {
      javascript: '🟨',
      python: '🐍',
      java: '☕',
      cpp: '⚙️',
      html: '🌐',
      css: '🎨',
      typescript: '🔷',
      json: '📄'
    };
    return icons[language?.toLowerCase()] || '📝';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              title="Back to Dashboard"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Project Info */}
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getLanguageIcon(project.language)}</span>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">
                  {project.name}
                </h1>
                {project.description && (
                  <p className="text-xs text-gray-500 truncate max-w-xs">
                    {project.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Typing Indicator */}
            <div className="hidden md:block min-w-[150px] text-right">
              {typingUsers.length > 0 && (
                <div className="text-xs text-blue-500 italic animate-pulse">
                  {typingUsers.map(u => u.username).join(', ')} 
                  {typingUsers.length === 1 ? ' is' : ' are'} typing...
                </div>
              )}
            </div>

            {/* Online Users Avatars */}
            <div className="flex items-center space-x-3 border-l pl-6 border-gray-200">
              <div className="flex -space-x-2">
                {onlineUsers.slice(0, 3).map((user) => (
                  <div
                    key={user.id}
                    className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm"
                    title={`${user.username} (Online)`}
                  >
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                ))}
                {onlineUsers.length > 3 && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold border-2 border-white">
                    +{onlineUsers.length - 3}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-700">
                  {onlineUsers.length} Online
                </span>
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 border-l pl-6 border-gray-200">
              <button
                onClick={onSave}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-1.5 px-4 rounded-lg transition-colors shadow-sm"
              >
                Save
              </button>
              
              {canManageMembers && (
                <button
                  onClick={onManageMembers}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold py-1.5 px-4 rounded-lg transition-colors shadow-sm"
                >
                  Manage
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProjectHeader;