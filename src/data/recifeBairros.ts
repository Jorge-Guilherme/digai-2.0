// Dataset de bairros do Recife com dados mock.
// Coordenadas aproximadas [lng, lat]. Valores de escolas, saude e investimento são fictícios.
export interface BairroData {
  name: string;
  escolas: number;
  saude: number;
  investimento: number; // em reais
  obras: string[];
  coordinates: [number, number];
}

export const bairrosRecife: BairroData[] = [
  { name: "Centro", escolas: 8, saude: 6, investimento: 12000000, obras: ["Restauro de patrimônio", "Modernização do Mercado"], coordinates: [-34.8711, -8.0578] },
  { name: "Boa Viagem", escolas: 12, saude: 4, investimento: 8000000, obras: ["Revitalização da Praia", "Novo Centro de Saúde"], coordinates: [-34.9003, -8.1195] },
  { name: "Pina", escolas: 7, saude: 3, investimento: 5500000, obras: ["Requalificação da orla", "Iluminação inteligente"], coordinates: [-34.8895, -8.0859] },
  { name: "Brasília Teimosa", escolas: 6, saude: 2, investimento: 3000000, obras: ["Urbanização costeira"], coordinates: [-34.8728, -8.0797] },
  { name: "Imbiribeira", escolas: 14, saude: 5, investimento: 9000000, obras: ["Arena esportiva", "Canal drenagem"], coordinates: [-34.9180, -8.0947] },
  { name: "Ibura", escolas: 18, saude: 5, investimento: 15000000, obras: ["Centro Esportivo", "UPA"], coordinates: [-34.9445, -8.1436] },
  { name: "Afogados", escolas: 10, saude: 5, investimento: 6000000, obras: ["Canalização", "Reforma escolar"], coordinates: [-34.9105, -8.0722] },
  { name: "Areias", escolas: 9, saude: 3, investimento: 4500000, obras: ["Pavimentação"], coordinates: [-34.9450, -8.0815] },
  { name: "Estância", escolas: 8, saude: 3, investimento: 4200000, obras: ["Parque urbano"], coordinates: [-34.9350, -8.0935] },
  { name: "San Martin", escolas: 11, saude: 4, investimento: 5600000, obras: ["Terminal integrado"], coordinates: [-34.9272, -8.0678] },
  { name: "Cordeiro", escolas: 10, saude: 4, investimento: 5800000, obras: ["Mercado público"], coordinates: [-34.9278, -8.0498] },
  { name: "Zumbi", escolas: 5, saude: 2, investimento: 2800000, obras: ["Praça comunitária"], coordinates: [-34.8910, -8.0530] },
  { name: "Várzea", escolas: 14, saude: 5, investimento: 8200000, obras: ["Pavimentação", "Ampliação posto"], coordinates: [-34.9590, -8.0350] },
  { name: "Iputinga", escolas: 9, saude: 3, investimento: 4700000, obras: ["Canal saneamento"], coordinates: [-34.9365, -8.0402] },
  { name: "Torre", escolas: 7, saude: 4, investimento: 5000000, obras: ["Ciclofaixa"], coordinates: [-34.9105, -8.0408] },
  { name: "Madalena", escolas: 9, saude: 4, investimento: 7000000, obras: ["Parque linear", "Creche"], coordinates: [-34.9150, -8.0550] },
  { name: "Graças", escolas: 13, saude: 5, investimento: 9000000, obras: ["Jardins urbanos", "Segurança viária"], coordinates: [-34.9035, -8.0410] },
  { name: "Espinheiro", escolas: 11, saude: 6, investimento: 8800000, obras: ["Boulevard verde"], coordinates: [-34.8915, -8.0380] },
  { name: "Casa Forte", escolas: 12, saude: 4, investimento: 7600000, obras: ["Museu interativo"], coordinates: [-34.9180, -8.0340] },
  { name: "Poço da Panela", escolas: 5, saude: 2, investimento: 3000000, obras: ["Restauro casarões"], coordinates: [-34.9255, -8.0300] },
  { name: "Apipucos", escolas: 6, saude: 2, investimento: 3500000, obras: ["Parque ecológico"], coordinates: [-34.9500, -8.0100] },
  { name: "Parnamirim", escolas: 8, saude: 3, investimento: 5200000, obras: ["Eixo cultural"], coordinates: [-34.9030, -8.0305] },
  { name: "Santana", escolas: 7, saude: 3, investimento: 4100000, obras: ["Praça esportiva"], coordinates: [-34.9085, -8.0345] },
  { name: "Derby", escolas: 6, saude: 5, investimento: 6400000, obras: ["Terminal requalificação"], coordinates: [-34.8980, -8.0520] },
  { name: "Ilha do Leite", escolas: 2, saude: 10, investimento: 10000000, obras: ["Centro médico"], coordinates: [-34.8900, -8.0630] },
  { name: "Santo Amaro", escolas: 11, saude: 6, investimento: 7600000, obras: ["Restauro patrimônio", "Laboratório municipal"], coordinates: [-34.8760, -8.0450] },
  { name: "Campo Grande", escolas: 8, saude: 3, investimento: 4500000, obras: ["Escola técnica"], coordinates: [-34.8805, -8.0400] },
  { name: "Encruzilhada", escolas: 9, saude: 4, investimento: 5300000, obras: ["Passarela segura"], coordinates: [-34.8865, -8.0295] },
  { name: "Fundão", escolas: 4, saude: 2, investimento: 2100000, obras: ["Pavimentação"], coordinates: [-34.8700, -8.0200] },
  { name: "Arruda", escolas: 5, saude: 2, investimento: 2400000, obras: ["Centro cultural"], coordinates: [-34.8750, -8.0250] },
  { name: "Água Fria", escolas: 7, saude: 3, investimento: 3800000, obras: ["Canal drenagem"], coordinates: [-34.8705, -8.0120] },
  { name: "Beberibe", escolas: 6, saude: 2, investimento: 3000000, obras: ["Urbanização local"], coordinates: [-34.8650, -8.0135] },
  { name: "Cajueiro", escolas: 5, saude: 2, investimento: 2500000, obras: ["Centro comunitário"], coordinates: [-34.8605, -8.0000] },
  { name: "Dois Unidos", escolas: 6, saude: 2, investimento: 2600000, obras: ["Requalificação vias"], coordinates: [-34.8500, -8.0050] },
  { name: "Linha do Tiro", escolas: 5, saude: 2, investimento: 2300000, obras: ["Iluminação pública"], coordinates: [-34.8400, -8.0150] },
  { name: "Bomba do Hemetério", escolas: 4, saude: 2, investimento: 2000000, obras: ["Centro social"], coordinates: [-34.8680, -8.0100] },
  { name: "Alto José do Pinho", escolas: 5, saude: 2, investimento: 2200000, obras: ["Escadaria acessível"], coordinates: [-34.8850, -8.0050] },
  { name: "Guabiraba", escolas: 6, saude: 2, investimento: 3400000, obras: ["Ponto de apoio rural"], coordinates: [-34.9300, -7.9900] },
  { name: "Nova Descoberta", escolas: 7, saude: 3, investimento: 3600000, obras: ["Creche"], coordinates: [-34.9150, -8.0000] },
  { name: "Macaxeira", escolas: 6, saude: 2, investimento: 3100000, obras: ["Parque esportivo"], coordinates: [-34.9200, -8.0150] },
  { name: "Casa Amarela", escolas: 12, saude: 5, investimento: 9500000, obras: ["Terminal urbano"], coordinates: [-34.9155, -8.0250] },
  { name: "Vasco da Gama", escolas: 6, saude: 2, investimento: 3200000, obras: ["Centro cultural"], coordinates: [-34.9000, -8.0000] },
  { name: "Alto José Bonifácio", escolas: 5, saude: 2, investimento: 2100000, obras: ["Escadaria segura"], coordinates: [-34.9050, -8.0100] },
  { name: "Morro da Conceição", escolas: 5, saude: 2, investimento: 3300000, obras: ["Santuário turístico"], coordinates: [-34.9100, -8.0155] },
  { name: "Mangabeira", escolas: 4, saude: 2, investimento: 1800000, obras: ["Academia ao ar livre"], coordinates: [-34.9250, -8.0050] },
  { name: "Cohab", escolas: 16, saude: 6, investimento: 11000000, obras: ["Habitação popular"], coordinates: [-34.9600, -8.1700] },
  { name: "Jordão", escolas: 9, saude: 3, investimento: 5000000, obras: ["Requalificação viária"], coordinates: [-34.9500, -8.1600] },
  { name: "Ipsep", escolas: 10, saude: 4, investimento: 6200000, obras: ["Centro cultural"], coordinates: [-34.9300, -8.1150] }
];

// Mapa por nome
export const bairrosRecifeByName: Record<string, BairroData> = Object.fromEntries(
  bairrosRecife.map(b => [b.name, b])
);
