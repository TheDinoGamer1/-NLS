import * as React from "react";
"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";

export function MessageMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="prose prose-sm max-w-none text-foreground"
      components={{
        pre(props) {
          return <CodeBlock {...props} />;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function CodeBlock(props: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const text = props.children?.toString() || "";

  return (
    <div className="relative">
      <pre {...props} />
      <Button
        variant="outline"
        size="sm"
        className="absolute right-2 top-2 h-7"
        onClick={async () => {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
      >
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}
