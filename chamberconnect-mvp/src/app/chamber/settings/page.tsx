'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, Users, DollarSign, Bell, Shield, Building, Save, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/lib/auth'

export default function ChamberSettingsPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [generalSettings, setGeneralSettings] = useState({
    name: 'Downtown Business Chamber',
    description: 'Supporting local businesses and fostering community growth since 1985.',
    address: '123 Main Street, Downtown, ST 12345',
    phone: '(555) 123-4567',
    email: 'info@downtownchamber.com',
    website: 'https://www.downtownchamber.com'
  })
  const [membershipSettings, setMembershipSettings] = useState({
    monthly_dues: '50',
    annual_dues: '500',
    trial_period_days: '7',
    auto_approve_businesses: false,
    require_approval: true
  })
  const [notificationSettings, setNotificationSettings] = useState({
    new_member_notifications: true,
    event_reminders: true,
    payment_notifications: true,
    weekly_digest: true
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
    if (!loading && profile?.role !== 'chamber_admin') {
      router.push('/dashboard')
    }
  }, [user, profile, loading, router])

  const handleGeneralChange = (field: string, value: string) => {
    setGeneralSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleMembershipChange = (field: string, value: string | boolean) => {
    setMembershipSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    alert('Settings saved successfully!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || profile?.role !== 'chamber_admin') {
    return null
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Building },
    { id: 'membership', label: 'Membership', icon: Users },
    { id: 'billing', label: 'Billing', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Chamber Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your chamber configuration and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Chamber Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      label="Chamber Name"
                      value={generalSettings.name}
                      onChange={(e) => handleGeneralChange('name', e.target.value)}
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={generalSettings.description}
                        onChange={(e) => handleGeneralChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <Input
                      label="Address"
                      value={generalSettings.address}
                      onChange={(e) => handleGeneralChange('address', e.target.value)}
                    />
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Phone"
                        value={generalSettings.phone}
                        onChange={(e) => handleGeneralChange('phone', e.target.value)}
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={generalSettings.email}
                        onChange={(e) => handleGeneralChange('email', e.target.value)}
                      />
                    </div>
                    
                    <Input
                      label="Website"
                      type="url"
                      value={generalSettings.website}
                      onChange={(e) => handleGeneralChange('website', e.target.value)}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Membership Settings */}
            {activeTab === 'membership' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Membership Dues</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Monthly Dues ($)"
                        type="number"
                        value={membershipSettings.monthly_dues}
                        onChange={(e) => handleMembershipChange('monthly_dues', e.target.value)}
                      />
                      <Input
                        label="Annual Dues ($)"
                        type="number"
                        value={membershipSettings.annual_dues}
                        onChange={(e) => handleMembershipChange('annual_dues', e.target.value)}
                      />
                    </div>
                    
                    <Input
                      label="Trial Period (days)"
                      type="number"
                      value={membershipSettings.trial_period_days}
                      onChange={(e) => handleMembershipChange('trial_period_days', e.target.value)}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Approval Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Require Approval</h4>
                        <p className="text-sm text-gray-500">New businesses must be approved before joining</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={membershipSettings.require_approval}
                        onChange={(e) => handleMembershipChange('require_approval', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Auto-approve Businesses</h4>
                        <p className="text-sm text-gray-500">Automatically approve businesses that meet criteria</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={membershipSettings.auto_approve_businesses}
                        onChange={(e) => handleMembershipChange('auto_approve_businesses', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Billing Settings */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Integration</h3>
                      <p className="text-gray-600 mb-4">
                        Connect your payment processor to collect membership dues automatically
                      </p>
                      <Button>
                        Connect Stripe
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 capitalize">
                            {key.replace(/_/g, ' ')}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {key === 'new_member_notifications' && 'Get notified when new members join'}
                            {key === 'event_reminders' && 'Receive reminders about upcoming events'}
                            {key === 'payment_notifications' && 'Get notified about payment activities'}
                            {key === 'weekly_digest' && 'Receive weekly summary of chamber activity'}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleNotificationChange(key, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-yellow-800 mb-2">Two-Factor Authentication</h4>
                      <p className="text-sm text-yellow-700 mb-3">
                        Add an extra layer of security to your chamber admin account
                      </p>
                      <Button size="sm" variant="outline">
                        Enable 2FA
                      </Button>
                    </div>
                    
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-red-800 mb-2">Danger Zone</h4>
                      <p className="text-sm text-red-700 mb-3">
                        Permanently delete this chamber and all associated data
                      </p>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Chamber
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end mt-8">
              <Button
                onClick={handleSave}
                loading={saving}
                size="lg"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

