// TypeScript type definitions

// Base user type from Laravel backend
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Inertia.js page props
export interface PageProps {
  auth: {
    user: User;
  };
  ziggy?: {
    location: string;
  };
  errors?: Record<string, string>;
  flash?: {
    message?: string;
    error?: string;
    success?: string;
  };
}

// Component prop types
export interface AuthenticatedLayoutProps {
  user: User;
  header?: React.ReactNode;
  children: React.ReactNode;
}

export interface GuestLayoutProps {
  children: React.ReactNode;
}

// Button variant types
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

// Card component types
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardTitleProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

// Form input types
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isFocused?: boolean;
}

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

// Modal types
export interface ModalProps {
  children: React.ReactNode;
  show?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  closeable?: boolean;
  onClose?: () => void;
}

// Navigation types
export interface NavLinkProps {
  active?: boolean;
  className?: string;
  children: React.ReactNode;
  href: string;
}

export interface ResponsiveNavLinkProps {
  active?: boolean;
  className?: string;
  children: React.ReactNode;
  href?: string;
  method?: string;
  as?: string;
  onClick?: () => void;
}

// Demo data types
export interface DemoUser {
  id: number;
  name: string;
  email: string;
}

// Query hook types
export interface UseQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
}