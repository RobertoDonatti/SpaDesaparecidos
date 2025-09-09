function getEnvVar(key: string, fallback?: string): string {
  const value = import.meta.env[key] as string | undefined;
  if (!value && !fallback) {
    throw new Error(`Variável de ambiente ${key} não definida`);
  }
  return value || fallback!;
}

export const env = {
  apiUrl: getEnvVar("VITE_API_URL"),
};