'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, MapPin, Users, DollarSign, Upload, Save, ArrowLeft, Globe, Video, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/lib/auth'
import { useEventsStore } from '@/stores/eventsStore'

export default function CreateEventPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const { addEvent } = useEventsStore()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    endTime: '',
    location: '',
    address: '',
    category: 'networking' as const,
    maxAttendees: '',
    price: '',
    isVirtual: false,
    virtualLink: '',
    imageUrl: '',
    tags: [''],
    requirements: '',
    agenda: ['']
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
    if (!loading && profile?.role !== 'chamber_admin' && profile?.role !== 'business_owner') {
      router.push('/events')
    }
  }, [user, profile, loading, router])

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags]
    newTags[index] = value
    setFormData(prev => ({ ...prev, tags: newTags }))
  }

  const addTag = () => {
    setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }))
  }

  const removeTag = (index: number) => {
    if (formData.tags.length > 1) {
      const newTags = formData.tags.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, tags: newTags }))
    }
  }

  const handleAgendaChange = (index: number, value: string) => {
    const newAgenda = [...formData.agenda]
    newAgenda[index] = value
    setFormData(prev => ({ ...prev, agenda: newAgenda }))
  }

  const addAgendaItem = () => {
    setFormData(prev => ({ ...prev, agenda: [...prev.agenda, ''] }))
  }

  const removeAgendaItem = (index: number) => {
    if (formData.agenda.length > 1) {
      const newAgenda = formData.agenda.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, agenda: newAgenda }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required'
    }
    if (!formData.date) {
      newErrors.date = 'Event date is required'
    }
    if (!formData.time) {
      newErrors.time = 'Event time is required'
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }
    if (!formData.isVirtual && !formData.address.trim()) {
      newErrors.address = 'Address is required for in-person events'
    }
    if (formData.isVirtual && !formData.virtualLink.trim()) {
      newErrors.virtualLink = 'Virtual link is required for virtual events'
    }
    if (formData.maxAttendees && parseInt(formData.maxAttendees) < 1) {
      newErrors.maxAttendees = 'Maximum attendees must be at least 1'
    }
    if (formData.price && parseFloat(formData.price) < 0) {
      newErrors.price = 'Price cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !user) return

    setSaving(true)
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        endTime: formData.endTime || undefined,
        location: formData.location,
        address: formData.isVirtual ? 'Virtual Event' : formData.address,
        category: formData.category,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
        currentAttendees: 0,
        price: formData.price ? parseFloat(formData.price) : 0,
        isVirtual: formData.isVirtual,
        virtualLink: formData.virtualLink || undefined,
        imageUrl: formData.imageUrl || undefined,
        organizer: {
          id: user.id,
          name: profile?.full_name || user.email?.split('@')[0] || 'Unknown',
          company: 'Chamber Organization',
          avatar: '👤'
        },
        attendees: [],
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        status: 'published' as const,
        requirements: formData.requirements || undefined,
        agenda: formData.agenda.filter(item => item.trim() !== '')
      }

      addEvent(eventData)
      router.push('/events')
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Failed to create event. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || (profile?.role !== 'chamber_admin' && profile?.role !== 'business_owner')) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <p className="text-gray-600 mt-2">
            Organize networking events, workshops, and community gatherings
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  label="Event Title"
                  placeholder="Monthly Networking Mixer"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  error={errors.title}
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                    placeholder="Describe your event, what attendees can expect, and any special features..."
                    required
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
                    required
                  >
                    <option value="networking">Networking</option>
                    <option value="workshop">Workshop</option>
                    <option value="social">Social</option>
                    <option value="business">Business</option>
                    <option value="community">Community</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card>
              <CardHeader>
                <CardTitle>Date & Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    label="Event Date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    error={errors.date}
                    required
                  />
                  <Input
                    label="Start Time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    error={errors.time}
                    required
                  />
                  <Input
                    label="End Time (optional)"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="eventType"
                      checked={!formData.isVirtual}
                      onChange={() => handleInputChange('isVirtual', false)}
                      className="mr-2"
                    />
                    <Globe className="w-4 h-4 mr-1" />
                    In-Person
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="eventType"
                      checked={formData.isVirtual}
                      onChange={() => handleInputChange('isVirtual', true)}
                      className="mr-2"
                    />
                    <Video className="w-4 h-4 mr-1" />
                    Virtual
                  </label>
                </div>
                
                <Input
                  label="Location Name"
                  placeholder={formData.isVirtual ? "Zoom Meeting" : "Downtown Conference Center"}
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  error={errors.location}
                  required
                />
                
                {formData.isVirtual ? (
                  <Input
                    label="Virtual Meeting Link"
                    type="url"
                    placeholder="https://zoom.us/j/123456789"
                    value={formData.virtualLink}
                    onChange={(e) => handleInputChange('virtualLink', e.target.value)}
                    error={errors.virtualLink}
                    required
                  />
                ) : (
                  <Input
                    label="Address"
                    placeholder="123 Main Street, City, State 12345"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    error={errors.address}
                    required
                  />
                )}
              </CardContent>
            </Card>

            {/* Capacity & Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Capacity & Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Maximum Attendees (optional)"
                    type="number"
                    placeholder="50"
                    value={formData.maxAttendees}
                    onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
                    error={errors.maxAttendees}
                  />
                  <Input
                    label="Price per Person"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    error={errors.price}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  label="Event Image URL (optional)"
                  type="url"
                  placeholder="https://example.com/event-image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements (optional)
                  </label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                    placeholder="Business cards recommended, laptop required, formal attire..."
                  />
                </div>
                
                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="space-y-2">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder="networking, business, monthly"
                          value={tag}
                          onChange={(e) => handleTagChange(index, e.target.value)}
                        />
                        {formData.tags.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTag(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTag}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Tag
                    </Button>
                  </div>
                </div>
                
                {/* Agenda */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agenda (optional)
                  </label>
                  <div className="space-y-2">
                    {formData.agenda.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder="Welcome & Introductions (6:00 PM)"
                          value={item}
                          onChange={(e) => handleAgendaChange(index, e.target.value)}
                        />
                        {formData.agenda.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAgendaItem(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addAgendaItem}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Agenda Item
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={saving}
                size="lg"
              >
                <Save className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

