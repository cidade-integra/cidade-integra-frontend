import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapaEstatico = ({ local }) => {
    const [coords, setCoords] = useState(null);

    useEffect(() => {
        if (!local) return;
        // Consulta à API Nominatim para geocodificação
        fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(local)}`
        )
            .then((res) => res.json())
            .then((data) => {
                if (data && data.length > 0) {
                    setCoords({
                        lat: parseFloat(data[0].lat),
                        lng: parseFloat(data[0].lon),
                    });
                }
            });
    }, [local]);

    return (
        <>
            {coords ? (
                <div className="rounded-lg overflow-hidden border mb-4">
                    <MapContainer
                        center={[coords.lat, coords.lng]}
                        zoom={30}
                        style={{ width: "100%", height: "200px" }}
                        scrollWheelZoom={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[coords.lat, coords.lng]}>
                            <Popup>
                                📍{local}
                            </Popup>
                        </Marker>
                    </MapContainer>
                    </div>
            ) : null}
        </>
    );
};

export default MapaEstatico;