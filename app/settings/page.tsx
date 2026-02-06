"use client";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, User, Bell, Shield, CreditCard, Database, Trash2, Save } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    displayName: "DeepWeay",
    email: "deepweay@oece.tech",
    notifications: true,
    vectorMemory: true,
    autoSave: true,
    theme: "dark",
    language: "en"
  });

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">      <SharedHeader />

      {/* Main Content */}
      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>

          {/* Account Settings */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-semibold">Account</h2>
            </div>
            <div className="space-y-4 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl p-6">
              <div>
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <input
                  type="text"
                  value={settings.displayName}
                  onChange={(e) => setSettings({...settings, displayName: e.target.value})}
                  className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-lg focus:border-[var(--primary)] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  disabled
                  className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-lg opacity-50 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">Email cannot be changed</p>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-yellow-400" />
              <h2 className="text-xl font-semibold">Preferences</h2>
            </div>
            <div className="space-y-3 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Notifications</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">Receive updates and alerts</p>
                </div>
                <button
                  onClick={() => setSettings({...settings, notifications: !settings.notifications})}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.notifications ? "bg-green-500" : "bg-gray-600"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.notifications ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Vector Memory</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">Enable long-term conversation memory</p>
                </div>
                <button
                  onClick={() => setSettings({...settings, vectorMemory: !settings.vectorMemory})}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.vectorMemory ? "bg-green-500" : "bg-gray-600"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.vectorMemory ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Auto-save Chats</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">Automatically save conversations</p>
                </div>
                <button
                  onClick={() => setSettings({...settings, autoSave: !settings.autoSave})}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.autoSave ? "bg-green-500" : "bg-gray-600"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.autoSave ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Data & Privacy */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-5 w-5 text-green-400" />
              <h2 className="text-xl font-semibold">Data & Privacy</h2>
            </div>
            <div className="space-y-3 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl p-6">
              <button className="w-full flex items-center justify-between p-3 bg-[var(--input-bg)] hover:bg-[var(--input-bg)] rounded-lg transition-colors">
                <span className="text-sm">Export All Data</span>
                <span className="text-xs text-[var(--muted-foreground)]">Download JSON</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-[var(--input-bg)] hover:bg-[var(--input-bg)] rounded-lg transition-colors">
                <span className="text-sm">Clear Chat History</span>
                <span className="text-xs text-[var(--muted-foreground)]">Delete all conversations</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  <span className="text-sm">Delete Account</span>
                </div>
                <span className="text-xs">Permanent</span>
              </button>
            </div>
          </div>

          {/* Save Button */}
          <button className="w-full py-3 bg-[var(--primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Save className="h-5 w-5" />
            Save Changes
          </button>
        </div>
      </main>
      <SharedFooter />
    </div>
  );
}
