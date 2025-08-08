import { useHistory } from '../state/history';

export function HistoryPage() {
  const items = useHistory((s) => s.items);
  const clear = useHistory((s) => s.clear);
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recent predictions</h2>
        <button className="text-sm underline" onClick={clear}>Clear</button>
      </div>
      {items.length === 0 ? (
        <div className="text-muted-foreground">No history yet.</div>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((it) => (
            <li key={it.id} className="border rounded p-2">
              <img src={it.imageDataUrl} className="w-full h-auto rounded mb-2" />
              <div className="text-sm">{it.topLabel} — {(it.topConfidence * 100).toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">{new Date(it.timestamp).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}