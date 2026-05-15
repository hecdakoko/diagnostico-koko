/* ── KOKO SWOT Matrix — AI-Powered + Editable + Cross-SWOT ── */

const { useState, useEffect, useRef, useCallback } = React;

/* ── Fallback: auto-generate from levels when no AI data ── */
function generateAutoSWOT(cards) {
  const forcas = [], fraquezas = [], oportunidades = [], ameacas = [];
  cards.forEach(card => {
    const dim = DIMENSIONS[card.dimIndex];
    const lv = dim.levels[card.level];
    if (card.level >= 3) forcas.push(`${dim.title}: ${lv.phrase} — base sólida nesta dimensão`);
    if (card.level <= 1) fraquezas.push(`${dim.title}: ${lv.phrase} — gap que limita crescimento`);
    if (card.level < 4) {
      const next = dim.levels[Math.min(card.level + 1, 4)];
      oportunidades.push(`${dim.title}: avançar para "${next.name}" com ações focadas`);
    }
    if (card.level <= 2) ameacas.push(`${dim.title}: nível ${card.level+1}/5 deixa a agência vulnerável`);
  });
  return { forcas, fraquezas, oportunidades, ameacas };
}

/* ── Editable Item ── */
function SWOTItem({ text, onUpdate, onRemove, textColor }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  useEffect(() => { setValue(text); }, [text]);
  useEffect(() => { if (editing && ref.current) { ref.current.focus(); ref.current.select(); } }, [editing]);

  const save = () => {
    setEditing(false);
    if (value.trim() && value !== text) onUpdate(value.trim());
    if (!value.trim()) onRemove();
  };

  if (editing) {
    return (
      <div style={{ background: 'rgba(255,249,213,0.18)', padding: '6px 10px', border: '2px solid rgba(255,249,213,0.5)' }}>
        <textarea ref={ref} value={value} onChange={e => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); save(); } }}
          style={{
            width: '100%', background: 'transparent', border: 'none', color: textColor,
            fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.4,
            resize: 'none', outline: 'none', minHeight: 36,
          }}
        />
      </div>
    );
  }

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => setEditing(true)}
      style={{
        background: 'rgba(255,249,213,0.08)', padding: '8px 12px',
        border: '1px solid rgba(255,249,213,0.15)',
        cursor: 'pointer', position: 'relative',
        display: 'flex', alignItems: 'flex-start', gap: 8,
        transition: 'background 0.1s',
      }}
    >
      <span style={{ fontFamily: "var(--font-pixel)", fontSize: 9, color: textColor, marginTop: 3, flexShrink: 0, opacity: 0.6 }}>›</span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: textColor, lineHeight: 1.4, flex: 1 }}>{text}</span>
      {hovered && (
        <button onClick={e => { e.stopPropagation(); onRemove(); }}
          className="no-print"
          style={{
            position: 'absolute', top: 4, right: 4,
            background: 'rgba(0,0,0,0.6)', border: 'none', color: '#FFF9D5',
            width: 18, height: 18, fontSize: 10, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
      )}
    </div>
  );
}

/* ── Main SWOT Matrix ── */
function SWOTMatrix({ cards, formData, aiSwot, onSwotUpdate, readOnly }) {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCross, setShowCross] = useState(false);
  const [crossItems, setCrossItems] = useState({ so: '', wo: '', st: '', wt: '' });

  /* Initialize from AI data or fallback */
  useEffect(() => {
    if (aiSwot && (aiSwot.forcas || aiSwot.fraquezas)) {
      setItems({
        forcas: aiSwot.forcas || [],
        fraquezas: aiSwot.fraquezas || [],
        oportunidades: aiSwot.oportunidades || [],
        ameacas: aiSwot.ameacas || [],
      });
      if (aiSwot.cruzamento) setCrossItems(aiSwot.cruzamento);
    } else {
      setItems(generateAutoSWOT(cards));
    }
  }, [aiSwot]);

  /* Notify parent of changes */
  const notifyChange = useCallback((newItems, newCross) => {
    if (onSwotUpdate) onSwotUpdate({ ...(newItems || items), cruzamento: newCross || crossItems });
  }, [onSwotUpdate, items, crossItems]);

  const updateItem = (q, i, text) => {
    const n = { ...items, [q]: [...items[q]] };
    n[q][i] = text;
    setItems(n);
    notifyChange(n);
  };
  const removeItem = (q, i) => {
    const n = { ...items, [q]: items[q].filter((_, j) => j !== i) };
    setItems(n);
    notifyChange(n);
  };
  const addItem = (q) => {
    const n = { ...items, [q]: [...items[q], 'Novo item — clique para editar'] };
    setItems(n);
    notifyChange(n);
  };

  /* Generate with AI */
  const handleGenerateAI = useCallback(async () => {
    if (!formData) return;
    setLoading(true);
    try {
      const levels = cards.map(c => c.level);
      const result = await generateSWOTAnalysis(formData, levels);
      if (result.success && result.data) {
        const d = result.data;
        const newItems = {
          forcas: d.forcas || [],
          fraquezas: d.fraquezas || [],
          oportunidades: d.oportunidades || [],
          ameacas: d.ameacas || [],
        };
        setItems(newItems);
        if (onSwotUpdate) onSwotUpdate({ ...newItems, momento: d.momento, acoes: d.acoes, benchmarks: d.benchmarks });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [formData, cards, onSwotUpdate]);

  /* Auto-generate on mount if formData + no saved SWOT */
  useEffect(() => {
    if (formData && !aiSwot && !readOnly) handleGenerateAI();
  }, []);

  if (!items) return null;

  const quadrants = [
    { key: 'forcas', title: 'FORÇAS', subtitle: 'VANTAGENS COMPETITIVAS', bg: '#42A947' },
    { key: 'fraquezas', title: 'FRAQUEZAS', subtitle: 'GAPS E VULNERABILIDADES', bg: '#ED028A' },
    { key: 'oportunidades', title: 'OPORTUNIDADES', subtitle: 'CAMINHOS DE CRESCIMENTO', bg: '#7807F7' },
    { key: 'ameacas', title: 'AMEAÇAS', subtitle: 'RISCOS SE NÃO AGIR', bg: '#0A0A0A' },
  ];

  return (
    <div>
      {/* AI regenerate button (mentor only) */}
      {formData && !readOnly && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12, gap: 8 }} className="no-print">
          <button onClick={handleGenerateAI} disabled={loading} style={{
            background: loading ? '#888' : '#0A0A0A', color: '#FFF9D5',
            border: '2px solid #0A0A0A', padding: '4px 12px',
            cursor: loading ? 'wait' : 'pointer',
            fontFamily: "var(--font-pixel)", fontSize: 9,
            boxShadow: '2px 2px 0 #ED028A',
          }}>
            {loading ? 'GERANDO...' : '⟳ GERAR SWOT COM IA'}
          </button>
        </div>
      )}

      {/* 2×2 Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0,
        border: '4px solid #0A0A0A', boxShadow: '6px 6px 0 #0A0A0A',
      }}>
        {quadrants.map((q, qi) => (
          <div key={q.key} style={{
            background: q.bg, padding: 20,
            borderRight: qi % 2 === 0 ? '3px solid #0A0A0A' : 'none',
            borderBottom: qi < 2 ? '3px solid #0A0A0A' : 'none',
            minHeight: 200,
          }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: '#FFF9D5', lineHeight: 1, marginBottom: 2 }}>{q.title}</div>
            <div style={{ fontFamily: "var(--font-pixel)", fontSize: 9, color: '#FFF9D5', opacity: 0.6, textTransform: 'uppercase', marginBottom: 16 }}>{q.subtitle}</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items[q.key].length > 0 ? items[q.key].map((item, i) => (
                readOnly ? (
                  <div key={i} style={{
                    background: 'rgba(255,249,213,0.08)', padding: '8px 12px',
                    border: '1px solid rgba(255,249,213,0.15)',
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                  }}>
                    <span style={{ fontFamily: "var(--font-pixel)", fontSize: 9, color: '#FFF9D5', marginTop: 3, opacity: 0.6 }}>›</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: '#FFF9D5', lineHeight: 1.4 }}>{item}</span>
                  </div>
                ) : (
                  <SWOTItem key={`${q.key}-${i}`} text={item} textColor="#FFF9D5"
                    onUpdate={(t) => updateItem(q.key, i, t)}
                    onRemove={() => removeItem(q.key, i)} />
                )
              )) : (
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: '#FFF9D5', opacity: 0.5, fontStyle: 'italic' }}>
                  {loading ? 'Gerando análise com IA...' : 'Nenhum item identificado'}
                </div>
              )}
              {!readOnly && (
                <button onClick={() => addItem(q.key)} className="no-print" style={{
                  background: 'rgba(255,249,213,0.06)', border: '1px dashed rgba(255,249,213,0.25)',
                  padding: '6px 12px', cursor: 'pointer', width: '100%',
                  fontFamily: "var(--font-pixel)", fontSize: 9, color: '#FFF9D5',
                  opacity: 0.4, transition: 'opacity 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0.4}
                >+ ADICIONAR</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Cross-SWOT (mentor only) */}
      {!readOnly && (
        <>
          <div style={{ marginTop: 16 }} className="no-print">
            <button onClick={() => setShowCross(!showCross)} style={{
              background: '#0A0A0A', color: '#FFF9D5',
              border: '3px solid #0A0A0A', padding: '8px 16px', cursor: 'pointer',
              fontFamily: "var(--font-display)", fontSize: 20,
              boxShadow: '3px 3px 0 #7807F7',
            }}>
              {showCross ? '▾ SWOT CRUZADA' : '▸ SWOT CRUZADA'}
            </button>
          </div>

          {showCross && (
            <div style={{
              marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0,
              border: '4px solid #0A0A0A', boxShadow: '4px 4px 0 #0A0A0A',
            }}>
              {[
                { key: 'so', title: 'FORÇAS × OPORTUNIDADES', sub: 'ESTRATÉGIAS DE CRESCIMENTO', bg: '#013B26' },
                { key: 'wo', title: 'FRAQUEZAS × OPORTUNIDADES', sub: 'ESTRATÉGIAS DE DESENVOLVIMENTO', bg: '#7807F7' },
                { key: 'st', title: 'FORÇAS × AMEAÇAS', sub: 'ESTRATÉGIAS DE DEFESA', bg: '#0A0A0A' },
                { key: 'wt', title: 'FRAQUEZAS × AMEAÇAS', sub: 'ESTRATÉGIAS DE SOBREVIVÊNCIA', bg: '#ED028A' },
              ].map((c, ci) => (
                <div key={c.key} style={{
                  background: c.bg, padding: 16,
                  borderRight: ci % 2 === 0 ? '3px solid #0A0A0A' : 'none',
                  borderBottom: ci < 2 ? '3px solid #0A0A0A' : 'none',
                  minHeight: 140,
                }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: '#FFF9D5', lineHeight: 1, marginBottom: 2 }}>{c.title}</div>
                  <div style={{ fontFamily: "var(--font-pixel)", fontSize: 8, color: '#FFF9D5', opacity: 0.5, marginBottom: 12 }}>{c.sub}</div>
                  <textarea
                    value={crossItems[c.key] || ''}
                    onChange={e => {
                      const nc = { ...crossItems, [c.key]: e.target.value };
                      setCrossItems(nc);
                      notifyChange(items, nc);
                    }}
                    placeholder="Como combinar esses fatores? Que ação tomar?"
                    style={{
                      width: '100%', minHeight: 80, background: 'rgba(255,249,213,0.08)',
                      border: '1px solid rgba(255,249,213,0.2)', color: '#FFF9D5',
                      fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.4,
                      padding: 10, resize: 'vertical', outline: 'none',
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

window.SWOTMatrix = SWOTMatrix;
window.generateAutoSWOT = generateAutoSWOT;
