import { Box } from "@mui/material";    
import { useAlert, useAxios } from '../../hooks';
import {
  UsersDialog,
  UsersFilter,
  UsersHeader,
  UsersTabla,
  type UsersActionState,
} from '../../components';

import { useEffect, useState } from 'react';
import type { UsersFilterDoneType, UserType } from '../../components/users/type';
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { errorHelper, hanleZodError } from '../../helpers';
import { schemaUser, type TaskFormValues } from '../../models';
import type { UserFormValues } from '../../models/userModel';

export const UsersPage = () => {
    const { showAlert } = useAlert();
    const axios = useAxios();

    const [filterst, setFilterStatus] = useState<UsersFilterDoneType>('all');
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState<UserType[]>([]);
    const [total, setTotal] = useState(0);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
      page: 1,
      pageSize: 10,
    });
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
      listUsersApi();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, filterst, paginationModel, sortModel]);

    const listUsersApi = async () => {
      try {
        const orderBy = sortModel[0]?.field;
        const orderDir = sortModel[0]?.sort;
        const response = await axios.get('/users', {
          params: {
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
            orderBy,
            orderDir,
            search,
            status: filterst === 'all' ? undefined : filterst,
          },
        });
        setUsers(response.data);
        setTotal(response.data.length);
      } catch (error) {
        showAlert(errorHelper(error), 'error');
      }
    };
    
    const normalizedStatus =
    filterst.toLowerCase() === 'active' ? 'active' :
    filterst.toLowerCase() === 'inactive' ? 'inactive' :
    'all';

    const filteredUsers = users.filter((user) => {
      const matchesSearch = user.username
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        filterst === 'all' || user.status === normalizedStatus;
      return matchesSearch && matchesStatus;
    });

    const handleOpenCreateDialog = () => {
      setOpenDialog(true);
      setUser(null);
    };

    const handleCloseDialog = () => {
      setOpenDialog(false);
      setUser(null);
    };    

    const handleOpenEditDialog = (user: UserType) => {
      setOpenDialog(true);
      setUser(user);
    };

    const handleCreateEdit = async (
  _: UsersActionState | undefined,
  formData: FormData
) => {
  try {
    const parsedData = schemaUser.parse({
      username: formData.get('username'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    if (user?.id) {
      await axios.put(`/users/${user.id}`, parsedData);
      showAlert('Usuario editado', 'success');
    } else {
      await axios.post('/users', parsedData);
      showAlert('Usuario creado', 'success');
    }
    listUsersApi();
    handleCloseDialog();
    return;
  } catch (error) {
    const err = hanleZodError<UserFormValues>(error, {});
    showAlert(err.message, 'error');
    return err;
      }
    } 

    const handleDelete = async (id: number) => {
      try {
        await axios.delete(`/users/${id}`);  
        showAlert('Usuario eliminado', 'success');
        listUsersApi();
      } catch (error) {
        showAlert(errorHelper(error), 'error');
      }
    };  

    const handleDone = async (id: number, done: boolean) => {
      try {
        await axios.patch(`/users/${id}`, { done: !done });
        showAlert('Usuario modificado', 'success');
        listUsersApi();
      } catch (error) {
        showAlert(errorHelper(error), 'error');
      }
    };

    const handleToggleStatus = async (id: number) => {
      try {
        await axios.patch(`/users/${id}/status`);
        showAlert("Estado actualizado", "success");
        listUsersApi();
      } catch (error) {
        showAlert(errorHelper(error), "error");
      }
    };



    return (
    <Box sx={{ width: '100%' }}>    
        <UsersHeader handleOpenCreateDialog={handleOpenCreateDialog}  />
        <UsersFilter 
          filterStatus={filterst}
          setFilterStatus={setFilterStatus}
          setSearch={setSearch}></UsersFilter>

        <UsersTabla
          users={filteredUsers}
          rowCount={total}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          sortModel={sortModel}
          setSortModel={setSortModel}
          //handleOpenCreateDialog ={handleOpenCreateDialog}
          handleOpenEditDialog={handleOpenEditDialog}
          handleDelete={handleDelete}
          handleDone={handleDone}
          handleToggleStatus={handleToggleStatus}

        />
        <UsersDialog
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          handleCreateEdit={handleCreateEdit}
          user={user}
        />
    </Box>); 
};
