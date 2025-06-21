"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import NavbarAdmin from "../../components/admin/navbar"

function ManajemenAkun() {
  const [accounts, setAccounts] = useState([])
  const [userID, setUserID] = useState("")
  const [namaDepan, setNamaDepan] = useState("")
  const [namaBelakang, setNamaBelakang] = useState("")
  const [alamat, setAlamat] = useState("")
  const [notelp, setNotelp] = useState("")
  const [email, setEmail] = useState("")
  const [nik, setNik] = useState("")
  const [password, setPassword] = useState("")
  const [memberID, setMemberID] = useState("")
  const [pointMember, setPointMember] = useState("")
  const [jenisMember, setJenisMember] = useState("")

  const [selected, setSelected] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  useEffect(() => {
    if (selected) {
      setUserID(selected.ID_PELANGGAN)
      const [firstName, ...lastNameParts] = selected.NAMA_PELANGGAN.split(" ")
      setNamaDepan(firstName)
      setNamaBelakang(lastNameParts.join(" "))
      setNotelp(selected.NOMOR_TELEPON)
      setNik(selected.NIK)
      setMemberID(selected.MEMBER_ID_PELANGGAN)
      setPointMember(selected.POINT_MEMBERSHIP)
      setAlamat(selected.ALAMAT)
      setEmail(selected.EMAIL)
      setPassword(selected.PASSWORD)
      setJenisMember(selected.JENIS_MEMBERSHIP)
    }
  }, [selected])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    axios
      .get("http://localhost:3003/api/admin/pelanggan")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setAccounts(response.data)
        } else {
          console.log("respon bukan array: ", response.data)
        }
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error)
      })
  }

  const hapusHandling = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus akun ini?")) {
      axios
        .put(`http://localhost:3003/api/admin/pelanggan/del/${id}`)
        .then((response) => {
          if (response.status === 200) {
            alert("Berhasil menghapus akun")
            fetchData()
          }
        })
        .catch((error) => {
          console.error("Error deleting account:", error)
        })
    }
  }

  const detailHandling = (id) => {
    const userID = accounts.find((account) => account.ID_PELANGGAN === id)
    setSelected(userID)
    setIsEditing(false)
  }

  const ubahHandling = (id) => {
    const userID = accounts.find((account) => account.ID_PELANGGAN === id)
    setSelected(userID)
    setIsEditing(true)
  }

  const handleSimpan = () => {
    if (jenisMember === "Regular") {
      setMemberID(1)
    } else if (jenisMember === "Bronze") {
      setMemberID(2)
    } else if (jenisMember === "Silver") {
      setMemberID(3)
    } else if (jenisMember === "Gold") {
      setMemberID(4)
    } else if (jenisMember === "Platinum") {
      setMemberID(5)
    } else {
      setMemberID(null)
    }

    const updateUserData = {
      userID,
      namaDepan,
      namaBelakang,
      nik,
      notelp,
      email,
      alamat,
      password,
      memberID,
      pointMember,
    }

    axios
      .post("http://localhost:3003/api/admin/pelanggan/update", updateUserData)
      .then((response) => {
        if (response.status === 204) {
          alert("Data Pelanggan berhasil diupdate")
          setIsEditing(false)
          fetchData()
        }
      })
      .catch((error) => {
        console.error("Error updating pelanggan:", error)
      })
  }

  const filteredAccounts = accounts.filter(
    (account) =>
      account.NAMA_PELANGGAN.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.EMAIL.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.ID_PELANGGAN.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getMembershipColor = (membership) => {
    switch (membership) {
      case "Regular":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "Bronze":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Silver":
        return "bg-gray-200 text-gray-800 border-gray-300"
      case "Gold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Platinum":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarAdmin />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center">
              <i className="fas fa-users mr-4 text-blue-600"></i>
              Manajemen Akun Pelanggan
            </h1>
            <p className="text-gray-700 mt-2 font-medium">Kelola data akun pelanggan rental</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Cari pelanggan..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search absolute left-4 top-4 text-gray-500 text-lg"></i>
            </div>
          </div>

          {/* Accounts Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <i className="fas fa-list mr-3 text-blue-600"></i>
                Daftar Akun Pelanggan
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">No</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Pelanggan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Kontak
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Membership
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
                  {filteredAccounts.map((account, index) => (
                    <tr key={account.ID_PELANGGAN} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-bold text-gray-900 flex items-center">
                            <i className="fas fa-user mr-2 text-blue-600"></i>
                            {account.NAMA_PELANGGAN}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">{account.ID_PELANGGAN}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm text-gray-900 font-medium flex items-center">
                            <i className="fas fa-envelope mr-2 text-gray-600"></i>
                            {account.EMAIL}
                          </div>
                          <div className="text-sm text-gray-600 font-medium flex items-center">
                            <i className="fas fa-phone mr-2 text-gray-600"></i>
                            {account.NOMOR_TELEPON}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${getMembershipColor(account.JENIS_MEMBERSHIP)}`}
                        >
                          <i className="fas fa-crown mr-1"></i>
                          {account.JENIS_MEMBERSHIP}
                        </span>
                        <div className="text-xs text-gray-600 mt-1 font-medium flex items-center">
                          <i className="fas fa-star mr-1"></i>
                          {account.POINT_MEMBERSHIP} poin
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${
                            account.STATUS === "aktif"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }`}
                        >
                          <i
                            className={`fas ${account.STATUS === "aktif" ? "fa-check-circle" : "fa-times-circle"} mr-1`}
                          ></i>
                          {account.STATUS}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => ubahHandling(account.ID_PELANGGAN)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center"
                          >
                            <i className="fas fa-edit mr-1"></i>
                            Edit
                          </button>
                          <button
                            onClick={() => detailHandling(account.ID_PELANGGAN)}
                            className="text-green-600 hover:text-green-800 text-sm font-bold flex items-center"
                          >
                            <i className="fas fa-eye mr-1"></i>
                            Detail
                          </button>
                          <button
                            onClick={() => hapusHandling(account.ID_PELANGGAN)}
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
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-300">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <i className={`fas ${isEditing ? "fa-edit" : "fa-info-circle"} mr-3 text-indigo-600`}></i>
                      {isEditing ? "Edit Akun Pelanggan" : "Detail Akun Pelanggan"}
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
                    <div className="space-y-4">
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

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                          <i className="fas fa-map-marker-alt mr-2 text-blue-600"></i>
                          Alamat
                        </label>
                        <textarea
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                          rows={3}
                          value={alamat}
                          onChange={(e) => setAlamat(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
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
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">
                            <i className="fas fa-id-card mr-2 text-blue-600"></i>
                            NIK
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                            value={nik}
                            onChange={(e) => setNik(e.target.value)}
                          />
                        </div>
                      </div>

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

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">
                            <i className="fas fa-crown mr-2 text-blue-600"></i>
                            Jenis Membership
                          </label>
                          <select
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                            value={jenisMember}
                            onChange={(e) => setJenisMember(e.target.value)}
                          >
                            <option value="Regular">Regular</option>
                            <option value="Bronze">Bronze</option>
                            <option value="Silver">Silver</option>
                            <option value="Gold">Gold</option>
                            <option value="Platinum">Platinum</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">
                            <i className="fas fa-star mr-2 text-blue-600"></i>
                            Point Membership
                          </label>
                          <input
                            type="number"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                            value={pointMember}
                            onChange={(e) => setPointMember(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                          <i className="fas fa-lock mr-2 text-blue-600"></i>
                          Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
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
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center">
                            <i className="fas fa-user mr-2 text-blue-600"></i>
                            Informasi Pribadi
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <i className="fas fa-user mr-3 text-gray-600 w-5"></i>
                              <span className="text-gray-700 font-medium">Nama:</span>
                              <span className="font-bold ml-2">{selected.NAMA_PELANGGAN}</span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-id-card mr-3 text-gray-600 w-5"></i>
                              <span className="text-gray-700 font-medium">NIK:</span>
                              <span className="font-bold ml-2">{selected.NIK}</span>
                            </div>
                            <div className="flex items-start">
                              <i className="fas fa-map-marker-alt mr-3 text-gray-600 w-5 mt-1"></i>
                              <span className="text-gray-700 font-medium">Alamat:</span>
                              <span className="font-bold ml-2">{selected.ALAMAT}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center">
                            <i className="fas fa-address-book mr-2 text-blue-600"></i>
                            Kontak & Membership
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <i className="fas fa-envelope mr-3 text-gray-600 w-5"></i>
                              <span className="text-gray-700 font-medium">Email:</span>
                              <span className="font-bold ml-2">{selected.EMAIL}</span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-phone mr-3 text-gray-600 w-5"></i>
                              <span className="text-gray-700 font-medium">Telepon:</span>
                              <span className="font-bold ml-2">{selected.NOMOR_TELEPON}</span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-crown mr-3 text-gray-600 w-5"></i>
                              <span className="text-gray-700 font-medium">Membership:</span>
                              <span
                                className={`ml-2 inline-flex px-3 py-1 text-xs font-bold rounded-full border ${getMembershipColor(selected.JENIS_MEMBERSHIP)}`}
                              >
                                {selected.JENIS_MEMBERSHIP}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-star mr-3 text-gray-600 w-5"></i>
                              <span className="text-gray-700 font-medium">Poin:</span>
                              <span className="font-bold ml-2 text-yellow-600">{selected.POINT_MEMBERSHIP}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <i className="fas fa-lock mr-3 text-gray-600"></i>
                            <span className="text-gray-700 font-medium">Password:</span>
                            <span className="font-bold ml-2">{showPassword ? selected.PASSWORD : "••••••••"}</span>
                          </div>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                              onChange={togglePasswordVisibility}
                            />
                            <span className="text-sm text-gray-700 font-medium">Tampilkan Password</span>
                          </label>
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

export default ManajemenAkun
