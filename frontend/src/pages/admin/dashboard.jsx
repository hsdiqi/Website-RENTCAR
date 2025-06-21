"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import NavbarAdmin from "../../components/admin/navbar"

function DashboardAdmin() {
  const [cars, setCars] = useState([])
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    totalOrders: 0,
    pendingOrders: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      axios
        .get("http://localhost:3003/api/admin/dashboard")
        .then((response) => {
          console.log("Response data: ", response.data.data)
          if (Array.isArray(response.data.data.cars) && Array.isArray(response.data.data.pesanan)) {
            setCars(response.data.data.cars)
            setOrders(response.data.data.pesanan)

            // Calculate stats
            const totalCars = response.data.data.cars.length
            const availableCars = response.data.data.cars.filter((car) => car.STATUS === "Tersedia").length
            const totalOrders = response.data.data.pesanan.length
            const pendingOrders = response.data.data.pesanan.filter(
              (order) => order.STATUS_PEMESANAN === "Pending",
            ).length

            setStats({
              totalCars,
              availableCars,
              totalOrders,
              pendingOrders,
            })
          } else {
            console.error("Data response bukan array: ", response.data.data)
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error)
        })
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarAdmin />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="text-gray-700 mt-2 font-medium">Selamat datang di panel administrasi</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600 transform hover:scale-105 transition duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Total Kendaraan</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalCars}</p>
                </div>
                <div className="p-4 bg-blue-100 rounded-full">
                  <i className="fas fa-car text-blue-600 text-2xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600 transform hover:scale-105 transition duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Kendaraan Tersedia</p>
                  <p className="text-3xl font-bold text-green-600">{stats.availableCars}</p>
                </div>
                <div className="p-4 bg-green-100 rounded-full">
                  <i className="fas fa-check-circle text-green-600 text-2xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600 transform hover:scale-105 transition duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Total Pesanan</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <div className="p-4 bg-purple-100 rounded-full">
                  <i className="fas fa-shopping-cart text-purple-600 text-2xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-600 transform hover:scale-105 transition duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Pesanan Pending</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</p>
                </div>
                <div className="p-4 bg-orange-100 rounded-full">
                  <i className="fas fa-clock text-orange-600 text-2xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Data Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Cars Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <i className="fas fa-car mr-3 text-blue-600"></i>
                  Data Kendaraan Terbaru
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Kendaraan
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cars.slice(0, 5).map((car, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-bold text-gray-900">{car.NAMA_KENDARAAN}</div>
                            <div className="text-sm text-gray-600 font-medium">{car.NOPOL}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                              car.STATUS === "Tersedia"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-red-100 text-red-800 border border-red-200"
                            }`}
                          >
                            <i className={`fas ${car.STATUS === "Tersedia" ? "fa-check" : "fa-times"} mr-1`}></i>
                            {car.STATUS}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <i className="fas fa-shopping-cart mr-3 text-purple-600"></i>
                  Pesanan Terbaru
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Pelanggan
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.slice(0, 5).map((order, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-bold text-gray-900">{order.NAMA_LENGKAP}</div>
                            <div className="text-sm text-gray-600 font-medium">{order.ID_PESANAN}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                              order.STATUS_PEMESANAN === "Selesai"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : order.STATUS_PEMESANAN === "Pending"
                                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                  : "bg-red-100 text-red-800 border border-red-200"
                            }`}
                          >
                            <i
                              className={`fas ${
                                order.STATUS_PEMESANAN === "Selesai"
                                  ? "fa-check"
                                  : order.STATUS_PEMESANAN === "Pending"
                                    ? "fa-clock"
                                    : "fa-times"
                              } mr-1`}
                            ></i>
                            {order.STATUS_PEMESANAN}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Admin Info */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <i className="fas fa-user-shield mr-3 text-indigo-600"></i>
                Informasi Admin
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <i className="fas fa-user-tie text-white text-2xl"></i>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">Admin</h4>
                  <p className="text-gray-700 font-medium flex items-center mt-1">
                    <i className="fas fa-id-badge mr-2 text-indigo-600"></i>
                    STF0005
                  </p>
                  <p className="text-gray-700 font-medium flex items-center mt-1">
                    <i className="fas fa-envelope mr-2 text-indigo-600"></i>
                    admin@gmail.com
                  </p>
                  <p className="text-sm text-gray-600 font-medium flex items-center mt-1">
                    <i className="fas fa-briefcase mr-2 text-gray-500"></i>
                    Staff Administrator
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardAdmin
