import React, { useMemo, useState } from 'react'
import { Search, Download, Users, User, ArrowLeft } from 'lucide-react'

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  } catch (e) {
    return 'N/A'
  }
}

export default function EventRegistrationsTab({ registrations = [], eventTitle = '' }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const search = searchTerm.toLowerCase().trim()
      if (!search) return true

      const userName = (reg.user?.name || '').toLowerCase()
      const userEmail = (reg.user?.email || '').toLowerCase()
      const teamName = (reg.teamName || '').toLowerCase()
      const members = (reg.teamMembers || [])
        .map((m) => `${m.name} ${m.email}`)
        .join(' ')
        .toLowerCase()

      return (
        userName.includes(search) ||
        userEmail.includes(search) ||
        teamName.includes(search) ||
        members.includes(search)
      )
    })
  }, [registrations, searchTerm])

  const handleExportCSV = () => {
    if (!registrations.length) return

    // Define headers
    const headers = [
      'Registration Date',
      'Participant Name',
      'Participant Email',
      'Registration Type',
      'Team Name',
      'Team Members',
      'Answers'
    ]

    // Construct rows
    const rows = registrations.map((reg) => {
      const memberList = (reg.teamMembers || [])
        .map((m) => `${m.name} (${m.email} - ${m.role})`)
        .join('; ')

      const answerList = (reg.answers || [])
        .map((a) => `Q: ${a.question} -> A: ${a.answer}`)
        .join(' | ')

      return [
        reg.createdAt ? new Date(reg.createdAt).toISOString() : '',
        reg.user?.name || '',
        reg.user?.email || '',
        reg.registrationType || 'individual',
        reg.teamName || '',
        memberList,
        answerList
      ]
    })

    // Create CSV content
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `${eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_registrations.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or team..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm font-medium outline-none focus:ring-1 focus:ring-blue-600 bg-white"
          />
        </div>

        <button
          onClick={handleExportCSV}
          disabled={!registrations.length}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Registrations List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Participant</th>
                <th className="px-6 py-4">Mode</th>
                <th className="px-6 py-4">Team Info</th>
                <th className="px-6 py-4">Custom Answers</th>
                <th className="px-6 py-4">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((reg) => (
                  <tr key={reg._id || reg.id} className="hover:bg-slate-50/50 transition duration-150">
                    
                    {/* User profile info */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-950">{reg.user?.name || 'Deleted User'}</div>
                      <div className="text-xs text-slate-500">{reg.user?.email || 'N/A'}</div>
                      {reg.user?.organization && (
                        <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mt-0.5">
                          {reg.user.organization}
                        </div>
                      )}
                    </td>

                    {/* Mode badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          reg.registrationType === 'team'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {reg.registrationType === 'team' ? (
                          <>
                            <Users className="w-3 h-3" /> Team
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3" /> Individual
                          </>
                        )}
                      </span>
                    </td>

                    {/* Team info */}
                    <td className="px-6 py-4">
                      {reg.registrationType === 'team' ? (
                        <div className="space-y-1.5 max-w-xs">
                          <div className="font-bold text-slate-900">{reg.teamName || 'Untitled Team'}</div>
                          <div className="text-xs space-y-1">
                            {(reg.teamMembers || []).map((m, idx) => (
                              <div key={idx} className="bg-slate-100 p-1.5 rounded border border-slate-200/60 leading-tight">
                                <span className="font-semibold text-slate-800">{m.name}</span>
                                <span className="text-[10px] text-slate-500 block">
                                  {m.email} &bull; <span className="italic text-blue-600 font-semibold">{m.role}</span>
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">N/A (Individual)</span>
                      )}
                    </td>

                    {/* Custom Answers */}
                    <td className="px-6 py-4">
                      {reg.answers && reg.answers.length > 0 ? (
                        <div className="space-y-2 max-w-xs">
                          {reg.answers.map((ans, idx) => (
                            <div key={idx} className="text-xs leading-normal">
                              <div className="font-semibold text-slate-650">{ans.question}</div>
                              <div className="text-slate-900 bg-slate-50 p-1.5 rounded border border-slate-100 mt-0.5 break-words">
                                {ans.answer}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">No questions answered</span>
                      )}
                    </td>

                    {/* Registered date */}
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs">
                      {formatDate(reg.createdAt || reg.registeredAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-450 font-medium">
                    No registrations match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
