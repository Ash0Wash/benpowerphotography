import ThermoInterpolator from './ThermoInterpolator';
import './thermo.css';

export const metadata = {
  title: 'Thermo Interpolator',
  description: 'Interpolate and double-interpolate values from thermodynamics data tables.',
  robots: { index: false, follow: false },
};

export default function ThermoPage() {
  return (
    <div className="thermo-page container">
      <div className="thermo-header">
        <h1>Thermo Table Interpolator</h1>
        <p className="thermo-subtitle">
          Single &amp; double interpolation for thermodynamic property tables
        </p>
      </div>
      <ThermoInterpolator />
    </div>
  );
}
