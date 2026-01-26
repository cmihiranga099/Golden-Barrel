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
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="display text-3xl">Users Management</h1>
        <p className="mt-4 text-sm text-[#8c8378]">Assign roles and block accounts.</p>
        <div className="mt-6 glass rounded-2xl p-6">
          <div className="space-y-4 text-sm">
            {users.map((user) => (
              <div key={user._id} className="grid gap-3 border-b border-white/5 pb-4 md:grid-cols-[2fr,1fr,1fr]">
                <div>
                  <p className="text-gold-200">{user.name || 'Customer'}</p>
                  <p className="text-xs text-[#8c8378]">{user.email}</p>
                </div>
                <select
                  className="rounded-md bg-black/40 p-2 text-xs"
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
                <button
                  className="rounded-full border border-white/10 px-3 py-2 text-xs text-[#8c8378]"
                  onClick={async () => {
                    const action = user.isBlocked ? 'unblock' : 'block';
                    await apiPatch(`/users/${user._id}/${action}`, {});
                    await load();
                  }}
                >
                  {user.isBlocked ? 'Unblock' : 'Block'}
                </button>
              </div>
            ))}
            {users.length === 0 && <p className="text-[#8c8378]">No users found.</p>}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
