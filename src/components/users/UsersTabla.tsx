import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import type { UserType } from './type';
import { Box, Chip, IconButton, Stack, Tooltip } from '@mui/material';
import {
  Edit as EditIcon,
  Undo as UndoIcon,
  Done as DoneIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { GridSortModel } from '@mui/x-data-grid';

interface Props {
  users: UserType[];
  rowCount: number;
  paginationModel: GridPaginationModel;
  setPaginationModel: (model: GridPaginationModel) => void;
  sortModel: GridSortModel;
  setSortModel: (model: GridSortModel) => void;
  handleDelete: (id: number) => void;
  handleDone: (id: number, done: boolean) => void;
  handleOpenEditDialog: (task: UserType) => void;
  handleToggleStatus: (id: number, currentStatus: string) => void;
}

export const UsersTabla = ({
  users,
  rowCount,
  paginationModel,
  setPaginationModel,
  setSortModel,
  sortModel,
  handleDelete,
  handleDone: handledone,
  handleOpenEditDialog,
  handleToggleStatus,
}: Props) => {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'username', headerName: 'Usuario', flex: 1 },
    {
      field: 'status',
      headerName: 'Estado',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value === 'active' ? 'activo' : 'inactivo'}
          color={params.value === 'active' ? 'success' : 'warning'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      sortable: false,
      filterable: false,
      width: 250,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={1}>
          {/* Editar */}
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => handleOpenEditDialog(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Activar / Inactivar */}
          <Tooltip title={params.row.status === 'active' ? 'Inactivar' : 'Activar'}>
            <IconButton
              size="small"
              color={params.row.status === 'active' ? 'warning' : 'success'}
              onClick={() => handleToggleStatus(params.row.id, params.row.status)} // 👈 usa status
            >
              {params.row.status === 'active' ? (
                <UndoIcon fontSize="small" />   
              ) : (
                <DoneIcon fontSize="small" />  
              )}
            </IconButton>
          </Tooltip>

          {/* Eliminar */}
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box height={545}>
      <DataGrid
        rows={users}
        columns={columns}
        rowCount={rowCount}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortingMode="client"
        pageSizeOptions={[5, 10, 20]}
        disableColumnFilter
      />
    </Box>
  );
};
