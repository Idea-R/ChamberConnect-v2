'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Calendar, MessageCircle, Building, TrendingUp, DollarSign, Plus, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/lib/auth'

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  const isChamberAdmin = profile?.role === 'chamber_admin'
  const isTrialUser = profile?.role === 'trial_user'

  // Mock data based on user role
  const stats = isChamberAdmin ? [
    { title: 'Total Members', value: '127', icon: Users, change: '+12%', color: 'blue' },
    { title: 'Active Events', value: '8', icon: Calendar, change: '+3', color: 'green' },
    { title: 'Monthly Revenue', value: '$12,450', icon: DollarSign, change: '+8%', color: 'purple' },
    { title: 'Engagement Rate', value: '84%', icon: TrendingUp, change: '+5%', color: 'orange' }
  ] : [
    { title: 'My Connections', value: '23', icon: Users, change: '+3', color: 'blue' },
    { title: 'Events Attended', value: '5', icon: Calendar, change: '+2', color: 'green' },
    { title: 'Messages', value: '12', icon: MessageCircle, change: '+4', color: 'purple' },
    { title: 'Profile Views', value: '89', icon: TrendingUp, change: '+15%', color: 'orange' }
  ]

  const quickActions = isChamberAdmin ? [
    { title: 'Add New Member', icon: Users, href: '/members/add' },
    { title: 'Create Event', icon: Calendar, href: '/events/create' },
    { title: 'View Reports', icon: TrendingUp, href: '/reports' },
    { title: 'Chamber Settings', icon: Settings, href: '/settings' }
  ] : [
    { title: 'Update Profile', icon: Building, href: '/profile' },
    { title: 'Browse Events', icon: Calendar, href: '/events' },
    { title: 'Send Message', icon: MessageCircle, href: '/messages' },
    { title: 'View Directory', icon: Users, href: '/directory' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.full_name || user.email}!
          </h1>
          <p className="text-gray-600 mt-2">
            {isChamberAdmin 
              ? "Here's what's happening in your chamber today."
              : isTrialUser
              ? "You're on a 7-day trial. Explore all features!"
              : "Here's your business community overview."
            }
          </p>
          
          {isTrialUser && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-bold text-sm">!</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Trial Account</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your trial expires soon. Upgrade to continue accessing all features.
                  </p>
                </div>
                <div className="ml-auto">
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              orange: 'bg-orange-100 text-orange-600'
            }
            
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <button
                      key={index}
                      onClick={() => router.push(action.href)}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left min-h-[80px]"
                    >
                      <Icon className="w-6 h-6 text-blue-600 mb-2" />
                      <p className="text-sm font-medium text-gray-900">{action.title}</p>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isChamberAdmin ? (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New member joined</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Event created: Networking Mixer</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Monthly dues collected</p>
                        <p className="text-xs text-gray-500">3 days ago</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New message from TechStart Solutions</p>
                        <p className="text-xs text-gray-500">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">RSVP'd to Networking Mixer</p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <Building className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Profile updated</p>
                        <p className="text-xs text-gray-500">1 week ago</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

