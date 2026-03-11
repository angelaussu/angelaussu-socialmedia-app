"use client";

import { cn } from "@/lib/utils";

interface Tab {
  key: string;
  label: string;
}

interface ProfileTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export default function ProfileTabs({ tabs, activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="flex border-b border-neutral-900">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={cn(
            "px-6 py-3 text-md-medium transition-colors border-b-2 -mb-px",
            activeTab === tab.key
              ? "border-neutral-25 text-neutral-25 text-md-bold"
              : "border-transparent text-neutral-400"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
