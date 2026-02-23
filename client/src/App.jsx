import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Ideas from './pages/Ideas';
import Jobs from './pages/Jobs';
import SubmitIdea from './pages/SubmitIdea';
import MyIdeas from './pages/MyIdeas';
import MyApplications from './pages/MyApplications';
import MyRequests from './pages/MyRequests';
import IdeaDetails from './pages/IdeaDetails';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import JobApplications from './pages/JobApplications';
import JobDetails from './pages/JobDetails';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Ideas - Student & Investor */}
          <Route
            path="/ideas"
            element={
              <ProtectedRoute allowedRoles={['student', 'investor']}>
                <Ideas />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/idea/:id"
            element={
              <ProtectedRoute allowedRoles={['student', 'investor']}>
                <IdeaDetails />
              </ProtectedRoute>
            }
          />
          
          {/* Student - Ideas */}
          <Route
            path="/submit-idea"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <SubmitIdea />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/my-ideas"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyIdeas />
              </ProtectedRoute>
            }
          />
          
          {/* Student - Jobs */}
          <Route
            path="/jobs"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Jobs />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/job/:id"
            element={
              <ProtectedRoute allowedRoles={['student', 'employer']}>
                <JobDetails />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/my-applications"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyApplications />
              </ProtectedRoute>
            }
          />
          
          {/* Investor */}
          <Route
            path="/my-requests"
            element={
              <ProtectedRoute allowedRoles={['investor']}>
                <MyRequests />
              </ProtectedRoute>
            }
          />
          
          {/* Employer */}
          <Route
            path="/post-job"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/my-jobs"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <MyJobs />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/job/:id/applications"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <JobApplications />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
