import React, { useState, useEffect } from 'react'
import { ShieldCheck, UserPlus, Users, UserX, Search, Filter, Loader2, Mail, Shield, ShieldAlert, CheckCircle, XCircle } from 'lucide-react'
import UserTable from '../../components/admin/UserTable'
import adminService from '../../services/adminService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import StatusBadge from '../../components/common/StatusBadge'
import { showSuccess, showError } from '../../utils/toast'

function UserManagementPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 })
  
  // Search & Filter state
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [providerFilter, setProviderFilter] = useState('all')
  const [page, setPage] = useState(1)

  // Modals state
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalType, setModalType] = useState(null) // 'view' | 'suspend' | 'unsuspend' | 'ban' | 'unban' | 'delete'
  const [reason, setReason] = useState('')
  const [actionPending, setActionPending] = useState(false)
  const [userDetails, setUserDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await adminService.getUsers({
        page,
        limit: 20,
        search,
        role: roleFilter === 'all' ? undefined : roleFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
        provider: providerFilter === 'all' ? undefined : providerFilter
      })
      
      // Map data properties to match UserTable's expected properties, filtering out admins for defense-in-depth
      const mapped = (result.users || [])
        .filter((u) => u.role !== 'admin')
        .map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        provider: u.provider || 'email',
        joinedAt: u.createdAt,
        eventsJoined: u.registeredEvents?.length || 0,
      }))
      setUsers(mapped)
      setPagination(result.pagination)
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error('Failed to load user directory:', err)
      }
      setError(err.response?.data?.message || 'Failed to load user directory. Please reload.')
    } finally {
      setLoading(false)
    }
  }

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers()
    }, 300)
    return () => clearTimeout(handler)
  }, [page, search, roleFilter, statusFilter, providerFilter])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [search, roleFilter, statusFilter, providerFilter])

  // Fetch details when viewing user
  useEffect(() => {
    if (modalType === 'view' && selectedUser) {
      const fetchDetails = async () => {
        setLoadingDetails(true)
        setDetailsError('')
        setUserDetails(null)
        try {
          const details = await adminService.getUser(selectedUser.id)
          setUserDetails(details)
        } catch (err) {
          console.error('Failed to load user details:', err)
          setDetailsError(err.response?.data?.message || 'Failed to load user details.')
        } finally {
          setLoadingDetails(false)
        }
      }
      fetchDetails()
    }
  }, [modalType, selectedUser])

  const handleConfirmAction = async () => {
    if (!selectedUser || !modalType) return
    setActionPending(true)
    try {
      if (modalType === 'suspend') {
        await adminService.suspendUser(selectedUser.id, reason)
        showSuccess(`Account for ${selectedUser.name || 'user'} has been suspended.`)
      } else if (modalType === 'unsuspend') {
        await adminService.unsuspendUser(selectedUser.id, reason)
        showSuccess(`Account for ${selectedUser.name || 'user'} has been activated.`)
      } else if (modalType === 'ban') {
        await adminService.banUser(selectedUser.id, reason)
        showSuccess(`Account for ${selectedUser.name || 'user'} has been banned.`)
      } else if (modalType === 'unban') {
        await adminService.unbanUser(selectedUser.id, reason)
        showSuccess(`Account for ${selectedUser.name || 'user'} has been activated.`)
      } else if (modalType === 'delete') {
        await adminService.deleteUser(selectedUser.id, reason)
        showSuccess(`Account for ${selectedUser.name || 'user'} has been deleted.`)
      }
      
      setModalType(null)
      setSelectedUser(null)
      setReason('')
      fetchUsers()
    } catch (err) {
      showError(err.response?.data?.message || `Failed to perform action.`)
    } finally {
      setActionPending(false)
    }
  }

  // Action button clicks inside the table
  const openActionModal = (user, type) => {
    setSelectedUser(user)
    setModalType(type)
    setReason('')
  }

  const activeUsersCount = users.filter((u) => u.status === 'active').length
  const suspendedUsersCount = users.filter((u) => u.status === 'suspended').length

  const userStats = [
    { label: 'Active users', value: activeUsersCount, icon: Users, detail: 'Participants and judges' },
    { label: 'Total profiles', value: pagination.total, icon: UserPlus, detail: 'Registered system accounts' },
    { label: 'Suspended', value: suspendedUsersCount, icon: UserX, detail: 'Restricted profiles' },
  ]

  return (
    <main className="bg-slate-50 text-slate-900 min-h-screen">
      <section className="relative overflow-hidden bg-mesh pt-10 pb-12">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
                <ShieldCheck className="h-4 w-4" />
                Admin control
              </div>
              <h1 className="mt-6 font-outfit text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl">
                User management
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                Review participant and judge accounts, monitor registration activity, and keep risky profiles under control.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {userStats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <strong className="mt-4 block font-outfit text-3xl font-bold text-slate-950">{stat.value}</strong>
                    <span className="text-sm font-semibold text-slate-600">{stat.label}</span>
                    <p className="mt-1 text-xs text-slate-500">{stat.detail}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 space-y-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-colors"
              />
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-3 gap-2 w-full md:w-auto min-w-[360px]">
              <div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 outline-none focus:bg-white focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="participant">Participant</option>
                  <option value="organiser">Organiser</option>
                </select>
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 outline-none focus:bg-white focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="banned">Banned</option>
                </select>
              </div>

              <div>
                <select
                  value={providerFilter}
                  onChange={(e) => setProviderFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 outline-none focus:bg-white focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="all">All Providers</option>
                  <option value="email">Email</option>
                  <option value="google">Google</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* User directory */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 animate-pulse border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-36 bg-slate-200 rounded" />
                    <div className="h-3 w-48 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-8 w-24 bg-slate-200 rounded-lg" />
                  <div className="h-8 w-24 bg-slate-200 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <UserTable
              users={users}
              onView={(u) => openActionModal(u, 'view')}
              onSuspend={(u) => openActionModal(u, 'suspend')}
              onActivate={(u) => openActionModal(u, 'unsuspend')}
              onBan={(u) => openActionModal(u, 'ban')}
              onUnban={(u) => openActionModal(u, 'unban')}
              onDelete={(u) => openActionModal(u, 'delete')}
            />

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <span className="text-xs font-semibold text-slate-500">
                  Showing page {pagination.page} of {pagination.pages} ({pagination.total} total users)
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= pagination.pages}
                    onClick={() => setPage(page + 1)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* ─── MODAL CONTROLS ─── */}
      {modalType && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          {/* Details Modal */}
          {modalType === 'view' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-outfit text-xl font-bold text-slate-950">User Profile Details</h3>
                <button
                  onClick={() => setModalType(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
                >
                  ✕ Close
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                {loadingDetails ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3">
                    <LoadingSpinner />
                    <span className="text-xs font-semibold text-slate-500">Loading user profile...</span>
                  </div>
                ) : detailsError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    {detailsError}
                  </div>
                ) : userDetails ? (
                  <div className="space-y-6">
                    {/* Header info */}
                    <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-2xl font-extrabold text-white shadow-md">
                        {(userDetails.name || userDetails.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xl font-bold text-slate-950 leading-tight">{userDetails.name || 'Unnamed User'}</h4>
                        <p className="text-sm font-medium text-slate-500 leading-normal">{userDetails.email}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">User ID: {userDetails._id}</p>
                      </div>
                    </div>

                    {/* Metadata grids */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Identity & Auth Status */}
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                        <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Authentication</h5>
                        <div className="space-y-2 text-xs font-medium text-slate-700">
                          <div className="flex justify-between">
                            <span>Provider:</span>
                            <span className="font-bold text-slate-900 capitalize">{userDetails.provider}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Email Verified:</span>
                            <span className={`font-bold flex items-center gap-1 ${userDetails.emailVerified ? 'text-emerald-600' : 'text-slate-500'}`}>
                              {userDetails.emailVerified ? <CheckCircle className="h-3 w-3 inline" /> : <XCircle className="h-3 w-3 inline" />}
                              {userDetails.emailVerified ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Google Link:</span>
                            <span className="font-bold text-slate-900">{userDetails.supabaseUserId ? 'Linked' : 'Not Linked'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Password set:</span>
                            <span className="font-bold text-slate-900">{userDetails.passwordHash ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Account Meta */}
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                        <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account status</h5>
                        <div className="space-y-2 text-xs font-medium text-slate-700">
                          <div className="flex justify-between items-center">
                            <span>Status:</span>
                            <StatusBadge status={userDetails.status} />
                          </div>
                          <div className="flex justify-between">
                            <span>Role:</span>
                            <span className="font-bold text-slate-900 capitalize">{userDetails.role}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Joined:</span>
                            <span className="font-bold text-slate-900">
                              {new Date(userDetails.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex justify-between truncate">
                            <span>Last Login:</span>
                            <span className="font-bold text-slate-900">
                              {userDetails.lastLogin ? new Date(userDetails.lastLogin).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'Never'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">User Activity Summary</h5>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white rounded-lg p-2.5 border border-slate-150 shadow-sm">
                          <span className="block text-lg font-bold text-slate-950">{userDetails.eventsCreated || 0}</span>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Events Created</span>
                        </div>
                        <div className="bg-white rounded-lg p-2.5 border border-slate-150 shadow-sm">
                          <span className="block text-lg font-bold text-slate-950">{userDetails.eventsRegistered || 0}</span>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Events Joined</span>
                        </div>
                        <div className="bg-white rounded-lg p-2.5 border border-slate-150 shadow-sm">
                          <span className="block text-lg font-bold text-slate-950">{userDetails.blogsWritten || 0}</span>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Blogs Written</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio / Organization */}
                    {(userDetails.bio || userDetails.organization) && (
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2 text-xs font-medium text-slate-700">
                        {userDetails.organization && (
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Organization</span>
                            <span className="text-slate-900 font-semibold">{userDetails.organization}</span>
                          </div>
                        )}
                        {userDetails.bio && (
                          <div className="pt-2 border-t border-slate-200/60">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Biography</span>
                            <p className="text-slate-600 leading-normal italic">"{userDetails.bio}"</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-350 text-xs font-bold text-slate-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Action Confirmation Modal */}
          {modalType !== 'view' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <h3 className="font-outfit text-lg font-bold text-slate-950 flex items-center gap-2">
                  <ShieldAlert className={`h-5 w-5 ${modalType === 'delete' || modalType === 'ban' ? 'text-red-600' : 'text-amber-500'}`} />
                  Confirm Administrative Action
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm font-semibold text-slate-700 leading-normal">
                  {modalType === 'suspend' && `You are about to suspend ${selectedUser.name || 'this user'}. They will lose access to the system immediately.`}
                  {modalType === 'unsuspend' && `You are about to restore status for ${selectedUser.name || 'this user'}. Their account status will transition back to Active.`}
                  {modalType === 'ban' && `This action permanently bans ${selectedUser.name || 'this user'}. They will be barred from login and cannot re-register.`}
                  {modalType === 'unban' && `You are about to unban ${selectedUser.name || 'this user'}. Their account status will return to Active.`}
                  {modalType === 'delete' && `You are about to perform a soft delete on ${selectedUser.name || 'this user'}. This archives their profile but preserves registered events and audits.`}
                </p>

                {/* Reason Input */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Reason for action (required for audit logs)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide a detailed administrative reason..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs font-medium outline-none focus:bg-white focus:border-blue-500 transition-colors resize-none"
                    required
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button
                  disabled={actionPending}
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-350 text-xs font-bold text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  disabled={actionPending || !reason.trim()}
                  onClick={handleConfirmAction}
                  className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 ${
                    modalType === 'delete' || modalType === 'ban'
                      ? 'bg-red-600 hover:bg-red-750 disabled:bg-red-300'
                      : 'bg-blue-600 hover:bg-blue-750 disabled:bg-blue-300'
                  }`}
                >
                  {actionPending && <Loader2 className="h-3 w-3 animate-spin" />}
                  {modalType === 'suspend' && 'Suspend User'}
                  {modalType === 'unsuspend' && 'Unsuspend User'}
                  {modalType === 'ban' && 'Ban User'}
                  {modalType === 'unban' && 'Unban User'}
                  {modalType === 'delete' && 'Delete (Archive) User'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}

export default UserManagementPage;
