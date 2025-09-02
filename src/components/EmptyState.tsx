export default function EmptyState({ title, description }: { title: string; description?: string }) {
return (
<div>
<h3>{title}</h3>
{description && <p>{description}</p>}
</div>
)
}