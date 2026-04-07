
// // import React, { useRef, forwardRef, useImperativeHandle } from "react";
// // import Editor from "@monaco-editor/react";

// // const CodeEditor = forwardRef(({ code, language, onCodeChange, readOnly, socket }, ref) => {
// //   const editorRef = useRef(null);

// //   const handleEditorDidMount = (editor, monaco) => {
// //     editorRef.current = editor;

// //     editor.updateOptions({
// //       readOnly,
// //       minimap: { enabled: false },
// //       fontSize: 14,
// //       lineNumbers: "on",
// //       roundedSelection: false,
// //       scrollBeyondLastLine: false,
// //       automaticLayout: true,
// //       wordWrap: "on",
// //     });

// //     editor.onDidChangeCursorPosition((e) => {
// //       if (socket && !readOnly) {
// //         socket.emit("cursor-position", { position: e.position });
// //       }
// //     });
// //   };

// //   const handleEditorChange = (value) => {
// //     if (onCodeChange) onCodeChange(value || "");

// //     if (socket && !readOnly) {
// //       const position = editorRef.current?.getPosition();
// //       if (position) socket.emit("cursor-position", { position });
// //     }
// //   };

// //   // Expose imperative methods to parent via ref
// //   useImperativeHandle(ref, () => ({
// //     /**
// //      * insertText - inserts `text` at current cursor position or replaces selection
// //      * Uses Monaco's executeEdits so undo/redo works naturally.
// //      */
// //     insertText: (text) => {
// //       const ed = editorRef.current;
// //       if (!ed) return;

// //       const selection = ed.getSelection();
// //       if (!selection) {
// //         // fallback: append at end
// //         const model = ed.getModel();
// //         const lastLine = model.getLineCount();
// //         const lastCol = model.getLineMaxColumn(lastLine);
// //         const pos = { startLineNumber: lastLine, startColumn: lastCol, endLineNumber: lastLine, endColumn: lastCol };
// //         ed.executeEdits("ai-insert", [{ range: pos, text, forceMoveMarkers: true }]);
// //         ed.focus();
// //         return;
// //       }

// //       // Replace selection (or insert at cursor if collapsed)
// //       ed.executeEdits("ai-insert", [{ range: selection, text, forceMoveMarkers: true }]);

// //       // Move cursor to end of inserted text
// //       const endPosition = ed.getModel().modifyPosition(selection.getStartPosition(), text.length);
// //       // set a new selection / cursor at the end of inserted text
// //       const newPos = ed.getPosition(); // We'll set focus anyway
// //       ed.setPosition(ed.getPosition()); // keep focus
// //       ed.focus();
// //     },

// //     /**
// //      * getEditor - optional: parent can access the editor instance if needed
// //      */
// //     getEditor: () => editorRef.current,
// //   }));

// //   const getLanguageForMonaco = (lang) => {
// //     const map = {
// //       javascript: "javascript",
// //       typescript: "typescript",
// //       python: "python",
// //       java: "java",
// //       cpp: "cpp",
// //       c: "c",
// //       html: "html",
// //       css: "css",
// //       json: "json",
// //     };
// //     return map[lang?.toLowerCase()] || "javascript";
// //   };

// //   return (
// //     <div className="h-full w-full border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-900 shadow-md">
// //       <Editor
// //         height="100%"
// //         language={getLanguageForMonaco(language)}
// //         value={code || "// Write your code here...\n"}
// //         onChange={handleEditorChange}
// //         onMount={handleEditorDidMount}
// //         theme="vs-dark"
// //         options={{
// //           selectOnLineNumbers: true,
// //           roundedSelection: false,
// //           readOnly: readOnly,
// //           cursorStyle: "line",
// //           automaticLayout: true,
// //           wordWrap: "on",
// //           minimap: { enabled: false },
// //           fontSize: 14,
// //           lineNumbers: "on",
// //           scrollBeyondLastLine: false,
// //         }}
// //         loading={
// //           <div className="flex items-center justify-center h-full">
// //             <div className="text-center">
// //               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
// //               <p className="text-white mt-3">Loading Editor...</p>
// //             </div>
// //           </div>
// //         }
// //       />
// //     </div>
// //   );
// // });

// // export default CodeEditor;

// import React, { useRef, forwardRef, useImperativeHandle, useEffect, useMemo } from "react";
// import Editor from "@monaco-editor/react";
// import _ from "lodash";
// import DiffMatchPatch from "diff-match-patch";

// const dmp = new DiffMatchPatch();

// const CodeEditor = forwardRef(({ code, language, onCodeChange, readOnly, socket }, ref) => {
//   const editorRef = useRef(null);
//   const lastCodeRef = useRef(code || "");

//   // Debounced patch sender for efficient sync
//   const sendPatch = useMemo(
//     () =>
//       _.debounce((newCode) => {
//         if (socket && !readOnly) {
//           const patch = dmp.patch_make(lastCodeRef.current, newCode);
//           const patchText = dmp.patch_toText(patch);
//           // Optionally, add current project id for backend
//           socket.emit("codePatch", { patch: patchText, projectId: socket.currentProject });
//           lastCodeRef.current = newCode;
//         }
//       }, 200),
//     [socket, readOnly]
//   );

//   // Monaco: editor mount with custom options and cursor sync
//   const handleEditorDidMount = (editor, monaco) => {
//     editorRef.current = editor;
//     editor.updateOptions({
//       readOnly,
//       minimap: { enabled: false },
//       fontSize: 14,
//       lineNumbers: "on",
//       roundedSelection: false,
//       scrollBeyondLastLine: false,
//       automaticLayout: true,
//       wordWrap: "on",
//     });
//     editor.onDidChangeCursorPosition((e) => {
//       if (socket && !readOnly) {
//         socket.emit("cursor-position", { position: e.position });
//       }
//     });
//   };

//   // Handles editor changes: updates state and sends diff
//   const handleEditorChange = (value) => {
//     if (onCodeChange) onCodeChange(value || "");
//     sendPatch(value || "");
//   };

//   // Listen for diff patches from server
//   useEffect(() => {
//     if (!socket) return;
//     const handlePatch = ({ patch }) => {
//       const patches = dmp.patch_fromText(patch);
//       const [updatedCode] = dmp.patch_apply(patches, lastCodeRef.current);
//       lastCodeRef.current = updatedCode;
//       if (onCodeChange) onCodeChange(updatedCode);
//       // Update Monaco editor directly if you want:
//       if (editorRef.current) {
//         editorRef.current.setValue(updatedCode);
//       }
//     };
//     socket.on("codeSync", handlePatch);
//     return () => socket.off("codeSync", handlePatch);
//   }, [socket, onCodeChange]);

//   // Expose Monaco methods (insertText, etc.) to parent via ref
//   useImperativeHandle(ref, () => ({
//     insertText: (text) => {
//       const ed = editorRef.current;
//       if (!ed) return;
//       const selection = ed.getSelection();
//       if (!selection) {
//         const model = ed.getModel();
//         const lastLine = model.getLineCount();
//         const lastCol = model.getLineMaxColumn(lastLine);
//         const pos = { startLineNumber: lastLine, startColumn: lastCol, endLineNumber: lastLine, endColumn: lastCol };
//         ed.executeEdits("ai-insert", [{ range: pos, text, forceMoveMarkers: true }]);
//         ed.focus();
//         return;
//       }
//       ed.executeEdits("ai-insert", [{ range: selection, text, forceMoveMarkers: true }]);
//       ed.setPosition(ed.getPosition());
//       ed.focus();
//     },
//     getEditor: () => editorRef.current,
//   }));

//   // Utility: Map conceptual language names to Monaco's expected values
//   const getLanguageForMonaco = (lang) => {
//     const map = {
//       javascript: "javascript", typescript: "typescript", python: "python",
//       java: "java", cpp: "cpp", c: "c", html: "html", css: "css", json: "json"
//     };
//     return map[lang?.toLowerCase()] || "javascript";
//   };

//   return (
//     <div className="h-full w-full border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-900 shadow-md">
//       <Editor
//         height="100%"
//         language={getLanguageForMonaco(language)}
//         value={code || "// Write your code here...\n"}
//         onChange={handleEditorChange}
//         onMount={handleEditorDidMount}
//         theme="vs-dark"
//         options={{
//           selectOnLineNumbers: true,
//           roundedSelection: false,
//           readOnly: readOnly,
//           cursorStyle: "line",
//           automaticLayout: true,
//           wordWrap: "on",
//           minimap: { enabled: false },
//           fontSize: 14,
//           lineNumbers: "on",
//           scrollBeyondLastLine: false,
//         }}
//         loading={
//           <div className="flex items-center justify-center h-full">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//               <p className="text-white mt-3">Loading Editor...</p>
//             </div>
//           </div>
//         }
//       />
//     </div>
//   );
// });

// export default CodeEditor;




import React, { useRef, forwardRef, useImperativeHandle, useEffect, useMemo } from "react";
import Editor from "@monaco-editor/react";
import _ from "lodash";
import DiffMatchPatch from "diff-match-patch";

const dmp = new DiffMatchPatch();

const CodeEditor = forwardRef(({ code, language, onCodeChange, readOnly, socket }, ref) => {
  const editorRef = useRef(null);
  const lastCodeRef = useRef(code || "");
  const isRemoteChange = useRef(false); // ✅ Prevents infinite feedback loops

  // Debounced patch sender: Efficiency check to avoid spamming the socket
  const sendPatch = useMemo(
    () =>
      _.debounce((newCode) => {
        // Only send if the change was made by the local user, not the socket
        if (socket && !readOnly && !isRemoteChange.current) {
          const patch = dmp.patch_make(lastCodeRef.current, newCode);
          const patchText = dmp.patch_toText(patch);
          
          if (patchText) {
            socket.emit("codePatch", { 
              patch: patchText, 
              projectId: socket.currentProject 
            });
            lastCodeRef.current = newCode;
          }
        }
        // Reset the flag after the debounce cycle
        isRemoteChange.current = false;
      }, 150),
    [socket, readOnly]
  );

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.updateOptions({
      readOnly,
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: "on",
      automaticLayout: true,
      wordWrap: "on",
      theme: "vs-dark"
    });

    editor.onDidChangeCursorPosition((e) => {
      if (socket && !readOnly) {
        socket.emit("cursor-position", { position: e.position });
      }
    });
  };

  const handleEditorChange = (value) => {
    const val = value || "";
    // 1. Update the parent state
    if (onCodeChange) onCodeChange(val);
    
    // 2. Only trigger patch logic if it's a local keystroke
    if (!isRemoteChange.current) {
      sendPatch(val);
    }
  };

  // Sync Logic: Listen for incoming patches
  useEffect(() => {
    if (!socket) return;

    const handleSync = ({ patch }) => {
      const patches = dmp.patch_fromText(patch);
      const [updatedCode] = dmp.patch_apply(patches, lastCodeRef.current);
      
      if (updatedCode !== lastCodeRef.current) {
        // ✅ Set flag to true so handleEditorChange doesn't send this back to server
        isRemoteChange.current = true;
        lastCodeRef.current = updatedCode;

        if (editorRef.current) {
          // Preserve cursor position during update
          const position = editorRef.current.getPosition();
          editorRef.current.setValue(updatedCode);
          if (position) editorRef.current.setPosition(position);
        }
        
        if (onCodeChange) onCodeChange(updatedCode);
      }
    };

    socket.on("codeSync", handleSync);
    return () => socket.off("codeSync", handleSync);
  }, [socket, onCodeChange]);

  useImperativeHandle(ref, () => ({
    // This allows AI Assistant to inject code directly
    insertText: (text) => {
      const ed = editorRef.current;
      if (!ed) return;
      
      const selection = ed.getSelection();
      const range = selection || {
        startLineNumber: ed.getModel().getLineCount(),
        startColumn: ed.getModel().getLineMaxColumn(ed.getModel().getLineCount()),
        endLineNumber: ed.getModel().getLineCount(),
        endColumn: ed.getModel().getLineMaxColumn(ed.getModel().getLineCount())
      };

      ed.executeEdits("ai-insert", [{ range, text, forceMoveMarkers: true }]);
      ed.focus();
    },
    getEditor: () => editorRef.current,
  }));

  const getLanguageForMonaco = (lang) => {
    const map = {
      javascript: "javascript", typescript: "typescript", python: "python",
      java: "java", cpp: "cpp", c: "c", html: "html", css: "css", json: "json"
    };
    return map[lang?.toLowerCase()] || "javascript";
  };

  return (
    <div className="h-full w-full border border-gray-700 rounded-lg overflow-hidden bg-[#1e1e1e]">
      <Editor
        height="100%"
        language={getLanguageForMonaco(language)}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          readOnly,
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 10 }
        }}
        loading={
          <div className="flex items-center justify-center h-full bg-gray-900">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
          </div>
        }
      />
    </div>
  );
});

export default CodeEditor;