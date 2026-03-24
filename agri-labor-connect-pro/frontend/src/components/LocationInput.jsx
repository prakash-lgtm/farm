import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

const LocationInput = ({ value, onChange, placeholder, required = false, className = "form-input", iconSize = 16, style = {} }) => {
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const [loadingLocation, setLoadingLocation] = useState(false);

    useEffect(() => {
        if (!window.google || !window.google.maps || !window.google.maps.places) return;

        try {
            autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
                types: ['(regions)'],
                componentRestrictions: { country: "in" }
            });

            autocompleteRef.current.addListener('place_changed', () => {
                const place = autocompleteRef.current.getPlace();
                if (place && place.formatted_address) {
                    onChange(place.formatted_address);
                } else if (place && place.name) {
                    onChange(place.name);
                }
            });
        } catch (err) {
            console.warn("Google Maps Places API not activated or invalid:", err);
        }

        return () => {
            if (window.google.maps.event) {
                window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
            }
        };
    }, [onChange]);

    const handleCurrentLocation = (e) => {
        e.preventDefault();
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const geocoder = new window.google.maps.Geocoder();
                const latlng = { lat: latitude, lng: longitude };

                geocoder.geocode({ location: latlng }, (results, status) => {
                    setLoadingLocation(false);
                    if (status === 'OK') {
                        if (results[0]) {
                            // Try to extract city/locality name for cleaner UI
                            let cityName = results[0].formatted_address;
                            for (let i = 0; i < results.length; i++) {
                                if (results[i].types.includes('locality') || results[i].types.includes('sublocality')) {
                                    cityName = results[i].formatted_address;
                                    break;
                                }
                            }
                            onChange(cityName);
                        } else {
                            alert('No results found for your location');
                        }
                    } else {
                        alert('Geocoder failed due to: ' + status);
                    }
                });
            },
            () => {
                setLoadingLocation(false);
                alert('Unable to retrieve your location');
            }
        );
    };

    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', ...style }}>
            <MapPin size={iconSize} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
            <input
                ref={inputRef}
                type="text"
                className={className}
                placeholder={placeholder || "Village, District"}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                style={{ paddingLeft: '2.4rem', paddingRight: '2.5rem', width: '100%' }}
            />
            <button
                type="button"
                onClick={handleCurrentLocation}
                disabled={loadingLocation}
                title="Use Current Location"
                style={{
                    position: 'absolute',
                    right: '5px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: loadingLocation ? 'var(--primary)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '5px',
                }}
            >
                <Navigation size={iconSize} className={loadingLocation ? "anim-spin" : ""} style={{ animation: loadingLocation ? "spin 1s linear infinite" : "none" }} />
            </button>
        </div>
    );
};

export default LocationInput;
