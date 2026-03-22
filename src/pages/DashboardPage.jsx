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
import emailjs from '@emailjs/browser'
import { supabase } from '../lib/supabaseClient'
import { buildScreeningLink } from '../utils/screeningLink'

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
  const [isAnalyzingApplication, setIsAnalyzingApplication] = useState(false)
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
  const [applicationRoleFilter, setApplicationRoleFilter] = useState('')
  const [applicationStatusFilter, setApplicationStatusFilter] = useState('')
  const [notifications, setNotifications] = useState([])
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const listingEditorRef = useRef(null)
  const editEditorRef = useRef(null)
  const listingEditorFocused = useRef(false)
  const editEditorFocused = useRef(false)
  const knownApplicationIdsRef = useRef(new Set())
  const hasLoadedApplicationsRef = useRef(false)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
  const emailServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
  const emailTemplateId =
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID_FOLLOWUP ||
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID ||
    ''
  const emailPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
  const screeningUrl = import.meta.env.VITE_SCREENING_URL || ''
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

  const defaultApplications = []

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

  const getDaysSince = (value) => {
    if (!value) return 0
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return 0
    const diffMs = Date.now() - parsed.getTime()
    return diffMs / (1000 * 60 * 60 * 24)
  }

  const resolveApplicationStatus = (application) => {
    const explicitStatus = (application?.status || '').trim()
    if (explicitStatus) {
      return explicitStatus
    }

    const hasResults = Boolean(application?.preScreeningResults)
    if (hasResults) return 'Pending Verdict'

    const daysSince = getDaysSince(application?.createdAt)
    if (daysSince >= 3) return 'Inactive Applicant'
    return 'Pre-screening Sent'
  }

  const mapApplicationRecord = (item = {}) => {
    const preScreeningResults = item.pre_screening_results || item.preScreeningResults
    const createdAt = item.created_at || item.createdAt
    const application = {
      id: item.id,
      name: item.name || `${item.first_name || ''} ${item.last_name || ''}`.trim(),
      role: item.role || item.position_applied || item.job_title || item.position,
      score: typeof item.score === 'number' ? `${item.score}%` : item.score || '--',
      email: item.email,
      phone: item.phone,
      gender: item.gender,
      age: item.age,
      country: item.country,
      address: item.current_address || item.address,
      cvUrl: item.cv_url || item.cvUrl,
      preScreeningResults,
      aiAnalysis: item.ai_analysis || item.aiAnalysis,
      createdAt,
      stage: item.stage || 'Applied',
      status: item.status || '',
      aiRecommendation: item.ai_recommendation || item.aiRecommendation || '',
    }

    return {
      ...application,
      status: resolveApplicationStatus(application),
    }
  }

  const createApplicationNotification = (application) => {
    const now = new Date().toISOString()
    return {
      id: `application-${application.id || `${application.email || 'unknown'}-${Date.now()}`}`,
      title: `New application: ${application.role || 'Unknown Role'}`,
      description: `Candidate: ${application.name || 'Unknown applicant'}`,
      createdAt: now,
      applicationId: application.id,
      read: false,
      type: 'new-application',
    }
  }

  const formatRelativeTime = (value) => {
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return 'just now'

    const diffSeconds = Math.floor((Date.now() - parsed.getTime()) / 1000)
    if (diffSeconds < 60) return 'just now'
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`
    return `${Math.floor(diffSeconds / 86400)}d ago`
  }

  const processApplications = (applicationsPayload, { emitNotifications = false } = {}) => {
    if (!Array.isArray(applicationsPayload)) return

    const mappedApplications = applicationsPayload.map((item) => mapApplicationRecord(item))
    setApplications(mappedApplications)

    const currentIds = new Set(mappedApplications.map((item) => item.id).filter(Boolean))
    if (!hasLoadedApplicationsRef.current) {
      hasLoadedApplicationsRef.current = true
      knownApplicationIdsRef.current = currentIds
      return
    }

    if (!emitNotifications) {
      knownApplicationIdsRef.current = currentIds
      return
    }

    const newApplications = mappedApplications.filter(
      (item) => item.id && !knownApplicationIdsRef.current.has(item.id)
    )
    knownApplicationIdsRef.current = currentIds

    if (!newApplications.length) return

    setNotifications((prev) => [
      ...newApplications.map((item) => createApplicationNotification(item)),
      ...prev,
    ].slice(0, 50))

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      newApplications.forEach((item) => {
        const label = item.role || 'New role'
        const candidate = item.name || 'Unknown applicant'
        // Browser-level notification for quick visibility while user is on a different tab.
        new Notification(`New application: ${label}`, {
          body: `Candidate: ${candidate}`,
        })
      })
    }
  }

  const loadApplications = async ({ emitNotifications = false } = {}) => {
    let applicationsPayload = null

    if (apiBaseUrl) {
      try {
        const appsRes = await fetch(`${apiBaseUrl}/api/admin/applications`)
        if (appsRes.ok) {
          const contentType = appsRes.headers.get('content-type') || ''
          if (contentType.includes('application/json')) {
            const appsData = await appsRes.json()
            if (Array.isArray(appsData?.data)) {
              applicationsPayload = appsData.data
            }
          }
        }
      } catch (error) {
        console.error(error)
      }
    }

    if (!applicationsPayload) {
      const { data: supaApps, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && Array.isArray(supaApps)) {
        applicationsPayload = supaApps
      }
    }

    processApplications(applicationsPayload, { emitNotifications })
  }

  const buildReminderEmailHtml = (application) => {
    const applicantName = application?.name || 'Applicant'
    const roleName = application?.role || 'the role you applied for'
    const screeningLink = buildScreeningLink({
      screeningUrl,
      applicationId: application?.id,
      email: application?.email || '',
      applicantName,
    })
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Lifewood - Screening Invitation</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet"/>
</head>
<body style="margin: 0; padding: 0; background-color: #e8e5df; font-family: 'Manrope', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e8e5df; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%;">
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <a href="#" target="_blank" style="text-decoration: none;">
                <img
                  src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429"
                  alt="Lifewood"
                  height="38"
                  style="height: 38px; display: block;"
                />
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f0eada; border-radius: 18px; padding: 36px 44px 40px 44px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size: 20px; font-weight: 700; color: #1a1a1a; padding-bottom: 18px; font-family: 'Manrope', sans-serif;">
                    Hi, ${applicantName}!
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 14.5px; color: #2b2b2b; line-height: 1.75; padding-bottom: 14px; font-family: 'Manrope', sans-serif; text-align: justify;">
                    We noticed that you haven't completed your AI-powered screening interview for the <strong>${roleName}</strong> position at Lifewood yet. We understand you may have been busy — no worries!
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 14.5px; color: #2b2b2b; line-height: 1.75; padding-bottom: 28px; font-family: 'Manrope', sans-serif; text-align: justify;">
                    The interview only takes around 10 minutes and can be completed at your convenience. We'd love to keep your application moving forward, so please complete it at your earliest opportunity.
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 28px;">
                    <a
                      href="${screeningLink}"
                      target="_blank"
                      style="
                        display: inline-block;
                        text-decoration: none;
                        color: #ffffff;
                        background-color: #e6a020;
                        padding: 15px 52px;
                        border-radius: 50px;
                        font-size: 15px;
                        font-weight: 700;
                        font-family: 'Manrope', sans-serif;
                        letter-spacing: 0.2px;
                      "
                    >
                      Complete your screening here
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 14.5px; color: #2b2b2b; line-height: 1.75; padding-bottom: 14px; font-family: 'Manrope', sans-serif; text-align: justify;">
                    Please note that incomplete applications may not be considered for the next stage of the hiring process. We wouldn't want you to miss out!
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 14.5px; color: #2b2b2b; line-height: 1.75; padding-bottom: 22px; font-family: 'Manrope', sans-serif;">
                    If you have any questions or need assistance, feel free to reach out to us at <strong>hr.lifewood@gmail.com</strong>.
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 14.5px; color: #2b2b2b; line-height: 1.9; font-family: 'Manrope', sans-serif;">
                    Best Regards,<br />
                    HR Team | Lifewood
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top: 20px;">
              <table cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
                <tr>
                  <td style="font-size: 13px; color: #555555; font-family: 'Manrope', sans-serif; padding-right: 10px; vertical-align: middle;">
                    Follow us:
                  </td>
                  <td style="padding: 0 4px; vertical-align: middle;">
                    <a href="#" target="_blank" style="text-decoration: none;">
                      <img src="https://drive.google.com/uc?export=view&id=1WoSgaL_I6qmhoPYT9Npg6ecNXpzBdXXs" alt="Instagram" width="22" height="22" style="display: block; width: 22px; height: 22px;"/>
                    </a>
                  </td>
                  <td style="padding: 0 4px; vertical-align: middle;">
                    <a href="#" target="_blank" style="text-decoration: none;">
                      <img src="https://drive.google.com/uc?export=view&id=1RQhdSjLo0g9xKcB1T-TPLUznVXG7Qvp0" alt="Facebook" width="22" height="22" style="display: block; width: 22px; height: 22px;"/>
                    </a>
                  </td>
                  <td style="padding: 0 4px; vertical-align: middle;">
                    <a href="#" target="_blank" style="text-decoration: none;">
                      <img src="https://drive.google.com/uc?export=view&id=10w1aGHXdFxrQcOnewpAGteJBj44P2gm6" alt="YouTube" width="22" height="22" style="display: block; width: 22px; height: 22px;"/>
                    </a>
                  </td>
                  <td style="padding: 0 4px; vertical-align: middle;">
                    <a href="#" target="_blank" style="text-decoration: none;">
                      <img src="https://drive.google.com/uc?export=view&id=1hxyvFzkirnB6TcjFHA0dfc1KMkF8ZTNq" alt="LinkedIn" width="22" height="22" style="display: block; width: 22px; height: 22px;"/>
                    </a>
                  </td>
                </tr>
              </table>
              <p style="font-size: 11.5px; color: #888888; margin: 0; font-family: 'Manrope', sans-serif;">
                (c) 2026 Lifewood - All Rights Reserved
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }

  const maybeSendPreScreeningReminder = async (application) => {
    const emailTo = (application?.email || '').trim()
    if (!emailTo) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTo)) return
    if (!emailServiceId || !emailTemplateId || !emailPublicKey) return

    const hasResults = Boolean(application?.preScreeningResults)
    if (hasResults) return

    const daysSince = getDaysSince(application?.createdAt)
    if (daysSince < 2) return

    const reminderKey = `lw-pre-screening-reminder-${application?.id || emailTo}`
    if (localStorage.getItem(reminderKey)) return

    try {
      await emailjs.send(
        emailServiceId,
        emailTemplateId,
        {
          to_email: emailTo,
          toEmail: emailTo,
          user_email: emailTo,
          email: emailTo,
          applicant_name: application?.name || 'Applicant',
          position_name: application?.role || 'Applicant',
          subject: `Reminder: Complete Your AI Screening for the ${application?.role || 'role'} Role`,
          html_content: buildReminderEmailHtml(application),
        },
        emailPublicKey
      )
      localStorage.setItem(reminderKey, new Date().toISOString())
      if (application?.id) {
        await fetch(`${apiBaseUrl}/api/admin/applications/${application.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'Follow-up Email Sent',
          }),
        })
      }
      setApplications((prev) =>
        prev.map((item) =>
          item.id === application?.id
            ? { ...item, status: 'Follow-up Email Sent' }
            : item
        )
      )
    } catch (error) {
      console.error(error)
    }
  }

  const loadAdminData = async () => {
    try {
      const safeFetch = async (url) => {
        try {
          return await fetch(url)
        } catch (error) {
          console.error(error)
          return null
        }
      }

      const [listingsRes, bookingsRes, submissionsRes, profilesRes, logsRes] = await Promise.all([
        safeFetch(`${apiBaseUrl}/api/admin/listings`),
        safeFetch(`${apiBaseUrl}/api/admin/bookings`),
        safeFetch(`${apiBaseUrl}/api/admin/submissions`),
        safeFetch(`${apiBaseUrl}/api/admin/profiles`),
        safeFetch(`${apiBaseUrl}/api/admin/logs`),
      ])

      const safeJson = async (response) => {
        if (!response?.ok) return null
        const contentType = response.headers.get('content-type') || ''
        if (!contentType.includes('application/json')) return null
        return response.json()
      }

      const listingsData = await safeJson(listingsRes)
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

      await loadApplications({ emitNotifications: false })

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
    const intervalId = window.setInterval(() => {
      loadApplications({ emitNotifications: true }).catch((error) => {
        console.error(error)
      })
    }, 15000)

    return () => window.clearInterval(intervalId)
  }, [apiBaseUrl])

  useEffect(() => {
    if (isNotificationOpen) {
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
    }
  }, [isNotificationOpen])

  useEffect(() => {
    if (!applications?.length) return
    applications.forEach((application) => {
      maybeSendPreScreeningReminder(application)
    })
  }, [applications])

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

  const applicationRoleOptions = useMemo(
    () => Array.from(new Set(applications.map((item) => item.role).filter(Boolean))).sort(),
    [applications]
  )

  const applicationStatusOptions = useMemo(
    () => Array.from(new Set(applications.map((item) => item.status).filter(Boolean))).sort(),
    [applications]
  )

  const filteredApplications = useMemo(
    () =>
      applications.filter((item) => {
        const searchValue = listingSearch.trim().toLowerCase()
        const matchesSearch = !searchValue || [
          item.name,
          item.role,
          item.status,
          item.email,
          item.phone,
          item.country,
          item.address,
          item.score,
          item.stage,
        ]
          .filter(Boolean)
          .some((field) => field.toString().toLowerCase().includes(searchValue))
        const matchesRole = applicationRoleFilter ? item.role === applicationRoleFilter : true
        const matchesStatus = applicationStatusFilter ? item.status === applicationStatusFilter : true
        return matchesSearch && matchesRole && matchesStatus
      }),
    [applicationRoleFilter, applicationStatusFilter, applications, listingSearch]
  )

  const filteredMeetings = useMemo(() => {
    const searchValue = listingSearch.trim().toLowerCase()
    if (!searchValue) return meetings
    return meetings.filter((item) =>
      [item.event, item.invitee, item.time, item.status]
        .filter(Boolean)
        .some((field) => field.toString().toLowerCase().includes(searchValue))
    )
  }, [listingSearch, meetings])

  const filteredSubmissions = useMemo(() => {
    const searchValue = listingSearch.trim().toLowerCase()
    if (!searchValue) return submissions
    return submissions.filter((item) =>
      [item.company, item.project, item.industry, item.status]
        .filter(Boolean)
        .some((field) => field.toString().toLowerCase().includes(searchValue))
    )
  }, [listingSearch, submissions])

  const filteredProfiles = useMemo(() => {
    const searchValue = listingSearch.trim().toLowerCase()
    if (!searchValue) return profiles
    return profiles.filter((item) =>
      [item.name, item.role, item.status]
        .filter(Boolean)
        .some((field) => field.toString().toLowerCase().includes(searchValue))
    )
  }, [listingSearch, profiles])

  const filteredSystemLogs = useMemo(() => {
    const searchValue = listingSearch.trim().toLowerCase()
    if (!searchValue) return systemLogs
    return systemLogs.filter((item) =>
      [item.time, item.activity, item.user]
        .filter(Boolean)
        .some((field) => field.toString().toLowerCase().includes(searchValue))
    )
  }, [listingSearch, systemLogs])

  const unreadNotificationCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  )

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
    const escapedValue = stringValue.replace(/"/g, '""')
    if (/[",\n]/.test(escapedValue)) return `"${escapedValue}"`
    return escapedValue
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
      downloadCsv('job-applications.csv', filteredApplications.map((item) => ({
        Name: item.name,
        Role: item.role,
        Email: item.email,
        Phone: item.phone,
        Gender: item.gender,
        Age: item.age,
        Country: item.country,
        Address: item.address,
        Status: item.status,
        Stage: item.stage,
        Score: item.score,
        ResumeURL: item.cvUrl,
        AIAnalysis: item.aiAnalysis,
        PreScreeningResults: item.preScreeningResults,
        AppliedAt: item.createdAt ? new Date(item.createdAt).toISOString() : '',
      })))
      return
    }

    if (panel === 'bookings') {
      downloadCsv('bookings.csv', filteredMeetings.map((item) => ({
        Event: item.event,
        Invitee: item.invitee,
        Time: item.time,
        Status: item.status,
      })))
      return
    }

    if (panel === 'submissions') {
      downloadCsv('submissions.csv', filteredSubmissions.map((item) => ({
        Company: item.company,
        Project: item.project,
        Industry: item.industry,
        Status: item.status,
      })))
      return
    }

    if (panel === 'profiles') {
      downloadCsv('profiles.csv', filteredProfiles.map((item) => ({
        Name: item.name,
        Role: item.role,
        Status: item.status,
      })))
      return
    }

    if (panel === 'settings') {
      downloadCsv('system-logs.csv', filteredSystemLogs.map((item) => ({
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

  const clearApplicationFilters = () => {
    setApplicationRoleFilter('')
    setApplicationStatusFilter('')
  }

  const openApplicationModal = async (application) => {
    setSelectedApplication(application)
    setIsApplicationModalOpen(true)
    if (!application?.id || !apiBaseUrl) return

    setIsAnalyzingApplication(true)
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/applications/${application.id}/analyze`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analyze: true }),
      })
      if (!response.ok) return
      const payload = await response.json()
      const analyzed = payload?.data
      if (!analyzed) return

      const mapped = mapApplicationRecord({
        ...analyzed,
        aiRecommendation: payload.aiRecommendation,
        aiAnalysis: payload.combinedAnalysis || analyzed.ai_analysis,
      })

      setSelectedApplication(mapped)
      setApplications((prev) =>
        prev.map((item) => (item.id === mapped.id ? { ...item, ...mapped } : item))
      )
    } catch (error) {
      console.error(error)
    } finally {
      setIsAnalyzingApplication(false)
    }
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
          <button type="button" className="admin-btn admin-export-btn" onClick={() => handleExport('dashboard')}>
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
            {notifications.length ? notifications.slice(0, 5).map((item) => (
              <div key={item.id} className="admin-dashboard-alert">
                <span className="pulse" />
                <div>
                  <b>{item.title}</b>
                  <small>{item.description} {formatRelativeTime(item.createdAt)}</small>
                </div>
                <button
                  type="button"
                  className="admin-link"
                  onClick={() => {
                    setActivePanel('applications')
                    setIsNotificationOpen(false)
                    const application = applications.find((entry) => entry.id === item.applicationId)
                    if (application) openApplicationModal(application)
                  }}
                >
                  Review
                </button>
              </div>
            )) : (
              <div className="admin-dashboard-alert">
                <span className="pulse success" />
                <div>
                  <b>No new alerts</b>
                  <small>New applications and events will appear here automatically.</small>
                </div>
              </div>
            )}
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
      </section>
      <div className="admin-listing-controls applications-controls">
        <div className="admin-listing-filters">
          <select
            value={applicationRoleFilter}
            onChange={(event) => setApplicationRoleFilter(event.target.value)}
          >
            <option value="">All roles</option>
            {applicationRoleOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <select
            value={applicationStatusFilter}
            onChange={(event) => setApplicationStatusFilter(event.target.value)}
          >
            <option value="">All statuses</option>
            {applicationStatusOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <button type="button" className="admin-listing-clear" onClick={clearApplicationFilters}>
            Clear Filters
          </button>
        </div>
      </div>
      <div className="admin-listing-count">
        Showing {filteredApplications.length} of {applications.length} applications
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Role Applied</th>
              <th>Status</th>
              <th>Match</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((applicant) => (
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
                    <strong>{applicant.status}</strong>
                    <span>Status</span>
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
          <button type="button" className="admin-btn admin-export-btn" onClick={() => handleExport('bookings')}>Export CSV</button>
        </div>
      </section>
      <div className="admin-filter-row">
        <button type="button" className="admin-pill active">All Events</button>
        <button type="button" className="admin-pill">Recruiter</button>
        <button type="button" className="admin-pill">Client</button>
        <button type="button" className="admin-pill">Internal</button>
      </div>
      <section className="admin-card-grid">
        {filteredMeetings.map((meeting) => (
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
          <button type="button" className="admin-btn admin-export-btn" onClick={() => handleExport('submissions')}>
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
        {filteredSubmissions.map((submission) => (
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
        {filteredProfiles.map((profile) => (
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
            {filteredSystemLogs.map((log) => (
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
              <div className="admin-notification-wrap">
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label="Notifications"
                  onClick={() => {
                    setIsNotificationOpen((prev) => !prev)
                    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
                      Notification.requestPermission().catch(() => null)
                    }
                  }}
                >
                  <IconBell size={18} />
                  {unreadNotificationCount ? (
                    <span className="admin-badge">{Math.min(unreadNotificationCount, 99)}</span>
                  ) : null}
                </button>
                {isNotificationOpen ? (
                  <div className="admin-notification-dropdown">
                    <div className="admin-notification-head">
                      <strong>Notifications</strong>
                      <small>{notifications.length} total</small>
                    </div>
                    <div className="admin-notification-list">
                      {notifications.length ? notifications.slice(0, 8).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="admin-notification-item"
                          onClick={() => {
                            setActivePanel('applications')
                            setIsNotificationOpen(false)
                            const application = applications.find((entry) => entry.id === item.applicationId)
                            if (application) openApplicationModal(application)
                          }}
                        >
                          <b>{item.title}</b>
                          <span>{item.description}</span>
                          <small>{formatRelativeTime(item.createdAt)}</small>
                        </button>
                      )) : (
                        <p className="admin-notification-empty">No notifications yet.</p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
              <button type="button" className="admin-btn admin-export-btn" onClick={() => handleExport(activePanel)}>
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
                      window.location.assign(selectedApplication.cvUrl)
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
                <label>
                  AI Recommendation
                  <input type="text" value={selectedApplication?.aiRecommendation || (isAnalyzingApplication ? 'Analyzing...' : '--')} readOnly />
                </label>
              </div>
              </div>
              <div className="admin-application-scroll">
                <div className="admin-form-grid admin-application-grid">
                  <div className="full">
                    <span className="admin-editor-label">AI Analysis</span>
                    <div className="admin-rich-editor is-readonly admin-application-note">
                      {isAnalyzingApplication ? 'Analyzing CV and pre-screening results...' : (selectedApplication?.aiAnalysis || 'No AI analysis available yet.')}
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























