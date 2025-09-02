import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // .env deve ter VITE_API_URL=https://abitus-api.geia.vip
  timeout: 15000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const msg =
      status === 404 ? "Recurso não encontrado." :
      status === 400 ? "Requisição inválida." :
      status === 500 ? "Erro no servidor." :
      "Erro de rede. Tente novamente.";
    return Promise.reject(new Error(msg));
  }
);
