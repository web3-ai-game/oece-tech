"use client";

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
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-[var(--background)]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--primary)]" />
            <span className="text-lg font-semibold">OECE.tech</span>
          </Link>
          <Link href="/profile" className="text-sm text-gray-400 hover:text-white">
            ← Back to Profile
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>

          {/* Account Settings */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-semibold">Account</h2>
            </div>
            <div className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-6">
              <div>
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <input
                  type="text"
                  value={settings.displayName}
                  onChange={(e) => setSettings({...settings, displayName: e.target.value})}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-[var(--primary)] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  disabled
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg opacity-50 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-yellow-400" />
              <h2 className="text-xl font-semibold">Preferences</h2>
            </div>
            <div className="space-y-3 bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Notifications</h3>
                  <p className="text-xs text-gray-500">Receive updates and alerts</p>
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
                  <p className="text-xs text-gray-500">Enable long-term conversation memory</p>
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
                  <p className="text-xs text-gray-500">Automatically save conversations</p>
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
            <div className="space-y-3 bg-white/5 border border-white/10 rounded-xl p-6">
              <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <span className="text-sm">Export All Data</span>
                <span className="text-xs text-gray-500">Download JSON</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <span className="text-sm">Clear Chat History</span>
                <span className="text-xs text-gray-500">Delete all conversations</span>
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
    </div>
  );
}
