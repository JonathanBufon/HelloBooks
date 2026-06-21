import { useState, type ReactNode, type CSSProperties, type ChangeEvent, type KeyboardEvent } from 'react';
import { SearchInput } from '../forms/SearchInput';
import { IconButton } from '../actions/IconButton';
import { Avatar } from '../data/Avatar';

export interface TopbarProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;
  actions?: ReactNode;
  style?: CSSProperties;
}

export function Topbar({
  userName,
  userRole,
  userAvatar,
  searchValue: controlledValue,
  searchPlaceholder = 'Buscar livros, autores...',
  onSearchChange,
  onSearchSubmit,
  actions,
  style = {},
}: TopbarProps) {
  const [localValue, setLocalValue] = useState('');
  const searchValue = controlledValue ?? localValue;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (onSearchChange) onSearchChange(val);
    else setLocalValue(val);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && onSearchSubmit) onSearchSubmit();
  };

  return (
    <header style={{
      height: 64, flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: '16px',
      padding: '0 24px',
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      ...style,
    }}>
      <div style={{ flex: 1, maxWidth: '460px' }} onKeyDown={handleKeyDown}>
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={handleChange}
        />
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {actions ?? (
          <div style={{ position: 'relative' }}>
            <IconButton variant="ghost" aria-label="Notificações">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </IconButton>
          </div>
        )}
        <IconButton variant="ghost" aria-label="Ajuda">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </IconButton>
        {userName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '6px', paddingLeft: '12px', borderLeft: '1px solid var(--color-border)' }}>
            <Avatar name={userName} src={userAvatar} size="sm" />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text)' }}>{userName}</div>
              {userRole && <div style={{ fontSize: '11px', color: 'var(--color-text-soft)' }}>{userRole}</div>}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
