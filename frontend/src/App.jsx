import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Upload from './pages/Upload.jsx';
import DocumentView from './pages/DocumentView.jsx';
import AdminAudit from './pages/AdminAudit.jsx';
import {Routes,Route} from 'react-router-dom';
export default function App(){ return <><Navbar/><Routes><Route path='/login' element={<Login/>}/><Route path='/register' element={<Register/>}/><Route path='/' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/><Route path='/upload' element={<ProtectedRoute><Upload/></ProtectedRoute>}/><Route path='/doc/:id' element={<ProtectedRoute><DocumentView/></ProtectedRoute>}/><Route path='/audit' element={<ProtectedRoute roles={['ADMIN']}><AdminAudit/></ProtectedRoute>}/></Routes></>; }
