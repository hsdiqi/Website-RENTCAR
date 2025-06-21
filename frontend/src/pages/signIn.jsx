"use client"

import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [alert, setAlert] = useState(null)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  const handleSignIn = async () => {
    // Clear previous alerts
    setAlert(null)

    // Basic validation
    if (!email || !password) {
      setAlert(
        <div className="bg-red-100 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded mb-4 flex items-center shadow-md">
          <i className="fas fa-exclamation-triangle text-red-600 mr-3 text-lg"></i>
          <div>
            <strong>Error!</strong> Email dan password harus diisi.
          </div>
        </div>,
      )
      return
    }

    // Check for admin credentials
    if (email === "admin" && password === "admin") {
      setAlert(
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 px-4 py-3 rounded mb-4 flex items-center shadow-md">
          <i className="fas fa-info-circle text-blue-600 mr-3 text-lg"></i>
          <div>
            <strong>Admin Access!</strong> Mengalihkan ke halaman admin...
          </div>
        </div>,
      )
      setTimeout(() => {
        navigate("/loginAdmin")
      }, 1500)
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post("http://localhost:3003/api/auth/login", { email, password })
      const { accessToken, userId } = response.data

      // Store tokens
      if (rememberMe) {
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("userId", userId)
      } else {
        sessionStorage.setItem("accessToken", accessToken)
        sessionStorage.setItem("userId", userId)
      }

      setAlert(
        <div className="bg-green-100 border-l-4 border-green-500 text-green-800 px-4 py-3 rounded mb-4 flex items-center shadow-md">
          <i className="fas fa-check-circle text-green-600 mr-3 text-lg"></i>
          <div>
            <strong>Berhasil!</strong> Login berhasil, mengalihkan ke beranda...
          </div>
        </div>,
      )

      setTimeout(() => {
        navigate("/")
      }, 1500)
    } catch (error) {
      setIsLoading(false)
      let errorMessage = "Terjadi kesalahan, silakan coba lagi"

      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = "Email tidak ditemukan"
            break
          case 401:
            errorMessage = "Password salah"
            break
          case 400:
            errorMessage = "Email dan password harus diisi"
            break
          case 500:
            errorMessage = "Server error, silakan coba lagi nanti"
            break
        }
      }

      setAlert(
        <div className="bg-red-100 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded mb-4 flex items-center shadow-md">
          <i className="fas fa-exclamation-triangle text-red-600 mr-3 text-lg"></i>
          <div>
            <strong>Error!</strong> {errorMessage}
          </div>
        </div>,
      )
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSignIn()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Form */}
            <div className="lg:w-3/5 p-8 lg:p-12">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <i className="fas fa-sign-in-alt text-white text-2xl"></i>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang Kembali</h1>
                <p className="text-gray-600 font-medium">
                  Masuk ke akun <span className="text-blue-600 font-bold">PANDAWA</span> RentCar Anda
                </p>
              </div>

              {/* Alert */}
              {alert}

              {/* Form */}
              <div className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2">
                    <i className="fas fa-envelope mr-2 text-blue-600"></i>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200 font-medium"
                    placeholder="nama@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    autoFocus
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-2">
                    <i className="fas fa-lock mr-2 text-blue-600"></i>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200 pr-12 font-medium"
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-blue-600 transition duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-lg`}></i>
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 mr-2"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="text-sm text-gray-700 font-medium">Ingat saya</span>
                  </label>
                  <Link
                    to="/forgotPassword"
                    className="text-sm text-blue-600 hover:text-blue-800 font-bold transition duration-200 hover:underline"
                  >
                    Lupa password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <button
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-3 text-lg"></i>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt mr-3 text-lg"></i>
                      Masuk
                    </>
                  )}
                </button>

                {/* Admin Access Info */}
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                  <div className="flex items-center">
                    <i className="fas fa-info-circle text-amber-600 mr-3 text-lg"></i>
                    <div>
                      <p className="text-sm text-amber-800 font-medium">
                        <strong>Admin:</strong> Gunakan email "admin" dan password "admin" untuk akses admin
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center pt-4">
                  <p className="text-gray-600 font-medium">
                    Belum punya akun?{" "}
                    <Link
                      to="/signUp"
                      className="text-blue-600 hover:text-blue-800 font-bold transition duration-200 hover:underline"
                    >
                      Daftar di sini
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Info */}
            <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 lg:p-12 flex flex-col justify-center text-white">
              <div className="text-center">
                <div className="mb-8">
                  <i className="fas fa-car text-6xl mb-4 opacity-80"></i>
                  <h2 className="text-3xl font-bold mb-4">PANDAWA RentCar</h2>
                  <p className="text-blue-100 font-medium leading-relaxed">
                    Solusi terpercaya untuk kebutuhan transportasi Anda. Nikmati perjalanan yang nyaman dan aman.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-blue-100">
                    <i className="fas fa-shield-alt mr-3 text-green-400"></i>
                    <span className="font-medium">Keamanan terjamin</span>
                  </div>
                  <div className="flex items-center text-blue-100">
                    <i className="fas fa-clock mr-3 text-green-400"></i>
                    <span className="font-medium">Layanan 24/7</span>
                  </div>
                  <div className="flex items-center text-blue-100">
                    <i className="fas fa-star mr-3 text-green-400"></i>
                    <span className="font-medium">Rating terbaik</span>
                  </div>
                  <div className="flex items-center text-blue-100">
                    <i className="fas fa-heart mr-3 text-green-400"></i>
                    <span className="font-medium">Kepuasan pelanggan</span>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-blue-400/30">
                  <p className="text-blue-100 text-sm font-medium">
                    "Pengalaman rental terbaik yang pernah saya alami!"
                  </p>
                  <p className="text-blue-200 text-xs mt-2">- Pelanggan Setia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
