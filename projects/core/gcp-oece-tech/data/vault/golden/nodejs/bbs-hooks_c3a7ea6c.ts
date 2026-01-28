import { useEffect, useState } from 'react';
import { supabase } from './client';

/**
 * BBS Post type with user info
 */
export interface BBSPost {
  id: string;
  title: string;
  content: string;
  author_id: string | null;
  is_pinned: boolean;
  is_featured: boolean;
  category: string;
  view_count: number;
  reply_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    display_name: string | null;
    avatar_url: string | null;
    role: string | null;
  };
}

/**
 * BBS Reply type with user info
 */
export interface BBSReply {
  id: string;
  post_id: string;
  content: string;
  author_id: string | null;
  parent_reply_id: string | null;
  created_at: string;
  updated_at: string;
  author?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

/**
 * Fetch all BBS posts with author info
 */
export function useBBSPosts() {
  const [posts, setPosts] = useState<BBSPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error} = await supabase
          .from('bbs_posts')
          .select(`
            *,
            author:users!author_id (
              display_name,
              avatar_url,
              role
            )
          `)
          .order('is_pinned', { ascending: false })
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('bbs-posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bbs_posts',
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { posts, loading, error };
}

/**
 * Fetch a single post with details
 */
export function useBBSPost(postId: string | undefined) {
  const [post, setPost] = useState<BBSPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!postId) {
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('bbs_posts')
          .select(`
            *,
            author:users!author_id (
              display_name,
              avatar_url,
              role
            )
          `)
          .eq('id', postId)
          .single();

        if (error) throw error;
        setPost(data);

        // Increment view count
        await supabase.rpc('increment_post_views', { post_id: postId });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return { post, loading, error };
}

/**
 * Fetch replies for a post
 */
export function useBBSReplies(postId: string | undefined) {
  const [replies, setReplies] = useState<BBSReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!postId) {
      setLoading(false);
      return;
    }

    const fetchReplies = async () => {
      try {
        const { data, error } = await supabase
          .from('bbs_replies')
          .select(`
            *,
            author:users!author_id (
              display_name,
              avatar_url
            )
          `)
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setReplies(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchReplies();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`bbs-replies-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bbs_replies',
          filter: `post_id=eq.${postId}`,
        },
        () => {
          fetchReplies();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  return { replies, loading, error };
}

/**
 * Create a new post
 */
export async function createBBSPost(title: string, content: string, category?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('bbs_posts')
    .insert({
      title,
      content,
      category: category || 'general',
      author_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Pin/unpin a post (admin only)
 */
export async function togglePinPost(postId: string, isPinned: boolean) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check if user is admin
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Only admins can pin posts');
  }

  const { error } = await supabase
    .from('bbs_posts')
    .update({ is_pinned: isPinned })
    .eq('id', postId);

  if (error) throw error;
}

/**
 * Feature/unfeature a post (admin only)
 */
export async function toggleFeaturePost(postId: string, isFeatured: boolean) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check if user is admin
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Only admins can feature posts');
  }

  const { error } = await supabase
    .from('bbs_posts')
    .update({ is_featured: isFeatured })
    .eq('id', postId);

  if (error) throw error;
}

/**
 * Create a new reply
 */
export async function createBBSReply(
  postId: string,
  content: string,
  parentReplyId?: string
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('bbs_replies')
    .insert({
      post_id: postId,
      content,
      author_id: user.id,
      parent_reply_id: parentReplyId || null,
    })
    .select()
    .single();

  if (error) throw error;

  // Update reply count
  await supabase.rpc('increment_reply_count', { post_id: postId });

  return data;
}

/**
 * Delete a post
 */
export async function deleteBBSPost(postId: string) {
  const { error } = await supabase
    .from('bbs_posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
}

/**
 * Delete a reply
 */
export async function deleteBBSReply(replyId: string, postId: string) {
  const { error } = await supabase
    .from('bbs_replies')
    .delete()
    .eq('id', replyId);

  if (error) throw error;

  // Decrement reply count
  await supabase.rpc('decrement_reply_count', { post_id: postId });
}
