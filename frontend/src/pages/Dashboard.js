import React, { useState, useEffect } from 'react'; // useState -> holds local component state (projects, loading, modal open).
import { useAuth } from '../context/AuthContext'; // Provides user info and logout function for the header and Logout button.
import { useNavigate } from 'react-router-dom'; // Used to navigate to the project editor after creation.
import axios from 'axios';
import api from '../utils/api'; // use your configured client
import { toast } from 'react-toastify';

// child components that render individual project UI and the modal respectively.
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal'; // UI components for cards and the creation modal.



// 📌 Big picture first :-

// Your Dashboard.js is the page that shows up after a user logs in.
// It fetches projects from the backend.
// It displays them as cards.
// It lets the user create new projects (opens a modal → sends data → navigates to editor).
// It lets the user delete a project.
// It also has logout functionality.
// So this page is the “home base” for a logged-in user.




const Dashboard = () => {

  // user supplies username for “Welcome” and potentially role-based UI;
  // logout clears auth and routes away.
  // user: current logged-in user object (username/email). Used for greeting and role checks.
  // logout: function to clear auth. (We’ll wrap it to navigate away.)
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Holds the array of projects returned by the backend getProjects controller.
  // projects: array of project objects fetched from backend. 
  // Each project likely looks like { _id, name, description, owner: {username, _id}, members: [...], updatedAt, language }.
  const [projects, setProjects] = useState([]);

  // Controls the initial spinner while data loads.
  const [loading, setLoading] = useState(true);

  // Controls visibility of the Create Project modal.
  // boolean to toggle the creation UI.
  const [showCreateModal, setShowCreateModal] = useState(false);


  // Runs once on mount to load projects for the dashboard.
  // useEffect(() => {
  //   fetchProjects();
  // }, []);

     useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/api/projects');
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        toast.error(err.response?.data?.message || 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);


 

  const handleCreateProject = async (projectData) => {
    try {
      const { data } = await api.post('/api/projects', projectData);
      setProjects(prev => [data, ...prev]); // functional update
      setShowCreateModal(false);
      toast.success('Project created successfully!');
      navigate(`/project/${data._id}`);
    } catch (err) {
      console.error('Error creating project:', err);
      toast.error(err.response?.data?.message || 'Failed to create project');
    }
  };

  

   const handleDeleteProject = async (projectId) => {
    // consider a custom modal instead of window.confirm
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/api/projects/${projectId}`);
      setProjects(prev => prev.filter(p => p._id !== projectId));
      toast.success('Project deleted successfully!');
    } catch (err) {
      console.error('Error deleting project:', err);
      toast.error(err.response?.data?.message || 'Failed to delete project');
    }
  };


   const handleLogout = () => {
    logout();
    navigate('/login');
  };
  

    if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }


  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                 Welcome, <span className="text-blue-600">{user?.username}</span>!
              </h1>
              <p className="text-gray-600 mt-1">Manage your collaborative coding projects</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Create Project
              </button>
              <button
                onClick={logout}
                className="btn-secondary shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary"
                >
                  Create your first project
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProject}
        />
      )}
    </div>
  );
};

export default Dashboard;


// Improvements:
// Replace raw axios imports with the configured api client,
// so Authorization headers and 401 handling work automatically.
// Keep the same logic, just swap axios → api.

// import api from '../utils/api' instead of import axios from 'axios'.
// In fetchProjects: const { data } = await api.get('/api/projects'); setProjects(data).
// In handleCreateProject: const { data } = await api.post('/api/projects', projectData); setProjects([data, ...projects]); navigate(/project/${data._id});
// In handleDeleteProject: await api.delete(/api/projects/${projectId});