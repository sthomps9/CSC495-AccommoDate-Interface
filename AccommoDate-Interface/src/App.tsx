import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import NavigationBar from './components/NavigationBar';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired, logout, getToken } from "./services/auth";
import CoursesPage from './pages/CoursesPage';
import ExamsPage from './pages/ExamsPage';
import MeetingsPage from './pages/MeetingsPage';
export default function App() {
  
  return (
    <>
      <Routes>
       <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/courses" 
          element={
            <ProtectedRoute>
              <CoursesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/meetings" 
          element={
            <ProtectedRoute>
              <MeetingsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/exams" 
          element={
            <ProtectedRoute>
              <ExamsPage />
            </ProtectedRoute>
          } 
        />
         <Route path="/" element={<App />}></Route>
        <Route path="*" element={<Navigate to={getToken() ? '/home' : '/login'} />} />
        </Routes>
    </>
  );
}