import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { DocsNav } from "@/components/docs/DocsNav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="container" style={{ display: "grid", gridTemplateColumns: "220px minmax(0, 1fr)", gap: 40, padding: "40px 28px 90px", alignItems: "start" }}>
        <aside style={{ display: "var(--docs-aside, block)" }} className="docs-aside">
          <DocsNav />
        </aside>
        <main style={{ maxWidth: 760, minWidth: 0 }}>{children}</main>
      </div>
      <Footer />
    </>
  );
}
