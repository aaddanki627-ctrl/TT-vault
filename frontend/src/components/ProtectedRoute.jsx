import {Navigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.jsx';
export default function ProtectedRoute({children,roles}){ const {user,loading}=useAuth(); if(loading) return <p>Loading...</p>; if(!user) return <Navigate to='/login'/>; if(roles && !roles.includes(user.role)) return <p>Forbidden: role {user.role} not allowed</p>; return children; }
