/* ── KOKO Diagnóstico — Supabase Integration ── */
/* Fetches form responses directly from diagnostico_mentoria table */

const { useState, useEffect, useCallback } = React;

/* ── Supabase config — UPDATE THESE VALUES ── */
const SUPABASE_CONFIG = {
  url: 'https://xylcurdjofirjsqfkafa.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5bGN1cmRqb2ZpcmpzcWZrYWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MjUxMDIsImV4cCI6MjA4NjQwMTEwMn0.-fGMCNfsjYn_53XXaI0mwk5cNbHXvZUCEeyBOQbd_Sw',
};

/* ── Fetch all diagnostics from Supabase ── */
async function fetchDiagnostics(url, key) {
  const response = await fetch(
    `${url}/rest/v1/diagnostico_mentoria?select=*&order=created_at.desc`,
    {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/* ── Supabase Connection Panel ── */
function SupabasePanel({ onSelectRecord }) {
  const [url, setUrl] = useState(localStorage.getItem('koko_sb_url') || SUPABASE_CONFIG.url);
  const [key, setKey] = useState(localStorage.getItem('koko_sb_key') || SUPABASE_CONFIG.anonKey);
  const [connected, setConnected] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConnect = useCallback(async () => {
    if (!url || !key) {
      setError('Preencha a URL e Anon Key do Supabase');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDiagnostics(url, key);
      setRecords(data);
      setConnected(true);
      localStorage.setItem('koko_sb_url', url);
      localStorage.setItem('koko_sb_key', key);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, key]);

  // Auto-connect if we have saved credentials
  useEffect(() => {
    if (url && key && !connected) {
      handleConnect();
    }
  }, []);

  if (!connected) {
    return (
      <div style={{
        border: '4px solid #0A0A0A',
        boxShadow: '6px 6px 0 #0A0A0A',
        background: '#FFF9D5',
        maxWidth: 500, width: '100%',
      }}>
        <div style={{
          background: '#013B26', padding: '8px 12px',
          borderBottom: '3px solid #0A0A0A',
        }}>
          <span style={{
            fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
            fontSize: 11, color: '#FFF9D5',
          }}>CONECTAR AO SUPABASE</span>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{
              fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
              fontSize: 9, color: '#0A0A0A', display: 'block', marginBottom: 4,
            }}>SUPABASE URL:</label>
            <input value={url} onChange={e => setUrl(e.target.value.trim())}
              placeholder="https://xxxxx.supabase.co"
              style={{
                width: '100%', padding: '10px 12px',
                background: '#0A0A0A', color: '#FFF9D5',
                border: '3px solid #0A0A0A',
                fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
                fontSize: 11,
              }}
            />
          </div>
          <div>
            <label style={{
              fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
              fontSize: 9, color: '#0A0A0A', display: 'block', marginBottom: 4,
            }}>ANON KEY:</label>
            <input value={key} onChange={e => setKey(e.target.value.trim())}
              type="password"
              placeholder="eyJhbGci..."
              style={{
                width: '100%', padding: '10px 12px',
                background: '#0A0A0A', color: '#FFF9D5',
                border: '3px solid #0A0A0A',
                fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
                fontSize: 11,
              }}
            />
          </div>

          {error && (
            <div style={{ background: '#ED028A', padding: '8px 12px' }}>
              <span style={{
                fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
                fontSize: 12, color: '#FFF9D5',
              }}>{error}</span>
            </div>
          )}

          <button onClick={handleConnect} disabled={loading} style={{
            width: '100%', padding: '12px',
            background: loading ? '#888' : '#013B26',
            color: '#FFF9D5',
            border: '3px solid #0A0A0A',
            boxShadow: '4px 4px 0 #0A0A0A',
            fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
            fontSize: 22, cursor: loading ? 'wait' : 'pointer',
          }}>{loading ? 'CONECTANDO...' : 'CONECTAR'}</button>
        </div>
      </div>
    );
  }

  /* ── Record list ── */
  return (
    <div style={{
      border: '4px solid #0A0A0A',
      boxShadow: '6px 6px 0 #0A0A0A',
      background: '#FFF9D5',
      maxWidth: 700, width: '100%',
    }}>
      <div style={{
        background: '#013B26', padding: '8px 12px',
        borderBottom: '3px solid #0A0A0A',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{
          fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
          fontSize: 11, color: '#FFF9D5',
        }}>FORMULÁRIOS RECEBIDOS</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{
            fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
            fontSize: 9, color: '#42A947',
          }}>● CONECTADO</span>
          <button onClick={() => { setConnected(false); localStorage.removeItem('koko_sb_url'); localStorage.removeItem('koko_sb_key'); }} style={{
            background: '#FFF9D5', border: '2px solid #0A0A0A',
            padding: '2px 6px', cursor: 'pointer',
            fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
            fontSize: 8, color: '#0A0A0A',
          }}>DESCONECTAR</button>
          <button onClick={handleConnect} style={{
            background: '#FFF9D5', border: '2px solid #0A0A0A',
            padding: '2px 6px', cursor: 'pointer',
            fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
            fontSize: 8, color: '#0A0A0A',
          }}>ATUALIZAR</button>
        </div>
      </div>

      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        {records.length === 0 ? (
          <div style={{
            padding: 24, textAlign: 'center',
            fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
            fontSize: 14, color: '#0A0A0A', opacity: 0.5,
          }}>Nenhum formulário encontrado</div>
        ) : (
          records.map((rec, i) => (
            <div key={rec.id} onClick={() => onSelectRecord(rec)}
              style={{
                padding: '14px 16px',
                borderBottom: '2px solid #0A0A0A',
                cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F0ECC0'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div>
                <div style={{
                  fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                  fontSize: 22, color: '#0A0A0A', lineHeight: 1,
                }}>{rec.nome_agencia || rec.nome || 'Sem nome'}</div>
                <div style={{
                  fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
                  fontSize: 12, color: '#0A0A0A', opacity: 0.6, marginTop: 2,
                }}>
                  {rec.nome} {rec.email ? `• ${rec.email}` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
                  fontSize: 9, color: '#0A0A0A', opacity: 0.4,
                }}>{new Date(rec.created_at).toLocaleDateString('pt-BR')}</span>
                <div style={{
                  background: rec.finalizado ? '#42A947' : '#F7ED07',
                  padding: '2px 8px',
                  border: '2px solid #0A0A0A',
                }}>
                  <span style={{
                    fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
                    fontSize: 8, color: '#0A0A0A',
                  }}>{rec.finalizado ? 'COMPLETO' : 'PARCIAL'}</span>
                </div>
                <span style={{
                  fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
                  fontSize: 12, fontWeight: 700, color: '#0A0A0A',
                }}>→</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

window.SupabasePanel = SupabasePanel;
window.fetchDiagnostics = fetchDiagnostics;
