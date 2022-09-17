import React, { Component, Suspense } from 'react'
import { HashRouter,BrowserRouter,Switch, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider';
import  PersistLogin from './components/Auth/PresistentLogin'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

/* Auth Guard */
import AuthGuard from './Auth/AuthGaurd'
// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import RequireAuth from "./components/Auth/RequireAuth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Suspense fallback={loading}>
        <AuthProvider>
        <ToastContainer />
        
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            {/* <Route path="*" name="Home" element={AuthGuard(DefaultLayout)} /> */}
            {/* <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute> */}
            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth />}>
              <Route path="*" name="Home" element={<DefaultLayout />} />
              </Route>
            </Route>
            {/* <Route path="*" name="Home" element={AuthGuard(DefaultLayout)} /> */}
            {/* <Route path="*" name="Home" element={<AuthGuard Component={DefaultLayout} />} /> */}
          </Routes>
          </AuthProvider>

        </Suspense>
      </BrowserRouter>
    )
  }
}

export default App
