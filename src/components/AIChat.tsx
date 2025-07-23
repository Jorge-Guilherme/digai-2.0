import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatProps {
  selectedRegion?: string | null;
}

const AIChat: React.FC<AIChatProps> = ({ selectedRegion }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou a IA do digAI. Posso ajudá-lo a encontrar informações sobre o Recife. Pergunte sobre investimentos, escolas, saúde ou obras em qualquer região!',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);


  // Função para buscar resposta do Gemini via backend
  const getGeminiResponse = async (question: string): Promise<string> => {
    // Prompt engineering: contexto + pergunta do usuário + região
    const contextoBase = `
Você é uma IA especialista em dados urbanos do Recife, Capital de Pernambuco. 
Responda de forma clara e objetiva, com no máximo 100 palavras. Não inclua negritos ou qualquer formatação no texto.`;
    const contextoRegiao = selectedRegion ? `Considere que a pergunta se refere à região: ${selectedRegion}.` : '';
    const promptFinal = `${contextoBase}\n${contextoRegiao}\nPergunta: ${question}`;

  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: promptFinal })
    });
    const data = await res.json();
    return data.text || 'Sem resposta.';
  } catch (err) {
    return 'Erro ao conectar à IA.';
  }
};

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    // Adiciona mensagem temporária de carregando
    const loadingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: loadingId,
      text: '',
      isUser: false,
      timestamp: new Date()
    }]);

    const aiText = await getGeminiResponse(inputValue);

    setMessages(prev => prev.map(m =>
      m.id === loadingId ? { ...m, text: aiText } : m
    ));
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="w-80 h-full bg-background border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-neon-blue" />
          <h3 className="font-semibold text-card-foreground">Chat Inteligente</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Assistente inteligente para dados urbanos
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isUser && (
              <div className="w-8 h-8 rounded-full bg-gradient-neon flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <Card className={`max-w-[250px] ${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
              <CardContent className="p-3">
                {loading && message.text === '' && !message.isUser ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></span>
                    <span className="text-xs text-muted-foreground">Pensando...</span>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{message.text}</p>
                )}
              </CardContent>
            </Card>
            {message.isUser && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        {/* Sugestões de perguntas em scroll horizontal */}
        <div className="mb-2 overflow-x-auto">
          <div className="flex gap-2 w-max">
            {[
              'Quais bairros mais receberam investimento?',
              'Quantas escolas existem na Zona Norte?',
              'Onde foram feitas obras recentes?',
              'Qual região tem mais unidades de saúde?',
              'Quais são as principais obras em Boa Viagem?',
              'Como está a educação no Centro?'
            ].map((sugestao, idx) => (
              <button
                key={idx}
                type="button"
                className="px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground whitespace-nowrap border border-border hover:bg-background transition"
                onClick={() => setInputValue(sugestao)}
              >
                {sugestao}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pergunte sobre o Recife..."
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            size="icon"
            className="bg-gradient-neon hover:shadow-neon"
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;