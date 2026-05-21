import { HeaderBrand, NavigationMenu } from "@/components/NavigationMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:px-5 lg:px-6">
        <HeaderBrand />
        <NavigationMenu />
      </div>
    </header>
  );
}
