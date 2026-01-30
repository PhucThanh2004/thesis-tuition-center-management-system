import { StatsCards } from '../../components/adminComponents/StatsCards';
import { QuickActions } from '../../components/adminComponents/QuickActions';
import { ChartsSection } from '../../components/adminComponents/ChartsSection';
import { StudentsTable } from '../../components/adminComponents/StudentsTable';
import { PerformanceMetrics } from '../../components/adminComponents/PerformanceMetrics';
import { TeachersList } from '../../components/adminComponents/TeachersList';
import { RecentActivities } from '../../components/adminComponents/RecentActivities';

export function AdminHomePage() {

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] bg-clip-text text-transparent">
          Dashboard Quản Lý
        </h1>
        <p className="text-gray-600 mt-2">
          Chào mừng bạn quay trở lại! Đây là tổng quan về trung tâm học thêm của bạn.
        </p>
      </div>

      <StatsCards />

      <div className="mt-8">
        <QuickActions />
      </div>

      <div className="mt-8">
        <ChartsSection />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StudentsTable />
        </div>
        <div>
          <PerformanceMetrics />
        </div>
      </div>

      <div className="mt-8">
        <TeachersList />
      </div>

      <div className="mt-8">
        <RecentActivities />
      </div>
    </main>
  );
}
