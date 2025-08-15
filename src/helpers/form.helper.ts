import type { ActionState } from '../interfaces';

export const createInitialState = <T>(): ActionState<T> => {
  return {
    errors: {},
    message: '',
  };
};
