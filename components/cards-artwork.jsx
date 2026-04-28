/* ── KOKO Diagnóstico — Rich Generative Artwork per Dimension ── */
/* Inspired by Perestroika archetype illustrations — layered, textured, bold */

const { useMemo } = React;

/* KOKO palette for artwork */
const ART_PALETTE = {
  rosa: '#ED028A',
  roxo: '#7807F7',
  verde: '#013B26',
  amarelo: '#F7ED07',
  magenta: '#FF81FF',
  creme: '#FFF9D5',
  preto: '#0A0A0A',
  verdeBoka: '#42A947',
};

/* Seeded random */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* Halftone pattern def */
function HalftonePattern({ id, color, size = 4 }) {
  return (
    <pattern id={id} width={size * 2} height={size * 2} patternUnits="userSpaceOnUse">
      <circle cx={size / 2} cy={size / 2} r={size * 0.35} fill={color} />
      <circle cx={size * 1.5} cy={size * 1.5} r={size * 0.35} fill={color} />
    </pattern>
  );
}

/* ── DIMENSION 1: Estrutura — architectural scaffolding ── */
function ArtEstutura({ level, size = 300 }) {
  const rng = seededRandom(42 + level * 7);
  const blockCount = 4 + level * 3;

  return (
    <svg viewBox="0 0 300 300" width={size} height={size} style={{ display: 'block' }}>
      <defs>
        <HalftonePattern id="ht-est" color={ART_PALETTE.rosa} size={5} />
        <clipPath id="clip-est"><rect width="300" height="300" /></clipPath>
      </defs>
      <rect width="300" height="300" fill={ART_PALETTE.creme} />

      {/* Grid lines */}
      {Array.from({length: 8}).map((_, i) => (
        <React.Fragment key={`g${i}`}>
          <line x1={i * 37.5} y1={0} x2={i * 37.5} y2={300} stroke={ART_PALETTE.preto} strokeWidth="0.5" opacity="0.08" />
          <line x1={0} y1={i * 37.5} x2={300} y2={i * 37.5} stroke={ART_PALETTE.preto} strokeWidth="0.5" opacity="0.08" />
        </React.Fragment>
      ))}

      {/* Large background circle */}
      <circle cx={150} cy={150} r={90 + level * 15} fill="none" stroke={ART_PALETTE.rosa} strokeWidth="3" opacity="0.3" />
      <circle cx={150} cy={150} r={60 + level * 10} fill={`url(#ht-est)`} opacity="0.15" />

      {/* Architectural blocks */}
      {Array.from({length: blockCount}).map((_, i) => {
        const x = 30 + rng() * 200;
        const y = 40 + rng() * 200;
        const w = 25 + rng() * 60;
        const h = 25 + rng() * 60;
        const colors = [ART_PALETTE.rosa, ART_PALETTE.roxo, ART_PALETTE.magenta, ART_PALETTE.amarelo];
        const c = colors[Math.floor(rng() * colors.length)];
        const filled = rng() > 0.4;
        return (
          <g key={i} transform={`rotate(${rng() * 15 - 7.5} ${x + w/2} ${y + h/2})`}>
            <rect x={x} y={y} width={w} height={h}
              fill={filled ? c : 'none'}
              stroke={ART_PALETTE.preto}
              strokeWidth={filled ? 0 : 2.5}
              opacity={filled ? 0.7 : 0.9}
            />
            {filled && <rect x={x + 3} y={y + 3} width={w} height={h} fill={ART_PALETTE.preto} opacity="0.15" />}
          </g>
        );
      })}

      {/* Central drop/diamond shape */}
      <g transform="translate(150,140)">
        <path d={`M0,-45 L30,10 Q30,45 0,55 Q-30,45 -30,10 Z`}
          fill={ART_PALETTE.rosa} stroke={ART_PALETTE.preto} strokeWidth="3" />
        <path d={`M0,-30 L15,5 Q15,25 0,32 Q-15,25 -15,5 Z`}
          fill={ART_PALETTE.creme} opacity="0.6" />
      </g>

      {/* Small decorative triangles */}
      {Array.from({length: 3 + level}).map((_, i) => {
        const cx = 40 + rng() * 220;
        const cy = 40 + rng() * 220;
        const s = 8 + rng() * 15;
        return (
          <polygon key={`t${i}`}
            points={`${cx},${cy - s} ${cx + s * 0.866},${cy + s/2} ${cx - s * 0.866},${cy + s/2}`}
            fill={rng() > 0.5 ? ART_PALETTE.preto : ART_PALETTE.roxo}
            opacity={0.5 + rng() * 0.5}
          />
        );
      })}

      {/* Checkerboard corner accent */}
      {Array.from({length: 4}).map((_, r) =>
        Array.from({length: 4}).map((_, c) => (
          <rect key={`ch${r}${c}`} x={240 + c * 14} y={240 + r * 14}
            width={14} height={14}
            fill={(r + c) % 2 === 0 ? ART_PALETTE.preto : 'transparent'}
            opacity="0.15"
          />
        ))
      )}
    </svg>
  );
}

/* ── DIMENSION 2: Digital — networks, signals, waves ── */
function ArtDigital({ level, size = 300 }) {
  const rng = seededRandom(137 + level * 11);
  const nodeCount = 6 + level * 3;

  const nodes = useMemo(() => {
    const r = seededRandom(137 + level * 11);
    return Array.from({length: nodeCount}).map(() => ({
      x: 30 + r() * 240,
      y: 30 + r() * 240,
      r: 4 + r() * 12,
      filled: r() > 0.4,
    }));
  }, [level, nodeCount]);

  return (
    <svg viewBox="0 0 300 300" width={size} height={size} style={{ display: 'block' }}>
      <defs>
        <HalftonePattern id="ht-dig" color={ART_PALETTE.roxo} size={4} />
      </defs>
      <rect width="300" height="300" fill={ART_PALETTE.creme} />

      {/* Honeycomb background */}
      {Array.from({length: 10}).map((_, row) =>
        Array.from({length: 8}).map((_, col) => {
          const cx = col * 38 + (row % 2 ? 19 : 0);
          const cy = row * 33;
          return (
            <polygon key={`hex${row}${col}`}
              points={[0,1,2,3,4,5].map(i => {
                const a = Math.PI / 3 * i - Math.PI / 6;
                return `${cx + 16 * Math.cos(a)},${cy + 16 * Math.sin(a)}`;
              }).join(' ')}
              fill="none" stroke={ART_PALETTE.roxo} strokeWidth="0.8" opacity="0.12"
            />
          );
        })
      )}

      {/* Connection lines */}
      {nodes.map((n, i) => {
        if (i === 0) return null;
        const prev = nodes[(i + 3) % nodes.length];
        return (
          <line key={`l${i}`} x1={n.x} y1={n.y} x2={prev.x} y2={prev.y}
            stroke={ART_PALETTE.preto} strokeWidth="1.5" opacity="0.2"
            strokeDasharray={i % 3 === 0 ? "4 4" : "none"}
          />
        );
      })}

      {/* Large orbital circle */}
      <circle cx={150} cy={150} r={80 + level * 12} fill="none" stroke={ART_PALETTE.roxo} strokeWidth="2.5" opacity="0.4" />
      <circle cx={150} cy={150} r={50 + level * 8} fill={`url(#ht-dig)`} opacity="0.12" />

      {/* Nodes */}
      {nodes.map((n, i) => (
        <g key={`n${i}`}>
          {n.filled ? (
            <>
              <circle cx={n.x} cy={n.y} r={n.r + 2} fill={ART_PALETTE.preto} opacity="0.15" transform={`translate(2,2)`} />
              <circle cx={n.x} cy={n.y} r={n.r}
                fill={i % 3 === 0 ? ART_PALETTE.roxo : i % 3 === 1 ? ART_PALETTE.rosa : ART_PALETTE.magenta} />
              <circle cx={n.x} cy={n.y} r={n.r * 0.4} fill={ART_PALETTE.creme} opacity="0.5" />
            </>
          ) : (
            <circle cx={n.x} cy={n.y} r={n.r}
              fill="none" stroke={ART_PALETTE.roxo} strokeWidth="2" />
          )}
        </g>
      ))}

      {/* Central signal burst */}
      <g transform="translate(150,150)">
        {Array.from({length: 12}).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const len = 25 + (i % 2 ? 15 : 0);
          return (
            <line key={`ray${i}`}
              x1={Math.cos(a) * 20} y1={Math.sin(a) * 20}
              x2={Math.cos(a) * len} y2={Math.sin(a) * len}
              stroke={ART_PALETTE.roxo} strokeWidth="2.5" opacity="0.6"
            />
          );
        })}
        <circle cx={0} cy={0} r={18} fill={ART_PALETTE.roxo} />
        <circle cx={0} cy={0} r={8} fill={ART_PALETTE.creme} />
      </g>

      {/* Signal waves bottom-right */}
      {Array.from({length: 3}).map((_, i) => (
        <path key={`w${i}`}
          d={`M220,${250 + i * 12} Q250,${240 + i * 12} 280,${250 + i * 12}`}
          fill="none" stroke={ART_PALETTE.magenta} strokeWidth="2" opacity={0.4 + i * 0.2}
        />
      ))}
    </svg>
  );
}

/* ── DIMENSION 3: Posicionamento — target, compass, crosshairs ── */
function ArtPosicionamento({ level, size = 300 }) {
  const rng = seededRandom(271 + level * 13);

  return (
    <svg viewBox="0 0 300 300" width={size} height={size} style={{ display: 'block' }}>
      <defs>
        <HalftonePattern id="ht-pos" color={ART_PALETTE.verdeBoka} size={6} />
      </defs>
      <rect width="300" height="300" fill={ART_PALETTE.creme} />

      {/* Compass rose background */}
      <g transform="translate(150,150)">
        {Array.from({length: 16}).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          const long = i % 2 === 0;
          return (
            <line key={`cr${i}`}
              x1={0} y1={0}
              x2={Math.cos(a) * (long ? 130 : 80)}
              y2={Math.sin(a) * (long ? 130 : 80)}
              stroke={ART_PALETTE.verde} strokeWidth={long ? 1.5 : 0.8} opacity="0.15"
            />
          );
        })}

        {/* Concentric rings */}
        {[120, 90, 60, 35].map((r, i) => (
          <circle key={`ring${i}`} cx={0} cy={0} r={r}
            fill={i === 2 ? `url(#ht-pos)` : 'none'}
            stroke={ART_PALETTE.verde} strokeWidth={i === 0 ? 3 : 1.5}
            opacity={i === 0 ? 0.5 : 0.2 + i * 0.1}
          />
        ))}

        {/* Starburst */}
        <polygon
          points={Array.from({length: 16}).map((_, i) => {
            const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
            const r = i % 2 === 0 ? 50 : 28;
            return `${Math.cos(a) * r},${Math.sin(a) * r}`;
          }).join(' ')}
          fill={ART_PALETTE.rosa} opacity="0.8"
        />

        {/* Inner drop */}
        <path d={`M0,-22 L14,5 Q14,20 0,25 Q-14,20 -14,5 Z`}
          fill={ART_PALETTE.creme} stroke={ART_PALETTE.preto} strokeWidth="2" />
        <circle cx={0} cy={5} r={5} fill={ART_PALETTE.roxo} />
      </g>

      {/* Corner geometric accents */}
      {/* Top-left */}
      <rect x={15} y={15} width={40} height={40} fill={ART_PALETTE.verdeBoka} opacity="0.7" />
      <rect x={20} y={20} width={40} height={40} fill="none" stroke={ART_PALETTE.preto} strokeWidth="2" />

      {/* Bottom-right checkerboard */}
      {Array.from({length: 3}).map((_, r) =>
        Array.from({length: 3}).map((_, c) => (
          <rect key={`chk${r}${c}`} x={245 + c * 16} y={245 + r * 16}
            width={16} height={16}
            fill={(r + c) % 2 === 0 ? ART_PALETTE.verde : 'transparent'}
            opacity="0.2"
          />
        ))
      )}

      {/* Scattered small shapes */}
      {Array.from({length: 2 + level}).map((_, i) => {
        const x = 20 + rng() * 260;
        const y = 20 + rng() * 260;
        return (
          <polygon key={`tri${i}`}
            points={`${x},${y - 8} ${x + 7},${y + 4} ${x - 7},${y + 4}`}
            fill={rng() > 0.5 ? ART_PALETTE.preto : ART_PALETTE.rosa}
            opacity={0.3 + rng() * 0.5}
          />
        );
      })}
    </svg>
  );
}

/* ── DIMENSION 4: Carteira — stacked growth, ascending forms ── */
function ArtCarteira({ level, size = 300 }) {
  const rng = seededRandom(389 + level * 17);
  const barCount = 5 + level;

  return (
    <svg viewBox="0 0 300 300" width={size} height={size} style={{ display: 'block' }}>
      <defs>
        <HalftonePattern id="ht-car" color={ART_PALETTE.preto} size={5} />
      </defs>
      <rect width="300" height="300" fill={ART_PALETTE.creme} />

      {/* Background diagonal stripes */}
      {Array.from({length: 20}).map((_, i) => (
        <line key={`stripe${i}`}
          x1={i * 30 - 150} y1={0} x2={i * 30 + 150} y2={300}
          stroke={ART_PALETTE.amarelo} strokeWidth="12" opacity="0.15"
        />
      ))}

      {/* Ascending bars */}
      {Array.from({length: barCount}).map((_, i) => {
        const x = 25 + i * (240 / barCount);
        const h = 40 + (i / barCount) * 160 + rng() * 30;
        const w = (220 / barCount) - 4;
        const colors = [ART_PALETTE.rosa, ART_PALETTE.roxo, ART_PALETTE.amarelo, ART_PALETTE.magenta, ART_PALETTE.verdeBoka];
        const c = colors[i % colors.length];
        return (
          <g key={`bar${i}`}>
            <rect x={x + 3} y={300 - h + 3} width={w} height={h} fill={ART_PALETTE.preto} opacity="0.15" />
            <rect x={x} y={300 - h} width={w} height={h}
              fill={c} stroke={ART_PALETTE.preto} strokeWidth="2" />
            {/* Inner pattern on some bars */}
            {i % 2 === 0 && (
              <rect x={x} y={300 - h} width={w} height={h} fill={`url(#ht-car)`} opacity="0.08" />
            )}
          </g>
        );
      })}

      {/* Central floating diamond */}
      <g transform="translate(150,120)">
        <rect x={-25} y={-25} width={50} height={50}
          fill={ART_PALETTE.amarelo} stroke={ART_PALETTE.preto} strokeWidth="3"
          transform="rotate(45)" />
        <circle cx={0} cy={0} r={12} fill={ART_PALETTE.rosa} />
        <circle cx={0} cy={0} r={5} fill={ART_PALETTE.creme} />
      </g>

      {/* Decorative drop shape */}
      <g transform="translate(60,80)">
        <path d="M0,-18 L10,4 Q10,16 0,20 Q-10,16 -10,4 Z"
          fill={ART_PALETTE.roxo} opacity="0.7" />
      </g>

      {/* Small triangles scattered */}
      {Array.from({length: 3}).map((_, i) => {
        const x = 200 + rng() * 70;
        const y = 30 + rng() * 80;
        return (
          <polygon key={`st${i}`}
            points={`${x},${y - 6} ${x + 5},${y + 3} ${x - 5},${y + 3}`}
            fill={ART_PALETTE.preto} opacity={0.3 + rng() * 0.4}
          />
        );
      })}
    </svg>
  );
}

/* ── DIMENSION 5: Financeiro — flow, currency, abstract value ── */
function ArtFinanceiro({ level, size = 300 }) {
  const rng = seededRandom(521 + level * 19);

  return (
    <svg viewBox="0 0 300 300" width={size} height={size} style={{ display: 'block' }}>
      <defs>
        <HalftonePattern id="ht-fin" color={ART_PALETTE.magenta} size={4} />
      </defs>
      <rect width="300" height="300" fill={ART_PALETTE.creme} />

      {/* Abstract flowing curves */}
      <path d={`M-20,200 C60,${160 - level * 15} 120,${240 - level * 10} 160,${180 - level * 12} S240,${140 - level * 8} 320,${160 - level * 10}`}
        fill="none" stroke={ART_PALETTE.magenta} strokeWidth="30" opacity="0.25" strokeLinecap="round" />
      <path d={`M-20,220 C80,${180 - level * 12} 140,${250 - level * 8} 180,${200 - level * 10} S260,${160 - level * 6} 320,${180 - level * 8}`}
        fill="none" stroke={ART_PALETTE.rosa} strokeWidth="18" opacity="0.35" strokeLinecap="round" />

      {/* Geometric blocks */}
      <rect x={40} y={50} width={80} height={80} fill={ART_PALETTE.preto} opacity="0.85" />
      <rect x={50} y={60} width={80} height={80} fill={ART_PALETTE.magenta} opacity="0.7" />
      <rect x={55} y={65} width={30} height={30} fill={ART_PALETTE.amarelo} />

      {/* Large circle with halftone */}
      <circle cx={200} cy={100} r={55} fill={`url(#ht-fin)`} opacity="0.15" />
      <circle cx={200} cy={100} r={55} fill="none" stroke={ART_PALETTE.roxo} strokeWidth="2.5" opacity="0.4" />
      <circle cx={200} cy={100} r={35} fill={ART_PALETTE.roxo} opacity="0.6" />

      {/* Central drop motif */}
      <g transform="translate(150,170)">
        <path d="M0,-35 L22,8 Q22,35 0,42 Q-22,35 -22,8 Z"
          fill={ART_PALETTE.rosa} stroke={ART_PALETTE.preto} strokeWidth="3" />
        <path d="M0,-20 L10,4 Q10,18 0,22 Q-10,18 -10,4 Z"
          fill={ART_PALETTE.creme} opacity="0.5" />
      </g>

      {/* Diagonal lines bottom */}
      {Array.from({length: 6}).map((_, i) => (
        <line key={`dl${i}`}
          x1={180 + i * 20} y1={260} x2={200 + i * 20} y2={300}
          stroke={ART_PALETTE.preto} strokeWidth="3" opacity="0.15"
        />
      ))}

      {/* Abstract organic blob */}
      <path d={`M230,210 Q260,190 270,220 Q285,250 260,260 Q235,270 225,245 Q215,230 230,210 Z`}
        fill={ART_PALETTE.magenta} opacity="0.5" />

      {/* Small scattered shapes */}
      {Array.from({length: 2 + level}).map((_, i) => {
        const cx = 20 + rng() * 260;
        const cy = 20 + rng() * 260;
        return rng() > 0.5 ? (
          <circle key={`sc${i}`} cx={cx} cy={cy} r={3 + rng() * 5}
            fill={ART_PALETTE.preto} opacity={0.2 + rng() * 0.4} />
        ) : (
          <polygon key={`sc${i}`}
            points={`${cx},${cy - 5} ${cx + 4},${cy + 3} ${cx - 4},${cy + 3}`}
            fill={ART_PALETTE.preto} opacity={0.2 + rng() * 0.4} />
        );
      })}
    </svg>
  );
}

/* ── Master artwork router ── */
function CardArtworkKoko({ dimIndex, level, size = 300 }) {
  switch (dimIndex) {
    case 0: return <ArtEstutura level={level} size={size} />;
    case 1: return <ArtDigital level={level} size={size} />;
    case 2: return <ArtPosicionamento level={level} size={size} />;
    case 3: return <ArtCarteira level={level} size={size} />;
    case 4: return <ArtFinanceiro level={level} size={size} />;
    default: return <ArtEstutura level={level} size={size} />;
  }
}

window.CardArtworkKoko = CardArtworkKoko;
window.ART_PALETTE = ART_PALETTE;
