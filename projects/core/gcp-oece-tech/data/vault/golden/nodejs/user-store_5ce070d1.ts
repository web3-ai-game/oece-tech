import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UsageRecord {
  id: string;
  type: 'image' | 'video' | 'content' | 'copywriter';
  title: string;
  cost: number;
  createdAt: Date;
}

interface UserStore {
  balance: number;
  totalSpent: number;
  usageRecords: UsageRecord[];

  // Actions
  setBalance: (balance: number) => void;
  deductBalance: (amount: number) => void;
  addBalance: (amount: number) => void;
  addUsageRecord: (record: Omit<UsageRecord, 'id' | 'createdAt'>) => void;

  // Statistics
  getUsageByType: (type: UsageRecord['type']) => number;
  getTotalUsageCount: (type: UsageRecord['type']) => number;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      balance: 25.50, // 初始余额
      totalSpent: 0,
      usageRecords: [],

      setBalance: (balance) => set({ balance }),

      deductBalance: (amount) => set((state) => ({
        balance: Math.max(0, state.balance - amount),
        totalSpent: state.totalSpent + amount,
      })),

      addBalance: (amount) => set((state) => ({
        balance: state.balance + amount,
      })),

      addUsageRecord: (record) => set((state) => ({
        usageRecords: [
          {
            ...record,
            id: `${Date.now()}-${Math.random()}`,
            createdAt: new Date(),
          },
          ...state.usageRecords,
        ].slice(0, 100), // 只保留最近 100 条记录
      })),

      getUsageByType: (type) => {
        const records = get().usageRecords.filter(r => r.type === type);
        return records.reduce((sum, r) => sum + r.cost, 0);
      },

      getTotalUsageCount: (type) => {
        return get().usageRecords.filter(r => r.type === type).length;
      },
    }),
    {
      name: 'user-store',
    }
  )
);
