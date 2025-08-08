import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { inferImage } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useHistory } from '../state/history';
import { HistoryItem, InferenceResponse } from '@pkg/shared';
import { toast } from 'sonner';

export function HomePage() {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<InferenceResponse | null>(null);
  const addHistory = useHistory((s) => s.add);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (file: File) => await inferImage(file),
    onSuccess: async (res) => {
      setResult(res);
      toast.success(`Detected ${res.predictions[0]?.label ?? 'none'} in ${res.timeMs} ms`);
    },
    onError: (e: any) => {
      toast.error(e?.message ?? 'Inference failed');
    },
  });

  const onPickFile = () => fileInputRef.current?.click();
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    const res = await mutateAsync(file);
    // Add to history with a small thumbnail
    const thumb = await createThumbnail(url, 256);
    const item: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      imageDataUrl: thumb,
      topLabel: res.predictions[0]?.label ?? 'unknown',
      topConfidence: res.predictions[0]?.confidence ?? 0,
    };
    addHistory(item);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload plant image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
          <Button onClick={onPickFile} disabled={isPending}>Choose Image</Button>
          {imageUrl && <ImageWithBoxes imageUrl={imageUrl} result={result} />}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-2 text-sm">
              <div><b>Model:</b> {result.modelId} ({result.provider})</div>
              <div><b>Time:</b> {result.timeMs} ms</div>
              <div>
                <b>Detections:</b>
                <ul className="list-disc ml-6 mt-1">
                  {result.predictions.map((p) => (
                    <li key={p.id}>{p.label} — {(p.confidence * 100).toFixed(1)}%</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">No prediction yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ImageWithBoxes({ imageUrl, result }: { imageUrl: string; result: InferenceResponse | null }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    if (!result || !canvasRef.current || !imgRef.current) return;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

  return (
    <div className="relative">
      <img ref={imgRef} src={imageUrl} className="max-w-full h-auto rounded" />
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}

async function createThumbnail(objectUrl: string, maxWidth: number): Promise<string> {
  const img = new Image();
  img.src = objectUrl;
  await img.decode();
  const scale = Math.min(1, maxWidth / img.naturalWidth);
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', 0.85);
}