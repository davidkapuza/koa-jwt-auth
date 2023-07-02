import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../gloabls.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
