import { useEffect, useState } from 'react';
import {
  getUsers,
  getReports,
  updateUserRole,
  resolveReport,
  deleteReport,
  getTopSavedContent
} from '../services/adminService';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [topSavedLimit, setTopSavedLimit] = useState(5);
  const [topSaved, setTopSaved] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [usersRes, reportsRes] = await Promise.all([getUsers(), getReports()]);
      setUsers(usersRes);
      setReports(reportsRes);
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadTopSaved = async () => {
      try {
        const res = await getTopSavedContent(topSavedLimit);
        setTopSaved(res);
      } catch (err) {
        console.error('Failed to fetch top saved content:', err);
      }
    };
    loadTopSaved();
  }, [topSavedLimit]);

  const onRoleSelect = (e, user) => {
    const newRole = e.target.value;
    if (window.confirm(`Change role of ${user.name} from ${user.role} to ${newRole}?`)) {
      updateUserRole(user._id, newRole).then(() => {
        setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: newRole } : u));
      }).catch(err => console.error(err));
    } else {
      e.target.value = user.role;
    }
  };

  const onStatusChange = async (e, report) => {
    const newStatus = e.target.value;
    if (newStatus === 'dismissed') {
      if (!window.confirm('Dismissing will delete this report. Proceed?')) {
        e.target.value = report.status;
        return;
      }
      deleteReport(report._id)
        .then(() => setReports(prev => prev.filter(r => r._id !== report._id)))
        .catch(err => console.error(err));
    } else {
      resolveReport(report._id, newStatus)
        .then(() => setReports(prev => prev.map(r => r._id === report._id ? { ...r, status: newStatus } : r)))
        .catch(err => console.error(err));
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        {['User Management', 'Content Reports', 'Admin Stats'].map((label, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2 -mb-px font-semibold ${
              activeTab === idx
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* User Management Tab */}
      {activeTab === 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">User</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Role</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Credits</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{user.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{user.credits}</td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      defaultValue={user.role}
                      onChange={e => onRoleSelect(e, user)}
                      className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none"
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Content Reports Tab */}
      {activeTab === 1 && (
        <div className="mt-4 space-y-4">
          {reports.map(report => (
            <div key={report._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{report.contentType} Report</h4>
                  <p className="text-gray-600 dark:text-gray-400">{report.reason}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Reported by: {report.reportedBy?.name || 'Unknown'}</p>
                </div>
                <select
                  value={report.status}
                  onChange={e => onStatusChange(e, report)}
                  className="border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Stats Tab */}
      {activeTab === 2 && (
        <div className="mt-6 space-y-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Top Saved Content</h2>
            <div className="flex items-center mb-4">
              <label className="mr-2 text-gray-700 dark:text-gray-300">Limit:</label>
              <input
                type="number"
                value={topSavedLimit}
                onChange={e => setTopSavedLimit(parseInt(e.target.value))}
                className="w-20 border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                min="1"
              />
            </div>
            <ul className="space-y-4">
              {topSaved.map((item, idx) => (
                <li key={idx} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.contentType}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{item.metadata?.title || 'Untitled'}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                      Saved {item.count} times
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
