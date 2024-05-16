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
  const [error, setError] = useState("");

  const { username } = useParams();

  useEffect(() => {
    // Fetch user data from the database
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8086/api/documents/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          //body: JSON.stringify({ "username": username }),
        });

        if (response.ok) {
          const data = await response.json();
          setFiles(
            data.map((document) => ({
              id: document.id,
              title: document.title,
              role: document.role,
            }))
          );
        } else {
          const data = await response.json();
          setError(data.error || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred");
        console.error(error);
      }
    };

    fetchData();

    // const user = database.find((user) => user.username === username);

    // if (user) {
    //   setFiles(
    //     user.documents.map((document) => ({
    //       id: document.id,
    //       name: document.name,
    //       role: document.role,
    //     }))
    //   );
    // }
  }, [username]);

  const handleCreateDocument = async () => {
    try {
      const response = await fetch("http://localhost:8086/api/createDoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "username": username,
          "docId": uuidv4(),
          "docTitle": `Document ${files.length + 1}`,
          "role": "owner"
        }),
      });

      if (response.ok) {
        //const data = await response.json();
        console.log("Document created successfully!");
        const newDocument = {
          id: uuidv4(),
          title: `Document ${files.length + 1}`,
          role: "owner",
        };
        setFiles([...files, newDocument]);
      } else {
        const data = await response.json();
        setError(data.error || "An error occurred");
      }
    } catch (error) {
      setError("An error occurred");
      console.error(error);
    }
    // const newDocument = {
    //   id: uuidv4(),
    //   name: `Document ${files.length + 1}`,
    //   role: "owner",
    // };
    // setFiles([...files, newDocument]);
  };

  const handleDeleteDocument = async (id) => {
    try {
      const response = await fetch("http://localhost:8086/api/deleteDoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "username": username,
          "docId": id
        }),
      });

      if (response.ok) {
        //const data = await response.json();
        const updatedFiles = files.filter((file) => file.id !== id);
        setFiles(updatedFiles);
        console.log("Document deleted successfully!");
      } else {
        const data = await response.json();
        setError(data.error || "An error occurred");
      }
    } catch (error) {
      setError("An error occurred");
      console.error(error);
    }
  };

  const handleRenameDocument = async (id, newName) => {
    try {
      const response = await fetch("http://localhost:8086/api/renameDoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "username": username,
          "docId": id,
          "docTitle": newName
        }),
      });

      if (response.ok) {
        //const data = await response.json();
        const updatedFiles = files.map((file) => {
          if (file.id === id) {
            return { ...file, name: newName };
          } else
            return file;
        });
        setRenameDocument({ id: id, newName: "" });
        setFiles(updatedFiles);
        console.log("Document updated successfully!");
      } else {
        const data = await response.json();
        setError(data.error || "An error occurred");
      }
    } catch (error) {
      setError("An error occurred");
      console.error(error);
    }
    // const updatedFiles = files.map((file) => {
    //   if (file.id === renameDocument.id) {
    //     return { ...file, name: renameDocument.newName };
    //   }
    //   return file;
    // });
    // setFiles(updatedFiles);
    // setRenameDocument({ id: null, newName: "" });
  };

  const handleShareDocument = async (id, sharename, role) => {
    try {
      const response = await fetch("http://localhost:8086/api/shareDoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "username": sharename,
          "docId": id,
          "role": role
        }),
      });

      if (response.ok) {
        //const data = await response.json();
        setShareDocument({ id: null, username: "", role: "viewer" });
        console.log("Document shared successfully!");
      } else {
        const data = await response.json();
        setError(data.error || "An error occurred");
      }
    } catch (error) {
      setError("An error occurred");
      console.error(error);
    }
    //setShareDocument({ id: null, username: "", role: "viewer" });
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
              onClick={() => handleRenameDocument(renameDocument.id, renameDocument.newName)}
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
              onClick={() => handleShareDocument(shareDocument.id, shareDocument.username, shareDocument.role)}
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
                name={file.title}
                role={file.role}
                onDelete={() => handleDeleteDocument(file.id)}
                onRename={() =>
                  setRenameDocument({ id: file.id, newName: file.title })
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
