"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function LoginAdmin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [alert, setAlert] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (event) => {
    event.preventDefault()
    setIsLoading(true)

    axios
      .post("http://localhost:3003/api/auth/admin/login", { email, password })
      .then((response) => {
        const { accessToken, adminId } = response.data
        localStorage.setItem("accessTokenAdmin", accessToken)
        localStorage.setItem("adminId", adminId)

        if (response.status === 200) {
          setAlert(
            <div className="bg-green-100 border-l-4 border-green-500 text-green-800 px-4 py-3 rounded mb-4 flex items-center shadow-md">
              <i className="fas fa-check-circle text-green-600 mr-3 text-lg"></i>
              <div>
                <strong>Berhasil!</strong> Login berhasil, mengalihkan ke dashboard...
              </div>
            </div>,
          )

          setTimeout(() => {
            navigate("/dashboardAdmin")
          }, 1500)
        }
      })
      .catch((error) => {
        setIsLoading(false)
        const errorMessage = "Terjadi kesalahan sistem"
        console.error("Login error:", error)

        setAlert(
          <div className="bg-red-100 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded mb-4 flex items-center shadow-md">
            <i className="fas fa-exclamation-triangle text-red-600 mr-3 text-lg"></i>
            <div>
              <strong>Error!</strong> {errorMessage}
            </div>
          </div>,
        )
      })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <i className="fas fa-shield-alt text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
            <p className="text-gray-600 font-medium">Masuk ke dashboard administrasi</p>
          </div>

          {/* Alert */}
          {alert}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2">
                <i className="fas fa-envelope mr-2 text-blue-600"></i>
                Email Administrator
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200 font-medium"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                autoFocus
              />
            </div>

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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-3 text-lg"></i>
                  Memproses...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt mr-3 text-lg"></i>
                  Masuk ke Dashboard
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg shadow-sm">
            <div className="flex items-center">
              <i className="fas fa-exclamation-triangle text-amber-600 mr-3 text-lg"></i>
              <p className="text-sm text-amber-800 font-medium">
                <strong>Keamanan:</strong> Halaman ini hanya untuk administrator yang berwenang
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginAdmin
