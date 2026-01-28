import { useState, useEffect } from 'react';
import { supabase } from './client';

export interface BBSStats {
  posts_count: number;
  replies_count: number;
  total_views: number;
  total_replies_received: number;
}

/**
 * Get user's BBS statistics
 */
export function useUserBBSStats(userId?: string) {
  const [stats, setStats] = useState<BBSStats>({
    posts_count: 0,
    replies_count: 0,
    total_views: 0,
    total_replies_received: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        // Get user's posts count and total views/replies
        const { data: postsData, error: postsError } = await supabase
          .from('bbs_posts')
          .select('id, view_count, reply_count')
          .eq('author_id', userId);

        if (postsError) throw postsError;

        const posts_count = postsData?.length || 0;
        const total_views = postsData?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;
        const total_replies_received = postsData?.reduce((sum, post) => sum + (post.reply_count || 0), 0) || 0;

        // Get user's replies count
        const { count: repliesCount, error: repliesError } = await supabase
          .from('bbs_replies')
          .select('*', { count: 'exact', head: true })
          .eq('author_id', userId);

        if (repliesError) throw repliesError;

        setStats({
          posts_count,
          replies_count: repliesCount || 0,
          total_views,
          total_replies_received,
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Subscribe to real-time updates
    const postsChannel = supabase
      .channel('user_posts_stats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bbs_posts',
          filter: `author_id=eq.${userId}`,
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    const repliesChannel = supabase
      .channel('user_replies_stats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bbs_replies',
          filter: `author_id=eq.${userId}`,
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(repliesChannel);
    };
  }, [userId]);

  return { stats, loading, error };
}
