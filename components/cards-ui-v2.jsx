/* ── KOKO Diagnóstico — Card Components v2 (with artwork + reveal animation) ── */

const { useState, useEffect, useMemo, useCallback, useRef } = React;

/* ── Win9x-style Window Frame ── */
function Win9xFrame({ title, color, children, style = {} }) {
  return (
    <div style={{
      border: '4px solid #0A0A0A',
      boxShadow: '6px 6px 0 #0A0A0A',
      background: '#FFF9D5',
      ...style,
    }}>
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
          lineHeight: 1,
        }}>×</div>
      </div>
      {children}
    </div>
  );
}

/* ── Card back (face-down) ── */
function CardBack({ width = 270 }) {
  return (
    <div style={{
      width, border: '4px solid #0A0A0A',
      boxShadow: '6px 6px 0 #0A0A0A',
      background: '#013B26',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '6px 10px',
        borderBottom: '3px solid #0A0A0A',
        background: '#013B26',
      }}>
        <span style={{
          fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
          fontSize: 11, color: '#FFF9D5', opacity: 0.4,
        }}>? ? ?</span>
      </div>
      <div style={{
        aspectRatio: '3/4',
        background: '#013B26',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Checkerboard pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.12,
          backgroundImage: `repeating-conic-gradient(#FFF9D5 0% 25%, transparent 0% 50%)`,
          backgroundSize: '24px 24px',
        }}></div>
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{
            fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
            fontSize: 60, color: '#FFF9D5', opacity: 0.15,
            lineHeight: 1,
          }}>KOKO</div>
          <div style={{
            fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
            fontSize: 9, color: '#FFF9D5', opacity: 0.3,
            textTransform: 'uppercase', marginTop: 8,
          }}>DIAGNÓSTICO</div>
        </div>
      </div>
      <div style={{
        padding: '8px 12px',
        borderTop: '3px solid #0A0A0A',
        background: '#FFF9D5',
      }}>
        <span style={{
          fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
          fontSize: 9, color: '#0A0A0A',
        }}>AGÊNCIA KOKO©</span>
      </div>
    </div>
  );
}

/* ── Card Component — KOKO Brutalist with artwork ── */
function KokoCard({ dimIndex, level, onClick, delay = 0, revealed = true }) {
  const dim = DIMENSIONS[dimIndex];
  const lv = dim.levels[level];
  const [hovered, setHovered] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), delay);
    const t2 = revealed ? setTimeout(() => setFlipped(true), delay + 400) : null;
    return () => { clearTimeout(t1); if (t2) clearTimeout(t2); };
  }, [delay, revealed]);

  const cardBgs = ['#ED028A', '#7807F7', '#013B26', '#F7ED07', '#FF81FF'];
  const cardBg = cardBgs[dimIndex];
  const textOnCard = dimIndex === 3 ? '#0A0A0A' : '#FFF9D5';

  /* Simple reveal: show back, then swap to front */
  const showFront = flipped;

  return (
    <div
      onClick={() => showFront && onClick && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 270, flexShrink: 0,
        opacity: visible ? 1 : 0,
        transform: visible
          ? (showFront && hovered ? 'translate(-2px,-4px)' : 'translateY(0)')
          : 'translateY(40px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        cursor: showFront ? 'pointer' : 'default',
      }}
    >
      {!showFront ? (
        <CardBack width={270} />
      ) : (
        <div>
          <Win9xFrame title={`${dim.icon} — ${dim.title}`} color={cardBg}>
            {/* Artwork area */}
            <div style={{
              borderBottom: '3px solid #0A0A0A',
              position: 'relative', overflow: 'hidden',
            }}>
              <CardArtworkKoko dimIndex={dimIndex} level={level} size={270} />
            </div>

            {/* Info area */}
            <div style={{
              background: cardBg,
              padding: '14px 14px 12px',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.05,
                backgroundImage: `repeating-conic-gradient(#0A0A0A 0% 25%, transparent 0% 50%)`,
                backgroundSize: '16px 16px',
              }}></div>

              <div style={{
                position: 'relative', display: 'inline-block',
                background: '#0A0A0A', padding: '3px 8px', marginBottom: 8,
              }}>
                <span style={{
                  fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
                  fontSize: 10, color: cardBg === '#F7ED07' ? '#F7ED07' : cardBg,
                }}>NÍVEL {level + 1}/5</span>
              </div>

              <h3 style={{
                position: 'relative',
                fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                fontSize: 30, lineHeight: 0.95,
                color: textOnCard, textTransform: 'uppercase',
              }}>{lv.name}</h3>

              <div style={{
                position: 'relative',
                fontFamily: "var(--font-serif, 'DM Serif Display', serif)",
                fontSize: 13, fontStyle: 'italic',
                color: textOnCard, opacity: 0.8,
                lineHeight: 1.3, marginTop: 8,
              }}>{lv.phrase}</div>

              <div style={{ position: 'relative', display: 'flex', gap: 3, marginTop: 12 }}>
                {Array.from({length: 5}).map((_, i) => (
                  <div key={i} style={{
                    width: 28, height: 7,
                    background: i <= level ? '#0A0A0A' : 'transparent',
                    border: '2px solid #0A0A0A',
                  }} />
                ))}
              </div>
            </div>

            <div style={{
              padding: '7px 12px', borderTop: '3px solid #0A0A0A',
              background: '#FFF9D5',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{
                fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
                fontSize: 8, color: '#0A0A0A',
              }}>AGÊNCIA KOKO©</span>
              <span style={{
                fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
                fontSize: 10, fontWeight: 700, color: '#0A0A0A', textTransform: 'uppercase',
              }}>VER DIAGNÓSTICO →</span>
            </div>
          </Win9xFrame>
        </div>
      )}
    </div>
  );
}

/* ── Detail Modal — KOKO Brutalist with artwork ── */
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
      background: show ? 'rgba(10,10,10,0.88)' : 'rgba(10,10,10,0)',
      transition: 'background 0.3s',
      padding: 20,
    }} onClick={handleClose}>
      <div onClick={e => e.stopPropagation()} style={{
        maxWidth: 860, width: '100%',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.35s ease',
      }}>
        <Win9xFrame title={`DIAGNÓSTICO — ${dim.title}`} color={cardBg}>
          <div style={{ display: 'flex', flexDirection: 'row', minHeight: 420 }}>
            {/* Left: artwork + level */}
            <div style={{
              width: 300, flexShrink: 0,
              background: cardBg,
              display: 'flex', flexDirection: 'column',
              borderRight: '3px solid #0A0A0A',
              overflow: 'hidden',
            }}>
              {/* Artwork */}
              <div style={{ borderBottom: '3px solid #0A0A0A' }}>
                <CardArtworkKoko dimIndex={dimIndex} level={level} size={300} />
              </div>

              {/* Info below artwork */}
              <div style={{ padding: '16px', flex: 1, position: 'relative' }}>
                <div style={{
                  position: 'absolute', inset: 0, opacity: 0.05,
                  backgroundImage: `repeating-conic-gradient(#0A0A0A 0% 25%, transparent 0% 50%)`,
                  backgroundSize: '16px 16px',
                }}></div>

                <div style={{
                  position: 'relative',
                  display: 'inline-block',
                  background: '#0A0A0A', padding: '4px 10px', marginBottom: 12,
                }}>
                  <span style={{
                    fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
                    fontSize: 11, color: cardBg === '#F7ED07' ? '#F7ED07' : cardBg,
                  }}>NÍVEL {level + 1} DE 5</span>
                </div>

                <h2 style={{
                  position: 'relative',
                  fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                  fontSize: 38, lineHeight: 0.95,
                  color: textOnCard,
                }}>{lv.name}</h2>

                <div style={{
                  position: 'relative',
                  fontFamily: "var(--font-serif, 'DM Serif Display', serif)",
                  fontSize: 15, fontStyle: 'italic',
                  color: textOnCard, opacity: 0.8,
                  marginTop: 10, lineHeight: 1.4,
                }}>{lv.phrase}</div>

                {/* Level bars */}
                <div style={{ position: 'relative', display: 'flex', gap: 4, marginTop: 16 }}>
                  {Array.from({length: 5}).map((_, i) => (
                    <div key={i} style={{
                      flex: 1, height: 10,
                      background: i <= level ? '#0A0A0A' : 'transparent',
                      border: '2px solid #0A0A0A',
                    }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: details */}
            <div style={{
              flex: 1, padding: '24px',
              background: '#FFF9D5',
              display: 'flex', flexDirection: 'column', gap: 20,
              overflowY: 'auto', maxHeight: '75vh',
            }}>
              <button onClick={handleClose} style={{
                alignSelf: 'flex-end',
                width: 28, height: 28,
                border: '2px solid #0A0A0A', background: '#FFF9D5',
                fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
                fontSize: 12, fontWeight: 700, color: '#0A0A0A',
                cursor: 'pointer', lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '2px 2px 0 #0A0A0A',
              }}>×</button>

              <div style={{
                fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
                fontSize: 10, color: '#0A0A0A', opacity: 0.5,
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>{dim.icon} — {dim.title}</div>

              <div style={{
                fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
                fontSize: 15, lineHeight: 1.6, color: '#0A0A0A',
                borderLeft: `4px solid ${cardBg}`,
                paddingLeft: 16,
              }}>{lv.desc}</div>

              {/* Recommendations */}
              <div>
                <div style={{
                  fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                  fontSize: 24, color: '#0A0A0A',
                  borderBottom: '3px solid #0A0A0A',
                  paddingBottom: 6, marginBottom: 12,
                }}>PRA SUBIR DE NÍVEL</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {lv.recs.map((rec, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      background: '#0A0A0A', padding: '10px 14px',
                    }}>
                      <span style={{
                        fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
                        fontSize: 10, color: cardBg, marginTop: 2, flexShrink: 0,
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
                  border: '3px dashed #0A0A0A', padding: 14,
                }}>
                  <span style={{
                    fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
                    fontSize: 9, color: '#0A0A0A', opacity: 0.5,
                  }}>PRÓXIMO NÍVEL</span>
                  <div style={{
                    fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                    fontSize: 24, color: '#0A0A0A', marginTop: 4,
                  }}>LV.{level + 2} — {dim.levels[level + 1].name}</div>
                  <div style={{
                    fontFamily: "var(--font-serif, 'DM Serif Display', serif)",
                    fontSize: 13, color: '#0A0A0A', fontStyle: 'italic', opacity: 0.5, marginTop: 2,
                  }}>{dim.levels[level + 1].phrase}</div>
                </div>
              )}
            </div>
          </div>

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
              fontSize: 9, color: '#0A0A0A', opacity: 0.4,
            }}>DIAGNÓSTICO GERADO POR IA</span>
          </div>
        </Win9xFrame>
      </div>
    </div>
  );
}

/* ── Score — brutalist block ── */
function KokoScore({ cards }) {
  const avg = cards.reduce((s, c) => s + c.level + 1, 0) / cards.length;
  const scoreColor = avg < 2 ? '#ED028A' : avg < 3.5 ? '#F7ED07' : '#42A947';
  const textColor = scoreColor === '#F7ED07' ? '#0A0A0A' : '#FFF9D5';

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
        fontSize: 56, lineHeight: 1, color: textColor,
      }}>{avg.toFixed(1)}</span>
      <div>
        <div style={{
          fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
          fontSize: 10, color: textColor, opacity: 0.7,
        }}>SCORE GERAL</div>
        <div style={{
          fontFamily: "var(--font-pixel, 'Silkscreen', monospace)",
          fontSize: 10, color: textColor,
        }}>DE 5.0</div>
      </div>
    </div>
  );
}

/* ── Reveal All Button ── */
function RevealButton({ onClick, revealed }) {
  return (
    <button onClick={onClick} style={{
      display: revealed ? 'none' : 'flex',
      alignItems: 'center', gap: 10,
      background: '#ED028A',
      border: '4px solid #0A0A0A',
      boxShadow: '4px 4px 0 #0A0A0A',
      padding: '14px 28px',
      cursor: 'pointer',
      fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
      fontSize: 28, color: '#FFF9D5',
      textTransform: 'uppercase',
      transition: 'transform 0.15s',
      margin: '0 auto',
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translate(-2px,-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translate(0,0)'}
    >
      REVELAR CARTAS
    </button>
  );
}

window.Win9xFrame = Win9xFrame;
window.CardBack = CardBack;
window.KokoCard = KokoCard;
window.KokoDetailModal = KokoDetailModal;
window.KokoScore = KokoScore;
window.RevealButton = RevealButton;
