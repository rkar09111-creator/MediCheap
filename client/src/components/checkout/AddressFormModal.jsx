import React, { useState, useEffect, useRef } from 'react';
import { 
  X, MapPin, Navigation2, Search, Loader2, 
  CheckCircle2, AlertCircle, Home, Building2, 
  Hotel, Star 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import axios from 'axios';
import { DeliveryIcon } from '../../constants/mapIcons';
import { Button } from '../ui';
import { useAddressStore } from '../../store/addressStore';
import toast from 'react-hot-toast';

const AddressFormModal = ({ isOpen, onClose, editAddress = null }) => {
  const { addAddress, updateAddress } = useAddressStore();
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  const [formData, setFormData] = useState({
    label: 'Home',
    fullName: '',
    phone: '',
    flatNo: '',
    buildingName: '',
    streetArea: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    coordinates: { lat: 20.5937, lng: 78.9629 }, // Default India center
    isDefault: false
  });

  useEffect(() => {
    if (editAddress) {
      setFormData(editAddress);
    }
  }, [editAddress]);

  // Reverse Geocoding
  const reverseGeocode = async (lat, lng) => {
    setGeoLoading(true);
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const address = res.data.address;
      setFormData(prev => ({
        ...prev,
        streetArea: address.suburb || address.neighbourhood || address.road || '',
        city: address.city || address.town || address.village || '',
        state: address.state || '',
        pincode: address.postcode || '',
        coordinates: { lat, lng }
      }));
    } catch (error) {
      console.error('Reverse geocode error:', error);
    } finally {
      setGeoLoading(false);
    }
  };

  // Search Geocoding
  const handleSearch = async (query) => {
    if (query.length < 3) return setSuggestions([]);
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=in&limit=5`);
      setSuggestions(res.data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const selectSuggestion = (suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    setFormData(prev => ({ ...prev, coordinates: { lat, lng } }));
    setSearchQuery(suggestion.display_name);
    setSuggestions([]);
    reverseGeocode(lat, lng);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData(prev => ({ ...prev, coordinates: { lat: latitude, lng: longitude } }));
        reverseGeocode(latitude, longitude);
      },
      (err) => {
        toast.error('Location access denied');
        setGeoLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editAddress) {
        await updateAddress(editAddress._id, formData);
        toast.success('Address Synchronized');
      } else {
        await addAddress(formData);
        toast.success('Address Registered');
      }
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Map Components
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setFormData(prev => ({ ...prev, coordinates: e.latlng }));
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      }
    });
    return null;
  };

  const ChangeView = ({ center }) => {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
            {editAddress ? 'Edit Registry Node' : 'Register New Address'}
          </h2>
          <button onClick={onClose} className="p-3 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          
          {/* Map Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-neutral-800">Pin Location.</h3>
                <p className="text-sm text-neutral-400 font-medium">Drag the pin to your exact delivery entrance</p>
              </div>
              <Button 
                onClick={getCurrentLocation}
                variant="ghost" 
                className="h-12 px-6 rounded-2xl bg-blue-50 text-blue-600 border-none font-bold text-xs uppercase tracking-widest gap-2"
              >
                {geoLoading ? <Loader2 size={16} className="animate-spin" /> : <Navigation2 size={16} />}
                Use Current Location
              </Button>
            </div>

            <div className="relative">
              <div className="absolute top-4 left-4 right-4 z-[10] space-y-2">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    placeholder="Search area, landmark, building..."
                    className="w-full h-14 pl-12 pr-6 bg-white border border-neutral-200 rounded-2xl shadow-lg focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                  />
                  
                  <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden"
                      >
                        {suggestions.map((s, i) => (
                          <button 
                            key={i}
                            onClick={() => selectSuggestion(s)}
                            className="w-full px-6 py-4 text-left hover:bg-emerald-50 transition-colors flex items-center gap-4 border-b border-neutral-50 last:border-none"
                          >
                            <MapPin size={16} className="text-emerald-500 shrink-0" />
                            <div>
                              <p className="text-sm font-bold text-neutral-900 line-clamp-1">{s.display_name.split(',')[0]}</p>
                              <p className="text-[10px] text-neutral-400 font-medium line-clamp-1">{s.display_name}</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="h-[300px] rounded-[2rem] overflow-hidden border border-neutral-100 relative shadow-inner">
                <MapContainer center={[formData.coordinates.lat, formData.coordinates.lng]} zoom={16} scrollWheelZoom={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker 
                    position={[formData.coordinates.lat, formData.coordinates.lng]} 
                    icon={DeliveryIcon}
                    draggable={true}
                    eventHandlers={{
                      dragend: (e) => {
                        const latlng = e.target.getLatLng();
                        setFormData(prev => ({ ...prev, coordinates: latlng }));
                        reverseGeocode(latlng.lat, latlng.lng);
                      }
                    }}
                  />
                  <MapEvents />
                  <ChangeView center={[formData.coordinates.lat, formData.coordinates.lng]} />
                </MapContainer>
              </div>

              {geoLoading && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4">
                  <Loader2 size={20} className="text-emerald-500 animate-spin" />
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Synchronizing Geocodes...</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em] ml-2">Registry Parameters</h4>
              
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'Home', icon: Home },
                  { id: 'Work', icon: Building2 },
                  { id: 'Hotel', icon: Hotel },
                  { id: 'Other', icon: MapPin }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, label: item.id })}
                    className={cn(
                      "h-12 px-6 rounded-full border-2 font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all",
                      formData.label === item.id 
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                        : "border-neutral-100 text-neutral-400 hover:border-neutral-200"
                    )}
                  >
                    <item.icon size={14} />
                    {item.id}
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-4">Receiver Name</label>
                  <input 
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full h-14 px-6 bg-neutral-50 border-none rounded-2xl font-bold text-neutral-900 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-4">Secure Uplink (Phone)</label>
                  <input 
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-14 px-6 bg-neutral-50 border-none rounded-2xl font-bold text-neutral-900 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-4">Flat / House No.</label>
                  <input 
                    required
                    value={formData.flatNo}
                    onChange={e => setFormData({ ...formData, flatNo: e.target.value })}
                    className="w-full h-14 px-6 bg-neutral-50 border-none rounded-2xl font-bold text-neutral-900 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    placeholder="e.g. Apt 402"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-4">Building / Project</label>
                  <input 
                    value={formData.buildingName}
                    onChange={e => setFormData({ ...formData, buildingName: e.target.value })}
                    className="w-full h-14 px-6 bg-neutral-50 border-none rounded-2xl font-bold text-neutral-900 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    placeholder="e.g. Green Towers"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-4">Street / Area / Locality</label>
                <input 
                  required
                  value={formData.streetArea}
                  onChange={e => setFormData({ ...formData, streetArea: e.target.value })}
                  className="w-full h-14 px-6 bg-neutral-50 border-none rounded-2xl font-bold text-neutral-900 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  placeholder="e.g. Sector 15, Vashi"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-4">Pincode</label>
                  <input 
                    required
                    value={formData.pincode}
                    onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full h-14 px-6 bg-neutral-50 border-none rounded-2xl font-bold text-neutral-900 focus:ring-4 focus:ring-emerald-500/10 transition-all text-center"
                    placeholder="751001"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-4">City</label>
                  <input 
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full h-14 px-6 bg-neutral-50 border-none rounded-2xl font-bold text-neutral-900 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    placeholder="Bhubaneswar"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-4">State</label>
                  <input 
                    required
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="w-full h-14 px-6 bg-neutral-50 border-none rounded-2xl font-bold text-neutral-900 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    placeholder="Odisha"
                  />
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
                className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl hover:bg-emerald-50 transition-colors"
              >
                <div className={cn(
                  "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                  formData.isDefault ? "bg-emerald-500 border-emerald-500 text-white" : "border-neutral-200"
                )}>
                  {formData.isDefault && <CheckCircle2 size={14} />}
                </div>
                <span className="text-sm font-bold text-neutral-600">Set as Primary Delivery Node</span>
              </button>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="button"
                variant="ghost" 
                onClick={onClose}
                className="flex-1 h-16 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest"
              >
                Abort Registry
              </Button>
              <Button 
                type="submit"
                disabled={loading}
                className="flex-[2] h-16 bg-neutral-900 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-2xl"
              >
                {loading ? <Loader2 className="animate-spin" /> : (editAddress ? 'Update Clinical Node' : 'Complete Registration')}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddressFormModal;
