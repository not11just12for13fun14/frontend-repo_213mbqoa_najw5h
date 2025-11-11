import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Hero() {
  return (
    <section className="relative h-[420px] w-full overflow-hidden bg-white">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/mWY-FNsBVpRvZHS5/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/20 to-white pointer-events-none" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">DNA Health Tracker</h1>
        <p className="mt-2 max-w-md text-sm sm:text-base text-gray-600">
          Track daily wellness, log habits, and connect genetic markers to personalized insights.
        </p>
      </div>
    </section>
  )
}

function TabBar({ active, onChange }) {
  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'log', label: 'Health Log' },
    { id: 'markers', label: 'Markers' },
    { id: 'data', label: 'Your Data' },
  ]
  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
      <div className="flex items-center justify-between px-4">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${active === t.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function ProfileForm({ onCreated }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, age: age ? Number(age) : null, gender: gender || null }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.detail || `Error ${res.status}`)
      }
      setMsg('Profile saved')
      setName(''); setEmail(''); setAge(''); setGender('')
      onCreated && onCreated()
    } catch (err) {
      setMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="input" placeholder="Age" type="number" min={0} max={120} value={age} onChange={e=>setAge(e.target.value)} />
        <select className="input" value={gender} onChange={e=>setGender(e.target.value)}>
          <option value="">Gender</option>
          <option>male</option>
          <option>female</option>
          <option>non-binary</option>
          <option>other</option>
        </select>
      </div>
      <button disabled={loading} className="btn-primary w-full">{loading ? 'Saving…' : 'Save profile'}</button>
      {msg && <p className="text-sm text-center text-gray-600">{msg}</p>}
    </form>
  )
}

function HealthLogForm({ defaultEmail, onLogged }) {
  const [userEmail, setUserEmail] = useState(defaultEmail || '')
  const [mood, setMood] = useState('')
  const [sleep, setSleep] = useState('')
  const [hydration, setHydration] = useState('')
  const [activity, setActivity] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: userEmail,
          mood: mood || null,
          sleep_hours: sleep ? Number(sleep) : null,
          hydration_ml: hydration ? Number(hydration) : null,
          activity_minutes: activity ? Number(activity) : null,
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.detail || `Error ${res.status}`)
      }
      setMsg('Log added')
      onLogged && onLogged()
      setMood(''); setSleep(''); setHydration(''); setActivity('')
    } catch (err) {
      setMsg(err.message)
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input className="input" placeholder="User email" value={userEmail} onChange={e=>setUserEmail(e.target.value)} required />
      <div className="grid grid-cols-2 gap-3">
        <select className="input" value={mood} onChange={e=>setMood(e.target.value)}>
          <option value="">Mood</option>
          <option>low</option><option>okay</option><option>good</option><option>great</option>
        </select>
        <input className="input" placeholder="Sleep (hrs)" type="number" min={0} max={24} step="0.1" value={sleep} onChange={e=>setSleep(e.target.value)} />
        <input className="input" placeholder="Hydration (ml)" type="number" min={0} max={10000} value={hydration} onChange={e=>setHydration(e.target.value)} />
        <input className="input" placeholder="Activity (min)" type="number" min={0} max={1440} value={activity} onChange={e=>setActivity(e.target.value)} />
      </div>
      <button disabled={loading} className="btn-primary w-full">{loading ? 'Logging…' : 'Add log'}</button>
      {msg && <p className="text-sm text-center text-gray-600">{msg}</p>}
    </form>
  )
}

function MarkerForm({ onAdded }) {
  const [userEmail, setUserEmail] = useState('')
  const [gene, setGene] = useState('')
  const [snp, setSnp] = useState('')
  const [risk, setRisk] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/markers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: userEmail, gene, snp, risk_level: risk, note: note || null }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.detail || `Error ${res.status}`)
      }
      setMsg('Marker added')
      onAdded && onAdded()
      setGene(''); setSnp(''); setRisk(''); setNote('')
    } catch (err) {
      setMsg(err.message)
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input className="input" placeholder="User email" value={userEmail} onChange={e=>setUserEmail(e.target.value)} required />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input className="input" placeholder="Gene (e.g., MTHFR)" value={gene} onChange={e=>setGene(e.target.value)} required />
        <input className="input" placeholder="SNP (e.g., rs1801133)" value={snp} onChange={e=>setSnp(e.target.value)} required />
        <select className="input" value={risk} onChange={e=>setRisk(e.target.value)} required>
          <option value="">Risk level</option>
          <option value="low">low</option>
          <option value="moderate">moderate</option>
          <option value="high">high</option>
        </select>
        <input className="input" placeholder="Note (optional)" value={note} onChange={e=>setNote(e.target.value)} />
      </div>
      <button disabled={loading} className="btn-primary w-full">{loading ? 'Adding…' : 'Add marker'}</button>
      {msg && <p className="text-sm text-center text-gray-600">{msg}</p>}
    </form>
  )
}

function DataViews() {
  const [emailFilter, setEmailFilter] = useState('')
  const [users, setUsers] = useState([])
  const [logs, setLogs] = useState([])
  const [markers, setMarkers] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [u, l, m] = await Promise.all([
        fetch(`${API_BASE}/users`).then(r=>r.json()),
        fetch(`${API_BASE}/logs${emailFilter ? `?user_email=${encodeURIComponent(emailFilter)}`: ''}`).then(r=>r.json()),
        fetch(`${API_BASE}/markers${emailFilter ? `?user_email=${encodeURIComponent(emailFilter)}`: ''}`).then(r=>r.json()),
      ])
      setUsers(u || [])
      setLogs(l || [])
      setMarkers(m || [])
    } catch (e) {
      // ignore simple display errors
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <input className="input flex-1" placeholder="Filter by user email (optional)" value={emailFilter} onChange={e=>setEmailFilter(e.target.value)} />
        <button className="btn" onClick={fetchAll}>Refresh</button>
      </div>
      {loading && <p className="text-sm text-gray-500">Loading…</p>}

      <div>
        <h3 className="section-title">Users</h3>
        <List items={users} empty="No users yet."/>
      </div>
      <div>
        <h3 className="section-title">Health Logs</h3>
        <List items={logs} empty="No logs yet."/>
      </div>
      <div>
        <h3 className="section-title">Genetic Markers</h3>
        <List items={markers} empty="No markers yet."/>
      </div>
    </div>
  )
}

function List({ items, empty }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-gray-500">{empty}</p>
  }
  return (
    <ul className="space-y-2">
      {items.map((it, idx) => (
        <li key={it._id || idx} className="rounded-lg border p-3 text-sm bg-white/60">
          <pre className="whitespace-pre-wrap break-words text-gray-800">{JSON.stringify(it, null, 2)}</pre>
        </li>
      ))}
    </ul>
  )
}

function App() {
  const [active, setActive] = useState('profile')

  // small utility styles injected once
  const styles = useMemo(() => (
    <style>
      {`
      .input { @apply w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500; }
      .btn { @apply rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50; }
      .btn-primary { @apply rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700; }
      .section-title { @apply text-base font-semibold text-gray-800 mb-2; }
      `}
    </style>
  ), [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {styles}
      <Hero />
      <TabBar active={active} onChange={setActive} />

      <main className="px-4 py-6 max-w-xl mx-auto space-y-8">
        {active === 'profile' && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Create your profile</h2>
            <ProfileForm onCreated={() => setActive('log')} />
          </div>
        )}

        {active === 'log' && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Daily health log</h2>
            <HealthLogForm onLogged={() => setActive('data')} />
          </div>
        )}

        {active === 'markers' && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Add genetic marker</h2>
            <MarkerForm onAdded={() => setActive('data')} />
          </div>
        )}

        {active === 'data' && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Overview</h2>
            <DataViews />
          </div>
        )}

        <div className="text-center text-xs text-gray-500">
          Connected to: {API_BASE}
        </div>
      </main>
    </div>
  )
}

export default App
