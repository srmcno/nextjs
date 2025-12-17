export const metadata = {
  title: 'Water Settlement Portal',
  description: 'Choctaw–Chickasaw Water Settlement live data'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui' }}>
        {children}
      </body>
    </html>
  )
}
