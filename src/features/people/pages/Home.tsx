import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listPeople } from "../api";
import CardPessoa from "../components/CardPessoa";
import type { Pessoa } from "../types";

function Home() {
    const [sp] = useSearchParams();
    const registros = Number(sp.get("registros") || 12);

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
            <p>Exibindo {items.length} registros</p>
          </div>
        </div>

        {items.length === 0 ? (
          <p style={{ textAlign: 'center', padding: 40 }}>Nenhum registro encontrado.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, maxWidth: 1200, margin: '0 auto' }}>
            {items.map((p: Pessoa) => (
              <CardPessoa key={p.id} {...p} />
            ))}
          </div>
        )}
      </div>
    );
}

export default Home;