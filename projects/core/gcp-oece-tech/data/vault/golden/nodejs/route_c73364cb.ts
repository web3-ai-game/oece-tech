import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/**
 * Health Check API
 * Used by Docker healthcheck and load balancers
 * GET /api/health
 */
export async function GET() {
  const startTime = Date.now();
  
  try {
    // Check Supabase connection
    const { error: dbError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
      .single();
    
    const responseTime = Date.now() - startTime;
    
    // Health check passed
    if (!dbError) {
      return NextResponse.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected',
          api: 'operational',
        },
        performance: {
          responseTime: `${responseTime}ms`,
        },
        version: process.env.DD_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
      }, {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }
    
    // Database connection failed
    return NextResponse.json({
      status: 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: 'disconnected',
        api: 'operational',
      },
      error: 'Database connection failed',
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
    
  } catch (error: any) {
    // Critical failure
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message || 'Unknown error',
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
}
