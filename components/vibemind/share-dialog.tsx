"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Globe, Link2, Lock, Share2, UserPlus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mockUsers = [
  { id: "1", name: "Мария К.", initials: "МК", permission: "edit" },
  { id: "2", name: "Иван П.", initials: "ИП", permission: "view" },
];

export function ShareDialog() {
  const [isPublic, setIsPublic] = useState(false);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText("https://vibemind.app/share/abc123");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 hover:glow-primary"
        >
          <Share2 className="h-3.5 w-3.5" />
          Поделиться
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-strong sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Поделиться документом</DialogTitle>
          <DialogDescription>
            Настройте доступ к документу для других пользователей
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Invite by email */}
          <div className="space-y-2">
            <Label>Пригласить по email</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button className="gap-1.5 glow-primary">
                <UserPlus className="h-4 w-4" />
                Пригласить
              </Button>
            </div>
          </div>

          <Separator />

          {/* Shared users list */}
          <div className="space-y-2">
            <Label>Пользователи с доступом</Label>
            <div className="space-y-2">
              {mockUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <Select defaultValue={user.permission}>
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">Просмотр</SelectItem>
                      <SelectItem value="edit">Редактирование</SelectItem>
                      <SelectItem value="admin">Администратор</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Public link toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <Globe className="h-5 w-5 text-accent" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {isPublic ? "Публичная ссылка" : "Приватный доступ"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isPublic
                    ? "Любой с ссылкой может просматривать"
                    : "Только приглашённые пользователи"}
                </p>
              </div>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>

          {/* Copy link */}
          {isPublic && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex gap-2"
            >
              <Input
                readOnly
                value="https://vibemind.app/share/abc123"
                className="flex-1 font-mono text-xs"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className={copied ? "text-accent border-accent" : ""}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
