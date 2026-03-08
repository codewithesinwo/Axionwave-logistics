import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const monthlyData = [
  { month: 'Jan', deliveries: 410, revenue: 9200 },
  { month: 'Feb', deliveries: 450, revenue: 10100 },
  { month: 'Mar', deliveries: 480, revenue: 10850 },
  { month: 'Apr', deliveries: 525, revenue: 11900 },
  { month: 'May', deliveries: 510, revenue: 11620 },
  { month: 'Jun', deliveries: 545, revenue: 12480 },
]

const initialTracking = [
  { id: 'AXL-2501', destination: 'Abuja', eta: '12:45 PM', status: 'In Transit' },
  { id: 'AXL-2502', destination: 'Ibadan', eta: '2:10 PM', status: 'Delayed' },
  { id: 'AXL-2503', destination: 'Port Harcourt', eta: '6:20 PM', status: 'Awaiting Pickup' },
]

const initialPayments = [
  { id: 'INV-9812', customer: 'Nexus Retail', amount: 320000, status: 'Pending' },
  { id: 'INV-9813', customer: 'Delta Foods', amount: 185000, status: 'Verified' },
  { id: 'INV-9814', customer: 'Apex Medical', amount: 270000, status: 'Pending' },
]

const statusOptions = ['In Transit', 'Delayed', 'Delivered', 'Awaiting Pickup']

function AdminDashboard() {
  const [tracking, setTracking] = useState(initialTracking)
  const [payments, setPayments] = useState(initialPayments)

  const pendingPayments = useMemo(
    () => payments.filter((item) => item.status === 'Pending').length,
    [payments],
  )

  const updateTrackField = (id, field, value) => {
    setTracking((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const verifyPayment = (id) => {
    setPayments((prev) =>
      prev.map((payment) => (payment.id === id ? { ...payment, status: 'Verified' } : payment)),
    )
  }

  return (
    <section className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-5"
      >
        <h2 className="m-0 text-2xl font-semibold text-slate-900">Admin Dashboard</h2>
        <p className="mb-0 mt-2 text-sm text-slate-600">
          Edit tracking, check payments, and monitor monthly operations.
        </p>
      </motion.div>

      <div className="grid gap-3 md:grid-cols-4">
        {[
          { label: 'Editable Tracks', value: tracking.length },
          { label: 'Pending Payments', value: pendingPayments },
          { label: 'Verified Payments', value: payments.length - pendingPayments },
          { label: 'Monthly Deliveries', value: monthlyData.at(-1)?.deliveries ?? 0 },
        ].map((item, index) => (
          <motion.article
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <p className="m-0 text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mb-0 mt-2 text-3xl font-bold text-brand-700">{item.value}</p>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-4"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="m-0 text-lg font-semibold">Edit Tracking</h3>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            Live Update
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="px-2 py-2">Track ID</th>
                <th className="px-2 py-2">Destination</th>
                <th className="px-2 py-2">ETA</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {tracking.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-2 py-2 font-medium">{row.id}</td>
                  <td className="px-2 py-2">{row.destination}</td>
                  <td className="px-2 py-2">
                    <input
                      value={row.eta}
                      onChange={(e) => updateTrackField(row.id, 'eta', e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-2 py-1 outline-none focus:border-brand-500"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <select
                      value={row.status}
                      onChange={(e) => updateTrackField(row.id, 'status', e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-2 py-1 outline-none focus:border-brand-500"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-slate-200 bg-white p-4"
        >
          <h3 className="m-0 text-lg font-semibold">Check Payment</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="px-2 py-2">Invoice</th>
                  <th className="px-2 py-2">Customer</th>
                  <th className="px-2 py-2">Amount</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-t border-slate-100">
                    <td className="px-2 py-2 font-medium">{payment.id}</td>
                    <td className="px-2 py-2">{payment.customer}</td>
                    <td className="px-2 py-2">?{payment.amount.toLocaleString()}</td>
                    <td className="px-2 py-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          payment.status === 'Verified'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <button
                        onClick={() => verifyPayment(payment.id)}
                        disabled={payment.status === 'Verified'}
                        className="rounded-md bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {payment.status === 'Verified' ? 'Checked' : 'Check Payment'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-slate-200 bg-white p-4"
        >
          <h3 className="m-0 text-lg font-semibold">Monthly Chart</h3>
          <p className="mb-0 mt-1 text-sm text-slate-500">Deliveries vs revenue trend</p>
          <div className="mt-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="deliveries" fill="#0f766e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AdminDashboard
