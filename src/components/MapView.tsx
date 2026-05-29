import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppStore, useFilteredCompanies, useZones } from '../store/useAppStore';
import { STATUS_CONFIG } from '../types';
import type { Status } from '../types';

// Fix default marker paths in bundlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const BORDEAUX_CENTER: [number, number] = [44.837, -0.579];

export function MapView() {
  const filtered = useFilteredCompanies();
  const zones = useZones();
  const zoneFilter = useAppStore((s) => s.zoneFilter);
  const setZoneFilter = useAppStore((s) => s.setZoneFilter);
  const setSelectedId = useAppStore((s) => s.setSelectedId);

  const center: [number, number] =
    filtered.length > 0
      ? [
          filtered.reduce((s, c) => s + c.lat, 0) / filtered.length,
          filtered.reduce((s, c) => s + c.lng, 0) / filtered.length,
        ]
      : BORDEAUX_CENTER;

  return (
    <div>
      <div className="search-bar" style={{ border: 'none', padding: '0 0 0.75rem' }}>
        <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)}>
          <option value="">Toutes les zones</option>
          {zones.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
        <span className="meta">{filtered.length} agences sur la carte</span>
      </div>
      <div className="map-container">
        <MapContainer center={center} zoom={11} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((c) => (
            <Marker key={c.id} position={[c.lat, c.lng]}>
              <Popup>
                <strong>{c.name}</strong>
                <br />
                <small>{c.zone}</small>
                <br />
                <small>{STATUS_CONFIG[c.status as Status].label}</small>
                <br />
                <button
                  type="button"
                  className="btn"
                  style={{ marginTop: '0.5rem' }}
                  onClick={() => setSelectedId(c.id)}
                >
                  Ouvrir la fiche
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
