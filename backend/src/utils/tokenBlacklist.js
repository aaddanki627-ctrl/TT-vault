const blacklist = new Set();
export const blacklistToken = (t)=>{ if(t) blacklist.add(t); };
export const isBlacklisted = (t)=> blacklist.has(t);
