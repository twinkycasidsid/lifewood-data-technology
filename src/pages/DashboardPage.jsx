import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconLayoutDashboard,
  IconBriefcase,
  IconMapPin,
  IconClock,
  IconUsers,
  IconCalendarEvent,
  IconMail,
  IconUserShield,
  IconSettings,
  IconSearch,
  IconBell,
  IconFileSpreadsheet,
  IconArrowUpRight,
  IconChevronRight,
  IconLogout,
  IconMenu2,
  IconX,
  IconDotsVertical,
  IconPlus,
} from '@tabler/icons-react'
import { supabase } from '../lib/supabaseClient'

const DashboardPage = ({ onNavigate = () => {} }) => {
  const [activePanel, setActivePanel] = useState('dashboard')
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isListingFormOpen, setIsListingFormOpen] = useState(false)
  const [isCreatingListing, setIsCreatingListing] = useState(false)
  const [isListingModalOpen, setIsListingModalOpen] = useState(false)
  const [isEditingListing, setIsEditingListing] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [listingForm, setListingForm] = useState({
    title: '',
    department: '',
    location: '',
    workplace: '',
    workType: '',
    description: '',
    status: 'Active',
  })
  const [editForm, setEditForm] = useState({
    title: '',
    department: '',
    location: '',
    workplace: '',
    workType: '',
    description: '',
    status: 'Active',
  })
  const [listingSearch, setListingSearch] = useState('')
  const [listingDepartment, setListingDepartment] = useState('')
  const [listingWorkplace, setListingWorkplace] = useState('')
  const [listingWorkType, setListingWorkType] = useState('')
  const [listingStatus, setListingStatus] = useState('')
  const listingEditorRef = useRef(null)
  const editEditorRef = useRef(null)
  const listingEditorFocused = useRef(false)
  const editEditorFocused = useRef(false)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
  const sidebarLogo = isSidebarCollapsed
    ? '/lifewood-logo-collapsed.png'
    : 'https://framerusercontent.com/images/Ca8ppNsvJIfTsWEuHr50gvkDow.png?scale-down-to=1024&width=2624&height=474'

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
    { id: 'listings', label: 'Job Listings', icon: IconBriefcase },
    { id: 'applications', label: 'Job Applications', icon: IconUsers },
    { id: 'bookings', label: 'Calendly Bookings', icon: IconCalendarEvent },
    { id: 'submissions', label: 'Contact Submissions', icon: IconMail },
    { id: 'profiles', label: 'User Profiles', icon: IconUserShield },
    { id: 'settings', label: 'Settings', icon: IconSettings },
  ]

  const departmentOptions = [
    'Family Genealogy',
    'Production',
    'Finance',
    'IT',
    'Legal',
    'Business Development',
    'AI Data Production',
    'HR',
    'Accounting',
  ]

  const workplaceOptions = ['On-site', 'Remote', 'Hybrid']
  const workTypeOptions = ['Full-time', 'Part-time', 'Contract']

  const overviewStats = [
    { label: 'Active Listings', value: '18', delta: '+3 this week', trend: 'up' },
    { label: 'New Applications', value: '142', delta: '+12 today', trend: 'up' },
    { label: 'Upcoming Meetings', value: '9', delta: '2 starting soon', trend: 'neutral' },
    { label: 'New Submissions', value: '26', delta: '+5 since yesterday', trend: 'up' },
  ]

  const applicationTrend = [
    { label: 'Mon', value: 34 },
    { label: 'Tue', value: 48 },
    { label: 'Wed', value: 57 },
    { label: 'Thu', value: 42 },
    { label: 'Fri', value: 63 },
    { label: 'Sat', value: 38 },
    { label: 'Sun', value: 51 },
  ]

  const bookingTrend = [
    { label: 'Product', value: 12, delta: '+3' },
    { label: 'Recruiter', value: 18, delta: '+4' },
    { label: 'Client', value: 9, delta: '+1' },
    { label: 'Internal', value: 6, delta: '0' },
  ]

  const defaultJobListings = []

  const defaultApplications = [
    { name: 'Alexa Dizon', role: 'Prompt Engineer', stage: 'Interview', status: 'Shortlisted', score: '92%' },
    { name: 'Marco Santos', role: 'QA Automation', stage: 'Screening', status: 'In Review', score: '88%' },
    { name: 'Kiara Lim', role: 'Product Designer', stage: 'Offer', status: 'Approved', score: '96%' },
    { name: 'Luis Navarro', role: 'Data Annotator', stage: 'Assessment', status: 'Pending', score: '79%' },
  ]

  const defaultMeetings = [
    { event: 'Recruiter Sync', invitee: 'M. Dela Cruz', time: '09:00 - 09:30', status: 'Confirmed' },
    { event: 'Portfolio Review', invitee: 'E. Chen', time: '10:15 - 11:00', status: 'Confirmed' },
    { event: 'Client Intake', invitee: 'Vector Labs', time: '14:00 - 15:00', status: 'Pending' },
    { event: 'Hiring Panel', invitee: 'Lifewood Ops', time: '16:30 - 17:00', status: 'Confirmed' },
  ]

  const defaultSubmissions = [
    { company: 'AstraNova', project: 'LLM Fine-tuning', industry: 'Fintech', status: 'New' },
    { company: 'Northwind', project: 'Data Labeling', industry: 'Retail', status: 'Contacted' },
    { company: 'Orchid Health', project: 'Clinical Summaries', industry: 'Healthcare', status: 'In Review' },
    { company: 'Vertex Logistics', project: 'Route Optimization', industry: 'Logistics', status: 'New' },
  ]

  const defaultProfiles = [
    { name: 'Alyssa Cruz', role: 'Owner', status: 'Active' },
    { name: 'Paolo Reyes', role: 'Recruiter', status: 'Active' },
    { name: 'Tanya Wu', role: 'Hiring Manager', status: 'Suspended' },
    { name: 'Jared Lim', role: 'User', status: 'Active' },
  ]

  const defaultSystemLogs = [
    { time: '08:12', activity: 'Role updated to Recruiter', user: 'Paolo Reyes' },
    { time: '09:30', activity: 'Exported applications CSV', user: 'Alyssa Cruz' },
    { time: '11:05', activity: 'Cancelled meeting: Client Intake', user: 'Owner' },
    { time: '13:20', activity: 'New contact submission received', user: 'System' },
  ]

  const [jobListings, setJobListings] = useState(defaultJobListings)
  const [applications, setApplications] = useState(defaultApplications)
  const [meetings, setMeetings] = useState(defaultMeetings)
  const [submissions, setSubmissions] = useState(defaultSubmissions)
  const [profiles, setProfiles] = useState(defaultProfiles)
  const [systemLogs, setSystemLogs] = useState(defaultSystemLogs)

  const loadAdminData = async () => {
    try {
      const [listingsRes, appsRes, bookingsRes, submissionsRes, profilesRes, logsRes] = await Promise.all([
        fetch(`${apiBaseUrl}/api/admin/listings`),
        fetch(`${apiBaseUrl}/api/admin/applications`),
        fetch(`${apiBaseUrl}/api/admin/bookings`),
        fetch(`${apiBaseUrl}/api/admin/submissions`),
        fetch(`${apiBaseUrl}/api/admin/profiles`),
        fetch(`${apiBaseUrl}/api/admin/logs`),
      ])

      const safeJson = async (response) => {
        if (!response?.ok) return null
        const contentType = response.headers.get('content-type') || ''
        if (!contentType.includes('application/json')) return null
        return response.json()
      }

      const listingsData = await safeJson(listingsRes)
      const appsData = await safeJson(appsRes)
      const bookingsData = await safeJson(bookingsRes)
      const submissionsData = await safeJson(submissionsRes)
      const profilesData = await safeJson(profilesRes)
      const logsData = await safeJson(logsRes)

      if (Array.isArray(listingsData?.data)) {
        setJobListings(
          listingsData.data.map((item) => ({
            id: item.id,
            title: item.title,
            department: item.department,
            location: item.location,
            workplace: item.workplace,
            type: item.work_type,
            description: item.description,
            status: item.status,
            applicants: item.applicants_count,
            createdAt: item.created_at || item.createdAt,
          }))
        )
      }

      let applicationsPayload = Array.isArray(appsData?.data) ? appsData.data : null

      if (!applicationsPayload) {
        const { data: supaApps, error } = await supabase
          .from('job_applications')
          .select('*')
          .order('created_at', { ascending: false })

        if (!error && Array.isArray(supaApps)) {
          applicationsPayload = supaApps
        }
      }

      if (applicationsPayload) {
        setApplications(
          applicationsPayload.map((item) => ({
            id: item.id,
            name: item.name || `${item.first_name || ''} ${item.last_name || ''}`.trim(),
            role: item.role || item.position_applied || item.job_title || item.position,
            stage: item.stage || 'Applied',
            status: item.score != null ? 'Pending' : (item.status || 'New'),
            score: typeof item.score === 'number' ? `${item.score}%` : item.score || '--',
            email: item.email,
            phone: item.phone,
            gender: item.gender,
            age: item.age,
            country: item.country,
            address: item.current_address || item.address,
            cvUrl: item.cv_url || item.cvUrl,
            preScreeningResults: item.pre_screening_results || item.preScreeningResults,
            aiAnalysis: item.ai_analysis || item.aiAnalysis,
            createdAt: item.created_at || item.createdAt,
          }))
        )
      }

      if (Array.isArray(bookingsData?.data)) {
        setMeetings(
          bookingsData.data.map((item) => ({
            event: item.event,
            invitee: item.invitee,
            time: item.start_time && item.end_time ? `${item.start_time} - ${item.end_time}` : item.start_time,
            status: item.status,
          }))
        )
      }

      if (Array.isArray(submissionsData?.data)) {
        setSubmissions(
          submissionsData.data.map((item) => ({
            company: item.company,
            project: item.project,
            industry: item.industry,
            status: item.status,
          }))
        )
      }

      if (Array.isArray(profilesData?.data)) {
        setProfiles(
          profilesData.data.map((item) => ({
            name: item.name,
            role: item.role,
            status: item.status,
          }))
        )
      }

      if (Array.isArray(logsData?.data)) {
        setSystemLogs(
          logsData.data.map((item) => ({
            time: item.time,
            activity: item.activity,
            user: item.actor,
          }))
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [apiBaseUrl])

  useEffect(() => {
    if (!isListingModalOpen) return
    if (editEditorRef.current) {
      editEditorRef.current.innerHTML = editForm.description || selectedListing?.description || ''
    }
  }, [isListingModalOpen, editForm.description, selectedListing])

  const maxApplications = useMemo(
    () => Math.max(...applicationTrend.map((item) => item.value)),
    [applicationTrend]
  )

  const filteredJobListings = useMemo(() => {
    const searchValue = listingSearch.trim().toLowerCase()
    const stripTags = (value = '') => value.replace(/<[^>]+>/g, '')

    return jobListings.filter((listing) => {
      const matchesSearch = !searchValue || [
        listing.title,
        listing.department,
        listing.location,
        listing.workplace,
        listing.type,
        listing.workType,
        listing.status,
        stripTags(listing.description || ''),
      ]
        .filter(Boolean)
        .some((field) => field.toString().toLowerCase().includes(searchValue))

      const matchesDepartment = listingDepartment ? listing.department === listingDepartment : true
      const matchesWorkplace = listingWorkplace ? listing.workplace === listingWorkplace : true
      const matchesWorkType = listingWorkType ? (listing.type || listing.workType) === listingWorkType : true
      const matchesStatus = listingStatus ? listing.status === listingStatus : true

      return matchesSearch && matchesDepartment && matchesWorkplace && matchesWorkType && matchesStatus
    })
  }, [jobListings, listingDepartment, listingSearch, listingStatus, listingWorkType, listingWorkplace])

  const handleLogout = async () => {
    const token = localStorage.getItem('lwAuthToken') || ''
    setIsLoggingOut(true)
    try {
      if (token) {
        await fetch(`${apiBaseUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      localStorage.removeItem('lwAuthToken')
      localStorage.removeItem('lwAuthRole')
      localStorage.removeItem('lwAuthUser')
      sessionStorage.removeItem('lwAuthToken')
      sessionStorage.removeItem('lwAuthRole')
      sessionStorage.removeItem('lwAuthUser')
      setIsLoggingOut(false)
      onNavigate('/get-started')
    }
  }

  const handleListingFieldChange = (field, value) => {
    setListingForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleEditFieldChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  const stripHtml = (value = '') => value.replace(/<[^>]+>/g, '').trim()

  const formatDateShort = (value) => {
    if (!value) return 'Unknown'
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return 'Unknown'
    return parsed.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })
  }

  const escapeCsvValue = (value) => {
    if (value === null || value === undefined) return ''
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
    if (/[",\n]/.test(stringValue)) {
      return ""
    }
    return stringValue
  }

  const downloadCsv = (filename, rows) => {
    if (!rows || rows.length === 0) return
    const headers = Object.keys(rows[0])
    const lines = [headers.join(',')]

    rows.forEach((row) => {
      lines.push(headers.map((header) => escapeCsvValue(row[header])).join(','))
    })

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const handleExport = (panel = activePanel) => {
    if (panel === 'listings') {
      downloadCsv('job-listings.csv', filteredJobListings.map((listing) => ({
        Title: listing.title,
        Department: listing.department,
        Location: listing.location,
        Workplace: listing.workplace,
        WorkType: listing.type || listing.workType,
        Status: listing.status,
        Applicants: listing.applicants ?? 0,
        DatePosted: formatDateShort(listing.createdAt),
      })))
      return
    }

    if (panel === 'applications') {
      downloadCsv('job-applications.csv', applications.map((item) => ({
        Name: item.name,
        Role: item.role,
        Stage: item.stage,
        Status: item.status,
        Score: item.score,
      })))
      return
    }

    if (panel === 'bookings') {
      downloadCsv('bookings.csv', meetings.map((item) => ({
        Event: item.event,
        Invitee: item.invitee,
        Time: item.time,
        Status: item.status,
      })))
      return
    }

    if (panel === 'submissions') {
      downloadCsv('submissions.csv', submissions.map((item) => ({
        Company: item.company,
        Project: item.project,
        Industry: item.industry,
        Status: item.status,
      })))
      return
    }

    if (panel === 'profiles') {
      downloadCsv('profiles.csv', profiles.map((item) => ({
        Name: item.name,
        Role: item.role,
        Status: item.status,
      })))
      return
    }

    if (panel === 'settings') {
      downloadCsv('system-logs.csv', systemLogs.map((item) => ({
        Time: item.time,
        Activity: item.activity,
        User: item.user,
      })))
      return
    }

    downloadCsv('dashboard-overview.csv', overviewStats.map((item) => ({
      Metric: item.label,
      Value: item.value,
      Delta: item.delta,
      Trend: item.trend,
    })))
  }

  const clearListingFilters = () => {
    setListingSearch('')
    setListingDepartment('')
    setListingWorkplace('')
    setListingWorkType('')
    setListingStatus('')
  }

  const openApplicationModal = (application) => {
    setSelectedApplication(application)
    setIsApplicationModalOpen(true)
  }

  const applyFormatting = (targetRef, command, value = null) => {
    if (!targetRef?.current) return
    targetRef.current.focus()
    document.execCommand(command, false, value)
  }

  const renderEditorToolbar = (disabled, targetRef) => (
    <div className={`admin-rich-toolbar ${disabled ? 'is-disabled' : ''}`}>
      <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => applyFormatting(targetRef, 'bold')} disabled={disabled}>B</button>
      <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => applyFormatting(targetRef, 'italic')} disabled={disabled}>I</button>
      <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => applyFormatting(targetRef, 'underline')} disabled={disabled}>U</button>
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => applyFormatting(targetRef, 'insertUnorderedList')}
        disabled={disabled}
        aria-label="Bulleted list"
        title="Bulleted list"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="5" cy="6" r="2" fill="currentColor" />
          <circle cx="5" cy="12" r="2" fill="currentColor" />
          <circle cx="5" cy="18" r="2" fill="currentColor" />
          <rect x="10" y="5" width="10" height="2" rx="1" fill="currentColor" />
          <rect x="10" y="11" width="10" height="2" rx="1" fill="currentColor" />
          <rect x="10" y="17" width="10" height="2" rx="1" fill="currentColor" />
        </svg>
      </button>
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => applyFormatting(targetRef, 'insertOrderedList')}
        disabled={disabled}
        aria-label="Numbered list"
        title="Numbered list"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 5h2v2H3V6h1V5zm0 6h2v2H3v-1h1v-1zm0 6h2v2H3v-1h1v-1z" fill="currentColor" />
          <rect x="10" y="5" width="10" height="2" rx="1" fill="currentColor" />
          <rect x="10" y="11" width="10" height="2" rx="1" fill="currentColor" />
          <rect x="10" y="17" width="10" height="2" rx="1" fill="currentColor" />
        </svg>
      </button>
      <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => applyFormatting(targetRef, 'removeFormat')} disabled={disabled}>Clear</button>
    </div>
  )
  const handleCreateListing = async () => {
    setIsCreatingListing(true)
    try {
      const payload = {
        title: listingForm.title,
        department: listingForm.department,
        location: listingForm.location,
        workplace: listingForm.workplace,
        work_type: listingForm.workType,
        description: listingForm.description,
        status: listingForm.status,
      }

      const response = await fetch(`${apiBaseUrl}/api/admin/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to create job listing.')
      }

      setListingForm({
        title: '',
        department: '',
        location: '',
        workplace: '',
        workType: '',
        description: '',
        status: 'Active',
      })
      setIsListingFormOpen(false)
      await loadAdminData()
    } catch (error) {
      console.error(error)
    } finally {
      setIsCreatingListing(false)
    }
  }

  const openListingModal = (listing) => {
    setSelectedListing(listing)
    setEditForm({
      title: listing.title || '',
      department: listing.department || '',
      location: listing.location || '',
      workplace: listing.workplace || '',
      workType: listing.type || listing.workType || '',
      description: listing.description || '',
      status: listing.status || 'Active',
    })
    if (editEditorRef.current) {
      editEditorRef.current.innerHTML = listing.description || ''
    }
    setIsEditingListing(false)
    setIsListingModalOpen(true)
  }

  const handleUpdateListing = async () => {
    if (!selectedListing?.id) return
    try {
      const payload = {
        title: editForm.title,
        department: editForm.department,
        location: editForm.location,
        workplace: editForm.workplace,
        work_type: editForm.workType,
        description: editForm.description,
        status: editForm.status,
      }

      const response = await fetch(`${apiBaseUrl}/api/admin/listings/${selectedListing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to update job listing.')
      }

      await loadAdminData()
      setIsEditingListing(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteListing = async () => {
    if (!selectedListing?.id) return
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/listings/${selectedListing.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete job listing.')
      }

      setIsListingModalOpen(false)
      setSelectedListing(null)
      await loadAdminData()
    } catch (error) {
      console.error(error)
    }
  }

  const renderDashboardOverview = () => (
    <div className="admin-dashboard-shell">
      <section className="admin-dashboard-hero">
        <div>
          <p>Talent Ops Control Center</p>
          <h1>Overview</h1>
          <span>High-level activity across job listings, applications, meetings, and submissions.</span>
        </div>
        <div className="admin-dashboard-hero-actions">
          <button type="button" className="admin-pill">Live Updates</button>
          <button type="button" className="admin-btn" onClick={() => handleExport('dashboard')}>
            <IconFileSpreadsheet size={16} />
            Export Snapshot
          </button>
        </div>
      </section>

      <section className="admin-dashboard-stats">
        {overviewStats.map((stat) => (
          <article key={stat.label} className="admin-dashboard-stat">
            <div className="admin-dashboard-stat-top">
              <p>{stat.label}</p>
              <span className={stat.trend === 'up' ? 'up' : 'neutral'}>
                <IconArrowUpRight size={16} />
              </span>
            </div>
            <h3>{stat.value}</h3>
            <small>{stat.delta}</small>
          </article>
        ))}
      </section>

      <section className="admin-dashboard-grid">
        <article className="admin-dashboard-card">
          <div className="admin-dashboard-card-head">
            <div>
              <h2>Applications Trend</h2>
              <p>7-day volume per role</p>
            </div>
            <button type="button" className="admin-icon-btn" aria-label="More options">
              <IconDotsVertical size={16} />
            </button>
          </div>
          <div className="admin-dashboard-chart">
            {applicationTrend.map((item) => (
              <div key={item.label} className="admin-dashboard-bar">
                <div
                  className="admin-dashboard-bar-fill"
                  style={{ height: `${Math.round((item.value / maxApplications) * 100)}%` }}
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-dashboard-card">
          <div className="admin-dashboard-card-head">
            <div>
              <h2>Booking Mix</h2>
              <p>Meeting volume by event type</p>
            </div>
            <button type="button" className="admin-icon-btn" aria-label="More options">
              <IconDotsVertical size={16} />
            </button>
          </div>
          <div className="admin-dashboard-table">
            {bookingTrend.map((row) => (
              <div key={row.label} className="admin-dashboard-table-row">
                <div>
                  <strong>{row.label}</strong>
                  <span>{row.value} meetings</span>
                </div>
                <em>{row.delta}</em>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-dashboard-card full">
          <div className="admin-dashboard-card-head">
            <div>
              <h2>Real-Time Notifications</h2>
              <p>Critical updates from listings, applications, and submissions.</p>
            </div>
            <button type="button" className="admin-btn ghost">View all</button>
          </div>
          <div className="admin-dashboard-alerts">
            <div className="admin-dashboard-alert">
              <span className="pulse" />
              <div>
                <b>New application: Prompt Engineer</b>
                <small>Candidate: Alexa Dizon Unknown 2 minutes ago</small>
              </div>
              <button type="button" className="admin-link">Review</button>
            </div>
            <div className="admin-dashboard-alert">
              <span className="pulse warning" />
              <div>
                <b>Meeting rescheduled</b>
                <small>Client Intake moved to 14:00 Unknown 10 minutes ago</small>
              </div>
              <button type="button" className="admin-link">Update</button>
            </div>
            <div className="admin-dashboard-alert">
              <span className="pulse success" />
              <div>
                <b>Submission flagged as high priority</b>
                <small>Orchid Health Unknown 45 minutes ago</small>
              </div>
              <button type="button" className="admin-link">Contact</button>
            </div>
          </div>
        </article>
      </section>
    </div>
  )

  const renderJobListings = () => (
    <div className="admin-panel-shell">
      <section className="admin-panel-head">
        <div>
          <h1>Job Listings</h1>
          <p>Track open roles, filter by department, location, and work type.</p>
        </div>
      </section>
      <div className="admin-listing-controls">
        <div className="admin-listing-filters">
          <select
            value={listingDepartment}
            onChange={(event) => setListingDepartment(event.target.value)}
          >
            <option value="">All departments</option>
            {departmentOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <select
            value={listingWorkplace}
            onChange={(event) => setListingWorkplace(event.target.value)}
          >
            <option value="">All workplaces</option>
            {workplaceOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <select
            value={listingWorkType}
            onChange={(event) => setListingWorkType(event.target.value)}
          >
            <option value="">All work types</option>
            {workTypeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <select
            value={listingStatus}
            onChange={(event) => setListingStatus(event.target.value)}
          >
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Closed">Closed</option>
          </select>
          <button type="button" className="admin-listing-clear" onClick={clearListingFilters}>
            Clear Filters
          </button>
        </div>
        <button
          type="button"
          className={`admin-listing-add ${isListingFormOpen ? 'is-open' : ''}`}
          aria-label={isListingFormOpen ? 'Close listing form' : 'Add listing'}
          onClick={() => setIsListingFormOpen((prev) => !prev)}
        >
          <IconPlus size={18} />
        </button>
      </div>
      <div className="admin-listing-count">
        Showing {filteredJobListings.length} of {jobListings.length} listings
      </div>
      <AnimatePresence>
        {isListingFormOpen ? (
          <motion.div
            className="admin-listing-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsListingFormOpen(false)}
          >
            <motion.section
              className="admin-listing-modal"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="dashboard-profile-modal-close"
                aria-label="Close listing form"
                onClick={() => setIsListingFormOpen(false)}
              >
                <IconX size={18} />
              </button>
              <div className="admin-listing-modal-head">
                <div>
                  <h2>Add Job Listing</h2>
                  <p>Create a new role for your careers page.</p>
                </div>
                <span className="status active">New</span>
              </div>
              <div className="admin-form-grid">
                <label>
                  Title
                  <input
                    type="text"
                    value={listingForm.title}
                    onChange={(event) => handleListingFieldChange('title', event.target.value)}
                  />
                </label>
                <label>
                  Department
                  <select
                    value={listingForm.department}
                    onChange={(event) => handleListingFieldChange('department', event.target.value)}
                  >
                    <option value="">Select department</option>
                    {departmentOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Location
                  <input
                    type="text"
                    value={listingForm.location}
                    onChange={(event) => handleListingFieldChange('location', event.target.value)}
                  />
                </label>
                <label>
                  Workplace
                  <select
                    value={listingForm.workplace}
                    onChange={(event) => handleListingFieldChange('workplace', event.target.value)}
                  >
                    <option value="">Select workplace</option>
                    {workplaceOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Work Type
                  <select
                    value={listingForm.workType}
                    onChange={(event) => handleListingFieldChange('workType', event.target.value)}
                  >
                    <option value="">Select work type</option>
                    {workTypeOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <div className="full admin-editor-field">
                  <span className="admin-editor-label">Description</span>
                  {renderEditorToolbar(false, listingEditorRef)}
                  <div
                    className="admin-rich-editor"
                    ref={listingEditorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onFocus={() => { listingEditorFocused.current = true }}
                    onBlur={() => { listingEditorFocused.current = false }}
                    onInput={(event) => handleListingFieldChange('description', event.currentTarget.innerHTML)}
                  />
                </div>
                <label>
                  Status
                  <select
                    value={listingForm.status}
                    onChange={(event) => handleListingFieldChange('status', event.target.value)}
                  >
                    <option>Active</option>
                    <option>Paused</option>
                    <option>Closed</option>
                  </select>
                </label>
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn ghost" onClick={() => setIsListingFormOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="admin-btn" onClick={handleCreateListing} disabled={isCreatingListing}>
                  {isCreatingListing ? 'Saving...' : 'Save Listing'}
                </button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
        <section className="admin-card-grid admin-listing-grid">
          {jobListings.length === 0 ? (
            <article className="admin-card">
              <div className="admin-card-top">
                <div>
                  <h3>No job listings yet</h3>
                  <p>Add a listing to publish it on Careers.</p>
                </div>
                <span className="status paused">Empty</span>
              </div>
            </article>
          ) : filteredJobListings.length === 0 ? (
            <article className="admin-card">
              <div className="admin-card-top">
                <div>
                  <h3>No listings match your filters</h3>
                  <p>Try adjusting your search or filter selections.</p>
                </div>
                <span className="status paused">Filtered</span>
              </div>
            </article>
          ) : filteredJobListings.map((listing) => (
            <article
              key={listing.id || listing.title}
              className="admin-card admin-listing-card admin-card-clickable"
              role="button"
              tabIndex={0}
              onClick={() => openListingModal(listing)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  openListingModal(listing)
                }
              }}
            >
              <div className="admin-listing-head">
                <h3 className="admin-listing-title">{listing.title}</h3>
                <span className={`status ${(listing.status || 'Active').toLowerCase()}`}>
                  {listing.status || 'Active'}
                </span>
              </div>

              <div className="admin-listing-tags">
                <span className="admin-listing-pill location">
                  <IconMapPin size={16} />
                  {listing.location}
                </span>
                <span className="admin-listing-pill department">
                  <IconBriefcase size={16} />
                  {listing.department}
                </span>
                <span className="admin-listing-pill type">
                  <IconClock size={16} />
                  {listing.type || listing.workType || 'Unknown'}
                </span>
              </div>

              {listing.description ? (
                <p className="admin-listing-desc">{stripHtml(listing.description)}</p>
              ) : null}

              <div className="admin-listing-footer">
                <div className="admin-listing-metric">
                  <strong>{formatDateShort(listing.createdAt)}</strong>
                  <span>Date Posted</span>
                </div>
                <div className="admin-listing-divider" />
                <div className="admin-listing-metric">
                  <strong>{listing.applicants ?? 0}</strong>
                  <span>Applicants</span>
                </div>
                <button
                  type="button"
                  className="admin-listing-cta"
                  aria-label="View listing details"
                  onClick={(event) => {
                    event.stopPropagation()
                    openListingModal(listing)
                  }}
                >
                  <IconChevronRight size={20} />
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    )

  const renderApplications = () => (
    <div className="admin-panel-shell">
      <section className="admin-panel-head">
        <div>
          <h1>Job Applications</h1>
          <p>Review applicants and track hiring pipeline performance.</p>
        </div>
        <div className="admin-panel-actions">
          <button type="button" className="admin-btn ghost">Stage Filters</button>
          <button type="button" className="admin-btn" onClick={() => handleExport('applications')}>Export CSV</button>
        </div>
      </section>
      <div className="admin-filter-row">
        <button type="button" className="admin-pill active">All Status</button>
        <button type="button" className="admin-pill">Shortlisted</button>
        <button type="button" className="admin-pill">Interview</button>
        <button type="button" className="admin-pill">Rejected</button>
        <button type="button" className="admin-pill">Offer</button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Role Applied</th>
              <th>Stage</th>
              <th>Match</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((applicant) => (
              <tr
                key={applicant.id || applicant.email || applicant.name}
                className="admin-table-row"
                onClick={() => openApplicationModal(applicant)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    openApplicationModal(applicant)
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <td>
                  <div className="admin-table-title">
                    <strong>{applicant.name}</strong>
                  </div>
                </td>
                <td>
                  <div className="admin-table-meta">
                    <strong>{applicant.role || '--'}</strong>
                    <span>Role Applied</span>
                  </div>
                </td>
                <td>
                  <div className="admin-table-meta">
                    <strong>{applicant.stage}</strong>
                    <span>Stage</span>
                  </div>
                </td>
                <td>
                  <div className="admin-table-meta">
                    <strong>{applicant.score}</strong>
                    <span>Match</span>
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    className="admin-link"
                    onClick={(event) => {
                      event.stopPropagation()
                      openApplicationModal(applicant)
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderBookings = () => (
    <div className="admin-panel-shell">
      <section className="admin-panel-head">
        <div>
          <h1>Calendly Bookings</h1>
          <p>Manage upcoming meetings and booking requests.</p>
        </div>
        <div className="admin-panel-actions">
          <button type="button" className="admin-btn ghost">Sync Calendly</button>
          <button type="button" className="admin-btn" onClick={() => handleExport('bookings')}>Export CSV</button>
        </div>
      </section>
      <div className="admin-filter-row">
        <button type="button" className="admin-pill active">All Events</button>
        <button type="button" className="admin-pill">Recruiter</button>
        <button type="button" className="admin-pill">Client</button>
        <button type="button" className="admin-pill">Internal</button>
      </div>
      <section className="admin-card-grid">
        {meetings.map((meeting) => (
          <article key={meeting.event} className="admin-card">
            <div className="admin-card-top">
              <div>
                <h3>{meeting.event}</h3>
                <p>{meeting.invitee}</p>
              </div>
              <span className={`status ${meeting.status.toLowerCase()}`}>{meeting.status}</span>
            </div>
            <div className="admin-card-meta">
              <div>
                <strong>{meeting.time}</strong>
                <span>Time</span>
              </div>
              <div>
                <strong>{meeting.status}</strong>
                <span>Status</span>
              </div>
            </div>
            <div className="admin-card-actions">
              <button type="button" className="admin-link">Edit Booking</button>
              <button type="button" className="admin-link">Cancel</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  )

  const renderSubmissions = () => (
    <div className="admin-panel-shell">
      <section className="admin-panel-head">
        <div>
          <h1>Contact Submissions</h1>
          <p>Respond to potential clients and track project inquiries.</p>
        </div>
        <div className="admin-panel-actions">
          <button type="button" className="admin-btn ghost" onClick={() => handleExport('submissions')}>
            <IconFileSpreadsheet size={16} />
            Export Excel
          </button>
        </div>
      </section>
      <div className="admin-filter-row">
        <button type="button" className="admin-pill active">All Industries</button>
        <button type="button" className="admin-pill">Fintech</button>
        <button type="button" className="admin-pill">Healthcare</button>
        <button type="button" className="admin-pill">Retail</button>
        <button type="button" className="admin-pill">Logistics</button>
      </div>
      <section className="admin-table">
        {submissions.map((submission) => (
          <div key={submission.company} className="admin-table-row">
            <div>
              <h3>{submission.company}</h3>
              <p>{submission.project}</p>
            </div>
            <div>
              <strong>{submission.industry}</strong>
              <span>Industry</span>
            </div>
            <span className="tag">{submission.status}</span>
            <button type="button" className="admin-link">Respond</button>
          </div>
        ))}
      </section>
    </div>
  )

  const renderProfiles = () => (
    <div className="admin-panel-shell">
      <section className="admin-panel-head">
        <div>
          <h1>User Profiles</h1>
          <p>Manage users, assign roles, and review activity history.</p>
        </div>
        <div className="admin-panel-actions">
          <button type="button" className="admin-btn ghost">Role Filters</button>
          <button type="button" className="admin-btn">Create User</button>
        </div>
      </section>
      <section className="admin-card-grid">
        {profiles.map((profile) => (
          <article key={profile.name} className="admin-card">
            <div className="admin-card-top">
              <div>
                <h3>{profile.name}</h3>
                <p>{profile.role}</p>
              </div>
              <span className={`status ${profile.status.toLowerCase()}`}>{profile.status}</span>
            </div>
            <div className="admin-card-meta">
              <div>
                <strong>{profile.role}</strong>
                <span>Role</span>
              </div>
              <div>
                <strong>{profile.status}</strong>
                <span>Status</span>
              </div>
            </div>
            <div className="admin-card-actions">
              <button type="button" className="admin-link">Edit Profile</button>
              <button type="button" className="admin-link">View Activity</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  )

  const renderSettings = () => (
    <div className="admin-panel-shell">
      <section className="admin-panel-head">
        <div>
          <h1>Settings</h1>
          <p>Configure notifications, permissions, and audit logs.</p>
        </div>
        <div className="admin-panel-actions">
          <button type="button" className="admin-btn ghost">Save Changes</button>
          <button type="button" className="admin-btn">Add Integration</button>
        </div>
      </section>
      <section className="admin-settings-grid">
        <article className="admin-card">
          <div className="admin-card-top">
            <div>
              <h3>General Settings</h3>
              <p>Email notifications, privacy, integrations.</p>
            </div>
          </div>
          <ul className="admin-setting-list">
            <li>Weekly digest enabled</li>
            <li>Applicant GDPR export enabled</li>
            <li>Calendly API connected</li>
          </ul>
          <button type="button" className="admin-link">Edit Settings</button>
        </article>
        <article className="admin-card">
          <div className="admin-card-top">
            <div>
              <h3>Role Management</h3>
              <p>Role-based access for admins, recruiters, and users.</p>
            </div>
          </div>
          <ul className="admin-setting-list">
            <li>Owner: full access</li>
            <li>Recruiter: listings + applications</li>
            <li>User: read-only insights</li>
          </ul>
          <button type="button" className="admin-link">Update Roles</button>
        </article>
        <article className="admin-card full">
          <div className="admin-card-top">
            <div>
              <h3>System Logs</h3>
              <p>Audit trail of recent administrative actions.</p>
            </div>
            <button type="button" className="admin-btn ghost">View Logs</button>
          </div>
          <div className="admin-log-list">
            {systemLogs.map((log) => (
              <div key={`${log.time}-${log.activity}`} className="admin-log-item">
                <strong>{log.time}</strong>
                <div>
                  <p>{log.activity}</p>
                  <span>{log.user}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )

  return (
    <main className="dashboard-page admin-dashboard">
      <section className={`dashboard-basic-layout admin-dashboard-layout ${isSidebarCollapsed ? 'is-collapsed' : ''}`}>
        <aside className={`dashboard-basic-sidebar admin-dashboard-sidebar ${isSidebarCollapsed ? 'is-collapsed' : ''}`}>
          <div className="dashboard-basic-sidebar-head">
            <div className="dashboard-basic-brand">
              <img
                src={sidebarLogo}
                alt="Lifewood"
                loading="lazy"
              />
            </div>
            <button
              type="button"
              className="dashboard-basic-menu-btn"
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            >
              <IconMenu2 size={19} />
            </button>
          </div>

          <p className="dashboard-basic-menu-label">Workspace</p>

          <nav className="dashboard-basic-nav admin-dashboard-nav" aria-label="Dashboard Sidebar">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  className={activePanel === item.id ? 'active' : ''}
                  onClick={() => setActivePanel(item.id)}
                >
                  <span>
                    <Icon size={18} />
                    <span className="admin-nav-label">{item.label}</span>
                  </span>
                  {activePanel === item.id ? <IconChevronRight size={16} /> : null}
                </button>
              )
            })}
          </nav>

          <button type="button" className="dashboard-basic-logout" onClick={() => setIsLogoutModalOpen(true)}>
            <IconLogout size={18} />
            <span className="admin-logout-label">Logout</span>
          </button>
        </aside>
        <section className="dashboard-basic-content admin-dashboard-content">
          <header className="admin-dashboard-topbar">
            <div className="admin-search">
              <IconSearch size={16} />
              <input
                type="search"
                placeholder="Search listings, applications, meetings, submissions, users"
                aria-label="Search dashboard"
                value={listingSearch}
                onChange={(event) => setListingSearch(event.target.value)}
              />
            </div>
            <div className="admin-topbar-actions">
              <button type="button" className="admin-icon-btn" aria-label="Notifications">
                <IconBell size={18} />
                <span className="admin-badge">3</span>
              </button>
              <button type="button" className="admin-btn ghost">
                <IconFileSpreadsheet size={16} />
                Export
              </button>
            </div>
          </header>

          {activePanel === 'dashboard' && renderDashboardOverview()}
          {activePanel === 'listings' && renderJobListings()}
          {activePanel === 'applications' && renderApplications()}
          {activePanel === 'bookings' && renderBookings()}
          {activePanel === 'submissions' && renderSubmissions()}
          {activePanel === 'profiles' && renderProfiles()}
          {activePanel === 'settings' && renderSettings()}
        </section>
      </section>

      <AnimatePresence>
        {isLogoutModalOpen ? (
          <motion.div
            className="dashboard-logout-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLogoutModalOpen(false)}
          >
            <motion.section
              className="dashboard-logout-modal"
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="dashboard-profile-modal-close"
                aria-label="Close logout modal"
                onClick={() => setIsLogoutModalOpen(false)}
              >
                <IconX size={18} />
              </button>
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to logout?</p>
              <div className="dashboard-logout-modal-actions">
                <button type="button" onClick={() => setIsLogoutModalOpen(false)}>Cancel</button>
                <button
                  type="button"
                  className="confirm"
                  onClick={() => {
                    setIsLogoutModalOpen(false)
                    handleLogout()
                  }}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Logging out...' : 'Yes, Logout'}
                </button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isListingModalOpen ? (
          <motion.div
            className="admin-listing-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsListingModalOpen(false)}
          >
              <motion.section
                className="admin-listing-modal"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="dashboard-profile-modal-close"
                aria-label="Close listing modal"
                onClick={() => setIsListingModalOpen(false)}
              >
                <IconX size={18} />
              </button>

              <div className="admin-listing-modal-head">
                <div>
                  <h2>{selectedListing?.title || 'Job Listing'}</h2>
                  <p>{selectedListing?.department} | {selectedListing?.location}</p>
                </div>
                <span className={`status ${selectedListing?.status?.toLowerCase() || 'active'}`}>
                  {selectedListing?.status || 'Active'}
                </span>
              </div>

              <div className="admin-form-grid">
                <label>
                  Title
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(event) => handleEditFieldChange('title', event.target.value)}
                    disabled={!isEditingListing}
                  />
                </label>
                <label>
                  Department
                  <select
                    value={editForm.department}
                    onChange={(event) => handleEditFieldChange('department', event.target.value)}
                    disabled={!isEditingListing}
                  >
                    <option value="">Select department</option>
                    {departmentOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Location
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(event) => handleEditFieldChange('location', event.target.value)}
                    disabled={!isEditingListing}
                  />
                </label>
                <label>
                  Workplace
                  <select
                    value={editForm.workplace}
                    onChange={(event) => handleEditFieldChange('workplace', event.target.value)}
                    disabled={!isEditingListing}
                  >
                    <option value="">Select workplace</option>
                    {workplaceOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Work Type
                  <select
                    value={editForm.workType}
                    onChange={(event) => handleEditFieldChange('workType', event.target.value)}
                    disabled={!isEditingListing}
                  >
                    <option value="">Select work type</option>
                    {workTypeOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Status
                  <select
                    value={editForm.status}
                    onChange={(event) => handleEditFieldChange('status', event.target.value)}
                    disabled={!isEditingListing}
                  >
                    <option>Active</option>
                    <option>Paused</option>
                    <option>Closed</option>
                  </select>
                </label>
                <div className="full admin-editor-field">
                  <span className="admin-editor-label">Description</span>
                  {renderEditorToolbar(!isEditingListing, editEditorRef)}
                  <div
                    className={`admin-rich-editor ${!isEditingListing ? 'is-readonly' : ''}`}
                    ref={editEditorRef}
                    contentEditable={isEditingListing}
                    suppressContentEditableWarning
                    onFocus={() => { editEditorFocused.current = true }}
                    onBlur={() => { editEditorFocused.current = false }}
                    onInput={(event) => handleEditFieldChange('description', event.currentTarget.innerHTML)}
                  />
                </div>
              </div>

              <div className="admin-form-actions">
                {!isEditingListing ? (
                  <>
                    <button type="button" className="admin-btn ghost" onClick={() => setIsEditingListing(true)}>
                      Edit Listing
                    </button>
                    <button type="button" className="admin-btn danger" onClick={handleDeleteListing}>
                      Delete Listing
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="admin-btn ghost" onClick={() => setIsEditingListing(false)}>
                      Cancel
                    </button>
                    <button type="button" className="admin-btn" onClick={handleUpdateListing}>
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isApplicationModalOpen ? (
          <motion.div
            className="admin-listing-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsApplicationModalOpen(false)}
          >
              <motion.section
                className="admin-listing-modal"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="dashboard-profile-modal-close"
                aria-label="Close application modal"
                onClick={() => setIsApplicationModalOpen(false)}
              >
                <IconX size={18} />
              </button>
              <div className="admin-listing-modal-head admin-application-head">
                <div>
                  <h2>{selectedApplication?.name || 'Applicant'}</h2>
                  <p>{selectedApplication?.role || 'Applied Role'}</p>
                </div>
                <button
                  type="button"
                  className="admin-btn ghost"
                  onClick={() => {
                    if (selectedApplication?.cvUrl) {
                      window.open(selectedApplication.cvUrl, '_blank', 'noopener,noreferrer')
                    }
                  }}
                  disabled={!selectedApplication?.cvUrl}
                >
                  View Resume
                </button>
              </div>
              <div className="admin-application-body">
                <div className="admin-form-grid admin-application-grid">
                <label>
                  Email
                  <input type="text" value={selectedApplication?.email || ''} readOnly />
                </label>
                <label>
                  Phone
                  <input type="text" value={selectedApplication?.phone || ''} readOnly />
                </label>
                <label>
                  Gender
                  <input type="text" value={selectedApplication?.gender || ''} readOnly />
                </label>
                <label>
                  Age
                  <input type="text" value={selectedApplication?.age || ''} readOnly />
                </label>
                <label>
                  Country
                  <input type="text" value={selectedApplication?.country || ''} readOnly />
                </label>
                <label>
                  Status
                  <input type="text" value={selectedApplication?.status || ''} readOnly />
                </label>
                <label className="full">
                  Address
                  <input type="text" value={selectedApplication?.address || ''} readOnly />
                </label>
                <label>
                  Match Score
                  <input type="text" value={selectedApplication?.score || '--'} readOnly />
                </label>
              </div>
              </div>
              <div className="admin-application-scroll">
                <div className="admin-form-grid admin-application-grid">
                  <div className="full">
                    <span className="admin-editor-label">AI Analysis</span>
                    <div className="admin-rich-editor is-readonly admin-application-note">
                      {selectedApplication?.aiAnalysis || 'No AI analysis available yet.'}
                    </div>
                  </div>
                  <div className="full">
                    <span className="admin-editor-label">Pre-Screening Results</span>
                    <div className="admin-rich-editor is-readonly admin-application-note">
                      {selectedApplication?.preScreeningResults || 'No pre-screening results available yet.'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="admin-form-actions admin-application-footer">
                <button type="button" className="admin-btn">
                  Schedule Final Interview
                </button>
                <button type="button" className="admin-btn danger">
                  Delete Applicant
                </button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  )
}

export default DashboardPage























