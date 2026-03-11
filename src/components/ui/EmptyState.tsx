interface EmptyStateProps {
  title: string;
  description?: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-2">
      <p className="text-md-bold text-neutral-25">{title}</p>
      {description && (
        <p className="text-sm-regular text-neutral-400 text-center max-w-xs">
          {description}
        </p>
      )}
    </div>
  );
}
