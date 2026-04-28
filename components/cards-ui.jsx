/* ── KOKO Diagnóstico — Card Components (Retro-Brutalismo) ── */

const { useState, useEffect, useMemo, useCallback } = React;

/* ── Win9x-style Window Frame ── */
function Win9xFrame({ title, color, children, style = {} }) {
  return (
    <div style={{
      border: '4px solid #0A0A0A',
      boxShadow: '6px 6px 0 #0A0A0A',
      background: '#FFF9D5',
      ...style,
    }}>
      {/* Title bar */}
      <div style={{
        background: color || '#013B26',
        padding: '6px 10px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '3px solid #0A0A0A',
      }}>
        <span style={{
          fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
          fontSize: 11, color: '#FFF9D5', textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>{title}</span>
        <div style={{
          width: 18, height: 18,
          border: '2px solid #0A0A0A',
          background: '#FFF9D5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
          fontSize: 10, fontWeight: 700, color: '#0A0A0A',
          lineHeight: 1, cursor: 'pointer',
        }}>×</div>
      </div>
      {children}
    </div>
  );
}

/* ── Card Component — KOKO Brutalist Style ── */
function KokoCard({ dimIndex, level, onClick, delay = 0 }) {
  const dim = DIMENSIONS[dimIndex];
  const lv = dim.levels[level];
  const color = DIM_COLORS[dimIndex];
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  /* Determine card bg color based on dimension */
  const cardBgs = ['#ED028A', '#7807F7', '#013B26', '#F7ED07', '#FF81FF'];
  const cardBg = cardBgs[dimIndex];
  const textOnCard = dimIndex === 3 ? '#0A0A0A' : '#FFF9D5'; /* yellow needs dark text */

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? (hovered ? 'translate(-2px, -4px)' : 'translate(0,0)') : 'translateY(20px)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        width: 270,
        flexShrink: 0,
      }}
    >
      <Win9xFrame
        title={`${dim.icon} — ${dim.title}`}
        color={cardBg}
      >
        {/* Main card area */}
        <div style={{
          background: cardBg,
          padding: '20px 16px 16px',
          position: 'relative',
          minHeight: 260,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          overflow: 'hidden',
        }}>
          {/* Background pattern — checkerboard subtle */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.06,
            backgroundImage: `repeating-conic-gradient(#0A0A0A 0% 25%, transparent 0% 50%)`,
            backgroundSize: '20px 20px',
          }}></div>

          {/* Level badge */}
          <div style={{
            position: 'relative',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            alignSelf: 'flex-start',
            background: '#0A0A0A',
            padding: '4px 10px',
            border: '2px solid #0A0A0A',
          }}>
            <span style={{
              fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
              fontSize: 11, color: cardBg === '#F7ED07' ? '#F7ED07' : color,
              textTransform: 'uppercase',
            }}>
              NÍVEL {level + 1}/5
            </span>
          </div>

          {/* Archetype name — BIG */}
          <div style={{ position: 'relative', marginTop: 16, flex: 1 }}>
            <h3 style={{
              fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
              fontSize: 36,
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              color: textOnCard,
              textTransform: 'uppercase',
            }}>
              {lv.name}
            </h3>
          </div>

          {/* Quote */}
          <div style={{
            position: 'relative',
            fontFamily: "var(--font-serif, 'DM Serif Display', serif)",
            fontSize: 14,
            fontStyle: 'italic',
            color: textOnCard,
            opacity: 0.8,
            lineHeight: 1.3,
            marginTop: 12,
          }}>
            {lv.phrase}
          </div>

          {/* Level dots — brutalist */}
          <div style={{ position: 'relative', display: 'flex', gap: 4, marginTop: 16 }}>
            {Array.from({length: 5}).map((_, i) => (
              <div key={i} style={{
                width: 32, height: 8,
                background: i <= level ? '#0A0A0A' : 'transparent',
                border: '2px solid #0A0A0A',
                transition: 'background 0.2s',
              }} />
            ))}
          </div>
        </div>

        {/* Footer bar */}
        <div style={{
          padding: '8px 12px',
          borderTop: '3px solid #0A0A0A',
          background: '#FFF9D5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{
            fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
            fontSize: 9, color: '#0A0A0A', textTransform: 'uppercase',
          }}>AGÊNCIA KOKO©</span>
          <span style={{
            fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
            fontSize: 10, fontWeight: 700, color: '#0A0A0A',
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>VER DIAGNÓSTICO →</span>
        </div>
      </Win9xFrame>
    </div>
  );
}

/* ── Detail Modal — KOKO Brutalist ── */
function KokoDetailModal({ dimIndex, level, onClose }) {
  const dim = DIMENSIONS[dimIndex];
  const lv = dim.levels[level];
  const color = DIM_COLORS[dimIndex];
  const cardBgs = ['#ED028A', '#7807F7', '#013B26', '#F7ED07', '#FF81FF'];
  const cardBg = cardBgs[dimIndex];
  const textOnCard = dimIndex === 3 ? '#0A0A0A' : '#FFF9D5';
  const [show, setShow] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setShow(true)); }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: show ? 'rgba(10,10,10,0.9)' : 'rgba(10,10,10,0)',
      transition: 'background 0.3s',
      padding: 20,
    }} onClick={handleClose}>
      <div onClick={e => e.stopPropagation()} style={{
        maxWidth: 780, width: '100%',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.3s ease',
      }}>
        <Win9xFrame title={`DIAGNÓSTICO — ${dim.title}`} color={cardBg}>
          <div style={{ display: 'flex', flexDirection: 'row', minHeight: 400 }}>
            {/* Left panel — colored */}
            <div style={{
              width: 280, flexShrink: 0,
              background: cardBg,
              padding: '24px 20px',
              display: 'flex', flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative', overflow: 'hidden',
              borderRight: '3px solid #0A0A0A',
            }}>
              {/* Checkerboard bg */}
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.06,
                backgroundImage: `repeating-conic-gradient(#0A0A0A 0% 25%, transparent 0% 50%)`,
                backgroundSize: '20px 20px',
              }}></div>

              <div style={{ position: 'relative' }}>
                {/* Level badge */}
                <div style={{
                  display: 'inline-block',
                  background: '#0A0A0A',
                  padding: '5px 12px',
                  marginBottom: 20,
                }}>
                  <span style={{
                    fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
                    fontSize: 12, color: cardBg === '#F7ED07' ? '#F7ED07' : color,
                  }}>NÍVEL {level + 1} DE 5</span>
                </div>

                {/* Title */}
                <h2 style={{
                  fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                  fontSize: 44,
                  lineHeight: 0.95,
                  color: textOnCard,
                  textTransform: 'uppercase',
                }}>
                  {lv.name}
                </h2>

                {/* Phrase */}
                <div style={{
                  fontFamily: "var(--font-serif, 'DM Serif Display', serif)",
                  fontSize: 16, fontStyle: 'italic',
                  color: textOnCard, opacity: 0.85,
                  marginTop: 16, lineHeight: 1.4,
                }}>
                  {lv.phrase}
                </div>
              </div>

              {/* Level bars */}
              <div style={{ position: 'relative', display: 'flex', gap: 4, marginTop: 24 }}>
                {Array.from({length: 5}).map((_, i) => (
                  <div key={i} style={{
                    flex: 1, height: 10,
                    background: i <= level ? '#0A0A0A' : 'transparent',
                    border: '2px solid #0A0A0A',
                  }} />
                ))}
              </div>
            </div>

            {/* Right panel — creme bg */}
            <div style={{
              flex: 1, padding: '24px',
              background: '#FFF9D5',
              display: 'flex', flexDirection: 'column', gap: 20,
              overflowY: 'auto', maxHeight: '70vh',
            }}>
              {/* Close */}
              <button onClick={handleClose} style={{
                alignSelf: 'flex-end',
                width: 28, height: 28,
                border: '2px solid #0A0A0A',
                background: '#FFF9D5',
                fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
                fontSize: 12, fontWeight: 700, color: '#0A0A0A',
                cursor: 'pointer', lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>×</button>

              {/* Section label */}
              <div style={{
                fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
                fontSize: 10, textTransform: 'uppercase', color: '#0A0A0A',
                letterSpacing: '0.08em', opacity: 0.6,
              }}>{dim.icon} — {dim.title}</div>

              {/* Description */}
              <div style={{
                fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
                fontSize: 15, lineHeight: 1.6, color: '#0A0A0A',
                borderLeft: `4px solid ${cardBg}`,
                paddingLeft: 16,
              }}>
                {lv.desc}
              </div>

              {/* Recommendations — Win9x style */}
              <div>
                <div style={{
                  fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                  fontSize: 22, color: '#0A0A0A',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                  borderBottom: '3px solid #0A0A0A',
                  paddingBottom: 6,
                }}>PRA SUBIR DE NÍVEL</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {lv.recs.map((rec, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      background: '#0A0A0A', padding: '10px 14px',
                    }}>
                      <span style={{
                        fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
                        fontSize: 10, color: cardBg,
                        marginTop: 2, flexShrink: 0,
                      }}>{'>'}</span>
                      <span style={{
                        fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
                        fontSize: 14, color: '#FFF9D5', lineHeight: 1.4,
                      }}>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next level */}
              {level < 4 && (
                <div style={{
                  border: `3px dashed #0A0A0A`,
                  padding: 14,
                  background: '#FFF9D5',
                }}>
                  <span style={{
                    fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
                    fontSize: 9, color: '#0A0A0A', textTransform: 'uppercase',
                    opacity: 0.6,
                  }}>PRÓXIMO NÍVEL</span>
                  <div style={{
                    fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                    fontSize: 24, color: '#0A0A0A', marginTop: 4,
                  }}>
                    LV.{level + 2} — {dim.levels[level + 1].name}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-serif, 'DM Serif Display', serif)",
                    fontSize: 13, color: '#0A0A0A', fontStyle: 'italic', opacity: 0.6, marginTop: 2,
                  }}>
                    {dim.levels[level + 1].phrase}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            padding: '8px 16px',
            borderTop: '3px solid #0A0A0A',
            background: '#FFF9D5',
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span style={{
              fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
              fontSize: 9, color: '#0A0A0A',
            }}>AGÊNCIA KOKO© — MENTORIA PARA AGÊNCIAS</span>
            <span style={{
              fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
              fontSize: 9, color: '#0A0A0A', opacity: 0.5,
            }}>DIAGNÓSTICO GERADO POR IA</span>
          </div>
        </Win9xFrame>
      </div>
    </div>
  );
}

/* ── Score display — brutalist ── */
function KokoScore({ cards }) {
  const avg = cards.reduce((s, c) => s + c.level + 1, 0) / cards.length;
  const scoreColor = avg < 2 ? '#ED028A' : avg < 3.5 ? '#F7ED07' : '#42A947';

  return (
    <div style={{
      border: '4px solid #0A0A0A',
      boxShadow: '4px 4px 0 #0A0A0A',
      background: scoreColor,
      padding: '16px 24px',
      display: 'inline-flex', alignItems: 'center', gap: 16,
    }}>
      <span style={{
        fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
        fontSize: 56, lineHeight: 1,
        color: scoreColor === '#F7ED07' ? '#0A0A0A' : '#FFF9D5',
      }}>{avg.toFixed(1)}</span>
      <div>
        <div style={{
          fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
          fontSize: 10, textTransform: 'uppercase',
          color: scoreColor === '#F7ED07' ? '#0A0A0A' : '#FFF9D5',
          opacity: 0.7,
        }}>SCORE GERAL</div>
        <div style={{
          fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
          fontSize: 10,
          color: scoreColor === '#F7ED07' ? '#0A0A0A' : '#FFF9D5',
        }}>DE 5.0</div>
      </div>
    </div>
  );
}

window.Win9xFrame = Win9xFrame;
window.KokoCard = KokoCard;
window.KokoDetailModal = KokoDetailModal;
window.KokoScore = KokoScore;
