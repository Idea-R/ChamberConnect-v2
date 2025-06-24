'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Building, MapPin, Phone, Mail, Globe, Upload, Save, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export default function CreateChamberPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    logo_url: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
    if (!loading && profile?.role !== 'chamber_admin') {
      router.push('/dashboard')
    }
  }, [user, profile, loading, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Chamber name is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !user) return

    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('chambers')
        .insert({
          name: formData.name,
          description: formData.description,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          website: formData.website,
          logo_url: formData.logo_url,
          admin_id: user.id
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating chamber:', error)
        alert('Failed to create chamber. Please try again.')
      } else {
        // Update user profile with chamber_id
        await supabase
          .from('profiles')
          .update({ chamber_id: data.id })
          .eq('id', user.id)

        alert('Chamber created successfully!')
        router.push('/dashboard')
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

  if (!user || profile?.role !== 'chamber_admin') {
    return null // Will redirect
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
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create Your Chamber</h1>
          <p className="text-gray-600 mt-2">
            Set up your chamber of commerce profile and start building your business community
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chamber Logo */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Chamber Logo</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {formData.logo_url ? (
                      <img
                        src={formData.logo_url}
                        alt="Chamber logo"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Building className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full mb-4">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                  
                  <Input
                    label="Logo URL (optional)"
                    type="url"
                    placeholder="https://example.com/logo.jpg"
                    value={formData.logo_url}
                    onChange={(e) => handleInputChange('logo_url', e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Chamber Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Chamber Name"
                    placeholder="Downtown Business Chamber"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={errors.name}
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                      placeholder="Describe your chamber's mission, goals, and the community you serve..."
                      required
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Address"
                    placeholder="123 Main Street, City, State 12345"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    error={errors.address}
                    required
                  />
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      error={errors.phone}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="info@chamber.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={errors.email}
                      required
                    />
                  </div>
                  
                  <Input
                    label="Website (optional)"
                    type="url"
                    placeholder="https://www.chamber.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border border-gray-200 rounded-lg p-6 bg-white">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {formData.logo_url ? (
                          <img
                            src={formData.logo_url}
                            alt="Chamber logo"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Building className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {formData.name || 'Chamber Name'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {formData.description || 'Chamber description will appear here...'}
                        </p>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          {formData.address && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {formData.address}
                            </div>
                          )}
                          {formData.phone && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2" />
                              {formData.phone}
                            </div>
                          )}
                          {formData.email && (
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2" />
                              {formData.email}
                            </div>
                          )}
                          {formData.website && (
                            <div className="flex items-center">
                              <Globe className="w-4 h-4 mr-2" />
                              {formData.website}
                            </div>
                          )}
                        </div>
                      </div>
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
                  Create Chamber
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

