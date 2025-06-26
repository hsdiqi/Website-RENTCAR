"use client"

import { useState, useEffect } from "react"
import { Link } from "react-scroll"
import { useNavigate } from "react-router-dom"

function Navbar() {
  const [navbarVisible, setNavbarVisible] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      if (scrollTop > 50) {
        setNavbarVisible(false)
        setIsScrolled(true)
      } else {
        setNavbarVisible(true)
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    setIsLoggedIn(!!accessToken)
    console.log("access token:", accessToken)
  }, [])

  const handleSignOut = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("userId")
      setIsLoggedIn(false)
      navigate("/signIn")
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        navbarVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200"
          : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <a
              href="#home"
              className={`flex items-center space-x-2 font-bold text-xl transition-colors duration-200 ${
                isScrolled ? "text-gray-900 hover:text-blue-600" : "text-white hover:text-blue-200"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 ${
                  isScrolled ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-white/20 backdrop-blur-sm"
                }`}
              >
                <i className={`fas fa-car text-lg ${isScrolled ? "text-white" : "text-white"}`}></i>
              </div>
              <span>
                <span className="text-blue-400">PANDAWA</span> RentCar
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="Home"
                smooth={true}
                duration={500}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer hover:scale-105 ${
                  isScrolled
                    ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    : "text-white hover:text-blue-200 hover:bg-white/10"
                }`}
              >
                <i className="fas fa-home mr-2"></i>
                Home
              </Link>

              <button
                onClick={() => navigate("/catalog")}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-105 ${
                  isScrolled
                    ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    : "text-white hover:text-blue-200 hover:bg-white/10"
                }`}
              >
                <i className="fas fa-th-large mr-2"></i>
                Catalog
              </button>

              <Link
                to="Review"
                smooth={true}
                duration={500}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer hover:scale-105 ${
                  isScrolled
                    ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    : "text-white hover:text-blue-200 hover:bg-white/10"
                }`}
              >
                <i className="fas fa-star mr-2"></i>
                Review
              </Link>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                {/* <button
                  onClick={() => navigate("/profile")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-105 ${
                    isScrolled
                      ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50 border border-gray-300"
                      : "text-white hover:text-blue-200 hover:bg-white/10 border border-white/30"
                  }`}
                >
                  <i className="fas fa-user mr-2"></i>
                  Profile
                </button> */}
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate("/signIn")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-105 ${
                    isScrolled
                      ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50 border border-gray-300"
                      : "text-white hover:text-blue-200 hover:bg-white/10 border border-white/30"
                  }`}
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signUp")}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <i className="fas fa-user-plus mr-2"></i>
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors duration-200 ${
                isScrolled
                  ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  : "text-white hover:text-blue-200 hover:bg-white/10"
              }`}
            >
              <i className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"} text-lg`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden transition-all duration-300 ${
            isScrolled ? "bg-white/95 backdrop-blur-md border-t border-gray-200" : "bg-black/20 backdrop-blur-md"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="Home"
              smooth={true}
              duration={500}
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-lg text-base font-bold transition-colors duration-200 cursor-pointer ${
                isScrolled
                  ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  : "text-white hover:text-blue-200 hover:bg-white/10"
              }`}
            >
              <i className="fas fa-home mr-3"></i>
              Home
            </Link>

            <button
              onClick={() => {
                navigate("/catalog")
                closeMobileMenu()
              }}
              className={`w-full text-left block px-3 py-2 rounded-lg text-base font-bold transition-colors duration-200 ${
                isScrolled
                  ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  : "text-white hover:text-blue-200 hover:bg-white/10"
              }`}
            >
              <i className="fas fa-th-large mr-3"></i>
              Catalog
            </button>

            <Link
              to="Review"
              smooth={true}
              duration={500}
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-lg text-base font-bold transition-colors duration-200 cursor-pointer ${
                isScrolled
                  ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  : "text-white hover:text-blue-200 hover:bg-white/10"
              }`}
            >
              <i className="fas fa-star mr-3"></i>
              Review
            </Link>

            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-gray-200/20">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigate("/profile")
                      closeMobileMenu()
                    }}
                    className={`w-full text-left block px-3 py-2 rounded-lg text-base font-bold transition-colors duration-200 ${
                      isScrolled
                        ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                        : "text-white hover:text-blue-200 hover:bg-white/10"
                    }`}
                  >
                    <i className="fas fa-user mr-3"></i>
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut()
                      closeMobileMenu()
                    }}
                    className="w-full text-left block px-3 py-2 rounded-lg text-base font-bold bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
                  >
                    <i className="fas fa-sign-out-alt mr-3"></i>
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigate("/signIn")
                      closeMobileMenu()
                    }}
                    className={`w-full text-left block px-3 py-2 rounded-lg text-base font-bold transition-colors duration-200 ${
                      isScrolled
                        ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                        : "text-white hover:text-blue-200 hover:bg-white/10"
                    }`}
                  >
                    <i className="fas fa-sign-in-alt mr-3"></i>
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      navigate("/signUp")
                      closeMobileMenu()
                    }}
                    className="w-full text-left block px-3 py-2 rounded-lg text-base font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-colors duration-200"
                  >
                    <i className="fas fa-user-plus mr-3"></i>
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
