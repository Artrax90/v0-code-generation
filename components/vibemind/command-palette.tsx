"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  File,
  FileText,
  Folder,
  Hash,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import type { View } from "./app-shell";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (view: View) => void;
}

const recentFiles = [
  { id: "1", name: "Архитектура.md", folder: "VibeMind" },
  { id: "2", name: "API Документация.md", folder: "VibeMind" },
  { id: "3", name: "LLM Сравнение.md", folder: "Исследования" },
  { id: "4", name: "Ежедневник.md", folder: "Заметки" },
];

const suggestions = [
  { id: "1", name: "Создать заметку", icon: Plus },
  { id: "2", name: "Открыть чат с ИИ", icon: MessageSquare },
  { id: "3", name: "Настройки", icon: Settings },
];

export function CommandPalette({ open, onOpenChange, onNavigate }: CommandPaletteProps) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Поиск заметок, команд и настроек..." />
      <CommandList className="scrollbar-thin">
        <CommandEmpty>Ничего не найдено.</CommandEmpty>
        
        <CommandGroup heading="Предложения">
          {suggestions.map((suggestion) => {
            const Icon = suggestion.icon;
            return (
              <CommandItem
                key={suggestion.id}
                onSelect={() => {
                  if (suggestion.name === "Настройки") {
                    onNavigate("settings");
                  }
                  onOpenChange(false);
                }}
                className="gap-2"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span>{suggestion.name}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Недавние файлы">
          {recentFiles.map((file) => (
            <CommandItem key={file.id} className="gap-2" onSelect={() => onOpenChange(false)}>
              <FileText className="h-4 w-4 text-primary" />
              <span>{file.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {file.folder}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="ИИ Команды">
          <CommandItem className="gap-2" onSelect={() => onOpenChange(false)}>
            <Sparkles className="h-4 w-4 text-accent" />
            <span>Суммаризировать документ</span>
            <CommandShortcut>⌘⇧S</CommandShortcut>
          </CommandItem>
          <CommandItem className="gap-2" onSelect={() => onOpenChange(false)}>
            <Bot className="h-4 w-4 text-accent" />
            <span>Сгенерировать идеи</span>
            <CommandShortcut>⌘⇧I</CommandShortcut>
          </CommandItem>
          <CommandItem className="gap-2" onSelect={() => onOpenChange(false)}>
            <Hash className="h-4 w-4 text-accent" />
            <span>Найти связанные заметки</span>
            <CommandShortcut>⌘⇧R</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Навигация">
          <CommandItem
            className="gap-2"
            onSelect={() => {
              onNavigate("editor");
              onOpenChange(false);
            }}
          >
            <File className="h-4 w-4 text-muted-foreground" />
            <span>Редактор</span>
            <CommandShortcut>⌘1</CommandShortcut>
          </CommandItem>
          <CommandItem
            className="gap-2"
            onSelect={() => {
              onNavigate("settings");
              onOpenChange(false);
            }}
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span>Настройки</span>
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
