import { Users, UserCheck, Calendar, Activity, Icon, Shield } from 'lucide-react';

const Home = () => {
  // Mock data for simple dashboard
  const stats = [
    {
      name: 'تعداد کاربران',
      value: 150,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'تعداد پزشکان',
      value: 25,
      icon: UserCheck,
      color: 'bg-green-500',
    },
    {
      name: 'تعداد کلینیک ها',
      value: 8,
      icon: Calendar,
      color: 'bg-purple-500',
    },
    {
      name: 'تعداد بیمه های تعریف شده',
      value: 24,
      icon: Shield,
      color: 'bg-orange-500',
    },
  ];

  return (
    <>
    <div>
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-600">داشبورد</h1>
        <p className="mt-2 text-gray-600">نمای کلی سیستم مدیریت بیمارستان</p>
      </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          return (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="mr-4">
                  <p className="font-medium text-gray-900">{stat.name}</p>
                  <p className="text-sm text-gray-500">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>  
    </div>
    <div>
      
    </div>
    </>
  );
};
export default Home;