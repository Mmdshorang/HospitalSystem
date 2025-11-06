import React from "react";
import { Link } from "react-router-dom";

type StatItem = {
  name: string;
  value: number | string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string; // tailwind bg-*
  link: string;
};

type StatsGridProps = {
  stats: StatItem[];
};

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Link key={stat.name} to={stat.link} className="block">
            <div className="card p-6 text-center">
              <div className="flex items-center justify-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="font-medium text-gray-900">{stat.name}</p>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <p className="text-2xl font-extrabold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default StatsGrid;
