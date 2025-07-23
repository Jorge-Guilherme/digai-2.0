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

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou a desenrolAI, IA do digAI. Posso ajudá-lo a encontrar informações sobre o Recife. Pergunte sobre investimentos, escolas, saúde ou obras em qualquer região!',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  // Respostas mockadas baseadas em palavras-chave
  const getMockResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('investimento') || lowerQuestion.includes('capital')) {
      return 'Ibura recebeu R$ 15M em 2023, sendo o maior investimento da Zona Sul. Boa Viagem teve R$ 8M focados em infraestrutura turística, enquanto a Zona Norte recebeu R$ 15M para expansão educacional.';
    }
    
    if (lowerQuestion.includes('escola') || lowerQuestion.includes('educação')) {
      return 'A Zona Norte possui 25 escolas, sendo a região com mais unidades educacionais. Ibura tem 18 escolas, Boa Viagem tem 12 e o Centro possui 8 unidades especializadas em ensino técnico.';
    }
    
    if (lowerQuestion.includes('saúde') || lowerQuestion.includes('hospital')) {
      return 'A Zona Norte lidera com 8 unidades de saúde, incluindo o novo Hospital Regional. O Centro tem 6 unidades especializadas, Ibura possui 5 UPAs e Boa Viagem conta com 4 centros de saúde.';
    }
    
    if (lowerQuestion.includes('obras') || lowerQuestion.includes('construção')) {
      return 'Principais obras em andamento: Zona Norte - 3 novas escolas e Hospital Regional; Ibura - Centro Esportivo e UPA; Boa Viagem - Revitalização da Praia; Centro - Restauro do Teatro Santa Isabel.';
    }
    
    if (lowerQuestion.includes('boa viagem')) {
      return 'Boa Viagem: 12 escolas, 4 unidades de saúde, R$ 8M investidos. Obras principais: Revitalização da Praia e Novo Centro de Saúde. Região focada no turismo e serviços.';
    }
    
    if (lowerQuestion.includes('centro')) {
      return 'Centro do Recife: 8 escolas técnicas, 6 unidades de saúde especializadas, R$ 12M investidos. Obras: Restauro do Teatro Santa Isabel e Modernização do Mercado São José.';
    }
    
    if (lowerQuestion.includes('zona norte')) {
      return 'Zona Norte: 25 escolas, 8 unidades de saúde, R$ 15M investidos. Maior região em expansão educacional e de saúde, com foco em desenvolvimento social.';
    }
    
    if (lowerQuestion.includes('ibura')) {
      return 'Ibura: 18 escolas, 5 unidades de saúde, R$ 15M investidos. Obras: Centro Esportivo e nova UPA. Região com forte investimento em infraestrutura social.';
    }
    
    return 'Posso ajudá-lo com informações sobre investimentos, escolas, unidades de saúde e obras nas regiões do Recife. Tente perguntar sobre uma região específica ou tema de interesse!';
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: getMockResponse(inputValue),
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setInputValue('');
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
          <h3 className="font-semibold text-card-foreground">desenrolAI</h3>
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
                <p className="text-sm leading-relaxed">{message.text}</p>
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