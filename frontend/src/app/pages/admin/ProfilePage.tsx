import { ProfileHeader } from '../../components/adminComponents/profile/ProfileHeader';
import { PersonalInfo } from '../../components/adminComponents/profile/PersonalInfo';
import { ActivityStats } from '../../components/adminComponents/profile/ActivityStats'; 
import { AccountSettings } from '../../components/adminComponents/profile/AccountSettings';
import { SecuritySettings } from '../../components/adminComponents/profile/SecuritySettings';
import { ActivityHistory } from '../../components/adminComponents/profile/ActivityHistory';

export function ProfilePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      <ProfileHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PersonalInfo />
          <AccountSettings />
          <SecuritySettings />
        </div>
        
        <div className="space-y-6">
          <ActivityStats />
          <ActivityHistory />
        </div>
      </div>
    </div>
  );
}
