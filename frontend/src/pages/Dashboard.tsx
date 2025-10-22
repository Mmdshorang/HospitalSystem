import { useQuery } from '@tanstack/react-query';
import { Users, UserCheck, Calendar, Activity, TrendingUp, Clock } from 'lucide-react';
import { patientService } from '../api/services/patientService';
import { doctorService } from '../api/services/doctorService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { StatsChart } from '../components/charts/StatsChart';
import { PieChart } from '../components/charts/PieChart';
import { formatDate } from '../lib/utils';

const Dashboard = () => {
  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: patientService.getAll,
  });
  const { data: doctors = [] } = useQuery({
    queryKey: ['doctors'],
    queryFn: doctorService.getAll,
  });

  const stats = [
    {
      name: 'Total Patients',
      value: patients.length,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up',
    },
    {
      name: 'Total Doctors',
      value: doctors.length,
      icon: UserCheck,
      color: 'bg-green-500',
      change: '+5%',
      trend: 'up',
    },
    {
      name: 'Today\'s Appointments',
      value: 8, // Mock data
      icon: Calendar,
      color: 'bg-purple-500',
      change: '+2',
      trend: 'up',
    },
    {
      name: 'Active Cases',
      value: 24, // Mock data
      icon: Activity,
      color: 'bg-red-500',
      change: '-3%',
      trend: 'down',
    },
  ];

  // Mock chart data
  const patientGrowthData = [
    { x: 'Jan', y: 45 },
    { x: 'Feb', y: 52 },
    { x: 'Mar', y: 48 },
    { x: 'Apr', y: 61 },
    { x: 'May', y: 67 },
    { x: 'Jun', y: 72 },
  ];

  const specializationData = [
    { x: 'Cardiology', y: 15 },
    { x: 'Neurology', y: 12 },
    { x: 'Pediatrics', y: 18 },
    { x: 'Surgery', y: 8 },
    { x: 'Other', y: 7 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Hospital Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingUp className="h-3 w-3 text-red-500 mr-1 rotate-180" />
                )}
                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Patient Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <StatsChart data={patientGrowthData} title="Patient registrations over time" />
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Doctor Specializations</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={specializationData} title="Distribution by specialization" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patients.slice(0, 5).map((patient) => (
                <div key={patient.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{patient.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(patient.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {doctors.filter(d => d.isAvailable).slice(0, 5).map((doctor) => (
                <div key={doctor.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">
                        {doctor.firstName[0]}{doctor.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Available
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
