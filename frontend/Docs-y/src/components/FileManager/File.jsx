import React from "react";
import { Link } from "react-router-dom";

const File = ({ id, name, role, onDelete, onRename, onShare }) => {
  const isViewer = role === "viewer";

  return (
    <div className="relative">
      <div className="w-32 h-32 bg-white rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out shadow-md">
        <Link to={`/documents/${id}`}>
          <span className="text-gray-800">{name}</span>
        </Link>
        <div className="flex justify-center">
          {!isViewer && (
            <div className="flex mt-2">
              <button
                onClick={onDelete}
                className="text-red-500 hover:text-red-700 mr-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <button
                onClick={onRename}
                className="text-blue-500 hover:text-blue-700 mr-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <button
                onClick={onShare}
                className="text-green-500 hover:text-green-700 mt-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 12a6 6 0 01-6 6H8a6 6 0 01-6-6V8a6 6 0 016-6h4a6 6 0 016 6zm0 0V8a2 2 0 00-2-2H8a2 2 0 00-2 2v4m8-4v12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default File;
