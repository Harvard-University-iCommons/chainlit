interface IInput {
  className?: string;
  description?: string;
  disabled?: boolean;
  hasError?: boolean;
  id: string;
  label?: string;
  notificationsCount?: number | string;
  size?: 'small' | 'medium';
  tooltip?: string;
  type?: string;
}

export type { IInput };
