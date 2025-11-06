import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

type QuickAction = {
  title: string;
  to: string;
};

type QuickActionsProps = {
  actions: QuickAction[];
};

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <div className="card p-6 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">اقدامات سریع</h2>
        <PlusCircle className="h-5 w-5 text-primary-600" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.to}
            className="w-full text-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
          >
            {action.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
