"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "../css/pages/index.css";

function MostBook() {
  const [mostBook, setMostBook] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (imageName) => {
    return `http://localhost:3003/api/images/cars/${encodeURIComponent(
      imageName
    )}`;
  };

  useEffect(() => {
    // Mengambil data dari database saat komponen dimuat
    axios
      .get("http://localhost:3003/api/clients/mostBook")
      .then((response) => {
        // Pastikan respons memiliki properti "kendaraan" yang berupa array
        if (Array.isArray(response.data.data)) {
          console.log("response: ", response.data.data);
          setMostBook(response.data.data);
        } else {
          console.error(
            'Data fetched does not contain "kendaraan" array:',
            response.data
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching top cars:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <nav className="top-rate">
        <h1>Most Book Car</h1>
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="top-rate">
      <h1>Most Book Car</h1>
      <div className="container-top-rate">
        {mostBook.map((car, index) => (
          <div key={index} className="card h-100 card-custom fade-in-up">
            <img
              src={
                car.FOTO_KENDARAAN
                  ? getImageUrl(car.FOTO_KENDARAAN)
                  : "/assets/car-default.png"
              }
              className="card-img-top img-custom"
              alt={car.NAMA_KENDARAAN}
            />
            <h2>{car.NAMA_KENDARAAN}</h2>
            <div className="cars-detail">
              <div>
                <img src="/assets/Group.svg" alt="Capacity" />
                <span>{car.CAP_PENUMPANG} seats</span>
              </div>
              <div>
                <img src="/assets/Pressure.png" alt="Speed" />
                <span>{car.TOP_SPEED} Km/H</span>
              </div>
              <div>
                <img src="/assets/Setting_line.png" alt="Service" />
                <time dateTime={car.LAST_SERVICE}>{car.LAST_SERVICE}</time>
              </div>
            </div>
            <button className="btn2-custom">Book Now</button>
          </div>
        ))}
      </div>
    </nav>
  );
}

export default MostBook;
