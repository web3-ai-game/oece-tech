import { useEffect, useState } from 'react';
import { supabase } from './client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { User, Invite } from './client';

/**
 * 获取当前登录用户
 */
export function useUser() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取当前用户
    supabase.auth.getUser()
      .then(({ data: { user }, error }) => {
        if (error) {
          console.error('Error fetching user:', error);
        }
        setUser(user);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch user:', error);
        setLoading(false);
      });

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

/**
 * 获取用户资料
 */
export function useUserProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // 订阅实时更新
    const channel = supabase
      .channel(`user-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          setProfile(payload.new as User);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { profile, loading, error };
}

/**
 * 获取用户的邀请码列表
 */
export function useUserInvites(userId: string | undefined) {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchInvites = async () => {
      try {
        const { data, error } = await supabase
          .from('invites')
          .select('*')
          .eq('created_by', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setInvites(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvites();

    // 订阅实时更新
    const channel = supabase
      .channel(`invites-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invites',
          filter: `created_by=eq.${userId}`,
        },
        () => {
          fetchInvites(); // 重新获取
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { invites, loading, error };
}
