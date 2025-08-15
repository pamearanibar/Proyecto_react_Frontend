import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage, NotFoundPage } from '../pages/public';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="./login" />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
};
