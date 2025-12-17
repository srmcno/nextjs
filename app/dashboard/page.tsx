import LakeCard from '../../components/LakeCard'

export default function DashboardPage() {
  return (
    <div style={{ maxWidth: 1200 }}>
      <h1 style={{ fontSize: 32, marginTop: 0 }}>Live Water Levels</h1>

      <p style={{ fontSize: 16, maxWidth: 860 }}>
        Click into each card to see the latest measured water level trend from USGS.
        We can expand this list to all settlement-relevant water bodies once you confirm them.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 16,
          marginTop: 18
        }}
      >
        <LakeCard name="Lake Texoma" site="07331500" />
        <LakeCard name="Arbuckle Reservoir" site="07326500" />
        <LakeCard name="Sardis Lake" site="07343500" />
        <LakeCard name="Atoka Reservoir" site="07345500" />
      </div>
    </div>
  )
}
