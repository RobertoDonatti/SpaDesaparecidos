/**
 * Função utilitária para logs apenas em desenvolvimento
 */
export const devLog = (...args: any[]) => {
    if (import.meta.env.DEV) {
        console.log(...args);
    }
};

/**
 * Função utilitária para logs de erro apenas em desenvolvimento
 */
export const devError = (...args: any[]) => {
    if (import.meta.env.DEV) {
        console.error(...args);
    }
};

/**
 * Função utilitária para logs de warning apenas em desenvolvimento
 */
export const devWarn = (...args: any[]) => {
    if (import.meta.env.DEV) {
        console.warn(...args);
    }
};
