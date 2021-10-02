import * as React from 'react';
import { DatePicker } from '@mui/lab';
import { RoutePartial } from '../../store/routes.slice';
import { Stack } from '@mui/material';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

type EditRoutePopupProps = {
  route: RoutePartial;
  isOpen: boolean;
  onSubmit: (route: RoutePartial) => void;
  onClose: () => void;
};

export const EditRoutePopup: React.FC<EditRoutePopupProps> = ({
  route,
  isOpen,
  onSubmit,
  onClose,
}) => {
  const [routeEdit, setRouteEdit] = useState(route);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Edit Route</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          {routeEdit.id && <div>ID: {routeEdit.id}</div>}
          <div>Name</div>
          <TextField
            value={routeEdit.name}
            onChange={e =>
              setRouteEdit(route => ({ ...route, name: e.target.value }))
            }
            fullWidth
            size="small"
            label="Name"
          />
          <div>Coordinates</div>
          <Stack direction="row" alignItems="center">
            {'('}
            <TextField
              value={routeEdit.coordinates.x}
              onChange={e =>
                setRouteEdit(route => ({
                  ...route,
                  coordinates: { ...route.coordinates, x: +e.target.value },
                }))
              }
              size="small"
              type="number"
              label="X"
            />
            {';'}
            <TextField
              value={routeEdit.coordinates.y}
              onChange={e =>
                setRouteEdit(route => ({
                  ...route,
                  coordinates: { ...route.coordinates, y: +e.target.value },
                }))
              }
              size="small"
              type="number"
              label="Y"
            />
            {')'}
          </Stack>
          <div>From</div>
          <Stack direction="row" alignItems="center">
            <TextField
              value={routeEdit.from?.name}
              onChange={e =>
                setRouteEdit(route => ({
                  ...route,
                  from: {
                    ...route.from,
                    x: route.from?.x || 0,
                    y: route.from?.y || 0,
                    name: e.target.value,
                  },
                }))
              }
              size="small"
              label="Name"
            />
            {'('}
            <TextField
              value={routeEdit.from?.x}
              onChange={e =>
                setRouteEdit(route => ({
                  ...route,
                  from: {
                    ...route.from,
                    y: route.from?.y || 0,
                    x: +e.target.value || 0,
                  },
                }))
              }
              size="small"
              type="number"
              label="X"
            />
            {';'}
            <TextField
              value={routeEdit.from?.y}
              onChange={e =>
                setRouteEdit(route => ({
                  ...route,
                  from: {
                    ...route.from,
                    x: route.from?.x || 0,
                    y: +e.target.value || 0,
                  },
                }))
              }
              size="small"
              type="number"
              label="Y"
            />
            {')'}
          </Stack>
          <div>To</div>
          <Stack direction="row" alignItems="center">
            {'('}
            <TextField
              value={routeEdit.to.x}
              onChange={e =>
                setRouteEdit(route => ({
                  ...route,
                  to: { ...route.to, x: +e.target.value },
                }))
              }
              size="small"
              type="number"
              label="X"
            />
            {';'}
            <TextField
              value={routeEdit.to.y}
              onChange={e =>
                setRouteEdit(route => ({
                  ...route,
                  to: { ...route.to, y: +e.target.value },
                }))
              }
              size="small"
              type="number"
              label="Y"
            />
            {';'}
            <TextField
              value={routeEdit.to.z}
              onChange={e =>
                setRouteEdit(route => ({
                  ...route,
                  to: { ...route.to, z: +e.target.value },
                }))
              }
              size="small"
              type="number"
              label="Z"
            />
            {')'}
          </Stack>
          <div>Distance</div>
          <TextField
            value={routeEdit.distance}
            onChange={e =>
              setRouteEdit(route => ({ ...route, distance: +e.target.value }))
            }
            fullWidth
            size="small"
            type="number"
            label="Distance"
          />
          <div>Creation Date</div>
          <DatePicker
            value={
              routeEdit.creationDate ? new Date(routeEdit.creationDate) : null
            }
            onChange={value =>
              value &&
              setRouteEdit(route => ({ ...route, creationDate: value }))
            }
            renderInput={params => (
              <TextField fullWidth size="small" {...params} />
            )}
            label="Creation Date"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSubmit(routeEdit)}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};