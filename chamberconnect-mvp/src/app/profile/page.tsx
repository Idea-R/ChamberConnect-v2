'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Building, Mail, Phone, MapPin, Globe, Camera, Save, Edit } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    bio: '',
    company_name: '',
    company_description: '',
    company_category: ''
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: '',
        address: '',
        website: '',
        bio: '',
        company_name: '',
        company_description: '',
        company_category: ''
      })
    }
  }, [profile])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating profile:', error)
        alert('Failed to update profile')
      } else {
        setEditing(false)
        alert('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('An unexpected error occurred')
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

  if (!user) {
    return null // Will redirect to login
  }

  const isChamberAdmin = profile?.role === 'chamber_admin'
  const isTrialUser = profile?.role === 'trial_user'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your {isChamberAdmin ? 'chamber administrator' : isTrialUser ? 'trial' : 'business'} profile
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-12 h-12 text-gray-600" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {profile?.full_name || user.email}
                </h3>
                <p className="text-sm text-gray-500 mb-2 capitalize">
                  {profile?.role?.replace('_', ' ')}
                </p>
                
                {isTrialUser && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-yellow-700 font-medium">Trial Account</p>
                    <p className="text-xs text-yellow-600">Upgrade to unlock all features</p>
                  </div>
                )}
                
                <Button
                  variant={editing ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => setEditing(!editing)}
                  className="w-full"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {editing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    disabled={!editing}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={true} // Email should not be editable
                    helperText="Email cannot be changed"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!editing}
                    placeholder="(555) 123-4567"
                  />
                  <Input
                    label="Website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    disabled={!editing}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                
                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!editing}
                  placeholder="123 Main Street, City, State 12345"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!editing}
                    rows={4}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed placeholder:text-gray-400"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Business Information (for Business Owners) */}
            {profile?.role === 'business_owner' && (
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Company Name"
                      value={formData.company_name}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      disabled={!editing}
                      placeholder="Your Business Name"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Category
                      </label>
                      <select
                        value={formData.company_category}
                        onChange={(e) => handleInputChange('company_category', e.target.value)}
                        disabled={!editing}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed min-h-[44px]"
                      >
                        <option value="">Select a category</option>
                        <option value="Legal Services">Legal Services</option>
                        <option value="Food & Dining">Food & Dining</option>
                        <option value="Technology">Technology</option>
                        <option value="Retail">Retail</option>
                        <option value="Health & Fitness">Health & Fitness</option>
                        <option value="Professional Services">Professional Services</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Real Estate">Real Estate</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Description
                    </label>
                    <textarea
                      value={formData.company_description}
                      onChange={(e) => handleInputChange('company_description', e.target.value)}
                      disabled={!editing}
                      rows={4}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed placeholder:text-gray-400"
                      placeholder="Describe your business and services..."
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Chamber Information (for Chamber Admins) */}
            {profile?.role === 'chamber_admin' && (
              <Card>
                <CardHeader>
                  <CardTitle>Chamber Administration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Building className="w-5 h-5 text-blue-600 mr-2" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900">Chamber Administrator</h4>
                        <p className="text-sm text-blue-700">You have full access to chamber management features.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={() => router.push('/members')}>
                      <User className="w-4 h-4 mr-2" />
                      Manage Members
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/settings')}>
                      <Building className="w-4 h-4 mr-2" />
                      Chamber Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Save Button */}
            {editing && (
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  loading={saving}
                  size="lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

