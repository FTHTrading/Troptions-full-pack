import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { PageTemplate } from "@/components/troptions-old-money/PageTemplate";
import { OLD_MONEY_DISCLAIMER, OLD_MONEY_NAV, OLD_MONEY_PAGES } from "@/content/troptions-old-money/pages";

describe("old-money institutional brand system", () => {
  it("includes all required route entries", () => {
    const routes = OLD_MONEY_NAV.map((item) => item.href);
    const required = [
      "/troptions-old-money/overview",
      "/troptions-old-money/institutional",
      "/troptions-old-money/rwa",
      "/troptions-old-money/gold",
      "/troptions-old-money/energy",
      "/troptions-old-money/proof",
      "/troptions-old-money/settlement",
      "/troptions-old-money/custody",
      "/troptions-old-money/reports",
      "/troptions-old-money/annual-letter",
      "/troptions-old-money/governance",
      "/troptions-old-money/contact",
    ];

    for (const route of required) {
      expect(routes).toContain(route);
    }
  });

  it("renders each page with the required legal disclaimer", () => {
    for (const page of Object.values(OLD_MONEY_PAGES)) {
      const html = renderToStaticMarkup(<PageTemplate page={page} />);
      expect(html).toContain(page.title);
      expect(html).toContain(OLD_MONEY_DISCLAIMER);
    }
  });

  it("uses institutional language and avoids hype copy", () => {
    const banned = [
      "moon",
      "1000x",
      "guaranteed returns",
      "get rich",
      "pump",
      "lambo",
      "overnight wealth",
      "no risk",
    ];

    for (const page of Object.values(OLD_MONEY_PAGES)) {
      const html = renderToStaticMarkup(<PageTemplate page={page} />).toLowerCase();
      for (const term of banned) {
        expect(html).not.toContain(term);
      }
    }
  });

  it("does not leak local Windows paths or secret token file references", () => {
    const roots = [
      path.join(process.cwd(), "src", "app", "troptions-old-money"),
      path.join(process.cwd(), "src", "components", "troptions-old-money"),
      path.join(process.cwd(), "src", "content", "troptions-old-money"),
      path.join(process.cwd(), "src", "styles", "troptions-old-money.css"),
    ];

    const files: string[] = [];

    const collect = (target: string) => {
      const stat = fs.statSync(target);
      if (stat.isFile()) {
        files.push(target);
        return;
      }
      for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
        collect(path.join(target, entry.name));
      }
    };

    for (const root of roots) {
      collect(root);
    }

    const windowsPathPattern = /[A-Za-z]:\\Users\\/;
    const secretTokenText = "Workers AI API token was successful";

    for (const file of files) {
      const body = fs.readFileSync(file, "utf8");
      expect(body).not.toMatch(windowsPathPattern);
      expect(body).not.toContain(secretTokenText);
    }
  });
});
