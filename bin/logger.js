export const logInfo = (msg) => console.log(`\x1b[36m[N-NEX]\x1b[0m ${msg}`);
export const logSuccess = (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`);
export const logError = (msg) => console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`);
export const logWarning = (msg) => console.warn(`\x1b[33m[WARN]\x1b[0m ${msg}`);
