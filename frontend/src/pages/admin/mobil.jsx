import { useEffect, useState } from "react";
import NavbarAdmin from "../../components/admin/navbar";
import axios from "axios";

function Mobil() {
  const [cars, setCars] = useState([]);
  const [category, setCategory] = useState([]);
  const [nameCar, setNameCar] = useState("");
  const [color, setColor] = useState("");
  const [tipe, setTipe] = useState("");
  const [capacity, setCapacity] = useState("");
  const [nopol, setNopol] = useState("");
  const [thnBeli, setThnBeli] = useState("");
  const [image, setImage] = useState(null);
  const [service, setService] = useState("");
  const [speed, setSpeed] = useState("");
  const [harga, setHarga] = useState("");
  const [anyBook, setAnyBook] = useState("");

  const [selectedCar, setSelectedCar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFoto, setEditFoto] = useState(null);

  const fetchCarsAndCategories = () => {
    axios
      .get("http://localhost:3003/api/cars/show")
      .then((response) => {
        const resData = response.data.data;
        // console.log(resData);
        // console.log("car", resData.cars);
        // console.log("category", resData.category);

        if (Array.isArray(resData.cars)) {
          setCars(resData.cars);
        }

        if (Array.isArray(resData.category)) {
          setCategory(["Lain", ...resData.category]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchCarsAndCategories();
  }, []);

  const handlingUbah = (id) => {
    const selected = cars.find((car) => car.ID_KENDARAAN === id);
    setSelectedCar(selected);
    setIsEditing(true);
    setAnyBook(selected.BANYAK_SEWA || 0);
    // console.log(selected);
  };

  const handlingDetail = (id) => {
    const selected = cars.find((car) => car.ID_KENDARAAN === id);
    setSelectedCar(selected);
    setIsEditing(false);
    // console.log(selected);
  };

  const handlingHapus = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kendaraan ini?")) {
      axios
        .put("http://localhost:3001/api/cars/admin/del", { id })
        .then((response) => {
          if (response.status === 200) {
            alert("Berhasil menghapus kendaraan");
            setCars(cars.filter((car) => car.ID_KENDARAAN !== id));
          }
        })
        .catch((error) => {
          console.error("Error deleting car:", error);
        });
    }
  };

  const addHandling = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("nameCar", nameCar);
    formData.append("tipe", tipe);
    formData.append("color", color);
    formData.append("capacity", capacity);
    formData.append("nopol", nopol);
    formData.append("thnBeli", thnBeli);
    formData.append("image", image);
    formData.append("service", service);
    formData.append("speed", speed);
    formData.append("harga", harga);

    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }

    if (
      !nameCar ||
      !color ||
      !capacity ||
      !nopol ||
      !thnBeli ||
      !image ||
      !service ||
      !speed ||
      !harga ||
      !tipe
    ) {
      alert("Harap isi semua field terlebih dahulu!");
      return;
    }

    axios
      .post("http://localhost:3003/api/cars/admin/addCar", formData)
      .then((response) => {
        if (response.status === 201) {
          alert("Berhasil menambah kendaraan");
          clearForm();
          fetchCarsAndCategories();
        }
      })
      .catch((err) => {
        console.error("Error uploading car:", err);
      });
  };

  const clearForm = () => {
    setNameCar("");
    setColor("");
    setCapacity("");
    setNopol("");
    setThnBeli("");
    setImage(null);
    setService("");
    setSpeed("");
    setHarga("");
    setTipe("");
  };

  const handleSimpan = () => {
    const formData = new FormData();
    formData.append("id", selectedCar.ID_KENDARAAN);
    formData.append("nameCar", selectedCar.NAMA_KENDARAAN);
    formData.append("tipe", selectedCar.TIPE_KENDARAAN);
    formData.append("color", selectedCar.WARNA);
    formData.append("capacity", selectedCar.CAP_PENUMPANG);
    formData.append("nopol", selectedCar.NOPOL);
    formData.append("thnBeli", selectedCar.TAHUN_BELI);
    formData.append("service", selectedCar.LAST_SERVICE);
    formData.append("speed", selectedCar.TOP_SPEED);
    formData.append("harga", selectedCar.HARGA);
    formData.append("anyBook", Number.parseInt(anyBook));
    formData.append("status", selectedCar.STATUS);
    // console.log("last seervice:", selectedCar.LAST_SERVICE);
    // console.log(selectedCar)

    if (editFoto) {
      formData.append("image", editFoto);
    }

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    axios
      .post(`http://localhost:3003/api/cars/admin/update`, formData)
      .then((response) => {
        console.log('response: ', response);
        if (response.status === 200) {
          alert("Data mobil berhasil diupdate");
          setIsEditing(false);
          setEditFoto(null);
          fetchCarsAndCategories();
        }
      })
      .catch((error) => {
        console.error("Error updating car:", error);
      });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarAdmin />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center">
                <i className="fas fa-car mr-4 text-blue-600"></i>
                Manajemen Kendaraan
              </h1>
              <p className="text-gray-700 mt-2 font-medium">
                Kelola data kendaraan rental
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Car Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <i className="fas fa-plus-circle mr-3 text-green-600"></i>
                    Tambah Kendaraan
                  </h3>
                </div>
                <div className="p-6">
                  <form onSubmit={addHandling} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">
                        <i className="fas fa-tags mr-2 text-blue-600"></i>
                        Tipe Kendaraan
                      </label>
                      <select
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                        value={tipe}
                        onChange={(e) => setTipe(e.target.value)}
                        required
                      >
                        <option value="">Pilih Tipe</option>
                        {category.map((kategori, index) => (
                          <option key={index} value={kategori}>
                            {kategori}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">
                        <i className="fas fa-car mr-2 text-blue-600"></i>
                        Nama Kendaraan
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                        placeholder="Toyota Camry"
                        value={nameCar}
                        onChange={(e) => setNameCar(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                          <i className="fas fa-palette mr-2 text-blue-600"></i>
                          Warna
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                          placeholder="Hitam"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                          <i className="fas fa-users mr-2 text-blue-600"></i>
                          Kapasitas
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                          placeholder="4"
                          value={capacity}
                          onChange={(e) => setCapacity(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                          <i className="fas fa-id-card mr-2 text-blue-600"></i>
                          No. Polisi
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                          placeholder="B 1234 AB"
                          value={nopol}
                          onChange={(e) => setNopol(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                          <i className="fas fa-calendar-alt mr-2 text-blue-600"></i>
                          Tahun Beli
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                          placeholder="2024"
                          value={thnBeli}
                          onChange={(e) => setThnBeli(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                          <i className="fas fa-wrench mr-2 text-blue-600"></i>
                          Terakhir Service
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                          value={service}
                          onChange={(e) => setService(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                          <i className="fas fa-tachometer-alt mr-2 text-blue-600"></i>
                          Top Speed (km/h)
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                          placeholder="155"
                          value={speed}
                          onChange={(e) => setSpeed(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">
                        <i className="fas fa-money-bill-wave mr-2 text-blue-600"></i>
                        Harga Sewa (per hari)
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                        placeholder="300000"
                        value={harga}
                        onChange={(e) => setHarga(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">
                        <i className="fas fa-camera mr-2 text-blue-600"></i>
                        Foto Kendaraan
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                        onChange={(e) => setImage(e.target.files[0])}
                        required
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-lg transform hover:scale-105"
                      >
                        <i className="fas fa-plus mr-2"></i>
                        Tambah Kendaraan
                      </button>
                      <button
                        type="button"
                        onClick={clearForm}
                        className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-lg transform hover:scale-105"
                      >
                        <i className="fas fa-undo mr-2"></i>
                        Reset
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Cars Table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <i className="fas fa-list mr-3 text-blue-600"></i>
                    Daftar Kendaraan
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          No
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Kendaraan
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Tipe
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Harga
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {cars.map((car, index) => (
                        <tr
                          key={car.ID_KENDARAAN}
                          className="hover:bg-gray-50 transition duration-150"
                        >
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-bold text-gray-900">
                                {car.NAMA_KENDARAAN}
                              </div>
                              <div className="text-sm text-gray-600 font-medium">
                                <i className="fas fa-id-card mr-1"></i>
                                {car.NOPOL} •{" "}
                                <i className="fas fa-palette mr-1"></i>
                                {car.WARNA}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            {car.TIPE_KENDARAAN}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${
                                car.STATUS === "Tersedia"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-red-100 text-red-800 border-red-200"
                              }`}
                            >
                              <i
                                className={`fas ${
                                  car.STATUS === "Tersedia"
                                    ? "fa-check"
                                    : "fa-times"
                                } mr-1`}
                              ></i>
                              {car.STATUS}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            {formatCurrency(car.HARGA)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handlingUbah(car.ID_KENDARAAN)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center"
                              >
                                <i className="fas fa-edit mr-1"></i>
                                Edit
                              </button>
                              <button
                                onClick={() => handlingDetail(car.ID_KENDARAAN)}
                                className="text-green-600 hover:text-green-800 text-sm font-bold flex items-center"
                              >
                                <i className="fas fa-eye mr-1"></i>
                                Detail
                              </button>
                              <button
                                onClick={() => handlingHapus(car.ID_KENDARAAN)}
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
            </div>
          </div>

          {/* Detail/Edit Modal */}
          {selectedCar && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-300">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <i
                        className={`fas ${
                          isEditing ? "fa-edit" : "fa-info-circle"
                        } mr-3 text-indigo-600`}
                      ></i>
                      {isEditing ? "Edit Kendaraan" : "Detail Kendaraan"}
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedCar(null);
                        setIsEditing(false);
                        setEditFoto(null);
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
                            <i className="fas fa-car mr-2 text-blue-600"></i>
                            Nama Kendaraan
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                            value={selectedCar.NAMA_KENDARAAN}
                            onChange={(e) =>
                              setSelectedCar({
                                ...selectedCar,
                                NAMA_KENDARAAN: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">
                            <i className="fas fa-palette mr-2 text-blue-600"></i>
                            Warna
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                            value={selectedCar.WARNA}
                            onChange={(e) =>
                              setSelectedCar({
                                ...selectedCar,
                                WARNA: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                          <i className="fas fa-toggle-on mr-2 text-blue-600"></i>
                          Status Kendaraan
                        </label>
                        <select
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                          value={selectedCar.STATUS}
                          onChange={(e) =>
                            setSelectedCar({
                              ...selectedCar,
                              STATUS: e.target.value,
                            })
                          }
                        >
                          <option value="Tersedia">Tersedia</option>
                          <option value="Tidak tersedia">Tidak tersedia</option>
                          <option value="Dalam service">Dalam service</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">
                            <i className="fas fa-users mr-2 text-blue-600"></i>
                            Kapasitas Penumpang
                          </label>
                          <input
                            type="number"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                            value={selectedCar.CAP_PENUMPANG}
                            onChange={(e) =>
                              setSelectedCar({
                                ...selectedCar,
                                CAP_PENUMPANG: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">
                            <i className="fas fa-id-card mr-2 text-blue-600"></i>
                            No. Polisi
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                            value={selectedCar.NOPOL}
                            onChange={(e) =>
                              setSelectedCar({
                                ...selectedCar,
                                NOPOL: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">
                            <i className="fas fa-calendar-alt mr-2 text-blue-600"></i>
                            Tahun Beli
                          </label>
                          <input
                            type="number"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                            value={selectedCar.TAHUN_BELI}
                            onChange={(e) =>
                              setSelectedCar({
                                ...selectedCar,
                                TAHUN_BELI: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">
                            <i className="fas fa-tachometer-alt mr-2 text-blue-600"></i>
                            Top Speed (km/h)
                          </label>
                          <input
                            type="number"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                            value={selectedCar.TOP_SPEED}
                            onChange={(e) =>
                              setSelectedCar({
                                ...selectedCar,
                                TOP_SPEED: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">
                            <i className="fas fa-money-bill-wave mr-2 text-blue-600"></i>
                            Harga Sewa
                          </label>
                          <input
                            type="number"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                            value={selectedCar.HARGA}
                            onChange={(e) =>
                              setSelectedCar({
                                ...selectedCar,
                                HARGA: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">
                            <i className="fas fa-chart-line mr-2 text-blue-600"></i>
                            Jumlah Sewa
                          </label>
                          <input
                            type="number"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                            value={anyBook}
                            onChange={(e) =>
                              setAnyBook(Number.parseInt(e.target.value))
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                          <i className="fas fa-wrench mr-2 text-blue-600"></i>
                          Terakhir Service
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                          value={
                            selectedCar.LAST_SERVICE
                              ? selectedCar.LAST_SERVICE.split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            setSelectedCar({
                              ...selectedCar,
                              TERAKHIR_SERVICE: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                          <i className="fas fa-camera mr-2 text-blue-600"></i>
                          Update Foto Kendaraan
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                          onChange={(e) => setEditFoto(e.target.files[0])}
                        />
                        {editFoto && (
                          <p className="text-sm text-green-700 mt-2 font-bold flex items-center">
                            <i className="fas fa-check-circle mr-2"></i>
                            File baru dipilih: {editFoto.name}
                          </p>
                        )}
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
                          onClick={() => {
                            setIsEditing(false);
                            setEditFoto(null);
                          }}
                          className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-lg transform hover:scale-105"
                        >
                          <i className="fas fa-times mr-2"></i>
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center">
                            <i className="fas fa-info-circle mr-2 text-blue-600"></i>
                            Informasi Kendaraan
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <i className="fas fa-car mr-3 text-gray-600 w-5"></i>
                              <span className="text-gray-700 font-medium">
                                Nama:
                              </span>
                              <span className="font-bold ml-2">
                                {selectedCar.NAMA_KENDARAAN}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-tags mr-3 text-gray-600 w-5"></i>
                              <span className="text-gray-700 font-medium">
                                Tipe:
                              </span>
                              <span className="font-bold ml-2">
                                {selectedCar.TIPE_KENDARAAN}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-palette mr-3 text-gray-600 w-5"></i>
                              <span className="text-gray-700 font-medium">
                                Warna:
                              </span>
                              <span className="font-bold ml-2">
                                {selectedCar.WARNA}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-id-card mr-3 text-gray-600 w-5"></i>
                              <span className="text-gray-700 font-medium">
                                No. Polisi:
                              </span>
                              <span className="font-bold ml-2">
                                {selectedCar.NOPOL}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-users mr-3 text-gray-600 w-5"></i>
                              <span className="text-gray-700 font-medium">
                                Kapasitas:
                              </span>
                              <span className="font-bold ml-2">
                                {selectedCar.CAP_PENUMPANG} orang
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center">
                            <i className="fas fa-cogs mr-2 text-blue-600"></i>
                            Detail Teknis
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <i className="fas fa-tachometer-alt mr-3 text-gray-600 w-5"></i>
                              <span className="text-gray-700 font-medium">
                                Top Speed:
                              </span>
                              <span className="font-bold ml-2">
                                {selectedCar.TOP_SPEED} km/h
                              </span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-money-bill-wave mr-3 text-gray-600 w-5"></i>
                              <span className="text-gray-700 font-medium">
                                Harga Sewa:
                              </span>
                              <span className="font-bold ml-2 text-green-600">
                                {formatCurrency(selectedCar.HARGA)}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-calendar-alt mr-3 text-gray-600 w-5"></i>
                              <span className="text-gray-700 font-medium">
                                Tahun Beli:
                              </span>
                              <span className="font-bold ml-2">
                                {selectedCar.TAHUN_BELI}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-chart-line mr-3 text-gray-600 w-5"></i>
                              <span className="text-gray-700 font-medium">
                                Jumlah Sewa:
                              </span>
                              <span className="font-bold ml-2">
                                {selectedCar.BANYAK_SEWA} kali
                              </span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-wrench mr-3 text-gray-600 w-5"></i>
                              <span className="text-gray-700 font-medium">
                                Terakhir Service:
                              </span>
                              <span className="font-bold ml-2">
                                {formatDate(selectedCar.TERAKHIR_SERVICE)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <div
                          className={`inline-flex px-4 py-2 text-sm font-bold rounded-full border ${
                            selectedCar.STATUS === "Tersedia"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }`}
                        >
                          <i
                            className={`fas ${
                              selectedCar.STATUS === "Tersedia"
                                ? "fa-check-circle"
                                : "fa-times-circle"
                            } mr-2`}
                          ></i>
                          Status: {selectedCar.STATUS}
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
  );
}

export default Mobil;