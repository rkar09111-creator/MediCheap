import L from 'leaflet';

// Fix for default Leaflet icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Clinical Markers
export const StoreIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/4320/4320337.png', // Pharmacy/Hospital Icon
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -42],
  className: 'store-marker-icon'
});

export const DeliveryIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Pin Icon
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
  className: 'delivery-marker-icon'
});

export const RiderIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png', // Scooter/Delivery Icon
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
  className: 'rider-marker-icon'
});
