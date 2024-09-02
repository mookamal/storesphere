import '../styles/globals.css';
import 'react-toastify/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='dark:bg-slate-700'>
          {children}
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </body>
    </html>
  )
}