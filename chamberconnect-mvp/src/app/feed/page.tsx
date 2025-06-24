'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, MessageCircle, Share2, Plus, Search, Filter, Calendar, Star, DollarSign, Megaphone, Newspaper, MoreHorizontal, Bookmark, Flag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/lib/auth'
import { useEventsStore, getPostTypeIcon, getPostTypeColor } from '@/stores/eventsStore'

export default function FeedPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreatePost, setShowCreatePost] = useState(false)

  const {
    feedPosts,
    likeFeedPost,
    unlikeFeedPost,
    addFeedPost
  } = useEventsStore()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const filteredPosts = feedPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || post.type === filterType
    const matchesVisibility = post.visibility === 'public' || 
                             (post.visibility === 'members_only' && user) ||
                             (post.visibility === 'chamber_admin_only' && profile?.role === 'chamber_admin')
    
    return matchesSearch && matchesType && matchesVisibility
  })

  const handleLike = (postId: string) => {
    const post = feedPosts.find(p => p.id === postId)
    if (post?.isLiked) {
      unlikeFeedPost(postId)
    } else {
      likeFeedPost(postId)
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return time.toLocaleDateString()
  }

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'event': return Calendar
      case 'announcement': return Megaphone
      case 'business_spotlight': return Star
      case 'deal': return DollarSign
      case 'news': return Newspaper
      default: return MessageCircle
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chamber Feed</h1>
            <p className="text-gray-600 mt-2">
              Stay updated with chamber news, events, and member highlights
            </p>
          </div>
          {(profile?.role === 'chamber_admin' || profile?.role === 'business_owner') && (
            <Button
              onClick={() => setShowCreatePost(true)}
              className="mt-4 md:mt-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
              >
                <option value="all">All Posts</option>
                <option value="announcement">Announcements</option>
                <option value="event">Events</option>
                <option value="business_spotlight">Business Spotlights</option>
                <option value="deal">Deals & Offers</option>
                <option value="news">News</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Create Post Modal/Form */}
        {showCreatePost && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]">
                  <option value="announcement">Announcement</option>
                  <option value="business_spotlight">Business Spotlight</option>
                  <option value="deal">Deal & Offer</option>
                  <option value="news">News</option>
                </select>
                
                <Input
                  placeholder="Post title..."
                  className="text-lg font-medium"
                />
                
                <textarea
                  rows={4}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                  placeholder="What's happening in the chamber community?"
                />
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreatePost(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setShowCreatePost(false)}>
                    Post
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feed Posts */}
        <div className="space-y-6">
          {filteredPosts.map((post) => {
            const PostIcon = getPostIcon(post.type)
            
            return (
              <Card key={post.id} className="overflow-hidden">
                <CardContent className="p-6">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                        {post.author.avatar}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">
                            {post.author.name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.type)}`}>
                            {post.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {post.author.company} • {formatTimeAgo(post.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Post Image */}
                  {post.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Post Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-2 text-sm transition-colors ${
                          post.isLiked 
                            ? 'text-red-600 hover:text-red-700' 
                            : 'text-gray-600 hover:text-red-600'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span>{post.likes}</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments}</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span>{post.shares}</span>
                      </button>
                    </div>

                    {/* Related Actions */}
                    <div className="flex items-center space-x-2">
                      {post.eventId && (
                        <Link href={`/events`}>
                          <Button variant="outline" size="sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            View Event
                          </Button>
                        </Link>
                      )}
                      
                      {post.businessId && (
                        <Link href={`/directory`}>
                          <Button variant="outline" size="sm">
                            <Star className="w-4 h-4 mr-2" />
                            View Business
                          </Button>
                        </Link>
                      )}
                      
                      {post.type === 'deal' && (
                        <Button variant="outline" size="sm">
                          <DollarSign className="w-4 h-4 mr-2" />
                          Get Deal
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {post.likes > 0 && `${post.likes} ${post.likes === 1 ? 'like' : 'likes'}`}
                        {post.likes > 0 && post.comments > 0 && ' • '}
                        {post.comments > 0 && `${post.comments} ${post.comments === 1 ? 'comment' : 'comments'}`}
                      </span>
                      <span>
                        {post.shares > 0 && `${post.shares} ${post.shares === 1 ? 'share' : 'shares'}`}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredPosts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No posts found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterType !== 'all'
                  ? 'Try adjusting your search terms or filters'
                  : 'Be the first to share something with the chamber community!'
                }
              </p>
              {(profile?.role === 'chamber_admin' || profile?.role === 'business_owner') && (
                <Button onClick={() => setShowCreatePost(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

