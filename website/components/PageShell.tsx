import Nav from "./Nav";
import Footer from "./Footer";

// Standard wrapper for every inner page: fixed nav on top, footer below.
export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative">
      <Nav />
      {children}
      <Footer />
    </main>
  );
}
