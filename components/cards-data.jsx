/* ── KOKO Diagnóstico — Data Layer ── */

/* Color per dimension — KOKO palette */
const DIM_COLORS = ['#ED028A', '#7807F7', '#42A947', '#F7ED07', '#FF81FF'];
const DIM_BG = ['#ED028A', '#7807F7', '#013B26', '#F7ED07', '#FF81FF'];

/* Archetype definitions: 5 dimensions × 5 levels */
const DIMENSIONS = [
  {
    id: 'estrutura', title: 'PERFIL & ESTRUTURA', icon: '01',
    levels: [
      { name: 'FREELANCER DISFARÇADO', phrase: '"Faz tudo, mas não escala nada"', desc: 'A agência opera como extensão do fundador. Sem sócios, sem equipe fixa, sem processos — tudo depende de uma pessoa.', recs: ['Definir papéis mínimos', 'Contratar primeiro freelancer fixo', 'Separar operação de estratégia'] },
      { name: 'ESTRUTURA EMBRIONÁRIA', phrase: '"Começa a ter forma, mas ainda é frágil"', desc: 'Já existe equipe pequena e alguma divisão de tarefas, mas a liderança ainda centraliza demais.', recs: ['Documentar processos-chave', 'Delegar entregas operacionais', 'Criar reuniões de alinhamento'] },
      { name: 'MÁQUINA EM CONSTRUÇÃO', phrase: '"As peças existem — falta encaixar"', desc: 'Equipe funcional, modelo híbrido ou remoto. Processos existem mas não são consistentes.', recs: ['Padronizar fluxos de entrega', 'Implementar ferramenta de gestão', 'Criar cultura de documentação'] },
      { name: 'OPERAÇÃO SÓLIDA', phrase: '"Roda sem o fundador no operacional"', desc: 'Equipe autônoma, processos claros, gestão organizada. O fundador atua em estratégia.', recs: ['Focar em liderança e cultura', 'Investir em retenção de talentos', 'Escalar com novos squads'] },
      { name: 'MÁQUINA DE GUERRA', phrase: '"Escala é questão de decisão"', desc: 'Estrutura madura, equipe experiente, processos automatizados. Pronta para crescimento acelerado.', recs: ['Explorar novos mercados', 'Criar programa de liderança', 'Considerar M&A ou parcerias'] },
    ]
  },
  {
    id: 'digital', title: 'PRESENÇA DIGITAL', icon: '02',
    levels: [
      { name: 'INVISÍVEL', phrase: '"Se não te acham, você não existe"', desc: 'Sem site, redes abandonadas ou sem estratégia. A agência não gera nenhuma percepção online.', recs: ['Criar perfil profissional no Instagram', 'Definir frequência mínima de posts', 'Ativar Google Meu Negócio'] },
      { name: 'FANTASMA DIGITAL', phrase: '"Existe, mas ninguém nota"', desc: 'Redes ativas sem constância. Conteúdo genérico, sem identidade. Site desatualizado ou inexistente.', recs: ['Criar calendário editorial', 'Definir pilares de conteúdo', 'Atualizar ou criar site'] },
      { name: 'PRESENÇA CONSTRUÍDA', phrase: '"Aparece, mas ainda não converte"', desc: 'Conteúdo constante, algum engajamento. Falta estratégia de conversão e funil claro.', recs: ['Criar lead magnets', 'Integrar CTA nos conteúdos', 'Testar tráfego pago pro perfil'] },
      { name: 'AUTORIDADE EM ASCENSÃO', phrase: '"O mercado já sabe quem você é"', desc: 'Boa audiência, conteúdo que gera leads. Múltiplos canais ativos com estratégia integrada.', recs: ['Investir em vídeo/podcast', 'Criar comunidade', 'Escalar produção de conteúdo'] },
      { name: 'REFERÊNCIA DO NICHO', phrase: '"Quando pensam no assunto, pensam em você"', desc: 'Marca forte, audiência engajada, leads orgânicos constantes. Referência reconhecida.', recs: ['Monetizar audiência', 'Lançar produto digital', 'Fechar parcerias estratégicas'] },
    ]
  },
  {
    id: 'posicionamento', title: 'POSICIONAMENTO & NICHO', icon: '03',
    levels: [
      { name: 'ATIRADOR CEGO', phrase: '"Atende qualquer um, não atrai ninguém"', desc: 'Generalista total, sem público definido. Pega qualquer cliente que aparece.', recs: ['Mapear melhores clientes atuais', 'Identificar padrões de sucesso', 'Testar comunicação nichada'] },
      { name: 'GENERALISTA INQUIETO', phrase: '"Sabe que precisa focar, mas tem medo"', desc: 'Consciência de que precisa de nicho, mas ainda aceita tudo. Posicionamento confuso.', recs: ['Escolher 2-3 verticais para testar', 'Criar cases específicos', 'Ajustar comunicação por vertical'] },
      { name: 'NICHO EM TESTE', phrase: '"Escolheu uma direção — agora precisa provar"', desc: 'Já tem um nicho definido ou em transição. Comunicação ainda não reflete 100%.', recs: ['Criar conteúdo especializado', 'Refinar proposta de valor', 'Buscar clientes-referência'] },
      { name: 'ESPECIALISTA RECONHECIDO', phrase: '"O nicho te procura — não o contrário"', desc: 'Posicionamento claro, clientes ideais chegam organicamente. A marca reflete o nicho.', recs: ['Aprofundar diferencial técnico', 'Criar thought leadership', 'Precificar como especialista'] },
      { name: 'DONO DO TERRITÓRIO', phrase: '"Você definiu a categoria"', desc: 'Referência absoluta no nicho. Concorrentes te imitam. Clientes pagam premium.', recs: ['Expandir para nichos adjacentes', 'Criar metodologia proprietária', 'Licenciar ou franquear'] },
    ]
  },
  {
    id: 'carteira', title: 'CARTEIRA & SERVIÇOS', icon: '04',
    levels: [
      { name: 'SOBREVIVENTE', phrase: '"Cada mês é uma incógnita"', desc: 'Poucos clientes, alta dependência, serviços genéricos. Sem processo comercial.', recs: ['Definir serviço-âncora', 'Criar proposta padronizada', 'Ativar prospecção mínima'] },
      { name: 'EQUILIBRISTA', phrase: '"Segura os pratos, mas qualquer um pode cair"', desc: 'Carteira crescendo mas frágil. Scope creep frequente. Precificação inconsistente.', recs: ['Padronizar escopos e contratos', 'Criar tabela de preços', 'Implementar onboarding'] },
      { name: 'CARTEIRA EM FORMAÇÃO', phrase: '"Tem clientes bons — precisa de mais"', desc: 'Mix de clientes bons e ruins. Serviços definidos mas margem variável.', recs: ['Classificar clientes (A/B/C)', 'Descontinuar serviços de baixa margem', 'Criar funil de vendas'] },
      { name: 'MOTOR COMERCIAL', phrase: '"Vende com método, entrega com processo"', desc: 'Pipeline ativo, contratos estruturados, boa retenção. Carteira equilibrada.', recs: ['Criar programa de indicação', 'Upsell para clientes A', 'Automatizar nutrição de leads'] },
      { name: 'PORTFÓLIO PREMIUM', phrase: '"Escolhe quem atende — e cobra por isso"', desc: 'Carteira selecionada, tickets altos, baixo churn. Operação previsível.', recs: ['Criar modelo de parceria/equity', 'Lançar produto SaaS/digital', 'Expandir geograficamente'] },
    ]
  },
  {
    id: 'financeiro', title: 'FINANCEIRO & METAS', icon: '05',
    levels: [
      { name: 'NO VERMELHO', phrase: '"Apaga incêndio todo mês"', desc: 'Sem controle financeiro, pró-labore irregular, custos desconhecidos. Urgência alta.', recs: ['Montar planilha de fluxo de caixa', 'Definir custo fixo real', 'Separar contas PF e PJ'] },
      { name: 'CAIXA APERTADO', phrase: '"Paga as contas, mas não sobra"', desc: 'Faturamento cobre custos. Sem margem, sem reserva. Qualquer perda gera crise.', recs: ['Calcular margem por cliente', 'Reajustar contratos defasados', 'Criar meta de reserva (3 meses)'] },
      { name: 'EQUILÍBRIO FRÁGIL', phrase: '"Crescendo, mas sem clareza de para onde"', desc: 'Faturamento razoável, alguma margem. Falta clareza sobre lucratividade por serviço.', recs: ['Implementar DRE mensal', 'Definir meta de margem líquida', 'Criar dashboard financeiro'] },
      { name: 'SAÚDE FINANCEIRA', phrase: '"Números claros, decisões seguras"', desc: 'Controle financeiro sólido, margem saudável, pró-labore regular. Metas definidas.', recs: ['Otimizar tributação', 'Investir lucro em crescimento', 'Criar plano de participação'] },
      { name: 'MÁQUINA DE LUCRO', phrase: '"O dinheiro trabalha para a agência"', desc: 'Alta lucratividade, reservas robustas, investimentos estratégicos. Crescimento sustentável.', recs: ['Diversificar receitas', 'Criar fundo de inovação', 'Planejar valuation e exit'] },
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
window.SAMPLE_DIAGNOSIS = SAMPLE_DIAGNOSIS;
