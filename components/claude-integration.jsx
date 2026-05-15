/* ── KOKO Diagnóstico — Claude AI Integration v2 ── */
/* Generates diagnosis levels + McKinsey-style SWOT from real form data */

const { useState, useCallback } = React;

/* ── Prompt: classify agency into 5 dimensions ── */
function buildDiagnosisPrompt(formData) {
  return `Você é um consultor especialista em agências de marketing digital. Analise as respostas do formulário de diagnóstico abaixo e classifique a agência em 5 dimensões, cada uma com um nível de 0 a 4.

AS 5 FASES DA KOKO (framework universal — mesmos nomes em todas as dimensões):

0 = PEDRA — você sobrevive. Sócio faz tudo, sem padrão.
1 = BOOM — você apaga incêndio. Inflamação operacional, agência incha em vez de crescer.
2 = INDUSTRIAL — você processa. Microagências, sair da operação.
3 = RENASCIMENTO — você lidera. 3 camadas, OKRs, processos.
4 = NEO — você redefine a categoria. Espécie nova que o mercado ainda não nomeou. IP próprio, produto, formato de oferta que não existia antes.

COMO CLASSIFICAR POR DIMENSÃO:

1. PERFIL & ESTRUTURA:
   PEDRA = sócio faz tudo, sem padrão de entrega
   BOOM = equipe júnior, sem feedback, inflamação operacional
   INDUSTRIAL = microagências formadas, primeiros gerentes
   RENASCIMENTO = 3 camadas, OKRs, sócios viraram diretoria
   NEO = cargos que não existem em agência, operação virou engrenagem

2. PRESENÇA DIGITAL:
   PEDRA = invisível ou só a cara do sócio
   BOOM = redes sem identidade, conteúdo genérico
   INDUSTRIAL = conteúdo constante, primeiros cases, sem funil
   RENASCIMENTO = marca com voz, leads orgânicos, canais integrados
   NEO = referência citada por IA, pauta o nicho, categoria de discurso

3. POSICIONAMENTO & NICHO:
   PEDRA = aceita qualquer cliente, generalista total
   BOOM = muitos clientes ticket baixo, ICP confuso
   INDUSTRIAL = ICP definido, primeiro case forte
   RENASCIMENTO = especialista reconhecido, nicho te procura
   NEO = criou categoria própria, concorrentes imitam

4. CARTEIRA & SERVIÇOS:
   PEDRA = poucos clientes, dependência, serviços genéricos
   BOOM = 30 clientes ticket baixo, scope creep, qualidade caindo
   INDUSTRIAL = clientes médios, contratos estruturados
   RENASCIMENTO = pipeline ativo, motor comercial, OKRs por cliente
   NEO = vende acesso/IP/produto, serviço é consequência

5. FINANCEIRO & METAS:
   PEDRA = propósito é pagar boleto, sem controle
   BOOM = capital de giro como investimento, caixa apertado
   INDUSTRIAL = assessoria financeira, DRE, primeiras margens
   RENASCIMENTO = saúde financeira, OKRs, lucro previsível
   NEO = múltiplas fontes de receita, produto/equity/royalties

RESPOSTAS DO FORMULÁRIO:
${JSON.stringify(formData, null, 2)}

RESPONDA APENAS com um JSON válido neste formato exato, sem texto adicional:
{"levels":[N,N,N,N,N],"resumo":"Uma frase resumindo o momento da agência usando o vocabulário das Fases da Koko"}

Onde cada N é um número de 0 a 4 para cada dimensão na ordem acima.`;
}

/* ── Generate diagnosis using Claude ── */
async function generateDiagnosis(formData) {
  const prompt = buildDiagnosisPrompt(formData);
  try {
    const response = await window.claude.complete(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Resposta inválida da IA');
    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.levels || parsed.levels.length !== 5) throw new Error('Formato inválido');
    const validLevels = parsed.levels.map(l => Math.max(0, Math.min(4, Math.round(Number(l)))));
    return {
      success: true,
      cards: validLevels.map((level, i) => ({ dimIndex: i, level })),
      resumo: parsed.resumo || '',
    };
  } catch (err) {
    console.error('Erro ao gerar diagnóstico:', err);
    return { success: false, error: err.message };
  }
}

/* ── Prompt: McKinsey SWOT from form data + diagnosed levels ── */
function buildSWOTPrompt(formData, levels) {
  const dimNames = ['Perfil & Estrutura', 'Presença Digital', 'Posicionamento & Nicho', 'Carteira & Serviços', 'Financeiro & Metas'];
  const phaseNames = ['PEDRA', 'BOOM', 'INDUSTRIAL', 'RENASCIMENTO', 'NEO'];
  const summary = levels.map((l, i) => `${dimNames[i]}: ${phaseNames[l]} (${l+1}/5)`).join('\n');

  return `Consultor sênior McKinsey analisando agência de marketing digital brasileira. Gere SWOT PERSONALIZADA com dados concretos das respostas.

REGRAS:
- Cite NÚMEROS reais das respostas (faturamento, ticket, equipe, seguidores)
- Cada item = 1-2 frases específicas para ESTA agência, sem genéricos
- Forças: vantagens competitivas reais que existem hoje
- Fraquezas: gaps evidentes nos dados
- Oportunidades: ações concretas com potencial de impacto
- Ameaças: riscos reais e urgentes
- Momento: síntese executiva 2-3 frases
- Ações: 3 prioridades mais impactantes para próximos 90 dias
- Benchmarks: referências de mercado para agências neste nível

DIAGNÓSTICO:
${summary}

DADOS:
${JSON.stringify(formData, null, 2)}

JSON puro:
{"forcas":["F1","F2","F3"],"fraquezas":["Fr1","Fr2","Fr3"],"oportunidades":["O1","O2","O3"],"ameacas":["A1","A2","A3"],"momento":"...","acoes":["1","2","3"],"benchmarks":{"faturamento_ref":"R$ X-Y/mês típico neste nível","equipe_ref":"N-M pessoas","ticket_ref":"R$ X-Y"}}`;
}

/* ── Generate SWOT analysis ── */
async function generateSWOTAnalysis(formData, levels) {
  const prompt = buildSWOTPrompt(formData, levels);
  try {
    const response = await window.claude.complete(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Resposta SWOT inválida');
    return { success: true, data: JSON.parse(jsonMatch[0]) };
  } catch (err) {
    console.error('Erro SWOT:', err);
    return { success: false, error: err.message };
  }
}

/* ── Quick preview of form data (for generate screen) ── */
function FormDataPreview({ data }) {
  if (!data) return null;
  const fields = [
    { label: 'Agência', value: data.nome_agencia },
    { label: 'Responsável', value: data.nome_completo || data.nome },
    { label: 'Email', value: data.email },
    { label: 'Equipe', value: data.tamanho_equipe },
    { label: 'Tempo', value: data.tempo_agencia },
    { label: 'Ticket', value: data.ticket_medio },
    { label: 'Clientes', value: data.clientes_ativos },
    { label: 'Faturamento', value: data.faturamento_12m },
    { label: 'Meta', value: data.meta_faturamento },
  ].filter(f => f.value);

  return (
    <div style={{ background: '#0A0A0A', padding: 12, marginBottom: 16 }}>
      <div style={{ fontFamily: "var(--font-pixel)", fontSize: 9, color: '#42A947', marginBottom: 8 }}>
        DADOS DO FORMULÁRIO
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px' }}>
        {fields.map((f, i) => (
          <React.Fragment key={i}>
            <span style={{ fontFamily: "var(--font-pixel)", fontSize: 8, color: '#FFF9D5', opacity: 0.5 }}>{f.label}</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: '#FFF9D5' }}>
              {Array.isArray(f.value) ? f.value.join(', ') : String(f.value)}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ── DiagnosisGenerator — simplified, Supabase-only ── */
function DiagnosisGenerator({ onDiagnosisReady, preloadedData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = useCallback(async () => {
    if (!preloadedData) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateDiagnosis(preloadedData);
      if (result.success) {
        onDiagnosisReady({
          agencia: preloadedData.nome_agencia || preloadedData.nome_completo || 'Agência',
          nome: preloadedData.nome_completo || preloadedData.nome || 'Mentorado',
          data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
          cards: result.cards,
          resumo: result.resumo,
          formData: preloadedData,
        });
      } else {
        setError(result.error || 'Erro desconhecido');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [preloadedData, onDiagnosisReady]);

  return (
    <div style={{
      border: '4px solid #0A0A0A', boxShadow: '6px 6px 0 #0A0A0A',
      background: '#FFF9D5', maxWidth: 600, width: '100%',
    }}>
      <div style={{
        background: '#0A0A0A', padding: '8px 12px',
        borderBottom: '3px solid #0A0A0A',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: "var(--font-pixel)", fontSize: 11, color: '#FFF9D5' }}>GERADOR DE DIAGNÓSTICO</span>
        <span style={{ fontFamily: "var(--font-pixel)", fontSize: 9, color: '#ED028A' }}>IA</span>
      </div>
      <div style={{ padding: 20 }}>
        <FormDataPreview data={preloadedData} />
        {error && (
          <div style={{ background: '#ED028A', padding: '8px 12px', marginBottom: 12 }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: '#FFF9D5' }}>{error}</span>
          </div>
        )}
        <button onClick={handleGenerate} disabled={loading || !preloadedData} style={{
          width: '100%', padding: '14px',
          background: loading ? '#888' : '#013B26', color: '#FFF9D5',
          border: '3px solid #0A0A0A', boxShadow: '4px 4px 0 #0A0A0A',
          fontFamily: "var(--font-display)", fontSize: 24,
          cursor: loading ? 'wait' : 'pointer', transition: 'transform 0.15s',
        }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translate(-2px,-2px)'; }}
          onMouseLeave={e => e.currentTarget.style.transform = 'translate(0,0)'}
        >
          {loading ? 'ANALISANDO COM IA...' : 'GERAR DIAGNÓSTICO'}
        </button>
        <div style={{
          fontFamily: "var(--font-pixel)", fontSize: 8, color: '#0A0A0A',
          opacity: 0.4, marginTop: 8, textAlign: 'center',
        }}>POWERED BY CLAUDE • AJUSTE MANUAL PELO MENTOR RECOMENDADO</div>
      </div>
    </div>
  );
}

window.DiagnosisGenerator = DiagnosisGenerator;
window.FormDataPreview = FormDataPreview;
window.generateDiagnosis = generateDiagnosis;
window.generateSWOTAnalysis = generateSWOTAnalysis;
