/* ── KOKO Diagnóstico — Data Layer ── */

/* Color per dimension — KOKO palette */
const DIM_COLORS = ['#ED028A', '#7807F7', '#42A947', '#F7ED07', '#FF81FF'];
const DIM_BG = ['#ED028A', '#7807F7', '#013B26', '#F7ED07', '#FF81FF'];

/* Fases da Koko — espinha unificada dos 5 níveis */
const PHASE_NAMES = [
  'IDADE DA PEDRA',
  'BOOM DE CLIENTES',
  'REVOLUÇÃO INDUSTRIAL CRIATIVA',
  'RENASCIMENTO CRIATIVO',
  'NEO',
];

/* Archetype definitions: 5 dimensions × 5 levels (Fases da Koko) */
const DIMENSIONS = [
  {
    id: 'estrutura', title: 'PERFIL & ESTRUTURA', icon: '01',
    levels: [
      { name: PHASE_NAMES[0], phrase: '"Sócio faz tudo, sem padrão"', desc: 'A agência opera como extensão do fundador. Sem sócios, sem equipe fixa, sem processos — tudo depende de uma pessoa.', recs: ['Definir papéis mínimos', 'Contratar primeiro freelancer fixo', 'Separar operação de estratégia'] },
      { name: PHASE_NAMES[1], phrase: '"Júnior cobrado como sênior, time inchado"', desc: 'Equipe cresceu rápido, divisão de tarefas confusa. Liderança ainda centraliza demais e gargalos aparecem.', recs: ['Documentar processos-chave', 'Delegar entregas operacionais', 'Criar reuniões de alinhamento'] },
      { name: PHASE_NAMES[2], phrase: '"Microagências formadas, primeiros gerentes"', desc: 'As peças existem, falta encaixar. Equipe funcional com modelo híbrido. Processos existem mas inconsistentes.', recs: ['Padronizar fluxos de entrega', 'Implementar ferramenta de gestão', 'Criar cultura de documentação'] },
      { name: PHASE_NAMES[3], phrase: '"3 camadas, sócio fora da operação"', desc: 'Lideranças por área, equipe autônoma, processos claros. O fundador atua só em estratégia e cultura.', recs: ['Focar em liderança e cultura', 'Investir em retenção de talentos', 'Escalar com novos squads'] },
      { name: PHASE_NAMES[4], phrase: '"Cargos que não existem no organograma clássico"', desc: 'Time não tem cargos de agência tradicional — tem head de IP, head de produto, head de cultura. Espécie nova.', recs: ['Explorar novos mercados', 'Criar programa de liderança', 'Considerar M&A ou parcerias'] },
    ]
  },
  {
    id: 'digital', title: 'PRESENÇA DIGITAL', icon: '02',
    levels: [
      { name: PHASE_NAMES[0], phrase: '"Invisível — indicação ou nada"', desc: 'Sem site, redes abandonadas ou sem estratégia. A agência não gera nenhuma percepção online.', recs: ['Criar perfil profissional no Instagram', 'Definir frequência mínima de posts', 'Ativar Google Meu Negócio'] },
      { name: PHASE_NAMES[1], phrase: '"Posta porque tem que postar, sem tese"', desc: 'Redes ativas sem constância. Conteúdo genérico, sem identidade. Site desatualizado ou inexistente.', recs: ['Criar calendário editorial', 'Definir pilares de conteúdo', 'Atualizar ou criar site'] },
      { name: PHASE_NAMES[2], phrase: '"Presença com método, ainda não é referência"', desc: 'Conteúdo constante com estratégia, algum engajamento. Falta funil claro de conversão.', recs: ['Criar lead magnets', 'Integrar CTA nos conteúdos', 'Testar tráfego pago pro perfil'] },
      { name: PHASE_NAMES[3], phrase: '"Autoridade construída, mercado já sabe quem você é"', desc: 'Boa audiência, conteúdo que gera leads. Múltiplos canais ativos com estratégia integrada.', recs: ['Investir em vídeo/podcast', 'Criar comunidade', 'Escalar produção de conteúdo'] },
      { name: PHASE_NAMES[4], phrase: '"A marca virou mídia — IA cita você"', desc: 'A marca não usa canais, é canal. Quando perguntam sobre o tema, IAs te citam (GEO nativo).', recs: ['Monetizar audiência', 'Lançar produto digital', 'Fechar parcerias estratégicas'] },
    ]
  },
  {
    id: 'posicionamento', title: 'POSICIONAMENTO & NICHO', icon: '03',
    levels: [
      { name: PHASE_NAMES[0], phrase: '"Atende qualquer um que pague"', desc: 'Generalista total, sem público definido. Pega qualquer cliente que aparece.', recs: ['Mapear melhores clientes atuais', 'Identificar padrões de sucesso', 'Testar comunicação nichada'] },
      { name: PHASE_NAMES[1], phrase: '"Tenta nichar com medo"', desc: 'Consciência de que precisa de nicho, mas ainda aceita tudo. Posicionamento confuso.', recs: ['Escolher 2-3 verticais para testar', 'Criar cases específicos', 'Ajustar comunicação por vertical'] },
      { name: PHASE_NAMES[2], phrase: '"Nicho em teste, prova de conceito"', desc: 'Direção escolhida, comunicação em ajuste. Primeiros clientes do nicho fechando.', recs: ['Criar conteúdo especializado', 'Refinar proposta de valor', 'Buscar clientes-referência'] },
      { name: PHASE_NAMES[3], phrase: '"Especialista reconhecido, nicho te procura"', desc: 'Posicionamento claro, clientes ideais chegam organicamente. A marca reflete o nicho.', recs: ['Aprofundar diferencial técnico', 'Criar thought leadership', 'Precificar como especialista'] },
      { name: PHASE_NAMES[4], phrase: '"Você não está no nicho — você é o nicho"', desc: 'Definiu a categoria. Concorrentes são comparados a você. Mercado nomeia o segmento por você.', recs: ['Expandir para nichos adjacentes', 'Criar metodologia proprietária', 'Licenciar ou franquear'] },
    ]
  },
  {
    id: 'carteira', title: 'CARTEIRA & SERVIÇOS', icon: '04',
    levels: [
      { name: PHASE_NAMES[0], phrase: '"Poucos clientes empreendedores sem verba"', desc: 'Carteira mínima, alta dependência, serviços genéricos. Sem processo comercial.', recs: ['Definir serviço-âncora', 'Criar proposta padronizada', 'Ativar prospecção mínima'] },
      { name: PHASE_NAMES[1], phrase: '"30 clientes ticket baixo, scope creep"', desc: 'Carteira inflada e frágil. Scope creep frequente. Precificação inconsistente.', recs: ['Padronizar escopos e contratos', 'Criar tabela de preços', 'Implementar onboarding'] },
      { name: PHASE_NAMES[2], phrase: '"Carteira em formação, médias com depto de mkt"', desc: 'Mix de clientes, perfil melhor. Serviços definidos mas margem ainda variável.', recs: ['Classificar clientes (A/B/C)', 'Descontinuar serviços de baixa margem', 'Criar funil de vendas'] },
      { name: PHASE_NAMES[3], phrase: '"Motor comercial, grandes clientes com processo"', desc: 'Pipeline ativo, contratos estruturados, boa retenção. Carteira equilibrada.', recs: ['Criar programa de indicação', 'Upsell para clientes A', 'Automatizar nutrição de leads'] },
      { name: PHASE_NAMES[4], phrase: '"Vende acesso, IP, produto — a agência virou outra coisa"', desc: 'Não vende serviço por hora ou retainer. Vende formato de oferta que não existia antes.', recs: ['Criar modelo de parceria/equity', 'Lançar produto SaaS/digital', 'Expandir geograficamente'] },
    ]
  },
  {
    id: 'financeiro', title: 'FINANCEIRO & METAS', icon: '05',
    levels: [
      { name: PHASE_NAMES[0], phrase: '"Mês a mês, capital de giro = pessoal"', desc: 'Sem controle financeiro, pró-labore irregular, custos desconhecidos. Urgência alta.', recs: ['Montar planilha de fluxo de caixa', 'Definir custo fixo real', 'Separar contas PF e PJ'] },
      { name: PHASE_NAMES[1], phrase: '"Caixa apertado, paga conta sem sobrar"', desc: 'Faturamento cobre custos. Sem margem, sem reserva. Qualquer perda gera crise.', recs: ['Calcular margem por cliente', 'Reajustar contratos defasados', 'Criar meta de reserva (3 meses)'] },
      { name: PHASE_NAMES[2], phrase: '"Equilíbrio frágil — risco do erro canônico Koko"', desc: 'Faturamento razoável, alguma margem. Risco de usar capital de giro pra investir em crescimento.', recs: ['Implementar DRE mensal', 'Definir meta de margem líquida', 'Criar dashboard financeiro'] },
      { name: PHASE_NAMES[3], phrase: '"Saúde financeira, OKRs, decisões com número"', desc: 'Controle financeiro sólido, margem saudável, pró-labore regular. Metas claras.', recs: ['Otimizar tributação', 'Investir lucro em crescimento', 'Criar plano de participação'] },
      { name: PHASE_NAMES[4], phrase: '"Múltiplas linhas — produto, IP, equity, valuation"', desc: 'Receitas não-agência. Dinheiro trabalha pela marca. Pensar em valuation, não só lucro.', recs: ['Diversificar receitas', 'Criar fundo de inovação', 'Planejar valuation e exit'] },
    ]
  },
];

const SAMPLE_DIAGNOSIS = {
  agencia: 'Agência Nova',
  nome: 'Ana Souza',
  data: '25 ABR 2026',
  cards: [
    { dimIndex: 0, level: 2 },
    { dimIndex: 1, level: 1 },
    { dimIndex: 2, level: 0 },
    { dimIndex: 3, level: 2 },
    { dimIndex: 4, level: 1 },
  ]
};

window.DIM_COLORS = DIM_COLORS;
window.DIM_BG = DIM_BG;
window.DIMENSIONS = DIMENSIONS;
window.PHASE_NAMES = PHASE_NAMES;
window.SAMPLE_DIAGNOSIS = SAMPLE_DIAGNOSIS;
