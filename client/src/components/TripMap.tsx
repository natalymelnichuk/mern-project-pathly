import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Activity } from '../types/activity';
import '../services/leafletConfig';

interface TripMapProps {
    activities: Activity[];
    destination?: string;
}

const FitBounds: React.FC<{ points: [number, number][] }> = ({ points }) => {
    const map = useMap();

    useEffect(() => {
        if (points.length === 0) return;

        if (points.length === 1) {
            map.setView(points[0], 13, { animate: true });
        } else {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [50, 50], animate: true });
        }

        setTimeout(() => {
            map.invalidateSize();
        }, 100);

    }, [points, map]);

    

    return null;
};

const ChangeView: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 11, { animate: true });
        setTimeout(() => map.invalidateSize(), 200);
    }, [center, map]);
    return null;
};

export const TripMap: React.FC<TripMapProps> = ({ activities, destination }) => {
    const [destinationCenter, setDestinationCenter] = useState<[number, number]>([48.8566, 2.3522]);


    const activitiesWithLocation = activities.filter(
        (act) => act.location && typeof act.location.lat === 'number' && typeof act.location.lng === 'number'
    );

    const points: [number, number][] = activitiesWithLocation.map((act) => [
        act.location!.lat!,
        act.location!.lng!,
    ]);

    useEffect(() => {
        if (points.length === 0 && destination) {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.length > 0) {
                        setDestinationCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
                    }
                })
                .catch((err) => console.error('Geocoding destination error:', err));
        }
    }, [destination, points.length]);

    return (
        <div className="w-full h-[350px] sm:h-[450px] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-lg relative z-0">
            {activitiesWithLocation.length === 0 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 pointer-events-none">
                    📍 Showing area for <span className="font-semibold text-emerald-600">{destination || 'your destination'}</span>
                </div>
            )}

            <MapContainer
                center={points.length > 0 ? points[0] : destinationCenter}
                zoom={11}
                scrollWheelZoom={false} 
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {points.length > 0 ? (
                    <FitBounds points={points} />
                ) : (
                    <ChangeView center={destinationCenter} />
                )}

                {activitiesWithLocation.map((act) => (
                    <Marker key={act._id} position={[act.location!.lat!, act.location!.lng!]}>
                        <Popup minWidth={220} className="custom-trip-popup">
                            <div className="space-y-2 bg-white/60 dark:bg-slate-900/80 rounded-xl text-slate-800 p-4">
                                
                                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1">
                                    {act.title}
                                </h4>

                                
                                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
                                    {act.category && (
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-medium">
                                            {act.category}
                                        </span>
                                    )}
                                    {act.date && (
                                        <span>
                                            {new Date(act.date).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>

                    
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};