import { ArrowRight, Rss, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { withBase } from "@/utils/basePath";

export default function ReadingActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button asChild size="lg" className="font-ui">
        <a href={withBase("/posts/")}>
          开始阅读
          <ArrowRight data-icon="inline-end" />
        </a>
      </Button>
      <Button asChild variant="outline" size="lg" className="font-ui">
        <a href={withBase("/search/")}>
          <Search data-icon="inline-start" />
          搜索
        </a>
      </Button>
      <Button asChild variant="ghost" size="lg" className="font-ui">
        <a href={withBase("/rss.xml")}>
          <Rss data-icon="inline-start" />
          RSS
        </a>
      </Button>
    </div>
  );
}
