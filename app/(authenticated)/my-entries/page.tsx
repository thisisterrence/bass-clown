import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Gift, Trophy, Users, CheckCircle, Crown, ExternalLink, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

interface Entry {
  id: string;
  title: string;
  description: string;
  prizeValue: string;
  entryCount: number;
  maxEntries: number;
  entryNumber: number;
  entryDate: Date;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'upcoming' | 'ended';
  userResult?: 'won' | 'lost' | 'pending';
  image: string;
}

// Mock data - replace with actual API calls
const mockUserEntries: Entry[] = [
  {
    id: '1',
    title: 'Bass Fishing Gear Bundle',
    description: 'Win a complete bass fishing setup including rod, reel, and tackle box',
    prizeValue: '$500',
    entryCount: 234,
    maxEntries: 1000,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-15'),
    status: 'active',
    entryDate: new Date('2024-01-16'),
    entryNumber: 45,
    userResult: undefined,
    image: '/images/giveaway-fishing-gear.jpg'
  },
  {
    id: '2',
    title: 'Tournament Entry Package',
    description: 'Free entry to our next bass fishing tournament plus accommodation',
    prizeValue: '$300',
    entryCount: 156,
    maxEntries: 500,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-03-01'),
    status: 'upcoming',
    entryDate: new Date('2024-01-28'),
    entryNumber: 23,
    userResult: undefined,
    image: '/images/giveaway-tournament.jpg'
  },
  {
    id: '3',
    title: 'Lucky Lure Collection',
    description: 'Collection of 20 proven bass lures from top brands',
    prizeValue: '$200',
    entryCount: 156,
    maxEntries: 200,
    startDate: new Date('2023-10-01'),
    endDate: new Date('2023-10-31'),
    status: 'ended',
    entryDate: new Date('2023-10-05'),
    entryNumber: 12,
    userResult: 'won',
    image: '/images/giveaway-lures.jpg'
  },
  {
    id: '4',
    title: 'Summer Fishing Gear',
    description: 'Essential gear for hot summer bass fishing',
    prizeValue: '$300',
    entryCount: 445,
    maxEntries: 500,
    startDate: new Date('2023-08-01'),
    endDate: new Date('2023-08-31'),
    status: 'ended',
    entryDate: new Date('2023-08-03'),
    entryNumber: 89,
    userResult: 'lost',
    image: '/images/giveaway-summer-gear.jpg'
  },
  {
    id: '5',
    title: 'Holiday Fishing Bundle',
    description: 'Complete fishing setup perfect for the holidays',
    prizeValue: '$750',
    entryCount: 892,
    maxEntries: 1000,
    startDate: new Date('2023-12-01'),
    endDate: new Date('2023-12-31'),
    status: 'ended',
    entryDate: new Date('2023-12-02'),
    entryNumber: 67,
    userResult: 'lost',
    image: '/images/giveaway-holiday-bundle.jpg'
  }
];

function EntryCard({ entry }: { entry: Entry }) {
  const isActive = entry.status === 'active';
  const isUpcoming = entry.status === 'upcoming';
  const isEnded = entry.status === 'ended';
  const userWon = entry.userResult === 'won';
  const userLost = entry.userResult === 'lost';
  const daysLeft = Math.ceil((entry.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const entryPercentage = (entry.entryCount / entry.maxEntries) * 100;
  
  return (
    <Card className="bg-[#2D2D2D] border-gray-700 hover:bg-[#3D3D3D] transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
                         <CardTitle className="text-xl mb-2 text-white">{entry.title}</CardTitle>
             <CardDescription className="text-gray-400">{entry.description}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={isActive ? "default" : isUpcoming ? "secondary" : "outline"}>
              {isActive ? "Active" : isUpcoming ? "Upcoming" : "Ended"}
            </Badge>
            {userWon && (
              <Badge variant="default" className="bg-yellow-500">
                <Crown className="w-3 h-3 mr-1" />
                Winner!
              </Badge>
            )}
            {userLost && isEnded && (
              <Badge variant="outline" className="text-gray-500">
                Not Selected
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="aspect-video bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center rounded-lg">
            <Gift className="w-16 h-16 text-blue-300" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Prize Value</span>
                                 <span className="font-bold text-green-400">{entry.prizeValue}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Your Entry #</span>
                                 <span className="font-medium text-white">{entry.entryNumber}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Entries</span>
                                 <span className="font-medium text-white">{entry.entryCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Your Odds</span>
                                 <span className="font-medium text-white">1 in {entry.entryCount}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Entry Progress</span>
              <span className="text-white">{entryPercentage.toFixed(0)}% filled</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${entryPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Entered on {entry.entryDate.toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              {isActive && (
                <span>Ends in {daysLeft} days ({entry.endDate.toLocaleDateString()})</span>
              )}
              {isUpcoming && (
                <span>Starts {entry.startDate.toLocaleDateString()}</span>
              )}
              {isEnded && (
                <span>Ended {entry.endDate.toLocaleDateString()}</span>
              )}
            </div>
          </div>
          
          <Separator className="bg-gray-700" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-400">Entry Confirmed</span>
            </div>
            
            <Button variant="outline" size="sm" asChild>
                              <Link href={`/giveaways/${entry.id}`}>
                View Details
                <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MyEntriesPage() {
  const activeEntries = mockUserEntries.filter(e => e.status === 'active');
  const upcomingEntries = mockUserEntries.filter(e => e.status === 'upcoming');
  const endedEntries = mockUserEntries.filter(e => e.status === 'ended');
  const wins = mockUserEntries.filter(e => e.userResult === 'won');
  const losses = mockUserEntries.filter(e => e.userResult === 'lost');
  const totalPrizeValue = mockUserEntries.reduce((sum, e) => sum + parseInt(e.prizeValue.replace('$', '').replace(',', '')), 0);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Giveaway Entries</h1>
              <p className="text-gray-400">
                Track all your giveaway entries and see your results
              </p>
            </div>
            <Button asChild>
              <Link href="/giveaways">Browse Giveaways</Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#2D2D2D] border-gray-700">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{mockUserEntries.length}</div>
                <div className="text-sm text-gray-400">Total Entries</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#2D2D2D] border-gray-700">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{activeEntries.length}</div>
                <div className="text-sm text-gray-400">Active Entries</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#2D2D2D] border-gray-700">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{wins.length}</div>
                <div className="text-sm text-gray-400">Wins</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#2D2D2D] border-gray-700">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {endedEntries.length > 0 ? Math.round((wins.length / endedEntries.length) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-400">Win Rate</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different entry types */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-[#2D2D2D]">
            <TabsTrigger value="active">
              Active ({activeEntries.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingEntries.length})
            </TabsTrigger>
            <TabsTrigger value="wins">
              Wins ({wins.length})
            </TabsTrigger>
            <TabsTrigger value="ended">
              All Ended ({endedEntries.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Entries */}
          <TabsContent value="active" className="space-y-6">
            {activeEntries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeEntries.map(entry => (
                  <EntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            ) : (
              <Card className="bg-[#2D2D2D] border-gray-700">
                <CardContent className="p-8 text-center">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Active Entries</h3>
                  <p className="text-gray-400 mb-4">
                    You don&apos;t have any active giveaway entries right now
                  </p>
                  <Button asChild>
                    <Link href="/giveaways">Find Active Giveaways</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Upcoming Entries */}
          <TabsContent value="upcoming" className="space-y-6">
            {upcomingEntries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEntries.map(entry => (
                  <EntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            ) : (
              <Card className="bg-[#2D2D2D] border-gray-700">
                <CardContent className="p-8 text-center">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Upcoming Entries</h3>
                  <p className="text-gray-400 mb-4">
                    You haven&apos;t entered any upcoming giveaways yet
                  </p>
                  <Button asChild>
                    <Link href="/giveaways">Browse Upcoming Giveaways</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Wins */}
          <TabsContent value="wins" className="space-y-6">
            {wins.length > 0 ? (
              <>
                <div className="bg-gradient-to-r from-yellow-900 to-orange-900 border border-yellow-600 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Crown className="w-8 h-8 text-yellow-400" />
                    <div>
                      <h3 className="text-lg font-bold text-yellow-300">Congratulations!</h3>
                      <p className="text-sm text-yellow-200">You&apos;ve won {wins.length} giveaway{wins.length !== 1 ? 's' : ''}!</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-300">
                        ${wins.reduce((sum, w) => sum + parseInt(w.prizeValue.replace('$', '').replace(',', '')), 0).toLocaleString()}
                      </div>
                      <div className="text-yellow-200">Total Prize Value</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-300">{wins.length}</div>
                      <div className="text-yellow-200">Giveaways Won</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-300">
                        {Math.round((wins.length / endedEntries.length) * 100)}%
                      </div>
                      <div className="text-yellow-200">Win Rate</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wins.map(entry => (
                    <EntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </>
            ) : (
              <Card className="bg-[#2D2D2D] border-gray-700">
                <CardContent className="p-8 text-center">
                  <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Wins Yet</h3>
                  <p className="text-gray-400 mb-4">
                    Keep entering giveaways to increase your chances of winning!
                  </p>
                  <Button asChild>
                    <Link href="/giveaways">Enter More Giveaways</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* All Ended Entries */}
          <TabsContent value="ended" className="space-y-6">
            {endedEntries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {endedEntries.map(entry => (
                  <EntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            ) : (
              <Card className="bg-[#2D2D2D] border-gray-700">
                <CardContent className="p-8 text-center">
                  <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Ended Entries</h3>
                  <p className="text-gray-400">
                    Your ended giveaway entries will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Empty State for no entries at all */}
        {mockUserEntries.length === 0 && (
          <Card className="bg-[#2D2D2D] border-gray-700">
            <CardContent className="p-8 text-center">
              <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Giveaway Entries</h3>
              <p className="text-gray-400 mb-4">
                                  You haven&apos;t entered any giveaways yet. Start entering to win amazing prizes!
              </p>
              <Button asChild>
                <Link href="/giveaways">Browse Giveaways</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
} 