import { grey, huitColorPaletteV3 } from 'palette';

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
              ? huitColorPaletteV3.blue
              : theme.palette.primary.light,
          '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            outline: '2px solid ' + huitColorPaletteV3.blue,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? huitColorPaletteV3.blue
                : theme.palette.primary.light
          },
          fontSize: '1rem'
        }}
        {...props}
      >
        {children}
      </Button>
    </span>
  );
}
