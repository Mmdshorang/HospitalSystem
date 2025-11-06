import React from "react";
import { Link } from "react-router-dom";

type ShortcutItem = {
  to: string;
  label: string;
};

type ManagementShortcutsProps = {
  items: ShortcutItem[];
  title?: string;
};

const ManagementShortcuts: React.FC<ManagementShortcutsProps> = ({
  items,
  title = "میانبرهای مدیریت",
}) => {
  return (
    <div className="card p-6 lg:col-span-1">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="px-4 py-2 rounded border text-sm hover:bg-gray-50"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ManagementShortcuts;
