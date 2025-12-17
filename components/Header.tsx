import Link from 'next/link'

export default function Header() {
  return (
    <header
      style={{
        background: '#7A0019',
        color: 'white',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      <strong>Water Settlement Portal</strong>
      <nav style={{ display: 'flex', gap: 16 }}>
        <Link href="/">Home</Link>
        <Link href="/settlement">Settlement</Link>
        <Link href="/dashboard">Live Data</Link>
      </nav>
    </header>
  )
}
