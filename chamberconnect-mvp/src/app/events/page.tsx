'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Users, Plus, Search, Filter, Heart, Share2, MessageCircle, Star, DollarSign, Globe, Video } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/lib/auth'
import { useEventsStore, formatEventDate, formatEventTime, getCategoryColor, getEventStatusColor } from '@/stores/eventsStore'

export default function EventsPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const {
    events,
    filterCategory,
    filterDate,
    searchTerm,
    setFilterCategory,
    setFilterDate,
    setSearchTerm,
    registerForEvent,
    unregisterFromEvent
  } = useEventsStore()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory
    
    const matchesDate = filterDate === 'all' || (() => {
      const eventDate = new Date(event.date)
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)
      const nextWeek = new Date(today)
      nextWeek.setDate(today.getDate() + 7)
      const nextMonth = new Date(today)
      nextMonth.setMonth(today.getMonth() + 1)

      switch (filterDate) {
        case 'today':
          return eventDate.toDateString() === today.toDateString()
        case 'tomorrow':
          return eventDate.toDateString() === tomorrow.toDateString()
        case 'this_week':
          return eventDate >= today && eventDate <= nextWeek
        case 'this_month':
          return eventDate >= today && eventDate <= nextMonth
        case 'past':
          return eventDate < today
        default:
          return true
      }
    })()

    return matchesSearch && matchesCategory && matchesDate && event.status === 'published'
  })

  const upcomingEvents = filteredEvents.filter(event => new Date(event.date) >= new Date()).slice(0, 3)
  const featuredEvent = upcomingEvents[0]

  const handleRSVP = (eventId: string) => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    const event = events.find(e => e.id === eventId)
    const isRegistered = event?.attendees.some(attendee => attendee.id === user.id)
    
    if (isRegistered) {
      unregisterFromEvent(eventId, user.id)
    } else {
      registerForEvent(eventId, user.id)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chamber Events</h1>
            <p className="text-gray-600 mt-2">
              Discover networking opportunities and educational workshops
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            {user && (profile?.role === 'chamber_admin' || profile?.role === 'business_owner') && (
              <Link href="/events/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Featured Event */}
        {featuredEvent && (
          <Card className="mb-8 overflow-hidden">
            <div className="lg:flex">
              <div className="lg:w-1/3">
                <div className="h-48 lg:h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Calendar className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-sm font-medium">Featured Event</p>
                  </div>
                </div>
              </div>
              <div className="lg:w-2/3 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(featuredEvent.category)}`}>
                        {featuredEvent.category}
                      </span>
                      {featuredEvent.price === 0 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Free
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {featuredEvent.title}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {featuredEvent.description}
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                    <div>
                      <p className="font-medium">{formatEventDate(featuredEvent.date)}</p>
                      <p className="text-sm">{formatEventTime(featuredEvent.time)}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    {featuredEvent.isVirtual ? (
                      <Video className="w-5 h-5 mr-3 text-green-500" />
                    ) : (
                      <MapPin className="w-5 h-5 mr-3 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">{featuredEvent.location}</p>
                      <p className="text-sm">{featuredEvent.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-3 text-purple-500" />
                    <div>
                      <p className="font-medium">
                        {featuredEvent.currentAttendees} attending
                      </p>
                      {featuredEvent.maxAttendees && (
                        <p className="text-sm">
                          {featuredEvent.maxAttendees - featuredEvent.currentAttendees} spots left
                        </p>
                      )}
                    </div>
                  </div>
                  {featuredEvent.price > 0 && (
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-5 h-5 mr-3 text-green-500" />
                      <div>
                        <p className="font-medium">${featuredEvent.price}</p>
                        <p className="text-sm">per person</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => handleRSVP(featuredEvent.id)}
                    className="flex-1 md:flex-none"
                  >
                    {featuredEvent.attendees.some(a => a.id === user?.id) ? 'Cancel RSVP' : 'RSVP Now'}
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
                >
                  <option value="all">All Categories</option>
                  <option value="networking">Networking</option>
                  <option value="workshop">Workshop</option>
                  <option value="social">Social</option>
                  <option value="business">Business</option>
                  <option value="community">Community</option>
                </select>
                
                <select
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                  <option value="past">Past Events</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const isRegistered = event.attendees.some(attendee => attendee.id === user?.id)
            const isPast = new Date(event.date) < new Date()
            
            return (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Calendar className="w-16 h-16 text-gray-400" />
                  )}
                  
                  <div className="absolute top-4 left-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                  
                  <div className="absolute top-4 right-4 flex space-x-2">
                    {event.price === 0 && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Free
                      </span>
                    )}
                    {event.isVirtual && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Virtual
                      </span>
                    )}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{formatEventDate(event.date)} at {formatEventTime(event.time)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      {event.isVirtual ? (
                        <Video className="w-4 h-4 mr-2 text-green-500" />
                      ) : (
                        <MapPin className="w-4 h-4 mr-2 text-red-500" />
                      )}
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-purple-500" />
                      <span>{event.currentAttendees} attending</span>
                      {event.maxAttendees && (
                        <span className="text-gray-400 ml-1">
                          / {event.maxAttendees} max
                        </span>
                      )}
                    </div>
                    {event.price > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                        <span>${event.price} per person</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      onClick={() => handleRSVP(event.id)}
                      disabled={isPast || Boolean(event.maxAttendees && event.currentAttendees >= event.maxAttendees && !isRegistered)}
                      variant={isRegistered ? "outline" : "primary"}
                      className="flex-1 mr-2"
                    >
                      {isPast ? 'Past Event' : 
                       isRegistered ? 'Cancel RSVP' : 
                       (event.maxAttendees && event.currentAttendees >= event.maxAttendees) ? 'Full' : 
                       'RSVP'}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredEvents.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterCategory !== 'all' || filterDate !== 'all'
                  ? 'Try adjusting your search terms or filters'
                  : 'No events are currently scheduled. Check back soon!'
                }
              </p>
              {user && (profile?.role === 'chamber_admin' || profile?.role === 'business_owner') && (
                <Link href="/events/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Event
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

