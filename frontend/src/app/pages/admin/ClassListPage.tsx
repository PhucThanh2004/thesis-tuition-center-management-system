import { ClassListSection } from "../../components/adminComponents/class/ClassListSection";
import { DashboardSummarySection } from "../../components/adminComponents/class/DashboardSummarySection";
import { useState, useRef } from "react";
import AddClassModal from "../../components/adminComponents/class/AddClassModal";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

export function ClassListPage() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const classListRef = useRef<HTMLDivElement>(null);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const scrollToClassList = () => {
    if (classListRef.current) {
      classListRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants: Variants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const contentVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
      },
    },
  };

  const listVariants: Variants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 90,
        damping: 12,
        delay: 0.3,
      },
    },
  };

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen"
    >
      <section className="relative overflow-visible bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-indigo-300 to-cyan-200 opacity-30"></div>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-r from-sky-300 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

        <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0">
          <svg 
            className="relative w-full h-auto" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 250"
            preserveAspectRatio="none"
          >
            <path 
              fill="#f3f5f7" 
              fillOpacity="0.9" 
              d="M0,256L48,240C96,224,192,192,288,186.7C384,181,480,203,576,208C672,213,768,203,864,186.7C960,171,1056,149,1152,138.7C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        <motion.div
          variants={headerVariants}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10"
        >
          <motion.div
            variants={contentVariants}
            className="relative overflow-hidden"
          >
            <div className="relative px-6 py-6 lg:px-8">
              <DashboardSummarySection 
                onAdd={() => setIsOpenModal(true)} 
                onViewDetails={scrollToClassList}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Class List Section */}
      <div ref={classListRef}>
        <motion.div
          variants={listVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8"
        >
          <ClassListSection
            key={refreshKey}
            isOpenModal={isOpenModal}
            setIsOpenModal={setIsOpenModal}
            onRefresh={handleRefresh}
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpenModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AddClassModal
              isOpen={isOpenModal}
              onClose={() => setIsOpenModal(false)}
              mode="create"
              onSuccess={handleRefresh}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}