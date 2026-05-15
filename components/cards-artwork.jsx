/* ── KOKO Diagnóstico — Animated Card Artwork v2 ── */
/* Each dimension has a unique visual metaphor, animated with CSS keyframes */
/* Level 0-4 adds complexity, fills shapes, grows elements */

const { useMemo } = React;

const P = {
  rosa: '#ED028A', roxo: '#7807F7', verde: '#013B26',
  amarelo: '#F7ED07', magenta: '#FF81FF', creme: '#FFF9D5',
  preto: '#0A0A0A', verdeBoka: '#42A947',
};

/* Inject global keyframes once */
if (!document.getElementById('koko-art-keyframes')) {
  const style = document.createElement('style');
  style.id = 'koko-art-keyframes';
  style.textContent = `
    @keyframes kokoSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    @keyframes kokoSpinR { 0% { transform: rotate(360deg); } 100% { transform: rotate(0deg); } }
    @keyframes kokoPulse { 0%,100% { transform: scale(1); opacity:0.7; } 50% { transform: scale(1.15); opacity:1; } }
    @keyframes kokoFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    @keyframes kokoFloat2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
    @keyframes kokoBlink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
    @keyframes kokoGrow { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.08); } }
    @keyframes kokoWave { 0% { d: path("M0,20 Q75,0 150,20 T300,20"); } 50% { d: path("M0,20 Q75,40 150,20 T300,20"); } 100% { d: path("M0,20 Q75,0 150,20 T300,20"); } }
    @keyframes kokoDash { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -40; } }
    @keyframes kokoOrbit { 0% { transform: rotate(0deg) translateX(50px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(50px) rotate(-360deg); } }
    @keyframes kokoOrbit2 { 0% { transform: rotate(0deg) translateX(35px) rotate(0deg); } 100% { transform: rotate(-360deg) translateX(35px) rotate(360deg); } }
    @keyframes kokoShake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }
    @keyframes kokoFadeInOut { 0%,100% { opacity:0.15; } 50% { opacity:0.5; } }
    @keyframes kokoBarGrow { 0% { transform: scaleY(0.6); } 50% { transform: scaleY(1); } 100% { transform: scaleY(0.6); } }
    @keyframes kokoRadar { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    @keyframes kokoCoinFlip { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(0.1); } }
  `;
  document.head.appendChild(style);
}

/* ─── DIM 1: ESTRUTURA — Building blocks, scaffolding ─── */
function ArtEstrutura({ level, size = 270 }) {
  const s = size;
  const blocks = 3 + level * 2;
  const filled = Math.ceil(blocks * ((level + 1) / 5));

  return (
    <svg viewBox={`0 0 ${s} ${s}`} width="100%" style={{ display: 'block', background: P.creme }}>
      {/* Grid */}
      {Array.from({length: 6}).map((_, i) => (
        <React.Fragment key={`g${i}`}>
          <line x1={i * s/5} y1={0} x2={i * s/5} y2={s} stroke={P.rosa} strokeWidth="0.5" opacity="0.1" />
          <line x1={0} y1={i * s/5} x2={s} y2={i * s/5} stroke={P.rosa} strokeWidth="0.5" opacity="0.1" />
        </React.Fragment>
      ))}

      {/* Stacked building blocks — grow from bottom */}
      {Array.from({length: blocks}).map((_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const w = s * 0.25;
        const h = s * 0.18;
        const x = s * 0.12 + col * (w + 8);
        const y = s - 30 - (row + 1) * (h + 4);
        const isFilled = i < filled;
        const delay = i * 0.3;
        return (
          <g key={i}>
            {/* Shadow */}
            <rect x={x + 3} y={y + 3} width={w} height={h} fill={P.preto} opacity="0.12" />
            {/* Block */}
            <rect x={x} y={y} width={w} height={h}
              fill={isFilled ? P.rosa : 'none'}
              stroke={P.preto} strokeWidth="2"
              opacity={isFilled ? 0.85 : 0.4}
              style={isFilled ? { animation: `kokoFloat2 ${2.5 + delay}s ease-in-out infinite`, animationDelay: `${delay}s` } : {}}
            />
            {/* Inner line detail */}
            {isFilled && (
              <line x1={x + 4} y1={y + h/2} x2={x + w - 4} y2={y + h/2}
                stroke={P.creme} strokeWidth="1.5" opacity="0.5" />
            )}
          </g>
        );
      })}

      {/* Rotating gear at top — appears at level 2+ */}
      {level >= 2 && (
        <g style={{ transformOrigin: `${s * 0.78}px ${s * 0.22}px`, animation: 'kokoSpin 8s linear infinite' }}>
          {Array.from({length: 8}).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const cx = s * 0.78, cy = s * 0.22, r = 22;
            return (
              <rect key={i} x={cx + Math.cos(a) * r - 4} y={cy + Math.sin(a) * r - 4}
                width={8} height={8} fill={P.roxo} opacity="0.6"
                transform={`rotate(${(i / 8) * 360} ${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r})`}
              />
            );
          })}
          <circle cx={s * 0.78} cy={s * 0.22} r={10} fill={P.roxo} />
          <circle cx={s * 0.78} cy={s * 0.22} r={4} fill={P.creme} />
        </g>
      )}

      {/* Central drop motif — pulsing */}
      <g style={{ transformOrigin: `${s * 0.5}px ${s * 0.35}px`, animation: 'kokoPulse 3s ease-in-out infinite' }}>
        <path d={`M${s/2},${s * 0.2} L${s/2 + 18},${s * 0.38} Q${s/2 + 18},${s * 0.48} ${s/2},${s * 0.5} Q${s/2 - 18},${s * 0.48} ${s/2 - 18},${s * 0.38} Z`}
          fill={P.rosa} stroke={P.preto} strokeWidth="2.5" />
        <circle cx={s/2} cy={s * 0.38} r={6} fill={P.creme} opacity="0.6" />
      </g>

      {/* Level indicator: small triangles */}
      {Array.from({length: level + 1}).map((_, i) => (
        <polygon key={`t${i}`}
          points={`${20 + i * 16},${s - 12} ${26 + i * 16},${s - 22} ${32 + i * 16},${s - 12}`}
          fill={P.preto} opacity="0.4"
        />
      ))}
    </svg>
  );
}

/* ─── DIM 2: DIGITAL — Network nodes, signals, orbiting data ─── */
function ArtDigital({ level, size = 270 }) {
  const s = size;
  const nodeCount = 4 + level * 2;

  const nodes = useMemo(() => {
    const seed = 137 + level * 11;
    let h = seed;
    const rng = () => { h = (h * 16807) % 2147483647; return (h - 1) / 2147483646; };
    return Array.from({length: nodeCount}).map((_, i) => ({
      x: 30 + rng() * (s - 60),
      y: 30 + rng() * (s - 60),
      r: 5 + rng() * 10,
      filled: rng() > 0.3,
    }));
  }, [level, nodeCount, s]);

  return (
    <svg viewBox={`0 0 ${s} ${s}`} width="100%" style={{ display: 'block', background: P.creme }}>
      {/* Hex grid background */}
      {Array.from({length: 8}).map((_, row) =>
        Array.from({length: 7}).map((_, col) => {
          const cx = col * 42 + (row % 2 ? 21 : 0);
          const cy = row * 36;
          return (
            <polygon key={`hex${row}${col}`}
              points={[0,1,2,3,4,5].map(i => {
                const a = Math.PI / 3 * i - Math.PI / 6;
                return `${cx + 18 * Math.cos(a)},${cy + 18 * Math.sin(a)}`;
              }).join(' ')}
              fill="none" stroke={P.roxo} strokeWidth="0.6" opacity="0.08"
            />
          );
        })
      )}

      {/* Connection lines — animated dash */}
      {nodes.map((n, i) => {
        if (i === 0) return null;
        const prev = nodes[(i + 2) % nodes.length];
        return (
          <line key={`l${i}`} x1={n.x} y1={n.y} x2={prev.x} y2={prev.y}
            stroke={P.roxo} strokeWidth="1.5" opacity="0.2"
            strokeDasharray="5 5"
            style={{ animation: `kokoDash ${3 + i * 0.5}s linear infinite` }}
          />
        );
      })}

      {/* Orbiting elements around center */}
      <g style={{ transformOrigin: `${s/2}px ${s/2}px` }}>
        <circle cx={s/2} cy={s/2} r={55} fill="none" stroke={P.roxo} strokeWidth="1.5" opacity="0.2" strokeDasharray="4 6" />
        <circle cx={s/2} cy={s/2} r={35} fill="none" stroke={P.magenta} strokeWidth="1" opacity="0.15" />

        {/* Orbiting dot 1 */}
        <g style={{ transformOrigin: `${s/2}px ${s/2}px`, animation: 'kokoSpin 6s linear infinite' }}>
          <circle cx={s/2 + 55} cy={s/2} r={6} fill={P.magenta} />
        </g>
        {/* Orbiting dot 2 */}
        {level >= 2 && (
          <g style={{ transformOrigin: `${s/2}px ${s/2}px`, animation: 'kokoSpinR 4s linear infinite' }}>
            <circle cx={s/2 + 35} cy={s/2} r={4} fill={P.rosa} />
          </g>
        )}
      </g>

      {/* Nodes — floating */}
      {nodes.map((n, i) => (
        <g key={`n${i}`} style={{ animation: `kokoFloat ${2 + (i % 3)}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }}>
          {n.filled ? (
            <>
              <circle cx={n.x} cy={n.y} r={n.r}
                fill={i % 3 === 0 ? P.roxo : i % 3 === 1 ? P.rosa : P.magenta}
                opacity="0.8" />
              <circle cx={n.x} cy={n.y} r={n.r * 0.35} fill={P.creme} opacity="0.6" />
            </>
          ) : (
            <circle cx={n.x} cy={n.y} r={n.r}
              fill="none" stroke={P.roxo} strokeWidth="2" opacity="0.5" />
          )}
        </g>
      ))}

      {/* Central signal burst — pulsing */}
      <g style={{ transformOrigin: `${s/2}px ${s/2}px`, animation: 'kokoPulse 2.5s ease-in-out infinite' }}>
        {Array.from({length: 8}).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          const len = 12 + (i % 2 ? 8 : 0);
          return (
            <line key={`ray${i}`}
              x1={s/2 + Math.cos(a) * 14} y1={s/2 + Math.sin(a) * 14}
              x2={s/2 + Math.cos(a) * (14 + len)} y2={s/2 + Math.sin(a) * (14 + len)}
              stroke={P.roxo} strokeWidth="2" opacity="0.5"
            />
          );
        })}
        <circle cx={s/2} cy={s/2} r={13} fill={P.roxo} />
        <circle cx={s/2} cy={s/2} r={5} fill={P.creme} />
      </g>

      {/* Signal waves — blinking */}
      {level >= 1 && Array.from({length: 2 + level}).map((_, i) => (
        <path key={`w${i}`}
          d={`M${s - 60},${s - 40 + i * 14} Q${s - 40},${s - 50 + i * 14} ${s - 20},${s - 40 + i * 14}`}
          fill="none" stroke={P.magenta} strokeWidth="2"
          opacity="0.5"
          style={{ animation: `kokoBlink ${1.5 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}
        />
      ))}
    </svg>
  );
}

/* ─── DIM 3: POSICIONAMENTO — Target, crosshairs, compass ─── */
function ArtPosicionamento({ level, size = 270 }) {
  const s = size;

  return (
    <svg viewBox={`0 0 ${s} ${s}`} width="100%" style={{ display: 'block', background: P.creme }}>
      {/* Compass rose lines */}
      <g style={{ transformOrigin: `${s/2}px ${s/2}px` }}>
        {Array.from({length: 16}).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          const long = i % 4 === 0;
          const med = i % 2 === 0;
          return (
            <line key={`cr${i}`}
              x1={s/2} y1={s/2}
              x2={s/2 + Math.cos(a) * (long ? s * 0.42 : med ? s * 0.3 : s * 0.2)}
              y2={s/2 + Math.sin(a) * (long ? s * 0.42 : med ? s * 0.3 : s * 0.2)}
              stroke={P.verde} strokeWidth={long ? 1.5 : 0.8} opacity={long ? 0.2 : 0.1}
            />
          );
        })}
      </g>

      {/* Concentric rings */}
      {[s * 0.42, s * 0.32, s * 0.22, s * 0.12].map((r, i) => (
        <circle key={`ring${i}`} cx={s/2} cy={s/2} r={r}
          fill="none"
          stroke={i === 0 ? P.verde : P.verdeBoka} strokeWidth={i === 0 ? 2.5 : 1.5}
          opacity={0.15 + i * 0.08}
          strokeDasharray={i > 1 ? "3 5" : "none"}
        />
      ))}

      {/* Rotating radar sweep */}
      <g style={{ transformOrigin: `${s/2}px ${s/2}px`, animation: 'kokoRadar 4s linear infinite' }}>
        <line x1={s/2} y1={s/2} x2={s/2 + s * 0.42} y2={s/2}
          stroke={P.verdeBoka} strokeWidth="2" opacity="0.4" />
        <circle cx={s/2 + s * 0.35} cy={s/2} r={4} fill={P.verdeBoka} opacity="0.6" />
      </g>

      {/* Starburst target center — pulsing */}
      <g style={{ transformOrigin: `${s/2}px ${s/2}px`, animation: 'kokoPulse 3s ease-in-out infinite' }}>
        <polygon
          points={Array.from({length: 12}).map((_, i) => {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const r = i % 2 === 0 ? 35 + level * 4 : 20 + level * 2;
            return `${s/2 + Math.cos(a) * r},${s/2 + Math.sin(a) * r}`;
          }).join(' ')}
          fill={P.rosa} opacity="0.75"
        />
        {/* Inner drop */}
        <path d={`M${s/2},${s/2 - 16} L${s/2 + 10},${s/2 + 2} Q${s/2 + 10},${s/2 + 14} ${s/2},${s/2 + 17} Q${s/2 - 10},${s/2 + 14} ${s/2 - 10},${s/2 + 2} Z`}
          fill={P.creme} stroke={P.preto} strokeWidth="1.5" />
        <circle cx={s/2} cy={s/2 + 3} r={4} fill={P.roxo} />
      </g>

      {/* Floating small markers — show position found */}
      {Array.from({length: level + 1}).map((_, i) => {
        const a = (i / (level + 1)) * Math.PI * 2 + 0.5;
        const r = s * 0.28;
        return (
          <g key={`mk${i}`} style={{ animation: `kokoFloat ${2 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.6}s` }}>
            <polygon
              points={`${s/2 + Math.cos(a) * r},${s/2 + Math.sin(a) * r - 8} ${s/2 + Math.cos(a) * r + 5},${s/2 + Math.sin(a) * r + 2} ${s/2 + Math.cos(a) * r - 5},${s/2 + Math.sin(a) * r + 2}`}
              fill={P.preto} opacity="0.5"
            />
          </g>
        );
      })}

      {/* Corner accent — checkerboard */}
      {Array.from({length: 3}).map((_, r) =>
        Array.from({length: 3}).map((_, c) => (
          <rect key={`ch${r}${c}`} x={s - 52 + c * 16} y={s - 52 + r * 16}
            width={16} height={16}
            fill={(r + c) % 2 === 0 ? P.verde : 'transparent'} opacity="0.15"
          />
        ))
      )}
    </svg>
  );
}

/* ─── DIM 4: CARTEIRA — Growing bars, stacking coins ─── */
function ArtCarteira({ level, size = 270 }) {
  const s = size;
  const barCount = 5 + level;

  return (
    <svg viewBox={`0 0 ${s} ${s}`} width="100%" style={{ display: 'block', background: P.creme }}>
      {/* Diagonal stripe bg */}
      {Array.from({length: 16}).map((_, i) => (
        <line key={`str${i}`}
          x1={i * 34 - s} y1={0} x2={i * 34} y2={s}
          stroke={P.amarelo} strokeWidth="14" opacity="0.12"
        />
      ))}

      {/* Ascending bars with staggered animation */}
      {Array.from({length: barCount}).map((_, i) => {
        const gap = 4;
        const w = (s - 40 - (barCount - 1) * gap) / barCount;
        const x = 20 + i * (w + gap);
        const maxH = s * 0.65;
        const h = maxH * (0.25 + (i / barCount) * 0.75);
        const colors = [P.rosa, P.roxo, P.amarelo, P.magenta, P.verdeBoka, P.rosa, P.roxo, P.amarelo, P.magenta];
        const c = colors[i % colors.length];
        const isYellow = c === P.amarelo;
        return (
          <g key={`bar${i}`} style={{
            transformOrigin: `${x + w/2}px ${s - 20}px`,
            animation: `kokoBarGrow ${2 + i * 0.3}s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }}>
            {/* Shadow */}
            <rect x={x + 3} y={s - 20 - h + 3} width={w} height={h} fill={P.preto} opacity="0.12" />
            {/* Bar */}
            <rect x={x} y={s - 20 - h} width={w} height={h}
              fill={c} stroke={P.preto} strokeWidth="2" />
            {/* Inner halftone on some */}
            {i % 2 === 0 && (
              <g opacity="0.1">
                {Array.from({length: Math.floor(h / 10)}).map((_, d) => (
                  <circle key={d} cx={x + w/2} cy={s - 20 - h + 8 + d * 10} r={2}
                    fill={isYellow ? P.preto : P.creme} />
                ))}
              </g>
            )}
          </g>
        );
      })}

      {/* Floating diamond — coin metaphor */}
      <g style={{
        transformOrigin: `${s/2}px ${s * 0.22}px`,
        animation: 'kokoFloat 2.5s ease-in-out infinite',
      }}>
        <rect x={s/2 - 20} y={s * 0.22 - 20} width={40} height={40}
          fill={P.amarelo} stroke={P.preto} strokeWidth="2.5"
          transform={`rotate(45 ${s/2} ${s * 0.22})`}
        />
        <circle cx={s/2} cy={s * 0.22} r={10} fill={P.rosa}
          style={{ animation: 'kokoCoinFlip 3s ease-in-out infinite' }}
        />
      </g>

      {/* Stacked coins at level 3+ */}
      {level >= 3 && Array.from({length: 3}).map((_, i) => (
        <g key={`coin${i}`} style={{
          animation: `kokoFloat2 ${2 + i * 0.4}s ease-in-out infinite`,
          animationDelay: `${i * 0.3}s`,
        }}>
          <ellipse cx={s * 0.82} cy={s * 0.3 + i * 14} rx={16} ry={6}
            fill={P.amarelo} stroke={P.preto} strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}

/* ─── DIM 5: FINANCEIRO — Flow, currency, abstract value ─── */
function ArtFinanceiro({ level, size = 270 }) {
  const s = size;

  return (
    <svg viewBox={`0 0 ${s} ${s}`} width="100%" style={{ display: 'block', background: P.creme }}>
      {/* Flowing curve wave — animated */}
      <g>
        <path
          d={`M-10,${s * 0.6} C${s * 0.2},${s * 0.5 - level * 12} ${s * 0.4},${s * 0.7 - level * 8} ${s * 0.6},${s * 0.55 - level * 10} S${s * 0.9},${s * 0.45 - level * 6} ${s + 10},${s * 0.5 - level * 8}`}
          fill="none" stroke={P.magenta} strokeWidth="28" opacity="0.2" strokeLinecap="round"
          strokeDasharray="8 12"
          style={{ animation: 'kokoDash 4s linear infinite' }}
        />
        <path
          d={`M-10,${s * 0.65} C${s * 0.3},${s * 0.55 - level * 10} ${s * 0.5},${s * 0.72 - level * 6} ${s * 0.65},${s * 0.6 - level * 8} S${s * 0.85},${s * 0.5 - level * 5} ${s + 10},${s * 0.55 - level * 6}`}
          fill="none" stroke={P.rosa} strokeWidth="14" opacity="0.3" strokeLinecap="round"
        />
      </g>

      {/* Geometric blocks — top left */}
      <g style={{ animation: 'kokoFloat2 3s ease-in-out infinite' }}>
        <rect x={25} y={30} width={55} height={55} fill={P.preto} opacity="0.8" />
        <rect x={33} y={38} width={55} height={55} fill={P.magenta} opacity="0.65" />
        <rect x={38} y={43} width={22} height={22} fill={P.amarelo} />
      </g>

      {/* Large circle with orbiting elements */}
      <g>
        <circle cx={s * 0.72} cy={s * 0.32} r={40} fill="none" stroke={P.roxo} strokeWidth="2" opacity="0.3"
          strokeDasharray="4 4"
          style={{ animation: 'kokoDash 5s linear infinite' }}
        />
        <circle cx={s * 0.72} cy={s * 0.32} r={26} fill={P.roxo} opacity="0.5"
          style={{ animation: 'kokoPulse 3s ease-in-out infinite' }}
        />
        <circle cx={s * 0.72} cy={s * 0.32} r={9} fill={P.creme} opacity="0.7" />
        {/* Orbiting dot */}
        <g style={{ transformOrigin: `${s * 0.72}px ${s * 0.32}px`, animation: 'kokoSpin 5s linear infinite' }}>
          <circle cx={s * 0.72 + 40} cy={s * 0.32} r={5} fill={P.magenta} opacity="0.8" />
        </g>
      </g>

      {/* Central drop — signature KOKO element */}
      <g style={{
        transformOrigin: `${s/2}px ${s * 0.6}px`,
        animation: 'kokoPulse 2.8s ease-in-out infinite',
      }}>
        <path d={`M${s/2},${s * 0.48} L${s/2 + 20},${s * 0.63} Q${s/2 + 20},${s * 0.76} ${s/2},${s * 0.8} Q${s/2 - 20},${s * 0.76} ${s/2 - 20},${s * 0.63} Z`}
          fill={P.rosa} stroke={P.preto} strokeWidth="2.5" />
        <path d={`M${s/2},${s * 0.54} L${s/2 + 9},${s * 0.63} Q${s/2 + 9},${s * 0.7} ${s/2},${s * 0.72} Q${s/2 - 9},${s * 0.7} ${s/2 - 9},${s * 0.63} Z`}
          fill={P.creme} opacity="0.5" />
      </g>

      {/* Ascending arrow at level 3+ */}
      {level >= 3 && (
        <g style={{ animation: 'kokoFloat 2s ease-in-out infinite' }}>
          <line x1={s * 0.18} y1={s * 0.85} x2={s * 0.18} y2={s * 0.55}
            stroke={P.verdeBoka} strokeWidth="3" opacity="0.6" />
          <polygon points={`${s * 0.18},${s * 0.52} ${s * 0.18 - 8},${s * 0.6} ${s * 0.18 + 8},${s * 0.6}`}
            fill={P.verdeBoka} opacity="0.6" />
        </g>
      )}

      {/* Small floating shapes */}
      {Array.from({length: 2 + level}).map((_, i) => (
        <g key={`sf${i}`} style={{
          animation: `kokoFadeInOut ${2 + i * 0.7}s ease-in-out infinite`,
          animationDelay: `${i * 0.5}s`,
        }}>
          {i % 2 === 0 ? (
            <circle cx={s * 0.15 + i * 40} cy={s * 0.2 + (i % 3) * 30} r={3 + i} fill={P.preto} />
          ) : (
            <polygon
              points={`${s * 0.15 + i * 40},${s * 0.15 + (i % 3) * 25} ${s * 0.15 + i * 40 + 5},${s * 0.15 + (i % 3) * 25 + 8} ${s * 0.15 + i * 40 - 5},${s * 0.15 + (i % 3) * 25 + 8}`}
              fill={P.preto}
            />
          )}
        </g>
      ))}
    </svg>
  );
}

/* ── Master artwork router ── */
function CardArtworkKoko({ dimIndex, level, size = 270 }) {
  switch (dimIndex) {
    case 0: return <ArtEstrutura level={level} size={size} />;
    case 1: return <ArtDigital level={level} size={size} />;
    case 2: return <ArtPosicionamento level={level} size={size} />;
    case 3: return <ArtCarteira level={level} size={size} />;
    case 4: return <ArtFinanceiro level={level} size={size} />;
    default: return <ArtEstrutura level={level} size={size} />;
  }
}

window.CardArtworkKoko = CardArtworkKoko;
