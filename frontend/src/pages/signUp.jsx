"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

function SignUp() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    namaDepan: "",
    namaBelakang: "",
    nik: "",
    email: "",
    noTelp: "",
    password: "",
    alamat: "",
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState(null)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required field validation
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        newErrors[key] = "Field ini wajib diisi"
      }
    })

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Format email tidak valid"
    }

    // NIK validation (16 digits)
    if (formData.nik && (formData.nik.length !== 16 || !/^\d+$/.test(formData.nik))) {
      newErrors.nik = "NIK harus 16 digit angka"
    }

    // Phone validation
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/
    if (formData.noTelp && !phoneRegex.test(formData.noTelp)) {
      newErrors.noTelp = "Format nomor telepon tidak valid"
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter"
    }

    // Confirm password validation
    if (confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Konfirmasi password tidak cocok"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = async () => {
    if (!validateForm()) {
      setAlert(
        <div className="bg-red-100 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded mb-4 flex items-center shadow-md">
          <i className="fas fa-exclamation-triangle text-red-600 mr-3 text-lg"></i>
          <div>
            <strong>Error!</strong> Mohon periksa kembali data yang Anda masukkan.
          </div>
        </div>,
      )
      return
    }

    setIsLoading(true)
    setAlert(null)

    try {
      const response = await axios.post("http://localhost:3003/api/auth/register", formData)

      if (response.status === 201) {
        setAlert(
          <div className="bg-green-100 border-l-4 border-green-500 text-green-800 px-4 py-3 rounded mb-4 flex items-center shadow-md">
            <i className="fas fa-check-circle text-green-600 mr-3 text-lg"></i>
            <div>
              <strong>Berhasil!</strong> Pendaftaran berhasil, mengalihkan ke halaman login...
            </div>
          </div>,
        )

        setTimeout(() => {
          navigate("/signIn")
        }, 2000)
      }
    } catch (error) {
      setIsLoading(false)
      let errorMessage = "Terjadi kesalahan, silakan coba lagi"

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "Semua kolom harus diisi dengan benar"
            break
          case 409:
            errorMessage = "NIK atau Email sudah terdaftar"
            break
          case 499:
            errorMessage = "Pendaftaran tidak berhasil"
            break
          case 500:
            errorMessage = "Server Error, silakan coba lagi nanti"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Form */}
            <div className="lg:w-2/3 p-8 lg:p-12">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <i className="fas fa-user-plus text-white text-2xl"></i>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Akun Baru</h1>
                <p className="text-gray-600 font-medium">
                  Bergabunglah dengan <span className="text-blue-600 font-bold">PANDAWA</span> RentCar
                </p>
              </div>

              {/* Alert */}
              {alert}

              {/* Form */}
              <form className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="namaDepan" className="block text-sm font-bold text-gray-800 mb-2">
                      <i className="fas fa-user mr-2 text-blue-600"></i>
                      Nama Depan
                    </label>
                    <input
                      type="text"
                      id="namaDepan"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-600 transition duration-200 font-medium ${
                        errors.namaDepan
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-blue-600"
                      }`}
                      placeholder="Masukkan nama depan"
                      value={formData.namaDepan}
                      onChange={(e) => handleInputChange("namaDepan", e.target.value)}
                      disabled={isLoading}
                    />
                    {errors.namaDepan && <p className="text-red-600 text-sm mt-1 font-medium">{errors.namaDepan}</p>}
                  </div>

                  <div>
                    <label htmlFor="namaBelakang" className="block text-sm font-bold text-gray-800 mb-2">
                      <i className="fas fa-user mr-2 text-blue-600"></i>
                      Nama Belakang
                    </label>
                    <input
                      type="text"
                      id="namaBelakang"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-600 transition duration-200 font-medium ${
                        errors.namaBelakang
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-blue-600"
                      }`}
                      placeholder="Masukkan nama belakang"
                      value={formData.namaBelakang}
                      onChange={(e) => handleInputChange("namaBelakang", e.target.value)}
                      disabled={isLoading}
                    />
                    {errors.namaBelakang && (
                      <p className="text-red-600 text-sm mt-1 font-medium">{errors.namaBelakang}</p>
                    )}
                  </div>
                </div>

                {/* NIK */}
                <div>
                  <label htmlFor="nik" className="block text-sm font-bold text-gray-800 mb-2">
                    <i className="fas fa-id-card mr-2 text-blue-600"></i>
                    NIK (Nomor Induk Kependudukan)
                  </label>
                  <input
                    type="text"
                    id="nik"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-600 transition duration-200 font-medium ${
                      errors.nik ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-600"
                    }`}
                    placeholder="Masukkan 16 digit NIK"
                    value={formData.nik}
                    onChange={(e) => handleInputChange("nik", e.target.value)}
                    disabled={isLoading}
                    maxLength={16}
                  />
                  {errors.nik && <p className="text-red-600 text-sm mt-1 font-medium">{errors.nik}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2">
                    <i className="fas fa-envelope mr-2 text-blue-600"></i>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-600 transition duration-200 font-medium ${
                      errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-600"
                    }`}
                    placeholder="nama@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1 font-medium">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="noTelp" className="block text-sm font-bold text-gray-800 mb-2">
                    <i className="fas fa-phone mr-2 text-blue-600"></i>
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    id="noTelp"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-600 transition duration-200 font-medium ${
                      errors.noTelp ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-600"
                    }`}
                    placeholder="08xxxxxxxxxx"
                    value={formData.noTelp}
                    onChange={(e) => handleInputChange("noTelp", e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.noTelp && <p className="text-red-600 text-sm mt-1 font-medium">{errors.noTelp}</p>}
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="alamat" className="block text-sm font-bold text-gray-800 mb-2">
                    <i className="fas fa-map-marker-alt mr-2 text-blue-600"></i>
                    Alamat Lengkap
                  </label>
                  <textarea
                    id="alamat"
                    rows={3}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-600 transition duration-200 font-medium resize-none ${
                      errors.alamat ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-600"
                    }`}
                    placeholder="Masukkan alamat lengkap"
                    value={formData.alamat}
                    onChange={(e) => handleInputChange("alamat", e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.alamat && <p className="text-red-600 text-sm mt-1 font-medium">{errors.alamat}</p>}
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-2">
                      <i className="fas fa-lock mr-2 text-blue-600"></i>
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-600 transition duration-200 pr-12 font-medium ${
                          errors.password
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-blue-600"
                        }`}
                        placeholder="Minimal 6 karakter"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
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
                    {errors.password && <p className="text-red-600 text-sm mt-1 font-medium">{errors.password}</p>}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-800 mb-2">
                      <i className="fas fa-lock mr-2 text-blue-600"></i>
                      Konfirmasi Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-600 transition duration-200 pr-12 font-medium ${
                          errors.confirmPassword
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-blue-600"
                        }`}
                        placeholder="Ulangi password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-blue-600 transition duration-200"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} text-lg`}></i>
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-600 text-sm mt-1 font-medium">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSignUp}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-3 text-lg"></i>
                      Mendaftarkan...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus mr-3 text-lg"></i>
                      Daftar Sekarang
                    </>
                  )}
                </button>

                {/* Sign In Link */}
                <div className="text-center pt-4">
                  <p className="text-gray-600 font-medium">
                    Sudah punya akun?{" "}
                    <Link
                      to="/signIn"
                      className="text-blue-600 hover:text-blue-800 font-bold transition duration-200 hover:underline"
                    >
                      Masuk di sini
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Right Side - Image/Info */}
            <div className="lg:w-1/3 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 lg:p-12 flex flex-col justify-center text-white">
              <div className="text-center">
                <div className="mb-8">
                  <i className="fas fa-car text-6xl mb-4 opacity-80"></i>
                  <h2 className="text-3xl font-bold mb-4">Selamat Datang!</h2>
                  <p className="text-blue-100 font-medium leading-relaxed">
                    Bergabunglah dengan ribuan pelanggan yang telah mempercayai layanan rental kendaraan terbaik kami.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-blue-100">
                    <i className="fas fa-check-circle mr-3 text-green-400"></i>
                    <span className="font-medium">Kendaraan berkualitas tinggi</span>
                  </div>
                  <div className="flex items-center text-blue-100">
                    <i className="fas fa-check-circle mr-3 text-green-400"></i>
                    <span className="font-medium">Harga terjangkau</span>
                  </div>
                  <div className="flex items-center text-blue-100">
                    <i className="fas fa-check-circle mr-3 text-green-400"></i>
                    <span className="font-medium">Pelayanan 24/7</span>
                  </div>
                  <div className="flex items-center text-blue-100">
                    <i className="fas fa-check-circle mr-3 text-green-400"></i>
                    <span className="font-medium">Proses mudah dan cepat</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
