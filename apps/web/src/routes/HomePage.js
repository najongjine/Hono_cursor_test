import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { inferImage } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useHistory } from '../state/history';
import { toast } from 'sonner';
export function HomePage() {
    const fileInputRef = React.useRef(null);
    const [imageUrl, setImageUrl] = React.useState(null);
    const [result, setResult] = React.useState(null);
    const addHistory = useHistory((s) => s.add);
    const { mutateAsync, isPending } = useMutation({
        mutationFn: async (file) => await inferImage(file),
        onSuccess: async (res) => {
            setResult(res);
            toast.success(`Detected ${res.predictions[0]?.label ?? 'none'} in ${res.timeMs} ms`);
        },
        onError: (e) => {
            toast.error(e?.message ?? 'Inference failed');
        },
    });
    const onPickFile = () => fileInputRef.current?.click();
    const onFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const url = URL.createObjectURL(file);
        setImageUrl(url);
        const res = await mutateAsync(file);
        // Add to history with a small thumbnail
        const thumb = await createThumbnail(url, 256);
        const item = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            imageDataUrl: thumb,
            topLabel: res.predictions[0]?.label ?? 'unknown',
            topConfidence: res.predictions[0]?.confidence ?? 0,
        };
        addHistory(item);
    };
    return (_jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Upload plant image" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", className: "hidden", onChange: onFileChange }), _jsx(Button, { onClick: onPickFile, disabled: isPending, children: "Choose Image" }), imageUrl && _jsx(ImageWithBoxes, { imageUrl: imageUrl, result: result })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Prediction" }) }), _jsx(CardContent, { children: result ? (_jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("b", { children: "Model:" }), " ", result.modelId, " (", result.provider, ")"] }), _jsxs("div", { children: [_jsx("b", { children: "Time:" }), " ", result.timeMs, " ms"] }), _jsxs("div", { children: [_jsx("b", { children: "Detections:" }), _jsx("ul", { className: "list-disc ml-6 mt-1", children: result.predictions.map((p) => (_jsxs("li", { children: [p.label, " \u2014 ", (p.confidence * 100).toFixed(1), "%"] }, p.id))) })] })] })) : (_jsx("div", { className: "text-muted-foreground", children: "No prediction yet." })) })] })] }));
}
function ImageWithBoxes({ imageUrl, result }) {
    const canvasRef = React.useRef(null);
    const imgRef = React.useRef(null);
    React.useEffect(() => {
        if (!result || !canvasRef.current || !imgRef.current)
            return;
        const img = imgRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        const draw = () => {
            canvas.width = img.clientWidth;
            canvas.height = img.clientHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const scaleX = img.clientWidth / (result.image.width || img.naturalWidth);
            const scaleY = img.clientHeight / (result.image.height || img.naturalHeight);
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 2;
            ctx.font = '12px sans-serif';
            ctx.fillStyle = 'rgba(34,197,94,0.2)';
            for (const p of result.predictions) {
                const x = (p.box.x - p.box.width / 2) * scaleX;
                const y = (p.box.y - p.box.height / 2) * scaleY;
                const w = p.box.width * scaleX;
                const h = p.box.height * scaleY;
                ctx.fillRect(x, y, w, h);
                ctx.strokeRect(x, y, w, h);
                const label = `${p.label} ${(p.confidence * 100).toFixed(0)}%`;
                ctx.fillStyle = '#22c55e';
                ctx.fillRect(x, y - 16, ctx.measureText(label).width + 6, 16);
                ctx.fillStyle = '#0a0a0a';
                ctx.fillText(label, x + 3, y - 4);
                ctx.fillStyle = 'rgba(34,197,94,0.2)';
            }
        };
        draw();
        const obs = new ResizeObserver(draw);
        obs.observe(img);
        return () => obs.disconnect();
    }, [result]);
    return (_jsxs("div", { className: "relative", children: [_jsx("img", { ref: imgRef, src: imageUrl, className: "max-w-full h-auto rounded" }), _jsx("canvas", { ref: canvasRef, className: "absolute inset-0 pointer-events-none" })] }));
}
async function createThumbnail(objectUrl, maxWidth) {
    const img = new Image();
    img.src = objectUrl;
    await img.decode();
    const scale = Math.min(1, maxWidth / img.naturalWidth);
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL('image/jpeg', 0.85);
}
