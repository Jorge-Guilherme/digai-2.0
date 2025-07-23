import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, School, Heart, Wrench } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [chartData, setChartData] = useState<any[]>([]);
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!regionData) return;
    setLoading(true);

    const promptChart = `
Gere um resumo dos principais dados urbanos da região "${regionData.name}" do Recife no seguinte formato JSON:
[
  { "categoria": "Escolas", "valor": ${regionData.escolas} },
  { "categoria": "Saúde", "valor": ${regionData.saude} },
  { "categoria": "Investimento", "valor": ${regionData.investimento} }
]
Apenas o JSON, sem explicações.
    `;

    const promptStory = `
Conte uma breve história (máximo 80 palavras) sobre os dados urbanos da região "${regionData.name}" do Recife, destacando investimentos, escolas e saúde.
    `;

    const fetchFromGemini = async (prompt: string) => {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      return data.text;
    };

    Promise.all([
      fetchFromGemini(promptChart),
      fetchFromGemini(promptStory)
    ]).then(([chartText, storyText]) => {
      console.log('Resposta Gemini para gráfico:', chartText);
      // Remove blocos markdown e espaços extras
      let cleanChartText = chartText
        .replace(/```json|```/gi, '')
        .replace(/```/g, '')
        .trim();
      try {
        setChartData(JSON.parse(cleanChartText));
      } catch {
        setChartData([]);
      }
      setStory(storyText);
      setLoading(false);
    });
  }, [regionData]);

  if (!isVisible || !regionData) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
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

        {/* Gráfico IA */}
        <div className="bg-card border border-border rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-2 text-card-foreground">Resumo Visual (IA)</h3>
          {loading ? (
            <div className="text-center text-muted-foreground">Carregando gráfico...</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valor" fill="#00D9FF" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* História IA */}
        <div className="bg-card border border-border rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-2 text-card-foreground">História da Região (IA)</h3>
          {loading ? (
            <div className="text-center text-muted-foreground">Carregando história...</div>
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