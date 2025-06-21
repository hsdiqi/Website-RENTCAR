"use client"

import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

const NavbarAdmin = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const navigate = useNavigate()

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      localStorage.removeItem("accessTokenAdmin")
      localStorage.removeItem("adminId")
      navigate("/loginAdmin")
    }
  }

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  const closeDropdowns = () => {
    setActiveDropdown(null)
  }

  return (
    <nav className="bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 shadow-xl border-b-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                <i className="fas fa-shield-alt text-white text-lg"></i>
              </div>
              <span className="ml-3 text-white font-bold text-xl">Admin Panel</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {/* Dashboard */}
              <NavLink
                to="/dashboardAdmin"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-bold transition duration-200 flex items-center ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg transform scale-105"
                      : "text-gray-200 hover:bg-blue-700 hover:text-white hover:shadow-md hover:scale-105"
                  }`
                }
                onClick={closeDropdowns}
              >
                <i className="fas fa-tachometer-alt mr-2"></i>
                Dashboard
              </NavLink>

              {/* Manajemen Mobil Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("mobil")}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-gray-200 hover:bg-blue-700 hover:text-white transition duration-200 flex items-center hover:shadow-md hover:scale-105"
                >
                  <i className="fas fa-car mr-2"></i>
                  Manajemen Mobil
                  <i
                    className={`fas fa-chevron-down ml-2 transition-transform duration-200 ${activeDropdown === "mobil" ? "rotate-180" : ""}`}
                  ></i>
                </button>
                {activeDropdown === "mobil" && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 transform transition-all duration-200 scale-100">
                    <div className="py-2">
                      <NavLink
                        to="/merk"
                        className="block px-4 py-3 text-sm font-bold text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition duration-150 flex items-center"
                        onClick={closeDropdowns}
                      >
                        <i className="fas fa-tags mr-3 text-blue-600"></i>
                        Data Merk
                      </NavLink>
                      <NavLink
                        to="/mobil"
                        className="block px-4 py-3 text-sm font-bold text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition duration-150 flex items-center"
                        onClick={closeDropdowns}
                      >
                        <i className="fas fa-car mr-3 text-blue-600"></i>
                        Data Mobil
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>

              {/* Manajemen Pesanan Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("pesanan")}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-gray-200 hover:bg-blue-700 hover:text-white transition duration-200 flex items-center hover:shadow-md hover:scale-105"
                >
                  <i className="fas fa-shopping-cart mr-2"></i>
                  Manajemen Pesanan
                  <i
                    className={`fas fa-chevron-down ml-2 transition-transform duration-200 ${activeDropdown === "pesanan" ? "rotate-180" : ""}`}
                  ></i>
                </button>
                {activeDropdown === "pesanan" && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 transform transition-all duration-200 scale-100">
                    <div className="py-2">
                      <NavLink
                        to="/pesanan"
                        className="block px-4 py-3 text-sm font-bold text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition duration-150 flex items-center"
                        onClick={closeDropdowns}
                      >
                        <i className="fas fa-receipt mr-3 text-blue-600"></i>
                        Data Pesanan
                      </NavLink>
                      <NavLink
                        to="/jenis_bayar"
                        className="block px-4 py-3 text-sm font-bold text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition duration-150 flex items-center"
                        onClick={closeDropdowns}
                      >
                        <i className="fas fa-credit-card mr-3 text-blue-600"></i>
                        Data Jenis Bayar
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>

              {/* Manajemen Akun */}
              <NavLink
                to="/akun"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-bold transition duration-200 flex items-center ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg transform scale-105"
                      : "text-gray-200 hover:bg-blue-700 hover:text-white hover:shadow-md hover:scale-105"
                  }`
                }
                onClick={closeDropdowns}
              >
                <i className="fas fa-users mr-2"></i>
                Manajemen Akun
              </NavLink>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition duration-200 flex items-center shadow-lg hover:shadow-xl hover:scale-105"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-blue-700 inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition duration-200"
            >
              <i className={`fas ${isOpen ? "fa-times" : "fa-bars"} text-lg`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-800 border-t border-blue-600">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Dashboard Mobile */}
            <NavLink
              to="/dashboardAdmin"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-base font-bold transition duration-200 flex items-center ${
                  isActive ? "bg-blue-600 text-white shadow-lg" : "text-gray-200 hover:bg-blue-700 hover:text-white"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <i className="fas fa-tachometer-alt mr-3"></i>
              Dashboard
            </NavLink>

            {/* Manajemen Mobil Mobile */}
            <div>
              <button
                onClick={() => toggleDropdown("mobilMobile")}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-bold text-gray-200 hover:bg-blue-700 hover:text-white transition duration-200 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <i className="fas fa-car mr-3"></i>
                  Manajemen Mobil
                </div>
                <i
                  className={`fas fa-chevron-down transition-transform duration-200 ${activeDropdown === "mobilMobile" ? "rotate-180" : ""}`}
                ></i>
              </button>
              {activeDropdown === "mobilMobile" && (
                <div className="ml-6 mt-2 space-y-1">
                  <NavLink
                    to="/merk"
                    className="block px-3 py-2 rounded-lg text-sm font-bold text-gray-300 hover:bg-blue-700 hover:text-white transition duration-150 flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="fas fa-tags mr-3"></i>
                    Data Merk
                  </NavLink>
                  <NavLink
                    to="/mobil"
                    className="block px-3 py-2 rounded-lg text-sm font-bold text-gray-300 hover:bg-blue-700 hover:text-white transition duration-150 flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="fas fa-car mr-3"></i>
                    Data Mobil
                  </NavLink>
                </div>
              )}
            </div>

            {/* Manajemen Pesanan Mobile */}
            <div>
              <button
                onClick={() => toggleDropdown("pesananMobile")}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-bold text-gray-200 hover:bg-blue-700 hover:text-white transition duration-200 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <i className="fas fa-shopping-cart mr-3"></i>
                  Manajemen Pesanan
                </div>
                <i
                  className={`fas fa-chevron-down transition-transform duration-200 ${activeDropdown === "pesananMobile" ? "rotate-180" : ""}`}
                ></i>
              </button>
              {activeDropdown === "pesananMobile" && (
                <div className="ml-6 mt-2 space-y-1">
                  <NavLink
                    to="/pesanan"
                    className="block px-3 py-2 rounded-lg text-sm font-bold text-gray-300 hover:bg-blue-700 hover:text-white transition duration-150 flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="fas fa-receipt mr-3"></i>
                    Data Pesanan
                  </NavLink>
                  <NavLink
                    to="/jenis_bayar"
                    className="block px-3 py-2 rounded-lg text-sm font-bold text-gray-300 hover:bg-blue-700 hover:text-white transition duration-150 flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="fas fa-credit-card mr-3"></i>
                    Data Jenis Bayar
                  </NavLink>
                </div>
              )}
            </div>

            {/* Manajemen Akun Mobile */}
            <NavLink
              to="/akun"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-base font-bold transition duration-200 flex items-center ${
                  isActive ? "bg-blue-600 text-white shadow-lg" : "text-gray-200 hover:bg-blue-700 hover:text-white"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <i className="fas fa-users mr-3"></i>
              Manajemen Akun
            </NavLink>

            {/* Logout Mobile */}
            <button
              onClick={() => {
                setIsOpen(false)
                handleLogout()
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-base font-bold bg-red-600 text-white hover:bg-red-700 transition duration-200 flex items-center shadow-lg"
            >
              <i className="fas fa-sign-out-alt mr-3"></i>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavbarAdmin
