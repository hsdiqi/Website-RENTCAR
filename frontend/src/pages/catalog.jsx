"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/navbar"

const Catalog = () => {
  const navigate = useNavigate()
  const [cars, setCars] = useState([])
  const [carCategories, setCarCategories] = useState([])
  const [sortBy, setSortBy] = useState("lprice")
  const [carCategory, setCarCategory] = useState("Semua")
  const [statusFilter, setStatusFilter] = useState("Tersedia")
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const userId = localStorage.getItem("userId")
  const accessToken = localStorage.getItem("accessToken")

  const getImageUrl = (imageName) => {
    return `http://localhost:3003/api/images/cars/${encodeURIComponent(imageName)}`
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchCars()
  }, [sortBy, carCategory, statusFilter])

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3003/api/admin/mobil")
      if (Array.isArray(response.data.data.category)) {
        setCarCategories(["Semua", ...response.data.data.category])
      }
    } catch (error) {
      console.error("Error fetching car categories:", error)
    }
  }

  const fetchCars = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("http://localhost:3003/api/admin/mobil")
      const allCars = response.data.data.cars

      if (Array.isArray(allCars)) {
        let filteredCars =
          carCategory === "Semua" ? allCars : allCars.filter((car) => car.TIPE_KENDARAAN === carCategory)

        if (statusFilter !== "Semua") {
          filteredCars = filteredCars.filter((car) => car.STATUS === statusFilter)
        }

        filteredCars.sort((a, b) => {
          const hargaA = Number.parseInt(a.HARGA, 10)
          const hargaB = Number.parseInt(b.HARGA, 10)
          return sortBy === "lprice" ? hargaA - hargaB : hargaB - hargaA
        })

        setCars(filteredCars)
      }
    } catch (error) {
      console.error("Error fetching cars:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookNow = (id) => {
    if (!accessToken || !userId) {
      alert("Anda belum login. Silakan login terlebih dahulu.")
      navigate("/signIn")
      return
    }

    const car = cars.find((car) => car.ID_KENDARAAN === id)
    if (!car) {
      alert("Mobil tidak ditemukan.")
      return
    }

    if (car.STATUS === "Tidak Tersedia") {
      alert("Maaf, mobil sedang tidak tersedia.")
      return
    }

    navigate(`/bookingPage?id=${id}`)
  }

  const filteredCars = cars.filter(
    (car) =>
      car.NAMA_KENDARAAN.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.TIPE_KENDARAAN.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status) => {
    return status === "Tersedia"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200"
  }

  const getStatusIcon = (status) => {
    return status === "Tersedia" ? "fa-check-circle" : "fa-times-circle"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <i className="fas fa-car mr-4"></i>
              Katalog Kendaraan
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Temukan kendaraan impian Anda dengan berbagai pilihan terbaik dan harga terjangkau
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari kendaraan..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="fas fa-search absolute left-4 top-4 text-gray-500 text-lg"></i>
              </div>
            </div>

            {/* Category Filter */}
            <div className="w-full lg:w-auto">
              <select
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                value={carCategory}
                onChange={(e) => setCarCategory(e.target.value)}
              >
                {carCategories.map((category) => (
                  <option key={category} value={category}>
                    {category === "Semua" ? "Semua Kategori" : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-auto">
              <select
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Tidak Tersedia">Tidak Tersedia</option>
                <option value="Semua">Semua Status</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="w-full lg:w-auto">
              <select
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="lprice">Harga Terendah</option>
                <option value="hPrice">Harga Tertinggi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <i className="fas fa-list mr-3 text-blue-600"></i>
            Daftar Kendaraan
            <span className="ml-3 text-lg text-gray-600 font-medium">({filteredCars.length} kendaraan)</span>
          </h2>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
              <p className="text-gray-600 font-medium">Memuat kendaraan...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Cars Grid */}
            {filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <div
                    key={car.ID_KENDARAAN}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {/* Car Image */}
                    <div className="relative h-48 bg-gray-200">
                      <img
                        src={
                          car.FOTO_KENDARAAN ? getImageUrl(car.FOTO_KENDARAAN) : "/assets/car-default.png"
                        }
                        alt={car.NAMA_KENDARAAN}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/assets/car-default.png"
                        }}
                      />
                      <div className="absolute top-4 right-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(car.STATUS)}`}
                        >
                          <i className={`fas ${getStatusIcon(car.STATUS)} mr-1`}></i>
                          {car.STATUS}
                        </span>
                      </div>
                    </div>

                    {/* Car Details */}
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                          <i className="fas fa-car mr-2 text-blue-600"></i>
                          {car.NAMA_KENDARAAN}
                        </h3>
                        <p className="text-gray-600 font-medium flex items-center">
                          <i className="fas fa-tags mr-2 text-gray-500"></i>
                          {car.TIPE_KENDARAAN}
                        </p>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <i className="fas fa-users mr-3 text-gray-500 w-4"></i>
                          <span className="font-medium">Kapasitas: {car.CAP_PENUMPANG} orang</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <i className="fas fa-id-card mr-3 text-gray-500 w-4"></i>
                          <span className="font-medium">No. Polisi: {car.NOPOL}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <i className="fas fa-palette mr-3 text-gray-500 w-4"></i>
                          <span className="font-medium">Warna: {car.WARNA}</span>
                        </div>
                      </div>

                      {/* Price and Book Button */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-2xl font-bold text-green-600 flex items-center">
                            <i className="fas fa-money-bill-wave mr-2"></i>
                            {formatCurrency(car.HARGA)}
                          </p>
                          <p className="text-sm text-gray-600 font-medium">per hari</p>
                        </div>
                        <button
                          onClick={() => handleBookNow(car.ID_KENDARAAN)}
                          disabled={car.STATUS === "Tidak Tersedia"}
                          className={`px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg transform hover:scale-105 ${
                            car.STATUS === "Tersedia"
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-xl"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <i className={`fas ${car.STATUS === "Tersedia" ? "fa-calendar-check" : "fa-ban"} mr-2`}></i>
                          {car.STATUS === "Tersedia" ? "Pesan Sekarang" : "Tidak Tersedia"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <i className="fas fa-search text-6xl text-gray-400 mb-4"></i>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Tidak Ada Kendaraan</h3>
                  <p className="text-gray-600 font-medium mb-6">
                    Tidak ditemukan kendaraan yang sesuai dengan filter Anda. Coba ubah kriteria pencarian.
                  </p>
                  <button
                    onClick={() => {
                      setCarCategory("Semua")
                      setStatusFilter("Tersedia")
                      setSearchTerm("")
                      setSortBy("lprice")
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <i className="fas fa-undo mr-2"></i>
                    Reset Filter
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Catalog
