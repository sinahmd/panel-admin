// import { loginSuccess, logout, setRole } from './auth.actions';
// import { createAction } from '@ngrx/store';
// export interface AuthState {
//   isAuthenticated: boolean;
//   role: number;
// }

// export const initialState: AuthState = {
//   isAuthenticated: false,
//   role: 0, // Default role is 'normal user'
// };

// export const authReducer = createReducer(
//   initialState,
//   on(loginSuccess, (state, { role }) => ({
//     ...state,
//     isAuthenticated: true,
//     role: role,
//   })),
//   on(logout, (state) => ({
//     ...state,
//     isAuthenticated: false,
//     role: 0,
//   })),
//   on(setRole, (state, { role }) => ({
//     ...state,
//     role: role,
//   }))
// );
