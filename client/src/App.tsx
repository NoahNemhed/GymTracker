import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import './App.css'
import ProtectedRoute from "./components/ProtectedRoute";
import ProgramsPage from "./pages/ProgramsPage";
import ProgramDetailPage from './pages/ProgramDetailPage'
import ActiveWorkoutPage from "./components/Workout/ActiveWorkoutPage";


function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/programs/:id" element={<ProgramDetailPage />} />
          <Route path="/workout/active/:programId/:dayId" element={<ActiveWorkoutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
