import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faCodeBranch, faFileExport, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

export type AppView = 'convert' | 'analyzer' | 'mappings' | 'export';

const items: readonly { id: AppView; label: string; icon: typeof faPenToSquare }[] = [
  { id: 'convert', label: 'Convert', icon: faPenToSquare },
  { id: 'analyzer', label: 'Analyzer', icon: faCodeBranch },
  { id: 'mappings', label: 'Mappings', icon: faBookOpen },
  { id: 'export', label: 'Export', icon: faFileExport },
];

export function Navigation({ view, onChange }: { view: AppView; onChange: (view: AppView) => void }) {
  return <>
    <nav className="desktop-navigation" aria-label="Workspace views">
      {items.map((item) => <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => onChange(item.id)}>
        <FontAwesomeIcon icon={item.icon} /> {item.label}
      </button>)}
    </nav>
    <nav className="mobile-navigation" aria-label="Workspace views">
      {items.map((item) => <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => onChange(item.id)}>
        <FontAwesomeIcon icon={item.icon} /><span>{item.label}</span>
      </button>)}
    </nav>
  </>;
}
