'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, disabled, Concert, Portrait
  const [search, setSearch] = useState('');
  
  // New Image Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSrc, setNewSrc] = useState('');
  const [newCategory, setNewCategory] = useState('Concert');
  const [newPos, setNewPos] = useState('center');

  useEffect(() => {
    // Client-side guard: redirect non-localhost visitors back to homepage
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '[::1]';
      if (!isLocal) {
        window.location.replace('/');
        return;
      }
    }

    fetch('/api/admin/hero')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load hero config:', err);
        setLoading(false);
      });
  }, []);

  const handleToggle = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
    setHasChanges(true);
  };

  const handlePositionChange = (id, newPosition) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, objectPosition: newPosition } : item))
    );
    setHasChanges(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Remove this photo from the hero list?')) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    setHasChanges(true);
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    if (!newSrc.trim()) return;
    const newItem = {
      id: 'custom-' + Date.now(),
      title: newTitle.trim() || 'Custom Photo',
      src: newSrc.trim(),
      objectPosition: newPos || 'center',
      category: newCategory,
      enabled: true,
    };
    setItems((prev) => [newItem, ...prev]);
    setHasChanges(true);
    setNewTitle('');
    setNewSrc('');
    setShowAddForm(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      });
      const data = await res.json();
      if (res.ok) {
        setHasChanges(false);
        setSaveMessage('✓ Homepage hero updated successfully (' + items.filter((i) => i.enabled).length + ' photos active)');
        setTimeout(() => setSaveMessage(null), 5000);
      } else {
        alert('Save failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filter === 'active' && !item.enabled) return false;
      if (filter === 'disabled' && item.enabled) return false;
      if (filter === 'Concert' && item.category !== 'Concert') return false;
      if (filter === 'Portrait' && item.category !== 'Portrait') return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesTitle = item.title && item.title.toLowerCase().includes(query);
        const matchesSrc = item.src && item.src.toLowerCase().includes(query);
        return matchesTitle || matchesSrc;
      }
      return true;
    });
  }, [items, filter, search]);

  const activeCount = items.filter((i) => i.enabled).length;

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading hero refresher manager...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1rem 8rem', maxWidth: '1200px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--accent)', fontWeight: 600 }}>
              Admin Panel
            </span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: 'var(--text-secondary)' }}>
              {activeCount} Active in Refresher
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 600 }}>Homepage Hero Manager</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 0', maxWidth: '600px' }}>
            Toggle photos on or off and adjust vertical cropping in real time. Changes go live on the homepage as soon as you save.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              padding: '0.65rem 1.25rem',
              background: 'transparent',
              border: '1px solid var(--glass-border)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            {showAddForm ? '✕ Close Form' : '+ Add New Photo'}
          </button>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.65rem 1.25rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--glass-border)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Preview Homepage ↗
          </Link>
        </div>
      </div>

      {/* Add New Photo Form (Collapsible) */}
      {showAddForm && (
        <form
          onSubmit={handleAddImage}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--accent)',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Add Photo to Refresher</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Photo Title / Artist</label>
              <input
                type="text"
                placeholder="e.g. Ken Carson Live"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '4px' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Image Path</label>
              <input
                type="text"
                placeholder="e.g. /images/hero/thumb-ken-carson.webp"
                value={newSrc}
                onChange={(e) => setNewSrc(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '4px' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '4px' }}
              >
                <option value="Concert">Concert</option>
                <option value="Portrait">Portrait</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Initial Cropping</label>
              <select
                value={newPos}
                onChange={(e) => setNewPos(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '4px' }}
              >
                <option value="center">Center (50%)</option>
                <option value="top">Top</option>
                <option value="center 30%">Upper (30%)</option>
                <option value="center 40%">Upper Mid (40%)</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '0.5rem 1.25rem', background: 'var(--accent)', color: 'var(--bg-primary)', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}
            >
              Add Photo
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All (${items.length})` },
            { id: 'active', label: `Active (${activeCount})` },
            { id: 'disabled', label: `Disabled (${items.length - activeCount})` },
            { id: 'Concert', label: 'Concerts' },
            { id: 'Portrait', label: 'Portraits' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: '0.45rem 0.9rem',
                fontSize: '0.82rem',
                borderRadius: '4px',
                cursor: 'pointer',
                border: filter === tab.id ? '1px solid var(--accent)' : '1px solid var(--glass-border)',
                background: filter === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: filter === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: filter === tab.id ? 600 : 400,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ minWidth: '240px' }}>
          <input
            type="text"
            placeholder="Search artist or filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 0.8rem',
              fontSize: '0.85rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--glass-border)',
              borderRadius: '4px',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>

      {/* Image Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {filteredItems.map((item) => (
          <ImageCard
            key={item.id}
            item={item}
            onToggle={() => handleToggle(item.id)}
            onPositionChange={(pos) => handlePositionChange(item.id, pos)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          No images match your filter criteria.
        </div>
      )}

      {/* Floating Save Actions Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          background: 'rgba(20, 20, 20, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '50px',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          minWidth: '320px',
          justifyContent: 'space-between',
        }}
      >
        <div>
          {saveMessage ? (
            <span style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 500 }}>{saveMessage}</span>
          ) : hasChanges ? (
            <span style={{ color: '#facc15', fontSize: '0.85rem', fontWeight: 500 }}>● Unsaved changes</span>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{activeCount} active in rotation</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            style={{
              padding: '0.55rem 1.4rem',
              background: hasChanges ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
              color: hasChanges ? 'var(--bg-primary)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '25px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: hasChanges ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageCard({ item, onToggle, onPositionChange, onDelete }) {
  // Parse current vertical position
  const currentPos = item.objectPosition || 'center';
  
  // Extract numeric percentage if like 'center 40%' or 'top'
  const getPercent = (p) => {
    if (!p || p === 'center') return 50;
    if (p === 'top') return 0;
    if (p === 'bottom') return 100;
    const match = p.match(/(\d+)%/);
    return match ? parseInt(match[1], 10) : 50;
  };

  const [sliderVal, setSliderVal] = useState(() => getPercent(currentPos));

  const handleSlider = (e) => {
    const val = e.target.value;
    setSliderVal(val);
    const newPos = val === '50' ? 'center' : val === '0' ? 'top' : val === '100' ? 'bottom' : `center ${val}%`;
    onPositionChange(newPos);
  };

  const handlePreset = (presetPos) => {
    setSliderVal(getPercent(presetPos));
    onPositionChange(presetPos);
  };

  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: item.enabled ? '1px solid var(--glass-border)' : '1px solid rgba(255,255,255,0.05)',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        opacity: item.enabled ? 1 : 0.55,
        transition: 'all 0.2s ease',
      }}
    >
      {/* Live 16:9 Hero Aspect Ratio Simulation Box */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#0a0a0a', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src}
          alt={item.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: currentPos,
            transition: 'object-position 0.15s ease',
          }}
        />
        {/* Aspect Ratio Guideline Indicator */}
        <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', color: '#bbb' }}>
          Hero Preview (16:9)
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>{item.title}</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
              {item.src.replace('/images/hero/', '')}
            </span>
          </div>

          <button
            onClick={onToggle}
            style={{
              padding: '0.25rem 0.65rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderRadius: '20px',
              cursor: 'pointer',
              border: item.enabled ? '1px solid #4ade80' : '1px solid rgba(255,255,255,0.2)',
              background: item.enabled ? 'rgba(74, 222, 128, 0.15)' : 'transparent',
              color: item.enabled ? '#4ade80' : 'var(--text-muted)',
            }}
          >
            {item.enabled ? 'Active' : 'Hidden'}
          </button>
        </div>

        {/* Cropping / Object Position Controls */}
        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vertical Crop Anchor:</span>
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--accent)' }}>{currentPos}</span>
          </div>

          {/* Interactive Range Slider */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderVal}
            onChange={handleSlider}
            style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer', marginBottom: '0.5rem' }}
          />

          {/* Quick Preset Buttons */}
          <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'space-between' }}>
            {[
              { label: 'Top', val: 'top' },
              { label: '30%', val: 'center 30%' },
              { label: 'Center', val: 'center' },
              { label: '40%', val: 'center 40%' },
              { label: 'Bottom', val: 'bottom' },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => handlePreset(p.val)}
                style={{
                  padding: '0.2rem 0.4rem',
                  fontSize: '0.68rem',
                  borderRadius: '3px',
                  background: currentPos === p.val ? 'rgba(255,255,255,0.15)' : 'transparent',
                  border: currentPos === p.val ? '1px solid var(--accent)' : '1px solid var(--glass-border)',
                  color: currentPos === p.val ? 'var(--text-primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.category}</span>
          <button
            onClick={onDelete}
            style={{ background: 'transparent', border: 'none', color: '#f87171', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
