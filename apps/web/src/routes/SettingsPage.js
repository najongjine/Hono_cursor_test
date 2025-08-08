import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
export function SettingsPage() {
    const { apiBaseUrl, modelId, set, loadFromServer } = useSettings();
    const form = useForm({ resolver: zodResolver(Schema), defaultValues: { apiBaseUrl, modelId } });
    useEffect(() => {
        form.reset({ apiBaseUrl, modelId });
    }, [apiBaseUrl, modelId]);
    const onSubmit = async (values) => {
        set(values);
        await loadFromServer(values.apiBaseUrl);
        toast.success('Settings saved');
    };
    const onLoad = async () => {
        await loadFromServer();
        form.reset({ apiBaseUrl: useSettings.getState().apiBaseUrl, modelId: useSettings.getState().modelId });
        toast.info('Loaded defaults from server');
    };
    return (_jsxs("form", { className: "max-w-lg space-y-4", onSubmit: form.handleSubmit(onSubmit), children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "apiBaseUrl", children: "API Base URL" }), _jsx(Input, { id: "apiBaseUrl", ...form.register('apiBaseUrl'), placeholder: "http://localhost:8787" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "modelId", children: "Model ID" }), _jsx(Input, { id: "modelId", ...form.register('modelId'), placeholder: "plant-diseases/1" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { type: "submit", children: "Save" }), _jsx(Button, { type: "button", variant: "secondary", onClick: onLoad, children: "Load from server" })] })] }));
}
