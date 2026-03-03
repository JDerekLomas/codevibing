'use client';

import { useState } from 'react';

const SAMPLE = {
  title: 'XWHYSI',
  stub: 'Electronic music with AI video backgrounds',
  creator: 'Derek Lomas',
  tool: 'Claude',
  toolColor: '#D97706',
  image: '/previews/xwhysi.png',
};

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' } as const;
const gridStyle4 = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' } as const;
const gridStyle5 = { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' } as const;

export default function DesignExplorer() {
  const [isDark, setIsDark] = useState(true);

  const bg = isDark ? '#0a0a0a' : '#f5f5f5';
  const text = isDark ? '#fff' : '#171717';
  const muted = isDark ? '#a3a3a3' : '#525252';
  const cardBg = isDark ? '#171717' : '#fff';
  const borderColor = isDark ? '#262626' : '#e5e5e5';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, color: text, padding: '32px' }}>
      {/* Header */}
      <div style={{ maxWidth: '1000px', margin: '0 auto 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Design Exploration</h1>
          <button
            onClick={() => setIsDark(!isDark)}
            style={{ padding: '8px 16px', borderRadius: '4px', fontSize: '14px', backgroundColor: isDark ? '#fff' : '#000', color: isDark ? '#000' : '#fff', border: 'none', cursor: 'pointer' }}
          >
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
        <p style={{ color: muted, fontSize: '14px' }}>Four card styles. Hover to preview interactions.</p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* A: Dribbble */}
        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontWeight: 500, marginBottom: '4px' }}>A. Dribbble Style</h2>
          <p style={{ color: muted, fontSize: '14px', marginBottom: '16px' }}>Image top, info below. Clean zones.</p>
          <div style={gridStyle}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ borderRadius: '8px', overflow: 'hidden', backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                  <img src={SAMPLE.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '4px', backgroundColor: SAMPLE.toolColor, color: '#000' }}>
                    {SAMPLE.tool}
                  </span>
                </div>
                <div style={{ padding: '12px' }}>
                  <h3 style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px' }}>{SAMPLE.title}</h3>
                  <p style={{ fontSize: '12px', color: muted }}>{SAMPLE.stub}</p>
                  <p style={{ fontSize: '11px', color: muted, marginTop: '8px' }}>{SAMPLE.creator}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* B: Overlay */}
        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontWeight: 500, marginBottom: '4px' }}>B. Overlay Style</h2>
          <p style={{ color: muted, fontSize: '14px', marginBottom: '16px' }}>Text on gradient. Immersive.</p>
          <div style={gridStyle}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: '220px', borderRadius: '8px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
                <img src={SAMPLE.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px' }}>
                  <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 500, padding: '2px 6px', borderRadius: '4px', marginBottom: '8px', backgroundColor: SAMPLE.toolColor, color: '#000' }}>
                    {SAMPLE.tool}
                  </span>
                  <h3 style={{ fontWeight: 600, color: '#fff', fontSize: '14px', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    {SAMPLE.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginTop: '2px', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                    {SAMPLE.stub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* C: Minimal (Are.na) */}
        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontWeight: 500, marginBottom: '4px' }}>C. Are.na Minimal</h2>
          <p style={{ color: muted, fontSize: '14px', marginBottom: '16px' }}>Image only. Info on hover.</p>
          <div style={gridStyle}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="group" style={{ height: '200px', borderRadius: '4px', overflow: 'hidden', position: 'relative', cursor: 'pointer', border: `1px solid ${borderColor}` }}>
                <img src={SAMPLE.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px' }}>
                  <span style={{ display: 'inline-block', width: 'fit-content', fontSize: '10px', fontWeight: 500, padding: '2px 6px', borderRadius: '4px', marginBottom: '6px', backgroundColor: SAMPLE.toolColor, color: '#000' }}>
                    {SAMPLE.tool}
                  </span>
                  <h3 style={{ fontWeight: 500, color: '#fff', fontSize: '14px' }}>{SAMPLE.title}</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>{SAMPLE.stub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* D: Hybrid */}
        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontWeight: 500, marginBottom: '4px' }}>D. Hybrid</h2>
          <p style={{ color: muted, fontSize: '14px', marginBottom: '16px' }}>Clean image + thin info bar.</p>
          <div style={gridStyle}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ borderRadius: '4px', overflow: 'hidden', backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                <div style={{ height: '180px', overflow: 'hidden' }}>
                  <img src={SAMPLE.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: SAMPLE.toolColor }} />
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{SAMPLE.title}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: muted }}>{SAMPLE.creator.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Grid Density */}
        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontWeight: 500, marginBottom: '4px' }}>Grid Density</h2>
          <p style={{ color: muted, fontSize: '14px', marginBottom: '16px' }}>Tight vs spacious</p>

          <p style={{ fontSize: '12px', color: muted, marginBottom: '8px' }}>Tight (5 col, 8px gap)</p>
          <div style={gridStyle5}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ height: '100px', borderRadius: '4px', overflow: 'hidden' }}>
                <img src={SAMPLE.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>

          <p style={{ fontSize: '12px', color: muted, marginBottom: '8px', marginTop: '24px' }}>Spacious (4 col, 20px gap)</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ height: '140px', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={SAMPLE.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </section>

        {/* Featured + Grid */}
        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontWeight: 500, marginBottom: '4px' }}>Featured + Grid</h2>
          <p style={{ color: muted, fontSize: '14px', marginBottom: '16px' }}>Big hero, smaller items</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 140px)', gap: '12px' }}>
            {/* Featured - spans 2x2 */}
            <div style={{ gridColumn: 'span 2', gridRow: 'span 2', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
              <img src={SAMPLE.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
              <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
                <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 500, padding: '4px 8px', borderRadius: '4px', marginBottom: '8px', backgroundColor: SAMPLE.toolColor, color: '#000' }}>Featured</span>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#fff' }}>{SAMPLE.title}</h3>
              </div>
            </div>
            {/* Regular items */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <img src={SAMPLE.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </section>

      </div>

      <div style={{ height: '64px' }} />
    </div>
  );
}
