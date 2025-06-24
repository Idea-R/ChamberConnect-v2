import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth'
import Navigation from '@/components/Navigation'
import DemoModeToggle from '@/components/DemoModeToggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChamberConnect - Connect Your Business Community',
  description: 'The modern platform for chamber of commerce management, business networking, and community engagement.',
  keywords: 'chamber of commerce, business networking, community, events, directory',
  authors: [{ name: 'ChamberConnect Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#2563eb',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main>
              {children}
            </main>
            <DemoModeToggle />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

