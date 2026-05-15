/* ── KOKO Diagnóstico — Data Layer (Fases da Koko + NEO) ── */

/* Color per dimension — KOKO palette */
const DIM_COLORS = ['#ED028A', '#7807F7', '#42A947', '#F7ED07', '#FF81FF'];
const DIM_BG = ['#ED028A', '#7807F7', '#013B26', '#F7ED07', '#FF81FF'];

/* Phase names — universal across all dimensions */
const PHASE_NAMES = ['PEDRA', 'BOOM', 'INDUSTRIAL', 'RENASCIMENTO', 'NEO'];

/* Archetype definitions: 5 dimensions × 5 levels (Fases da Koko) */
const DIMENSIONS = [
  {
    id: 'estrutura', title: 'PERFIL & ESTRUTURA', icon: '01',
    levels: [
      { name: 'PEDRA', phrase: '"Você é a empresa inteira"', desc: 'Você é comercial, financeiro, gestor e operador ao mesmo tempo. Sócio faz tudo. Sem padrão de entrega. Empresa vinculada à imagem de um dos sócios.', recs: ['Definir papéis mínimos com base nas habilidades reais dos sócios', 'Construir o primeiro case e anotar cada detalhe', 'Investir em educação para qualificar demandas'] },
      { name: 'BOOM', phrase: '"Inchou, mas não cresceu"', desc: 'Equipe júnior contratada inocente ("vou contratar pra ter mais tempo"). Sem sistema de feedback. Inflamação operacional. Cobra júnior como sênior.', recs: ['Criar sistema de feedback contínuo', 'Investir em RH (contratação e avaliação)', 'Documentar processos-chave'] },
      { name: 'INDUSTRIAL', phrase: '"As peças existem — falta encaixar"', desc: 'Microagências formadas. Primeiros gerentes saindo do sócio. Sócio começa a sair da operação mas ainda volta. Efeito caverna do dragão rondando.', recs: ['Formar os primeiros gerentes de projetos', 'Padronizar fluxos de entrega entre microagências', 'Criar cultura de documentação'] },
      { name: 'RENASCIMENTO', phrase: '"Roda sem o fundador no operacional"', desc: '3 camadas (operacional, gerencial, estratégica). Lideranças por área garantem o padrão. Sócios viraram diretoria. Cobrança via OKRs e KPIs.', recs: ['Implementar OKRs em todas as áreas', 'Investir em retenção de talentos', 'Formar líderes (não só liderar)'] },
      { name: 'NEO', phrase: '"A agência virou outra coisa"', desc: 'Time deixa de ter cargos de agência. Ganha funções que não existem em agência tradicional. A operação não é mais o produto — é uma engrenagem do que a empresa virou.', recs: ['Mapear quais funções vão sair do organograma de agência', 'Desenhar a estrutura da nova categoria', 'Considerar M&A, holding ou sucessão'] },
    ]
  },
  {
    id: 'digital', title: 'PRESENÇA DIGITAL', icon: '02',
    levels: [
      { name: 'PEDRA', phrase: '"Se não te acham, você não existe"', desc: 'Invisível. Ou só a cara de um dos sócios — cliente chega esperando o rosto e leva outro, frustra.', recs: ['Criar perfil profissional no Instagram', 'Definir frequência mínima de posts', 'Ativar Google Meu Negócio'] },
      { name: 'BOOM', phrase: '"Existe, mas ninguém nota"', desc: 'Redes ativas mas sem identidade. Conteúdo genérico. Site desatualizado ou inexistente.', recs: ['Criar calendário editorial', 'Definir pilares de conteúdo', 'Atualizar ou criar site'] },
      { name: 'INDUSTRIAL', phrase: '"Aparece, mas ainda não converte"', desc: 'Conteúdo constante. Primeiros cases postados. Falta funil de conversão claro.', recs: ['Criar lead magnets', 'Integrar CTA nos conteúdos', 'Testar tráfego pago pro perfil'] },
      { name: 'RENASCIMENTO', phrase: '"O mercado já sabe quem você é"', desc: 'Marca com voz própria. Gera leads orgânicos. Múltiplos canais integrados.', recs: ['Investir em vídeo/podcast', 'Criar comunidade', 'Escalar produção de conteúdo'] },
      { name: 'NEO', phrase: '"Define a conversa, não disputa atenção"', desc: 'A marca virou referência citada por IA. Pauta o nicho em vez de seguir tendência. Categoria própria de discurso.', recs: ['Otimizar para citação por IA (GEO)', 'Criar metodologia proprietária pública', 'Publicar manifesto/tese de mercado'] },
    ]
  },
  {
    id: 'posicionamento', title: 'POSICIONAMENTO & NICHO', icon: '03',
    levels: [
      { name: 'PEDRA', phrase: '"Atende qualquer um, não atrai ninguém"', desc: 'Aceita qualquer cliente que pague. Generalista total. Sem público definido.', recs: ['Mapear melhores clientes atuais', 'Identificar padrões de sucesso', 'Testar comunicação nichada'] },
      { name: 'BOOM', phrase: '"Sabe que precisa focar, mas tem medo"', desc: 'Muitos clientes ticket baixo. ICP confuso. Sem case-âncora. Posicionamento genérico.', recs: ['Escolher 2-3 verticais para testar', 'Criar cases específicos', 'Recusar clientes fora do perfil'] },
      { name: 'INDUSTRIAL', phrase: '"Escolheu uma direção — agora precisa provar"', desc: 'ICP definido. Primeiro case forte. Microagências por vertical.', recs: ['Criar conteúdo especializado', 'Refinar proposta de valor', 'Buscar clientes-referência'] },
      { name: 'RENASCIMENTO', phrase: '"O nicho te procura — não o contrário"', desc: 'Especialista reconhecido. Atende médias e multinacionais. Marca reflete o nicho.', recs: ['Aprofundar diferencial técnico', 'Criar thought leadership', 'Precificar como especialista'] },
      { name: 'NEO', phrase: '"Você definiu a categoria"', desc: 'Deixa de ser "agência do nicho" e vira categoria própria que o nicho passa a copiar. Concorrentes te imitam.', recs: ['Nomear publicamente a nova categoria', 'Licenciar ou franquear metodologia', 'Expandir para nichos adjacentes'] },
    ]
  },
  {
    id: 'carteira', title: 'CARTEIRA & SERVIÇOS', icon: '04',
    levels: [
      { name: 'PEDRA', phrase: '"Cada mês é uma incógnita"', desc: 'Poucos clientes empreendedores sem verba. Dependente de um ou dois. Serviços genéricos.', recs: ['Definir serviço-âncora', 'Criar proposta padronizada', 'Ativar prospecção mínima'] },
      { name: 'BOOM', phrase: '"Segura os pratos, mas qualquer um pode cair"', desc: '30 clientes ticket baixo. Scope creep frequente. Qualidade caindo. Precificação inconsistente.', recs: ['Padronizar escopos e contratos', 'Criar tabela de preços', 'Implementar onboarding'] },
      { name: 'INDUSTRIAL', phrase: '"Tem clientes bons — precisa de mais"', desc: 'Clientes médios com depto de marketing. Contratos estruturados. Mix bons e ruins.', recs: ['Classificar clientes (A/B/C)', 'Descontinuar serviços de baixa margem', 'Criar funil de vendas'] },
      { name: 'RENASCIMENTO', phrase: '"Vende com método, entrega com processo"', desc: 'Pipeline ativo. Motor comercial. OKRs por cliente. Boa retenção.', recs: ['Criar programa de indicação', 'Upsell para clientes A', 'Automatizar nutrição de leads'] },
      { name: 'NEO', phrase: '"Não vende mais serviço"', desc: 'Vende acesso, IP, produto e modelo de receita próprio. O serviço virou consequência do produto principal.', recs: ['Lançar produto digital ou SaaS', 'Criar modelo de equity ou royalties', 'Transformar metodologia em ativo licenciável'] },
    ]
  },
  {
    id: 'financeiro', title: 'FINANCEIRO & METAS', icon: '05',
    levels: [
      { name: 'PEDRA', phrase: '"Apaga incêndio todo mês"', desc: 'Propósito é pagar boleto. Sem controle financeiro. Pró-labore irregular. Custos desconhecidos.', recs: ['Montar planilha de fluxo de caixa', 'Definir custo fixo real', 'Separar contas PF e PJ'] },
      { name: 'BOOM', phrase: '"Paga as contas, mas não sobra"', desc: 'Usa capital de giro como investimento. Caixa apertado. Qualquer perda gera crise.', recs: ['Calcular margem por cliente', 'Reajustar contratos defasados', 'Criar reserva de 3 meses de operação'] },
      { name: 'INDUSTRIAL', phrase: '"Crescendo, mas sem clareza de pra onde"', desc: 'Assessoria financeira. DRE mensal. Primeiras margens reais. Falta clareza de lucratividade por serviço.', recs: ['Implementar dashboard financeiro', 'Definir meta de margem líquida', 'Auditar custos por área'] },
      { name: 'RENASCIMENTO', phrase: '"Números claros, decisões seguras"', desc: 'Saúde financeira. Gestão por OKRs. Lucro previsível. Pró-labore regular. Reserva sólida.', recs: ['Otimizar tributação', 'Investir lucro em crescimento', 'Criar plano de participação'] },
      { name: 'NEO', phrase: '"Receita não é mais só serviço"', desc: 'Sai de serviço e entra em produto digital, equity, royalties, múltiplas fontes. A agência virou um portfólio de receitas.', recs: ['Diversificar fontes de receita', 'Criar fundo de inovação', 'Planejar valuation e exit'] },
    ]
  },
];

const SAMPLE_DIAGNOSIS = {
  agencia: 'Agência Nova',
  nome: 'Ana Souza',
  data: '29 ABR 2026',
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
window.PHASE_NAMES = PHASE_NAMES;
window.DIMENSIONS = DIMENSIONS;
window.SAMPLE_DIAGNOSIS = SAMPLE_DIAGNOSIS;
