// src/app/components/leaves/ProfileCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, User, Shield } from 'lucide-react';

interface ProfileCardProps {
  userName: string;
  userRole: string;
  onLogout: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  hover: { scale: 1.01, transition: { duration: 0.2 } },
};

export const ProfileCard: React.FC<ProfileCardProps> = ({ userName, userRole, onLogout }) => {
  return (
    <motion.section
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="mt-auto pt-4 border-t border-slate-200/60"
    >
      <motion.div
        whileHover="hover"
        className="relative overflow-hidden btn-gradient from-purple-500 to-purple-600 p-4 rounded-xl shadow-md shadow-purple-200"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-400/20 rounded-full blur-xl translate-y-1/2 -translate-x-1/3" />
        
        <div className="relative flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-sm">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{userName}</p>
            <div className="flex items-center gap-1.5">
              <Shield className="h-2.5 w-2.5 text-purple-200" />
              <p className="text-[10px] text-purple-200">{userRole}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm text-white/80 hover:text-white hover:bg-white/20 transition-all"
            title="Đăng xuất"
          >
            <LogOut className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </motion.div>
    </motion.section>
  );
};