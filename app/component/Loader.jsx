import React from 'react';
import { motion } from 'framer-motion';

export function Loader() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-4 h-4 bg-blue-500 rounded-full"
            animate={{
              y: ["0%", "-100%", "0%"],
              backgroundColor: ["#3B82F6", "#60A5FA", "#3B82F6"]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-black/80 p-8 px-12 rounded-lg shadow-xl"
      >
        <Loader />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white text-center mt-4 font-medium"
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
} 