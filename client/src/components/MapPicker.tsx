import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Search, MapPin } from 'lucide-react';
import '../services/leafletConfig';

interface MapPickerProps {
    value?: { name?: string; lat?: number; lng?: number };
    onChange: (location: { name: string; lat: number; lng: number }) => void;
}

interface SearchResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

// Компонент для плавной центровки карты
const RecenterMap: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng], 14, { animate: true });
        }
    }, [lat, lng, map]);
    return null;
};

// Компонент для клика по карте
const LocationMarker: React.FC<{
    position: [number, number] | null;
    setPosition: (pos: [number, number]) => void;
    onSelectCoords: (lat: number, lng: number) => void;
}> = ({ position, setPosition, onSelectCoords }) => {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            onSelectCoords(lat, lng);
        },
    });

    return position ? <Marker position={position} /> : null;
};

export const MapPicker: React.FC<MapPickerProps> = ({ value, onChange }) => {
    const defaultCenter: [number, number] = value?.lat && value?.lng 
        ? [value.lat, value.lng] 
        : [48.8566, 2.3522]; // Париж по умолчанию

    const [markerPos, setMarkerPos] = useState<[number, number] | null>(
        value?.lat && value?.lng ? [value.lat, value.lng] : null
    );
    const [searchQuery, setSearchQuery] = useState(value?.name || '');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 1. При обновлении `value` (например, при вызове модалки редактирования) подставляем название
    useEffect(() => {
        let isMounted = true;
        
        requestAnimationFrame(() => {
            if (!isMounted) return;

            if (value) {
                if (value.name) {
                    setSearchQuery(value.name);
                }
                if (value.lat && value.lng) {
                    setMarkerPos([value.lat, value.lng]);
                }
            } else {
                setSearchQuery('');
                setMarkerPos(null);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [value]);

    // Закрываем выпадающий список при клике вне его
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 2. Поиск вариантов по OpenStreetMap Nominatim API
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    searchQuery
                )}&limit=5`,
                {
                    headers: {
                        'Accept-Language': 'en',
                    },
                }
            );
            const data = await res.json();
            setSearchResults(data || []);
            setShowDropdown(true);
        } catch (err) {
            console.error('Geocoding error:', err);
        } finally {
            setIsSearching(false);
        }
    };

    // Выбор локации из выпадающего списка
    const handleSelectResult = (result: SearchResult) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        
        // Берем короткое название до первой запятой для красивого отображения
        const shortName = result.display_name.split(',')[0] || searchQuery;

        setMarkerPos([lat, lng]);
        setSearchQuery(shortName);
        setShowDropdown(false);

        onChange({
            name: shortName,
            lat,
            lng,
        });
    };

    // Выбор локации по клику прямо на карте
    const handleMapClick = (lat: number, lng: number) => {
        const locationName = searchQuery || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        onChange({
            name: locationName,
            lat,
            lng,
        });
    };

    return (
        <div className="space-y-3">
            {/* Search Box & Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSearch();
                                }
                            }}
                            placeholder="Search location (e.g. Eiffel Tower)..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-slate-100"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                    <button
                        type="button"
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 shrink-0"
                    >
                        {isSearching ? '...' : 'Search'}
                    </button>
                </div>

                {/* Выпадающий список совпадений */}
                {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                        {searchResults.length > 0 ? (
                            searchResults.map((item) => (
                                <button
                                    key={item.place_id}
                                    type="button"
                                    onClick={() => handleSelectResult(item)}
                                    className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700/60 transition-colors flex items-start gap-2 border-b last:border-0 border-slate-100 dark:border-slate-700/50"
                                >
                                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span className="line-clamp-2">{item.display_name}</span>
                                </button>
                            ))
                        ) : (
                            <div className="p-3 text-xs text-slate-400 text-center">
                                No locations found
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Map Container */}
            <div className="h-48 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative z-0">
                <MapContainer
                    center={defaultCenter}
                    zoom={12}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {markerPos && <RecenterMap lat={markerPos[0]} lng={markerPos[1]} />}
                    <LocationMarker
                        position={markerPos}
                        setPosition={setMarkerPos}
                        onSelectCoords={handleMapClick}
                    />
                </MapContainer>
            </div>
            <p className="text-[11px] text-slate-400 italic">
                * Click anywhere on the map or select a place from search results.
            </p>
        </div>
    );
};