'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import AdminCard from '@/components/admin/AdminCard';
import { Save, Palette, ArrowLeft, Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';

export default function ThemeSettingsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [themeSettings, setThemeSettings] = useState(null);
  const [activePalette, setActivePalette] = useState('default');

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2000);

    async function loadSettings() {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('content')
          .eq('id', 'theme_settings')
          .maybeSingle();
        
        if (data?.content) {
          setThemeSettings(data.content);
          setActivePalette(data.content.active_palette || 'default');
        } else {
          // Default palettes
          setThemeSettings({
            active_palette: 'default',
            palettes: {
              default: {
                name: "Luxury Gold",
                primary: "#b8984e",
                background: { main: "#0d1117", secondary: "#161b22", tertiary: "#21262d" },
                text: { main: "#e6edf3", muted: "#8b949e" },
                border: "#f0f6fc73"
              },
              emerald: {
                name: "Emerald Elite",
                primary: "#10b981",
                background: { main: "#0f1419", secondary: "#1a1f2e", tertiary: "#252b3a" },
                text: { main: "#e8f4f8", muted: "#94a3b8" },
                border: "#10b98133"
              },
              sapphire: {
                name: "Sapphire Sky",
                primary: "#3b82f6",
                background: { main: "#0a0e27", secondary: "#151937", tertiary: "#1e2447" },
                text: { main: "#e0e7ff", muted: "#94a3b8" },
                border: "#3b82f633"
              },
              ruby: {
                name: "Ruby Rose",
                primary: "#ef4444",
                background: { main: "#1a0b0e", secondary: "#2d1417", tertiary: "#3f1d23" },
                text: { main: "#fee2e2", muted: "#9ca3af" },
                border: "#ef444433"
              }
            }
          });
        }
      } catch (error) {
        if (error.name === 'AbortError' || error.message?.includes('AbortError')) return;
        console.error('Error loading theme settings:', error);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    }
    loadSettings();
    return () => clearTimeout(timeout);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 'theme_settings',
          content: { ...themeSettings, active_palette: activePalette }
        });
      
      if (error) throw error;
      addToast('Theme settings saved successfully', 'success');
      
      // Reload page to apply theme
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      if (error.name === 'AbortError' || error.message?.includes('AbortError')) return;
      addToast('Error saving theme settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updatePaletteColor = (paletteKey, path, value) => {
    setThemeSettings(prev => {
      const newSettings = { ...prev };
      const palette = { ...newSettings.palettes[paletteKey] };
      
      if (path.includes('.')) {
        const [parent, child] = path.split('.');
        palette[parent] = { ...palette[parent], [child]: value };
      } else {
        palette[path] = value;
      }
      
      newSettings.palettes[paletteKey] = palette;
      return newSettings;
    });
  };

  if (loading) return (
    <div className="py-20 flex justify-center">
      <Loader2 className="animate-spin w-8 h-8 text-[var(--color-gold)]" />
    </div>
  );

  if (!themeSettings) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <button 
            onClick={() => router.push('/admin/settings')} 
            className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-primary-500 mb-2 transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Return to Terminal</span>
          </button>
          <h1 className="text-xl font-display font-bold text-[var(--text-main)]">Frontend Theme Manager</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Customize your frontend appearance</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="btn-premium space-x-2"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Save & Apply</span>
        </button>
      </div>

      {/* Active Palette Selector */}
      <AdminCard title="Active Color Palette">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(themeSettings.palettes).map(([key, palette]) => (
            <button
              key={key}
              onClick={() => setActivePalette(key)}
              className={`p-6 rounded-2xl border-2 transition-all ${
                activePalette === key 
                  ? 'border-primary-500 bg-primary-500/10' 
                  : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <Palette className="w-5 h-5 text-primary-500" />
                {activePalette === key && <Check className="w-5 h-5 text-primary-500" />}
              </div>
              <h3 className="font-bold text-sm text-[var(--text-main)] mb-2">{palette.name}</h3>
              <div className="flex gap-2 mt-3">
                <div 
                  className="w-8 h-8 rounded-lg border border-white/20" 
                  style={{ backgroundColor: palette.primary }}
                  title="Primary"
                />
                <div 
                  className="w-8 h-8 rounded-lg border border-white/20" 
                  style={{ backgroundColor: palette.background.main }}
                  title="Background"
                />
                <div 
                  className="w-8 h-8 rounded-lg border border-white/20" 
                  style={{ backgroundColor: palette.text.main }}
                  title="Text"
                />
              </div>
            </button>
          ))}
        </div>
      </AdminCard>

      {/* Color Customization for Active Palette */}
      <AdminCard title={`Customize ${themeSettings.palettes[activePalette].name}`}>
        <div className="space-y-6">
          {/* Primary Color */}
          <div>
            <label className="admin-label">Primary Color</label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={themeSettings.palettes[activePalette].primary}
                onChange={(e) => updatePaletteColor(activePalette, 'primary', e.target.value)}
                className="w-16 h-12 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={themeSettings.palettes[activePalette].primary}
                onChange={(e) => updatePaletteColor(activePalette, 'primary', e.target.value)}
                className="admin-input flex-1"
                placeholder="#b8984e"
              />
            </div>
          </div>

          {/* Background Colors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="admin-label">Background Main</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeSettings.palettes[activePalette].background.main}
                  onChange={(e) => updatePaletteColor(activePalette, 'background.main', e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={themeSettings.palettes[activePalette].background.main}
                  onChange={(e) => updatePaletteColor(activePalette, 'background.main', e.target.value)}
                  className="admin-input flex-1 text-xs"
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Background Secondary</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeSettings.palettes[activePalette].background.secondary}
                  onChange={(e) => updatePaletteColor(activePalette, 'background.secondary', e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={themeSettings.palettes[activePalette].background.secondary}
                  onChange={(e) => updatePaletteColor(activePalette, 'background.secondary', e.target.value)}
                  className="admin-input flex-1 text-xs"
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Background Tertiary</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeSettings.palettes[activePalette].background.tertiary}
                  onChange={(e) => updatePaletteColor(activePalette, 'background.tertiary', e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={themeSettings.palettes[activePalette].background.tertiary}
                  onChange={(e) => updatePaletteColor(activePalette, 'background.tertiary', e.target.value)}
                  className="admin-input flex-1 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Text Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Text Main</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeSettings.palettes[activePalette].text.main}
                  onChange={(e) => updatePaletteColor(activePalette, 'text.main', e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={themeSettings.palettes[activePalette].text.main}
                  onChange={(e) => updatePaletteColor(activePalette, 'text.main', e.target.value)}
                  className="admin-input flex-1"
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Text Muted</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeSettings.palettes[activePalette].text.muted}
                  onChange={(e) => updatePaletteColor(activePalette, 'text.muted', e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={themeSettings.palettes[activePalette].text.muted}
                  onChange={(e) => updatePaletteColor(activePalette, 'text.muted', e.target.value)}
                  className="admin-input flex-1"
                />
              </div>
            </div>
          </div>

          {/* Border Color */}
          <div>
            <label className="admin-label">Border Color (with opacity)</label>
            <input
              type="text"
              value={themeSettings.palettes[activePalette].border}
              onChange={(e) => updatePaletteColor(activePalette, 'border', e.target.value)}
              className="admin-input"
              placeholder="#f0f6fc73"
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">Use hex with alpha (e.g., #f0f6fc73)</p>
          </div>
        </div>
      </AdminCard>

      {/* Preview */}
      <AdminCard title="Live Preview">
        <div 
          className="p-8 rounded-2xl"
          style={{
            backgroundColor: themeSettings.palettes[activePalette].background.main,
            border: `1px solid ${themeSettings.palettes[activePalette].border}`
          }}
        >
          <h2 
            className="text-2xl font-bold mb-2"
            style={{ color: themeSettings.palettes[activePalette].text.main }}
          >
            Preview Heading
          </h2>
          <p style={{ color: themeSettings.palettes[activePalette].text.muted }}>
            This is how your text will look with the selected theme.
          </p>
          <button
            className="mt-4 px-6 py-3 rounded-xl font-bold text-sm"
            style={{
              backgroundColor: themeSettings.palettes[activePalette].primary,
              color: '#ffffff'
            }}
          >
            Primary Button
          </button>
        </div>
      </AdminCard>
    </div>
  );
}
