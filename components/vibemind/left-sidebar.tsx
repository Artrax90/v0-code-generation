"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderOpen,
  Plus,
  Settings,
  User,
  Users,
  X,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { View } from "./app-shell";

interface TreeNode {
  id: string;
  name: string;
  type: "folder" | "file";
  children?: TreeNode[];
}

const mockFileTree: TreeNode[] = [
  {
    id: "1",
    name: "Проекты",
    type: "folder",
    children: [
      {
        id: "1-1",
        name: "VibeMind",
        type: "folder",
        children: [
          { id: "1-1-1", name: "Архитектура.md", type: "file" },
          { id: "1-1-2", name: "API Документация.md", type: "file" },
          { id: "1-1-3", name: "Roadmap.md", type: "file" },
        ],
      },
      {
        id: "1-2",
        name: "Исследования",
        type: "folder",
        children: [
          { id: "1-2-1", name: "LLM Сравнение.md", type: "file" },
          { id: "1-2-2", name: "RAG Паттерны.md", type: "file" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Заметки",
    type: "folder",
    children: [
      { id: "2-1", name: "Ежедневник.md", type: "file" },
      { id: "2-2", name: "Идеи.md", type: "file" },
      { id: "2-3", name: "Встречи.md", type: "file" },
    ],
  },
  {
    id: "3",
    name: "Быстрый доступ.md",
    type: "file",
  },
];

interface LeftSidebarProps {
  onClose: () => void;
  onNavigate: (view: View) => void;
  currentView: View;
}

export function LeftSidebar({ onClose, onNavigate, currentView }: LeftSidebarProps) {
  const [workspace, setWorkspace] = useState<"personal" | "shared">("personal");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["1", "1-1", "2"])
  );
  const [selectedFile, setSelectedFile] = useState<string>("1-1-1");

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const isSelected = selectedFile === node.id;

    return (
      <div key={node.id}>
        <button
          onClick={() => {
            if (node.type === "folder") {
              toggleFolder(node.id);
            } else {
              setSelectedFile(node.id);
            }
          }}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
            isSelected && node.type === "file"
              ? "bg-indigo-500/20 text-indigo-400"
              : "text-muted-foreground hover:text-foreground hover:bg-zinc-800/50"
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {node.type === "folder" ? (
            <>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
              )}
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 flex-shrink-0 text-primary" />
              ) : (
                <Folder className="h-4 w-4 flex-shrink-0 text-primary" />
              )}
            </>
          ) : (
            <>
              <span className="w-4" />
              <File className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            </>
          )}
          <span className="truncate">{node.name}</span>
        </button>

        {node.type === "folder" && isExpanded && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children.map((child) => renderTreeNode(child, depth + 1))}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full w-full flex-col glass-strong">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary glow-primary">
            <span className="font-mono text-sm font-bold text-primary-foreground">V</span>
          </div>
          <span className="font-semibold tracking-tight">VibeMind</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:glow-primary"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Workspace Switcher */}
      <div className="border-b border-border/50 p-3">
        <Tabs
          value={workspace}
          onValueChange={(v) => setWorkspace(v as "personal" | "shared")}
          className="w-full"
        >
          <TabsList className="w-full bg-secondary/50">
            <TabsTrigger value="personal" className="flex-1 gap-1.5 text-xs">
              <User className="h-3.5 w-3.5" />
              Личное
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-1 gap-1.5 text-xs">
              <Users className="h-3.5 w-3.5" />
              Общее
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* File Explorer Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Заметки
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:glow-primary"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1 px-2 py-2 scrollbar-thin">
        {mockFileTree.map((node) => renderTreeNode(node))}
      </ScrollArea>

      {/* User Profile Section */}
      <div className="border-t border-border/50 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">Александ��</p>
            <div className="flex items-center gap-1.5">
              <RefreshCw className="h-3 w-3 text-accent sync-pulse" />
              <span className="text-xs text-muted-foreground">Синхронизация...</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 hover:glow-primary",
              currentView === "settings" && "bg-indigo-500/20 text-indigo-400"
            )}
            onClick={() => onNavigate("settings")}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
