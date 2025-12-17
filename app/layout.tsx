import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Water Settlement Portal',
  description: 'Choctaw–Chickasaw Water Settlement portal with live USGS data'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#EFE9D8] text-[#1F2933]`}>
        {children}
      </body>
    </html>
  )
}
