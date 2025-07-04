import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import "../css/pages/beli.css";

function BookingPage() {
  const navigate = useNavigate();
  const [car, setCar] = useState({});
  const [pickDate, setPickDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [sumPrice, setSumPrice] = useState(0);
  const [bookDate, setBookDate] = useState("");
  const [harga, setHarga] = useState(0);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const carId = searchParams.get("id");

  const userId = localStorage.getItem("userId");
  // console.log(userId)
  const accessToken = localStorage.getItem("accessToken");
  // console.log(carId)

  useEffect(() => {
  axios
    .post(`http://localhost:3003/api/clients/selectedCar`, { carId })
    .then((response) => {
      // console.log("respon:", response.data.data);
      setCar(response.data.data); 
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}, [carId]);


  useEffect(() => {
    const getToday = new Date().toISOString().split("T")[0];
    setBookDate(getToday);
    setHarga(car.HARGA);
  }, [car.HARGA]);

  useEffect(() => {
    if (pickDate && returnDate && harga) {
      const startDate = new Date(pickDate);
      const endDate = new Date(returnDate);
      const timeDiff = endDate.getTime() - startDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      const price = harga;
      const totalPrice = daysDiff * price;
      setSumPrice(totalPrice);
    }
  }, [pickDate, returnDate, harga]);

  const handleBooking = () => {
    // console.log(accessToken, userId);

    axios
      .post(
        "http://localhost:3003/api/clients/booking",
        {
          // withCredentials: true,
          userId,
          carId,
          pickDate,
          returnDate,
          sumPrice,
          bookDate,
        }
      )
      .then((response) => {
        console.log(response)
        if (response.status === 201) {
          console.log("booking sukses", response.data);
          alert("Booking berhasil");
          navigate("/main");
        }
      })
      .catch((error) => {
        if (error.response) {
          switch (error.response.status) {
            case 404:
              alert("Tanggal harus diisi");
              break;
            case 403:
              alert("akses ditolak");
              console.log(error);
              break;
            default:
              alert("Terjadi kesalahan, silahkan coba lagi");
          }
        } else {
          alert("Terjadi kesalahan, silahkan coba lagi");
        }
        console.error("Server Error", error);
      });
  };

  return (
    <div className="main-container">
      <header className="header">
        <Link to="/" style={{ textDecoration: "none" }}>
            <span className="header-title">
              PANDAWA<span className="header-subtitle"> RentCar</span>
            </span>
        </Link>
      </header>
      <section className="content">
        <figure className="image-wrapper">
          <img
            loading="lazy"
            src={car.FOTO_KENDARAAN}
            alt={car.NAMA_KENDARAAN}
            className="image"
          />
        </figure>
        <section className="specs-container">
          <div className="specs-labels">
            Brand <br /> Type <br /> Capacity <br /> Max speed <br /> last
            serviced <br /> Price
          </div>
          <div className="specs-values">
            {car.NAMA_KENDARAAN} <br /> {car.TIPE_KENDARAAN} <br />{" "}
            {car.CAP_PENUMPANG} <br /> {car.TOP_SPEED} km/h <br />{" "}
            {car.LAST_SERVICE} <br /> {sumPrice}
          </div>
        </section>
        <form className="form-container">
          <label htmlFor="pick-up-date" className="form-title">
            Pick Up Date
          </label>
          <input
            type="date"
            id="pickDate"
            className="date-picker"
            aria-label="Pick Up Date"
            value={pickDate}
            onChange={(e) => setPickDate(e.target.value)}
          />
          <label htmlFor="return-date" className="return-title">
            Date of Return
          </label>
          <input
            type="date"
            id="returnDate"
            className="return-date"
            aria-label="Date of Return"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
          <div className="booking-container">
            <button
              type="button"
              className="booking-button"
              onClick={handleBooking}
            >
              Booking
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default BookingPage;
