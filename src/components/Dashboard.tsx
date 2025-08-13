import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, School, Heart, Wrench } from 'lucide-react';
// Removido gráfico (recharts) conforme solicitação

interface DashboardProps {
  regionData: {
    name: string;
    escolas: number;
    saude: number;
    investimento: number;
    obras: string[];
  } | null;
  isVisible: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ regionData, isVisible }) => {
  // Remover log fora de escopo, adicionar log correto dentro do then
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!regionData) return;
    setLoading(true);
    const promptStory = `Conte uma breve história (máximo 80 palavras) sobre os dados urbanos da região "${regionData.name}" do Recife, destacando investimentos, escolas e saúde.`;
    fetch('/api/chatgpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: promptStory, use_context: false })
    })
      .then(async r => {
        const data = await r.json();
        if (!r.ok || data.error) {
          setErrorMsg(data.error || 'Erro ao gerar resposta');
          setStory('');
        } else {
          setErrorMsg(null);
          setStory(data.text || '');
        }
      })
      .catch(() => { setErrorMsg('Falha na conexão com o serviço'); setStory(''); })
      .finally(() => setLoading(false));
  }, [regionData]);

  if (!isVisible || !regionData) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="w-96 h-full bg-background border-l border-border p-6 overflow-y-auto animate-slide-in">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">{regionData.name}</h2>
          <div className="w-16 h-1 bg-gradient-neon mx-auto rounded-full"></div>
        </div>

  {/* Seção de gráfico removida */}

        {/* História IA */}
        <div className="bg-card border border-border rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-2 text-card-foreground">História da Região (IA)</h3>
          {loading ? (
            <div className="text-center text-muted-foreground">Carregando história...</div>
          ) : errorMsg ? (
            <p className="text-sm text-destructive">{errorMsg}</p>
          ) : (
            <p className="text-sm text-muted-foreground">{story}</p>
          )}
        </div>

        {/* Cards originais */}
        <Card className="border-border bg-card shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Building className="w-5 h-5 text-neon-blue" />
              Capital Investido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neon-blue">{formatCurrency(regionData.investimento)}</div>
            <p className="text-muted-foreground text-sm mt-1">Investimento total em 2023</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <School className="w-5 h-5 text-neon-blue" />
              Educação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{regionData.escolas}</div>
            <p className="text-muted-foreground text-sm">Unidades educacionais</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Heart className="w-5 h-5 text-neon-blue" />
              Saúde
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{regionData.saude}</div>
            <p className="text-muted-foreground text-sm">Unidades de saúde</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Wrench className="w-5 h-5 text-neon-blue" />
              Obras Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {regionData.obras.map((obra, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="w-full justify-start py-2 px-3 text-left bg-secondary/50 text-secondary-foreground border-border"
                >
                  {obra}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="bg-muted/30 border border-border rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Dados atualizados em tempo real através da transparência pública municipal</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;