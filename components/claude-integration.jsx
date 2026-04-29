/* ── KOKO Diagnóstico — Claude AI Integration ── */
/* Analyzes form responses and generates diagnosis levels */

const { useState, useCallback } = React;

/* ── Prompt builder: creates the analysis prompt from form data ── */
function buildDiagnosisPrompt(formData) {
  return `Você é um consultor especialista em agências de marketing digital. Analise as respostas do formulário de diagnóstico abaixo e classifique a agência em 5 dimensões, cada uma com um nível de 0 a 4.

DIMENSÕES E NÍVEIS:

1. PERFIL & ESTRUTURA (0-4):
   0 = Freelancer Disfarçado — opera sozinho, sem processos
   1 = Estrutura Embrionária — equipe pequena, liderança centraliza
   2 = Máquina em Construção — equipe funcional, processos inconsistentes
   3 = Operação Sólida — equipe autônoma, processos claros
   4 = Máquina de Guerra — estrutura madura, pronta para escalar

2. PRESENÇA DIGITAL (0-4):
   0 = Invisível — sem presença online relevante
   1 = Fantasma Digital — redes sem constância, sem identidade
   2 = Presença Construída — conteúdo constante, falta conversão
   3 = Autoridade em Ascensão — boa audiência, gera leads
   4 = Referência do Nicho — marca forte, leads orgânicos constantes

3. POSICIONAMENTO & NICHO (0-4):
   0 = Atirador Cego — generalista total, sem público definido
   1 = Generalista Inquieto — sabe que precisa focar, mas aceita tudo
   2 = Nicho em Teste — direção escolhida, comunicação em ajuste
   3 = Especialista Reconhecido — posicionamento claro, clientes ideais chegam
   4 = Dono do Território — referência absoluta no nicho

4. CARTEIRA & SERVIÇOS (0-4):
   0 = Sobrevivente — poucos clientes, alta dependência
   1 = Equilibrista — carteira frágil, scope creep, preço inconsistente
   2 = Carteira em Formação — mix de clientes, margem variável
   3 = Motor Comercial — pipeline ativo, boa retenção
   4 = Portfólio Premium — carteira selecionada, tickets altos

5. FINANCEIRO & METAS (0-4):
   0 = No Vermelho — sem controle, pró-labore irregular
   1 = Caixa Apertado — paga contas, sem margem
   2 = Equilíbrio Frágil — faturamento razoável, falta clareza
   3 = Saúde Financeira — controle sólido, margem saudável
   4 = Máquina de Lucro — alta lucratividade, investimentos estratégicos

RESPOSTAS DO FORMULÁRIO:
${JSON.stringify(formData, null, 2)}

RESPONDA APENAS com um JSON válido neste formato exato, sem texto adicional:
{"levels":[N,N,N,N,N],"resumo":"Uma frase resumindo o momento da agência"}

Onde cada N é um número de 0 a 4 para cada dimensão na ordem acima.`;
}

/* ── Generate diagnosis using Claude (via Vercel Edge Function) ── */
async function generateDiagnosis(formData) {
  const prompt = buildDiagnosisPrompt(formData);

  try {
    const r = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!r.ok) {
      const errBody = await r.text();
      throw new Error(`API ${r.status}: ${errBody.slice(0, 200)}`);
    }
    const { text } = await r.json();
    const response = text;

    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Resposta inválida da IA');

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.levels || parsed.levels.length !== 5) {
      throw new Error('Formato de resposta inválido');
    }

    // Validate levels are 0-4
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

/* ── Demo form data for testing ── */
const DEMO_FORM_DATA = {
  nome_completo: "Ana Souza",
  nome_agencia: "Agência Nova",
  email: "ana@agencianova.com",
  papel: "Sócio-fundador",
  tempo_agencia: "1–3 anos",
  tamanho_equipe: "2–5",
  modelo_operacao: "Remota",
  historia: "Comecei como freelancer de social media há 2 anos. Fui crescendo e trouxe mais 2 pessoas pra equipe. Atendemos principalmente pequenos e-commerces, mas aceitamos qualquer cliente que aparece. Estamos num momento de querer profissionalizar mas sem saber por onde começar.",
  ig_seguidores: "3200",
  ig_engajamento: "Parcialmente",
  ig_gera_leads: "Raramente",
  ig_constancia: "Às vezes",
  tem_site: "Sim, desatualizado",
  nicho_tipo: "Está em transição",
  cliente_ideal: "E-commerces de moda com faturamento acima de 50k/mês",
  diferencial: "Agilidade e proximidade com o cliente",
  comunicacao_reflete: "Parcialmente",
  servicos: ["Gestão de redes sociais", "Tráfego pago", "Criação de conteúdo"],
  servico_mais_vendido: "Gestão de redes sociais",
  ticket_medio: "R$ 2.001–5.000",
  clientes_ativos: "8",
  fonte_clientes: ["Indicação"],
  desafio_carteira: "Clientes fora do perfil ideal",
  precifica_corretamente: "Não, cobro pouco",
  faturamento_12m: "R$ 180.000",
  meta_faturamento: "R$ 360.000",
  saude_financeira: "Parcialmente",
  pro_labore: "Às vezes",
  clareza_margem: "Não",
  objetivo_principal: "Dobrar faturamento e conseguir atender só clientes do perfil ideal",
};

/* ── AI Diagnosis Generator Panel ── */
function DiagnosisGenerator({ onDiagnosisReady, preloadedData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formInput, setFormInput] = useState(preloadedData ? JSON.stringify(preloadedData, null, 2) : '');
  const [useDemo, setUseDemo] = useState(!preloadedData);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let formData;
      if (preloadedData) {
        formData = preloadedData;
      } else if (useDemo) {
        formData = DEMO_FORM_DATA;
      } else {
        try {
          formData = JSON.parse(formInput);
        } catch {
          setError('JSON inválido. Cole os dados do formulário em formato JSON.');
          setLoading(false);
          return;
        }
      }

      const result = await generateDiagnosis(formData);

      if (result.success) {
        onDiagnosisReady({
          agencia: formData.nome_agencia || 'Agência',
          nome: formData.nome_completo || 'Mentorado',
          data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
          cards: result.cards,
          resumo: result.resumo,
        });
      } else {
        setError(result.error || 'Erro desconhecido');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [useDemo, formInput, onDiagnosisReady]);

  return (
    <div style={{
      border: '4px solid #0A0A0A',
      boxShadow: '6px 6px 0 #0A0A0A',
      background: '#FFF9D5',
      maxWidth: 600, width: '100%',
    }}>
      {/* Title bar */}
      <div style={{
        background: '#0A0A0A', padding: '8px 12px',
        borderBottom: '3px solid #0A0A0A',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{
          fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
          fontSize: 11, color: '#FFF9D5',
        }}>GERADOR DE DIAGNÓSTICO</span>
        <span style={{
          fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
          fontSize: 9, color: '#ED028A',
        }}>IA</span>
      </div>

      <div style={{ padding: 20 }}>
        {/* Source toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button onClick={() => setUseDemo(true)} style={{
            flex: 1, padding: '10px',
            background: useDemo ? '#ED028A' : '#FFF9D5',
            color: useDemo ? '#FFF9D5' : '#0A0A0A',
            border: '3px solid #0A0A0A',
            fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            boxShadow: useDemo ? 'none' : '3px 3px 0 #0A0A0A',
          }}>DADOS DE EXEMPLO</button>
          <button onClick={() => setUseDemo(false)} style={{
            flex: 1, padding: '10px',
            background: !useDemo ? '#ED028A' : '#FFF9D5',
            color: !useDemo ? '#FFF9D5' : '#0A0A0A',
            border: '3px solid #0A0A0A',
            fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            boxShadow: !useDemo ? 'none' : '3px 3px 0 #0A0A0A',
          }}>COLAR JSON DO FORM</button>
        </div>

        {/* JSON input (when not demo) */}
        {!useDemo && (
          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
              fontSize: 9, color: '#0A0A0A', display: 'block', marginBottom: 6,
            }}>COLE O JSON DAS RESPOSTAS DO SUPABASE:</label>
            <textarea
              value={formInput}
              onChange={e => setFormInput(e.target.value)}
              rows={8}
              style={{
                width: '100%',
                background: '#0A0A0A', color: '#FFF9D5',
                border: '3px solid #0A0A0A',
                fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
                fontSize: 11, padding: 12, resize: 'vertical',
              }}
              placeholder='{"nome_completo":"...","nome_agencia":"...",...}'
            />
          </div>
        )}

        {useDemo && (
          <div style={{
            background: '#0A0A0A', padding: 12, marginBottom: 16,
          }}>
            <div style={{
              fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
              fontSize: 9, color: '#ED028A', marginBottom: 6,
            }}>DADOS DE EXEMPLO:</div>
            <div style={{
              fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
              fontSize: 13, color: '#FFF9D5', lineHeight: 1.5,
            }}>
              <strong>{DEMO_FORM_DATA.nome_agencia}</strong> — {DEMO_FORM_DATA.nome_completo}<br />
              {DEMO_FORM_DATA.tempo_agencia} • Equipe: {DEMO_FORM_DATA.tamanho_equipe} • {DEMO_FORM_DATA.modelo_operacao}<br />
              Ticket: {DEMO_FORM_DATA.ticket_medio} • {DEMO_FORM_DATA.clientes_ativos} clientes
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: '#ED028A', padding: '8px 12px', marginBottom: 12,
          }}>
            <span style={{
              fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
              fontSize: 13, color: '#FFF9D5',
            }}>{error}</span>
          </div>
        )}

        {/* Generate button */}
        <button onClick={handleGenerate} disabled={loading} style={{
          width: '100%', padding: '14px',
          background: loading ? '#888' : '#013B26',
          color: '#FFF9D5',
          border: '3px solid #0A0A0A',
          boxShadow: '4px 4px 0 #0A0A0A',
          fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
          fontSize: 24, cursor: loading ? 'wait' : 'pointer',
          transition: 'transform 0.15s',
        }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translate(-2px,-2px)'; }}
          onMouseLeave={e => e.currentTarget.style.transform = 'translate(0,0)'}
        >
          {loading ? 'ANALISANDO COM IA...' : 'GERAR DIAGNÓSTICO'}
        </button>

        <div style={{
          fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
          fontSize: 8, color: '#0A0A0A', opacity: 0.4,
          marginTop: 8, textAlign: 'center',
        }}>POWERED BY CLAUDE • AJUSTE MANUAL PELO MENTOR RECOMENDADO</div>
      </div>
    </div>
  );
}

window.DiagnosisGenerator = DiagnosisGenerator;
window.generateDiagnosis = generateDiagnosis;
window.DEMO_FORM_DATA = DEMO_FORM_DATA;
