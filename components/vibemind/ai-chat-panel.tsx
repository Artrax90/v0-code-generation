"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  ChevronDown,
  Copy,
  MoreVertical,
  RefreshCw,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timeLabel: string;
}

const mockMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Объясни архитектуру RAG систем",
    timeLabel: "14:15",
  },
  {
    id: "2",
    role: "assistant",
    content: `**RAG (Retrieval-Augmented Generation)** — это архитектурный паттерн, который комбинирует поиск релевантных документов с генерацией текста.

### Основные компоненты:

1. **Индексатор** — разбивает документы на чанки и создаёт эмбеддинги
2. **Векторная БД** — хранит эмбеддинги для быстрого поиска
3. **Ретривер** — находит релевантные документы по запросу
4. **LLM** — генерирует ответ на основе контекста

### Преимущества:
- Актуальная информация
- Снижение галлюцинаций
- Прозрачность источников`,
    timeLabel: "14:16",
  },
  {
    id: "3",
    role: "user",
    content: "Какие библиотеки лучше использовать для реализации?",
    timeLabel: "14:18",
  },
  {
    id: "4",
    role: "assistant",
    content: `Вот популярные инструменты для RAG:

**Фреймворки:**
- \`LangChain\` — универсальный, большое сообщество
- \`LlamaIndex\` — специализирован на индексации
- \`Haystack\` — production-ready решение

**Векторные БД:**
- \`Pinecone\` — managed, быстрый старт
- \`Weaviate\` — open-source, GraphQL API
- \`Chroma\` — легковесный, для прототипов

**Эмбеддинги:**
- \`OpenAI ada-002\` — качественные, платные
- \`sentence-transformers\` — локальные, бесплатные`,
    timeLabel: "14:19",
  },
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const models = [
  { value: "ollama", label: "Ollama Local" },
  { value: "gpt4", label: "GPT-4" },
  { value: "gemini", label: "Gemini Pro" },
];

interface AIChatPanelProps {
  onClose: () => void;
}

export function AIChatPanel({ onClose }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt4");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timeLabel: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Это пример ответа от ИИ-ассистента. В реальном приложении здесь будет интеграция с выбранной моделью.",
        timeLabel: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex h-full w-full flex-col glass-strong">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold">Чат с ИИ</span>
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

      {/* Model Selector */}
      <div className="border-b border-border/50 px-4 py-2">
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-full bg-secondary/50">
            <SelectValue placeholder="Выберите модель" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.value} value={model.value}>
                {model.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4 scrollbar-thin" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                    message.role === "user"
                      ? "bg-primary"
                      : "bg-gradient-to-br from-primary/50 to-accent/50"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>

                <div
                  className={cn(
                    "group relative max-w-[85%] rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-secondary/50 text-foreground rounded-tl-sm"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                  <p className="mt-1 text-[10px] opacity-60">
                    {message.timeLabel}
                  </p>

                  {/* Message actions */}
                  <div
                    className={cn(
                      "absolute top-2 opacity-0 transition-opacity group-hover:opacity-100",
                      message.role === "user" ? "-left-8" : "-right-8"
                    )}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={message.role === "user" ? "start" : "end"}>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-3.5 w-3.5" />
                          Копировать
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="mr-2 h-3.5 w-3.5" />
                          Повторить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/50 to-accent/50">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-secondary/50 px-4 py-3">
                <div className="flex gap-1">
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                    className="h-2 w-2 rounded-full bg-muted-foreground"
                  />
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    className="h-2 w-2 rounded-full bg-muted-foreground"
                  />
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    className="h-2 w-2 rounded-full bg-muted-foreground"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border/50 p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Задайте вопрос..."
            className="min-h-[44px] max-h-32 resize-none bg-secondary/50"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="h-11 w-11 shrink-0 glow-primary"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Нажмите Enter для отправки, Shift+Enter для новой строки
        </p>
      </div>
    </div>
  );
}
