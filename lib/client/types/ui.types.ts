/**
 * Component Props Types for UI Components
 * Centralized type definitions for reusable UI components
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';

// ============================================================================
// Modal Components
// ============================================================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdrop?: boolean;
  disableClose?: boolean;
}

export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  confirmText?: string;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'warning' | 'danger';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

// ============================================================================
// Button Component
// ============================================================================

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

// ============================================================================
// Badge Component
// ============================================================================

export interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  className?: string;
}

// ============================================================================
// Card Components
// ============================================================================

export interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  iconBgColor?: string;
  valueColor?: string;
  description?: string;
  trend?: 'positive' | 'negative' | { value: number; isPositive: boolean };
  className?: string;
}

export interface CardHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

// ============================================================================
// EmptyState Component
// ============================================================================

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

// ============================================================================
// PasswordInput Component
// ============================================================================

export interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}
