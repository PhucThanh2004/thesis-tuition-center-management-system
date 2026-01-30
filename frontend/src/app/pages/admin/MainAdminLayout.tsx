import { EduHeader } from '../../components/adminComponents/EduHeader';
import { Outlet } from 'react-router-dom';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-[#f8faff] relative">
      <EduHeader />
      <div className="pt-20">
        <Outlet /> 
      </div>
    </div>
  );
}
