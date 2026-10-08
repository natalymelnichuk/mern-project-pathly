import React, { useEffect, useRef, useState } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap,
} from 'react-leaflet';
import { Search, MapPin } from 'lucide-react';
import '../services/leafletConfig';

interface MapPickerProps {
    value?: {
        name?: string;
        lat?: number;
        lng?: number;
    };
    defaultLocation?: string;
    onChange: (location: {
        name: string;
        lat: number;
        lng: number;
    }) => void;
}

interface SearchResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

/**
 * Controls the map center.
 *
 * Priority:
 * 1. Activity coordinates, if they exist.
 * 2. Trip destination, geocoded through Nominatim.
 * 3. Leaflet's initial fallback center.
 */
const MapController: React.FC<{
    activityPosition: [number, number] | null;
    defaultLocation?: string;
    }> = ({ activityPosition, defaultLocation }) => {
        const map = useMap();

        useEffect(() => {
            let cancelled = false;

            const centerMap = async () => {
                // Existing activity location has priority.
                if (activityPosition) {
                    map.setView(activityPosition, 14, {
                        animate: true,
                    });
                    return;
                }

                // No activity coordinates — use trip destination.
                if (!defaultLocation?.trim()) {
                    return;
                }

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                            defaultLocation.trim()
                        )}&limit=1`,
                        {
                            headers: {
                                'Accept-Language': 'en',
                            },
                        }
                    );

                    if (!response.ok) {
                        throw new Error(
                            `Geocoding request failed: ${response.status}`
                        );
                    }

                    const data = await response.json();

                    if (cancelled || !data?.[0]) {
                        return;
                    }

                    const lat = parseFloat(data[0].lat);
                    const lng = parseFloat(data[0].lon);

                    if (
                        Number.isNaN(lat) ||
                        Number.isNaN(lng)
                    ) {
                        return;
                    }

                    map.setView([lat, lng], 12, {
                        animate: true,
                    });
                } catch (error) {
                    if (!cancelled) {
                        console.error(
                            'Failed to geocode default location:',
                            error
                        );
                    }
                }
            };

            centerMap();

            return () => {
                cancelled = true;
            };
        }, [activityPosition, defaultLocation, map]);

        return null;
};

/**
 * Handles clicks on the map.
 */
const LocationMarker: React.FC<{
    position: [number, number] | null;
    setPosition: (position: [number, number]) => void;
    onSelectCoords: (lat: number, lng: number) => void;
}> = ({
    position,
    setPosition,
    onSelectCoords,
}) => {
    useMapEvents({
        click(event) {
            const { lat, lng } = event.latlng;

            setPosition([lat, lng]);
            onSelectCoords(lat, lng);
        },
    });

    if (!position) {
        return null;
    }

    return <Marker position={position} />;
};

export const MapPicker: React.FC<MapPickerProps> = ({
    value,
    defaultLocation,
    onChange,
}) => {
    /*
     * Coordinates already saved for this activity.
     *
     * IMPORTANT:
     * value.name is intentionally NOT used here.
     * The activity location input starts empty.
     */
    const activityPosition: [number, number] | null =
        value?.lat != null && value?.lng != null
            ? [value.lat, value.lng]
            : null;

    /*
     * Local position is used when the user:
     * - selects a search result
     * - clicks on the map
     *
     * If the user hasn't selected anything yet,
     * saved activity coordinates are used.
     */
    const [selectedPosition, setSelectedPosition] =
        useState<[number, number] | null>(null);

    const markerPos =
        selectedPosition ?? activityPosition;

    /*
     * Location input is intentionally empty on open.
     *
     * We do NOT initialize this from:
     * - value.name
     * - defaultLocation
     */
    const [searchQuery, setSearchQuery] =
        useState('');

    const [searchResults, setSearchResults] =
        useState<SearchResult[]>([]);

    const [isSearching, setIsSearching] =
        useState(false);

    const [showDropdown, setShowDropdown] =
        useState(false);

    const dropdownRef =
        useRef<HTMLDivElement>(null);

    /*
     * Close search dropdown when clicking outside.
     */
    useEffect(() => {
        const handleClickOutside = (
            event: MouseEvent
        ) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target as Node
                )
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener(
            'mousedown',
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };
    }, []);

    /*
     * Search location using OpenStreetMap Nominatim.
     */
    const handleSearch = async () => {
        const query = searchQuery.trim();

        if (!query) {
            return;
        }

        setIsSearching(true);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    query
                )}&limit=5`,
                {
                    headers: {
                        'Accept-Language': 'en',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Search request failed: ${response.status}`
                );
            }

            const data = await response.json();

            setSearchResults(data || []);
            setShowDropdown(true);
        } catch (error) {
            console.error(
                'Location search error:',
                error
            );

            setSearchResults([]);
            setShowDropdown(true);
        } finally {
            setIsSearching(false);
        }
    };

    /*
     * User selected a location from search results.
     */
    const handleSelectResult = (
        result: SearchResult
    ) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        if (
            Number.isNaN(lat) ||
            Number.isNaN(lng)
        ) {
            return;
        }

        const shortName =
            result.display_name
                .split(',')[0]
                ?.trim() || searchQuery;

        const newPosition: [number, number] = [
            lat,
            lng,
        ];

        setSelectedPosition(newPosition);
        setSearchQuery(shortName);
        setShowDropdown(false);

        onChange({
            name: shortName,
            lat,
            lng,
        });
    };

    /*
     * User clicked directly on the map.
     */
    const handleMapClick = (
        lat: number,
        lng: number
    ) => {
        const locationName =
            searchQuery.trim() ||
            `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

        setSelectedPosition([lat, lng]);

        onChange({
            name: locationName,
            lat,
            lng,
        });
    };

    return (
        <div className="space-y-3">
            {/* Search box */}
            <div
                className="relative"
                ref={dropdownRef}
            >
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) => {
                                setSearchQuery(
                                    event.target.value
                                );
                            }}
                            onKeyDown={(event) => {
                                if (
                                    event.key === 'Enter'
                                ) {
                                    event.preventDefault();
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
                        {isSearching
                            ? '...'
                            : 'Search'}
                    </button>
                </div>

                {/* Search results */}
                {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                        {searchResults.length > 0 ? (
                            searchResults.map(
                                (item) => (
                                    <button
                                        key={
                                            item.place_id
                                        }
                                        type="button"
                                        onClick={() =>
                                            handleSelectResult(
                                                item
                                            )
                                        }
                                        className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700/60 transition-colors flex items-start gap-2 border-b last:border-0 border-slate-100 dark:border-slate-700/50"
                                    >
                                        <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />

                                        <span className="line-clamp-2">
                                            {
                                                item.display_name
                                            }
                                        </span>
                                    </button>
                                )
                            )
                        ) : (
                            <div className="p-3 text-xs text-slate-400 text-center">
                                No locations found
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Map */}
            <div className="h-48 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative z-0">
                <MapContainer
                    center={[48.8566, 2.3522]}
                    zoom={12}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapController
                        activityPosition={
                            markerPos
                        }
                        defaultLocation={
                            defaultLocation
                        }
                    />

                    <LocationMarker
                        position={markerPos}
                        setPosition={
                            setSelectedPosition
                        }
                        onSelectCoords={
                            handleMapClick
                        }
                    />
                </MapContainer>
            </div>

            <p className="text-[11px] text-slate-400 italic">
                * Click anywhere on the map or select a
                place from search results.
            </p>
        </div>
    );
};