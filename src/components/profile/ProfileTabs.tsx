"use client";

import { cn } from "@/lib/utils";
import { Gallery, Bookmark, Heart } from "iconsax-react";

interface Tab {
  key: string;
  label: string;
}

interface ProfileTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

const TAB_ICONS: Record<string, React.ElementType> = {
  gallery: Gallery,
  saved: Bookmark,
  liked: Heart,
};

export default function ProfileTabs({ tabs, activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="flex border-b border-neutral-900">
      {tabs.map((tab) => {
        const Icon = TAB_ICONS[tab.key];
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 transition-colors border-b-2 -mb-px",
              isActive
                ? "border-neutral-25 text-neutral-25"
                : "border-transparent text-neutral-400"
            )}
          >
            {Icon && (
              <Icon size={18} color="currentColor" variant={isActive ? "Bold" : "Linear"} />
            )}
            <span className={isActive ? "text-md-bold" : "text-md-regular"}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
