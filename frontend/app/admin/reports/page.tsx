'use client';

import { useState } from 'react';
import { AdminGuard } from '../../../components/admin/AdminGuard';
import { apiGet } from '../../../lib/api';

export default function AdminReportsPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [report, setReport] = useState<any | null>(null);

  const loadReport = async () => {
    const query = new URLSearchParams();
    if (from) query.set('from', from);
    if (to) query.set('to', to);
    const data = await apiGet<any[]>(`/reports/sales?${query.toString()}`);
    setReport(data?.[0] || { totalSales: 0, orderCount: 0, avgOrder: 0 });
  };

  const downloadCsv = async () => {
    const query = new URLSearchParams();
    if (from) query.set('from', from);
    if (to) query.set('to', to);
    const data = await apiGet<{ csv: string }>(`/reports/sales/csv?${query.toString()}`);
    const blob = new Blob([data.csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminGuard>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#6f6256]">Analytics</p>
            <h1 className="display mt-2 text-3xl">Reports</h1>
            <p className="mt-2 text-sm text-[#6f6256]">Sales by date range with CSV export.</p>
          </div>
          <button
            className="rounded-full border border-gold-400 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gold-200"
            onClick={downloadCsv}
          >
            Export CSV
          </button>
        </div>
        <div className="mt-6 glass rounded-2xl p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr,1fr,auto]">
            <input
              type="date"
              className="rounded-md bg-white/70 p-3 text-sm"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <input
              type="date"
              className="rounded-md bg-white/70 p-3 text-sm"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            <button
              className="rounded-full border border-gold-400 px-4 py-2 text-sm text-gold-200"
              onClick={loadReport}
            >
              Run Report
            </button>
          </div>

          {report && (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Total Sales</p>
                <p className="display mt-2 text-2xl text-gold-200">${Number(report.totalSales).toFixed(2)}</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Orders</p>
                <p className="display mt-2 text-2xl text-gold-200">{Number(report.orderCount)}</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Avg Order</p>
                <p className="display mt-2 text-2xl text-gold-200">${Number(report.avgOrder).toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
