import React, { useState, useEffect } from 'react'
import { ShieldCheck, UserPlus, Users, UserX } from 'lucide-react'
import UserTable from '../../components/admin/UserTable'
import adminService from '../../services/adminService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { showSuccess, showError } from '../../utils/toast'

function UserManagementPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminService.getUsers()
      // Map data properties to match UserTable's expected properties
      const mapped = (data || []).map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        joinedAt: u.createdAt,
        eventsJoined: u.registeredEvents?.length || 0,
      }))
      setUsers(mapped)
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error('Failed to load user directory:', err)
      }
      setError(err.response?.data?.message || 'Failed to load user directory. Please reload.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSuspend = async (user) => {
    try {
      await adminService.updateUser(user.id, { status: 'suspended' })
      showSuccess(`Account for ${user.name || 'user'} has been suspended.`)
      fetchUsers()
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to suspend user account.')
    }
  }

  const handleActivate = async (user) => {
    try {
      await adminService.updateUser(user.id, { status: 'active' })
      showSuccess(`Account for ${user.name || 'user'} has been activated.`)
      fetchUsers()
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to activate user account.')
    }
  }

  const activeUsersCount = users.filter((u) => u.status === 'active' || u.status === 'Active').length
  const suspendedUsersCount = users.filter((u) => u.status === 'suspended' || u.status === 'Suspended').length

  const userStats = [
    { label: 'Active users', value: activeUsersCount, icon: Users, detail: 'Participants and judges' },
    { label: 'Total profiles', value: users.length, icon: UserPlus, detail: 'Registered system accounts' },
    { label: 'Suspended', value: suspendedUsersCount, icon: UserX, detail: 'Restricted profiles' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-bg">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <main className="bg-theme-surface text-theme-text">
      <section className="relative overflow-hidden bg-mesh pt-10 pb-12">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-theme-surface/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
                <ShieldCheck className="h-4 w-4" />
                Admin control
              </div>
              <h1 className="mt-6 font-outfit text-4xl font-extrabold leading-tight tracking-tight text-theme-text sm:text-5xl">
                User management
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-theme-text-secondary">
                Review participant and judge accounts, monitor registration activity, and keep risky profiles under control.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {userStats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="rounded-2xl border border-theme-border bg-theme-surface/90 p-5 shadow-sm backdrop-blur">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-theme-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <strong className="mt-4 block font-outfit text-3xl font-bold text-theme-text">{stat.value}</strong>
                    <span className="text-sm font-semibold text-theme-text-secondary">{stat.label}</span>
                    <p className="mt-1 text-xs text-theme-text-secondary">{stat.detail}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 space-y-4">
        {error && (
          <div className="rounded-xl border border-theme-error-border bg-theme-error-bg p-4 text-sm font-semibold text-theme-error">
            {error}
          </div>
        )}
        <UserTable
          users={users}
          onSuspend={handleSuspend}
          onActivate={handleActivate}
        />
      </section>
    </main>
  )
}

export default UserManagementPage
