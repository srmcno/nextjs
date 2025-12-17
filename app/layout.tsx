import './globals.css'
import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: {
    default: 'Choctaw-Chickasaw Water Settlement Portal',
    template: '%s | Water Settlement Portal'
  },
  description: 'Real-time water level monitoring for the Choctaw and Chickasaw Nations Water Settlement Agreement. Track reservoir levels and river flows across southeastern Oklahoma.',
  keywords: ['Choctaw Nation', 'Chickasaw Nation', 'Water Settlement', 'Oklahoma', 'Sardis Lake', 'USGS', 'Water Levels', 'Kiamichi River'],
  authors: [{ name: 'Choctaw Nation' }],
  openGraph: {
    title: 'Choctaw-Chickasaw Water Settlement Portal',
    description: 'Real-time water level monitoring for the Choctaw and Chickasaw Nations Water Settlement Agreement.',
    type: 'website',
    locale: 'en_US'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased font-sans">
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
