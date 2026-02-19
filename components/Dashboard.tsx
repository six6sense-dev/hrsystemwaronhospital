import React from 'react';
import { 
  Users, 
  UserPlus, 
  Stethoscope, 
  Activity,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { Employee, Department } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardProps {
  employees: Employee[];
}

const Dashboard: React.FC<DashboardProps> = ({ employees }) => {
  // Calculate stats
  const totalEmployees = employees.length;
  const fullTime = employees.filter(e => e.status === 'Full Time').length;
  const avgPerformance = (employees.reduce((acc, curr) => acc + (curr.performanceRating || 0), 0) / totalEmployees).toFixed(1);

  // Department data for Pie Chart
  const deptCounts = employees.reduce((acc, curr) => {
    acc[curr.department] = (acc[curr.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(deptCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5', '#fff7ed'];

  // Mock Attendance data for Bar Chart
  const attendanceData = [
    { name: 'Mon', present: 95 },
    { name: 'Tue', present: 92 },
    { name: 'Wed', present: 96 },
    { name: 'Thu', present: 88 },
    { name: 'Fri', present: 90 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-500">Total Karyawan</p>
              <h3 className="text-3xl font-bold text-zinc-900 mt-2">{totalEmployees}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span className="font-medium">+4%</span>
            <span className="text-zinc-400 ml-1">dari bulan lalu</span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-500">Karyawan Tetap</p>
              <h3 className="text-3xl font-bold text-zinc-900 mt-2">{fullTime}</h3>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Stethoscope className="w-6 h-6 text-orange-600" />
            </div>
          </div>
           <div className="mt-4 flex items-center text-sm text-zinc-400">
            <span>Stabilitas tinggi</span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-500">Avg. Performance</p>
              <h3 className="text-3xl font-bold text-zinc-900 mt-2">{avgPerformance}</h3>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Activity className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span className="font-medium">+0.2</span>
            <span className="text-zinc-400 ml-1">points</span>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-500">On Leave</p>
              <h3 className="text-3xl font-bold text-zinc-900 mt-2">1</h3>
            </div>
            <div className="p-2 bg-rose-50 rounded-lg">
              <Clock className="w-6 h-6 text-rose-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-zinc-400">
            <span>Tindakan diperlukan</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charts Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
          <h3 className="text-lg font-bold text-zinc-800 mb-4">Distribusi Departemen</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#ea580c"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
             {pieData.map((entry, index) => (
               <div key={entry.name} className="flex items-center text-xs text-zinc-600">
                 <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                 {entry.name}
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
          <h3 className="text-lg font-bold text-zinc-800 mb-4">Kehadiran Mingguan (%)</h3>
           <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="present" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;