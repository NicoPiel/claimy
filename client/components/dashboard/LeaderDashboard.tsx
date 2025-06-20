import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ResourceGrid } from '../resources/ResourceGrid';
import { settlementApi } from '../../api/client';
import { Building2, Users, ClipboardList, TrendingUp } from 'lucide-react';

export function LeaderDashboard() {
  const [selectedSettlement, setSelectedSettlement] = useState<string>('');

  const { data: settlements = [] } = useQuery({
    queryKey: ['settlements'],
    queryFn: settlementApi.getAll,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks-overview'],
    queryFn: () => [], // TODO: Implement task overview query
  });

  // Set default settlement when settlements load
  if (settlements.length > 0 && !selectedSettlement) {
    setSelectedSettlement(settlements[0].id);
  }

  const selectedSettlementData = settlements.find(s => s.id === selectedSettlement);

  const stats = [
    {
      title: 'Total Settlements',
      value: settlements.length,
      icon: Building2,
      description: 'Active settlements',
    },
    {
      title: 'Active Tasks',
      value: tasks.filter((t: any) => t.status === 'in_progress').length,
      icon: ClipboardList,
      description: 'Tasks in progress',
    },
    {
      title: 'Guild Members',
      value: 12, // TODO: Get from API
      icon: Users,
      description: 'Total members',
    },
    {
      title: 'Completion Rate',
      value: '85%', // TODO: Calculate from data
      icon: TrendingUp,
      description: 'Weekly completion',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Guild Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your guild's resources and track progress across all settlements
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Settlement Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Settlement Resources</CardTitle>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Select Settlement:</span>
              <Select value={selectedSettlement} onValueChange={setSelectedSettlement}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Choose settlement" />
                </SelectTrigger>
                <SelectContent>
                  {settlements.map((settlement) => (
                    <SelectItem key={settlement.id} value={settlement.id}>
                      {settlement.name} (T{settlement.tier})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                Add Settlement
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedSettlementData ? (
            <ResourceGrid
              settlementId={selectedSettlement}
              settlementName={selectedSettlementData.name}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {settlements.length === 0 
                  ? 'No settlements found. Create your first settlement to get started.'
                  : 'Select a settlement to view resources.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Player123</span> completed 50 Timber for Settlement T1
                <span className="text-xs text-muted-foreground block">2 hours ago</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">CraftMaster</span> was assigned 200 Stone Chunks
                <span className="text-xs text-muted-foreground block">4 hours ago</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">ResourceGuru</span> updated Settlement T3 requirements
                <span className="text-xs text-muted-foreground block">6 hours ago</span>
              </div>
            </div>
            <Button variant="link" className="mt-4 p-0">
              View all activity
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Urgent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Settlement T1</span> needs 500 Timber
                <span className="text-xs text-destructive block">Overdue by 2 days</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Settlement T2</span> running low on Stone
                <span className="text-xs text-yellow-600 block">Due tomorrow</span>
              </div>
            </div>
            <Button variant="link" className="mt-4 p-0">
              Manage all tasks
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Guild Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Resources Gathered (Week)</span>
                <span className="font-medium">15,420</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tasks Completed</span>
                <span className="font-medium">47/55</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Active Contributors</span>
                <span className="font-medium">8/12</span>
              </div>
            </div>
            <Button variant="link" className="mt-4 p-0">
              View detailed reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}