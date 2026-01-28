'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowUp,
  ArrowDown,
  Image,
  Video,
  FileText,
  DollarSign,
  Activity,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '@/lib/store/user-store';
import { useMemo } from 'react';

export default function DashboardPage() {
  const { balance, totalSpent, usageRecords, getTotalUsageCount, getUsageByType } = useUserStore();

  const stats = useMemo(() => [
    {
      title: 'Total Credits',
      value: `$${balance.toFixed(2)}`,
      change: `$${totalSpent > 0 ? totalSpent.toFixed(2) : '0.00'} spent`,
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: 'Images Generated',
      value: getTotalUsageCount('image').toString(),
      change: `$${getUsageByType('image').toFixed(2)} spent`,
      changeType: 'positive',
      icon: Image,
    },
    {
      title: 'Videos Created',
      value: getTotalUsageCount('video').toString(),
      change: `$${getUsageByType('video').toFixed(2)} spent`,
      changeType: 'positive',
      icon: Video,
    },
    {
      title: 'Content Written',
      value: (getTotalUsageCount('content') + getTotalUsageCount('copywriter')).toString(),
      change: `$${(getUsageByType('content') + getUsageByType('copywriter')).toFixed(2)} spent`,
      changeType: 'positive',
      icon: FileText,
    },
  ], [balance, totalSpent, getTotalUsageCount, getUsageByType]);

  const recentGenerations = useMemo(() => {
    const formatDate = (date: Date) => {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);

      if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
      if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      return 'Just now';
    };

    return usageRecords.slice(0, 4).map(record => ({
      id: record.id,
      type: record.type,
      title: record.title,
      cost: record.cost,
      date: formatDate(record.createdAt),
    }));
  }, [usageRecords]);

  const quickActions = [
    {
      title: 'Generate Image',
      description: 'Create AI-powered images',
      icon: Image,
      href: '/dashboard/tools/image',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Create Video',
      description: 'Generate videos from text',
      icon: Video,
      href: '/dashboard/tools/video',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Write Content',
      description: 'AI content assistant',
      icon: FileText,
      href: '/dashboard/tools/content',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Add Credits',
      description: 'Top up your balance',
      icon: CreditCard,
      href: '/dashboard/billing',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your AI Tools Hub activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={`inline-flex items-center ${
                      stat.changeType === 'positive'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {stat.changeType === 'positive' ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </span>{' '}
                  from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div
                      className={`mb-3 rounded-lg p-3 ${action.bgColor}`}
                    >
                      <Icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <h4 className="font-semibold">{action.title}</h4>
                    <p className="text-sm text-muted-foreground text-center">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity and Usage Chart */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Generations</CardTitle>
            <CardDescription>
              Your latest AI-generated content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGenerations.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {item.type === 'image' && (
                        <Image className="h-5 w-5 text-primary" alt="" />
                      )}
                      {item.type === 'video' && (
                        <Video className="h-5 w-5 text-primary" alt="" />
                      )}
                      {item.type === 'content' && (
                        <FileText className="h-5 w-5 text-primary" alt="" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.date}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">${item.cost}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/dashboard/history">View All History</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Usage Overview</CardTitle>
            <CardDescription>
              Your credit usage statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Images ({getTotalUsageCount('image')})</span>
                  <span className="text-sm text-muted-foreground">
                    ${getUsageByType('image').toFixed(2)}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${totalSpent > 0 ? Math.min(100, (getUsageByType('image') / totalSpent) * 100) : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Videos ({getTotalUsageCount('video')})</span>
                  <span className="text-sm text-muted-foreground">
                    ${getUsageByType('video').toFixed(2)}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${totalSpent > 0 ? Math.min(100, (getUsageByType('video') / totalSpent) * 100) : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Content ({getTotalUsageCount('content') + getTotalUsageCount('copywriter')})</span>
                  <span className="text-sm text-muted-foreground">
                    ${(getUsageByType('content') + getUsageByType('copywriter')).toFixed(2)}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${totalSpent > 0 ? Math.min(100, ((getUsageByType('content') + getUsageByType('copywriter')) / totalSpent) * 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Spent</span>
                <span className="text-2xl font-bold">${totalSpent.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Remaining balance: <span className="font-semibold text-primary">${balance.toFixed(2)}</span>
              </p>
            </div>

            <Button className="w-full mt-4" asChild>
              <Link href="/dashboard/analytics">
                <Activity className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
