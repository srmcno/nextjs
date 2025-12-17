import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ maxWidth: 980 }}>
      <h1 style={{ fontSize: 36, margin: 0 }}>
        Choctaw–Chickasaw Water Settlement Portal
      </h1>

      <p style={{ marginTop: 12, fontSize: 18, maxWidth: 820 }}>
        Live water-level information and public-facing resources supporting the
        Choctaw–Chickasaw–Oklahoma City Water Settlement Agreement. Data comes
        directly from USGS monitoring stations.
      </p>

      <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
        <Link href="/dashboard">
          <button
            style={{
              padding: '12px 18px',
              background: '#7A0019',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            View Live Water Levels
          </button>
        </Link>

        <Link href="/settlement">
          <button
            style={{
              padding: '12px 18px',
              background: 'white',
              color: '#1F2933',
              border: '1px solid #1F2933',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            About the Settlement
          </button>
        </Link>
      </div>

      <div
        style={{
          marginTop: 28,
          background: 'white',
          padding: 18,
          borderRadius: 12,
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}
      >
        <h2 style={{ marginTop: 0 }}>Quick View: Lake Texoma (USGS)</h2>
        <iframe
          src="https://waterdata.usgs.gov/monitoring-location/07331500/"
          width="100%"
          height="520"
          style={{ border: '1px solid #ddd', borderRadius: 10 }}
        />
        <p style={{ fontSize: 13, marginTop: 10 }}>
          Source: USGS monitoring location page.
        </p>
      </div>
    </div>
  )
}
