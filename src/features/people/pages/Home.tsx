import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listPeople } from "../api";
import CardPessoa from "../components/CardPessoa";
import type { Pessoa } from "../types";
import FiltroFormulario from "../components/FiltroFormulario";

export default function Home() {
  const [sp, setSp] = useSearchParams();
  const page = Number(sp.get("page") || 1);
  const q = sp.get("q") || "";
  const sexo = (sp.get("sexo") as 'M'|'F'|'N'|null) ?? undefined;
  const cidade = sp.get("cidade") || "";

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["people", { page, q, sexo, cidade }],
    queryFn: () => listPeople({ page, size: 12, q, sexo, cidade }),
    staleTime: 30_000,
  });

  const onSubmitFiltro = (val: { q?: string; sexo?: string; cidade?: string }) => {
    if (val.q != null) sp.set("q", val.q);
    if (val.sexo != null) sp.set("sexo", val.sexo);
    if (val.cidade != null) sp.set("cidade", val.cidade);
    sp.set("page", "1");
    setSp(sp, { replace: true });
  };

  if (isLoading) return <div>Carregando…</div>;
  if (isError) return (
    <div>
      <p>Erro: {(error as Error).message}</p>
      <button onClick={() => refetch()}>Tentar novamente</button>
    </div>
  );

  const items: Pessoa[] = (data?.items as Pessoa[]) ?? [];
  return (
    <div>
  <FiltroFormulario defaultValues={{ q, sexo, cidade }} onSubmit={onSubmitFiltro} />

      {items.length === 0 ? (
        <p>Nenhum registro encontrado.</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {items.map((p: Pessoa) => (
              <CardPessoa key={p.id} {...p} />
            ))}
          </div>

      {data?.totalPages && data.totalPages > 1 && (
            <div>
              <button
                disabled={page <= 1}
                onClick={() => { sp.set("page", String(page - 1)); setSp(sp, { replace: true }); }}
              >
                Anterior
              </button>
        <span> Página {page} de {data.totalPages} </span>
              <button
                disabled={page >= data.totalPages}
                onClick={() => { sp.set("page", String(page + 1)); setSp(sp, { replace: true }); }}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
