import { ToolCard } from "./ToolCard";

export default function ToolGroup({ group }: any) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-2">{group.name}</h2>
      <p className="text-muted-foreground mb-4">
        {group.description}
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {group.links.map((tool: any, i: number) => (
          <ToolCard key={i} tool={tool} />
        ))}
      </div>
    </div>
  );
}