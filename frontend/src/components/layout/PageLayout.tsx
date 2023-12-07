import Navbar from '@src/components/layout/navbar/Navbar';
import Footer from '@src/components/layout/Footer';
import ThemeProvider from '../misc/ThemeProvider';

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <Navbar />
      {children}
      <Footer />
    </ThemeProvider>
  );
}
