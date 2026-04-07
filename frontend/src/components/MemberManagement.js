// // 📌 Big Picture
// // This component (MemberManagement) is a popup window that:
// // Lets you see who is in the project.
// // Lets the owner/editor add new members.
// // Lets you change roles (viewer → editor, etc.).
// // Lets you remove members (but with some restrictions).
// // Shows a guide of what each role means.
// // So basically, it’s like the control panel for team members in a project.



// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext'; // gives us info about the logged-in user.
// import axios from 'axios';
// import { toast } from 'react-toastify';



// // project: the current project details.
// // onClose: closes the popup window.
// // onUpdate: refreshes data after changes.
// // user: who is currently logged in.
// const MemberManagement = ({ project, onClose, onUpdate }) => {
//   const { user } = useAuth();
//   const [showAddMember, setShowAddMember] = useState(false); // controls if the “Add Member” form is visible.
//   const [addMemberData, setAddMemberData] = useState({
//     email: '',
//     role: 'viewer'
//   }); // stores the email + role of the member we’re adding.
//   const [loading, setLoading] = useState(false); // shows if a request (like add/remove) is still happening.


//   // This function runs when the Add Member form is submitted
//   const handleAddMember = async (e) => {
//     e.preventDefault(); // e.preventDefault() stops the page from refreshing (default form behavior).
//  // 👉 So instead of reloading, we handle it with JavaScript.
//     setLoading(true);

//     try {
//       await axios.post(`/api/projects/${project._id}/members`, addMemberData);
//       toast.success('Member added successfully!');
//       setAddMemberData({ email: '', role: 'viewer' }); // Reset the form → clear the email box and set role back to default (viewer).
//       setShowAddMember(false); // Hide the “Add Member” form (collapse it).
//       onUpdate(); // Refresh the members list → so the new person immediately shows up in the UI.
//     } catch (error) {
//       console.error('Error adding member:', error);
//       const message = error.response?.data?.message || 'Failed to add member';
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };



//   // This function is called when you click the remove (trash icon) button next to a member.
//   const handleRemoveMember = async (memberId) => {
//     // A pop-up:
//     if (window.confirm('Are you sure you want to remove this member?')) {
//       try {
//         await axios.delete(`/api/projects/${project._id}/members/${memberId}`);
//         toast.success('Member removed successfully!');
//         onUpdate();
//       } catch (error) {
//         console.error('Error removing member:', error);
//         toast.error('Failed to remove member');
//       }
//     }
//   };



//   const handleRoleChange = async (memberId, newRole) => {
//     try {
//       await axios.put(`/api/projects/${project._id}/members/${memberId}/role`, {
//         role: newRole
//       });
//       toast.success('Member role updated!');
//       onUpdate();
//     } catch (error) {
//       console.error('Error updating role:', error);
//       toast.error('Failed to update member role');
//     }
//   };



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



//   const canRemoveMember = (member) => {
//     // Can't remove owner
//     if (member.role === 'owner') return false;
//     // Can't remove yourself
//     if (member.user._id === user.id) return false;
//     return true;
//   };



//   const canChangeRole = (member) => {
//     // Can't change owner's role
//     if (member.role === 'owner') return false;
//     return true;
//   };



//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//       <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
//         <div className="mt-3">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-medium text-gray-900">Manage Members</h3>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>



//           {/* Add Member Section */}
//           <div className="mb-6">
//             <button
//               onClick={() => setShowAddMember(!showAddMember)}
//               className="btn-primary"
//             >
//               Add Member
//             </button>

//             {showAddMember && (
//               <form onSubmit={handleAddMember} className="mt-4 p-4 bg-gray-50 rounded-lg">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       id="email"
//                       required
//                       className="mt-1 input-field"
//                       placeholder="Enter member's email"
//                       value={addMemberData.email}
//                       onChange={(e) => setAddMemberData({
//                         ...addMemberData,
//                         email: e.target.value
//                       })}
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="role" className="block text-sm font-medium text-gray-700">
//                       Role
//                     </label>
//                     <select
//                       id="role"
//                       className="mt-1 input-field"
//                       value={addMemberData.role}
//                       onChange={(e) => setAddMemberData({
//                         ...addMemberData,
//                         role: e.target.value
//                       })}
//                     >
//                       <option value="viewer">Viewer</option>
//                       <option value="editor">Editor</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="flex justify-end space-x-2 mt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowAddMember(false)}
//                     className="btn-secondary"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="btn-primary"
//                   >
//                     {loading ? 'Adding...' : 'Add Member'}
//                   </button>
//                 </div>
//               </form>
//             )}
//           </div>

//           {/* Members List */}
//           <div className="space-y-3">
//             <h4 className="text-md font-medium text-gray-900">Current Members</h4>
//             {project.members.map((member) => (
//               <div
//                 key={member._id}
//                 className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//               >
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
//                     {member.user.username.charAt(0).toUpperCase()}
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-900">{member.user.username}</p>
//                     <p className="text-sm text-gray-600">{member.user.email}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <select
//                     value={member.role}
//                     onChange={(e) => handleRoleChange(member.user._id, e.target.value)}
//                     disabled={!canChangeRole(member)}
//                     className={`text-sm px-2 py-1 rounded border ${
//                       canChangeRole(member) 
//                         ? 'bg-white border-gray-300' 
//                         : 'bg-gray-100 border-gray-200 cursor-not-allowed'
//                     }`}
//                   >
//                     <option value="viewer">Viewer</option>
//                     <option value="editor">Editor</option>
//                     <option value="owner">Owner</option>
//                   </select>

//                   {canRemoveMember(member) && (
//                     <button
//                       onClick={() => handleRemoveMember(member.user._id)}
//                       className="text-red-500 hover:text-red-700 p-1"
//                     >
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                       </svg>
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Role Descriptions */}
//           <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//             <h5 className="font-medium text-blue-900 mb-2">Role Permissions</h5>
//             <div className="space-y-1 text-sm text-blue-800">
//               <p><strong>Owner:</strong> Full access - can edit code, manage members, and delete project</p>
//               <p><strong>Editor:</strong> Can edit code and send messages</p>
//               <p><strong>Viewer:</strong> Can only view code and read messages</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MemberManagement;




import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api'; // ✅ Use custom api utility
import { toast } from 'react-toastify';

const MemberManagement = ({ project, onClose, onUpdate }) => {
  const { user: currentUser } = useAuth();
  const [showAddMember, setShowAddMember] = useState(false);
  const [addMemberData, setAddMemberData] = useState({
    email: '',
    role: 'viewer'
  });
  const [loading, setLoading] = useState(false);

  // Determine current user's role in this project for UI permissions
  const currentUserMemberInfo = project.members.find(
    (m) => (m.user.id || m.user._id) === currentUser.id
  );
  const isOwner = currentUserMemberInfo?.role === 'owner';

  const handleAddMember = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use project.id or project._id depending on backend source
      const projectId = project.id || project._id;
      await api.post(`/api/projects/${projectId}/members`, addMemberData);
      
      toast.success('Member added successfully!');
      setAddMemberData({ email: '', role: 'viewer' });
      setShowAddMember(false);
      onUpdate(); // Trigger refresh in parent
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add member';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        const projectId = project.id || project._id;
        await api.delete(`/api/projects/${projectId}/members/${memberId}`);
        toast.success('Member removed successfully!');
        onUpdate();
      } catch (error) {
        toast.error('Failed to remove member');
      }
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      const projectId = project.id || project._id;
      await api.put(`/api/projects/${projectId}/members/${memberId}/role`, {
        role: newRole
      });
      toast.success('Member role updated!');
      onUpdate();
    } catch (error) {
      toast.error('Failed to update member role');
    }
  };

  const canRemoveMember = (member) => {
    const memberUserId = member.user.id || member.user._id;
    // 1. Can't remove the owner
    if (member.role === 'owner') return false;
    // 2. Can't remove yourself
    if (memberUserId === currentUser.id) return false;
    // 3. Only owners can remove people
    return isOwner;
  };

  const canChangeRole = (member) => {
    const memberUserId = member.user.id || member.user._id;
    // 1. Can't change owner's role
    if (member.role === 'owner') return false;
    // 2. Only owners can change roles
    return isOwner;
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Project Members</h3>
            <p className="text-xs text-gray-500 mt-1">Manage who can access and edit this project</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Add Member Toggle */}
          {isOwner && (
            <div className="mb-8">
              {!showAddMember ? (
                <button
                  onClick={() => setShowAddMember(true)}
                  className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span className="bg-blue-50 p-2 rounded-lg mr-2">+</span>
                  Invite new member
                </button>
              ) : (
                <form onSubmit={handleAddMember} className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">User Email</label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-2 border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="collaborator@email.com"
                        value={addMemberData.email}
                        onChange={(e) => setAddMemberData({ ...addMemberData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">Assign Role</label>
                      <select
                        className="w-full px-4 py-2 border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        value={addMemberData.role}
                        onChange={(e) => setAddMemberData({ ...addMemberData, role: e.target.value })}
                      >
                        <option value="viewer">Viewer (Read Only)</option>
                        <option value="editor">Editor (Can Code)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button type="button" onClick={() => setShowAddMember(false)} className="text-sm text-gray-500 px-4 py-2 hover:underline">Cancel</button>
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white text-sm font-bold px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-all">
                      {loading ? 'Sending Invite...' : 'Send Invitation'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Members List */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Team Members ({project.members.length})</h4>
            {project.members.map((member) => {
              const memberUserId = member.user.id || member.user._id;
              return (
                <div key={memberUserId} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                      {member.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {member.user.username} {memberUserId === currentUser.id && <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full ml-1 font-normal">You</span>}
                      </p>
                      <p className="text-xs text-gray-500">{member.user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(memberUserId, e.target.value)}
                      disabled={!canChangeRole(member)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none transition-all ${
                        canChangeRole(member) 
                          ? 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 cursor-pointer' 
                          : 'bg-gray-100 border-transparent text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="owner">Owner</option>
                    </select>

                    {canRemoveMember(member) && (
                      <button
                        onClick={() => handleRemoveMember(memberUserId)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Remove Member"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guide Section */}
          <div className="mt-8 grid grid-cols-3 gap-2">
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
              <p className="text-[10px] font-bold text-purple-600 uppercase mb-1">Owner</p>
              <p className="text-[10px] text-purple-800 leading-tight">Admin access & member control.</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Editor</p>
              <p className="text-[10px] text-blue-800 leading-tight">Write code & send messages.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-600 uppercase mb-1">Viewer</p>
              <p className="text-[10px] text-gray-800 leading-tight">Read-only view of the project.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberManagement;