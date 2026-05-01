import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import { API_URL } from '../../constants';
import { Navigation, MapPin, Send, Compass } from 'lucide-react';
import toast from 'react-hot-toast';

const riderIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

const LocationMarker = ({ setPosition }) => {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
        locationfound(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    useEffect(() => {
        map.locate();
    }, [map]);

    return null;
};

const NavigationMap = ({ orderId, riderId }) => {
    const [position, setPosition] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(API_URL);
        setSocket(newSocket);
        
        if (orderId) {
            newSocket.emit('join:rider', { orderId });
        }
        
        return () => newSocket.disconnect();
    }, [orderId]);

    const broadcastLocation = () => {
        if (!position || !socket) return;
        
        socket.emit('update:location', {
            riderId,
            orderId,
            lat: position.lat,
            lng: position.lng
        });
        
        toast.success('Location broadcasted!');
    };

    // Auto-broadcast on position change
    useEffect(() => {
        if (position && socket) {
            socket.emit('update:location', {
                riderId,
                orderId,
                lat: position.lat,
                lng: position.lng
            });
        }
    }, [position, socket, orderId, riderId]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-text-primary">Delivery Navigator</h2>
                    <p className="text-text-secondary text-sm">Click on map or use GPS to set location</p>
                </div>
                <button 
                  onClick={broadcastLocation}
                  className="btn-primary flex items-center gap-2 px-6 py-2 shadow-lg shadow-primary/20"
                >
                    <Send size={18} /> Forced Sync
                </button>
            </div>

            <div className="h-[500px] w-full rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white relative group">
                <MapContainer center={[20.2961, 85.8245]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker setPosition={setPosition} />
                    {position && (
                        <Marker position={position} icon={riderIcon}>
                            <Popup>You are here (broadcasting...)</Popup>
                        </Marker>
                    )}
                </MapContainer>
                
                <div className="absolute bottom-6 right-6 z-[1000]">
                    <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 flex items-center gap-4 animate-in slide-in-from-bottom-2">
                        <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg animate-spin-slow">
                            <Compass size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest leading-none mb-1">Live Status</p>
                            <p className="text-sm font-bold text-text-primary">Transmitting GPS...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavigationMap;
