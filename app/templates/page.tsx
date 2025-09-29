"use client";

import { useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

// Register chart components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Page() {
  const [formData, setFormData] = useState({
    latitude: 28.6139,
    longitude: 77.209,
    rainfall: 150.5,
    temperature: 25.5,
    humidity: 65.5,
    river_discharge: 2500.5,
    water_level: 5.5,
    elevation: 200.5,
    land_cover: "Agricultural",
    soil_type: "Loam",
    population_density: 5000.5,
    infrastructure: 1,
    historical_floods: 0,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/flood-predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          latitude: parseFloat(String(formData.latitude)),
          longitude: parseFloat(String(formData.longitude)),
          rainfall: parseFloat(String(formData.rainfall)),
          temperature: parseFloat(String(formData.temperature)),
          humidity: parseFloat(String(formData.humidity)),
          river_discharge: parseFloat(String(formData.river_discharge)),
          water_level: parseFloat(String(formData.water_level)),
          elevation: parseFloat(String(formData.elevation)),
          population_density: parseFloat(String(formData.population_density)),
          infrastructure: parseInt(String(formData.infrastructure)),
          historical_floods: parseInt(String(formData.historical_floods)),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResult(data);
      } else {
        console.error("API Error:", data.error);
        alert(`Error making prediction: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error making prediction. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic color for flood risk level
  const getRiskColor = (risk: string) => {
    if (risk === "HIGH") return "text-red-600";
    if (risk === "MEDIUM") return "text-yellow-500";
    return "text-green-600";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar + Hero Section */}
      <section className="bg-gradient-to-r from-green-500/20 to-green-600/10 text-white flex-1 flex items-center mt-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center py-16">
          <div>
            <h1 className="text-5xl font-bold mb-4">
              AI-Powered Flood Risk Assessment
            </h1>
            <p className="mb-6 text-lg">
              Advanced machine learning model to predict flood risks using
              environmental and geographical data.
            </p>
            <div className="flex gap-4">
              <a
                href="#prediction-form"
                className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold shadow hover:scale-105 transition"
              >
                ⚡ Predict Now
              </a>
              <button className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition">
                ℹ️ Model Info
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <span className="text-[9rem] opacity-80">🌧️</span>
          </div>
        </div>
      </section>

      {/* Prediction Form */}
      <section id="prediction-form" className="container mx-auto px-4 my-12">
        <div className="shadow-lg rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-6">🌊 Flood Risk Prediction</h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            {[
              { id: "latitude", label: "Latitude" },
              { id: "longitude", label: "Longitude" },
              { id: "rainfall", label: "Rainfall (mm)" },
              { id: "temperature", label: "Temperature (°C)" },
              { id: "humidity", label: "Humidity (%)" },
              { id: "river_discharge", label: "River Discharge (m³/s)" },
              { id: "water_level", label: "Water Level (m)" },
              { id: "elevation", label: "Elevation (m)" },
              { id: "population_density", label: "Population Density" },
            ].map((f) => (
              <div key={f.id}>
                <label className="block font-semibold mb-2">{f.label}</label>
                <input
                  type="number"
                  step="0.01"
                  name={f.id}
                  value={formData[f.id as keyof typeof formData]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            ))}

            {/* Dropdowns */}
            <div>
              <label className="block font-semibold mb-2">Land Cover</label>
              <select
                name="land_cover"
                value={formData.land_cover}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option>Agricultural</option>
                <option>Forest</option>
                <option>Urban</option>
                <option>Water Body</option>
                <option>Desert</option>
                <option>Grassland</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2">Soil Type</label>
              <select
                name="soil_type"
                value={formData.soil_type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option>Clay</option>
                <option>Sandy</option>
                <option>Loam</option>
                <option>Silt</option>
                <option>Peat</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2">Infrastructure</label>
              <select
                name="infrastructure"
                value={formData.infrastructure}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value={0}>Poor</option>
                <option value={1}>Good</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Historical Floods
              </label>
              <select
                name="historical_floods"
                value={formData.historical_floods}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="reset"
                onClick={() => setFormData({ ...formData })}
                className="px-6 py-2 border border-gray-400 rounded-lg hover:bg-gray-100"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
              >
                {loading ? "Predicting..." : "Predict Flood Risk"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Results with Charts */}
      {result && (
        <section id="results" className="container mx-auto px-4 my-12">
          <div className=" shadow-lg rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">📊 Prediction Results</h2>

            <p className="mb-2">
              Flood Risk:{" "}
              <b className={getRiskColor(result.flood_risk)}>
                {result.flood_risk}
              </b>
            </p>
            <p>
              Flood Probability: {(result.probability?.flood * 100).toFixed(1)}%
            </p>
            <p>
              No Flood Probability:{" "}
              {(result.probability?.no_flood * 100).toFixed(1)}%
            </p>
            <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>

            {/* Chart Section */}
            <div className="grid md:grid-cols-2 gap-8 mt-6">
              {/* Pie Chart */}
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Flood vs No-Flood
                </h3>
                <Pie
                  data={{
                    labels: ["Flood", "No Flood"],
                    datasets: [
                      {
                        label: "Probability",
                        data: [
                          parseFloat(
                            (result.probability?.flood * 100).toFixed(1)
                          ),
                          parseFloat(
                            (result.probability?.no_flood * 100).toFixed(1)
                          ),
                        ],
                        backgroundColor: ["#ef4444", "#3b82f6"],
                        borderColor: ["#b91c1c", "#1e40af"],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </div>

              {/* Bar Chart */}
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Confidence & Probabilities
                </h3>
                <Bar
                  data={{
                    labels: ["Flood", "No Flood", "Confidence"],
                    datasets: [
                      {
                        label: "Percentage",
                        data: [
                          parseFloat(
                            (result.probability?.flood * 100).toFixed(1)
                          ),
                          parseFloat(
                            (result.probability?.no_flood * 100).toFixed(1)
                          ),
                          parseFloat((result.confidence * 100).toFixed(1)),
                        ],
                        backgroundColor: ["#ef4444", "#3b82f6", "#10b981"],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          callback: (val) => val + "%",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}