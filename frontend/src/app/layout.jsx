import '../styles/globals.css';
import SessionProvider from "../providers/AuthNextProvider";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='dark:bg-slate-700'>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}