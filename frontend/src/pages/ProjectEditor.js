
// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { io } from "socket.io-client";

// import ChatPanel from "../components/ChatPanel";
// import ProjectHeader from "../components/ProjectHeader";
// import MemberManagement from "../components/MemberManagement";
// import CodeEditor from "../components/CodeEditor";
// import AIAssistant from "../components/AIAssistant"; // <-- added

// const ProjectEditor = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [socket, setSocket] = useState(null);
//   const [showMemberManagement, setShowMemberManagement] = useState(false);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [typingUsers, setTypingUsers] = useState([]);
//   const [output, setOutput] = useState("");
//   const [running, setRunning] = useState(false);
//   const [rightTab, setRightTab] = useState("chat"); // "chat" or "ai"
//   const socketRef = useRef(null);
//   const editorRef = useRef(null);


//   // Set axios auth header from localStorage token (if you use JWT in localStorage)
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     }
//   }, []);

//   useEffect(() => {
//     fetchProject();
//     setupSocket();

//     return () => {
//       if (socketRef.current) socketRef.current.disconnect();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const fetchProject = async () => {
//     try {
//       const response = await axios.get(`/api/projects/${id}`);
//       const projectData = response.data;

//       if (!projectData.code) {
//         projectData.code = "";
//       }

//       setProject(projectData);
//     } catch (error) {
//       toast.error(
//         `Failed to load project: ${error.response?.data?.message || error.message}`
//       );
//       navigate("/dashboard");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const setupSocket = () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const newSocket = io("http://localhost:5000", {
//       auth: { token },
//       transports: ["websocket", "polling"],
//     });

//     newSocket.on("connect", () => {
//       console.log("Connected to server");
//       newSocket.emit("join-project", id);
//     });

//     newSocket.on("disconnect", () => console.log("Disconnected from server"));

//     newSocket.on("user-joined", (data) => {
//       setOnlineUsers((prev) => [
//         ...prev.filter((u) => u.id !== data.user.id),
//         data.user,
//       ]);
//       toast.info(`${data.user.username} joined the project`);
//     });

//     newSocket.on("user-left", (data) => {
//       setOnlineUsers((prev) => prev.filter((u) => u.id !== data.user.id));
//       toast.info(`${data.user.username} left the project`);
//     });

//     newSocket.on("code-update", (data) => {
//       setProject((prev) => ({
//         ...prev,
//         code: data.code || "",
//         language: data.language,
//       }));
//     });

//     newSocket.on("code-change", (data) => {
//       if (data.userId !== user.id) {
//         setProject((prev) => ({
//           ...prev,
//           code: data.code || "",
//         }));
//       }
//     });

//     setSocket(newSocket);
//     socketRef.current = newSocket;
//   };

//   const handleCodeChange = (newCode) => {
//     const codeValue = newCode || "";

//     if (socket) {
//       socket.emit("code-change", { code: codeValue });
//     }

//     setProject((prev) => ({ ...prev, code: codeValue }));
//   };

//   const handleSaveCode = async () => {
//     try {
//       await axios.put(`/api/projects/${id}`, { code: project.code || "" });
//       toast.success("Code saved successfully!");
//     } catch (error) {
//       toast.error(
//         `Save failed: ${error.response?.data?.message || "Error saving code"}`
//       );
//     }
//   };

//   const handleRunCode = async () => {
//     if (!project) return;
//     setRunning(true);
//     setOutput("Running...");
//     try {
//       const response = await axios.post("/api/run", {
//         code: project.code || "",
//         language: project.language,
//       });
//       setOutput(response.data.output || "No output");
//     } catch (error) {
//       setOutput(error.response?.data?.error || "Error running code");
//     } finally {
//       setRunning(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-900">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="text-white mt-4">Loading project...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!project) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-900">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-white">Project not found</h2>
//           <button
//             onClick={() => navigate("/dashboard")}
//             className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const userRole = project.members.find((m) => m.user._id === user.id)?.role;
//   const canEdit = userRole === "owner" || userRole === "editor";
//   const canManageMembers = userRole === "owner";

//   return (
//     <div className="h-screen flex flex-col bg-gray-50">
//       {/* Header */}
//       <ProjectHeader
//         project={project}
//         onlineUsers={onlineUsers}
//         typingUsers={typingUsers}
//         onSave={handleSaveCode}
//         onManageMembers={() => setShowMemberManagement(true)}
//         canManageMembers={canManageMembers}
//       />

//       {/* Main Content: Left (Editor + Output) | Right (Chat/AI) */}
//       <div className="flex-1 flex overflow-hidden">
//         {/* LEFT SIDE: Code Editor + Output */}
//         <div className="flex-1 flex flex-col p-4 gap-3 overflow-hidden">
//           {/* Code Editor - Takes 65% of left side */}
//           <div className="flex-[65] overflow-hidden">
//             <CodeEditor
//               ref={editorRef}
//               code={project.code || ""}
//               language={project.language || "javascript"}
//               onCodeChange={handleCodeChange}
//               readOnly={!canEdit}
//               socket={socket}
//             />
//           </div>

//           {/* Output Section - Takes 35% of left side */}
//           <div className="flex-[35] flex flex-col gap-2 min-h-0">
//             {/* Run Button */}
//             {canEdit && (
//               <button
//                 onClick={handleRunCode}
//                 className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed self-end transition-colors"
//                 disabled={running}
//               >
//                 {running ? "⏳ Running..." : "▶ Run Code"}
//               </button>
//             )}

//             {/* Output Console */}
//             <div className="flex-1 bg-gray-900 rounded-lg p-4 overflow-auto min-h-0">
//               <div className="text-gray-400 font-semibold mb-2 flex items-center gap-2">
//                 <span>📤</span>
//                 <span>Output:</span>
//               </div>
//               <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
//                 {output || "Output will appear here..."}
//               </pre>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT SIDE: Chat Panel / AI Assistant (toggle) */}
//         <div className="w-96 border-l-2 border-gray-300 bg-white flex flex-col shadow-lg">
//           {/* Tabs */}
//           <div className="flex items-center justify-between p-2 border-b">
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setRightTab("chat")}
//                 className={`px-3 py-1 rounded ${rightTab === "chat" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
//               >
//                 💬 Chat
//               </button>
//               <button
//                 onClick={() => setRightTab("ai")}
//                 className={`px-3 py-1 rounded ${rightTab === "ai" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
//               >
//                 🤖 AI
//               </button>
//             </div>

//             {/* Quick Save */}
//             <button
//               onClick={handleSaveCode}
//               className="text-sm px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
//             >
//               Save
//             </button>
//           </div>

//           {/* Panel content */}
//           <div className="flex-1 overflow-auto">
//             {rightTab === "chat" ? (
//               <ChatPanel projectId={id} socket={socket} userRole={userRole} />
//             ) : (
//               <AIAssistant
//                  currentCode={project.code || ""}
//   language={project.language || "javascript"}
//   onCodeInsert={(aiCode) => {
//     // Use editorRef to insert text at cursor / selection
//     if (editorRef.current && typeof editorRef.current.insertText === "function") {
//       editorRef.current.insertText(aiCode);
//       // Also update local state and notify collaborators
//       const newCode = (project.code || "") + "\n\n" + aiCode; // fallback state update
//       if (socket) socket.emit("code-change", { code: newCode });
//       setProject((prev) => ({ ...prev, code: newCode }));
//     } else {
//       // fallback: append if ref not available
//       const newCode = (project.code || "") + "\n\n" + aiCode;
//       if (socket) socket.emit("code-change", { code: newCode });
//       setProject((prev) => ({ ...prev, code: newCode }));
//     }
//   }}
//               />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Member Management Modal */}
//       {showMemberManagement && (
//         <MemberManagement
//           project={project}
//           onClose={() => setShowMemberManagement(false)}
//           onUpdate={fetchProject}
//         />
//       )}
//     </div>
//   );
// };

// export default ProjectEditor;



import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api"; // ✅ Using your configured api client
import { toast } from "react-toastify";
import { io } from "socket.io-client";

import ChatPanel from "../components/ChatPanel";
import ProjectHeader from "../components/ProjectHeader";
import MemberManagement from "../components/MemberManagement";
import CodeEditor from "../components/CodeEditor";
import AIAssistant from "../components/AIAssistant";

const ProjectEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [showMemberManagement, setShowMemberManagement] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [rightTab, setRightTab] = useState("chat"); // "chat" or "ai"
  const socketRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    // Safety check for ID
    if (!id || id === 'undefined') {
      navigate('/dashboard');
      return;
    }

    fetchProject();
    setupSocket();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [id]);

 const fetchProject = async () => {
  try {
    const { data } = await api.get(`/api/projects/${id}`);
    
    // ✅ Handle array or single object response
    const projectData = Array.isArray(data) ? data[0] : data;

    if (!projectData) {
      toast.error("Project data is empty");
      return navigate("/dashboard");
    }

    setProject({ ...projectData, code: projectData.code || "" });
  } catch (error) {
    // This will now catch the 403 "Access denied" from the backend
    const errorMsg = error.response?.data?.message || "Failed to load project";
    toast.error(errorMsg);
    navigate("/dashboard");
  } finally {
    setLoading(false);
  }
};
  const setupSocket = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Connect to your backend socket server
    const newSocket = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      newSocket.emit("join-project", id);
    });

    newSocket.on("user-joined", (data) => {
      setOnlineUsers((prev) => [
        ...prev.filter((u) => u.id !== data.user.id),
        data.user,
      ]);
      toast.info(`${data.user.username} joined`);
    });

    newSocket.on("user-left", (data) => {
      setOnlineUsers((prev) => prev.filter((u) => u.id !== data.user.id));
    });

    newSocket.on("code-change", (data) => {
      // Don't update if the change came from the current user
      if (data.userId !== user.id) {
        setProject((prev) => ({
          ...prev,
          code: data.code || "",
        }));
      }
    });

    setSocket(newSocket);
    socketRef.current = newSocket;
  };

  const handleCodeChange = (newCode) => {
    const codeValue = newCode || "";
    if (socket) {
      socket.emit("code-change", { code: codeValue });
    }
    setProject((prev) => ({ ...prev, code: codeValue }));
  };

  const handleSaveCode = async () => {
    try {
      await api.put(`/api/projects/${id}`, { code: project.code || "" });
      toast.success("Saved");
    } catch (error) {
      toast.error("Save failed");
    }
  };

  const handleRunCode = async () => {
    if (!project) return;
    setRunning(true);
    setOutput("Running...");
    try {
      const response = await api.post("/api/run", {
        code: project.code || "",
        language: project.language,
      });
      setOutput(response.data.output || "No output");
    } catch (error) {
      setOutput(error.response?.data?.error || "Execution error");
    } finally {
      setRunning(false);
    }
  };

  if (loading) return (
    <div className="h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 mr-4"></div>
      Loading Editor...
    </div>
  );

  if (!project) return null;

  // ✅ Prisma Role Check: m.userId instead of m.user._id
  const userMember = project.members.find((m) => m.userId === user.id);
  const canEdit = userMember?.role === "owner" || userMember?.role === "editor";
  const canManageMembers = userMember?.role === "owner";

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <ProjectHeader
        project={project}
        onlineUsers={onlineUsers}
        onSave={handleSaveCode}
        onManageMembers={() => setShowMemberManagement(true)}
        canManageMembers={canManageMembers}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Editor & Terminal */}
        <div className="flex-1 flex flex-col p-4 gap-3 overflow-hidden">
          <div className="flex-[65] overflow-hidden rounded-lg border shadow-sm">
            <CodeEditor
              ref={editorRef}
              code={project.code || ""}
              language={project.language || "javascript"}
              onCodeChange={handleCodeChange}
              readOnly={!canEdit}
              socket={socket}
            />
          </div>

          <div className="flex-[35] flex flex-col gap-2 min-h-0">
            {canEdit && (
              <button
                onClick={handleRunCode}
                disabled={running}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 self-end transition-colors"
              >
                {running ? "⏳ Running..." : "▶ Run Code"}
              </button>
            )}

            <div className="flex-1 bg-gray-900 rounded-lg p-4 overflow-auto font-mono text-sm">
              <div className="text-gray-500 mb-2 border-b border-gray-800 pb-1">Terminal Output</div>
              <pre className="text-green-400 whitespace-pre-wrap">
                {output || "Run code to see output..."}
              </pre>
            </div>
          </div>
        </div>

        {/* Right Side: Chat / AI Sidebar */}
        <div className="w-96 border-l bg-white flex flex-col shadow-xl">
          <div className="flex p-2 border-b bg-gray-50 gap-2">
            <button
              onClick={() => setRightTab("chat")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                rightTab === "chat" ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-600 border"
              }`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setRightTab("ai")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                rightTab === "ai" ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-600 border"
              }`}
            >
              🤖 AI Assistant
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {rightTab === "chat" ? (
              <ChatPanel projectId={id} socket={socket} userRole={userMember?.role} />
            ) : (
              <AIAssistant
                currentCode={project.code || ""}
                language={project.language || "javascript"}
                onCodeInsert={(aiCode) => {
                  // Attempt to use editorRef helper if it exists
                  if (editorRef.current?.insertText) {
                    editorRef.current.insertText(aiCode);
                  } else {
                    const newCode = (project.code || "") + "\n\n" + aiCode;
                    handleCodeChange(newCode);
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>

      {showMemberManagement && (
        <MemberManagement
          project={project}
          onClose={() => setShowMemberManagement(false)}
          onUpdate={fetchProject}
        />
      )}
    </div>
  );
};

export default ProjectEditor;