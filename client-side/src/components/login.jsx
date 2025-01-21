/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import axios from "axios";

import { NavLink, useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:4000/login", {
        email: username,
        password: password,
      });
      console.log(res);
      if (res.status === 200) {
        setToken(res.data.accessToken);
        setLoginMessage("Login successful!");
        navigate("/feed", { state: { user: res.data } });
      } else {
        setLoginMessage("Login failed! Please check your credentials.");
      }
    } catch (error) {
      console.error("Error:", error);
      setLoginMessage("An error occurred. Please try again.");
    }
  };
  console.log(token);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-pink-500">Instagram</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Log in to your account
          </h2>
        </div>

        {loginMessage && (
          <div className="text-center text-lg font-semibold text-pink-600">
            {loginMessage}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Phone number, username, or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Log In
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or</span>
            </div>
          </div>

          <div className="mt-6">
            <div>
              <a
                href="#"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-blue-600 hover:bg-gray-50"
              >
                Continue with Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <a href="#" className="font-medium text-pink-600 hover:text-pink-500">
            Forgot password?
          </a>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?
          <NavLink to="/register">
            <a className="font-medium text-pink-600 hover:text-pink-500">
              Sign Up
            </a>
          </NavLink>
        </p>
      </div>
    </div>
  );
}
