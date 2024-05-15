import React from "react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-gradient-to-b from-blue-500 to-purple-500">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Docs-y! Our Google Docs Clone
        </h1>

        <div>
          <TypeAnimation
            sequence={[
              "THE ULTIMATE GOOGLE DOCS CLONE",
              1500,
              "Enjoy the amazing experience!",
              1500,
            ]}
            wrapper="p"
            speed={75}
            repeat={Infinity}
          />
        </div>

        <div className="flex justify-center mt-4">
          <Link to="/signup">
            <button className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-md mr-4 hover:bg-gray-200 hover:text-gray-700 transition duration-300 ease-in-out">
              Sign Up
            </button>
          </Link>

          <Link to="/login">
            <button className="bg-transparent border border-white text-white font-semibold py-2 px-4 rounded-md hover:bg-white hover:text-gray-800 transition duration-300 ease-in-out">
              Log In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
