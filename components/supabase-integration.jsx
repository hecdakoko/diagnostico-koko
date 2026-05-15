/* ── KOKO Diagnóstico — Supabase Integration via Edge Function ── */
/* Backend: Edge Function no Supabase (novo projeto) */

const { useState, useEffect, useCallback } = React;

/* ── Config ── */
const EDGE_FN_URL = 'https://uocuohxpbgailvgjkzsm.supabase.co/functions/v1/get-diagnosticos';
const ACCESS_TOKEN = 'diag_7321fce205ef4e1a6a1eaa0a5d22601a075333bca6b4762a';

const edgeHeaders = {
  'x-access-token': ACCESS_TOKEN,
};

/* ── Fetch all diagnostics (lista resumida) ── */
/* Retorna: id, nome, nome_agencia, email, created_at, finalizado, secao_atual */
async function fetchDiagnostics() {
  const res = await fetch(EDGE_FN_URL, { headers: edgeHeaders });
  if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
  return res.json();
}

/* ── Fetch single record by ID (completo) ── */
/* Retorna: tudo acima + form_data (respostas) + diagnostico_resultado (pode ser null) */
async function fetchDiagnosticById(id) {
  const res = await fetch(`${EDGE_FN_URL}?id=${id}`, { headers: edgeHeaders });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

/* ── Save diagnosis result via PATCH ── */
async function saveDiagnosisResult(recordId, levels, resumo, swotData) {
  const payload = { levels, resumo, updated_at: new Date().toISOString() };
  if (swotData) payload.swot = swotData;
  const res = await fetch(`${EDGE_FN_URL}?id=${recordId}`, {
    method: 'PATCH',
    headers: { ...edgeHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ diagnostico_resultado: payload }),
  });
  return res.ok;
}

/* ── Build shareable link from record ID ── */
function getRecordLink(recordId) {
  const base = window.location.href.split('?')[0].split('#')[0];
  return `${base}?id=${recordId}`;
}

/* ── Copy to clipboard (iframe-safe fallback) ── */
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
  }
  return Promise.resolve(fallbackCopy(text));
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand('copy'); document.body.removeChild(ta); return true; }
  catch { document.body.removeChild(ta); return false; }
}

/* ── Supabase Panel — auto-conecta na abertura ── */
function SupabasePanel({ onSelectRecord }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDiagnostics();
      /* Ordena por data: mais recente primeiro */
      const sorted = Array.isArray(data)
        ? data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        : [];
      setRecords(sorted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /* Auto-conecta ao montar + polling a cada 30s */
  useEffect(() => {
    loadRecords();
    const interval = setInterval(loadRecords, 30000);
    return () => clearInterval(interval);
  }, []);

  /* Ao clicar num registro, busca o registro completo (com form_data) */
  const handleSelect = useCallback(async (rec) => {
    setLoadingId(rec.id);
    try {
      const fullRecord = await fetchDiagnosticById(rec.id);
      onSelectRecord(fullRecord);
    } catch (err) {
      /* Fallback: passa o resumo mesmo */
      onSelectRecord(rec);
    } finally {
      setLoadingId(null);
    }
  }, [onSelectRecord]);

  /* Estado: carregando lista inicial */
  if (loading) {
    return (
      <div style={{
        border: '4px solid #0A0A0A', boxShadow: '6px 6px 0 #0A0A0A',
        background: '#FFF9D5', maxWidth: 700, width: '100%', padding: 24, textAlign: 'center',
      }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 24, color: '#0A0A0A' }}>
          CONECTANDO...
        </span>
      </div>
    );
  }

  /* Estado: erro de conexão */
  if (error) {
    return (
      <div style={{
        border: '4px solid #0A0A0A', boxShadow: '6px 6px 0 #0A0A0A',
        background: '#FFF9D5', maxWidth: 700, width: '100%', padding: 20,
      }}>
        <div style={{ background: '#ED028A', padding: '8px 12px', marginBottom: 12 }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: '#FFF9D5' }}>{error}</span>
        </div>
        <button onClick={loadRecords} style={{
          background: '#013B26', color: '#FFF9D5',
          border: '3px solid #0A0A0A', padding: '10px 20px',
          fontFamily: "var(--font-display)", fontSize: 20, cursor: 'pointer',
        }}>TENTAR NOVAMENTE</button>
      </div>
    );
  }

  /* Estado: lista de formulários */
  return (
    <div style={{
      border: '4px solid #0A0A0A', boxShadow: '6px 6px 0 #0A0A0A',
      background: '#FFF9D5', maxWidth: 700, width: '100%',
    }}>
      {/* Header */}
      <div style={{
        background: '#013B26', padding: '8px 12px',
        borderBottom: '3px solid #0A0A0A',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: "var(--font-pixel)", fontSize: 11, color: '#FFF9D5' }}>
          FORMULÁRIOS RECEBIDOS ({records.length})
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontFamily: "var(--font-pixel)", fontSize: 9, color: '#42A947' }}>● CONECTADO</span>
          <button onClick={loadRecords} style={{
            background: '#FFF9D5', border: '2px solid #0A0A0A',
            padding: '2px 6px', cursor: 'pointer',
            fontFamily: "var(--font-pixel)", fontSize: 8, color: '#0A0A0A',
          }}>ATUALIZAR</button>
        </div>
      </div>

      {/* Lista */}
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        {records.length === 0 ? (
          <div style={{
            padding: 24, textAlign: 'center',
            fontFamily: "var(--font-body)", fontSize: 14, color: '#0A0A0A', opacity: 0.5,
          }}>Nenhum formulário encontrado</div>
        ) : (
          records.map((rec) => {
            const hasResult = rec.diagnostico_resultado && rec.diagnostico_resultado.levels;
            const isLoading = loadingId === rec.id;
            return (
              <div key={rec.id} onClick={() => !isLoading && handleSelect(rec)}
                style={{
                  padding: '14px 16px', borderBottom: '2px solid #0A0A0A',
                  cursor: isLoading ? 'wait' : 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'background 0.1s',
                  opacity: isLoading ? 0.6 : 1,
                }}
                onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = '#F0ECC0'; }}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: '#0A0A0A', lineHeight: 1 }}>
                    {rec.nome_agencia || rec.nome || 'Sem nome'}
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: '#0A0A0A', opacity: 0.6, marginTop: 2 }}>
                    {rec.nome} {rec.email ? `• ${rec.email}` : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: "var(--font-pixel)", fontSize: 9, color: '#0A0A0A', opacity: 0.4 }}>
                    {new Date(rec.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  {hasResult && (
                    <div style={{ background: '#7807F7', padding: '2px 8px', border: '2px solid #0A0A0A' }}>
                      <span style={{ fontFamily: "var(--font-pixel)", fontSize: 8, color: '#FFF9D5' }}>DIAGNOSTICADO</span>
                    </div>
                  )}
                  <div style={{
                    background: rec.finalizado ? '#42A947' : '#F7ED07',
                    padding: '2px 8px', border: '2px solid #0A0A0A',
                  }}>
                    <span style={{ fontFamily: "var(--font-pixel)", fontSize: 8, color: '#0A0A0A' }}>
                      {rec.finalizado ? 'COMPLETO' : 'PARCIAL'}
                    </span>
                  </div>
                  {isLoading ? (
                    <span style={{ fontFamily: "var(--font-pixel)", fontSize: 10, color: '#ED028A' }}>...</span>
                  ) : (
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: '#0A0A0A' }}>→</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

window.SupabasePanel = SupabasePanel;
window.fetchDiagnostics = fetchDiagnostics;
window.fetchDiagnosticById = fetchDiagnosticById;
window.saveDiagnosisResult = saveDiagnosisResult;
window.getRecordLink = getRecordLink;
window.copyToClipboard = copyToClipboard;
