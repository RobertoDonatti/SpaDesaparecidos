import { useQuery } from "@tanstack/react-query";
import { listPeople } from "../api";
import CardPessoa from "../components/CardPessoa";
import type { Pessoa } from "../types";

function Home() {
    // Solicitar mais registros para garantir que sempre tenhamos pelo menos 12
    const registros = 20; // Aumentei para 20 para ter margem de segurança

    const { data, isLoading, isError, error, refetch } = useQuery({
      queryKey: ["people", { registros }],
      queryFn: () => listPeople({ registros }),
      staleTime: 30_000,
      retry: 3,
    });

    if (isLoading) return <div style={{ padding: 20, textAlign: 'center' }}>Carregando…</div>;
    if (isError) return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <p>Erro: {(error as Error).message}</p>
        <button onClick={() => refetch()}>Tentar novamente</button>
      </div>
    );

    const items: Pessoa[] = data ?? [];

    return (
      <div style={{ padding: 20 }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ textAlign: 'center', marginBottom: 20, fontSize: 24, fontWeight: 600 }}>Resultado</h2>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <p>Exibindo {Math.min(items.length, 12)} de 12 registros por página</p>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 16, 
          maxWidth: 1200, 
          margin: '0 auto' 
        }}>
          {/* Sempre exibir exatamente 12 registros */}
          {items.slice(0, 12).map((pessoa: Pessoa) => (
            <CardPessoa key={pessoa.id} {...pessoa} />
          ))}
        </div>
      </div>
    );
}

export default Home;