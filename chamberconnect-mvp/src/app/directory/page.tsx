'use client'

import { useState } from 'react'
import { Search, MapPin, Phone, Mail, Globe, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

// Mock business data
const businesses = [
  {
    id: 1,
    name: "Smith & Associates Law Firm",
    category: "Legal Services",
    description: "Full-service law firm specializing in business law, real estate, and family law.",
    address: "123 Main Street, Downtown",
    phone: "(555) 123-4567",
    email: "info@smithlaw.com",
    website: "www.smithlaw.com",
    logo: "🏛️"
  },
  {
    id: 2,
    name: "Green Valley Restaurant",
    category: "Food & Dining",
    description: "Farm-to-table dining experience with locally sourced ingredients and seasonal menus.",
    address: "456 Oak Avenue, Midtown",
    phone: "(555) 234-5678",
    email: "hello@greenvalley.com",
    website: "www.greenvalleyrestaurant.com",
    logo: "🍽️"
  },
  {
    id: 3,
    name: "TechStart Solutions",
    category: "Technology",
    description: "IT consulting and software development for small to medium businesses.",
    address: "789 Innovation Drive, Tech Park",
    phone: "(555) 345-6789",
    email: "contact@techstart.com",
    website: "www.techstartsolutions.com",
    logo: "💻"
  },
  {
    id: 4,
    name: "Bloom Flower Shop",
    category: "Retail",
    description: "Fresh flowers, arrangements, and plants for all occasions. Wedding specialists.",
    address: "321 Garden Street, Old Town",
    phone: "(555) 456-7890",
    email: "orders@bloomflowers.com",
    website: "www.bloomflowershop.com",
    logo: "🌸"
  },
  {
    id: 5,
    name: "Fitness First Gym",
    category: "Health & Fitness",
    description: "State-of-the-art fitness facility with personal training and group classes.",
    address: "654 Wellness Boulevard, Sports Complex",
    phone: "(555) 567-8901",
    email: "info@fitnessfirst.com",
    website: "www.fitnessfirstgym.com",
    logo: "💪"
  }
]

const categories = [
  "All Categories",
  "Legal Services",
  "Food & Dining",
  "Technology",
  "Retail",
  "Health & Fitness",
  "Professional Services",
  "Healthcare",
  "Education",
  "Real Estate"
]

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [showFilters, setShowFilters] = useState(false)

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' || business.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Business Directory
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover local businesses in our chamber community
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Category Filter */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredBusinesses.length} of {businesses.length} businesses
          </p>
        </div>

        {/* Business Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} hover className="h-full">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{business.logo}</div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{business.name}</CardTitle>
                    <p className="text-sm text-blue-600 font-medium">{business.category}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">{business.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{business.address}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                    <a href={`tel:${business.phone}`} className="hover:text-blue-600">
                      {business.phone}
                    </a>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                    <a href={`mailto:${business.email}`} className="hover:text-blue-600 truncate">
                      {business.email}
                    </a>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                    <a 
                      href={`https://${business.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 truncate"
                    >
                      {business.website}
                    </a>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button size="sm" className="w-full">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or category filter
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('All Categories')
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

