// 📌 Big Picture
// This component (MemberManagement) is a popup window that:
// Lets you see who is in the project.
// Lets the owner/editor add new members.
// Lets you change roles (viewer → editor, etc.).
// Lets you remove members (but with some restrictions).
// Shows a guide of what each role means.
// So basically, it’s like the control panel for team members in a project.



import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // gives us info about the logged-in user.
import axios from 'axios';
import { toast } from 'react-toastify';



// project: the current project details.
// onClose: closes the popup window.
// onUpdate: refreshes data after changes.
// user: who is currently logged in.
const MemberManagement = ({ project, onClose, onUpdate }) => {
  const { user } = useAuth();
  const [showAddMember, setShowAddMember] = useState(false); // controls if the “Add Member” form is visible.
  const [addMemberData, setAddMemberData] = useState({
    email: '',
    role: 'viewer'
  }); // stores the email + role of the member we’re adding.
  const [loading, setLoading] = useState(false); // shows if a request (like add/remove) is still happening.


  // This function runs when the Add Member form is submitted
  const handleAddMember = async (e) => {
    e.preventDefault(); // e.preventDefault() stops the page from refreshing (default form behavior).
 // 👉 So instead of reloading, we handle it with JavaScript.
    setLoading(true);

    try {
      await axios.post(`/api/projects/${project._id}/members`, addMemberData);
      toast.success('Member added successfully!');
      setAddMemberData({ email: '', role: 'viewer' }); // Reset the form → clear the email box and set role back to default (viewer).
      setShowAddMember(false); // Hide the “Add Member” form (collapse it).
      onUpdate(); // Refresh the members list → so the new person immediately shows up in the UI.
    } catch (error) {
      console.error('Error adding member:', error);
      const message = error.response?.data?.message || 'Failed to add member';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };



  // This function is called when you click the remove (trash icon) button next to a member.
  const handleRemoveMember = async (memberId) => {
    // A pop-up:
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await axios.delete(`/api/projects/${project._id}/members/${memberId}`);
        toast.success('Member removed successfully!');
        onUpdate();
      } catch (error) {
        console.error('Error removing member:', error);
        toast.error('Failed to remove member');
      }
    }
  };



  const handleRoleChange = async (memberId, newRole) => {
    try {
      await axios.put(`/api/projects/${project._id}/members/${memberId}/role`, {
        role: newRole
      });
      toast.success('Member role updated!');
      onUpdate();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update member role');
    }
  };



  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };



  const canRemoveMember = (member) => {
    // Can't remove owner
    if (member.role === 'owner') return false;
    // Can't remove yourself
    if (member.user._id === user.id) return false;
    return true;
  };



  const canChangeRole = (member) => {
    // Can't change owner's role
    if (member.role === 'owner') return false;
    return true;
  };



  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Manage Members</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>



          {/* Add Member Section */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="btn-primary"
            >
              Add Member
            </button>

            {showAddMember && (
              <form onSubmit={handleAddMember} className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="mt-1 input-field"
                      placeholder="Enter member's email"
                      value={addMemberData.email}
                      onChange={(e) => setAddMemberData({
                        ...addMemberData,
                        email: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      id="role"
                      className="mt-1 input-field"
                      value={addMemberData.role}
                      onChange={(e) => setAddMemberData({
                        ...addMemberData,
                        role: e.target.value
                      })}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddMember(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Adding...' : 'Add Member'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Members List */}
          <div className="space-y-3">
            <h4 className="text-md font-medium text-gray-900">Current Members</h4>
            {project.members.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                    {member.user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.user.username}</p>
                    <p className="text-sm text-gray-600">{member.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.user._id, e.target.value)}
                    disabled={!canChangeRole(member)}
                    className={`text-sm px-2 py-1 rounded border ${
                      canChangeRole(member) 
                        ? 'bg-white border-gray-300' 
                        : 'bg-gray-100 border-gray-200 cursor-not-allowed'
                    }`}
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="owner">Owner</option>
                  </select>

                  {canRemoveMember(member) && (
                    <button
                      onClick={() => handleRemoveMember(member.user._id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Role Descriptions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">Role Permissions</h5>
            <div className="space-y-1 text-sm text-blue-800">
              <p><strong>Owner:</strong> Full access - can edit code, manage members, and delete project</p>
              <p><strong>Editor:</strong> Can edit code and send messages</p>
              <p><strong>Viewer:</strong> Can only view code and read messages</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberManagement;
