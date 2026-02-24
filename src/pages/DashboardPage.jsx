import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconLayoutDashboard, IconBook2, IconReport, IconChevronRight, IconLogout, IconMenu2, IconX, IconCamera, IconDeviceFloppy } from '@tabler/icons-react'

const DashboardPage = ({ onNavigate = () => {} }) => {
  const [activePanel, setActivePanel] = useState('dashboard')
  const [activeModuleIndex, setActiveModuleIndex] = useState(4)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [profileForm, setProfileForm] = useState({
    firstName: 'Francis',
    lastName: 'Barluado',
    email: 'admin1',
    phone: '+69 969 355 2175',
    school: 'University of Cebu',
  })

  const lessonTracks = [
    {
      label: 'Active',
      title: 'Web Development',
      image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1200&q=80',
      description: 'Build and ship a production-ready React app with clean architecture and accessibility.',
      bullets: ['Semantic HTML and Layout Foundations', 'React Component Architecture', 'Routing and Page Composition', 'Form UX and Validation'],
    },
    {
      label: 'Start',
      title: 'LLM Prompt Engineering',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80',
      description: 'Design prompts that are reliable, testable, and safe for real product use.',
      bullets: ['Prompt Design Basics', 'Few-Shot Prompting Strategy', 'Grounding and Retrieval', 'Prompt Evaluation Workflow'],
    },
    {
      label: 'Start',
      title: 'Product Delivery',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
      description: 'Plan, execute, and communicate software delivery with measurable sprint outcomes.',
      bullets: ['User Stories and Acceptance Criteria', 'Sprint Planning and Task Slicing', 'Quality Gates and Handoff', 'Stakeholder Reporting'],
    },
  ]

  const courseModules = [
    {
      title: 'Semantic HTML and Layout Foundations',
      duration: '45 min',
      objective: 'Define semantic structure for maintainable pages.',
      content: 'Use landmarks, accessible form controls, and meaningful heading flow.',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=80',
    },
    {
      title: 'React Component Architecture',
      duration: '60 min',
      objective: 'Build reusable component trees with clear responsibilities.',
      content: 'Split UI by domain concerns and avoid prop-drilling with composition patterns.',
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80',
    },
    {
      title: 'Routing and Page Composition',
      duration: '50 min',
      objective: 'Organize route-level layouts and content transitions.',
      content: 'Create nested route shells and state-safe transitions between views.',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1400&q=80',
    },
    {
      title: 'Form UX and Validation',
      duration: '55 min',
      objective: 'Improve form usability and validation feedback loops.',
      content: 'Add inline feedback, validation hints, and robust error edge-case handling.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
    },
    {
      title: 'Performance and QA',
      duration: '40 min',
      objective: 'Optimize application speed and ensure code quality.',
      content: 'Apply memoization, lazy loading, and automated testing strategies.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80',
    },
  ]

  const activeModule = courseModules[activeModuleIndex]
  const handleProfileFieldChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }))
  }

  const renderDashboardOverview = () => (
    <div className="dashboard-main-shell">
      <section className="dashboard-main-welcome">
        <h1>
          Welcome back,
          <span>Lifewood Intern</span>
        </h1>
        <p>Always on, never off. Track your progress and continue your journey in AI data solutions.</p>
      </section>

      <section className="dashboard-main-stats">
        <article className="dashboard-main-stat-card">
          <div className="dashboard-main-stat-head">
            <p>01 Completion</p>
            <span>↗</span>
          </div>
          <h3>98%</h3>
          <strong>↗+6%</strong>
          <small>Weekly progress update</small>
        </article>

        <article className="dashboard-main-stat-card">
          <div className="dashboard-main-stat-head">
            <p>02 Weekly Goals</p>
            <span>◎</span>
          </div>
          <h3>04</h3>
          <small>2 completed, 2 in progress</small>
        </article>

        <article className="dashboard-main-stat-card">
          <div className="dashboard-main-stat-head">
            <p>03 Alerts</p>
            <span>◠</span>
          </div>
          <h3>01</h3>
          <small>Evaluation unlocks tomorrow</small>
        </article>
      </section>

      <section className="dashboard-main-activity">
        <div className="dashboard-main-activity-head">
          <div>
            <h2>Activity</h2>
            <p>Recent updates from your workspace</p>
          </div>
          <button type="button" aria-label="More activity actions">...</button>
        </div>

        <div className="dashboard-main-activity-list">
          <article className="dashboard-main-activity-item">
            <div className="dashboard-main-activity-badge muted">98%</div>
            <div className="dashboard-main-activity-copy">
              <h3>Quiz Score: React Hooks</h3>
              <p>27 Feb, 2026</p>
            </div>
            <span>↗</span>
          </article>

          <article className="dashboard-main-activity-item">
            <div className="dashboard-main-activity-badge muted">x2</div>
            <div className="dashboard-main-activity-copy">
              <h3>Productivity Streak</h3>
              <p>Increased limits on tasks</p>
            </div>
            <span>↗</span>
          </article>

          <article className="dashboard-main-activity-item">
            <div className="dashboard-main-activity-badge muted">2%</div>
            <div className="dashboard-main-activity-copy">
              <h3>Optimization Bonus</h3>
              <p>Code quality improvement</p>
            </div>
            <span>↗</span>
          </article>

          <article className="dashboard-main-activity-item">
            <div className="dashboard-main-activity-badge muted">◉</div>
            <div className="dashboard-main-activity-copy">
              <h3>Profile Sync Complete</h3>
              <p>+69 969 355 2175</p>
            </div>
            <span>↗</span>
          </article>
        </div>
      </section>
    </div>
  )

  const renderLessonsPanel = () => (
    <div className="dashboard-lessons-shell">
      <section className="dashboard-lessons-hero">
        <p>Internal Workspace</p>
        <h1>Lessons Center</h1>
        <span>Review active modules, upcoming sessions, and learning milestones.</span>
      </section>

      <section className="dashboard-lessons-tracks-head">
        <h2>Featured Learning Tracks</h2>
        <p>Next class in 02:10:25</p>
      </section>

      <section className="dashboard-lessons-tracks-grid">
        {lessonTracks.map((track) => (
          <article key={track.title} className="dashboard-lessons-track-card">
            <div className="dashboard-lessons-track-image-wrap">
              <img src={track.image} alt={track.title} loading="lazy" />
              <span>{track.label}</span>
            </div>
            <div className="dashboard-lessons-track-content">
              <h3>{track.title}</h3>
              <p>{track.description}</p>
              <ul>
                {track.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard-lessons-course">
        <div className="dashboard-lessons-course-head">
          <div>
            <p>Active Course</p>
            <h3>Web Development</h3>
            <span>Build and ship a production-ready React app with clean architecture and accessibility.</span>
          </div>
          <b>5 Modules</b>
        </div>

        <div className="dashboard-lessons-course-grid">
          <div className="dashboard-lessons-module-list">
            <small>Course Modules</small>
            {courseModules.map((module, index) => (
              <button
                key={module.title}
                type="button"
                className={index === activeModuleIndex ? 'active' : ''}
                onClick={() => setActiveModuleIndex(index)}
              >
                <span>{module.title}</span>
                <em>{module.duration}</em>
              </button>
            ))}
          </div>

          <article className="dashboard-lessons-detail-card">
            <small>Current Lesson</small>
            <h4>{activeModule.title}</h4>
            <img
              className="dashboard-lessons-detail-image"
              src={activeModule.image}
              alt={activeModule.title}
              loading="lazy"
            />

            <small>Objective</small>
            <p>{activeModule.objective}</p>

            <small>Lesson Content</small>
            <p>{activeModule.content}</p>

            <div className="dashboard-lessons-task">
              <small>Hands-on Task</small>
              <p>Audit an existing app and improve its performance score by 20%.</p>
            </div>
          </article>
        </div>
      </section>
    </div>
  )

  const renderReportsPanel = () => (
    <div className="dashboard-reports-shell">
      <section className="dashboard-reports-hero">
        <p>Internal Workspace</p>
        <h1>Reports Center</h1>
        <span>Monitor performance, quality trends, and delivery outcomes.</span>
      </section>

      <section className="dashboard-reports-grid">
        <article className="dashboard-reports-timeline">
          <div className="dashboard-reports-title-row">
            <h2>Performance Timeline</h2>
            <span>↗↗</span>
          </div>

          <div className="dashboard-reports-metric">
            <div>
              <b>Code Quality</b>
              <strong>92%</strong>
            </div>
            <i><em style={{ width: '92%' }} /></i>
          </div>

          <div className="dashboard-reports-metric">
            <div>
              <b>Prompt Reliability</b>
              <strong>87%</strong>
            </div>
            <i><em className="is-accent" style={{ width: '87%' }} /></i>
          </div>

          <div className="dashboard-reports-metric">
            <div>
              <b>Delivery Speed</b>
              <strong>90%</strong>
            </div>
            <i><em style={{ width: '90%' }} /></i>
          </div>
        </article>

        <article className="dashboard-reports-latest">
          <div className="dashboard-reports-title-row">
            <h2>Latest Reports</h2>
          </div>

          <div className="dashboard-reports-list">
            <div className="dashboard-reports-item">
              <span>📖</span>
              <b>Weekly Internship Health</b>
              <small>Updated 2h ago</small>
            </div>
            <div className="dashboard-reports-item">
              <span>📖</span>
              <b>Prompt Accuracy Summary</b>
              <small>Updated yesterday</small>
            </div>
            <div className="dashboard-reports-item">
              <span>📖</span>
              <b>Frontend Delivery Metrics</b>
              <small>Updated 3 days ago</small>
            </div>
          </div>

          <button type="button" className="dashboard-reports-archive-btn">View Archive</button>
        </article>
      </section>
    </div>
  )

  return (
    <main className="dashboard-page">
      <section className="dashboard-basic-layout">
        <aside className="dashboard-basic-sidebar">
          <div className="dashboard-basic-sidebar-head">
            <div className="dashboard-basic-brand">
              <img
                src="https://framerusercontent.com/images/Ca8ppNsvJIfTsWEuHr50gvkDow.png?scale-down-to=1024&width=2624&height=474"
                alt="Lifewood"
                loading="lazy"
              />
            </div>
            <button type="button" className="dashboard-basic-menu-btn" aria-label="Open sidebar menu">
              <IconMenu2 size={19} />
            </button>
          </div>

          <p className="dashboard-basic-menu-label">Menu</p>

          <nav className="dashboard-basic-nav" aria-label="Dashboard Sidebar">
            <a
              href="#"
              className={activePanel === 'dashboard' ? 'active' : ''}
              onClick={(event) => {
                event.preventDefault()
                setActivePanel('dashboard')
              }}
            >
              <span>
                <IconLayoutDashboard size={18} />
                Dashboard
              </span>
              {activePanel === 'dashboard' ? <IconChevronRight size={16} /> : null}
            </a>
            <a
              href="#"
              className={activePanel === 'lessons' ? 'active' : ''}
              onClick={(event) => {
                event.preventDefault()
                setActivePanel('lessons')
              }}
            >
              <span>
                <IconBook2 size={18} />
                Lessons
              </span>
              {activePanel === 'lessons' ? <IconChevronRight size={16} /> : null}
            </a>
            <a
              href="#"
              className={activePanel === 'reports' ? 'active' : ''}
              onClick={(event) => {
                event.preventDefault()
                setActivePanel('reports')
              }}
            >
              <span>
                <IconReport size={18} />
                Reports
              </span>
              {activePanel === 'reports' ? <IconChevronRight size={16} /> : null}
            </a>
          </nav>

          <button type="button" className="dashboard-basic-logout" onClick={() => setIsLogoutModalOpen(true)}>
            <IconLogout size={18} />
            Logout
          </button>
        </aside>
        <section className="dashboard-basic-content">
          {activePanel === 'dashboard' && renderDashboardOverview()}
          {activePanel === 'lessons' && renderLessonsPanel()}
          {activePanel === 'reports' && renderReportsPanel()}
        </section>
      </section>

      <AnimatePresence>
        {isProfileModalOpen ? (
          <motion.div
            className="dashboard-profile-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsProfileModalOpen(false)}
          >
            <motion.section
              className="dashboard-profile-modal"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="dashboard-profile-modal-close"
                aria-label="Close profile modal"
                onClick={() => setIsProfileModalOpen(false)}
              >
                <IconX size={18} />
              </button>

              <div className="dashboard-profile-modal-head">
                <h2>Edit Profile</h2>
                <p>Update your personal details</p>
              </div>

              <div className="dashboard-profile-modal-body">
                <div className="dashboard-profile-avatar-block">
                  <div className="dashboard-profile-avatar-wrap">
                    <button type="button" aria-label="Change profile photo">
                      <IconCamera size={16} />
                    </button>
                  </div>
                  <span>Tap to change</span>
                </div>

                <form className="dashboard-profile-form" onSubmit={(event) => event.preventDefault()}>
                  <label>
                    First Name
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(event) => handleProfileFieldChange('firstName', event.target.value)}
                    />
                  </label>
                  <label>
                    Last Name
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(event) => handleProfileFieldChange('lastName', event.target.value)}
                    />
                  </label>
                  <label className="full">
                    Gmail / Email
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(event) => handleProfileFieldChange('email', event.target.value)}
                    />
                  </label>
                  <label className="full">
                    Phone Number
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(event) => handleProfileFieldChange('phone', event.target.value)}
                    />
                  </label>
                  <label className="full">
                    School / University
                    <select
                      value={profileForm.school}
                      onChange={(event) => handleProfileFieldChange('school', event.target.value)}
                    >
                      <option>University of Cebu</option>
                      <option>Cebu Institute of Technology</option>
                      <option>University of San Carlos</option>
                      <option>University of the Philippines</option>
                    </select>
                  </label>
                </form>
              </div>

              <div className="dashboard-profile-modal-actions">
                <button type="button" onClick={() => setIsProfileModalOpen(false)}>
                  <IconDeviceFloppy size={16} />
                  Save Changes
                </button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

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
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to logout?</p>
              <div className="dashboard-logout-modal-actions">
                <button type="button" onClick={() => setIsLogoutModalOpen(false)}>Cancel</button>
                <button
                  type="button"
                  className="confirm"
                  onClick={() => {
                    setIsLogoutModalOpen(false)
                    onNavigate('/get-started')
                  }}
                >
                  Yes, Logout
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
