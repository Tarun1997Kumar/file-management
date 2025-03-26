import { useState } from "react";

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col justify-between">
      {/* Sidebar Header with + New Button */}
      <div>
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={toggleDropdown}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-between"
          >
            + New
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="mt-2 bg-gray-700 rounded-md shadow-lg">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-600">
                Upload File
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-600">
                Create Folder
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-600">
                Create Document
              </button>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="mt-4">
          <a
            href="#"
            className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            My Drive
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Shared with Me
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Recent
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Starred
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Trash
          </a>
        </nav>
      </div>

      {/* Storage Indicator */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-sm text-gray-400">Storage</div>
        <div className="w-full bg-gray-600 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full w-3/4"></div>
        </div>
        <div className="text-sm text-gray-300 mt-1">10 GB of 15 GB used</div>
      </div>
    </div>
  );
};

export default Sidebar;
