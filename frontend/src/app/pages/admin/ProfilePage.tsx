import { ProfileHeader } from '../../components/adminComponents/profile/ProfileHeader';
import { PersonalInfo } from '../../components/adminComponents/profile/PersonalInfo';
import { ActivityStats } from '../../components/adminComponents/profile/ActivityStats'; 
import { AccountSettings } from '../../components/adminComponents/profile/AccountSettings';
import { SecuritySettings } from '../../components/adminComponents/profile/SecuritySettings';
import { ActivityHistory } from '../../components/adminComponents/profile/ActivityHistory';
import { motion } from 'framer-motion';

interface ProfilePageProps {
  isTeacher?: boolean;
}

// Animation variants với as const
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
} as const;

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12
    }
  }
} as const;

const cardVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 30 
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15
    }
  }
} as const;

export function ProfilePage({ isTeacher = false }: ProfilePageProps) {
  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <ProfileHeader isTeacher={isTeacher} />
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        <motion.div 
          className="lg:col-span-2 space-y-6"
          variants={containerVariants}
        >
          <motion.div variants={cardVariants}>
            <PersonalInfo />
          </motion.div>
          <motion.div variants={cardVariants}>
            <AccountSettings />
          </motion.div>
          <motion.div variants={cardVariants}>
            <SecuritySettings />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
        >
          <motion.div variants={cardVariants}>
            <ActivityStats />
          </motion.div>
          <motion.div variants={cardVariants}>
            <ActivityHistory />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}