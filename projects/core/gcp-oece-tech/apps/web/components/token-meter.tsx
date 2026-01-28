"use client";

import { useState, useEffect } from "react";
import { Zap, TrendingUp, TrendingDown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function TokenMeter() {
  const { userData } = useAuth();
  
  // 如果未登錄，使用默認值
  const tokensUsed = userData ? (9999 - userData.tokens) : 0;
  const tokensFree = 9999;
  const discount = 0.15; // 15% Pro 減免
  const baseCost = (tokensUsed / 1000) * 0.14; // ฿0.14/1K
  const finalCost = baseCost * (1 - discount);

  const tokensOverFree = Math.max(0, tokensUsed - tokensFree);
  const isOverLimit = tokensOverFree > 0;
  
  // 未登錄不顯示
  if (!userData) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
      {/* Icon */}
      <Zap className={`h-4 w-4 ${isOverLimit ? "text-yellow-400" : "text-green-400"}`} />
      
      {/* Tokens */}
      <div className="flex items-center gap-1 text-xs">
        <span className="font-mono text-gray-300">
          {tokensUsed.toLocaleString()}
        </span>
        <span className="text-gray-600">/</span>
        <span className="font-mono text-gray-500">
          {tokensFree.toLocaleString()}
        </span>
      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-white/20" />

      {/* Cost Display */}
      <div className="flex items-center gap-1 text-xs">
        {discount > 0 && (
          <>
            <span className="font-mono text-gray-500 line-through">
              ฿{baseCost.toFixed(2)}
            </span>
            <TrendingDown className="h-3 w-3 text-green-400" />
          </>
        )}
        <span className="font-mono text-yellow-400 font-semibold">
          ฿{finalCost.toFixed(2)}
        </span>
      </div>

      {/* Hover Tooltip */}
      <div className="absolute top-full right-0 mt-2 w-64 p-4 rounded-xl bg-black/95 border border-white/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-2xl z-50">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Tokens Used</span>
            <span className="font-mono text-white">{tokensUsed.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Free Quota</span>
            <span className="font-mono text-green-400">{tokensFree.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Remaining</span>
            <span className="font-mono text-blue-400">{userData.tokens.toLocaleString()}</span>
          </div>
          {isOverLimit && (
            <div className="flex justify-between text-yellow-400">
              <span>Over Limit</span>
              <span className="font-mono">{tokensOverFree.toLocaleString()}</span>
            </div>
          )}
          <div className="border-t border-white/10 my-2" />
          <div className="flex justify-between">
            <span className="text-gray-400">Base Cost</span>
            <span className="font-mono text-gray-400">฿{baseCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-400">
            <span>Pro Discount (-{(discount * 100).toFixed(0)}%)</span>
            <span className="font-mono">-฿{(baseCost - finalCost).toFixed(2)}</span>
          </div>
          <div className="border-t border-white/10 my-2" />
          <div className="flex justify-between font-semibold">
            <span className="text-white">Final Cost</span>
            <span className="font-mono text-yellow-400">฿{finalCost.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
