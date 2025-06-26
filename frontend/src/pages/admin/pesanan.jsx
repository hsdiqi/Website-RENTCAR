"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import NavbarAdmin from "../../components/admin/navbar"

const Pemesan = () => {
  const [bookings, setBookings] = useState([])
  const [bookingID, setBookingID] = useState("")
  const [userID, setUserID] = useState("")
  const [paymentID, setPaymentID] = useState("")
  const [namaDepan, setNamaDepan] = useState("")
  const [namaBelakang, setNamaBelakang] = useState("")
  const [notelp, setNotelp] = useState("")
  const [datePick, setDatePick] = useState(null)
  const [returnDate, setReturnDate] = useState(null)
  const [statusBooking, setStatusBooking] = useState("")
  const [email, setEmail] = useState("")
  const [methodPayment, setMethodPayment] = useState("")
  const [datePayment, setDatePayment] = useState(null)

  const [selected, setSelected] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    axios
      .get("http://localhost:3003/api/pesanan/show")
      .then((response) => {
        console.log("respon data: ", response.data)
        if (Array.isArray(response.data)) {
          setBookings(response.data)
          console.log("respon data berupa array")
        } else {
          console.log("respon bukan array: ", response.data)
        }
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error)
      })
  }

  useEffect(() => {
    if (selected) {
      setBookingID(selected.ID_PEMESANAN)
      setPaymentID(selected.id_pembayaran)
      setUserID(selected.id_pelanggan)
      const [firstName, ...lastNameParts] = selected.NAMA_PELANGGAN.split(" ")
      setNamaDepan(firstName)
      setNamaBelakang(lastNameParts.join(" "))
      setNotelp(selected.TELEPON_PELANGGAN)

      const formatDates = (dateString) => {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}`
      }

      setDatePick(formatDates(selected.START_DATE))
      setReturnDate(formatDates(selected.END_DATE))
      setStatusBooking(selected.STATUS_PEMESANAN)
      setEmail(selected.EMAIL_PELANGGAN)
      setMethodPayment(selected.METODE_PEMBAYARAN)
      setDatePayment(formatDates(selected.TANGGAL_PEMBAYARAN))
    }
  }, [selected])

  const handlingDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) {
      axios
        .put("http://localhost:3003/api/pesanan/admin/del", { id })
        .then((response) => {
          if (response.status === 200) {
            alert("Berhasil menghapus pesanan")
            setBookings(bookings.filter((booking) => booking.ID_PEMESANAN !== id))
          }
        })
        .catch((error) => {
          console.error("Error deleting booking:", error)
        })
    }
  }

  const handlingDetail = (id) => {
    const bookID = bookings.find((booking) => booking.ID_PEMESANAN === id)
    setSelected(bookID)
    setIsEditing(false)
  }

  const handlingUbah = (id) => {
    const bookID = bookings.find((booking) => booking.ID_PEMESANAN === id)
    setSelected(bookID)
    setIsEditing(true)
  }

  const handleSimpan = () => {
    const updateBooking = {
      bookingID,
      userID,
      paymentID,
      namaDepan,
      namaBelakang,
      notelp,
      datePick,
      returnDate,
      statusBooking,
      email,
      methodPayment,
      datePayment,
    }

    axios
      .post("http://localhost:3003/api/pesanan/admin/update", updateBooking)
      .then((response) => {
        if (response.status === 200) {
          alert("Data pesanan berhasil diupdate")
          setIsEditing(false)
          fetchData()
        }
      })
      .catch((error) => {
        console.error("Error updating pesanan:", error)
      })
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("id-ID", options)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Selesai":
        return "bg-green-100 text-green-800 border-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Dibatalkan":
        return "bg-red-100 text-red-800 border-red-200"
      case "Berlangsung":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Selesai":
        return "fa-check-circle"
      case "Pending":
        return "fa-clock"
      case "Dibatalkan":
        return "fa-times-circle"
      case "Berlangsung":
        return "fa-play-circle"
      default:
        return "fa-question-circle"
    }
  }

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.NAMA_PELANGGAN.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.ID_PEMESANAN.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.NAMA_KENDARAAN.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarAdmin />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center">
              <i className="fas fa-shopping-cart mr-4 text-blue-600"></i>
              Manajemen Pesanan
            </h1>
            <p className="text-gray-700 mt-2 font-medium">Kelola data pesanan rental kendaraan</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Cari pesanan..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search absolute left-4 top-4 text-gray-500 text-lg"></i>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <i className="fas fa-list mr-3 text-purple-600"></i>
                Daftar Pesanan
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">No</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Pesanan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Pelanggan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Kendaraan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.map((pesanan, index) => (
                    <tr key={pesanan.ID_PEMESANAN} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-bold text-gray-900 flex items-center">
                            <i className="fas fa-receipt mr-2 text-blue-600"></i>
                            {pesanan.ID_PEMESANAN}
                          </div>
                          <div className="text-sm text-gray-600 font-medium flex items-center">
                            <i className="fas fa-calendar mr-2 text-gray-500"></i>
                            {formatDate(pesanan.TANGGAL_PEMESANAN)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-bold text-gray-900 flex items-center">
                            <i className="fas fa-user mr-2 text-green-600"></i>
                            {pesanan.NAMA_PELANGGAN}
                          </div>
                          <div className="text-sm text-gray-600 font-medium flex items-center">
                            <i className="fas fa-envelope mr-2 text-gray-500"></i>
                            {pesanan.EMAIL_PELANGGAN}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-bold text-gray-900 flex items-center">
                            <i className="fas fa-car mr-2 text-indigo-600"></i>
                            {pesanan.NAMA_KENDARAAN}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            <i className="fas fa-id-card mr-1"></i>
                            {pesanan.NOPOL} • <i className="fas fa-tags mr-1"></i>
                            {pesanan.TIPE_KENDARAAN}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-green-600">
                        <i className="fas fa-money-bill-wave mr-1"></i>
                        {formatCurrency(pesanan.TOTAL_BAYAR)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(pesanan.STATUS_PEMESANAN)}`}
                        >
                          <i className={`fas ${getStatusIcon(pesanan.STATUS_PEMESANAN)} mr-1`}></i>
                          {pesanan.STATUS_PEMESANAN}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlingUbah(pesanan.ID_PEMESANAN)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center"
                          >
                            <i className="fas fa-edit mr-1"></i>
                            Edit
                          </button>
                          <button
                            onClick={() => handlingDetail(pesanan.ID_PEMESANAN)}
                            className="text-green-600 hover:text-green-800 text-sm font-bold flex items-center"
                          >
                            <i className="fas fa-eye mr-1"></i>
                            Detail
                          </button>
                          <button
                            onClick={() => handlingDelete(pesanan.ID_PEMESANAN)}
                            className="text-red-600 hover:text-red-800 text-sm font-bold flex items-center"
                          >
                            <i className="fas fa-trash mr-1"></i>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail/Edit Modal */}
          {selected && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-300">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <i className={`fas ${isEditing ? "fa-edit" : "fa-info-circle"} mr-3 text-indigo-600`}></i>
                      {isEditing ? "Edit Pesanan" : "Detail Pesanan"}
                    </h3>
                    <button
                      onClick={() => {
                        setSelected(null)
                        setIsEditing(false)
                      }}
                      className="text-gray-500 hover:text-red-600 transition duration-200"
                    >
                      <i className="fas fa-times text-2xl"></i>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">
                            <i className="fas fa-user mr-2 text-blue-600"></i>
                            Nama Depan
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                            value={namaDepan}
                            onChange={(e) => setNamaDepan(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">
                            <i className="fas fa-user mr-2 text-blue-600"></i>
                            Nama Belakang
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                            value={namaBelakang}
                            onChange={(e) => setNamaBelakang(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">
                            <i className="fas fa-envelope mr-2 text-blue-600"></i>
                            Email
                          </label>
                          <input
                            type="email"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">
                            <i className="fas fa-phone mr-2 text-blue-600"></i>
                            Nomor Telepon
                          </label>
                          <input
                            type="tel"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                            value={notelp}
                            onChange={(e) => setNotelp(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">
                            <i className="fas fa-calendar-plus mr-2 text-blue-600"></i>
                            Tanggal Mulai
                          </label>
                          <input
                            type="date"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                            value={datePick}
                            onChange={(e) => setDatePick(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">
                            <i className="fas fa-calendar-minus mr-2 text-blue-600"></i>
                            Tanggal Selesai
                          </label>
                          <input
                            type="date"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">
                            <i className="fas fa-info-circle mr-2 text-blue-600"></i>
                            Status Pesanan
                          </label>
                          <select
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                            value={statusBooking}
                            onChange={(e) => setStatusBooking(e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Berlangsung">Berlangsung</option>
                            <option value="Selesai">Selesai</option>
                            <option value="Dibatalkan">Dibatalkan</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">
                            <i className="fas fa-credit-card mr-2 text-blue-600"></i>
                            Metode Pembayaran
                          </label>
                          <select
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                            value={methodPayment}
                            onChange={(e) => setMethodPayment(e.target.value)}
                          >
                            <option value="Cash">Cash</option>
                            <option value="Transfer">Transfer</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="E-Wallet">E-Wallet</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                          <i className="fas fa-calendar-check mr-2 text-blue-600"></i>
                          Tanggal Pembayaran
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                          value={datePayment}
                          onChange={(e) => setDatePayment(e.target.value)}
                        />
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <button
                          onClick={handleSimpan}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-lg transform hover:scale-105"
                        >
                          <i className="fas fa-save mr-2"></i>
                          Simpan Perubahan
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-lg transform hover:scale-105"
                        >
                          <i className="fas fa-times mr-2"></i>
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                          <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center">
                            <i className="fas fa-info-circle mr-2 text-blue-600"></i>
                            Informasi Pesanan
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center">
                                <i className="fas fa-receipt mr-3 text-gray-600 w-5"></i>
                                <span className="text-gray-700 font-medium">ID Pesanan:</span>
                                <span className="font-bold ml-2">{selected.ID_PEMESANAN}</span>
                              </div>
                              <div className="flex items-center">
                                <i className="fas fa-calendar mr-3 text-gray-600 w-5"></i>
                                <span className="text-gray-700 font-medium">Tanggal Pesan:</span>
                                <span className="font-bold ml-2">{formatDate(selected.TANGGAL_PEMESANAN)}</span>
                              </div>
                              <div className="flex items-center">
                                <i className="fas fa-user mr-3 text-gray-600 w-5"></i>
                                <span className="text-gray-700 font-medium">Nama Pelanggan:</span>
                                <span className="font-bold ml-2">{selected.NAMA_PELANGGAN}</span>
                              </div>
                              <div className="flex items-center">
                                <i className="fas fa-envelope mr-3 text-gray-600 w-5"></i>
                                <span className="text-gray-700 font-medium">Email:</span>
                                <span className="font-bold ml-2">{selected.EMAIL_PELANGGAN}</span>
                              </div>
                              <div className="flex items-center">
                                <i className="fas fa-phone mr-3 text-gray-600 w-5"></i>
                                <span className="text-gray-700 font-medium">Telepon:</span>
                                <span className="font-bold ml-2">{selected.TELEPON_PELANGGAN}</span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center">
                                <i className="fas fa-car mr-3 text-gray-600 w-5"></i>
                                <span className="text-gray-700 font-medium">Kendaraan:</span>
                                <span className="font-bold ml-2">{selected.NAMA_KENDARAAN}</span>
                              </div>
                              <div className="flex items-center">
                                <i className="fas fa-id-card mr-3 text-gray-600 w-5"></i>
                                <span className="text-gray-700 font-medium">No. Polisi:</span>
                                <span className="font-bold ml-2">{selected.NOPOL}</span>
                              </div>
                              <div className="flex items-center">
                                <i className="fas fa-tags mr-3 text-gray-600 w-5"></i>
                                <span className="text-gray-700 font-medium">Tipe:</span>
                                <span className="font-bold ml-2">{selected.TIPE_KENDARAAN}</span>
                              </div>
                              <div className="flex items-center">
                                <i className="fas fa-calendar-plus mr-3 text-gray-600 w-5"></i>
                                <span className="text-gray-700 font-medium">Mulai Sewa:</span>
                                <span className="font-bold ml-2">{formatDate(selected.START_DATE)}</span>
                              </div>
                              <div className="flex items-center">
                                <i className="fas fa-calendar-minus mr-3 text-gray-600 w-5"></i>
                                <span className="text-gray-700 font-medium">Selesai Sewa:</span>
                                <span className="font-bold ml-2">{formatDate(selected.END_DATE)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center">
                            <i className="fas fa-money-bill-wave mr-2 text-green-600"></i>
                            Pembayaran
                          </h4>
                          <div className="space-y-3">
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <div className="flex items-center">
                                <i className="fas fa-money-bill-wave mr-3 text-green-600"></i>
                                <span className="text-gray-700 font-medium">Total Bayar:</span>
                              </div>
                              <span className="font-bold text-2xl text-green-600 block mt-1">
                                {formatCurrency(selected.TOTAL_BAYAR)}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-credit-card mr-3 text-gray-600 w-5"></i>
                              <span className="text-gray-700 font-medium">Metode:</span>
                              <span className="font-bold ml-2">{selected.METODE_PEMBAYARAN}</span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-calendar-check mr-3 text-gray-600 w-5"></i>
                              <span className="text-gray-700 font-medium">Tanggal Bayar:</span>
                              <span className="font-bold ml-2">{formatDate(selected.TANGGAL_PEMBAYARAN)}</span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-info-circle mr-3 text-gray-600 w-5"></i>
                              <span className="text-gray-700 font-medium">Status:</span>
                              <span
                                className={`ml-2 inline-flex px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(selected.STATUS_PEMESANAN)}`}
                              >
                                <i className={`fas ${getStatusIcon(selected.STATUS_PEMESANAN)} mr-1`}></i>
                                {selected.STATUS_PEMESANAN}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Pemesan
