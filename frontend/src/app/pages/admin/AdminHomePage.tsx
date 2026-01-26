import { useAuth } from '../../contexts/AuthContext';

export function AdminHomePage() {
  const { user } = useAuth();

  return (
    <div className="relative ">
      <p className="text-gray-600">
        Xin chào <b>{user?.fullName}</b>
        
      </p>
    </div>
  );
}
