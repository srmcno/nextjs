export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 30, fontWeight: 700 }}>
        Choctaw–Chickasaw Water Settlement Portal
      </h1>

      <p style={{ marginTop: 12, maxWidth: 800 }}>
        This site provides live, transparent water-level information for lakes
        and reservoirs governed by the Choctaw–Chickasaw–Oklahoma City Water
        Settlement Agreement. All measurements are sourced directly from the
        United States Geological Survey (USGS).
      </p>

      <h2 style={{ marginTop: 28, fontSize: 22 }}>
        Lake Texoma — Live USGS Water Level
      </h2>

      <iframe
        src="https://waterdata.usgs.gov/monitoring-location/07331500/"
        width="100%"
        height="600"
        style={{
          border: '1px solid #ccc',
          marginTop: 12,
          borderRadius: 8
        }}
      />

      <p style={{ marginTop: 12, fontSize: 14 }}>
        Data source: USGS (official federal monitoring)
      </p>
    </main>
  )
}

