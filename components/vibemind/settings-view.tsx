"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  Brain,
  CheckCircle2,
  ExternalLink,
  Key,
  Loader2,
  MessageCircle,
  Server,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SettingsViewProps {
  onBack: () => void;
}

type ConnectionStatus = "connected" | "disconnected" | "testing";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: ConnectionStatus;
  fields: {
    key: string;
    label: string;
    placeholder: string;
    type: "text" | "password";
  }[];
}

const integrations: Integration[] = [
  {
    id: "telegram",
    name: "Telegram Bot",
    description: "Подключите бота для получения заметок через Telegram",
    icon: <MessageCircle className="h-5 w-5" />,
    status: "connected",
    fields: [
      {
        key: "token",
        label: "Bot Token",
        placeholder: "123456789:ABCdefGHIjklMNOpqrsTUVwxyz",
        type: "password",
      },
    ],
  },
  {
    id: "openai",
    name: "OpenAI / GPT",
    description: "API ключ для использования моделей GPT-4",
    icon: <Brain className="h-5 w-5" />,
    status: "disconnected",
    fields: [
      {
        key: "apiKey",
        label: "API Key",
        placeholder: "sk-...",
        type: "password",
      },
    ],
  },
  {
    id: "gemini",
    name: "Google Gemini",
    description: "API ключ для Google Gemini Pro",
    icon: <Brain className="h-5 w-5" />,
    status: "disconnected",
    fields: [
      {
        key: "apiKey",
        label: "API Key",
        placeholder: "AIza...",
        type: "password",
      },
    ],
  },
  {
    id: "ollama",
    name: "Ollama Local",
    description: "Подключение к локальному серверу Ollama",
    icon: <Server className="h-5 w-5" />,
    status: "connected",
    fields: [
      {
        key: "url",
        label: "URL сервера",
        placeholder: "http://localhost:11434",
        type: "text",
      },
    ],
  },
];

const externalBrains = [
  {
    id: "notion",
    name: "Notion",
    description: "Синхронизация заметок с Notion",
    connected: false,
  },
  {
    id: "obsidian",
    name: "Obsidian Vault",
    description: "Импорт из Obsidian",
    connected: true,
  },
  {
    id: "readwise",
    name: "Readwise",
    description: "Импорт хайлайтов и заметок",
    connected: false,
  },
];

export function SettingsView({ onBack }: SettingsViewProps) {
  const [testingId, setTestingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, Record<string, string>>>({
    telegram: { token: "••••••••••••••••••••" },
    ollama: { url: "http://localhost:11434" },
  });

  const handleTestConnection = async (integrationId: string) => {
    setTestingId(integrationId);
    
    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.3;
    
    if (success) {
      toast.success("Подключение успешно!", {
        description: "Интеграция работает корректно",
      });
    } else {
      toast.error("Ошибка подключения", {
        description: "Проверьте данные и попробуйте снова",
      });
    }
    
    setTestingId(null);
  };

  const handleFieldChange = (integrationId: string, fieldKey: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [integrationId]: {
        ...prev[integrationId],
        [fieldKey]: value,
      },
    }));
  };

  const StatusBadge = ({ status }: { status: ConnectionStatus }) => {
    if (status === "testing") {
      return (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Проверка...
        </div>
      );
    }
    if (status === "connected") {
      return (
        <div className="flex items-center gap-1.5 text-xs text-accent">
          <CheckCircle2 className="h-3 w-3" />
          Подключено
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <XCircle className="h-3 w-3" />
        Не подключено
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-sm px-6 py-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:glow-primary"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Настройки</h1>
          <p className="text-sm text-muted-foreground">
            Управление интеграциями и ботами
          </p>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 scrollbar-thin">
        <div className="mx-auto max-w-4xl p-6">
          <Tabs defaultValue="integrations" className="space-y-6">
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="integrations" className="gap-2">
                <Key className="h-4 w-4" />
                Интеграции
              </TabsTrigger>
              <TabsTrigger value="brains" className="gap-2">
                <Brain className="h-4 w-4" />
                Внешние базы
              </TabsTrigger>
              <TabsTrigger value="bots" className="gap-2">
                <Bot className="h-4 w-4" />
                Мои боты
              </TabsTrigger>
            </TabsList>

            <TabsContent value="integrations" className="space-y-4">
              <div className="grid gap-4">
                {integrations.map((integration, index) => (
                  <motion.div
                    key={integration.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass border-border/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              {integration.icon}
                            </div>
                            <div>
                              <CardTitle className="text-base">
                                {integration.name}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {integration.description}
                              </CardDescription>
                            </div>
                          </div>
                          <StatusBadge
                            status={
                              testingId === integration.id
                                ? "testing"
                                : integration.status
                            }
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {integration.fields.map((field) => (
                          <div key={field.key} className="space-y-2">
                            <Label htmlFor={`${integration.id}-${field.key}`}>
                              {field.label}
                            </Label>
                            <Input
                              id={`${integration.id}-${field.key}`}
                              type={field.type}
                              placeholder={field.placeholder}
                              value={formValues[integration.id]?.[field.key] || ""}
                              onChange={(e) =>
                                handleFieldChange(
                                  integration.id,
                                  field.key,
                                  e.target.value
                                )
                              }
                              className="bg-secondary/50"
                            />
                          </div>
                        ))}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:glow-primary"
                            onClick={() => handleTestConnection(integration.id)}
                            disabled={testingId === integration.id}
                          >
                            {testingId === integration.id ? (
                              <>
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                Проверка...
                              </>
                            ) : (
                              "Проверить"
                            )}
                          </Button>
                          <Button size="sm" className="glow-primary">
                            Сохранить
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="brains" className="space-y-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Внешние базы знаний</h2>
                <p className="text-sm text-muted-foreground">
                  Подключите внешние источники для расширения базы знаний
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {externalBrains.map((brain, index) => (
                  <motion.div
                    key={brain.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={cn(
                        "glass border-border/50 transition-all hover:glow-primary cursor-pointer",
                        brain.connected && "border-accent/50"
                      )}
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-lg",
                              brain.connected
                                ? "bg-accent/10 text-accent"
                                : "bg-secondary text-muted-foreground"
                            )}
                          >
                            <Brain className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{brain.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {brain.description}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant={brain.connected ? "outline" : "default"}
                          size="sm"
                          className={
                            brain.connected ? "" : "glow-primary"
                          }
                        >
                          {brain.connected ? "Настроить" : "Подключить"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bots" className="space-y-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Персональные боты</h2>
                <p className="text-sm text-muted-foreground">
                  Создавайте ИИ-ботов для автоматизации задач
                </p>
              </div>

              <Card className="glass border-border/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">Создать бота</h3>
                  <p className="mb-4 text-center text-sm text-muted-foreground">
                    Настройте персонального ИИ-ассистента с доступом к вашим заметкам
                  </p>
                  <Button className="glow-primary">
                    <Bot className="mr-2 h-4 w-4" />
                    Создать бота
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
