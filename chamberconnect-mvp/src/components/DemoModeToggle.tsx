'use client'

import React, { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/Button'

export default function DemoModeToggle() {
  const { enableDemoMode, disableDemoMode, isDemoMode, profile } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (isDemoMode) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-300 rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-800">
            Demo Mode: {profile?.role?.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <div className="text-xs text-green-700 mb-2">
          Logged in as: {profile?.full_name} ({profile?.email})
        </div>
        <Button
          onClick={disableDemoMode}
          variant="outline"
          className="text-xs h-7 px-2"
        >
          Exit Demo
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3"
        >
          🧪 Demo Mode
        </Button>
      ) : (
        <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg min-w-[200px]">
          <div className="text-sm font-medium mb-3">Choose Demo Role:</div>
          
          <div className="space-y-2">
            <Button
              onClick={() => {
                enableDemoMode('chamber_admin')
                setIsOpen(false)
              }}
              className="w-full text-xs h-8 bg-purple-600 hover:bg-purple-700"
            >
              👥 Chamber Admin
            </Button>
            
            <Button
              onClick={() => {
                enableDemoMode('business_owner')
                setIsOpen(false)
              }}
              className="w-full text-xs h-8 bg-blue-600 hover:bg-blue-700"
            >
              🏢 Business Owner
            </Button>
            
            <Button
              onClick={() => {
                enableDemoMode('trial_user')
                setIsOpen(false)
              }}
              className="w-full text-xs h-8 bg-orange-600 hover:bg-orange-700"
            >
              ⏰ Trial User
            </Button>
          </div>
          
          <Button
            onClick={() => setIsOpen(false)}
            variant="outline"
            className="w-full text-xs h-7 mt-3"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}

