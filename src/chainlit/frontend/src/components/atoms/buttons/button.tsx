import { grey } from 'palette';

import Button, { ButtonProps } from '@mui/material/Button';

interface Props extends ButtonProps {
  component?: any;
  to?: any;
}

export default function RegularButton({ children, ...props }: Props) {
  return (
    <span>
      <Button
        sx={{
          textTransform: 'none',
          color: (theme) =>
            theme.palette.mode === 'dark'
              ? 'text.primary'
              : theme.palette.primary.main,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? grey[700]
              : theme.palette.primary.light,
          '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            outline: '2px solid crimson',
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? grey[700]
                : theme.palette.primary.light
          }
        }}
        {...props}
      >
        {children}
      </Button>
    </span>
  );
}
