import { grey } from 'palette';

import { Info } from '@mui/icons-material';
import { Box, InputLabel, Tooltip } from '@mui/material';

import NotificationCount from 'components/atoms/notificationCount';

type InputLabelProps = {
  id?: string;
  label: string | number;
  tooltip?: string;
  notificationsCount?: number | string;
  isDark?: boolean;
};

export default function inputLabel({
  id,
  label,
  tooltip,
  notificationsCount,
  isDark
}: InputLabelProps): JSX.Element {
  return (
    <Box display="flex" justifyContent="space-between" width="100%">
      <Box display="flex" gap={0.5} alignItems="center">
        <InputLabel
          htmlFor={id}
          sx={{
            fontWeight: 600,
            fontSize: '12px',
            color: isDark ? grey[500] : grey[800]
          }}
        >
          {label}
        </InputLabel>
        {tooltip ? (
          <Tooltip title={tooltip}>
            <Info sx={{ fontSize: 12, color: 'grey.600' }} />
          </Tooltip>
        ) : null}
      </Box>
      {notificationsCount ? (
        <NotificationCount notificationsCount={notificationsCount} />
      ) : null}
    </Box>
  );
}
