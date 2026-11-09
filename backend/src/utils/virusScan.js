const BLOCKED_EXT=['.exe','.bat','.sh','.msi','.dll','.scr','.ps1'];
const BLOCKED_MIME=['application/x-msdownload','application/x-sh'];
export const validateFile=(file)=>{
  if(!file) return 'No file';
  const name=(file.originalname||'').toLowerCase();
  if(BLOCKED_EXT.some(e=>name.endsWith(e))) return 'Blocked file type';
  if(BLOCKED_MIME.includes(file.mimetype)) return 'Blocked mime type';
  if(file.size>10*1024*1024) return 'File too large (max 10MB)';
  const buf=file.buffer;
  if(buf && buf.length>=2 && buf[0]===0x4D && buf[1]===0x5A) return 'Executable signature blocked';
  return null;
};
export const ALLOWED_EXT=['.pdf','.docx','.txt','.png','.jpg','.jpeg'];
