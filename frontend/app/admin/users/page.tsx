'use client';

import { useEffect, useState } from 'react';
import { AdminGuard } from '../../../components/admin/AdminGuard';
import { apiGet, apiPatch } from '../../../lib/api';

const roles = ['ADMIN', 'STAFF', 'CUSTOMER'];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  const load = async () => {
    const data = await apiGet<any[]>('/users');
    setUsers(data || []);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <AdminGuard>
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#6f6256]">Users</p>
            <h1 className="display mt-2 text-3xl">Users Management</h1>
            <p className="mt-2 text-sm text-[#6f6256]">Assign roles and block accounts.</p>
          </div>
          <button
            className="rounded-full border border-gold-400 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gold-200"
            onClick={load}
          >
            Refresh
          </button>
        </div>

        <div className="mt-6 glass rounded-2xl p-6 shadow-sm">
          <div className="overflow-x-auto rounded-xl border border-black/10">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-[2fr,1fr,1fr] bg-white/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#6f6256]">
                <span>User</span>
                <span>Role</span>
                <span className="text-right">Status</span>
              </div>
              <div className="divide-y divide-black/10 text-sm">
                {users.map((user) => (
                  <div key={user._id} className="grid grid-cols-[2fr,1fr,1fr] items-center px-4 py-3">
                    <div>
                      <p className="text-gold-200">{user.name || 'Customer'}</p>
                      <p className="text-xs text-[#6f6256]">{user.email}</p>
                    </div>
                    <select
                      className="rounded-md bg-white/70 p-2 text-xs"
                      value={user.role}
                      onChange={async (e) => {
                        await apiPatch(`/users/${user._id}/role`, { role: e.target.value });
                        await load();
                      }}
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className={`rounded-full border px-3 py-1 text-xs ${
                          user.isBlocked
                            ? 'border-gold-400 text-gold-200'
                            : 'border-black/10 text-[#6f6256]'
                        }`}
                        onClick={async () => {
                          const action = user.isBlocked ? 'unblock' : 'block';
                          await apiPatch(`/users/${user._id}/${action}`, {});
                          await load();
                        }}
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </div>
                  </div>
                ))}
                {users.length === 0 && <p className="px-4 py-4 text-xs text-[#6f6256]">No users found.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
