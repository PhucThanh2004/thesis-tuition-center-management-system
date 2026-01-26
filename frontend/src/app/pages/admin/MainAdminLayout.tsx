import { EduHeader } from '../../components/Home/EduHeader';
import { Outlet } from 'react-router-dom';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-[#f8faff]">
      <EduHeader />

      <div className="pt-20 sm:pt-24">
        <Outlet /> 
      </div>
    </div>
  );
}
