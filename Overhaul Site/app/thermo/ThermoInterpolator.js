'use client';

import { useState } from 'react';

/* ─── helpers ─── */
function linearInterp(x, x0, x1, y0, y1) {
  if (x1 === x0) return y0;
  return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
}

function parseNum(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

/* ─── component ─── */
export default function ThermoInterpolator() {
  const [mode, setMode] = useState('single'); // 'single' | 'double' | 'quality'

  /* single-interpolation state */
  const [single, setSingle] = useState({
    x0: '', x1: '',   // known independent values (e.g. T_low, T_high)
    y0: '', y1: '',   // known dependent values  (e.g. s_low, s_high)
    xi: '',           // target independent value
  });
  const [singleResult, setSingleResult] = useState(null);

  /* double-interpolation state
   *   outer axis = e.g. Pressure  (P0, P1)
   *   inner axis = e.g. Temperature (T0, T1)
   *   4 corners of the property grid:
   *     y00 = prop @ (P0, T0)   y01 = prop @ (P0, T1)
   *     y10 = prop @ (P1, T0)   y11 = prop @ (P1, T1)
   */
  const [double_, setDouble] = useState({
    p0: '', p1: '', pi: '',     // outer axis bounds & target
    t0: '', t1: '', ti: '',     // inner axis bounds & target
    y00: '', y01: '',           // prop values at P0
    y10: '', y11: '',           // prop values at P1
  });
  const [doubleResult, setDoubleResult] = useState(null);

  /* ── labels ── */
  const [labels, setLabels] = useState({
    outer: 'Variable 1',
    inner: 'Variable 2',
    prop: 'Property',
    outerUnit: '',
    innerUnit: '',
    propUnit: '',
  });

  /* quality state */
  const [qualityMode, setQualityMode] = useState('findX'); // 'findX' | 'findProp'
  const [quality, setQuality] = useState({
    propF: '',    // saturated liquid value
    propG: '',    // saturated vapor value
    propVal: '',  // known property value (for findX)
    x: '',        // known quality (for findProp)
    propLabel: 'Property',
    propUnit: '',
  });
  const [qualityResult, setQualityResult] = useState(null);

  /* ── quality calculations ── */
  function calcQualityFindX() {
    const { propF, propG, propVal } = quality;
    const vals = [propF, propG, propVal].map(parseNum);
    if (vals.some(v => v === null)) {
      setQualityResult({ error: 'Please fill in all fields with valid numbers.' });
      return;
    }
    const [vf, vg, val] = vals;
    if (vg === vf) {
      setQualityResult({ error: 'Saturated liquid and vapor values cannot be equal.' });
      return;
    }
    const x = (val - vf) / (vg - vf);
    setQualityResult({
      type: 'findX',
      x,
      propFG: vg - vf,
    });
  }

  function calcQualityFindProp() {
    const { propF, propG, x } = quality;
    const vals = [propF, propG, x].map(parseNum);
    if (vals.some(v => v === null)) {
      setQualityResult({ error: 'Please fill in all fields with valid numbers.' });
      return;
    }
    const [vf, vg, vx] = vals;
    const propFG = vg - vf;
    const propVal = vf + vx * propFG;
    setQualityResult({
      type: 'findProp',
      propVal,
      propFG,
      x: vx,
    });
  }

  /* ── single interpolation ── */
  function calcSingle() {
    const { x0, x1, y0, y1, xi } = single;
    const vals = [x0, x1, y0, y1, xi].map(parseNum);
    if (vals.some(v => v === null)) {
      setSingleResult({ error: 'Please fill in all fields with valid numbers.' });
      return;
    }
    const [vx0, vx1, vy0, vy1, vxi] = vals;
    if (vx0 === vx1) {
      setSingleResult({ error: 'Upper and lower bounds cannot be the same value.' });
      return;
    }
    const yi = linearInterp(vxi, vx0, vx1, vy0, vy1);
    setSingleResult({ value: yi, xi: vxi });
  }

  /* ── double interpolation ── */
  function calcDouble() {
    const { p0, p1, pi, t0, t1, ti, y00, y01, y10, y11 } = double_;
    const vals = [p0, p1, pi, t0, t1, ti, y00, y01, y10, y11].map(parseNum);
    if (vals.some(v => v === null)) {
      setDoubleResult({ error: 'Please fill in all fields with valid numbers.' });
      return;
    }
    const [vp0, vp1, vpi, vt0, vt1, vti, vy00, vy01, vy10, vy11] = vals;

    if (vt0 === vt1) {
      setDoubleResult({ error: `${labels.inner} bounds cannot be the same.` });
      return;
    }
    if (vp0 === vp1) {
      setDoubleResult({ error: `${labels.outer} bounds cannot be the same.` });
      return;
    }

    // step 1 — interpolate along inner axis at each outer bound
    const yAtP0 = linearInterp(vti, vt0, vt1, vy00, vy01);
    const yAtP1 = linearInterp(vti, vt0, vt1, vy10, vy11);
    // step 2 — interpolate along outer axis
    const yi = linearInterp(vpi, vp0, vp1, yAtP0, yAtP1);

    setDoubleResult({
      value: yi,
      intermediates: { yAtP0, yAtP1 },
      pi: vpi,
      ti: vti,
    });
  }

  /* ── controlled input helper ── */
  function inp(stateObj, setter, key, placeholder) {
    return (
      <input
        type="text"
        inputMode="decimal"
        className="thermo-input"
        placeholder={placeholder}
        value={stateObj[key]}
        onChange={e => setter(prev => ({ ...prev, [key]: e.target.value }))}
      />
    );
  }

  return (
    <div className="thermo-tool">
      {/* ── mode toggle ── */}
      <div className="thermo-mode-toggle">
        <button
          className={`thermo-mode-btn ${mode === 'single' ? 'active' : ''}`}
          onClick={() => { setMode('single'); setDoubleResult(null); setQualityResult(null); }}
        >
          Single
        </button>
        <button
          className={`thermo-mode-btn ${mode === 'double' ? 'active' : ''}`}
          onClick={() => { setMode('double'); setSingleResult(null); setQualityResult(null); }}
        >
          Double
        </button>
        <button
          className={`thermo-mode-btn ${mode === 'quality' ? 'active' : ''}`}
          onClick={() => { setMode('quality'); setSingleResult(null); setDoubleResult(null); }}
        >
          Quality
        </button>
      </div>

      {/* ── custom labels ── */}
      <details className="thermo-labels-panel">
        <summary>Customize Labels &amp; Units</summary>
        <div className="thermo-labels-grid">
          {mode === 'double' && (
            <>
              <label>
                Outer Axis
                <input
                  className="thermo-input"
                  value={labels.outer}
                  onChange={e => setLabels(l => ({ ...l, outer: e.target.value }))}
                />
              </label>
              <label>
                Outer Unit
                <input
                  className="thermo-input"
                  value={labels.outerUnit}
                  onChange={e => setLabels(l => ({ ...l, outerUnit: e.target.value }))}
                />
              </label>
            </>
          )}
          <label>
            {mode === 'double' ? 'Inner Axis' : 'Independent Variable'}
            <input
              className="thermo-input"
              value={labels.inner}
              onChange={e => setLabels(l => ({ ...l, inner: e.target.value }))}
            />
          </label>
          <label>
            {mode === 'double' ? 'Inner Unit' : 'Indep. Unit'}
            <input
              className="thermo-input"
              value={labels.innerUnit}
              onChange={e => setLabels(l => ({ ...l, innerUnit: e.target.value }))}
            />
          </label>
          <label>
            Property
            <input
              className="thermo-input"
              value={labels.prop}
              onChange={e => setLabels(l => ({ ...l, prop: e.target.value }))}
            />
          </label>
          <label>
            Property Unit
            <input
              className="thermo-input"
              value={labels.propUnit}
              onChange={e => setLabels(l => ({ ...l, propUnit: e.target.value }))}
            />
          </label>
        </div>
      </details>

      {/* ──────── SINGLE ──────── */}
      {mode === 'single' && (
        <div className="thermo-card">
          <h2>Single Interpolation</h2>
          <p className="thermo-card-desc">
            Given two bounding {labels.inner} values and their {labels.prop} values,
            find {labels.prop} at an intermediate {labels.inner}.
          </p>

          <div className="thermo-visual">
            <div className="thermo-visual-header">Table Bounds</div>
            <div className="thermo-table-preview">
              <div className="thermo-table-row header">
                <span>{labels.inner || 'Independent'} {labels.innerUnit && `(${labels.innerUnit})`}<span className="thermo-hint">e.g. Temp, Pressure</span></span>
                <span>{labels.prop || 'Dependent'} {labels.propUnit && `(${labels.propUnit})`}<span className="thermo-hint">e.g. Enthalpy, Entropy</span></span>
              </div>
              <div className="thermo-table-row bound-low">
                <span>{inp(single, setSingle, 'x0', 'Lower')}</span>
                <span>{inp(single, setSingle, 'y0', 'Value')}</span>
              </div>
              <div className="thermo-table-row target">
                <span>{inp(single, setSingle, 'xi', 'Target')}</span>
                <span className="thermo-unknown">?</span>
              </div>
              <div className="thermo-table-row bound-high">
                <span>{inp(single, setSingle, 'x1', 'Upper')}</span>
                <span>{inp(single, setSingle, 'y1', 'Value')}</span>
              </div>
            </div>
          </div>

          <button className="thermo-calc-btn" onClick={calcSingle}>
            Interpolate
          </button>

          {singleResult && (
            <div className={`thermo-result ${singleResult.error ? 'error' : ''}`}>
              {singleResult.error ? (
                <p>{singleResult.error}</p>
              ) : (
                <>
                  <div className="thermo-result-label">
                    {labels.prop} at {labels.inner} = {singleResult.xi} {labels.innerUnit}
                  </div>
                  <div className="thermo-result-value">
                    {singleResult.value.toPrecision(6)} <span className="thermo-result-unit">{labels.propUnit}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ──────── DOUBLE ──────── */}
      {mode === 'double' && (
        <div className="thermo-card">
          <h2>Double Interpolation</h2>
          <p className="thermo-card-desc">
            Given a 2×2 grid of {labels.prop} values at two {labels.outer} and two {labels.inner} bounds,
            find {labels.prop} at intermediate values of both.
          </p>

          {/* outer axis */}
          <div className="thermo-double-section">
            <h3>{labels.outer} Bounds {labels.outerUnit && `(${labels.outerUnit})`} <span className="thermo-hint">e.g. Pressure</span></h3>
            <div className="thermo-row-pair">
              <label>Lower {labels.outer}{inp(double_, setDouble, 'p0', 'e.g. 100')}</label>
              <label>Upper {labels.outer}{inp(double_, setDouble, 'p1', 'e.g. 200')}</label>
              <label>Target {labels.outer}{inp(double_, setDouble, 'pi', 'e.g. 150')}</label>
            </div>
          </div>

          {/* inner axis */}
          <div className="thermo-double-section">
            <h3>{labels.inner} Bounds {labels.innerUnit && `(${labels.innerUnit})`} <span className="thermo-hint">e.g. Temperature</span></h3>
            <div className="thermo-row-pair">
              <label>Lower {labels.inner}{inp(double_, setDouble, 't0', 'e.g. 200')}</label>
              <label>Upper {labels.inner}{inp(double_, setDouble, 't1', 'e.g. 300')}</label>
              <label>Target {labels.inner}{inp(double_, setDouble, 'ti', 'e.g. 250')}</label>
            </div>
          </div>

          {/* 2×2 property grid */}
          <div className="thermo-double-section">
            <h3>{labels.prop} Grid {labels.propUnit && `(${labels.propUnit})`} <span className="thermo-hint">e.g. Enthalpy, Entropy, Sp. Volume</span></h3>
            <div className="thermo-grid-visual">
              {/* header row */}
              <div className="thermo-grid-cell corner"></div>
              <div className="thermo-grid-cell col-head">
                {labels.inner}₀
              </div>
              <div className="thermo-grid-cell col-head">
                {labels.inner}₁
              </div>

              {/* row 0: P0 */}
              <div className="thermo-grid-cell row-head">
                {labels.outer}₀
              </div>
              <div className="thermo-grid-cell data">
                {inp(double_, setDouble, 'y00', `${labels.prop}`)}
              </div>
              <div className="thermo-grid-cell data">
                {inp(double_, setDouble, 'y01', `${labels.prop}`)}
              </div>

              {/* row 1: P1 */}
              <div className="thermo-grid-cell row-head">
                {labels.outer}₁
              </div>
              <div className="thermo-grid-cell data">
                {inp(double_, setDouble, 'y10', `${labels.prop}`)}
              </div>
              <div className="thermo-grid-cell data">
                {inp(double_, setDouble, 'y11', `${labels.prop}`)}
              </div>
            </div>
          </div>

          <button className="thermo-calc-btn" onClick={calcDouble}>
            Double Interpolate
          </button>

          {doubleResult && (
            <div className={`thermo-result ${doubleResult.error ? 'error' : ''}`}>
              {doubleResult.error ? (
                <p>{doubleResult.error}</p>
              ) : (
                <>
                  <div className="thermo-result-label">
                    {labels.prop} at {labels.outer} = {doubleResult.pi} {labels.outerUnit},
                    {' '}{labels.inner} = {doubleResult.ti} {labels.innerUnit}
                  </div>
                  <div className="thermo-result-value">
                    {doubleResult.value.toPrecision(6)} <span className="thermo-result-unit">{labels.propUnit}</span>
                  </div>
                  <div className="thermo-result-steps">
                    <h4>Intermediate Steps</h4>
                    <p>
                      At {labels.outer}₀: interpolated {labels.prop} = {doubleResult.intermediates.yAtP0.toPrecision(6)} {labels.propUnit}
                    </p>
                    <p>
                      At {labels.outer}₁: interpolated {labels.prop} = {doubleResult.intermediates.yAtP1.toPrecision(6)} {labels.propUnit}
                    </p>
                    <p>
                      Then interpolated between these at target {labels.outer} → <strong>{doubleResult.value.toPrecision(6)} {labels.propUnit}</strong>
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ──────── QUALITY ──────── */}
      {mode === 'quality' && (
        <div className="thermo-card">
          <h2>Quality (Two-Phase Mixtures)</h2>
          <p className="thermo-card-desc">
            Calculate quality (x) from a known property, or find a mixture property from a known quality.
          </p>

          {/* sub-mode toggle */}
          <div className="thermo-quality-toggle">
            <button
              className={`thermo-quality-btn ${qualityMode === 'findX' ? 'active' : ''}`}
              onClick={() => { setQualityMode('findX'); setQualityResult(null); }}
            >
              Find Quality (x)
            </button>
            <button
              className={`thermo-quality-btn ${qualityMode === 'findProp' ? 'active' : ''}`}
              onClick={() => { setQualityMode('findProp'); setQualityResult(null); }}
            >
              Find Property
            </button>
          </div>

          {/* property label + unit */}
          <div className="thermo-double-section">
            <h3>Property Info</h3>
            <div className="thermo-row-pair" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <label>
                Property Name
                <input
                  className="thermo-input"
                  placeholder="e.g. h, s, v, u"
                  value={quality.propLabel}
                  onChange={e => setQuality(q => ({ ...q, propLabel: e.target.value }))}
                />
              </label>
              <label>
                Unit
                <input
                  className="thermo-input"
                  placeholder="e.g. kJ/kg, BTU/lb"
                  value={quality.propUnit}
                  onChange={e => setQuality(q => ({ ...q, propUnit: e.target.value }))}
                />
              </label>
            </div>
          </div>

          {/* sat liquid & vapor */}
          <div className="thermo-double-section">
            <h3>Saturation Values</h3>
            <div className="thermo-row-pair" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <label>
                {quality.propLabel}<sub>f</sub> (Sat. Liquid)
                {inp(quality, setQuality, 'propF', 'e.g. 417.46')}
              </label>
              <label>
                {quality.propLabel}<sub>g</sub> (Sat. Vapor)
                {inp(quality, setQuality, 'propG', 'e.g. 2675.5')}
              </label>
            </div>
          </div>

          {/* known value input */}
          <div className="thermo-double-section">
            <h3>{qualityMode === 'findX' ? `Known ${quality.propLabel} Value` : 'Known Quality'}</h3>
            <div className="thermo-row-pair" style={{ gridTemplateColumns: '1fr' }}>
              {qualityMode === 'findX' ? (
                <label>
                  {quality.propLabel} {quality.propUnit && `(${quality.propUnit})`}
                  {inp(quality, setQuality, 'propVal', 'e.g. 1500')}
                </label>
              ) : (
                <label>
                  x (0 to 1)
                  {inp(quality, setQuality, 'x', 'e.g. 0.65')}
                </label>
              )}
            </div>
          </div>

          <button
            className="thermo-calc-btn"
            onClick={qualityMode === 'findX' ? calcQualityFindX : calcQualityFindProp}
          >
            Calculate
          </button>

          {qualityResult && (
            <div className={`thermo-result ${qualityResult.error ? 'error' : ''}`}>
              {qualityResult.error ? (
                <p>{qualityResult.error}</p>
              ) : qualityResult.type === 'findX' ? (
                <>
                  <div className="thermo-result-label">Quality (x)</div>
                  <div className="thermo-result-value">
                    {qualityResult.x.toPrecision(6)}
                  </div>
                  <div className="thermo-result-steps">
                    <h4>Work</h4>
                    <p>{quality.propLabel}<sub>fg</sub> = {quality.propLabel}<sub>g</sub> − {quality.propLabel}<sub>f</sub> = {qualityResult.propFG.toPrecision(6)} {quality.propUnit}</p>
                    <p>x = ({quality.propLabel} − {quality.propLabel}<sub>f</sub>) / {quality.propLabel}<sub>fg</sub> = <strong>{qualityResult.x.toPrecision(6)}</strong></p>
                    {qualityResult.x < 0 || qualityResult.x > 1 ? (
                      <p style={{ color: '#e07070', marginTop: '0.5rem' }}>
                        ⚠ Quality is outside 0–1 range — the state may not be in the two-phase region.
                      </p>
                    ) : null}
                  </div>
                </>
              ) : (
                <>
                  <div className="thermo-result-label">
                    {quality.propLabel} at x = {qualityResult.x}
                  </div>
                  <div className="thermo-result-value">
                    {qualityResult.propVal.toPrecision(6)} <span className="thermo-result-unit">{quality.propUnit}</span>
                  </div>
                  <div className="thermo-result-steps">
                    <h4>Work</h4>
                    <p>{quality.propLabel}<sub>fg</sub> = {quality.propLabel}<sub>g</sub> − {quality.propLabel}<sub>f</sub> = {qualityResult.propFG.toPrecision(6)} {quality.propUnit}</p>
                    <p>{quality.propLabel} = {quality.propLabel}<sub>f</sub> + x · {quality.propLabel}<sub>fg</sub> = <strong>{qualityResult.propVal.toPrecision(6)} {quality.propUnit}</strong></p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── formula reference ── */}
      <details className="thermo-formula-panel">
        <summary>Formula Reference</summary>
        <div className="thermo-formula-content">
          <h4>Single Linear Interpolation</h4>
          <pre className="thermo-formula">
{`y = y₀ + (x - x₀) / (x₁ - x₀) × (y₁ - y₀)`}
          </pre>
          <h4>Double Linear Interpolation</h4>
          <pre className="thermo-formula">
{`Step 1: Interpolate along inner axis at each outer bound
  y(P₀) = y₀₀ + (T - T₀)/(T₁ - T₀) × (y₀₁ - y₀₀)
  y(P₁) = y₁₀ + (T - T₀)/(T₁ - T₀) × (y₁₁ - y₁₀)

Step 2: Interpolate between outer bounds
  y = y(P₀) + (P - P₀)/(P₁ - P₀) × (y(P₁) - y(P₀))`}
          </pre>
          <h4>Quality (Two-Phase)</h4>
          <pre className="thermo-formula">
{`Find quality from property:
  x = (prop - prop_f) / (prop_g - prop_f)
  x = (prop - prop_f) / prop_fg

Find property from quality:
  prop = prop_f + x × prop_fg
  where prop_fg = prop_g - prop_f`}
          </pre>
        </div>
      </details>
    </div>
  );
}
