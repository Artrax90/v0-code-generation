"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bold,
  ChevronRight,
  Code,
  Command,
  Heading1,
  Heading2,
  Italic,
  Link,
  List,
  ListOrdered,
  Menu,
  MessageSquare,
  Play,
  Quote,
  Share2,
  Strikethrough,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ShareDialog } from "./share-dialog";

interface MainEditorProps {
  leftSidebarOpen: boolean;
  onToggleLeftSidebar: () => void;
  rightPanelOpen: boolean;
  onToggleRightPanel: () => void;
  onOpenCommandPalette: () => void;
}

const toolbarItems = [
  { icon: Bold, label: "Жирный", shortcut: "⌘B" },
  { icon: Italic, label: "Курсив", shortcut: "⌘I" },
  { icon: Strikethrough, label: "Зачёркнутый", shortcut: "⌘⇧S" },
  { icon: Code, label: "Код", shortcut: "⌘E" },
  { type: "separator" as const },
  { icon: Heading1, label: "Заголовок 1", shortcut: "⌘⇧1" },
  { icon: Heading2, label: "Заголовок 2", shortcut: "⌘⇧2" },
  { type: "separator" as const },
  { icon: List, label: "Список", shortcut: "⌘⇧8" },
  { icon: ListOrdered, label: "Нумерованный", shortcut: "⌘⇧7" },
  { icon: Quote, label: "Цитата", shortcut: "⌘⇧9" },
  { type: "separator" as const },
  { icon: Link, label: "Ссылка", shortcut: "⌘K" },
];

const mockMarkdownContent = `# Архитектура VibeMind

## Обзор системы

VibeMind — это современная платформа для управления знаниями, построенная на принципах **модульности** и **расширяемости**.

### Основные компоненты

1. **Редактор заметок** — WYSIWYG редактор с поддержкой Markdown
2. **ИИ-ассистент** — интеграция с различными LLM
3. **Синхронизация** — real-time sync между устройствами

## Технический стек

- [x] Next.js 16 с App Router
- [x] Tailwind CSS + shadcn/ui
- [ ] PostgreSQL для хранения данных
- [ ] WebSocket для real-time

### Пример кода

\`\`\`typescript
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

async function fetchNotes(): Promise<Note[]> {
  const response = await fetch('/api/notes');
  return response.json();
}
\`\`\`

### Формула расчёта

Эффективность системы: $$E = \\frac{\\sum_{i=1}^{n} w_i \\cdot s_i}{\\sum_{i=1}^{n} w_i}$$

| Метрика | Значение | Статус |
|---------|----------|--------|
| Latency | 45ms | ✅ |
| Uptime | 99.9% | ✅ |
| Users | 1,234 | 📈 |
`;

export function MainEditor({
  leftSidebarOpen,
  onToggleLeftSidebar,
  rightPanelOpen,
  onToggleRightPanel,
  onOpenCommandPalette,
}: MainEditorProps) {
  const [content, setContent] = useState(mockMarkdownContent);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 2000);
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-sm px-4 py-2">
        <div className="flex items-center gap-2">
          {!leftSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:glow-primary"
              onClick={onToggleLeftSidebar}
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">
              Проекты
            </span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="hover:text-foreground cursor-pointer transition-colors">
              VibeMind
            </span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">Архитектура.md</span>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Command Palette Trigger */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:glow-primary"
                  onClick={onOpenCommandPalette}
                >
                  <Command className="h-3.5 w-3.5" />
                  <span className="text-xs">Поиск</span>
                  <kbd className="pointer-events-none ml-1 inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    ⌘K
                  </kbd>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Открыть поиск</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <ShareDialog />

          {!rightPanelOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:glow-primary"
              onClick={onToggleRightPanel}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="flex items-center gap-1 border-b border-border/50 bg-background/50 px-4 py-1.5">
        <TooltipProvider>
          {toolbarItems.map((item, index) => {
            if (item.type === "separator") {
              return (
                <Separator key={index} orientation="vertical" className="mx-1 h-5" />
              );
            }
            const Icon = item.icon;
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="flex items-center gap-2">
                  {item.label}
                  {item.shortcut && (
                    <kbd className="rounded border border-border bg-muted px-1 text-[10px]">
                      {item.shortcut}
                    </kbd>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto p-8 scrollbar-thin">
        <div className="mx-auto max-w-3xl">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[calc(100vh-200px)] w-full resize-none border-0 bg-transparent p-0 font-mono text-sm leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Начните писать..."
          />

          {/* Code Block with Run Button */}
          <div className="mt-8 overflow-hidden rounded-lg border border-border/50 bg-secondary/30">
            <div className="flex items-center justify-between border-b border-border/50 bg-secondary/50 px-4 py-2">
              <span className="text-xs font-medium text-muted-foreground">
                typescript
              </span>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  variant="outline"
                  className={cn(
                    "gap-1.5 text-xs transition-all",
                    isRunning
                      ? "border-accent text-accent glow-accent"
                      : "hover:border-primary hover:text-primary hover:glow-border"
                  )}
                  onClick={handleRunCode}
                  disabled={isRunning}
                >
                  {isRunning ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Play className="h-3 w-3" />
                      </motion.div>
                      Выполнение...
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3" />
                      Запустить код
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-sm">
              <code className="text-muted-foreground">
                {`interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

async function fetchNotes(): Promise<Note[]> {
  const response = await fetch('/api/notes');
  return response.json();
}`}
              </code>
            </pre>
          </div>

          {/* Sample Table */}
          <div className="mt-8 overflow-hidden rounded-lg border border-border/50">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">Метрика</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Значение</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border/50">
                  <td className="px-4 py-2 text-sm">Latency</td>
                  <td className="px-4 py-2 text-sm font-mono">45ms</td>
                  <td className="px-4 py-2 text-sm text-accent">Отлично</td>
                </tr>
                <tr className="border-t border-border/50">
                  <td className="px-4 py-2 text-sm">Uptime</td>
                  <td className="px-4 py-2 text-sm font-mono">99.9%</td>
                  <td className="px-4 py-2 text-sm text-accent">Отлично</td>
                </tr>
                <tr className="border-t border-border/50">
                  <td className="px-4 py-2 text-sm">Users</td>
                  <td className="px-4 py-2 text-sm font-mono">1,234</td>
                  <td className="px-4 py-2 text-sm text-primary">Рост</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
