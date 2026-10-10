// При запрете хранилища продолжаем работать с копией в памяти.
export function createStorage(getStorage = () => globalThis.localStorage) {
 const memory = new Map();
 return {
  read(key, fallback) {
   try {const raw=getStorage().getItem(key); if(raw!==null){const value=JSON.parse(raw);memory.set(key,value);return value;}}
   catch {return memory.has(key)?memory.get(key):fallback;}
   return memory.has(key)?memory.get(key):fallback;
  },
  write(key,value){memory.set(key,value);try{getStorage().setItem(key,JSON.stringify(value));}catch{/* Сессия остаётся доступной без localStorage. */}}
 };
}
