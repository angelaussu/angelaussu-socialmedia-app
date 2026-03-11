interface Stat {
  label: string;
  value: number;
}

export default function ProfileStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="flex items-center gap-0">
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex items-center">
          <div className="flex flex-col items-center px-6">
            <span className="text-xl-bold text-neutral-25">{stat.value}</span>
            <span className="text-md-regular text-neutral-400">{stat.label}</span>
          </div>
          {i < stats.length - 1 && (
            <div className="w-px h-10 bg-neutral-900" />
          )}
        </div>
      ))}
    </div>
  );
}
