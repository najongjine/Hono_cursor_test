import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSettings } from '../state/settings';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { toast } from 'sonner';

const Schema = z.object({
  apiBaseUrl: z.string().url(),
  modelId: z.string().min(1),
});

type FormValues = z.infer<typeof Schema>;

export function SettingsPage() {
  const { apiBaseUrl, modelId, set, loadFromServer } = useSettings();
  const form = useForm<FormValues>({ resolver: zodResolver(Schema), defaultValues: { apiBaseUrl, modelId } });

  useEffect(() => {
    form.reset({ apiBaseUrl, modelId });
  }, [apiBaseUrl, modelId]);

  const onSubmit = async (values: FormValues) => {
    set(values);
    await loadFromServer(values.apiBaseUrl);
    toast.success('Settings saved');
  };

  const onLoad = async () => {
    await loadFromServer();
    form.reset({ apiBaseUrl: useSettings.getState().apiBaseUrl, modelId: useSettings.getState().modelId });
    toast.info('Loaded defaults from server');
  };

  return (
    <form className="max-w-lg space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="apiBaseUrl">API Base URL</Label>
        <Input id="apiBaseUrl" {...form.register('apiBaseUrl')} placeholder="http://localhost:8787" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="modelId">Model ID</Label>
        <Input id="modelId" {...form.register('modelId')} placeholder="plant-diseases/1" />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="secondary" onClick={onLoad}>Load from server</Button>
      </div>
    </form>
  );
}