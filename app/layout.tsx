import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Water Settlement Portal',
  description: 'Choctaw–Chickasaw Water Settlement live data portal'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui', background: '#EFE9D8' }}>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 120px)', padding: 24 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
