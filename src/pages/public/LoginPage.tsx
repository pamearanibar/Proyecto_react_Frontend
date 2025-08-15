import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useActionState } from 'react';
import { shemaLogin, type LoginFormValues } from '../../models';
import type { ActionState } from '../../interfaces';
import { createInitialState } from '../../helpers/form.helper';

export type LoginActionState = ActionState<LoginFormValues>;
const initialState = createInitialState<LoginFormValues>();
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const LoginPage = () => {
  const loginApi = async (
    _: LoginActionState | undefined,
    formData: FormData
  ) => {
    const rawData: LoginFormValues = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    };
    try {
      shemaLogin.parse(rawData);
      await delay(3000)
    } catch (error) {
      console.log(error);
    }
  };

  const [state, submitAction, isPending] = useActionState(
    loginApi,
    initialState
  );

  return (
    <Container component={'main'} maxWidth={'xs'}>
      <Box>
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component={'h1'} variant="h4" gutterBottom>
            LOGIN
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Proyecto Diplomado con React 19
          </Typography>

          {/* Alerta */}

          <Box action={submitAction} component={'form'} sx={{ width: '100%' }}>
            <TextField
              name="username"
              margin="normal"
              required
              fullWidth
              label="Username"
              autoComplete="username"
              autoFocus
              type="text"
              disabled={isPending}
            />
            <TextField
              name="password"
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              disabled={isPending}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, height: 48 }}
              disabled={isPending}
              startIcon={
                isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isPending ? 'Cargando...' : 'Ingresar'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
