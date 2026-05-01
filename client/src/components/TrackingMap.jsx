import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import { API_URL } from '../constants';
import { Truck, MapPin } from 'lucide-react';

// Fix icon issue
const riderIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
});

const storeIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048329.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
});

const userIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854866.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
});

// Auto-center map on updates
const RecenterMap = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) map.flyTo(position, 15);
    }, [position, map]);
    return null;
};

const TrackingMap = ({ orderId, userLocation, riderId }) => {
    const [riderPos, setRiderPos] = useState(null);
    const storeLocation = [20.2961, 85.8245];

    useEffect(() => {
        const socket = io(API_URL);
        
        socket.emit('join:order', { orderId });

        socket.on('location:updated', (data) => {
            setRiderPos([data.lat, data.lng]);
        });

        return () => socket.disconnect();
    }, [orderId]);

    return (
        <div className="h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative">
            <MapContainer center={storeLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                
                {/* Store */}
                <Marker position={storeLocation} icon={storeIcon}>
                    <Popup>MediCheap Store</Popup>
                </Marker>

                {/* User */}
                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                        <Popup>Your Location</Popup>
                    </Marker>
                )}

                {/* Rider */}
                {riderPos && (
                    <>
                        <Marker position={riderPos} icon={riderIcon}>
                            <Popup>Rider is here!</Popup>
                        </Marker>
                        <RecenterMap position={riderPos} />
                    </>
                )}
            </MapContainer>

            {/* Overlay Info */}
            <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-100 max-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${riderPos ? 'bg-accent animate-pulse' : 'bg-slate-300'}`}></div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-700">
                        {riderPos ? 'Rider Online' : 'Waiting for Rider'}
                    </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">Live tracking ensures you know exactly when your medicine arrives.</p>
            </div>
        </div>
    );
};

export default TrackingMap;
