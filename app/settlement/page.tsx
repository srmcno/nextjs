export default function SettlementPage() {
  return (
    <div style={{ maxWidth: 980 }}>
      <h1 style={{ fontSize: 32, marginTop: 0 }}>
        Water Settlement Agreement
      </h1>

      <p style={{ fontSize: 18, maxWidth: 860 }}>
        This portal provides transparent access to real-time water conditions
        tied to the Choctaw–Chickasaw–Oklahoma City Water Settlement Agreement.
      </p>

      <div
        style={{
          marginTop: 18,
          background: 'white',
          padding: 18,
          borderRadius: 12,
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}
      >
        <h2 style={{ marginTop: 0 }}>What this site covers</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>Live water levels from USGS gauges (authoritative source)</li>
          <li>Reservoir/lake “at-a-glance” status cards</li>
          <li>Public-facing settlement context and resources</li>
        </ul>

        <p style={{ marginTop: 12 }}>
          Next step: we’ll add official settlement water bodies and documents
          (PDFs, timelines, maps) once you confirm the exact list you want.
        </p>
      </div>
    </div>
  )
}
