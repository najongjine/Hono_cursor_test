import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useHistory } from '../state/history';
export function HistoryPage() {
    const items = useHistory((s) => s.items);
    const clear = useHistory((s) => s.clear);
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Recent predictions" }), _jsx("button", { className: "text-sm underline", onClick: clear, children: "Clear" })] }), items.length === 0 ? (_jsx("div", { className: "text-muted-foreground", children: "No history yet." })) : (_jsx("ul", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: items.map((it) => (_jsxs("li", { className: "border rounded p-2", children: [_jsx("img", { src: it.imageDataUrl, className: "w-full h-auto rounded mb-2" }), _jsxs("div", { className: "text-sm", children: [it.topLabel, " \u2014 ", (it.topConfidence * 100).toFixed(0), "%"] }), _jsx("div", { className: "text-xs text-muted-foreground", children: new Date(it.timestamp).toLocaleString() })] }, it.id))) }))] }));
}
