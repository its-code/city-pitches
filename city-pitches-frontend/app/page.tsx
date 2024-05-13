"use client";

import { useState } from 'react';

interface CityPitch {
  name: string;
  pitch: string;
  isLoading: boolean;
}

export default function Home() {
    const [city, setCity] = useState<string>('');
    const [pitches, setPitches] = useState<CityPitch[]>([]);

    const handleAddCity = async () => {
        if (!city.trim()) return;
        const newCity: CityPitch = { name: city, pitch: '', isLoading: true };
        setPitches(currentPitches => [...currentPitches, newCity]);
        fetchPitch(city, pitches.length);
        setCity('');
    };

    const fetchPitch = async (cityName: string, index: number) => {
        try {
            const response = await fetch(`http://localhost:3001/pitch/${encodeURIComponent(cityName)}`);
            const data = await response.json();
            setPitches(currentPitches => currentPitches.map((pitch, idx) =>
                idx === index ? { ...pitch, pitch: data.pitch, isLoading: false } : pitch
            ));
        } catch (error) {
            console.error('Error fetching pitch:', error);
            setPitches(currentPitches => currentPitches.map((pitch, idx) =>
                idx === index ? { ...pitch, pitch: 'Failed to load pitch.', isLoading: false } : pitch
            ));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter a city name"
                className="border p-2 rounded"
            />
            <button
                onClick={handleAddCity}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
            >
                Get Pitch
            </button>
            <div>
                {pitches.map((pitch, index) => (
                    <div key={index} className="mt-4 p-4 border rounded">
                        <h2 className="font-bold">{pitch.name}</h2>
                        {pitch.isLoading ? (
                            <div className="spinner"></div>
                        ) : (
                            <p>{pitch.pitch || 'No pitch available.'}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
