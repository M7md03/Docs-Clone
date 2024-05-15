import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import database from "../../database/database";

const LogIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8086/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "username" : username, "password" : password }),
      });

      if (response.ok) {
        //const data = await response.json();
        console.log("User logged in successfully!");
        navigate(`/file-manager/${username}`);
      } else {
        const data = await response.json();
        setError(data.error || "An error occurred");
      }
    } catch (error) {
      setError("An error occurred");
      console.error(error);
    }

    // const user = database.find((user) => user.username === username);

    // if (user && user.password == password) {
    //   navigate(`/file-manager/${username}`);
    // } else {
    //   setError("Invalid username or password");
    // }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-gradient-to-b from-blue-500 to-purple-500">
      <div className="text-white text-4xl font-semibold mb-8">
        Welcome to the club
      </div>
      <div className="bg-white p-8 rounded-md shadow-md w-[40%]">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="text-gray-800 font-semibold">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-gray-800 font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <p className="text-gray-800 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 font-semibold">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
