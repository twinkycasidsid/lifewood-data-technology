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
  IconChevronRight,
  IconLogout,
  IconMenu2,
  IconX,
  IconPlus,
  IconEye,
  IconTrash,
  IconChevronLeft,
  IconVideo,
} from '@tabler/icons-react'
import emailjs from '@emailjs/browser'
import { supabase } from '../lib/supabaseClient'
import { buildScreeningLink } from '../utils/screeningLink'

const sanitizeListingDescription = (value = '') => {
  const html = String(value || '').trim()
  if (!html || typeof window === 'undefined' || typeof DOMParser === 'undefined') return html

  const parser = new DOMParser()
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html')
  const root = doc.body.firstElementChild
  if (!root) return html

  root.querySelectorAll('*').forEach((node) => {
    node.removeAttribute('style')
    node.removeAttribute('class')
    node.removeAttribute('dir')
    if (node.tagName === 'FONT') {
      const fragment = doc.createDocumentFragment()
      while (node.firstChild) {
        fragment.appendChild(node.firstChild)
      }
      node.replaceWith(fragment)
    }
  })

  return root.innerHTML.trim()
}

const DashboardPage = ({ onNavigate = () => {} }) => {
  const [activePanel, setActivePanel] = useState('dashboard')
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isListingFormOpen, setIsListingFormOpen] = useState(false)
  const [isCreatingListing, setIsCreatingListing] = useState(false)
  const [isListingModalOpen, setIsListingModalOpen] = useState(false)
  const [isDeleteListingModalOpen, setIsDeleteListingModalOpen] = useState(false)
  const [isEditingListing, setIsEditingListing] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)
  const [listingActionError, setListingActionError] = useState('')
  const [listingActionSuccess, setListingActionSuccess] = useState('')
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [isDeleteApplicationModalOpen, setIsDeleteApplicationModalOpen] = useState(false)
  const [applicationPendingDelete, setApplicationPendingDelete] = useState(null)
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false)
  const [isRejectApplicationModalOpen, setIsRejectApplicationModalOpen] = useState(false)
  const [interviewForm, setInterviewForm] = useState({
    schedule: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Manila',
    location: '',
    meetingLink: '',
    emailMessage: '',
  })
  const [rejectForm, setRejectForm] = useState({
    emailMessage: '',
  })
  const [applicationActionError, setApplicationActionError] = useState('')
  const [applicationActionSuccess, setApplicationActionSuccess] = useState('')
  const [isSendingApplicationAction, setIsSendingApplicationAction] = useState(false)
  const [isAnalyzingApplication, setIsAnalyzingApplication] = useState(false)
  const [applicationAnalysisError, setApplicationAnalysisError] = useState('')
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [isDeleteSubmissionModalOpen, setIsDeleteSubmissionModalOpen] = useState(false)
  const [submissionPendingDelete, setSubmissionPendingDelete] = useState(null)
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [inquiryReplyDraft, setInquiryReplyDraft] = useState('')
  const [isSendingInquiryReply, setIsSendingInquiryReply] = useState(false)
  const [inquiryReplyError, setInquiryReplyError] = useState('')
  const [inquiryReplySuccess, setInquiryReplySuccess] = useState('')
  const [isDeleteInquiryModalOpen, setIsDeleteInquiryModalOpen] = useState(false)
  const [inquiryPendingDelete, setInquiryPendingDelete] = useState(null)
  const [bookingViewDate, setBookingViewDate] = useState(null)
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
  const [submissionIndustryFilter, setSubmissionIndustryFilter] = useState('')
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState('')
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('')
  const [applicationPage, setApplicationPage] = useState(1)
  const [submissionPage, setSubmissionPage] = useState(1)
  const [inquiryPage, setInquiryPage] = useState(1)
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
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID_PRESCREENING_FOLLOWUP || ''
  const inquiryReplyTemplateId =
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID_INQUIRY_REPLY ||
    'template_3u6xjwo'
  const emailPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
  const screeningUrl = import.meta.env.VITE_SCREENING_URL || ''
  const sidebarLogo = isSidebarCollapsed
    ? '/lifewood-logo-collapsed.png'
    : 'https://framerusercontent.com/images/Ca8ppNsvJIfTsWEuHr50gvkDow.png?scale-down-to=1024&width=2624&height=474'

  const normalizeInquiryStatus = (value = '', hasReply = false) => {
    const normalized = String(value || '').trim().toLowerCase()
    if (normalized === 'reply sent' || normalized === 'replied') return 'Reply Sent'
    if (normalized === 'pending' || normalized === 'new') return 'Pending'
    return hasReply ? 'Reply Sent' : 'Pending'
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
    { id: 'listings', label: 'Job Listings', icon: IconBriefcase },
    { id: 'applications', label: 'Job Applications', icon: IconUsers },
    { id: 'bookings', label: 'Calendly Bookings', icon: IconCalendarEvent },
    { id: 'submissions', label: 'Demo Requests', icon: IconMail },
    { id: 'inquiries', label: 'Inquiries', icon: IconMail },
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
  const [jobListings, setJobListings] = useState([])
  const [applications, setApplications] = useState([])
  const [meetings, setMeetings] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [profiles, setProfiles] = useState([])
  const [systemLogs, setSystemLogs] = useState([])

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
      name: item.name || `${item.first_name || ''} ${item.middle_name || ''} ${item.last_name || ''}`.replace(/\s+/g, ' ').trim(),
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

  const isPendingVerdictStatus = (value = '') => value.trim().toLowerCase() === 'pending verdict'

  const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

  const formatMultilineHtml = (value = '') => escapeHtml(value).replace(/\n/g, '<br />')

  const formatInterviewDateTime = (value, timezone) => {
    if (!value) return ''
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return ''
    const timeZone = timezone || 'Asia/Manila'
    try {
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone,
      }).format(parsed)
    } catch {
      return parsed.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    }
  }

  const toDatetimeLocalValue = (date) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return ''
    const pad = (value) => String(value).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  const buildEmailDetailRowsHtml = (rows = []) => rows
    .filter((row) => row?.value)
    .map((row) => `
      <tr>
        <td style="padding: 0 0 8px; font-size: 12px; font-weight: 700; color: #6f6556; text-transform: uppercase; letter-spacing: 0.05em; font-family: 'Manrope', sans-serif;">${escapeHtml(row.label || '')}</td>
      </tr>
      <tr>
        <td style="padding: 0 0 14px; font-size: 14px; line-height: 1.7; color: #2b2b2b; font-family: 'Manrope', sans-serif;">${formatMultilineHtml(row.value || '')}</td>
      </tr>
    `)
    .join('')

  const buildInquiryEmailContentHtml = ({
    intro,
    body,
    message,
    originalMessageTitle,
    originalMessage,
    closingText,
  }) => {
    const hasOriginalMessage = Boolean(originalMessage)

    return `
      <tr>
        <td style="font-size: 14.5px; color: #2b2b2b; line-height: 1.75; padding-bottom: 14px; font-family: 'Manrope', sans-serif; text-align: justify;">
          ${formatMultilineHtml(intro || '')}
        </td>
      </tr>
      <tr>
        <td style="font-size: 14.5px; color: #2b2b2b; line-height: 1.75; padding-bottom: 20px; font-family: 'Manrope', sans-serif; text-align: justify;">
          ${formatMultilineHtml(body || '')}
        </td>
      </tr>
      <tr>
        <td style="background-color: #ffffff; border-radius: 12px; padding: 16px; font-size: 13px; color: #2b2b2b; line-height: 1.6; font-family: 'Manrope', sans-serif; white-space: pre-line; border: 1px solid #eadfca; vertical-align: top;">
          ${formatMultilineHtml(message || '')}
        </td>
      </tr>
      ${hasOriginalMessage ? `
      <tr>
        <td style="padding-top: 22px; padding-bottom: 10px; font-size: 14px; font-weight: 700; color: #1a1a1a; font-family: 'Manrope', sans-serif;">
          ${escapeHtml(originalMessageTitle || 'Original Message')}
        </td>
      </tr>
      <tr>
        <td style="background-color: #e4e4e4; border-radius: 12px; padding: 16px; font-size: 13px; color: #2b2b2b; line-height: 1.6; font-family: 'Manrope', sans-serif; white-space: pre-line; border: 1px solid #eadfca; vertical-align: top;">
          ${formatMultilineHtml(originalMessage)}
        </td>
      </tr>
      ` : ''}
      <tr>
        <td style="font-size: 14.5px; color: #2b2b2b; line-height: 1.75; padding-top: 22px; padding-bottom: 22px; font-family: 'Manrope', sans-serif;">
          ${formatMultilineHtml(closingText || 'If you have any further questions, simply reply to this email and our team will be happy to assist.')}
        </td>
      </tr>
    `
  }

  const buildApplicantEmailContentHtml = ({
    message,
    ctaText,
    ctaUrl,
    detailsTitle,
    detailsRows,
    closingText,
  }) => {
    const detailsRowsHtml = buildEmailDetailRowsHtml(detailsRows)
    const hasDetails = Boolean(detailsRowsHtml)
    const hasCta = Boolean(ctaText && ctaUrl)

    return `
      <tr>
        <td style="background-color: #ffffff; border-radius: 12px; padding: 16px; font-size: 13px; color: #2b2b2b; line-height: 1.6; font-family: 'Manrope', sans-serif; white-space: pre-line; border: 1px solid #eadfca; vertical-align: top;">
          ${formatMultilineHtml(message || '')}
        </td>
      </tr>
      ${hasDetails ? `
      <tr>
        <td style="padding-top: 22px; padding-bottom: 10px; font-size: 14px; font-weight: 700; color: #1a1a1a; font-family: 'Manrope', sans-serif;">
          ${escapeHtml(detailsTitle || 'Details')}
        </td>
      </tr>
      <tr>
        <td style="background-color: #ffffff; border-radius: 12px; padding: 16px; border: 1px solid #eadfca;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${detailsRowsHtml}
          </table>
        </td>
      </tr>
      ` : ''}
      ${hasCta ? `
      <tr>
        <td align="center" style="padding-top: 22px;">
          <a
            href="${escapeHtml(ctaUrl)}"
            target="_blank"
            style="display: inline-block; text-decoration: none; color: #ffffff; background-color: #d19a37; padding: 14px 28px; border-radius: 999px; font-size: 14px; font-weight: 700; font-family: 'Manrope', sans-serif;"
          >
            ${escapeHtml(ctaText)}
          </a>
        </td>
      </tr>
      ` : ''}
      <tr>
        <td style="font-size: 14.5px; color: #2b2b2b; line-height: 1.75; padding-top: 22px; padding-bottom: 22px; font-family: 'Manrope', sans-serif;">
          ${formatMultilineHtml(closingText || 'If you have any further questions, simply reply to this email and our team will be happy to assist.')}
        </td>
      </tr>
    `
  }

  const buildUnifiedEmailHtml = ({
    subject,
    recipientName,
    emailContent,
    signoffName,
  }) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${escapeHtml(subject || 'Lifewood')}</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet"/>
</head>
<body style="margin: 0; padding: 0; background-color: #e8e5df; font-family: 'Manrope', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%;">
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <a href="https://lifewood.com/" target="_blank" style="text-decoration: none;">
                <img
                  src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429"
                  alt="Lifewood"
                  height="52"
                  style="height: 52px; display: block;"
                />
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f0eada; border-radius: 18px; padding: 36px 44px 40px 44px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size: 20px; font-weight: 700; color: #1a1a1a; padding-bottom: 18px; font-family: 'Manrope', sans-serif;">
                    Hi, ${escapeHtml(recipientName || 'there')}!
                  </td>
                </tr>
                ${emailContent}
                <tr>
                  <td style="font-size: 14.5px; color: #2b2b2b; line-height: 1.9; font-family: 'Manrope', sans-serif;">
                    Best Regards,<br />
                    ${formatMultilineHtml(signoffName || 'Lifewood Team')}
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
                    <a href="https://www.instagram.com/lifewood_official/?hl=af" target="_blank" style="text-decoration: none;">
                      <img src="https://drive.google.com/uc?export=view&id=1WoSgaL_I6qmhoPYT9Npg6ecNXpzBdXXs" alt="Instagram" width="22" height="22" style="display: block; width: 22px; height: 22px;"/>
                    </a>
                  </td>
                  <td style="padding: 0 4px; vertical-align: middle;">
                    <a href="https://www.facebook.com/LifewoodPH" target="_blank" style="text-decoration: none;">
                      <img src="https://drive.google.com/uc?export=view&id=1RQhdSjLo0g9xKcB1T-TPLUznVXG7Qvp0" alt="Facebook" width="22" height="22" style="display: block; width: 22px; height: 22px;"/>
                    </a>
                  </td>
                  <td style="padding: 0 4px; vertical-align: middle;">
                    <a href="https://www.youtube.com/@LifewoodDataTechnology" target="_blank" style="text-decoration: none;">
                      <img src="https://drive.google.com/uc?export=view&id=10w1aGHXdFxrQcOnewpAGteJBj44P2gm6" alt="YouTube" width="22" height="22" style="display: block; width: 22px; height: 22px;"/>
                    </a>
                  </td>
                  <td style="padding: 0 4px; vertical-align: middle;">
                    <a href="https://www.linkedin.com/company/lifewood-data-technology-ltd./" target="_blank" style="text-decoration: none;">
                      <img src="https://drive.google.com/uc?export=view&id=1hxyvFzkirnB6TcjFHA0dfc1KMkF8ZTNq" alt="LinkedIn" width="22" height="22" style="display: block; width: 22px; height: 22px;"/>
                    </a>
                  </td>
                </tr>
              </table>
              <p style="font-size: 11.5px; color: #888888; margin: 0; font-family: 'Manrope', sans-serif;">
                © 2026 Lifewood - All Rights Reserved
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

  const buildUnifiedEmailParams = ({
    toEmail,
    recipientName,
    subject,
    emailContent,
    message = '',
    signoffName = 'Lifewood Team',
    inquiryType = '',
  }) => {
    return {
      to_email: toEmail,
      toEmail: toEmail,
      user_email: toEmail,
      email: toEmail,
      to_name: recipientName,
      name: recipientName,
      full_name: recipientName,
      subject: subject,
      subject_content: subject,
      inquiry_type: inquiryType,
      message: message,
      reply_message: message,
      email_content: emailContent,
      signoff_name: signoffName,
      applicant_name: recipientName,
      html_content: buildUnifiedEmailHtml({
        subject,
        recipientName,
        emailContent,
        signoffName,
      }),
    }
  }

  const formatAiAnalysis = (application) => {
    if (isAnalyzingApplication) return 'Analyzing CV and pre-screening results...'

    const rawAnalysis = String(application?.aiAnalysis || '').trim()
    const role = application?.role || 'the role'
    const scoreValue = typeof application?.score === 'string'
      ? Number.parseInt(application.score, 10)
      : Number(application?.score)

    if (!rawAnalysis) return 'No AI analysis available yet.'

    const normalized = rawAnalysis.replace(/\s+/g, ' ').trim()
    if (/keyword alignment/i.test(normalized)) {
      const scoreText = Number.isFinite(scoreValue) ? `${scoreValue}%` : 'a low score'
      return `The applicant shows limited alignment with ${role}. The current match score of ${scoreText} reflects missing evidence for several role-critical requirements in the resume. Key capabilities expected for this role are not clearly demonstrated, including relevant domain experience, job-specific technical or operational skills, and stronger proof of responsibility at the level this position requires. This score points to a qualification gap rather than a formatting issue, so the application would be stronger with clearer experience, measurable achievements, and closer alignment to the job scope.`
    }

    return rawAnalysis
  }

  const parseAiAnalysisSections = (application) => {
    const rawAnalysis = formatAiAnalysis(application)
    if (!rawAnalysis || rawAnalysis === 'No AI analysis available yet.' || rawAnalysis === 'Analyzing CV and pre-screening results...') {
      return []
    }

    const lines = rawAnalysis
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    const topLevelHeaders = new Set([
      'CV Analysis',
      'Pre-Screening Analysis',
      'Final Evaluation',
    ])

    const subHeaders = new Set([
      'Overall Fit',
      'Key Strengths',
      'Gaps Identified',
      'Response Quality',
      'Behavioral Indicators',
      'Consistency',
      'Authenticity Check',
      'Concerns',
      'Insight',
      'Final Verdict',
    ])

    const sections = []
    let currentSection = null
    let currentSubSection = null
    let seenFinalEvaluation = false
    let seenFinalVerdict = false

    const pushSection = (title) => {
      currentSection = {
        title,
        blocks: [],
      }
      sections.push(currentSection)
      currentSubSection = null
    }

    const pushSubSection = (title) => {
      if (!currentSection) {
        pushSection('Analysis')
      }
      currentSubSection = {
        type: 'subsection',
        title,
        items: [],
      }
      currentSection.blocks.push(currentSubSection)
    }

    lines.forEach((line) => {
      if (line.startsWith('Match Score:')) {
        sections.push({ type: 'summary', label: 'Match Score', value: line.replace('Match Score:', '').trim() })
        return
      }

      if (line.startsWith('Recommendation:')) {
        sections.push({ type: 'summary', label: 'Recommendation', value: line.replace('Recommendation:', '').trim() })
        return
      }

      if (topLevelHeaders.has(line)) {
        if (line === 'Final Evaluation') {
          if (seenFinalEvaluation) return
          seenFinalEvaluation = true
        }
        pushSection(line)
        return
      }

      if (subHeaders.has(line)) {
        if (line === 'Final Verdict') {
          if (seenFinalVerdict) return
          seenFinalVerdict = true
        }
        pushSubSection(line)
        return
      }

      if (!currentSubSection) {
        pushSubSection('Summary')
      }

      currentSubSection.items.push(line)
    })

    return sections
  }

  const renderAiAnalysisContent = (application) => {
    const sections = parseAiAnalysisSections(application)
    const rawAnalysis = formatAiAnalysis(application)

    if (!sections.length) {
      return rawAnalysis
    }

    return (
      <div className="admin-ai-analysis">
        {sections.map((section, index) => {
          if (section.type === 'summary') return null

          return (
            <section key={`${section.title}-${index}`} className="admin-ai-section">
              <h4 className="admin-ai-section-title">{section.title}</h4>
              {section.blocks.map((block, blockIndex) => (
                <div key={`${block.title}-${blockIndex}`} className="admin-ai-block">
                  {block.title !== 'Summary' ? (
                    <div className="admin-ai-block-label">{block.title}</div>
                  ) : null}
                  {block.items.some((item) => item.startsWith('- ')) ? (
                    <ul className="admin-ai-list">
                      {block.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item.replace(/^- /, '').trim()}</li>
                      ))}
                    </ul>
                  ) : (
                    block.items.map((item, itemIndex) => (
                      <p key={itemIndex} className="admin-ai-paragraph">{item}</p>
                    ))
                  )}
                </div>
              ))}
            </section>
          )
        })}
      </div>
    )
  }

  const formatPreScreeningResults = (rawValue) => {
    if (!rawValue) return []

    try {
      const parsed = typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue
      const responses = Array.isArray(parsed?.responses) ? parsed.responses : []
      return responses.map((item, index) => ({
        id: item?.id || `response-${index}`,
        question: item?.question || item?.prompt || `Question ${index + 1}`,
        answer: item?.answer || 'No answer provided.',
      }))
    } catch (_error) {
      return [
        {
          id: 'raw-pre-screening',
          question: 'Pre-screening Results',
          answer: String(rawValue),
        },
      ]
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
      applicationsPayload = []
    }

    processApplications(applicationsPayload, { emitNotifications })

    setJobListings((prev) =>
      prev.map((listing) => {
        const applicantCount = applicationsPayload.filter((application) => {
          const applicationJobId = application?.job_id || application?.jobId || ''
          const applicationRole = application?.role || application?.position_applied || application?.positionApplied || ''
          return (
            (listing.id && applicationJobId && applicationJobId === listing.id) ||
            (listing.title && applicationRole && String(applicationRole).trim().toLowerCase() === String(listing.title).trim().toLowerCase())
          )
        }).length

        return {
          ...listing,
          applicants: applicantCount,
        }
      }),
    )
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
    if (!application?.id || !apiBaseUrl) return

    const hasResults = Boolean(application?.preScreeningResults)
    if (hasResults) return

    const daysSince = getDaysSince(application?.createdAt)
    if (daysSince < 2) return

    const reminderKey = `lw-pre-screening-reminder-${application?.id || emailTo}`
    if (localStorage.getItem(reminderKey)) return

    try {
      const existsResponse = await fetch(`${apiBaseUrl}/api/admin/applications/${application.id}`)
      if (!existsResponse.ok) {
        if (existsResponse.status === 404) {
          return
        }
        throw new Error(`Failed to verify application before reminder: ${existsResponse.status}`)
      }

      await emailjs.send(
        emailServiceId,
        emailTemplateId,
        {
          to_email: emailTo,
          toEmail: emailTo,
          user_email: emailTo,
          email: emailTo,
          subject_content: `Reminder: Complete Your AI Screening for ${application?.role || 'role'} role at Lifewood`,
          email_intro: `We noticed that you haven't completed your AI-powered screening interview for the ${application?.role || 'role'} position at Lifewood yet. We understand you may have been busy - no worries!`,
          email_body: "The interview only takes around 10 minutes and can be completed at your convenience. We'd love to keep your application moving forward, so please complete it at your earliest opportunity.",
          cta_text: 'Complete your screening here',
          email_footer: "Please note that incomplete applications may not be considered for the next stage of the hiring process. We wouldn't want you to miss out!",
          signoff_name: 'The Lifewood Team',
          screening_link: buildScreeningLink({
            screeningUrl,
            applicationId: application?.id,
            email: emailTo,
            applicantName: application?.name || 'Applicant',
          }),
          applicant_name: application?.name || 'Applicant',
          position_name: application?.role || 'Applicant',
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

      const [listingsRes, bookingsRes, submissionsRes, inquiriesRes, profilesRes, logsRes] = await Promise.all([
        safeFetch(`${apiBaseUrl}/api/admin/listings`),
        safeFetch(`${apiBaseUrl}/api/admin/bookings`),
        safeFetch(`${apiBaseUrl}/api/admin/submissions`),
        safeFetch(`${apiBaseUrl}/api/admin/inquiries`),
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
      const inquiriesData = await safeJson(inquiriesRes)
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
      } else {
        setJobListings([])
      }

      await loadApplications({ emitNotifications: false })

      if (Array.isArray(bookingsData?.data)) {
        setMeetings(
          bookingsData.data.map((item) => ({
            id: item.id || `${item.event}-${item.invitee}-${item.start_time}-${item.end_time}`,
            event: item.event,
            invitee: item.invitee,
            inviteeEmail: item.invitee_email || '',
            startTime: item.start_time || '',
            endTime: item.end_time || '',
            location: item.location || '',
            meetingUrl: item.meeting_url || '',
            time: item.start_time && item.end_time ? `${item.start_time} - ${item.end_time}` : item.start_time,
            status: item.status,
            createdAt: item.created_at || item.createdAt,
          }))
        )
      } else {
        setMeetings([])
      }

      if (Array.isArray(submissionsData?.data)) {
        setSubmissions(
          submissionsData.data.map((item) => ({
            id: item.id || `${item.company}-${item.project}-${item.created_at || item.createdAt || ""}`,
            company: item.company || 'Unknown',
            project: item.project || 'General inquiry',
            industry: item.industry || 'Unspecified',
            fullName: item.full_name || '',
            workEmail: item.work_email || '',
            companyWebsite: item.company_website || '',
            companySize: item.company_size || '',
            dataType: item.data_type || '',
            datasetSize: item.dataset_size || '',
            timeline: item.timeline || '',
            projectDescription: item.project_description || '',
            status: item.status || "New",
            createdAt: item.created_at || item.createdAt,
          }))
        )
      } else {
        setSubmissions([])
      }

      if (Array.isArray(inquiriesData?.data)) {
        setInquiries(
          inquiriesData.data.map((item) => ({
            id: item.id || `${item.email}-${item.created_at || item.createdAt || ""}`,
            fullName: item.full_name || 'Unknown',
            email: item.email || '',
            inquiryType: item.inquiry_type || 'General Inquiry',
            message: item.message || '',
            replyMessage: item.reply_message || '',
            repliedAt: item.replied_at || '',
            status: normalizeInquiryStatus(item.status, Boolean(item.reply_message || item.replied_at)),
            createdAt: item.created_at || item.createdAt,
          }))
        )
      } else {
        setInquiries([])
      }

      if (Array.isArray(profilesData?.data)) {
        setProfiles(
          profilesData.data.map((item) => ({
            name: item.name,
            role: item.role,
            status: item.status,
          }))
        )
      } else {
        setProfiles([])
      }

      if (Array.isArray(logsData?.data)) {
        setSystemLogs(
          logsData.data.map((item) => ({
            time: item.time,
            activity: item.activity,
            user: item.actor,
          }))
        )
      } else {
        setSystemLogs([])
      }
    } catch (error) {
      console.error(error)
      setJobListings([])
      setMeetings([])
      setSubmissions([])
      setInquiries([])
      setProfiles([])
      setSystemLogs([])
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
    if (bookingViewDate || !meetings.length) return
    const firstMeetingWithDate = meetings.find((item) => item.startTime)
    if (!firstMeetingWithDate?.startTime) return
    const parsed = new Date(firstMeetingWithDate.startTime)
    if (Number.isNaN(parsed.getTime())) return
    setBookingViewDate(parsed)
  }, [bookingViewDate, meetings])

  useEffect(() => {
    if (!isListingModalOpen) return
    if (editEditorRef.current) {
      editEditorRef.current.innerHTML = editForm.description || selectedListing?.description || ''
    }
  }, [isListingModalOpen, editForm.description, selectedListing])

  useEffect(() => {
    if (isListingFormOpen || isListingModalOpen || isDeleteListingModalOpen) return
    const timeoutId = window.setTimeout(() => {
      setListingActionError('')
      setListingActionSuccess('')
    }, 2500)
    return () => window.clearTimeout(timeoutId)
  }, [isDeleteListingModalOpen, isListingFormOpen, isListingModalOpen, listingActionError, listingActionSuccess])

  const applicationTrend = useMemo(() => {
    const days = []
    const today = new Date()
    for (let offset = 6; offset >= 0; offset -= 1) {
      const day = new Date(today)
      day.setHours(0, 0, 0, 0)
      day.setDate(today.getDate() - offset)
      const label = day.toLocaleDateString('en-US', { weekday: 'short' })
      const value = applications.filter((item) => {
        if (!item.createdAt) return false
        const created = new Date(item.createdAt)
        return created.toDateString() === day.toDateString()
      }).length
      days.push({ label, value })
    }
    return days
  }, [applications])

  const maxApplications = useMemo(
    () => Math.max(1, ...applicationTrend.map((item) => item.value)),
    [applicationTrend]
  )

  const applicationTrendChart = useMemo(() => {
    const width = 440
    const height = 260
    const paddingLeft = 26
    const paddingRight = 20
    const paddingTop = 20
    const paddingBottom = 40
    const innerWidth = width - paddingLeft - paddingRight
    const innerHeight = height - paddingTop - paddingBottom
    const stepX = applicationTrend.length > 1 ? innerWidth / (applicationTrend.length - 1) : innerWidth

    const points = applicationTrend.map((item, index) => {
      const x = paddingLeft + stepX * index
      const y = paddingTop + innerHeight - ((item.value / maxApplications) * innerHeight)
      return { ...item, x, y }
    })

    return {
      width,
      height,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
      points,
      chartBottomY: paddingTop + innerHeight,
      polylinePoints: points.map((point) => `${point.x},${point.y}`).join(' '),
    }
  }, [applicationTrend, maxApplications])

  const inquiryMix = useMemo(() => {
    const counts = new Map()
    inquiries.forEach((item) => {
      const label = item.inquiryType || 'General Inquiry'
      counts.set(label, (counts.get(label) || 0) + 1)
    })
    return Array.from(counts.entries())
      .map(([label, value]) => ({ label, value, delta: `${value} inquiries` }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [inquiries])

  const inquiryDistribution = useMemo(() => {
    const total = inquiryMix.reduce((sum, item) => sum + item.value, 0)
    const palette = ['#1b7b47', '#459b6d', '#f0c15a', '#f4d594', '#e39a2d']
    const radius = 70
    const circumference = 2 * Math.PI * radius
    let currentOffset = 0
    const segments = inquiryMix.map((item, index) => {
      const portion = total ? (item.value / total) : 0
      const strokeLength = portion * circumference
      const dashArray = `${strokeLength} ${Math.max(circumference - strokeLength, 0)}`
      const dashOffset = -currentOffset
      currentOffset += strokeLength
      return {
        ...item,
        color: palette[index % palette.length],
        percentage: total ? Math.round(portion * 100) : 0,
        dashArray,
        dashOffset,
      }
    })

    return { total, segments, radius, circumference }
  }, [inquiryMix])

  const recentApplicants = useMemo(
    () =>
      [...applications]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5),
    [applications],
  )

  const overviewStats = useMemo(() => {
    const activeListings = jobListings.filter((item) => (item.status || '').toLowerCase() === 'active').length
    const totalApplications = applications.length
    const upcomingMeetings = meetings.length
    return [
      { label: 'Active Listings', value: String(activeListings) },
      { label: 'Total Applications', value: String(totalApplications) },
      { label: 'Upcoming Meetings', value: String(upcomingMeetings) },
      { label: 'Total Inquiries', value: String(inquiries.length) },
    ]
  }, [applications, inquiries, jobListings, meetings])

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

  const submissionIndustryOptions = useMemo(
    () => Array.from(new Set(submissions.map((item) => item.industry).filter(Boolean))).sort(),
    [submissions]
  )

  const inquiryTypeOptions = useMemo(
    () => Array.from(new Set(inquiries.map((item) => item.inquiryType).filter(Boolean))).sort(),
    [inquiries]
  )

  const inquiryStatusOptions = useMemo(
    () => ['Pending', 'Reply Sent'],
    []
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
    return submissions.filter((item) => {
      const matchesSearch = !searchValue || [item.company, item.project, item.industry, item.status]
        .filter(Boolean)
        .some((field) => field.toString().toLowerCase().includes(searchValue))
      const matchesIndustry = submissionIndustryFilter ? item.industry === submissionIndustryFilter : true
      return matchesSearch && matchesIndustry
    })
  }, [listingSearch, submissionIndustryFilter, submissions])

  const filteredInquiries = useMemo(() => {
    const searchValue = listingSearch.trim().toLowerCase()
    return inquiries.filter((item) => {
      const matchesSearch = !searchValue || [item.fullName, item.email, item.inquiryType, item.message, item.status]
        .filter(Boolean)
        .some((field) => field.toString().toLowerCase().includes(searchValue))
      const matchesType = inquiryTypeFilter ? item.inquiryType === inquiryTypeFilter : true
      const matchesStatus = inquiryStatusFilter ? item.status === inquiryStatusFilter : true
      return matchesSearch && matchesType && matchesStatus
    })
  }, [inquiries, inquiryStatusFilter, inquiryTypeFilter, listingSearch])

  const filteredProfiles = useMemo(() => {
    const searchValue = listingSearch.trim().toLowerCase()
    if (!searchValue) return profiles
    return profiles.filter((item) =>
      [item.name, item.role, item.status]
        .filter(Boolean)
        .some((field) => field.toString().toLowerCase().includes(searchValue))
      )
  }, [listingSearch, profiles])

  const recordsPerPage = 10

  const pagedApplications = useMemo(
    () => filteredApplications.slice((applicationPage - 1) * recordsPerPage, applicationPage * recordsPerPage),
    [applicationPage, filteredApplications]
  )

  const pagedSubmissions = useMemo(
    () => filteredSubmissions.slice((submissionPage - 1) * recordsPerPage, submissionPage * recordsPerPage),
    [filteredSubmissions, submissionPage]
  )

  const pagedInquiries = useMemo(
    () => filteredInquiries.slice((inquiryPage - 1) * recordsPerPage, inquiryPage * recordsPerPage),
    [filteredInquiries, inquiryPage]
  )

  const applicationPageCount = Math.max(1, Math.ceil(filteredApplications.length / recordsPerPage))
  const submissionPageCount = Math.max(1, Math.ceil(filteredSubmissions.length / recordsPerPage))
  const inquiryPageCount = Math.max(1, Math.ceil(filteredInquiries.length / recordsPerPage))

  useEffect(() => {
    setApplicationPage(1)
  }, [applicationRoleFilter, applicationStatusFilter, listingSearch])

  useEffect(() => {
    setSubmissionPage(1)
  }, [listingSearch, submissionIndustryFilter])

  useEffect(() => {
    setInquiryPage(1)
  }, [inquiryStatusFilter, inquiryTypeFilter, listingSearch])

  const renderPagination = (page, pageCount, onChange) => {
    if (pageCount <= 1) return null
    return (
      <div className="admin-pagination">
        <button type="button" className="admin-pagination-arrow" onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page">
          <IconChevronLeft size={16} />
        </button>
        <span>Page {page} of {pageCount}</span>
        <button type="button" className="admin-pagination-arrow" onClick={() => onChange(page + 1)} disabled={page === pageCount} aria-label="Next page">
          <IconChevronRight size={16} />
        </button>
      </div>
    )
  }

  const normalizeLookupValue = (value = '') =>
    String(value)
      .toLowerCase()
      .replace(/https?:\/\//g, '')
      .replace(/www\./g, '')
      .replace(/[^a-z0-9]/g, '')

  const findSubmissionForBooking = (booking) => {
    const bookingEmail = normalizeLookupValue(booking?.inviteeEmail)
    if (bookingEmail) {
      const emailMatch = submissions.find((submission) => (
        normalizeLookupValue(submission.workEmail) === bookingEmail
      ))
      if (emailMatch) return emailMatch
    }

    const candidates = [
      booking?.invitee,
      booking?.event,
      booking?.location,
    ]
      .filter(Boolean)
      .map((item) => normalizeLookupValue(item))
      .filter(Boolean)

    if (!candidates.length) return null

    return submissions.find((submission) => {
      const submissionValues = [
        submission.company,
        submission.fullName,
        submission.workEmail,
        submission.companyWebsite,
      ]
        .filter(Boolean)
        .map((item) => normalizeLookupValue(item))
        .filter(Boolean)

      return candidates.some((candidate) =>
        submissionValues.some((value) => value.includes(candidate) || candidate.includes(value))
      )
    }) || null
  }

  const resolveBookingLink = (booking) => {
    const directLink = String(booking?.meetingUrl || '').trim()
    if (/^https?:\/\//i.test(directLink)) return directLink
    const locationLink = String(booking?.location || '').trim()
    if (/^https?:\/\//i.test(locationLink)) return locationLink
    return ''
  }

  const bookingCalendarData = useMemo(() => {
    const parsedMeetings = filteredMeetings
      .map((item, index) => {
        const parsedStart = item.startTime ? new Date(item.startTime) : null
        const parsedEnd = item.endTime ? new Date(item.endTime) : null
        const hasValidStart = parsedStart && !Number.isNaN(parsedStart.getTime())
        const hasValidEnd = parsedEnd && !Number.isNaN(parsedEnd.getTime())
        const safeEnd = hasValidEnd
          ? parsedEnd
          : hasValidStart
            ? new Date(parsedStart.getTime() + 60 * 60 * 1000)
            : null
        const palette = ['cyan', 'green', 'indigo', 'amber', 'violet']
        return {
          ...item,
          parsedStart: hasValidStart ? parsedStart : null,
          parsedEnd: safeEnd && !Number.isNaN(safeEnd.getTime()) ? safeEnd : null,
          colorClass: palette[index % palette.length],
          relatedSubmission: findSubmissionForBooking(item),
        }
      })
      .filter((item) => item.parsedStart)
      .sort((a, b) => a.parsedStart - b.parsedStart)

    const now = new Date()
    const anchorDate = bookingViewDate ? new Date(bookingViewDate) : (parsedMeetings[0]?.parsedStart || now)
    const weekStart = new Date(anchorDate)
    const day = weekStart.getDay()
    const diffToMonday = day === 0 ? -6 : 1 - day
    weekStart.setHours(0, 0, 0, 0)
    weekStart.setDate(weekStart.getDate() + diffToMonday)

    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + index)
      return date
    })

    const meetingsForWeek = parsedMeetings.filter((meeting) => {
      const meetingDate = new Date(meeting.parsedStart)
      meetingDate.setHours(0, 0, 0, 0)
      return days.some((dayItem) => dayItem.getTime() === meetingDate.getTime())
    })

    const earliestHour = meetingsForWeek.length
      ? Math.min(...meetingsForWeek.map((item) => item.parsedStart.getHours()))
      : 8
    const latestHour = meetingsForWeek.length
      ? Math.max(...meetingsForWeek.map((item) => item.parsedEnd.getHours() + (item.parsedEnd.getMinutes() > 0 ? 1 : 0)))
      : 18
    const startHour = Math.max(6, earliestHour - 1)
    const endHour = Math.min(22, Math.max(startHour + 8, latestHour + 1))
    const hourSlots = Array.from({ length: endHour - startHour + 1 }, (_, index) => startHour + index)

    const dayColumns = days.map((dayItem) => {
      const meetings = meetingsForWeek.filter((meeting) => {
        const start = meeting.parsedStart
        return (
          start.getFullYear() === dayItem.getFullYear() &&
          start.getMonth() === dayItem.getMonth() &&
          start.getDate() === dayItem.getDate()
        )
      })

      const positionedMeetings = meetings.map((meeting) => {
        const start = meeting.parsedStart
        const end = meeting.parsedEnd || new Date(start.getTime() + 60 * 60 * 1000)
        const startMinutes = (start.getHours() - startHour) * 60 + start.getMinutes()
        const durationMinutes = Math.max(45, Math.round((end - start) / 60000))
        const pixelsPerMinute = 82 / 60
        return {
          ...meeting,
          top: `${Math.max(0, startMinutes) * pixelsPerMinute}px`,
          height: `${Math.max(68, durationMinutes * pixelsPerMinute)}px`,
          timeLabel: `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`,
          displayTitle: meeting.relatedSubmission?.company || meeting.invitee || meeting.event || 'Booking',
          resolvedMeetingLink: resolveBookingLink(meeting),
        }
      })

      return {
        date: dayItem,
        meetings: positionedMeetings,
      }
    })

    const upcomingMeeting = parsedMeetings.find((meeting) => meeting.parsedStart >= now) || parsedMeetings[0] || null
    const monthlyDays = []
    const monthStart = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1)
    const monthEnd = new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 0)
    const monthGridStart = new Date(monthStart)
    const monthGridOffset = monthGridStart.getDay() === 0 ? -6 : 1 - monthGridStart.getDay()
    monthGridStart.setDate(monthStart.getDate() + monthGridOffset)
    monthGridStart.setHours(0, 0, 0, 0)

    for (let index = 0; index < 35; index += 1) {
      const date = new Date(monthGridStart)
      date.setDate(monthGridStart.getDate() + index)
      monthlyDays.push({
        key: date.toISOString(),
        label: date.getDate(),
        isCurrentMonth: date.getMonth() === anchorDate.getMonth(),
        isToday: date.toDateString() === now.toDateString(),
        isActiveWeek: days.some((dayItem) => dayItem.toDateString() === date.toDateString()),
        hasMeeting: parsedMeetings.some((meeting) => meeting.parsedStart.toDateString() === date.toDateString()),
      })
      if (date >= monthEnd && index >= 27) break
    }

    const statusBreakdown = ['Scheduled', 'Confirmed', 'Completed', 'Pending', 'Canceled'].map((label) => ({
      label,
      value: parsedMeetings.filter((meeting) => (meeting.status || '').toLowerCase() === label.toLowerCase()).length,
    }))

    return {
      anchorDate,
      hourSlots,
      dayColumns,
      upcomingMeeting,
      monthlyDays,
      statusBreakdown,
      totalMeetings: parsedMeetings.length,
    }
  }, [bookingViewDate, filteredMeetings, submissions])

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

  const currentAdmin = useMemo(() => {
    const storedUser =
      localStorage.getItem('lwAuthUser') ||
      sessionStorage.getItem('lwAuthUser') ||
      ''
    const storedRole =
      localStorage.getItem('lwAuthRole') ||
      sessionStorage.getItem('lwAuthRole') ||
      'Admin'

    let parsedUser = {}
    try {
      parsedUser = storedUser ? JSON.parse(storedUser) : {}
    } catch (_error) {
      parsedUser = {}
    }

    const name =
      parsedUser?.name ||
      parsedUser?.full_name ||
      parsedUser?.fullName ||
      parsedUser?.email ||
      'Current Admin'

    const email = parsedUser?.email || ''
    const role = parsedUser?.role || storedRole || 'Admin'
    const initials = String(name)
      .split(' ')
      .map((part) => part[0] || '')
      .join('')
      .slice(0, 2)
      .toUpperCase()

    return { name, email, role, initials }
  }, [])

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

  const clearSubmissionFilters = () => {
    setSubmissionIndustryFilter('')
  }

  const clearInquiryFilters = () => {
    setInquiryTypeFilter('')
    setInquiryStatusFilter('')
  }

  const openSubmissionModal = (submission) => {
    setSelectedSubmission(submission)
    setIsSubmissionModalOpen(true)
  }

  const openBookingModal = (booking) => {
    setSelectedBooking(booking)
    setIsBookingModalOpen(true)
  }

  const openRelatedSubmissionFromBooking = (booking) => {
    const relatedSubmission = booking?.relatedSubmission
    if (!relatedSubmission) return
    setIsBookingModalOpen(false)
    setSelectedBooking(null)
    setSelectedSubmission(relatedSubmission)
    setIsSubmissionModalOpen(true)
  }

  const requestDeleteSubmission = (submission) => {
    setSubmissionPendingDelete(submission)
    setIsDeleteSubmissionModalOpen(true)
  }

  const stripHtml = (value = '') => value.replace(/<[^>]+>/g, '').trim()

  const formatDateShort = (value) => {
    if (!value) return 'Unknown'
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return 'Unknown'
    return parsed.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })
  }

  const formatDateTime = (value) => {
    if (!value) return '--'
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return '--'
    return parsed.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const escapeCsvValue = (value) => {
    if (value === null || value === undefined) return ''
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
    const escapedValue = stringValue.replace(/"/g, '""')
    if (/[",\n]/.test(escapedValue)) return `"${escapedValue}"`
    return escapedValue
  }

  const openInquiryModal = (inquiry) => {
    setSelectedInquiry(inquiry)
    setInquiryReplyError('')
    setInquiryReplySuccess('')
    setInquiryReplyDraft(
      inquiry?.replyMessage ||
      `Hi ${inquiry?.fullName || 'there'},\n\nThanks for reaching out to Lifewood regarding "${inquiry?.inquiryType || 'your inquiry'}".\n\n`
    )
    setIsInquiryModalOpen(true)
  }

  const handleSendInquiryReply = async () => {
    const emailTo = (selectedInquiry?.email || '').trim()
    const replyBody = inquiryReplyDraft.trim()

    if (!selectedInquiry?.id) {
      setInquiryReplyError('Inquiry details are unavailable.')
      return
    }
    if (!emailTo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTo)) {
      setInquiryReplyError('A valid inquiry email is required.')
      return
    }
    if (replyBody.length < 10) {
      setInquiryReplyError('Reply message is too short.')
      return
    }
    if (!emailServiceId || !inquiryReplyTemplateId || !emailPublicKey) {
      setInquiryReplyError('EmailJS is not configured for replies.')
      return
    }

    setIsSendingInquiryReply(true)
    setInquiryReplyError('')
    setInquiryReplySuccess('')

    try {
      await emailjs.send(
        emailServiceId,
        inquiryReplyTemplateId,
        buildUnifiedEmailParams({
          toEmail: emailTo,
          recipientName: selectedInquiry?.fullName || 'Contact',
          subject: `Reply to Your ${selectedInquiry?.inquiryType || 'Lifewood Inquiry'}`,
          message: replyBody,
          emailContent: buildInquiryEmailContentHtml({
            intro: `Thank you for reaching out to Lifewood regarding ${selectedInquiry?.inquiryType || 'your inquiry'}.`,
            body: 'Our team has reviewed your message, and here is our response:',
            message: replyBody,
            originalMessageTitle: 'Your Original Message',
            originalMessage: selectedInquiry?.message || '',
            closingText: 'If you have any further questions, simply reply to this email and our team will be happy to assist.',
          }),
          signoffName: 'Lifewood Team',
          inquiryType: selectedInquiry?.inquiryType || 'Inquiry',
        }),
        emailPublicKey
      )

      try {
        const statusResponse = await fetch(`${apiBaseUrl}/api/admin/inquiries/${selectedInquiry.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'Reply Sent',
            reply_message: replyBody,
          }),
        })
        if (!statusResponse.ok) {
          console.warn('Failed to persist inquiry reply status.', statusResponse.status)
        }
      } catch (statusError) {
        console.warn('Failed to persist inquiry reply status.', statusError)
      }

      setInquiries((prev) =>
        prev.map((item) =>
          item.id === selectedInquiry.id
            ? { ...item, status: 'Reply Sent', replyMessage: replyBody, repliedAt: new Date().toISOString() }
            : item
        )
      )
      setSelectedInquiry((prev) => (
        prev
          ? { ...prev, status: 'Reply Sent', replyMessage: replyBody, repliedAt: new Date().toISOString() }
          : prev
      ))
      setInquiryReplyDraft(replyBody)
      setInquiryReplySuccess('Reply has been sent.')
    } catch (error) {
      console.error(error)
      setInquiryReplyError('Failed to send reply.')
    } finally {
      setIsSendingInquiryReply(false)
    }
  }

  const handleDeleteInquiry = async (inquiryId) => {
    if (!inquiryId || !apiBaseUrl) return
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/inquiries/${inquiryId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`Failed to delete inquiry: ${response.status}`)
      }
      setInquiries((prev) => prev.filter((item) => item.id !== inquiryId))
      setSelectedInquiry((prev) => (prev?.id === inquiryId ? null : prev))
      setIsInquiryModalOpen((prev) => (selectedInquiry?.id === inquiryId ? false : prev))
      setIsDeleteInquiryModalOpen(false)
      setInquiryPendingDelete(null)
    } catch (error) {
      console.error(error)
      setInquiryReplyError('Failed to delete inquiry.')
    }
  }

  const handleDeleteSubmission = async (submissionId) => {
    if (!submissionId || !apiBaseUrl) return
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/submissions/${submissionId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`Failed to delete submission: ${response.status}`)
      }
      setSubmissions((prev) => prev.filter((item) => item.id !== submissionId))
      setSelectedSubmission((prev) => (prev?.id === submissionId ? null : prev))
      setIsSubmissionModalOpen((prev) => (selectedSubmission?.id === submissionId ? false : prev))
      setIsDeleteSubmissionModalOpen(false)
      setSubmissionPendingDelete(null)
    } catch (error) {
      console.error(error)
    }
  }

  const requestDeleteInquiry = (inquiry) => {
    setInquiryPendingDelete(inquiry)
    setIsDeleteInquiryModalOpen(true)
  }

  const resetApplicationActionState = () => {
    setApplicationActionError('')
    setApplicationActionSuccess('')
    setIsSendingApplicationAction(false)
  }

  const updateApplicationState = (applicationId, nextFields) => {
    const updatedAt = new Date().toISOString()
    setApplications((prev) => prev.map((item) => (
      item.id === applicationId
        ? { ...item, ...nextFields, updatedAt }
        : item
    )))
    setSelectedApplication((prev) => (
      prev?.id === applicationId
        ? { ...prev, ...nextFields, updatedAt }
        : prev
    ))
  }

  const persistApplicationStatus = async (applicationId, nextFields) => {
    const response = await fetch(`${apiBaseUrl}/api/admin/applications/${applicationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nextFields),
    })

    if (!response.ok) {
      throw new Error('Failed to update applicant status.')
    }

    return response.json().catch(() => null)
  }

  const openInterviewModal = (application) => {
    if (!application?.id) return
    resetApplicationActionState()
    const defaultSchedule = new Date(Date.now() + (48 * 60 * 60 * 1000))
    defaultSchedule.setMinutes(0, 0, 0)
    setInterviewForm({
      schedule: toDatetimeLocalValue(defaultSchedule),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Manila',
      location: 'Google Meet',
      meetingLink: '',
      emailMessage: `We are pleased to invite you to the final interview stage for the ${application?.role || 'role'} position at Lifewood.\n\nPlease review the interview details below and confirm your availability by replying to this email.`,
    })
    setIsInterviewModalOpen(true)
  }

  const openRejectApplicationModal = () => {
    if (!selectedApplication?.id) return
    resetApplicationActionState()
    setRejectForm({
      emailMessage: `Thank you for your interest in Lifewood and for taking the time to apply for the ${selectedApplication?.role || 'role'} position.\n\nAfter careful review of your application and assessment results, we will not be moving forward with your application for this role at this time.\n\nWe appreciate the effort you invested in the process and encourage you to apply again for future opportunities that match your experience.`,
    })
    setIsRejectApplicationModalOpen(true)
  }

  const closeRejectApplicationModal = () => {
    if (isSendingApplicationAction) return
    setIsRejectApplicationModalOpen(false)
  }

  const closeInterviewModal = () => {
    if (isSendingApplicationAction) return
    setIsInterviewModalOpen(false)
    setInterviewForm({
      schedule: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Manila',
      location: '',
      meetingLink: '',
      emailMessage: '',
    })
  }

  const handleInterviewFieldChange = (field, value) => {
    setInterviewForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleRejectFieldChange = (field, value) => {
    setRejectForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleScheduleInterview = async () => {
    const application = selectedApplication
    const emailTo = (application?.email || '').trim()
    const scheduleLabel = formatInterviewDateTime(interviewForm.schedule, interviewForm.timezone)
    const messageBody = interviewForm.emailMessage.trim()

    if (!application?.id) {
      setApplicationActionError('Application details are unavailable.')
      return
    }
    if (!emailTo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTo)) {
      setApplicationActionError('A valid applicant email is required.')
      return
    }
    if (!interviewForm.schedule || !scheduleLabel) {
      setApplicationActionError('Set a valid interview schedule.')
      return
    }
    if (messageBody.length < 20) {
      setApplicationActionError('Interview email message is too short.')
      return
    }
    if (!emailServiceId || !inquiryReplyTemplateId || !emailPublicKey) {
      setApplicationActionError('EmailJS is not configured for applicant notifications.')
      return
    }

    setIsSendingApplicationAction(true)
    setApplicationActionError('')
    setApplicationActionSuccess('')

    const detailsRows = [
      { label: 'Position', value: application?.role || 'Lifewood Role' },
      { label: 'Interview Schedule', value: `${scheduleLabel}${interviewForm.timezone ? ` (${interviewForm.timezone})` : ''}` },
      { label: 'Location', value: interviewForm.location.trim() || 'To be shared by Lifewood' },
      { label: 'Meeting Link', value: interviewForm.meetingLink.trim() || '' },
    ]

    try {
      await emailjs.send(
        emailServiceId,
        inquiryReplyTemplateId,
        buildUnifiedEmailParams({
          toEmail: emailTo,
          recipientName: application?.name || 'Applicant',
          subject: `Final Interview Invitation for ${application?.role || 'Lifewood Role'}`,
          message: messageBody,
          emailContent: buildApplicantEmailContentHtml({
            message: messageBody,
            ctaText: interviewForm.meetingLink.trim() ? 'Open Interview Link' : '',
            ctaUrl: interviewForm.meetingLink.trim(),
            detailsTitle: 'Interview Details',
            detailsRows,
            closingText: 'If you need to request a different schedule, reply to this email and our team will assist you.',
          }),
          signoffName: 'HR Team | Lifewood',
        }),
        emailPublicKey
      )

      await persistApplicationStatus(application.id, {
        status: 'Final Interview Scheduled',
        stage: 'Final Interview',
      })
      updateApplicationState(application.id, {
        status: 'Final Interview Scheduled',
        stage: 'Final Interview',
      })
      setApplicationActionSuccess('Final interview invitation sent.')
      setIsInterviewModalOpen(false)
    } catch (error) {
      console.error(error)
      setApplicationActionError('Failed to send the interview invitation.')
    } finally {
      setIsSendingApplicationAction(false)
    }
  }

  const handleRejectApplicant = async () => {
    const application = selectedApplication
    const emailTo = (application?.email || '').trim()
    const rejectionMessage = rejectForm.emailMessage.trim()

    if (!application?.id) {
      setApplicationActionError('Application details are unavailable.')
      return
    }
    if (!emailTo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTo)) {
      setApplicationActionError('A valid applicant email is required.')
      return
    }
    if (!emailServiceId || !inquiryReplyTemplateId || !emailPublicKey) {
      setApplicationActionError('EmailJS is not configured for applicant notifications.')
      return
    }
    if (rejectionMessage.length < 20) {
      setApplicationActionError('Rejection email message is too short.')
      return
    }
    setIsSendingApplicationAction(true)
    setApplicationActionError('')
    setApplicationActionSuccess('')

    try {
      await emailjs.send(
        emailServiceId,
        inquiryReplyTemplateId,
        buildUnifiedEmailParams({
          toEmail: emailTo,
          recipientName: application?.name || 'Applicant',
          subject: `Update on Your Application for ${application?.role || 'Lifewood Role'}`,
          message: rejectionMessage,
          emailContent: buildApplicantEmailContentHtml({
            message: rejectionMessage,
            detailsTitle: 'Application Details',
            detailsRows: [
              { label: 'Position', value: application?.role || 'Lifewood Role' },
              { label: 'Application Status', value: 'Rejected' },
            ],
            closingText: 'We appreciate your time and interest in Lifewood, and we wish you success in your next opportunity.',
          }),
          signoffName: 'HR Team | Lifewood',
        }),
        emailPublicKey
      )

      await persistApplicationStatus(application.id, {
        status: 'Rejected',
        stage: 'Closed',
      })
      updateApplicationState(application.id, {
        status: 'Rejected',
        stage: 'Closed',
      })
      setApplicationActionSuccess('Rejection email sent.')
      setIsRejectApplicationModalOpen(false)
    } catch (error) {
      console.error(error)
      setApplicationActionError('Failed to send the rejection email.')
    } finally {
      setIsSendingApplicationAction(false)
    }
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
      downloadCsv('demo-requests.csv', filteredSubmissions.map((item) => ({
        Company: item.company,
        Project: item.project,
        Industry: item.industry,
        Status: item.status,
      })))
      return
    }

    if (panel === 'inquiries') {
      downloadCsv('inquiries.csv', filteredInquiries.map((item) => ({
        FullName: item.fullName,
        Email: item.email,
        InquiryType: item.inquiryType,
        Message: item.message,
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

  const requestDeleteApplication = (application) => {
    setApplicationPendingDelete(application)
    setIsDeleteApplicationModalOpen(true)
  }

  const handleDeleteApplication = async () => {
    if (!applicationPendingDelete?.id) return
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/applications/${applicationPendingDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to archive application.')
      }

      setApplications((prev) => prev.filter((item) => item.id !== applicationPendingDelete.id))
      if (selectedApplication?.id === applicationPendingDelete.id) {
        setIsApplicationModalOpen(false)
        setSelectedApplication(null)
      }
      setIsDeleteApplicationModalOpen(false)
      setApplicationPendingDelete(null)
      await loadAdminData()
    } catch (error) {
      console.error(error)
    }
  }

  const openApplicationModal = async (application) => {
    setSelectedApplication(application)
    setIsApplicationModalOpen(true)
    setApplicationAnalysisError('')
    resetApplicationActionState()
    setIsRejectApplicationModalOpen(false)
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
    setListingActionError('')
    setListingActionSuccess('')
    try {
      const payload = {
        title: listingForm.title,
        department: listingForm.department,
        location: listingForm.location,
        workplace: listingForm.workplace,
        work_type: listingForm.workType,
        description: sanitizeListingDescription(listingForm.description),
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
      await loadAdminData()
      setListingActionSuccess('Job listing created successfully.')
    } catch (error) {
      console.error(error)
      setListingActionError('Failed to create job listing.')
    } finally {
      setIsCreatingListing(false)
    }
  }

  const openListingModal = (listing) => {
    setListingActionError('')
    setListingActionSuccess('')
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
    setListingActionError('')
    setListingActionSuccess('')
    try {
      const payload = {
        title: editForm.title,
        department: editForm.department,
        location: editForm.location,
        workplace: editForm.workplace,
        work_type: editForm.workType,
        description: sanitizeListingDescription(editForm.description),
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
      setListingActionSuccess('Job listing updated successfully.')
    } catch (error) {
      console.error(error)
      setListingActionError('Failed to update job listing.')
    }
  }

  const handleDeleteListing = async () => {
    if (!selectedListing?.id) return
    setListingActionError('')
    setListingActionSuccess('')
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/listings/${selectedListing.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete job listing.')
      }

      setIsDeleteListingModalOpen(false)
      setIsListingModalOpen(false)
      setSelectedListing(null)
      await loadAdminData()
      setListingActionSuccess('Job listing deleted successfully.')
    } catch (error) {
      console.error(error)
      setListingActionError('Failed to delete job listing.')
    }
  }

  const requestDeleteListing = () => {
    if (!selectedListing?.id) return
    setIsDeleteListingModalOpen(true)
  }

  const renderDashboardOverview = () => (
    <div className="admin-dashboard-shell">
      <section className="admin-dashboard-hero">
        <div>
          <h1>Overview</h1>
          <span>High-level activity across listings, applications, meetings, and inquiries.</span>
        </div>
      </section>

      <section className="admin-dashboard-stats">
        {overviewStats.map((stat) => (
          <article key={stat.label} className="admin-dashboard-stat">
            <div className="admin-dashboard-stat-top">
              <p>{stat.label}</p>
            </div>
            <h3>{stat.value}</h3>
          </article>
        ))}
      </section>

      <section className="admin-dashboard-grid">
        <article className="admin-dashboard-card">
          <div className="admin-dashboard-card-head">
            <div>
              <h2>Applications Trend</h2>
              <p>New applicants over the last 7 days</p>
            </div>
          </div>
          <div className="admin-dashboard-line-chart">
            <svg
              viewBox={`0 0 ${applicationTrendChart.width} ${applicationTrendChart.height}`}
              className="admin-dashboard-line-svg"
              aria-label="Applications trend line chart"
            >
              <defs>
                <linearGradient id="applicationsTrendStroke" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1b7b47" />
                  <stop offset="100%" stopColor="#f0c15a" />
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75].map((ratio) => (
                <line
                  key={ratio}
                  x1={applicationTrendChart.paddingLeft}
                  y1={applicationTrendChart.paddingTop + ((applicationTrendChart.height - applicationTrendChart.paddingTop - applicationTrendChart.paddingBottom) * ratio)}
                  x2={applicationTrendChart.width - applicationTrendChart.paddingRight}
                  y2={applicationTrendChart.paddingTop + ((applicationTrendChart.height - applicationTrendChart.paddingTop - applicationTrendChart.paddingBottom) * ratio)}
                  className="admin-dashboard-line-grid"
                />
              ))}
              <line
                x1={applicationTrendChart.paddingLeft}
                y1={applicationTrendChart.chartBottomY}
                x2={applicationTrendChart.width - applicationTrendChart.paddingRight}
                y2={applicationTrendChart.chartBottomY}
                className="admin-dashboard-line-axis"
              />
              <polyline
                points={applicationTrendChart.polylinePoints}
                fill="none"
                stroke="url(#applicationsTrendStroke)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {applicationTrendChart.points.map((point) => (
                <g key={point.label}>
                  <circle cx={point.x} cy={point.y} r="6" className="admin-dashboard-line-point" />
                  <text x={point.x} y={point.y - 12} textAnchor="middle" className="admin-dashboard-line-value">
                    {point.value}
                  </text>
                  <text
                    x={point.x}
                    y={applicationTrendChart.height - 8}
                    textAnchor="middle"
                    className="admin-dashboard-line-label"
                  >
                    {point.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </article>

        <article className="admin-dashboard-card">
          <div className="admin-dashboard-card-head">
            <div>
              <h2>Inquiry Distribution</h2>
              <p>Distribution of inquiries by category</p>
            </div>
          </div>
          <div className="admin-dashboard-pie-layout">
            <div className="admin-dashboard-pie-chart" aria-label="Inquiry distribution pie chart">
              <svg viewBox="0 0 200 200" className="admin-dashboard-pie-svg">
                <circle
                  cx="100"
                  cy="100"
                  r={inquiryDistribution.radius}
                  fill="none"
                  stroke="#e8ede8"
                  strokeWidth="32"
                />
                {inquiryDistribution.segments.map((segment) => (
                  <circle
                    key={segment.label}
                    cx="100"
                    cy="100"
                    r={inquiryDistribution.radius}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="32"
                    strokeLinecap="butt"
                    strokeDasharray={segment.dashArray}
                    strokeDashoffset={segment.dashOffset}
                    transform="rotate(-90 100 100)"
                  />
                ))}
              </svg>
              <div className="admin-dashboard-pie-center">
                <strong>{inquiryDistribution.total}</strong>
                <span>Total</span>
              </div>
            </div>
            <div className="admin-dashboard-pie-legend">
              {inquiryDistribution.segments.map((segment) => (
                <div key={segment.label} className="admin-dashboard-pie-row">
                  <span
                    className="admin-dashboard-pie-dot"
                    style={{ backgroundColor: segment.color }}
                  />
                  <div>
                    <strong>{segment.label}</strong>
                    <small>{segment.value} inquiries</small>
                  </div>
                  <em>{segment.percentage}%</em>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="admin-dashboard-card full">
          <div className="admin-dashboard-card-head">
            <div>
              <h2>Recent Applicants</h2>
              <p>Latest applicant activity that needs review.</p>
            </div>
          </div>
          <div className="admin-dashboard-applicants">
            <div className="admin-dashboard-applicants-head">
              <span>Received</span>
              <span>Applicant</span>
              <span>Position Applied</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {recentApplicants.length ? recentApplicants.map((item) => (
              <div key={item.id || item.email || item.name} className="admin-dashboard-applicant-row">
                <div className="admin-dashboard-applicant-received">
                  <strong>{formatDateShort(item.createdAt)}</strong>
                  <small>{formatRelativeTime(item.createdAt)}</small>
                </div>
                <div className="admin-dashboard-applicant-person">
                  <strong>{item.name || 'Applicant'}</strong>
                  <small>{item.email || 'No email provided'}</small>
                </div>
                <div className="admin-dashboard-applicant-role">
                  <strong>{item.role || 'Applied role'}</strong>
                </div>
                <div className="admin-dashboard-applicant-status">
                  <span className={`status ${String(item.status || 'new').toLowerCase()}`}>
                    {item.status || 'New'}
                  </span>
                </div>
                <button
                  type="button"
                  className="admin-link"
                  onClick={() => {
                    setActivePanel('applications')
                    setIsNotificationOpen(false)
                    openApplicationModal(item)
                  }}
                >
                  Review
                </button>
              </div>
            )) : (
              <div className="admin-dashboard-applicant-row is-empty">
                <div>
                  <b>No recent applicants</b>
                  <small>New applicant activity will appear here automatically.</small>
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
      {listingActionError ? (
        <div className="admin-rich-editor is-readonly admin-application-note admin-application-status-note is-error">
          {listingActionError}
        </div>
      ) : null}
      {listingActionSuccess ? (
        <div className="admin-rich-editor is-readonly admin-application-note admin-application-status-note is-success">
          {listingActionSuccess}
        </div>
      ) : null}
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
              {listingActionError ? (
                <div className="admin-rich-editor is-readonly admin-application-note admin-application-status-note is-error">
                  {listingActionError}
                </div>
              ) : null}
              {listingActionSuccess ? (
                <div className="admin-rich-editor is-readonly admin-application-note admin-application-status-note is-success">
                  {listingActionSuccess}
                </div>
              ) : null}
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
        <span>Showing {pagedApplications.length} of {filteredApplications.length} applications</span>
        {renderPagination(applicationPage, applicationPageCount, setApplicationPage)}
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
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '24px' }}>
                  No applications found.
                </td>
              </tr>
            ) : pagedApplications.map((applicant) => (
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
                    <span className="admin-table-value">{applicant.name}</span>
                  </div>
                </td>
                <td>
                  <div className="admin-table-meta">
                    <span className="admin-table-value">{applicant.role || '--'}</span>
                  </div>
                </td>
                <td>
                  <div className="admin-table-meta">
                    <span className="admin-table-value">{applicant.status}</span>
                  </div>
                </td>
                <td>
                  <div className="admin-table-meta">
                    <span className="admin-table-value">{applicant.score}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      type="button"
                      className="admin-link"
                      aria-label="View application"
                      onClick={(event) => {
                        event.stopPropagation()
                        openApplicationModal(applicant)
                      }}
                    >
                      <IconEye size={16} />
                    </button>
                    <button
                      type="button"
                      className="admin-link"
                      aria-label="Delete application"
                      style={{ color: '#c0392b' }}
                      onClick={(event) => {
                        event.stopPropagation()
                        requestDeleteApplication(applicant)
                      }}
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
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
      </section>
      <section className="admin-bookings-calendar-shell admin-bookings-calendar-shell--single">
        <div className="admin-bookings-toolbar">
          <div className="admin-bookings-nav">
            <button
              type="button"
              className="admin-bookings-nav-icon"
              onClick={() => setBookingViewDate((current) => {
                const base = current ? new Date(current) : new Date()
                const next = new Date(base)
                next.setDate(base.getDate() - 7)
                return next
              })}
              aria-label="Previous week"
            >
              <IconChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="admin-btn ghost"
              onClick={() => setBookingViewDate(new Date())}
            >
              Today
            </button>
            <button
              type="button"
              className="admin-bookings-nav-icon"
              onClick={() => setBookingViewDate((current) => {
                const base = current ? new Date(current) : new Date()
                const next = new Date(base)
                next.setDate(base.getDate() + 7)
                return next
              })}
              aria-label="Next week"
            >
              <IconChevronRight size={18} />
            </button>
          </div>
          <div className="admin-bookings-board-pill">
            {bookingCalendarData.totalMeetings} bookings
          </div>
        </div>
        <div className="admin-bookings-board">
          <div className="admin-bookings-board-head">
            <div>
              <h2>
                {bookingCalendarData.anchorDate.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </h2>
              <p>Weekly schedule synced from Calendly</p>
            </div>
          </div>

          <div className="admin-bookings-grid">
            <div className="admin-bookings-grid-head admin-bookings-time-spacer" />
            {bookingCalendarData.dayColumns.map((dayColumn) => (
              <button
                key={dayColumn.date.toISOString()}
                type="button"
                className={`admin-bookings-grid-head admin-bookings-day-button ${
                  bookingCalendarData.anchorDate.toDateString() === dayColumn.date.toDateString()
                    ? 'is-active'
                    : ''
                }`}
                onClick={() => setBookingViewDate(new Date(dayColumn.date))}
              >
                <strong>{dayColumn.date.toLocaleDateString('en-US', { day: '2-digit' })}</strong>
                <span>{dayColumn.date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</span>
              </button>
            ))}

            <div className="admin-bookings-time-column">
              {bookingCalendarData.hourSlots.map((hour) => (
                <div key={hour} className="admin-bookings-time-slot">
                  {new Date(2026, 0, 1, hour).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </div>
              ))}
            </div>

            {bookingCalendarData.dayColumns.map((dayColumn) => (
              <div key={dayColumn.date.toDateString()} className="admin-bookings-day-column">
                {bookingCalendarData.hourSlots.map((hour) => (
                  <div key={`${dayColumn.date.toDateString()}-${hour}`} className="admin-bookings-hour-line" />
                ))}
                {dayColumn.meetings.map((meeting) => (
                  <article
                    key={meeting.id}
                    className={`admin-bookings-event-card ${meeting.colorClass}`}
                    style={{ top: meeting.top, height: meeting.height }}
                    onClick={() => openBookingModal(meeting)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        openBookingModal(meeting)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <small>{meeting.timeLabel}</small>
                    <strong>{meeting.displayTitle}</strong>
                    <span>{meeting.event || meeting.invitee || 'No booking title available'}</span>
                    <em>{meeting.status || 'Scheduled'}</em>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )

  const renderSubmissions = () => (
    <div className="admin-panel-shell">
      <section className="admin-panel-head">
        <div>
          <h1>Demo Requests</h1>
          <p>Review companies interested in working with Lifewood.</p>
        </div>
      </section>
      <div className="admin-listing-controls applications-controls">
        <div className="admin-listing-filters">
          <select
            value={submissionIndustryFilter}
            onChange={(event) => setSubmissionIndustryFilter(event.target.value)}
          >
            <option value="">All industries</option>
            {submissionIndustryOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <button type="button" className="admin-listing-clear" onClick={clearSubmissionFilters}>
            Clear Filters
          </button>
        </div>
      </div>
      <div className="admin-listing-count">
        <span>Showing {pagedSubmissions.length} of {filteredSubmissions.length} demo requests</span>
        {renderPagination(submissionPage, submissionPageCount, setSubmissionPage)}
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Project</th>
              <th>Industry</th>
              <th>Received</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '24px' }}>
                  No demo requests found.
                </td>
              </tr>
            ) : pagedSubmissions.map((submission) => (
              <tr
                key={submission.id}
                className="admin-table-row"
                onClick={() => openSubmissionModal(submission)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    openSubmissionModal(submission)
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <td>
                  <div className="admin-table-title">
                    <span className="admin-table-value">{submission.company}</span>
                  </div>
                </td>
                <td>
                  <div className="admin-table-meta">
                    <span className="admin-table-value">{submission.project}</span>
                  </div>
                </td>
                <td>
                  <div className="admin-table-meta">
                    <span className="admin-table-value">{submission.industry}</span>
                  </div>
                </td>
                <td>
                  <div className="admin-table-meta">
                    <span className="admin-table-value">{formatDateTime(submission.createdAt)}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      type="button"
                      className="admin-link"
                      onClick={(event) => {
                        event.stopPropagation()
                        openSubmissionModal(submission)
                      }}
                    >
                      <IconEye size={16} />
                    </button>
                    <button
                      type="button"
                      className="admin-link"
                      style={{ color: '#c0392b' }}
                      onClick={(event) => {
                        event.stopPropagation()
                        requestDeleteSubmission(submission)
                      }}
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderInquiries = () => (
    <div className="admin-panel-shell">
      <section className="admin-panel-head">
        <div>
          <h1>Inquiries</h1>
          <p>Review messages submitted from the Ask a Question form.</p>
        </div>
      </section>
      <div className="admin-listing-controls applications-controls">
        <div className="admin-listing-filters">
          <select
            value={inquiryTypeFilter}
            onChange={(event) => setInquiryTypeFilter(event.target.value)}
          >
            <option value="">All inquiry types</option>
            {inquiryTypeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <select
            value={inquiryStatusFilter}
            onChange={(event) => setInquiryStatusFilter(event.target.value)}
          >
            <option value="">All statuses</option>
            {inquiryStatusOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <button type="button" className="admin-listing-clear" onClick={clearInquiryFilters}>
            Clear Filters
          </button>
        </div>
      </div>
      <div className="admin-listing-count">
        <span>Showing {pagedInquiries.length} of {filteredInquiries.length} inquiries</span>
        {renderPagination(inquiryPage, inquiryPageCount, setInquiryPage)}
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Contact</th>
              <th>Inquiry Type</th>
              <th>Status</th>
              <th>Received</th>
              <th>Replied</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '24px' }}>
                  No inquiries found.
                </td>
              </tr>
            ) : pagedInquiries.map((inquiry) => (
              <tr
                key={inquiry.id}
                className="admin-table-row"
                onClick={() => openInquiryModal(inquiry)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    openInquiryModal(inquiry)
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <td>
                  <div className="admin-table-title">
                    <span className="admin-table-value">{inquiry.fullName}</span>
                    <span>{inquiry.email}</span>
                  </div>
                </td>
                <td>
                  <div className="admin-table-meta">
                    <span className="admin-table-value">{inquiry.inquiryType}</span>
                  </div>
                </td>
                <td>
                  <div className="admin-table-meta">
                    <span className="admin-table-value">{inquiry.status}</span>
                  </div>
                </td>
                <td>
                  <div className="admin-table-meta">
                    <span className="admin-table-value">{formatDateTime(inquiry.createdAt)}</span>
                  </div>
                </td>
                <td>
                  <div className="admin-table-meta">
                    <span className="admin-table-value">{formatDateTime(inquiry.repliedAt)}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      type="button"
                      className="admin-link"
                      aria-label="View inquiry"
                      onClick={(event) => {
                        event.stopPropagation()
                        openInquiryModal(inquiry)
                      }}
                    >
                      <IconEye size={16} />
                    </button>
                    <button
                      type="button"
                      className="admin-link"
                      aria-label="Delete inquiry"
                      style={{ color: '#c0392b' }}
                      onClick={(event) => {
                        event.stopPropagation()
                        requestDeleteInquiry(inquiry)
                      }}
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

          <div className="admin-sidebar-profile">
            <div>
              <p>Signed in</p>
              <h3>{currentAdmin.name}</h3>
              <span>{currentAdmin.role}{currentAdmin.email ? ` • ${currentAdmin.email}` : ''}</span>
            </div>
            <div className="admin-sidebar-avatar" aria-hidden="true">
              {currentAdmin.initials}
            </div>
          </div>

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
                placeholder="Search listings, applications, demo requests, inquiries, users"
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
                Export
              </button>
            </div>
          </header>

          {activePanel === 'dashboard' && renderDashboardOverview()}
          {activePanel === 'listings' && renderJobListings()}
          {activePanel === 'applications' && renderApplications()}
          {activePanel === 'bookings' && renderBookings()}
          {activePanel === 'submissions' && renderSubmissions()}
          {activePanel === 'inquiries' && renderInquiries()}
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
                className="admin-listing-modal admin-application-modal"
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
                  <h2>Job Listing Details</h2>
                </div>
              </div>
              {listingActionError ? (
                <div className="admin-rich-editor is-readonly admin-application-note admin-application-status-note is-error">
                  {listingActionError}
                </div>
              ) : null}
              {listingActionSuccess ? (
                <div className="admin-rich-editor is-readonly admin-application-note admin-application-status-note is-success">
                  {listingActionSuccess}
                </div>
              ) : null}

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
                      Edit
                    </button>
                    <button type="button" className="admin-btn danger" onClick={requestDeleteListing}>
                      Delete
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
        {isDeleteListingModalOpen ? (
          <motion.div
            className="admin-listing-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDeleteListingModalOpen(false)}
          >
            <motion.section
              className="admin-listing-modal admin-application-modal"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="dashboard-profile-modal-close"
                aria-label="Close delete confirmation"
                onClick={() => setIsDeleteListingModalOpen(false)}
              >
                <IconX size={18} />
              </button>
              <div className="admin-listing-modal-head admin-application-head">
                <div className="admin-application-head-copy">
                  <h2>Delete Job Listing</h2>
                  <p>{selectedListing?.title || 'This listing'}</p>
                </div>
              </div>
              <div className="admin-application-body">
                <div className="admin-application-scroll">
                  <div className="admin-rich-editor is-readonly admin-application-note">
                    This will permanently delete the job listing. This action cannot be undone.
                  </div>
                </div>
              </div>
              <div className="admin-form-actions admin-application-footer">
                <button type="button" className="admin-btn ghost" onClick={() => setIsDeleteListingModalOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="admin-btn danger" onClick={handleDeleteListing}>
                  Delete
                </button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isBookingModalOpen ? (
          <motion.div
            className="admin-listing-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsBookingModalOpen(false)}
          >
            <motion.section
              className="admin-listing-modal admin-application-modal"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="dashboard-profile-modal-close"
                aria-label="Close booking modal"
                onClick={() => setIsBookingModalOpen(false)}
              >
                <IconX size={18} />
              </button>
              <div className="admin-listing-modal-head admin-application-head">
                <div className="admin-application-head-copy">
                  <h2>Booking Details</h2>
                  <p>{selectedBooking?.displayTitle || selectedBooking?.event || 'Calendly Booking'}</p>
                </div>
                <div className="admin-application-actions">
                  <button
                    type="button"
                    className="admin-btn ghost"
                    onClick={() => {
                      if (selectedBooking?.resolvedMeetingLink) {
                        window.open(selectedBooking.resolvedMeetingLink, '_blank', 'noopener,noreferrer')
                      }
                    }}
                    disabled={!selectedBooking?.resolvedMeetingLink}
                  >
                    <IconVideo size={16} />
                    Join Meeting
                  </button>
                </div>
              </div>
              <div className="admin-application-body">
                <div className="admin-application-scroll">
                  <section className="admin-application-section">
                    <div className="admin-application-section-head">
                      <h3>Booking Info</h3>
                    </div>
                    <div className="admin-form-grid admin-application-grid">
                      <label>
                        Company
                        <input type="text" value={selectedBooking?.relatedSubmission?.company || selectedBooking?.displayTitle || ''} readOnly />
                      </label>
                      <label>
                        Event
                        <input type="text" value={selectedBooking?.event || ''} readOnly />
                      </label>
                      <label>
                        Invitee
                        <input type="text" value={selectedBooking?.invitee || ''} readOnly />
                      </label>
                      <label>
                        Invitee Email
                        <input type="text" value={selectedBooking?.inviteeEmail || ''} readOnly />
                      </label>
                      <label>
                        Status
                        <input type="text" value={selectedBooking?.status || ''} readOnly />
                      </label>
                      <label>
                        Start
                        <input type="text" value={formatDateTime(selectedBooking?.startTime)} readOnly />
                      </label>
                      <label>
                        End
                        <input type="text" value={formatDateTime(selectedBooking?.endTime)} readOnly />
                      </label>
                      <label className="full">
                        Meeting Link
                        <input type="text" value={selectedBooking?.resolvedMeetingLink || 'Not available'} readOnly />
                      </label>
                    </div>
                  </section>
                </div>
              </div>
              <div className="admin-form-actions admin-application-footer">
                <button
                  type="button"
                  className="admin-btn ghost"
                  onClick={() => openRelatedSubmissionFromBooking(selectedBooking)}
                  disabled={!selectedBooking?.relatedSubmission}
                >
                  View Company Details
                </button>
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
            onClick={() => {
              setIsApplicationModalOpen(false)
              resetApplicationActionState()
            }}
          >
              <motion.section
                className="admin-listing-modal admin-application-modal"
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
                onClick={() => {
                  setIsApplicationModalOpen(false)
                  resetApplicationActionState()
                }}
              >
                <IconX size={18} />
              </button>
              <div className="admin-listing-modal-head admin-application-head">
                <div className="admin-application-head-copy">
                  <h2>Applicant Details</h2>
                  <p>{selectedApplication?.role || 'Applied Role'}</p>
                </div>
                <div className="admin-application-actions">
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
                    <IconEye size={16} />
                    View Resume
                  </button>
                </div>
              </div>
              {applicationActionError ? (
                <div className="admin-rich-editor is-readonly admin-application-note admin-application-status-note is-error">
                  {applicationActionError}
                </div>
              ) : null}
              {applicationActionSuccess ? (
                <div className="admin-rich-editor is-readonly admin-application-note admin-application-status-note is-success">
                  {applicationActionSuccess}
                </div>
              ) : null}
              <div className="admin-application-body">
                <div className="admin-application-scroll">
                  <section className="admin-application-section">
                    <div className="admin-application-section-head">
                      <h3>Applicant Info</h3>
                    </div>
                    <div className="admin-form-grid admin-application-grid">
                      <label className="full">
                        Full Name
                        <input type="text" value={selectedApplication?.name || ''} readOnly />
                      </label>
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
                    </div>
                  </section>
                  <section className="admin-application-section">
                    <div className="admin-application-section-head">
                      <h3>AI Analysis</h3>
                    </div>
                    {applicationAnalysisError ? (
                      <div className="admin-rich-editor is-readonly admin-application-note">
                        {applicationAnalysisError}
                      </div>
                    ) : null}
                    <div className="admin-rich-editor is-readonly admin-application-note">
                      {renderAiAnalysisContent(selectedApplication)}
                    </div>
                  </section>
                  <section className="admin-application-section">
                    <div className="admin-application-section-head">
                      <h3>Pre-Screening Results</h3>
                    </div>
                    <div className="admin-application-qna-list">
                      {formatPreScreeningResults(selectedApplication?.preScreeningResults).length ? (
                        formatPreScreeningResults(selectedApplication?.preScreeningResults).map((item) => (
                          <article key={item.id} className="admin-application-qna-card">
                            <strong>Question</strong>
                            <p>{item.question}</p>
                            <strong>Answer</strong>
                            <p>{item.answer}</p>
                          </article>
                        ))
                      ) : (
                        <div className="admin-rich-editor is-readonly admin-application-note">
                          No pre-screening results available yet.
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </div>
              <div className="admin-form-actions admin-application-footer">
                {isPendingVerdictStatus(selectedApplication?.status || '') ? (
                  <button
                    type="button"
                    className="admin-btn"
                    onClick={() => openInterviewModal(selectedApplication)}
                    disabled={isSendingApplicationAction}
                  >
                    Schedule Final Interview
                  </button>
                ) : null}
                {isPendingVerdictStatus(selectedApplication?.status || '') ? (
                  <button
                    type="button"
                    className="admin-btn danger"
                    onClick={openRejectApplicationModal}
                    disabled={isSendingApplicationAction}
                  >
                    Reject Applicant
                  </button>
                ) : null}
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isInterviewModalOpen ? (
          <motion.div
            className="admin-listing-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeInterviewModal}
          >
            <motion.section
              className="admin-listing-modal admin-application-modal"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="dashboard-profile-modal-close"
                aria-label="Close interview scheduling modal"
                onClick={closeInterviewModal}
                disabled={isSendingApplicationAction}
              >
                <IconX size={18} />
              </button>
              <div className="admin-listing-modal-head admin-application-head">
                <div className="admin-application-head-copy">
                  <h2>Schedule Final Interview</h2>
                  <p>{selectedApplication?.name || 'Applicant'}</p>
                </div>
              </div>
              <div className="admin-application-body">
                <div className="admin-application-scroll">
                  <section className="admin-application-section">
                    <div className="admin-application-section-head">
                      <h3>Interview Setup</h3>
                    </div>
                    <div className="admin-form-grid admin-application-grid">
                      <label>
                        Interview Date and Time
                        <input
                          type="datetime-local"
                          value={interviewForm.schedule}
                          onChange={(event) => handleInterviewFieldChange('schedule', event.target.value)}
                        />
                      </label>
                      <label>
                        Timezone
                        <input
                          type="text"
                          value={interviewForm.timezone}
                          onChange={(event) => handleInterviewFieldChange('timezone', event.target.value)}
                          placeholder="Asia/Manila"
                        />
                      </label>
                      <label>
                        Interview Location
                        <input
                          type="text"
                          value={interviewForm.location}
                          onChange={(event) => handleInterviewFieldChange('location', event.target.value)}
                          placeholder="Google Meet or Office Address"
                        />
                      </label>
                      <label>
                        Meeting Link
                        <input
                          type="url"
                          value={interviewForm.meetingLink}
                          onChange={(event) => handleInterviewFieldChange('meetingLink', event.target.value)}
                          placeholder="https://meet.google.com/..."
                        />
                      </label>
                      <label className="full">
                        Email Message
                        <textarea
                          className="admin-application-textarea"
                          value={interviewForm.emailMessage}
                          onChange={(event) => handleInterviewFieldChange('emailMessage', event.target.value)}
                          rows={8}
                        />
                      </label>
                    </div>
                  </section>
                </div>
              </div>
              <div className="admin-form-actions admin-application-footer">
                <button
                  type="button"
                  className="admin-btn ghost"
                  onClick={closeInterviewModal}
                  disabled={isSendingApplicationAction}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="admin-btn"
                  onClick={handleScheduleInterview}
                  disabled={isSendingApplicationAction}
                >
                  {isSendingApplicationAction ? 'Sending...' : 'Send Interview Invite'}
                </button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isRejectApplicationModalOpen ? (
          <motion.div
            className="admin-listing-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeRejectApplicationModal}
          >
            <motion.section
              className="admin-listing-modal admin-application-modal"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="dashboard-profile-modal-close"
                aria-label="Close reject applicant modal"
                onClick={closeRejectApplicationModal}
                disabled={isSendingApplicationAction}
              >
                <IconX size={18} />
              </button>
              <div className="admin-listing-modal-head admin-application-head">
                <div className="admin-application-head-copy">
                  <h2>Reject Applicant</h2>
                  <p>{selectedApplication?.name || 'This applicant'}</p>
                </div>
              </div>
              <div className="admin-application-body">
                <div className="admin-application-scroll">
                  <section className="admin-application-section">
                    <div className="admin-application-section-head">
                      <h3>Rejection Email</h3>
                    </div>
                    <div className="admin-rich-editor is-readonly admin-application-note" style={{ marginBottom: '12px' }}>
                      This will send a rejection email to {selectedApplication?.name || 'the applicant'} and update the application status to Rejected.
                    </div>
                    <div className="admin-form-grid admin-application-grid">
                      <label className="full">
                        Email Message
                        <textarea
                          className="admin-application-textarea"
                          value={rejectForm.emailMessage}
                          onChange={(event) => handleRejectFieldChange('emailMessage', event.target.value)}
                          rows={8}
                        />
                      </label>
                    </div>
                  </section>
                </div>
              </div>
              <div className="admin-form-actions admin-application-footer">
                <button
                  type="button"
                  className="admin-btn ghost"
                  onClick={closeRejectApplicationModal}
                  disabled={isSendingApplicationAction}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="admin-btn danger"
                  onClick={handleRejectApplicant}
                  disabled={isSendingApplicationAction}
                >
                  {isSendingApplicationAction ? 'Sending...' : 'Send Rejection Email'}
                </button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteApplicationModalOpen ? (
          <motion.div
            className="admin-listing-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDeleteApplicationModalOpen(false)}
          >
            <motion.section
              className="admin-listing-modal admin-application-modal"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="dashboard-profile-modal-close"
                aria-label="Close delete application confirmation"
                onClick={() => setIsDeleteApplicationModalOpen(false)}
              >
                <IconX size={18} />
              </button>
              <div className="admin-listing-modal-head admin-application-head">
                <div className="admin-application-head-copy">
                  <h2>Archive Applicant</h2>
                  <p>{applicationPendingDelete?.name || 'This applicant'}</p>
                </div>
              </div>
              <div className="admin-application-body">
                <div className="admin-application-scroll">
                  <div className="admin-rich-editor is-readonly admin-application-note">
                    This will move the application to archived records. You can restore it at any time.
                  </div>
                </div>
              </div>
              <div className="admin-form-actions admin-application-footer">
                <button type="button" className="admin-btn ghost" onClick={() => setIsDeleteApplicationModalOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="admin-btn danger" onClick={handleDeleteApplication}>
                  Archive
                </button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isSubmissionModalOpen ? (
          <motion.div
            className="admin-listing-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSubmissionModalOpen(false)}
          >
            <motion.section
              className="admin-listing-modal admin-application-modal"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="dashboard-profile-modal-close"
                aria-label="Close demo request modal"
                onClick={() => setIsSubmissionModalOpen(false)}
              >
                <IconX size={18} />
              </button>
              <div className="admin-listing-modal-head admin-application-head">
                <div className="admin-application-head-copy">
                  <h2>Demo Request Details</h2>
                  <p>{selectedSubmission?.project || 'Project'}</p>
                </div>
                <div className="admin-application-actions">
                </div>
              </div>
              <div className="admin-application-body">
                <div className="admin-application-scroll">
                  <section className="admin-application-section">
                    <div className="admin-application-section-head">
                      <h3>Company Info</h3>
                    </div>
                    <div className="admin-form-grid admin-application-grid">
                      <label className="full">
                        Company
                        <input type="text" value={selectedSubmission?.company || 'Not provided'} readOnly />
                      </label>
                      <label>
                        Contact Name
                        <input type="text" value={selectedSubmission?.fullName || 'Not provided'} readOnly />
                      </label>
                      <label>
                        Work Email
                        <input type="text" value={selectedSubmission?.workEmail || 'Not provided'} readOnly />
                      </label>
                      <label className="full">
                        Company Website
                        <input type="text" value={selectedSubmission?.companyWebsite || 'Not provided'} readOnly />
                      </label>
                      <label>
                        Company Size
                        <input type="text" value={selectedSubmission?.companySize || 'Not provided'} readOnly />
                      </label>
                      <label>
                        Industry
                        <input type="text" value={selectedSubmission?.industry || 'Not provided'} readOnly />
                      </label>
                    </div>
                  </section>
                  <section className="admin-application-section">
                    <div className="admin-application-section-head">
                      <h3>Project Details</h3>
                    </div>
                    <div className="admin-form-grid admin-application-grid">
                      <label>
                        Project
                        <input type="text" value={selectedSubmission?.project || 'Not provided'} readOnly />
                      </label>
                      <label>
                        Data Type
                        <input type="text" value={selectedSubmission?.dataType || 'Not provided'} readOnly />
                      </label>
                      <label>
                        Dataset Size
                        <input type="text" value={selectedSubmission?.datasetSize || 'Not provided'} readOnly />
                      </label>
                      <label>
                        Timeline
                        <input type="text" value={selectedSubmission?.timeline || 'Not provided'} readOnly />
                      </label>
                      <label>
                        Received
                        <input type="text" value={formatDateTime(selectedSubmission?.createdAt)} readOnly />
                      </label>
                      <label className="full">
                        Project Description
                        <textarea rows={8} value={selectedSubmission?.projectDescription || 'Not provided'} readOnly />
                      </label>
                    </div>
                  </section>
                </div>
              </div>
              <div className="admin-form-actions admin-application-footer">
                <button type="button" className="admin-btn ghost" onClick={() => setIsSubmissionModalOpen(false)}>
                  Close
                </button>
                <button
                  type="button"
                  className="admin-btn danger"
                  onClick={() => requestDeleteSubmission(selectedSubmission)}
                >
                  Delete Demo Request
                </button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteSubmissionModalOpen ? (
          <motion.div
            className="dashboard-logout-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsDeleteSubmissionModalOpen(false)
              setSubmissionPendingDelete(null)
            }}
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
                aria-label="Close delete demo request modal"
                onClick={() => {
                  setIsDeleteSubmissionModalOpen(false)
                  setSubmissionPendingDelete(null)
                }}
              >
                <IconX size={18} />
              </button>
              <h3>Delete Demo Request</h3>
              <p>
                Are you sure you want to delete the demo request from {submissionPendingDelete?.company || 'this company'}?
              </p>
              <div className="dashboard-logout-modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteSubmissionModalOpen(false)
                    setSubmissionPendingDelete(null)
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="confirm"
                  onClick={() => handleDeleteSubmission(submissionPendingDelete?.id)}
                >
                  Delete
                </button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isInquiryModalOpen ? (
          <motion.div
            className="admin-listing-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsInquiryModalOpen(false)}
          >
            <motion.section
              className="admin-listing-modal admin-application-modal"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="dashboard-profile-modal-close"
                aria-label="Close inquiry modal"
                onClick={() => setIsInquiryModalOpen(false)}
              >
                <IconX size={18} />
              </button>
              <div className="admin-listing-modal-head admin-application-head">
                <div className="admin-application-head-copy">
                  <h2>Inquiry Details</h2>
                  <p>{selectedInquiry?.inquiryType || 'Inquiry'}</p>
                </div>
                <div className="admin-application-actions">
                  <span className={`status ${(selectedInquiry?.status || 'new').toLowerCase()}`}>
                    {selectedInquiry?.status || 'New'}
                  </span>
                </div>
              </div>
              <div className="admin-application-body">
                <div className="admin-application-scroll">
                  <section className="admin-application-section">
                    <div className="admin-application-section-head">
                      <h3>Contact Info</h3>
                    </div>
                    <div className="admin-form-grid admin-application-grid">
                      <label className="full">
                        Full Name
                        <input type="text" value={selectedInquiry?.fullName || ''} readOnly />
                      </label>
                      <label>
                        Email
                        <input type="text" value={selectedInquiry?.email || ''} readOnly />
                      </label>
                      <label>
                        Inquiry Type
                        <input type="text" value={selectedInquiry?.inquiryType || ''} readOnly />
                      </label>
                      <label>
                        Received
                        <input type="text" value={formatDateTime(selectedInquiry?.createdAt)} readOnly />
                      </label>
                      <label>
                        Replied
                        <input type="text" value={formatDateTime(selectedInquiry?.repliedAt)} readOnly />
                      </label>
                      <label>
                        Status
                        <input type="text" value={selectedInquiry?.status || ''} readOnly />
                      </label>
                    </div>
                  </section>
                  <section className="admin-application-section">
                    <div className="admin-application-section-head">
                      <h3>Inquiry Message</h3>
                    </div>
                    <div className="admin-rich-editor is-readonly admin-application-note">
                      {selectedInquiry?.message || 'No message provided.'}
                    </div>
                  </section>
                  <section className="admin-application-section">
                    <div className="admin-application-section-head">
                      <h3>Reply</h3>
                    </div>
                    <div className="admin-form-grid">
                      <label className="full">
                        Reply Message
                        <textarea
                          rows={8}
                          value={inquiryReplyDraft}
                          onChange={(event) => setInquiryReplyDraft(event.target.value)}
                        />
                      </label>
                    </div>
                    {inquiryReplyError ? (
                      <div className="admin-rich-editor is-readonly admin-application-note">
                        {inquiryReplyError}
                      </div>
                    ) : null}
                    {inquiryReplySuccess ? (
                      <div className="admin-rich-editor is-readonly admin-application-note">
                        {inquiryReplySuccess}
                      </div>
                    ) : null}
                  </section>
                </div>
              </div>
              <div className="admin-form-actions admin-application-footer">
                <button
                  type="button"
                  className="admin-btn ghost"
                  onClick={() => setIsInquiryModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="admin-btn"
                  onClick={handleSendInquiryReply}
                  disabled={isSendingInquiryReply}
                >
                  {isSendingInquiryReply ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteInquiryModalOpen ? (
          <motion.div
            className="dashboard-logout-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsDeleteInquiryModalOpen(false)
              setInquiryPendingDelete(null)
            }}
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
                aria-label="Close delete inquiry modal"
                onClick={() => {
                  setIsDeleteInquiryModalOpen(false)
                  setInquiryPendingDelete(null)
                }}
              >
                <IconX size={18} />
              </button>
              <h3>Delete Inquiry</h3>
              <p>
                Are you sure you want to delete the inquiry from {inquiryPendingDelete?.fullName || 'this contact'}?
              </p>
              <div className="dashboard-logout-modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteInquiryModalOpen(false)
                    setInquiryPendingDelete(null)
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="confirm"
                  onClick={() => handleDeleteInquiry(inquiryPendingDelete?.id)}
                >
                  Delete
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
