import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Get total nodes count
    const { count: nodesCount, error: nodesError } = await supabase
      .from('nodes')
      .select('*', { count: 'exact', head: true })

    if (nodesError) throw nodesError

    // Get active nodes (status = 'online')
    const { count: activeCount, error: activeError } = await supabase
      .from('nodes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'online')

    if (activeError) throw activeError

    // Calculate average arbitrage score
    const { data: avgData, error: avgError } = await supabase
      .rpc('get_average_arbitrage_score')

    const stats = {
      totalNodes: nodesCount || 0,
      activeNodes: activeCount || 0,
      averageArbitrageScore: avgData || 0,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({ data: stats })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
