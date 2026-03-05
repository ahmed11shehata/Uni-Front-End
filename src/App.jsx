import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import { Toaster } from "react-hot-toast";

import LoginPage from "./pages/auth/LoginPage";

import StudentDashboard       from "./pages/student/StudentDashboard";
import GradesPage             from "./pages/student/GradesPage";
import TimetablePage          from "./pages/student/TimetablePage";
import QuizzesPage            from "./pages/student/QuizzesPage";
import AssignmentsPage        from "./pages/student/AssignmentsPage";
import AIToolsPage            from "./pages/student/AIToolsPage";
import CourseRegistrationPage from "./pages/student/CourseRegistrationPage";
import CoursesPage            from "./pages/student/CoursesPage";

import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import QuizBuilderPage     from "./pages/instructor/QuizBuilderPage";
import AssignmentMgmtPage  from "./pages/instructor/AssignmentMgmtPage";
import LectureUploadPage   from "./pages/instructor/LectureUploadPage";
import GradesMgmtPage      from "./pages/instructor/GradesMgmtPage";

import AdminDashboard   from "./pages/admin/AdminDashboard";
import RegisterUserPage from "./pages/admin/RegisterUserPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" toastOptions={{ style: { fontFamily: "Sora" } }} />
        <Routes>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Student */}
          <Route element={<ProtectedRoute allowedRoles={["student"]}><MainLayout /></ProtectedRoute>}>
            <Route path="/student/dashboard"        element={<StudentDashboard />} />
            <Route path="/student/grades"           element={<GradesPage />} />
            <Route path="/student/timetable"        element={<TimetablePage />} />
            <Route path="/student/quizzes"          element={<QuizzesPage />} />
            <Route path="/student/assignments"      element={<AssignmentsPage />} />
            <Route path="/student/ai-tools"         element={<AIToolsPage />} />
            <Route path="/student/register-courses" element={<CourseRegistrationPage />} />
            <Route path="/student/courses"          element={<CoursesPage />} />
          </Route>

          {/* Instructor */}
          <Route element={<ProtectedRoute allowedRoles={["instructor"]}><MainLayout /></ProtectedRoute>}>
            <Route path="/instructor/dashboard"    element={<InstructorDashboard />} />
            <Route path="/instructor/quiz-builder" element={<QuizBuilderPage />} />
            <Route path="/instructor/assignments"  element={<AssignmentMgmtPage />} />
            <Route path="/instructor/lectures"     element={<LectureUploadPage />} />
            <Route path="/instructor/grades"       element={<GradesMgmtPage />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]}><MainLayout /></ProtectedRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/register"  element={<RegisterUserPage />} />
          
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}