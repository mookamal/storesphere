import { FC } from 'react';

const Admin404: FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300">
      <h1 className="text-6xl font-extrabold text-gray-800 dark:text-gray-200 mb-4">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        Sorry, the page you are looking for does not exist!
      </p>
    </div>
  );
};

export default Admin404;