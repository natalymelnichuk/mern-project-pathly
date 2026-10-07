import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Activity } from '../types/activity';
import '../services/leafletConfig';

interface TripMapProps {
    activities: Activity[];
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
    }, [points, map]);

    return null;
};

export const TripMap: React.FC<TripMapProps> = ({ activities }) => {
    const activitiesWithLocation = activities.filter(
        (act) => act.location && typeof act.location.lat === 'number' && typeof act.location.lng === 'number'
    );

    const points: [number, number][] = activitiesWithLocation.map((act) => [
        act.location!.lat!,
        act.location!.lng!,
    ]);

    const defaultCenter: [number, number] = [48.8566, 2.3522];

    return (
        <div className="w-full h-[500px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg relative z-0">
            {activitiesWithLocation.length === 0 ? (
                <div className="absolute inset-0 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center space-y-2">
                    <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                        No locations added yet
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm">
                        Add coordinates to your activities using the map picker to see them pinned on this trip map.
                    </p>
                </div>
            ) : null}

            <MapContainer
                center={points.length > 0 ? points[0] : defaultCenter}
                zoom={10}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <FitBounds points={points} />

                {activitiesWithLocation.map((act) => (
                    <Marker
                        key={act._id}
                        position={[act.location!.lat!, act.location!.lng!]}
                    >
                        <Popup minWidth={220} className="custom-trip-popup">
                            <div className="bg-amber-50/80 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden text-slate-800 dark:text-slate-100 p-3.5 space-y-2.5 font-sans min-w-[210px]">
                                {/* Шапка: категория/кастомный бейдж и статус */}
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
                                        {act.category || 'Activity'}
                                    </span>
                                    {act.status === 'Done' ? (
                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm flex items-center gap-1">
                                            ✓ Done
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                                            {act.status || 'Planned'}
                                        </span>
                                    )}
                                </div>

                                {/* Название активности */}
                                <div>
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                                        {act.title}
                                    </h4>
                                    {act.location?.name && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 font-normal line-clamp-1">
                                            📍 {act.location.name}
                                        </p>
                                    )}
                                </div>

                                {/* Разделитель */}
                                <div className="h-px bg-slate-100 dark:bg-slate-800/80 w-full" />

                                {/* Подвал: дата и стоимость */}
                                <div className="flex items-center justify-between text-xs pt-0.5">
                                    {act.date ? (
                                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded-lg">
                                            📅 {new Date(act.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    ) : <span />}

                                    {typeof act.cost === 'number' && act.cost > 0 && (
                                        <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                                            ${act.cost}
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