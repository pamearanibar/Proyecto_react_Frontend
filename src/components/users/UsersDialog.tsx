import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import type { UserType } from './type';
import { useActionState } from 'react';
import type { ActionState } from '../../interfaces';
import type { TaskFormValues, UserFormValues } from '../../models';
import { createInitialState } from '../../helpers';
import type { User } from '../../contexts';

export type UsersActionState = ActionState<UserFormValues>;

interface Props {
  openDialog: boolean; // 👈 nombre igual al que usas en UsersPage
  user?: UserType | null;
  handleCloseDialog: () => void;
  handleCreateEdit: (
    _: UsersActionState | undefined,
    formData: FormData
  ) => Promise<UsersActionState | undefined>;
}
export const UsersDialog = ({ handleCloseDialog, openDialog, user, handleCreateEdit }: Props) => {
  const initialState = createInitialState<UserFormValues>();

  const [state, submitAction, isPending] = useActionState(
    handleCreateEdit,
    initialState
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle>{user ? 'Editar usuario' : 'Nuevo usuario'}</DialogTitle>
      <Box key={user?.id ?? 'new'} component="form" action={submitAction}>
        <DialogContent>
          <TextField
            name="username"
            label="Usuario"
            fullWidth
            required
            disabled={isPending}
            defaultValue={state?.formData?.username || user?.username || ''}
            error={!!state?.errors?.username}
            helperText={state?.errors?.username}
            sx={{ mb: 2 }}
          />
          <TextField
            name="password"
            type={showPassword ? "text" : "password"}   // 👈 toggle
            label="Contraseña"
            fullWidth
            required
            disabled={isPending}
            defaultValue={state?.formData?.password || ""}
            error={!!state?.errors?.password}
            helperText={state?.errors?.password}
            sx={{ mb: 2 }}
            InputProps={{ 
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)} 
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}         
          />
          <TextField
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}   
            label="Confirmar Contraseña"
            fullWidth
            required
            disabled={isPending}
            defaultValue={state?.formData?.confirmPassword || ""}
            error={!!state?.errors?.confirmPassword}
            helperText={state?.errors?.confirmPassword}
            sx={{ mb: 2 }}
            InputProps={{                                    
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword((prev) => !prev)} // 👈 toggle
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={isPending}>
            {user ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

