"use client";

import { WeatherForm } from "@/components/weather-form";
import {useState} from "react";

export default function Home() {
  const[id, setId] = useState("");
  const[data, setData] = useState<any | null>(null);
  const[error, setError] = useState("");

  const fetchWD = async () => {
    setError("");
    setData(null);

    if(!id){
      setError("Please enter an id")
      return
    }

    try{
      const res = await fetch(`http://localhost:8000/weather/${id}`);
      if(!res.ok) throw new Error("Data not found");
      const json = await res.json();
      setData(json)
    } catch(e){
      setError("Could not retrieve data. Check ID")
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Weather System
          </h1>
          <p className="text-muted-foreground text-lg">
            Submit weather requests and retrieve stored results
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Weather Form Section */}
          <div className="flex flex-col items-center justify-start">
            <h2 className="text-2xl font-semibold mb-4">
              Submit Weather Request
            </h2>
            <WeatherForm />
          </div>

          {/* Data Lookup Section Placeholder */}
          <div className="flex flex-col items-center justify-start">
            <h2 className="text-2xl font-semibold mb-4">Lookup Weather Data</h2>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                  <input value={id} onChange={(e) => setId(e.target.value)} placeholder="Weather ID"
                          className="w-full px-4 py-2 border rounded mb-2 text-black dark:text-white"/>
                  <button onClick={fetchWD} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
                    Lookup Weather Data
                  </button>

                  {error && <p className="text-red-500 mt-2">{error}</p>}

                  {data && (
                    <table className="mt-4 w-full table-auto border-collapse border border-gray-300 text-sm">
                      <tbody>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                          <th className="text-left p-2 border border-gray-300">Field</th>
                          <th className="text-left p-2 border border-gray-300">Value</th>
                        </tr>
                        <tr>
                          <td className="p-2 border border-gray-300">Date</td>
                          <td className="p-2 border border-gray-300">{data.date}</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-gray-300">Location</td>
                          <td className="p-2 border border-gray-300">{data.location}</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-gray-300">Notes</td>
                          <td className="p-2 border border-gray-300">{data.notes || "—"}</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-gray-300">Temperature</td>
                          <td className="p-2 border border-gray-300">{data.weather.temperature}°C</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-gray-300">Humidity</td>
                          <td className="p-2 border border-gray-300">{data.weather.humidity}%</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-gray-300">Description</td>
                          <td className="p-2 border border-gray-300">
                            {data.weather.weather_descriptions?.[0] || "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
