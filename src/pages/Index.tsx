import React, { useState } from 'react';
import MapboxMap from '@/components/MapboxMap';
import Dashboard from '@/components/Dashboard';
import AIChat from '@/components/AIChat';
import { Button } from '@/components/ui/button';
import { MapPin, Brain, BarChart3 } from 'lucide-react';
import heroImage from '@/assets/recife-hero.jpg';

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  // Para controlar qual região está selecionada (nome)
  const [selectedRegionName, setSelectedRegionName] = useState<string | null>(null);
  
  // Token do Mapbox inserido diretamente
  const mapboxToken = 'pk.eyJ1Ijoiam9yZ2VndWlsaGVybWUiLCJhIjoiY21kZjU0YzdiMDh1MzJrcTBnbHdrcGF5cSJ9.hXoOgul4b3KPaDxX4fF6Gw';

  const handleRegionClick = (regionData: any) => {
    setSelectedRegion(regionData);
    setSelectedRegionName(regionData.name);
    setShowDashboard(true);
  };

  const handleResetZoom = () => {
    setSelectedRegion(null);
    setSelectedRegionName(null);
    setShowDashboard(false);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-foreground overflow-hidden">
      {/* Header */}
      <header className="relative z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-neon rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  dig<span className="text-neon-blue">AI</span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  Um jeito leve de explorar a cidade
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart3 className="w-4 h-4" />
                <span>Dados Atualizados</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
        {/* AI Chat Sidebar - Hidden on mobile when dashboard is shown */}
        <div className={`${showDashboard ? 'hidden md:block' : 'block'}`}>
          <AIChat selectedRegion={selectedRegionName} />
        </div>
        
        {/* Map Container */}
        <div className="flex-1 relative">
          <MapboxMap 
            onRegionClick={handleRegionClick}
            mapboxToken={mapboxToken}
            selectedRegion={selectedRegionName}
            onResetZoom={handleResetZoom}
          />
          
          {/* Floating Info Card - Only show when no region is selected */}
          {!showDashboard && (
            <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
              <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-card pointer-events-auto max-w-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-neon rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Explore o Recife</h3>
                    <p className="text-sm text-muted-foreground">Clique nos marcadores azuis no mapa</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-muted/30 rounded-lg p-2">
                    <MapPin className="w-4 h-4 text-neon-blue mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Mapa 3D</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-2">
                    <BarChart3 className="w-4 h-4 text-neon-blue mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Dados</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-2">
                    <Brain className="w-4 h-4 text-neon-blue mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">IA</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dashboard Sidebar - On mobile, show over chat */}
        {showDashboard && (
          <div className="md:block absolute md:relative inset-0 md:inset-auto z-20 md:z-auto">
            <Dashboard 
              regionData={selectedRegion}
              isVisible={showDashboard}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
