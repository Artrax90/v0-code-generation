"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LeftSidebar } from "./left-sidebar";
import { MainEditor } from "./main-editor";
import { AIChatPanel } from "./ai-chat-panel";
import { SettingsView } from "./settings-view";
import { CommandPalette } from "./command-palette";

export type View = "editor" | "settings";

export function AppShell() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [currentView, setCurrentView] = useState<View>("editor");
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Sidebar */}
      <AnimatePresence mode="wait">
        {leftSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-shrink-0 overflow-hidden"
          >
            <LeftSidebar
              onClose={() => setLeftSidebarOpen(false)}
              onNavigate={setCurrentView}
              currentView={currentView}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {currentView === "editor" ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-1 overflow-hidden"
            >
              <MainEditor
                leftSidebarOpen={leftSidebarOpen}
                onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
                rightPanelOpen={rightPanelOpen}
                onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
                onOpenCommandPalette={() => setCommandPaletteOpen(true)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden"
            >
              <SettingsView onBack={() => setCurrentView("editor")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right AI Chat Panel */}
      <AnimatePresence mode="wait">
        {rightPanelOpen && currentView === "editor" && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-shrink-0 overflow-hidden"
          >
            <AIChatPanel onClose={() => setRightPanelOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onNavigate={setCurrentView}
      />
    </div>
  );
}
