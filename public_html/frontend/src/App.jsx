import { useEffect, useState } from 'react';

const DEVICE_ID = 'mk-led-01';

function Sidebar() {
  return (
    <aside className="sidebar">
      <a className="brand" href="https://mkdesigning.in/" target="_blank" rel="noreferrer" aria-label="MK Designing website">
        <span className="brand-logo">MK<span>.</span></span>
        <span className="brand-name">MK DESIGNING<small>SMART HOME STUDIO</small></span>
      </a>
      <div className="side-label">CONTROL CENTER</div>
      <a className="nav-link active" href="#overview"><i className="bi bi-grid-1x2-fill" />Overview</a>
      <a className="nav-link" href="#devices"><i className="bi bi-toggles" />Devices<span className="nav-number">1</span></a>
      <div className="sidebar-bottom">
        <section className="sidebar-card">
          <i className="bi bi-code-slash" />
          <h2>Designed by MK</h2>
          <p>Digital experiences. Connected living.</p>
          <a href="https://mkdesigning.in/" target="_blank" rel="noreferrer">mkdesigning.in ↗</a>
        </section>
        <div className="admin">
          <div className="avatar">MK</div>
          <div><strong>Home Admin</strong><small>Local dashboard</small></div>
        </div>
      </div>
    </aside>
  );
}

function StatCard({ icon, label, value, detail }) {
  return (
    <article className="stat-card">
      <div className="stat-head"><span>{label}</span><i className={`bi ${icon}`} /></div>
      <strong className="stat-number">{value}</strong>
      <div className="stat-foot">{detail}</div>
    </article>
  );
}

function DeviceCard({ device, loading, connection }) {
  const hasDevice = Boolean(device);
  const outputState = hasDevice ? Number(device.output_state) : null;
  const isKnown = outputState === 0 || outputState === 1;
  const isOn = outputState === 1;
  const isOffline = connection === 'offline';
  const stateText = loading ? 'Loading...' : isOffline ? 'Unavailable' : !hasDevice ? 'No report yet' : isKnown ? (isOn ? 'ON' : 'OFF') : 'Unknown';
  const badgeText = loading ? 'LOADING' : isOffline ? 'OFFLINE' : !hasDevice ? 'WAITING' : isKnown ? (isOn ? 'ACTIVE' : 'STANDBY') : 'UNKNOWN';

  return (
    <article className={`device-card${isKnown && isOn ? ' is-on' : ''}`}>
      <div className="device-head">
        <div className={`device-symbol${isKnown && isOn ? ' lit' : ''}`}><i className="bi bi-lightbulb-fill" /></div>
        <span className={`status-pill${isKnown && isOn ? ' active' : ''}${isOffline ? ' error' : ''}`}>{badgeText}</span>
      </div>
      <div className="device-main">
        <div>
          <h3>Test LED</h3>
          <p>Living Room <small>· {device?.device_id || DEVICE_ID}</small></p>
        </div>
        <button className={`switch${isKnown && isOn ? ' on' : ''}`} type="button" disabled aria-label="Device controls are unavailable">
          <span />
        </button>
      </div>
      <div className="device-footer">
        <span><i className="bi bi-cpu" /> Reported output</span>
        <span>{stateText}</span>
      </div>
    </article>
  );
}

export default function App() {
  const [device, setDevice] = useState(null);
  const [connection, setConnection] = useState('connecting');
  const [message, setMessage] = useState('Connecting to database API...');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadStatus() {
      try {
        const response = await fetch(`/api/device-status.php?t=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`API HTTP ${response.status}`);
        const data = await response.json();
        if (!data.ok) throw new Error('API request failed');
        if (!active) return;

        setDevice(data.device);
        setConnection('connected');
        setMessage(data.device ? 'Status loaded from the database.' : 'API connected. No device report has been received yet.');
      } catch (error) {
        if (!active) return;
        setDevice(null);
        setConnection('offline');
        setMessage(`Could not load device status: ${error.message}`);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStatus();
    const intervalId = window.setInterval(loadStatus, 5000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [refreshKey]);

  const hasDevice = Boolean(device);
  const outputState = hasDevice ? Number(device.output_state) : null;
  const isKnown = outputState === 0 || outputState === 1;
  const isOn = outputState === 1;
  const reportState = isKnown ? (isOn ? 'ON' : 'OFF') : '--';

  return (
    <div className="app">
      <Sidebar />
      <main className="main" id="overview">
        <header className="topbar">
          <div className="breadcrumb">WORKSPACE <i className="bi bi-chevron-right" /> <strong>SMART HOME</strong></div>
          <div className="top-right">
            <div className={`connection ${connection === 'offline' ? 'is-error' : ''}`}>
              <span />{connection === 'connected' ? 'API CONNECTED' : connection === 'offline' ? 'API OFFLINE' : 'CONNECTING'}
            </div>
            <div className="avatar">MK</div>
          </div>
        </header>

        <section className="hero">
          <div>
            <div className="eyebrow"><span />SMART LIVING / DEVICE OVERVIEW</div>
            <h1>Your home,<br />powered by <span className="gradient-text">great design.</span></h1>
            <p>See the latest reported state of your connected device, updated directly from your home dashboard.</p>
            <div className="actions">
              <button className="button primary" type="button" onClick={() => { setLoading(true); setRefreshKey((key) => key + 1); }}>
                <i className="bi bi-arrow-clockwise" /> Refresh status
              </button>
              <a className="button" href="#devices">View device</a>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit" />
            <div className="orbit two" />
            <div className="house-icon"><i className="bi bi-house-heart-fill" /></div>
            <div className="floating-info info-one"><i className="bi bi-lightbulb-fill" /><div>LIGHTING<strong>{isKnown ? (isOn ? '1 active' : 'All off') : 'Waiting for report'}</strong></div></div>
            <div className="floating-info info-two"><i className="bi bi-wifi" /><div>NETWORK<strong>{connection === 'connected' ? 'API connected' : connection === 'offline' ? 'Connection error' : 'Connecting'}</strong></div></div>
          </div>
        </section>

        <section className="stats" aria-label="Device summary">
          <StatCard icon="bi-grid" label="Registered devices" value="1" detail="Configured for this dashboard" />
          <StatCard icon="bi-power" label="Reported state" value={reportState} detail="Latest device reading" />
          <StatCard icon="bi-lightbulb" label="Lights on" value={isKnown ? (isOn ? '1' : '0') : '--'} detail="Reported lighting state" />
          <StatCard icon="bi-clock-history" label="Last report" value={device?.last_seen || '--'} detail="Device-reported timestamp" />
        </section>

        <section className="devices-section" id="devices">
          <div className="section-head">
            <div>
              <div className="eyebrow"><span />DEVICE STATUS</div>
              <h2>Your devices <span>1</span></h2>
              <p>Live status from the database API. Device controls are not enabled.</p>
            </div>
          </div>
          <div className="device-grid">
            <DeviceCard device={device} loading={loading} connection={connection} />
            <p className={`message${connection === 'offline' ? ' error' : ''}`} role="status" aria-live="polite">{message}</p>
          </div>
        </section>

        <footer>
          <span>© 2026 <strong>MK Designing</strong> · Smart Home Interface</span>
          <span>STATUS REFRESHES EVERY 5 SECONDS <i className="bi bi-circle-fill" /></span>
        </footer>
      </main>
    </div>
  );
}