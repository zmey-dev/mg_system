import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@/functions';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { EmpreendimentoProvider } from '@/contexts/EmpreendimentoContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Create a QueryClient instance using the utility function
const queryClient = createQueryClient();

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        const globalEmpreendimentos = props.initialPage.props.globalEmpreendimentos || [];
        const userEmpreendimentoId = props.initialPage.props.auth?.user?.empreendimento_id || null;

        root.render(
            <ThemeProvider>
                <EmpreendimentoProvider
                    empreendimentos={globalEmpreendimentos}
                    userEmpreendimentoId={userEmpreendimentoId}
                >
                    <QueryClientProvider client={queryClient}>
                        <App {...props} />
                    </QueryClientProvider>
                </EmpreendimentoProvider>
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
