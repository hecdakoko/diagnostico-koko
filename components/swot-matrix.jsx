/* ── KOKO Diagnóstico — SWOT Matrix Component ── */

const { useState } = React;

/* Map each dimension to SWOT quadrants based on level */
function generateSWOT(cards) {
  const strengths = [];
  const weaknesses = [];
  const opportunities = [];
  const threats = [];

  cards.forEach(card => {
    const dim = DIMENSIONS[card.dimIndex];
    const lv = dim.levels[card.level];
    const color = DIM_COLORS[card.dimIndex];

    if (card.level >= 3) {
      // High level = strength
      strengths.push({ dim: dim.title, name: lv.name, level: card.level, color, phrase: lv.phrase, dimIndex: card.dimIndex });
      // High level also = opportunity to expand
      opportunities.push({
        dim: dim.title, color, dimIndex: card.dimIndex,
        text: card.level === 4
          ? `${dim.title}: consolidar liderança e monetizar posição dominante`
          : `${dim.title}: potencial para alcançar nível máximo — já tem base sólida`,
      });
    } else if (card.level >= 1) {
      // Mid level = opportunity
      opportunities.push({
        dim: dim.title, color, dimIndex: card.dimIndex,
        text: `${dim.title}: saltar de "${lv.name}" para "${dim.levels[card.level + 1].name}" com ações focadas`,
      });
      if (card.level === 1) {
        weaknesses.push({ dim: dim.title, name: lv.name, level: card.level, color, phrase: lv.phrase, dimIndex: card.dimIndex });
      }
    } else {
      // Level 0 = weakness + threat
      weaknesses.push({ dim: dim.title, name: lv.name, level: card.level, color, phrase: lv.phrase, dimIndex: card.dimIndex });
      threats.push({
        dim: dim.title, color, dimIndex: card.dimIndex,
        text: `${dim.title}: nível crítico pode comprometer crescimento geral da agência`,
      });
    }

    // Generate threats for mid-low levels
    if (card.level <= 2 && card.level > 0) {
      const threatTexts = {
        0: 'Concorrentes com estrutura mais madura podem capturar seus clientes',
        1: 'Invisibilidade digital limita alcance e geração de leads',
        2: 'Falta de nicho dificulta precificação e diferenciação',
        3: 'Carteira frágil gera instabilidade e dependência',
        4: 'Fragilidade financeira impede investimento em crescimento',
      };
      threats.push({
        dim: dim.title, color, dimIndex: card.dimIndex,
        text: threatTexts[card.dimIndex] || `${dim.title}: vulnerabilidade competitiva`,
      });
    }
  });

  return { strengths, weaknesses, opportunities, threats };
}

function SWOTMatrix({ cards, onCardClick }) {
  const swot = generateSWOT(cards);

  const quadrants = [
    { key: 'strengths', title: 'FORÇAS', subtitle: 'O que já funciona bem', items: swot.strengths, bg: '#42A947', textColor: '#FFF9D5' },
    { key: 'weaknesses', title: 'FRAQUEZAS', subtitle: 'Onde precisa melhorar', items: swot.weaknesses, bg: '#ED028A', textColor: '#FFF9D5' },
    { key: 'opportunities', title: 'OPORTUNIDADES', subtitle: 'Caminhos de crescimento', items: swot.opportunities, bg: '#7807F7', textColor: '#FFF9D5' },
    { key: 'threats', title: 'AMEAÇAS', subtitle: 'Riscos se não agir', items: swot.threats, bg: '#0A0A0A', textColor: '#FFF9D5' },
  ];

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 0,
        border: '4px solid #0A0A0A',
        boxShadow: '6px 6px 0 #0A0A0A',
      }}>
        {quadrants.map((q, qi) => (
          <div key={q.key} style={{
            background: q.bg,
            padding: '20px',
            borderRight: qi % 2 === 0 ? '3px solid #0A0A0A' : 'none',
            borderBottom: qi < 2 ? '3px solid #0A0A0A' : 'none',
            minHeight: 200,
          }}>
            {/* Quadrant header */}
            <div style={{
              fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
              fontSize: 28, color: q.textColor,
              lineHeight: 1, marginBottom: 2,
            }}>{q.title}</div>
            <div style={{
              fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
              fontSize: 9, color: q.textColor, opacity: 0.6,
              textTransform: 'uppercase', marginBottom: 16,
            }}>{q.subtitle}</div>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.key === 'strengths' || q.key === 'weaknesses' ? (
                /* Strength/Weakness: show card info */
                q.items.length > 0 ? q.items.map((item, i) => (
                  <div key={i}
                    onClick={() => onCardClick && onCardClick({ dimIndex: item.dimIndex, level: item.level })}
                    style={{
                      background: 'rgba(255,249,213,0.12)',
                      padding: '10px 12px',
                      cursor: onCardClick ? 'pointer' : 'default',
                      border: '2px solid rgba(255,249,213,0.2)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
                        fontSize: 14, fontWeight: 700, color: q.textColor,
                      }}>{item.name}</span>
                      <span style={{
                        fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
                        fontSize: 9, color: q.textColor, opacity: 0.7,
                      }}>LV.{item.level + 1}</span>
                    </div>
                    <div style={{
                      fontFamily: "var(--font-serif, 'DM Serif Display', serif)",
                      fontSize: 12, fontStyle: 'italic', color: q.textColor, opacity: 0.7,
                      marginTop: 4,
                    }}>{item.phrase}</div>
                  </div>
                )) : (
                  <div style={{
                    fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
                    fontSize: 13, color: q.textColor, opacity: 0.5, fontStyle: 'italic',
                  }}>Nenhuma dimensão neste quadrante</div>
                )
              ) : (
                /* Opportunity/Threat: show text */
                q.items.length > 0 ? q.items.map((item, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,249,213,0.08)',
                    padding: '8px 12px',
                    border: '1px solid rgba(255,249,213,0.15)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{
                        fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
                        fontSize: 9, color: q.textColor, marginTop: 3, flexShrink: 0,
                      }}>{'>'}</span>
                      <span style={{
                        fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
                        fontSize: 13, color: q.textColor, lineHeight: 1.4,
                      }}>{item.text}</span>
                    </div>
                  </div>
                )) : (
                  <div style={{
                    fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
                    fontSize: 13, color: q.textColor, opacity: 0.5, fontStyle: 'italic',
                  }}>Nenhum item identificado</div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.SWOTMatrix = SWOTMatrix;
window.generateSWOT = generateSWOT;
