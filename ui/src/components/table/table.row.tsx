import { DatePicker } from '@mui/lab';
import { IconButton, Stack, TextField } from '@mui/material';
import { Route, RoutePartial } from '../../store/routes.slice';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import React, { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

type RoutesTableRowProps = {
  route: Route;
  index: number;
  isEditing: boolean;
  setEditing: (index: number) => void;
};

type EditingRowProps = {
  route: Route;
  setEditing: (index: number) => void;
};

const EditingRow = ({ route, setEditing }: EditingRowProps) => {
  const [routeEdit, setRouteEdit] = useState<RoutePartial>(route);

  return (
    <TableRow selected>
      <TableCell size="small">{route.id}</TableCell>
      <TableCell align="right">
        <TextField
          value={routeEdit.name}
          onChange={e =>
            setRouteEdit(route => ({ ...route, name: e.target.value }))
          }
          fullWidth
          size="small"
        />
      </TableCell>
      <TableCell align="right">
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
          />
          {')'}
        </Stack>
      </TableCell>
      <TableCell align="right">
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
          />
          {')'}
        </Stack>
      </TableCell>
      <TableCell align="right">
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
          />
          {')'}
        </Stack>
      </TableCell>
      <TableCell align="right">
        <TextField
          value={routeEdit.distance}
          onChange={e =>
            setRouteEdit(route => ({ ...route, distance: +e.target.value }))
          }
          fullWidth
          size="small"
          type="number"
        />
      </TableCell>
      <TableCell align="right">
        <DatePicker
          value={
            routeEdit.creationDate ? new Date(routeEdit.creationDate) : null
          }
          onChange={value =>
            setRouteEdit(route => ({ ...route, creationDate: value }))
          }
          renderInput={params => (
            <TextField fullWidth size="small" {...params} />
          )}
        />
      </TableCell>
      <TableCell align="right">
        <IconButton>
          <SaveIcon />
        </IconButton>
        <IconButton onClick={() => setEditing(-1)}>
          <CancelIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export const RoutesTableRow: React.FC<RoutesTableRowProps> = ({
  route,
  index,
  isEditing,
  setEditing,
}) => {
  if (isEditing) return <EditingRow route={route} setEditing={setEditing} />;
  return (
    <TableRow hover>
      <TableCell size="small">{route.id}</TableCell>
      <TableCell align="right">{route.name}</TableCell>
      <TableCell align="right">{`(${route.coordinates.x};${route.coordinates.y})`}</TableCell>
      <TableCell align="right">
        {route.from
          ? `${route.from?.name}(${route.from?.x};${route.from?.y})`
          : 'Empty'}
      </TableCell>
      <TableCell align="right">{`(${route.to.x};${route.to.y};${route.to.z})`}</TableCell>
      <TableCell align="right">{route.distance}</TableCell>
      <TableCell align="right">
        {route.creationDate.toLocaleDateString('ru')}
      </TableCell>
      <TableCell align="right">
        <IconButton onClick={() => setEditing(index)}>
          <EditIcon />
        </IconButton>
        <IconButton>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
