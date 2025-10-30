import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { IoSparkles } from "react-icons/io5";

function RealHome() {
  return (
    <div className='min-h-full w-full flex items-center justify-center'>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='commonBg text-center'
      >
        <h1 className='font-azonix text-4xl mb-4'>
          WELCOME TO F1 CSR
        </h1>
        <p className='text-white/70 text-lg mb-8'>
          AI-Powered Car Setup Recommendations
        </p>
        <NavLink to='/dashboard' className='commonBtn inline-flex'>
          <IoSparkles className="text-lg" />
          GET STARTED
        </NavLink>
      </motion.div>
    </div>
  );
}

export default RealHome;