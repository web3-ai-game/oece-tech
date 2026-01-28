import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { NodeLocation } from '@/types/map'

export function useNodes() {
  const [nodes, setNodes] = useState<NodeLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNodes()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('nodes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nodes',
        },
        (payload) => {
          console.log('Node change detected:', payload)
          fetchNodes()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchNodes() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('nodes')
        .select('*')
        .order('arbitrage_score', { ascending: false })

      if (error) throw error

      setNodes(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch nodes')
      console.error('Error fetching nodes:', err)
    } finally {
      setLoading(false)
    }
  }

  return { nodes, loading, error, refetch: fetchNodes }
}
