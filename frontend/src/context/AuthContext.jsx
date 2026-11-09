import {createContext,useContext,useState,useEffect} from 'react';
import api from '../api/axios.js';
const C=createContext(null);
export const useAuth=()=>useContext(C);
export function AuthProvider({children}){ const [user,setUser]=useState(null); const [loading,setLoading]=useState(true);
 useEffect(()=>{ const t=localStorage.getItem('tv_token'); if(!t){setLoading(false);return;} api.get('/auth/me').then(r=>setUser(r.data.user)).catch(()=>localStorage.removeItem('tv_token')).finally(()=>setLoading(false)); },[]);
 const login=async(email,password)=>{ const r=await api.post('/auth/login',{email,password}); localStorage.setItem('tv_token',r.data.token); setUser(r.data.user); return r.data; };
 const register=async(data)=>{ const r=await api.post('/auth/register',data); localStorage.setItem('tv_token',r.data.token); setUser(r.data.user); return r.data; };
 const logout=async()=>{ try{await api.post('/auth/logout');}catch{} localStorage.removeItem('tv_token'); setUser(null); };
 return <C.Provider value={{user,loading,login,register,logout}}>{children}</C.Provider>; }
