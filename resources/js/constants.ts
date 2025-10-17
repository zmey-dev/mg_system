// Application constants

// UI Constants
export const MODAL_MAX_WIDTHS = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
} as const;

// Button Variants
export const BUTTON_VARIANTS = [
  'default',
  'destructive',
  'outline',
  'secondary',
  'ghost',
  'link'
] as const;

export const BUTTON_SIZES = [
  'default',
  'sm',
  'lg',
  'icon'
] as const;

// Priority Constants
export const PRIORIDADES = {
  ALTA: 'alta',
  MEDIA: 'media',
  BAIXA: 'baixa',
} as const;

// Atividade Status Constants (from requirements)
export const ATIVIDADE_STATUS = {
  ATIVA: 'ativa',
  BLOQUEADA: 'bloqueada',
  CONCLUIDA: 'concluida',
} as const;

// AtividadeRegistro Status Constants
export const REGISTRO_STATUS = {
  EM_ANDAMENTO: 'em_andamento',
  CONCLUIDA: 'concluida',
} as const;

// Item Status Constants (from requirements)
export const ITEM_STATUS = {
  ATIVO: 'ativo',
  INATIVO: 'inativo',
} as const;

// User Roles
export const USER_ROLES = {
  MASTER: 'master',
  SINDICO: 'sindico',
  GESTOR: 'gestor',
  AUDITOR: 'auditor',
} as const;

// Query Keys
export const QUERY_KEYS = {
  ATIVIDADES: ['atividades'],
  REGISTROS: ['registros'],
  CATALOG: ['catalog'],
  DASHBOARD: ['dashboard'],
  PARAMETERS: ['parameters'],
} as const;

// React Query Configuration
export const QUERY_CLIENT_CONFIG = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
} as const;

// CSS Classes
export const CSS_CLASSES = {
  LOADING_SPINNER: 'w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin',
  CARD_GRID: 'grid grid-cols-2 md:grid-cols-4 gap-4',
} as const;

// Navigation
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CATALOG: '/catalog',
  ACTIVITIES: '/activities',
  REGISTROS: '/registros',
  PARAMETERS: '/parameters',
  PROFILE: '/profile',
  LOGIN: '/login',
} as const;
