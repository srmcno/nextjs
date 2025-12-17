import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Header />

      <main style={{ padding: 24 }}>
        <h1 style={{ fontSize: 32 }}>
          Water. Sovereignty. Transparency.
        </h1>

        <p style={{ maxWidth: 720, marginTop: 12 }}>
          Live water level data and public information supporting the
          Choctaw–Chickasaw–Oklahoma City Water Settlement Agreement.
        </p>

        <Link href="/dashboard">
          <button
            style={{
              marginTop: 24,
              padding: '12px 20px',
              background: '#7A0019',
              color: 'white',
              border: 'none',
              borderRadius: 6
            }}
          >
            View Live Water Levels
          </button>
        </Link>
      </main>

      <Footer />
    </>
  )
}
