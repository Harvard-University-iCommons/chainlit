import { Box, FormControl, FormHelperText } from '@mui/material';

import InputLabel from 'components/molecules/inputLabel';

import { IInput } from 'types/Input';

export type InputStateHandlerProps = {
  children: React.ReactNode;
} & IInput;

export default function InputStateHandler(
  props: InputStateHandlerProps
): JSX.Element {
  const {
    children,
    description,
    hasError,
    id,
    label,
    notificationsCount,
    tooltip,
    isDark
  } = props;
  return (
    <Box width="100%">
      {label ? (
        <InputLabel
          id={id}
          label={label}
          tooltip={tooltip}
          notificationsCount={notificationsCount}
          isDark={isDark || false}
        />
      ) : null}
      <FormControl error={hasError} fullWidth aria-label={label}>
        {children}
        {description ? <FormHelperText>{description}</FormHelperText> : null}
      </FormControl>
    </Box>
  );
}
