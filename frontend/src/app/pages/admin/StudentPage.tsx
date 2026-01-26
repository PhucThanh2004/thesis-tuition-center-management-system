import { useAuth } from '../../contexts/AuthContext';

export function StudentPage() {
  const { user } = useAuth();

  return (
    <div className="relative">
      <h1 className="text-2xl font-semibold text-gray-800">Trang học sinh</h1>
      <p className="text-gray-600 mt-4">
        Xin chào <b>{user?.fullName}</b>, đây là trang dành cho học sinh.
      </p>
    </div>
  );
}
