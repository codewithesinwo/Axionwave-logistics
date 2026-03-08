import { motion } from 'framer-motion'

const stats = [
  { label: 'Active Shipments', value: '24', change: '+4 today' },
  { label: 'Pending Deliveries', value: '08', change: '-2 vs yesterday' },
  { label: 'On-Time Rate', value: '97.4%', change: '+1.1%' },
]

const timeline = [
  { id: 'AXL-1008', route: 'Lagos -> Abuja', eta: '12:45 PM', status: 'In transit' },
  { id: 'AXL-0954', route: 'Lagos -> Ibadan', eta: '2:10 PM', status: 'Ready for pickup' },
  { id: 'AXL-1086', route: 'Lagos -> Port Harcourt', eta: '6:20 PM', status: 'Delayed: weather' },
]

function UserDashboard() {
  return (
    <section className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-5"
      >
        <h2 className="m-0 text-2xl font-semibold text-slate-900">User Dashboard</h2>
        <p className="mb-0 mt-2 text-sm text-slate-600">Track shipments and delivery windows in real time.</p>
      </motion.div>

      <div className="grid gap-3 md:grid-cols-3">
        {stats.map((item, index) => (
          <motion.article
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <p className="m-0 text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mb-0 mt-2 text-3xl font-bold text-brand-700">{item.value}</p>
            <p className="mb-0 mt-1 text-sm text-slate-500">{item.change}</p>
          </motion.article>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="m-0 text-lg font-semibold">Shipment Timeline</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="px-2 py-2">Shipment ID</th>
                <th className="px-2 py-2">Route</th>
                <th className="px-2 py-2">ETA</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {timeline.map((shipment) => (
                <tr key={shipment.id} className="border-t border-slate-100">
                  <td className="px-2 py-2 font-medium">{shipment.id}</td>
                  <td className="px-2 py-2">{shipment.route}</td>
                  <td className="px-2 py-2">{shipment.eta}</td>
                  <td className="px-2 py-2">{shipment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  )
}

export default UserDashboard
