import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import File from "./File";
import database from "../../database/database";

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [renameDocument, setRenameDocument] = useState({
    id: null,
    newName: "",
  });
  const [shareDocument, setShareDocument] = useState({
    id: null,
    username: "",
    role: "viewer",
  });

  const { username } = useParams();

  useEffect(() => {
    const user = database.find((user) => user.username === username);

    if (user) {
      setFiles(
        user.documents.map((document) => ({
          id: document.id,
          name: document.name,
          role: document.role,
        }))
      );
    }
  }, [username]);

  const handleCreateDocument = () => {
    const newDocument = {
      id: uuidv4(),
      name: `Document ${files.length + 1}`,
      role: "owner",
    };
    setFiles([...files, newDocument]);
  };

  const handleDeleteDocument = (id) => {
    const updatedFiles = files.filter((file) => file.id !== id);
    setFiles(updatedFiles);
  };

  const handleRenameDocument = () => {
    const updatedFiles = files.map((file) => {
      if (file.id === renameDocument.id) {
        return { ...file, name: renameDocument.newName };
      }
      return file;
    });
    setFiles(updatedFiles);
    setRenameDocument({ id: null, newName: "" });
  };

  const handleShareDocument = () => {
    setShareDocument({ id: null, username: "", role: "viewer" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-500 flex">
      <aside className="w-1/5 bg-gray-800 text-white py-8 px-6">
        <h2 className="text-2xl font-semibold mb-6">File Manager</h2>
        <button
          onClick={handleCreateDocument}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out mb-4"
        >
          Create Document
        </button>
        {renameDocument.id && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Rename Document</h3>
            <input
              type="text"
              value={renameDocument.newName}
              onChange={(e) =>
                setRenameDocument({
                  ...renameDocument,
                  newName: e.target.value,
                })
              }
              className="w-full px-3 py-2 text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleRenameDocument}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out mt-2"
            >
              Rename
            </button>
          </div>
        )}
        {shareDocument.id && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Share Document</h3>
            <input
              type="text"
              value={shareDocument.username}
              onChange={(e) =>
                setShareDocument({
                  ...shareDocument,
                  username: e.target.value,
                })
              }
              className="w-full px-3 py-2 text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="Enter username"
            />
            <select
              value={shareDocument.role}
              onChange={(e) =>
                setShareDocument({
                  ...shareDocument,
                  role: e.target.value,
                })
              }
              className="w-full px-3 py-2 mt-2 text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
            <button
              onClick={handleShareDocument}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out mt-2"
            >
              Share
            </button>
          </div>
        )}
      </aside>
      <main className="flex-1 flex flex-col items-center justify-center">
        <header className="text-white text-4xl font-semibold py-12">
          Welcome to File Manager
        </header>
        <div className="flex flex-wrap justify-center gap-4 p-8">
          {files.length === 0 ? (
            <p className="text-white text-lg font-semibold">
              No documents yet. Click "Create Document" to get started!
            </p>
          ) : (
            files.map((file) => (
              <File
                key={file.id}
                id={file.id}
                name={file.name}
                role={file.role}
                onDelete={() => handleDeleteDocument(file.id)}
                onRename={() =>
                  setRenameDocument({ id: file.id, newName: file.name })
                }
                onShare={() =>
                  setShareDocument({
                    id: file.id,
                    username: "",
                    role: "viewer",
                  })
                }
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default FileManager;
