"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../css/pages/index.css"

function generateLoremIpsum() {
  return "Pelayanan yang sangat memuaskan! Mobil dalam kondisi prima dan proses booking sangat mudah. Tim customer service sangat responsif dan membantu. Pengalaman rental yang tak terlupakan, pasti akan menggunakan jasa ini lagi di masa depan."
}

function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  
  const getImageUrl = (imageName) => {
  return `http://localhost:3003/api/images/pelanggan/${encodeURIComponent(imageName)}`;
  }

  useEffect(() => {
    axios
      .get("http://localhost:3003/api/clients/review")
      .then((response) => {
        // console.log("Data response:", response.data)
        console.log("Data reviews:", response.data)
        if (Array.isArray(response.data)) {
          setReviews(response.data)
        } else {
          console.error("Data response bukan array:", response.data)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <nav id="Review" className="review">
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      </nav>
    )
  }

  return (
    <nav id="Review" className="review">
      {reviews.slice(0, 4).map((review, index) => (
        <div key={index} className="card card-custom fade-in-up">
          <div className="sec">
            <div>
              <img
                className="card-img-top"
                src={review.FOTO_PELANGGAN ? getImageUrl(review.FOTO_PELANGGAN) : "/assets/avatar/default-profile.jpeg"}
                alt={"foto " + review.NAMA_PELANGGAN}
              />
            </div>
            <div>
              <h3>
                <label htmlFor="name">{review.NAMA_PELANGGAN}</label>
              </h3>
              <h5>
                <label htmlFor="Member">{review.JENIS_MEMBERSHIP}</label>
              </h5>
            </div>
          </div>
          <p>{generateLoremIpsum()}</p>
        </div>
      ))}
    </nav>
  )
}

export default Reviews
