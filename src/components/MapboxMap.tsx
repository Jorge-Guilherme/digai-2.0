import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MapboxMapProps {
  onRegionClick: (regionData: any) => void;
  mapboxToken: string;
  selectedRegion?: string | null;
  onResetZoom?: () => void;
}

// Dados mockados das regiões do Recife
const mockRegionsData = {
  "Boa Viagem": {
    name: "Boa Viagem",
    escolas: 12,
    saude: 4,
    investimento: 8000000,
    obras: ["Revitalização da Praia", "Novo Centro de Saúde"],
    coordinates: [-34.8986, -8.1137] // [lng, lat]
  },
  "Centro": {
    name: "Centro",
    escolas: 8,
    saude: 6,
    investimento: 12000000,
    obras: ["Restauro do Teatro Santa Isabel", "Modernização do Mercado"],
    coordinates: [-34.8711, -8.0578]
  },
  "Zona Norte": {
    name: "Zona Norte",
    escolas: 25,
    saude: 8,
    investimento: 15000000,
    obras: ["Construção de 3 novas escolas", "Hospital Regional"],
    coordinates: [-34.8765, -8.0276]
  },
  "Ibura": {
    name: "Ibura",
    escolas: 18,
    saude: 5,
    investimento: 15000000,
    obras: ["Centro Esportivo", "Unidade de Pronto Atendimento"],
    coordinates: [-34.9456, -8.1437]
  }
};

const MapboxMap: React.FC<MapboxMapProps> = ({ onRegionClick, mapboxToken, selectedRegion, onResetZoom }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [showTokenInput, setShowTokenInput] = useState(!mapboxToken);
  const [tempToken, setTempToken] = useState('');

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-34.8851, -8.0476],
      zoom: 11,
      pitch: 45,
      bearing: 0
    });

    map.current.on('load', () => {
      map.current?.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 10,
        'paint': {
          'fill-extrusion-color': '#00D9FF',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 0,
            15, ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 0,
            15, ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.6
        }
      });

      Object.entries(mockRegionsData).forEach(([name, data]) => {
        const lngLat = data.coordinates as [number, number];
        const marker = new mapboxgl.Marker({
          color: '#00D9FF',
          scale: 1.5
        })
          .setLngLat(lngLat)
          .addTo(map.current!);

        marker.getElement().addEventListener('click', () => {
          if (selectedRegion === name) {
            onResetZoom && onResetZoom();
          } else {
            onRegionClick(data);
          }
        });

        marker.getElement().style.cursor = 'pointer';
        marker.getElement().style.filter = 'drop-shadow(0 0 10px #00D9FF)';
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, onRegionClick, onResetZoom]);

  // Novo useEffect para controlar o zoom
  useEffect(() => {
    if (!map.current) return;
    if (!selectedRegion) {
      map.current.flyTo({ center: [-34.8851, -8.0476], zoom: 11, pitch: 45, bearing: 0, speed: 1.2 });
    } else {
      const region = mockRegionsData[selectedRegion];
      if (region) {
        const lngLat = region.coordinates as [number, number];
        map.current.flyTo({ center: lngLat, zoom: 15, pitch: 45, bearing: 0, speed: 1.2 });
      }
    }
  }, [selectedRegion]);

  const handleTokenSubmit = () => {
    if (tempToken.trim()) {
      setShowTokenInput(false);
      // This would trigger a re-render with the new token
      window.location.reload();
    }
  };

  if (showTokenInput) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-dark-bg p-4 md:p-8">
        <div className="bg-card p-4 md:p-6 rounded-lg shadow-card max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Configure Mapbox Token
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Para usar o mapa, você precisa de um token do Mapbox. 
            Visite <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-neon-blue hover:underline">mapbox.com</a> para obter um.
          </p>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Cole seu token do Mapbox aqui"
              value={tempToken}
              onChange={(e) => setTempToken(e.target.value)}
              className="w-full"
            />
            <Button 
              onClick={handleTokenSubmit}
              className="w-full bg-gradient-neon hover:shadow-neon"
              disabled={!tempToken.trim()}
            >
              Configurar Mapa
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-dark-bg/20" />
    </div>
  );
};

export default MapboxMap;