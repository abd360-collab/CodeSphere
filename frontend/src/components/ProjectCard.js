// // 📌 Purpose of ProjectCard.js

// // This component displays one project inside the Dashboard grid.
// // It shows:
// // Project name, description, and language icon.
// // User’s role in that project (Owner, Editor, Viewer).
// // Member count.
// // Last updated date.
// // A delete button (only visible if you are the project owner).
// // An “Open” button to go to the project editor page.

// // So: Dashboard.js maps over the list of projects → for each one, it renders a ProjectCard.

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Our authentication context → gives access to logged-in user info (user).

// const ProjectCard = ({ project, onDelete }) => {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const isOwner = project.owner._id === user.id;
//   const userRole = project.members.find(member => member.user._id === user.id)?.role;

//   const getRoleBadgeColor = (role) => {
//     switch (role) {
//       case 'owner':
//         return 'bg-purple-100 text-purple-800';
//       case 'editor':
//         return 'bg-blue-100 text-blue-800';
//       case 'viewer':
//         return 'bg-gray-100 text-gray-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

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
//     <div className="card hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer p-5">
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <div className="flex items-center space-x-3">
//             <span className="text-3xl">{getLanguageIcon(project.language)}</span>
//             <h3 className="text-lg font-semibold text-gray-900 truncate">
//               {project.name}
//             </h3>
//           </div>
//           {project.description && (
//             <p className="mt-2 text-sm text-gray-600 line-clamp-2">
//               {project.description}
//             </p>
//           )}
//           <div className="mt-3 flex items-center space-x-2">
//             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(userRole)}`}>
//               {userRole}
//             </span>
//             <span className="text-xs text-gray-400">
//               {project.members.length} member{project.members.length !== 1 ? 's' : ''}
//             </span>
//           </div>
//         </div>
//         {isOwner && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onDelete(project._id);
//             }}
//             className="text-red-400 hover:text-red-600 transition-colors"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//             </svg>
//           </button>
//         )}
//       </div>
      
//       <div className="mt-4 flex items-center justify-between">
//         <div className="text-xs text-gray-400">
//           Updated {new Date(project.updatedAt).toLocaleDateString()}
//         </div>
//         <button
//           onClick={() => navigate(`/project/${project._id}`)}
//           className="btn-primary text-sm py-1 px-3"
//         >
//           Open
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProjectCard;



import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProjectCard = ({ project, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ✅ FIX: Changed project.owner._id to project.owner.id
  const isOwner = project.owner.id === user.id;

  // ✅ FIX: Changed member.user._id to member.userId (or member.user.id)
  // Based on your JSON, 'userId' is available at the top level of the member object.
  const userRole = project.members.find(member => member.userId === user.id)?.role;

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 p-5 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{getLanguageIcon(project.language)}</span>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {project.name}
            </h3>
          </div>
          {project.description && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {project.description}
            </p>
          )}
          <div className="mt-3 flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(userRole)}`}>
              {userRole}
            </span>
            <span className="text-xs text-gray-400">
              {project.members.length} member{project.members.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        {/* ✅ FIX: Changed project._id to project.id */}
        {isOwner && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id);
            }}
            className="text-red-400 hover:text-red-600 transition-colors p-1"
            title="Delete Project"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-400">
          Updated {new Date(project.updatedAt).toLocaleDateString()}
        </div>
        {/* ✅ FIX: Changed project._id to project.id */}
        <button
          onClick={() => navigate(`/project/${project.id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-4 rounded-lg transition-colors"
        >
          Open
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;