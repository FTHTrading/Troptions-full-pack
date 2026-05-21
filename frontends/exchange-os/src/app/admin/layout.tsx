// Force all admin pages to be dynamically rendered — they rely on better-sqlite3
// (a native module) which cannot run during Next.js static pre-rendering.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
