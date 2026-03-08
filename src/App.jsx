import { useMemo, useState } from 'react'
import UserDashboard from './components/UserDashboard'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [dashboard, setDashboard] = useState('admin')

  const ActiveDashboard = useMemo(
    () => (dashboard === 'admin' ? AdminDashboard : UserDashboard),
    [dashboard],
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 via-emerald-50 to-slate-100 p-4 md:p-8">
      <div className="mx-auto w-full max-w-7xl space-y-4">
        <header className="flex flex-col gap-3 rounded-2xl bg-brand-900 px-5 py-4 text-white shadow-lg md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">AxionWave Logistics</p>
            <h1 className="m-0 text-xl font-semibold">Operations Console</h1>
          </div>
          <div className="inline-flex rounded-full bg-white/15 p-1">
            <button
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                dashboard === 'user' ? 'bg-amber-200 text-amber-900' : 'text-emerald-100 hover:bg-white/10'
              }`}
              onClick={() => setDashboard('user')}
            >
              User
            </button>
            <button
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                dashboard === 'admin' ? 'bg-amber-200 text-amber-900' : 'text-emerald-100 hover:bg-white/10'
              }`}
              onClick={() => setDashboard('admin')}
            >
              Admin
            </button>
          </div>
        </header>

        <ActiveDashboard />
      </div>
    </main>
  )
}

export default App
