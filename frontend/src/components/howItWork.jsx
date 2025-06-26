"use client"

import { useState, useEffect } from "react"

function HowItWorks() {
  const [visibleSteps, setVisibleSteps] = useState([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = Number.parseInt(entry.target.dataset.step)
            setVisibleSteps((prev) => [...new Set([...prev, stepIndex])])
          }
        })
      },
      { threshold: 0.3 },
    )

    const stepElements = document.querySelectorAll("[data-step]")
    stepElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const steps = [
    {
      id: 1,
      title: "Daftar Akun",
      description: "Buat akun gratis dengan mudah dan cepat",
      icon: "fas fa-user-plus",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: 2,
      title: "Lihat Katalog",
      description: "Pilih kendaraan sesuai kebutuhan Anda",
      icon: "fas fa-th-large",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: 3,
      title: "Pilih Tanggal",
      description: "Tentukan tanggal mulai dan selesai rental",
      icon: "fas fa-calendar-alt",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      id: 4,
      title: "Pesan Kendaraan",
      description: "Konfirmasi pesanan dan nikmati perjalanan",
      icon: "fas fa-car",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <i className="fas fa-cogs mr-4 text-blue-600"></i>
            Cara Kerjanya
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
            Rental kendaraan menjadi mudah dengan 4 langkah sederhana. Mulai dari pendaftaran hingga menikmati
            perjalanan Anda.
          </p>
        </div>

        {/* Steps - Desktop */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-green-200 via-purple-200 to-orange-200 transform -translate-y-1/2 z-0"></div>

            <div className="relative z-10 grid grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  data-step={step.id}
                  className={`text-center transform transition-all duration-700 ${
                    visibleSteps.includes(step.id) ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  {/* Step Circle */}
                  <div className="relative mx-auto mb-6">
                    <div
                      className={`w-24 h-24 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300`}
                    >
                      <i className={`${step.icon} text-white text-2xl`}></i>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div
                    className={`${step.bgColor} ${step.borderColor} border-2 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 font-medium leading-relaxed">{step.description}</p>
                  </div>

                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-12 -right-4 z-20">
                      <i className="fas fa-arrow-right text-2xl text-gray-400 animate-pulse"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Steps - Mobile */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              data-step={step.id}
              className={`transform transition-all duration-700 ${
                visibleSteps.includes(step.id) ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className={`${step.bgColor} ${step.borderColor} border-2 rounded-xl p-6 shadow-lg`}>
                <div className="flex items-center mb-4">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg mr-4`}
                  >
                    <i className={`${step.icon} text-white text-xl`}></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                </div>
                <p className="text-gray-600 font-medium leading-relaxed">{step.description}</p>
              </div>

              {/* Mobile Arrow */}
              {index < steps.length - 1 && (
                <div className="flex justify-center my-4">
                  <i className="fas fa-arrow-down text-2xl text-gray-400 animate-bounce"></i>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              <i className="fas fa-rocket mr-3 text-blue-600"></i>
              Siap Memulai Perjalanan?
            </h3>
            <p className="text-gray-600 font-medium mb-6">
              Bergabunglah dengan ribuan pelanggan yang telah mempercayai layanan kami
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => (window.location.href = "/signUp")}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <i className="fas fa-user-plus mr-2"></i>
                Daftar Sekarang
              </button>
              <button
                onClick={() => (window.location.href = "/catalog")}
                className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <i className="fas fa-th-large mr-2"></i>
                Lihat Katalog
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "fas fa-users", label: "Pelanggan Puas" },
            { icon: "fas fa-car", label: "Kendaraan Tersedia" },
            { icon: "fas fa-star", label: "Rating Pelanggan" },
            { icon: "fas fa-clock", label: "Layanan Support" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              <i className={`${stat.icon} text-3xl text-blue-600 mb-3`}></i>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
