export default function EmptyState({ title, description }: { title: string; description?: string }) {
return (
<div className="">
<h3 className="">{title}</h3>
{description && <p className="">{description}</p>}
</div>
)
}