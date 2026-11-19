import { useMemo, useState } from "react";

const initialJobs = [
  {
    id: 1,
    title: "Junior Software Developer",
    company: "CapeTech Solutions",
    location: "Cape Town, Western Cape",
    province: "Western Cape",
    salary: "R18 000 - R25 000",
    type: "Full-time",
    level: "Entry-level",
    category: "Information Technology",
    posted: "2026-11-18",
    closing: "2026-12-05",
    description:
      "Build and maintain responsive web applications for South African clients.",
    responsibilities:
      "Write maintainable code, assist with testing, fix bugs and participate in team reviews.",
    qualifications:
      "Diploma or degree in Computer Science, IT or a related field.",
    skills: ["JavaScript", "React", "Git"],
  },
  {
    id: 2,
    title: "Marketing Assistant",
    company: "Ubuntu Brands",
    location: "Durban, KwaZulu-Natal",
    province: "KwaZulu-Natal",
    salary: "R12 000 - R16 000",
    type: "Full-time",
    level: "Graduate",
    category: "Marketing",
    posted: "2026-11-16",
    closing: "2026-11-30",
    description:
      "Support campaigns, content planning, social media and market research.",
    responsibilities:
      "Prepare reports, schedule content and coordinate marketing activities.",
    qualifications:
      "Diploma or degree in Marketing or Communications.",
    skills: ["Social media", "Copywriting", "Microsoft Office"],
  },
  {
    id: 3,
    title: "Remote Data Analyst",
    company: "DataFoundry SA",
    location: "Remote",
    province: "National",
    salary: "R22 000 - R32 000",
    type: "Contract",
    level: "Mid-level",
    category: "Information Technology",
    posted: "2026-11-15",
    closing: "2026-12-10",
    description:
      "Analyse business data and present actionable insights.",
    responsibilities:
      "Create dashboards, clean data and support data-driven decisions.",
    qualifications:
      "Relevant degree or 2+ years of related work experience.",
    skills: ["SQL", "Excel", "Power BI"],
  },
];

const roleLabels = {
  seeker: "Job Seeker",
  employer: "Employer",
  admin: "Administrator",
};

function Icon({ children }) {
  return <span className="icon" aria-hidden="true">{children}</span>;
}

function App() {
  const [page, setPage] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState(initialJobs);
  const [savedJobs, setSavedJobs] = useState([2]);
  const [applications, setApplications] = useState([
    { id: 1, jobId: 1, status: "Under Review", date: "2026-11-18" },
  ]);
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState(null);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(window.jobConnectToast);
    window.jobConnectToast = window.setTimeout(() => setToast(""), 3000);
  };

  const navigate = (nextPage) => {
    setPage(nextPage);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openJob = (job) => {
    setSelectedJob(job);
    navigate("job-details");
  };

  const toggleSavedJob = (jobId) => {
    const isSaved = savedJobs.includes(jobId);
    setSavedJobs((current) =>
      isSaved
        ? current.filter((id) => id !== jobId)
        : [...current, jobId],
    );
    showToast(isSaved ? "Job removed from saved jobs." : "Job saved.");
  };

  const applyForJob = (job) => {
    if (!user) {
      navigate("login");
      showToast("Please log in before applying.");
      return;
    }

    if (applications.some((application) => application.jobId === job.id)) {
      showToast("You have already applied for this vacancy.");
      return;
    }

    setModal({
      title: "Submit application",
      message: `Submit your application for ${job.title}?`,
      action: () => {
        setApplications((current) => [
          ...current,
          {
            id: Date.now(),
            jobId: job.id,
            status: "Submitted",
            date: new Date().toISOString().slice(0, 10),
          },
        ]);
        setModal(null);
        navigate("applications");
        showToast("Application submitted successfully.");
      },
    });
  };

  const logout = () => {
    setUser(null);
    navigate("home");
    showToast("You have been logged out.");
  };

  return (
    <div className="app">
      {toast && <div className="toast" role="status">{toast}</div>}

      {user ? (
        <DashboardLayout
          user={user}
          page={page}
          navigate={navigate}
          logout={logout}
        >
          {renderDashboardPage()}
        </DashboardLayout>
      ) : (
        <>
          <PublicHeader
            page={page}
            navigate={navigate}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
          <main>
            {page === "home" && (
              <HomePage
                navigate={navigate}
                openJob={openJob}
                toggleSavedJob={toggleSavedJob}
                savedJobs={savedJobs}
              />
            )}
            {page === "jobs" && (
              <BrowseJobs
                jobs={jobs}
                openJob={openJob}
                toggleSavedJob={toggleSavedJob}
                savedJobs={savedJobs}
              />
            )}
            {page === "job-details" && selectedJob && (
              <JobDetails
                job={selectedJob}
                navigate={navigate}
                applyForJob={applyForJob}
                toggleSavedJob={toggleSavedJob}
                isSaved={savedJobs.includes(selectedJob.id)}
              />
            )}
            {page === "companies" && <CompaniesPage navigate={navigate} />}
            {page === "about" && <AboutPage />}
            {page === "login" && (
              <LoginPage
                setUser={setUser}
                navigate={navigate}
                showToast={showToast}
              />
            )}
            {page === "register" && (
              <RegistrationPage
                setUser={setUser}
                navigate={navigate}
                showToast={showToast}
              />
            )}
            {page === "forgot" && (
              <ForgotPasswordPage navigate={navigate} showToast={showToast} />
            )}
          </main>
          <Footer navigate={navigate} />
        </>
      )}

      {modal && (
        <Modal
          title={modal.title}
          message={modal.message}
          action={modal.action}
          close={() => setModal(null)}
        />
      )}
    </div>
  );

  function renderDashboardPage() {
    if (user.role === "seeker") {
      if (page === "dashboard") {
        return (
          <SeekerDashboard
            navigate={navigate}
            applications={applications}
            jobs={jobs}
            openJob={openJob}
          />
        );
      }
      if (page === "profile") return <ProfilePage showToast={showToast} />;
      if (page === "saved") {
        return (
          <SavedJobsPage
            jobs={jobs.filter((job) => savedJobs.includes(job.id))}
            openJob={openJob}
            applyForJob={applyForJob}
            toggleSavedJob={toggleSavedJob}
          />
        );
      }
      if (page === "applications") {
        return (
          <ApplicationsPage
            jobs={jobs}
            applications={applications}
            openJob={openJob}
            setModal={setModal}
            setApplications={setApplications}
            showToast={showToast}
          />
        );
      }
    }

    if (user.role === "employer") {
      if (page === "dashboard") {
        return <EmployerDashboard navigate={navigate} />;
      }
      if (page === "company-profile") {
        return <CompanyProfilePage showToast={showToast} />;
      }
      if (page === "manage-jobs") {
        return (
          <ManageJobsPage
            jobs={jobs}
            setJobs={setJobs}
            showToast={showToast}
          />
        );
      }
      if (page === "applicants") {
        return <ManageApplicantsPage showToast={showToast} />;
      }
    }

    if (user.role === "admin") {
      if (page === "dashboard") {
        return <AdminDashboard navigate={navigate} />;
      }
      if (page === "admin-management") {
        return <AdminManagementPage showToast={showToast} />;
      }
    }

    return (
      <div className="empty-state">
        <h2>Page not found</h2>
        <button className="btn btn-primary" onClick={() => navigate("dashboard")}>
          Return to dashboard
        </button>
      </div>
    );
  }
}

function PublicHeader({
  page,
  navigate,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  const links = [
    ["home", "Home"],
    ["jobs", "Jobs"],
    ["companies", "Companies"],
    ["about", "About"],
  ];

  return (
    <header className="public-header">
      <div className="container header-inner">
        <button className="brand" onClick={() => navigate("home")}>
          <span className="brand-mark">J</span>
          <span>JobConnect <strong>SA</strong></span>
        </button>

        <button
          className="menu-button"
          aria-label="Toggle navigation"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          ☰
        </button>

        <nav className={mobileMenuOpen ? "nav open" : "nav"}>
          {links.map(([key, label]) => (
            <button
              key={key}
              className={page === key ? "nav-link active" : "nav-link"}
              onClick={() => navigate(key)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => navigate("login")}>
            Login
          </button>
          <button className="btn btn-primary" onClick={() => navigate("register")}>
            Register
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">JobConnect SA</div>
          <p>Connecting South African talent with opportunity.</p>
        </div>
        <div>
          <h4>Platform</h4>
          <button onClick={() => navigate("jobs")}>Browse jobs</button>
          <button onClick={() => navigate("companies")}>Companies</button>
          <button onClick={() => navigate("about")}>About us</button>
        </div>
        <div>
          <h4>Legal</h4>
          <button>Privacy Policy</button>
          <button>Terms &amp; Conditions</button>
        </div>
        <div>
          <h4>Contact</h4>
          <p>hello@jobconnectsa.co.za</p>
          <p>South Africa</p>
        </div>
      </div>
      <div className="container footer-bottom">
        © 2026 JobConnect SA. All rights reserved.
      </div>
    </footer>
  );
}

function HomePage({ navigate, openJob, toggleSavedJob, savedJobs }) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const featuredJobs = initialJobs.slice(0, 3);

  const searchJobs = (event) => {
    event.preventDefault();
    navigate("jobs");
  };

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Recruitment built for South Africa</span>
            <h1>Find work that moves you forward.</h1>
            <p>
              Discover jobs, internships and graduate opportunities from
              verified companies across South Africa.
            </p>

            <form className="search-box" onSubmit={searchJobs}>
              <label>
                <span>Job title or keyword</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="e.g. Junior Developer"
                />
              </label>
              <label>
                <span>Location</span>
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="e.g. Cape Town"
                />
              </label>
              <button className="btn btn-accent" type="submit">
                Search Jobs
              </button>
            </form>

            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => navigate("jobs")}>
                Find Jobs
              </button>
              <button className="btn btn-secondary" onClick={() => navigate("register")}>
                Create Account
              </button>
            </div>
          </div>

          <div className="hero-card" aria-label="Platform summary">
            <div className="hero-card-header">
              <div>
                <span>Opportunities</span>
                <strong>2,400+</strong>
              </div>
              <span className="status-dot">Live</span>
            </div>
            <div className="floating-job">
              <span className="company-avatar">CT</span>
              <div>
                <strong>Junior Developer</strong>
                <p>Cape Town · R18k–R25k</p>
              </div>
              <span className="match">95% match</span>
            </div>
            <div className="floating-job">
              <span className="company-avatar green">D</span>
              <div>
                <strong>Data Analyst</strong>
                <p>Remote · R22k–R32k</p>
              </div>
              <span className="match">91% match</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Explore categories"
            title="Popular job categories"
            action="View all jobs"
            onAction={() => navigate("jobs")}
          />
          <div className="category-grid">
            {[
              ["Information Technology", "248 jobs", "💻"],
              ["Finance", "186 jobs", "📊"],
              ["Marketing", "129 jobs", "📣"],
              ["Healthcare", "94 jobs", "🏥"],
              ["Engineering", "173 jobs", "⚙️"],
              ["Education", "82 jobs", "🎓"],
            ].map(([title, count, icon]) => (
              <button
                className="category-card"
                key={title}
                onClick={() => navigate("jobs")}
              >
                <span className="category-icon">{icon}</span>
                <div>
                  <strong>{title}</strong>
                  <span>{count}</span>
                </div>
                <span className="arrow">→</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <SectionHeading
            eyebrow="Latest opportunities"
            title="Featured vacancies"
            action="View All Jobs"
            onAction={() => navigate("jobs")}
          />
          <div className="job-grid">
            {featuredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                openJob={openJob}
                isSaved={savedJobs.includes(job.id)}
                toggleSavedJob={toggleSavedJob}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Simple and effective"
            title="How it works"
          />
          <div className="steps-grid">
            {[
              ["1", "Create your profile", "Tell employers about your experience and skills."],
              ["2", "Find the right job", "Search and filter vacancies across South Africa."],
              ["3", "Apply and track", "Submit your CV and follow every application."],
            ].map(([number, title, text]) => (
              <div className="step-card" key={number}>
                <span className="step-number">{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ eyebrow, title, action, onAction }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {action && (
        <button className="text-button" onClick={onAction}>
          {action} <span>→</span>
        </button>
      )}
    </div>
  );
}

function JobCard({
  job,
  openJob,
  isSaved,
  toggleSavedJob,
  showApply,
  applyForJob,
}) {
  return (
    <article className="job-card">
      <div className="job-card-top">
        <span className="company-avatar">
          {job.company
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)}
        </span>
        <button
          className={isSaved ? "save-button saved" : "save-button"}
          onClick={() => toggleSavedJob(job.id)}
          aria-label={isSaved ? "Remove saved job" : "Save job"}
        >
          {isSaved ? "♥" : "♡"}
        </button>
      </div>
      <span className="job-type">{job.type}</span>
      <h3>{job.title}</h3>
      <p className="company-name">{job.company}</p>
      <p className="job-location">📍 {job.location}</p>
      <p className="job-salary">{job.salary}</p>
      <div className="job-card-actions">
        <button className="btn btn-secondary" onClick={() => openJob(job)}>
          View Details
        </button>
        {showApply && (
          <button className="btn btn-primary" onClick={() => applyForJob(job)}>
            Apply Now
          </button>
        )}
      </div>
    </article>
  );
}

function BrowseJobs({ jobs, openJob, toggleSavedJob, savedJobs }) {
  const [keyword, setKeyword] = useState("");
  const [company, setCompany] = useState("");
  const [province, setProvince] = useState("");
  const [type, setType] = useState("");
  const [level, setLevel] = useState("");
  const [sort, setSort] = useState("newest");

  const filteredJobs = useMemo(() => {
    let results = jobs.filter((job) => {
      const matchesKeyword =
        !keyword ||
        `${job.title} ${job.description} ${job.category}`
          .toLowerCase()
          .includes(keyword.toLower());
      const matchesCompany =
        !company ||
        job.company.toLower();
      const matchesProvince =
        !province || job.province === province;
      const matchesType = !type || job.type === type;
      const matchesLevel = !level || job.level === level;

      return (
        matchesKeyword &&
        matchesCompany &&
        matchesProvince &&
        matchesType &&
        matchesLevel
      );
    });

    if (sort === "newest") {
      results = [...results].sort((a, b) =>
        b.posted.localeCompare(a.posted),
      );
    }

    if (sort === "title") {
      results = [...results].sort((a, b) =>
        a.title.localeCompare(b.title),
      );
    }

    return results;
  }, [jobs, keyword, company, province, type, level, sort]);

  const clearFilters = () => {
    setKeyword("");
    setCompany("");
    setProvince("");
    setType("");
    setLevel("");
  };

  return (
    <div className="page-shell">
      <div className="page-banner">
        <div className="container">
          <span className="eyebrow">Start your search</span>
          <h1>Browse Jobs</h1>
          <p>Find opportunities that match your skills and goals.</p>
        </div>
      </div>

      <div className="container browse-layout">
        <aside className="filters">
          <div className="filter-header">
            <h2>Filters</h2>
            <button onClick={clearFilters}>Clear all</button>
          </div>

          <label className="form-field">
            <span>Keyword</span>
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Job title or skill"
            />
          </label>

          <label className="form-field">
            <span>Company</span>
            <input
              value={company}
              onChange={(event) =>
                setCompany(event.target.value.toLowerCase())
              }
              placeholder="Company name"
            />
          </label>

          <label className="form-field">
            <span>Province</span>
            <select
              value={province}
              onChange={(event) => setProvince(event.target.value)}
            >
              <option value="">All provinces</option>
              <option>Gauteng</option>
              <option>Western Cape</option>
              <option>KwaZulu-Natal</option>
              <option>Eastern Cape</option>
              <option>National</option>
            </select>
          </label>

          <label className="form-field">
            <span>Employment type</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="">All types</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </label>

          <label className="form-field">
            <span>Experience level</span>
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
            >
              <option value="">All levels</option>
              <option>Entry-level</option>
              <option>Graduate</option>
              <option>Mid-level</option>
              <option>Senior</option>
            </select>
          </label>
        </aside>

        <div className="results">
          <div className="results-header">
            <p>
              <strong>{filteredJobs.length}</strong> vacancies found
            </p>
            <label>
              Sort by
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="title">Job title</option>
              </select>
            </label>
          </div>

          {filteredJobs.length ? (
            <div className="job-grid">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  openJob={openJob}
                  isSaved={savedJobs.includes(job.id)}
                  toggleSavedJob={toggleSavedJob}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No vacancies found</h2>
              <p>Try changing or clearing your filters.</p>
              <button className="btn btn-primary" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function JobDetails({
  job,
  navigate,
  applyForJob,
  toggleSavedJob,
  isSaved,
}) {
  return (
    <div className="page-shell">
      <div className="container detail-layout">
        <div className="detail-main">
          <button className="text-button back-button" onClick={() => navigate("jobs")}>
            ← Back to jobs
          </button>

          <article className="detail-card">
            <div className="detail-header">
              <span className="company-avatar large">
                {job.company
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)}
              </span>
              <div>
                <span className="job-type">{job.type}</span>
                <h1>{job.title}</h1>
                <p>{job.company}</p>
                <p>📍 {job.location}</p>
              </div>
            </div>

            <div className="detail-meta">
              <div>
                <span>Salary</span>
                <strong>{job.salary}</strong>
              </div>
              <div>
                <span>Experience</span>
                <strong>{job.level}</strong>
              </div>
              <div>
                <span>Closing date</span>
                <strong>{job.closing}</strong>
              </div>
            </div>

            <section className="detail-section">
              <h2>Job description</h2>
              <p>{job.description}</p>
            </section>

            <section className="detail-section">
              <h2>Responsibilities</h2>
              <p>{job.responsibilities}</p>
            </section>

            <section className="detail-section">
              <h2>Minimum qualifications</h2>
              <p>{job.qualifications}</p>
            </section>

            <section className="detail-section">
              <h2>Required skills</h2>
              <div className="skill-list">
                {job.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </section>
          </article>
        </div>

        <aside className="detail-sidebar">
          <button
            className="btn btn-primary full-width"
            onClick={() => applyForJob(job)}
          >
            Apply Now
          </button>
          <button
            className="btn btn-secondary full-width"
            onClick={() => toggleSavedJob(job.id)}
          >
            {isSaved ? "Remove Saved Job" : "Save Job"}
          </button>
          <button
            className="btn btn-ghost full-width"
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
          >
            Share Job
          </button>
        </aside>
      </div>
    </div>
  );
}

function CompaniesPage({ navigate }) {
  const companies = [
    ["CapeTech Solutions", "Information Technology", "Cape Town", "CT"],
    ["Ubuntu Brands", "Marketing", "Durban", "UB"],
    ["DataFoundry SA", "Data & Analytics", "Remote", "DF"],
    ["Mzansi Health", "Healthcare", "Johannesburg", "MH"],
  ];

  return (
    <div className="page-shell">
      <div className="page-banner">
        <div className="container">
          <span className="eyebrow">Recruiter directory</span>
          <h1>Companies</h1>
          <p>Discover organisations recruiting across South Africa.</p>
        </div>
      </div>
      <div className="container">
        <div className="company-grid">
          {companies.map(([name, industry, location, initials]) => (
            <article className="company-card" key={name}>
              <span className="company-avatar large">{initials}</span>
              <h2>{name}</h2>
              <p>{industry}</p>
              <p>📍 {location}</p>
              <button className="btn btn-secondary" onClick={() => navigate("jobs")}>
                View Vacancies
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  const [sent, setSent] = useState(false);

  const submit = (event) => {
    event.preventEvent();
  };

  return (
    <div className="page-shell">
      <div className="page-banner">
        <div className="container">
          <span className="eyebrow">About JobConnect SA</span>
          <h1>Helping South Africans find meaningful work</h1>
        </div>
      </div>

      <div className="container content-grid">
        <div className="content-card">
          <h2>Our mission</h2>
          <p>
            JobConnect SA connects job seekers with organisations using clear,
            accessible and role-focused recruitment tools.
          </p>

          <h2>Frequently asked questions</h2>
          <details>
            <summary>Is JobConnect SA free for job seekers?</summary>
            <p>Yes. Job seekers can register and apply to vacancies at no cost.</p>
          </details>
          <details>
            <summary>How do employers post jobs?</summary>
            <p>
              Employers register a company, complete verification and publish
              an approved job advertisement.
            </p>
          </details>
        </div>

        <form
          className="content-card"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
        >
          <h2>Contact us</h2>
          {sent ? (
            <div className="success-message">
              Your message has been prepared for submission.
            </div>
          ) : (
            <>
              <label className="form-field">
                <span>Name</span>
                <input required placeholder="Your full name" />
              </label>
              <label className="form-field">
                <span>Email</span>
                <input required type="email" placeholder="you@example.com" />
              </label>
              <label className="form-field">
                <span>Message</span>
                <textarea required rows="5" placeholder="How can we help?" />
              </label>
              <button className="btn btn-primary full-width" type="submit">
                Send Message
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

function LoginPage({ setUser, navigate, showToast }) {
  const [role, setRole] = useState("seeker");
  const [showPassword, setShowPassword] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    setUser({
      name: role === "seeker" ? "Thandi Mokoena" : role === "employer" ? "Lerato Dlamini" : "Platform Admin",
      email: event.currentTarget.email.value,
      role,
    });

    navigate("dashboard");
    showToast(`Welcome back, ${roleLabels[role]}.`);
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <span className="brand-mark auth-mark">J</span>
        <h1>Welcome back</h1>
        <p>Sign in to continue to JobConnect SA.</p>

        <label className="form-field">
          <span>Email address</span>
          <input name="email" type="email" required placeholder="you@example.com" />
        </label>

        <label className="form-field password-field">
          <span>Password</span>
          <div className="password-input">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength="6"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((show) => !show)}
              aria-label="Show or hide password"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <label className="form-field">
          <span>Demo account role</span>
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="seeker">Job seeker</option>
            <option value="employer">Employer</option>
            <option value="admin">Administrator</option>
          </select>
        </label>

        <div className="auth-options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <button type="button" className="text-button" onClick={() => navigate("forgot")}>
            Forgot password?
          </button>
        </div>

        <button className="btn btn-primary full-width" type="submit">
          Login
        </button>

        <p className="auth-switch">
          No account?{" "}
          <button type="button" onClick={() => navigate("register")}>
            Create one
          </button>
        </p>
      </form>
    </div>
  );
}

function RegistrationPage({ setUser, navigate, showToast }) {
  const [accountType, setAccountType] = useState("seeker");
  const [showPassword, setShowPassword] = useState(false);

  const submit = (event) => {
    event.preventEvent();
  };

  return (
    <div className="auth-page">
      <form
        className="auth-card registration-card"
        onSubmit={(event) => {
          event.preventDefault();

          const name = event.currentTarget.name.value;
          const email = event.currentTarget.email.value;
          const password = event.currentTarget.password.value;
          const confirm = event.currentTarget.confirm.value;

          if (password !== confirm) {
            showToast("Passwords do not match.");
            return;
          }

          setUser({
            name,
            email,
            role: accountType,
          });

          navigate("dashboard");
          showToast("Account created successfully.");
        }}
      >
        <h1>Create an account</h1>
        <p>Choose the account that fits your needs.</p>

        <div className="role-selector">
          <button
            type="button"
            className={accountType === "seeker" ? "selected" : ""}
            onClick={() => setAccountType("seeker")}
          >
            <strong>Job seeker</strong>
            <span>Find and apply for jobs</span>
          </button>
          <button
            type="button"
            className={accountType === "employer" ? "selected" : ""}
            onClick={() => setAccountType("employer")}
          >
            <strong>Employer</strong>
            <span>Post jobs and hire</span>
          </button>
        </div>

        {accountType === "seeker" ? (
          <>
            <label className="form-field">
              <span>Full name</span>
              <input name="name" required placeholder="Full name" />
            </label>
          </>
        ) : (
          <>
            <label className="form-field">
              <span>Contact person's name</span>
              <input name="name" required placeholder="Contact person" />
            </label>
            <label className="form-field">
              <span>Company name</span>
              <input name="company" required placeholder="Company name" />
            </label>
          </>
        )}

        <label className="form-field">
          <span>{accountType === "seeker" ? "Email address" : "Business email"}</span>
          <input name="email" type="email" required placeholder="you@example.com" />
        </label>

        {accountType === "seeker" && (
          <label className="form-field">
            <span>Phone number <small>(optional)</small></span>
            <input name="phone" type="tel" placeholder="+27..." />
          </label>
        )}

        <label className="form-field">
          <span>Password</span>
          <div className="password-input">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength="6"
            />
            <button type="button" onClick={() => setShowPassword((show) => !show)}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <label className="form-field">
          <span>Confirm password</span>
          <input name="confirm" type="password" required minLength="6" />
        </label>

        <label className="consent">
          <input type="checkbox" required />
          <span>I agree to the Privacy Policy and Terms &amp; Conditions.</span>
        </label>

        <button className="btn btn-primary full-width" type="submit">
          Create Account
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <button type="button" onClick={() => navigate("login")}>
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

function ForgotPasswordPage({ navigate, showToast }) {
  const submit = (event) => {
    event.preventDefault();
    showToast("If that account exists, a reset link has been sent.");
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Reset your password</h1>
        <p>Enter your email address to receive reset instructions.</p>

        <label className="form-field">
          <span>Email address</span>
          <input type="email" required placeholder="you@example.com" />
        </label>

        <button className="btn btn-primary full-width" type="submit">
          Send Reset Link
        </button>
        <button
          className="btn btn-ghost full-width"
          type="button"
          onClick={() => navigate("login")}
        >
          Return to Login
        </button>
      </form>
    </div>
  );
}

function DashboardLayout({ user, page, navigate, logout, children }) {
  const seekerLinks = [
    ["dashboard", "Dashboard"],
    ["profile", "My Profile"],
    ["saved", "Saved Jobs"],
    ["applications", "Applications"],
  ];

  const employerLinks = [
    ["dashboard", "Dashboard"],
    ["company-profile", "Company Profile"],
    ["manage-jobs", "Manage Vacancies"],
    ["applicants", "Manage Applicants"],
  ];

  const adminLinks = [
    ["dashboard", "Dashboard"],
    ["admin-management", "Management"],
  ];

  const links =
    user.role === "seeker"
      ? seekerLinks
      : user.role === "employer"
        ? employerLinks
        : adminLinks;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <button className="brand sidebar-brand" onClick={() => navigate("dashboard")}>
          <span className="brand-mark">J</span>
          <span>JobConnect <strong>SA</strong></span>
        </button>

        <div className="sidebar-account">
          <span className="account-avatar">
            {user.name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)}
          </span>
          <div>
            <strong>{user.name}</strong>
            <span>{roleLabels[user.role]}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-label">MY ACCOUNT</span>
          {links.map(([key, label]) => (
            <button
              key={key}
              className={page === key ? "active" : ""}
              onClick={() => navigate(key)}
            >
              {label}
            </button>
          ))}

          {user.role === "seeker" && (
            <button onClick={() => {
              window.location.hash = "#/browse";
              navigate("jobs");
            }}>
              Find Jobs
            </button>
          )}
        </nav>

        <button className="sidebar-logout" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div>
            <span>Welcome back,</span>
            <strong>{user.name}</strong>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

function SeekerDashboard({ navigate, applications, jobs, openJob }) {
  return (
    <div className="dashboard-content">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">Job seeker dashboard</span>
          <h1>Your job search overview</h1>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("profile")}>
          Complete Profile
        </button>
      </div>

      <div className="stat-grid">
        <StatCard title="Applications" value={applications.length} />
        <StatCard title="Saved jobs" value="5" />
        <StatCard title="Profile" value="72%" />
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="card-heading">
            <h2>Recent applications</h2>
            <button onClick={() => navigate("applications")}>View all</button>
          </div>
          {applications.map((application) => {
            const job = jobs.find((item) => item.id === application.jobId);
            return (
              <button
                className="application-row"
                key={application.id}
                onClick={() => job && openJob(job)}
              >
                <span className="company-avatar">
                  {job?.company.slice(0, 2).toUpper()}
                </span>
                <div>
                  <strong>{job?.title}</strong>
                  <span>{job?.company}</span>
                </div>
                <span className={`status status-${application.status.toLowerCase().replaceAll(" ", "-")}`}>
                  {application.status}
                </span>
              </button>
            );
          })}
        </section>

        <section className="dashboard-card">
          <div className="card-heading">
            <h2>Recommended vacancies</h2>
            <button onClick={() => navigate("saved")}>See saved jobs</button>
          </div>
          {jobs.slice(0, 2).map((job) => (
            <button
              className="recommendation-row"
              key={job.id}
              onClick={() => openJob(job)}
            >
              <div>
                <strong>{job.title}</strong>
                <span>{job.company} · {job.location}</span>
              </div>
              <span>→</span>
            </button>
          ))}
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <article className="stat-card">
      <span>{title}</span>
      <strong>{value}</strong>
    </article>
  );
}

function ProfilePage({ showToast }) {
  const [cvName, setCvName] = useState("");

  const saveProfile = (event) => {
    event.preventDefault();
    showToast("Profile changes saved.");
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">My account</span>
          <h1>Profile &amp; CV</h1>
        </div>
      </div>

      <div className="profile-layout">
        <form className="dashboard-card profile-form" onSubmit={saveProfile}>
          <h2>Personal information</h2>
          <div className="form-grid">
            <label className="form-field">
              <span>Full name</span>
              <input defaultValue="Thandi Mokoena" />
            </label>
            <label className="form-field">
              <span>Email address</span>
              <input type="email" defaultValue="thandi@example.com" />
            </label>
            <label className="form-field">
              <span>Phone number</span>
              <input defaultValue="+27 72 000 0000" />
            </label>
            <label className="form-field">
              <span>Province</span>
              <select defaultValue="Gauteng">
                <option>Gauteng</option>
                <option>Western Cape</option>
                <option>KwaZulu-Natal</option>
              </select>
            </label>
          </div>

          <label className="form-field">
            <span>Professional introduction</span>
            <textarea
              rows="5"
              defaultValue="I am a motivated junior professional seeking an opportunity to grow."
            />
          </label>

          <label className="form-field">
            <span>Skills</span>
            <input defaultValue="JavaScript, React, Microsoft Office" />
          </label>

          <button className="btn btn-primary" type="submit">
            Save Changes
          </button>
        </form>

        <aside className="dashboard-card cv-card">
          <h2>Curriculum Vitae</h2>
          {cvName ? (
            <div className="cv-file">
              <strong>{cvName}</strong>
              <span>Ready to use</span>
            </div>
          ) : (
            <p>No CV uploaded yet.</p>
          )}

          <label className="upload-button">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(event) =>
                setCvName(event.currentTarget.files?.[0]?.name || "")
              }
            />
            {cvName ? "Replace CV" : "Upload CV"}
          </label>
        </aside>
      </div>
    </div>
  );
}

function SavedJobsPage({
  jobs,
  openJob,
  applyForJob,
  toggleSavedJob,
}) {
  return (
    <div className="dashboard-content">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">My account</span>
          <h1>Saved Jobs</h1>
        </div>
      </div>

      {jobs.length ? (
        <div className="job-grid">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              openJob={openJob}
              isSaved
              toggleSavedJob={toggleSavedJob}
              showApply
              applyForJob={applyForJob}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state dashboard-card">
          <h2>No saved jobs</h2>
          <p>Vacancies you save will appear here.</p>
        </div>
      )}
    </div>
  );
}

function ApplicationsPage({
  jobs,
  applications,
  openJob,
  setModal,
  setApplications,
  showToast,
}) {
  const withdraw = (application) => {
    setModal({
      title: "Withdraw application",
      message: "Are you sure you want to withdraw this application?",
      action: () => {
        setApplications((current) =>
          current.filter((item) => item.id !== application.id),
        );
        setModal(null);
        showToast("Application withdrawn.");
      },
    });
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">My account</span>
          <h1>My Applications</h1>
        </div>
      </div>

      {applications.length ? (
        <div className="dashboard-card table-card">
          <div className="applications-table">
            <div className="table-row table-head">
              <span>Position</span>
              <span>Company</span>
              <span>Date</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {applications.map((application) => {
              const job = jobs.find((item) => item.id === application.jobId);
              if (!job) return null;

              return (
                <div className="table-row" key={application.id}>
                  <strong>{job.title}</strong>
                  <span>{job.company}</span>
                  <span>{application.date}</span>
                  <span className={`status status-${application.status.toLowerCase().replaceAll(" ", "-")}`}>
                    {application.status}
                  </span>
                  <div className="table-actions">
                    <button onClick={() => openJob(job)}>View</button>
                    <button onClick={() => withdraw(application)}>Withdraw</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="empty-state dashboard-card">
          <h2>No applications</h2>
          <p>Your submitted applications will appear here.</p>
        </div>
      )}
    </div>
  );
}

function EmployerDashboard({ navigate }) {
  return (
    <div className="dashboard-content">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">Employer dashboard</span>
          <h1>Recruitment overview</h1>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("manage-jobs")}>
          Post a Job
        </button>
      </div>

      <div className="stat-grid">
        <StatCard title="Total vacancies" value="8" />
        <StatCard title="Active vacancies" value="5" />
        <StatCard title="Applications" value="42" />
        <StatCard title="Shortlisted" value="9" />
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="card-heading">
            <h2>Recent applications</h2>
            <button onClick={() => navigate("applicants")}>View all</button>
          </div>
          {["Thandi Mokoena", "Sipho Nkosi", "Aisha Patel"].map((name) => (
            <button
              className="application-row"
              key={name}
              onClick={() => navigate("applicants")}
            >
              <span className="account-avatar">
                {name.split(" ").map((word) => word[0]).join("")}
              </span>
              <div>
                <strong>{name}</strong>
                <span>Junior Software Developer</span>
              </div>
              <span className="status status-submitted">Submitted</span>
            </button>
          ))}
        </section>

        <section className="dashboard-card">
          <div className="card-heading">
            <h2>Quick actions</h2>
          </div>
          <div className="quick-actions">
            <button onClick={() => navigate("manage-jobs")}>Manage vacancies</button>
            <button onClick={() => navigate("applicants")}>View applicants</button>
            <button onClick={() => navigate("company-profile")}>Edit company profile</button>
          </div>
        </section>
      </div>
    </div>
  );
}

function CompanyProfilePage({ showToast }) {
  const save = (event) => {
    event.preventDefault();
    showToast("Company profile updated.");
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">Employer account</span>
          <h1>Company Profile</h1>
        </div>
      </div>

      <form className="dashboard-card profile-form" onSubmit={save}>
        <div className="form-grid">
          <label className="form-field">
            <span>Company name</span>
            <input required defaultValue="CapeTech Solutions" />
          </label>
          <label className="form-field">
            <span>Industry</span>
            <input required defaultValue="Information Technology" />
          </label>
          <label className="form-field">
            <span>Website</span>
            <input type="url" defaultValue="https://example.co.za" />
          </label>
          <label className="form-field">
            <span>Location</span>
            <input defaultValue="Cape Town, Western Cape" />
          </label>
        </div>

        <label className="form-field">
          <span>Company description</span>
          <textarea rows="5" defaultValue="CapeTech Solutions develops digital products for South African organisations." />
        </label>

        <button className="btn btn-primary" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
}

function ManageJobsPage({ jobs, setJobs, showToast }) {
  const [editingJob, setEditingJob] = useState(null);

  const openEditor = (job = null) => {
    setEditingJob(job || {
      id: null,
      title: "",
      company: "CapeTech Solutions",
      location: "",
      province: "",
      salary: "",
      type: "Full-time",
      level: "Entry-level",
      category: "",
      posted: new Date().toISOString().slice(0, 10),
      closing: "",
      description: "",
      responsibilities: "",
      qualifications: "",
      skills: [],
    });
  };

  const submitJob = (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const nextJob = {
      ...editingJob,
      id: editingJob.id || Date.now(),
      title: form.get("title"),
      location: form.get("location"),
      province: form.get("province"),
      salary: form.get("salary"),
      type: form.get("type"),
      level: form.get("level"),
      category: form.get("category"),
      closing: form.get("closing"),
      description: form.get("description"),
      responsibilities: form.get("responsibilities"),
      qualifications: form.get("qualifications"),
      skills: String(form.get("skills"))
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    setJobs((current) =>
      editingJob.id
        ? current.map((job) => (job.id === editingJob.id ? nextJob : job))
        : [...current, nextJob],
    );

    setEditingJob(null);
    showToast(editingJob.id ? "Job updated." : "Job published.");
  };

  const deleteJob = (job) => {
    if (window.confirm(`Delete "${job.title}"?`)) {
      setJobs((current) => current.filter((item) => item.id !== job.id));
      showToast("Job deleted.");
    }
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">Employer account</span>
          <h1>Manage Job Vacancies</h1>
        </div>
        <button className="btn btn-primary" onClick={() => openEditor()}>
          Create Job
        </button>
      </div>

      {editingJob ? (
        <form className="dashboard-card profile-form" onSubmit={submitJob}>
          <h2>{editingJob.id ? "Edit vacancy" : "Create vacancy"}</h2>
          <div className="form-grid">
            <label className="form-field">
              <span>Job title</span>
              <input name="title" required defaultValue={editingJob.title} />
            </label>
            <label className="form-field">
              <span>Job category</span>
              <input name="category" required defaultValue={editingJob.category} />
            </label>
            <label className="form-field">
              <span>Province</span>
              <input name="province" required defaultValue={editingJob.province} />
            </label>
            <label className="form-field">
              <span>City or location</span>
              <input name="location" required defaultValue={editingJob.location} />
            </label>
            <label className="form-field">
              <span>Salary range</span>
              <input name="salary" defaultValue={editingJob.salary} />
            </label>
            <label className="form-field">
              <span>Closing date</span>
              <input
                name="closing"
                type="date"
                required
                defaultValue={editingJob.closing}
              />
            </label>
            <label className="form-field">
              <span>Employment type</span>
              <select name="type" defaultValue={editingJob.type}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </label>
            <label className="form-field">
              <span>Experience level</span>
              <select name="level" defaultValue={editingJob.level}>
                <option>Entry-level</option>
                <option>Graduate</option>
                <option>Mid-level</option>
                <option>Senior</option>
              </select>
            </label>
          </div>

          <label className="form-field">
            <span>Job description</span>
            <textarea name="description" rows="4" required defaultValue={editingJob.description} />
          </label>
          <label className="form-field">
            <span>Responsibilities</span>
            <textarea name="responsibilities" rows="4" defaultValue={editingJob.responsibilities} />
          </label>
          <label className="form-field">
            <span>Qualifications</span>
            <textarea name="qualifications" rows="4" defaultValue={editingJob.qualifications} />
          </label>
          <label className="form-field">
            <span>Required skills <small>(comma-separated)</small></span>
            <input name="skills" defaultValue={editingJob.skills.join(", ")} />
          </label>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit">
              Publish Job
            </button>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => setEditingJob(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="dashboard-card table-card">
          <div className="applications-table">
            <div className="table-row table-head vacancy-table">
              <span>Title</span>
              <span>Location</span>
              <span>Type</span>
              <span>Actions</span>
            </div>
            {jobs.map((job) => (
              <div className="table-row vacancy-table" key={job.id}>
                <strong>{job.title}</strong>
                <span>{job.location}</span>
                <span>{job.type}</span>
                <div className="table-actions">
                  <button onClick={() => openEditor(job)}>Edit</button>
                  <button onClick={() => deleteJob(job)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ManageApplicantsPage({ showToast }) {
  const [applicants, setApplicants] = useState([
    { id: 1, name: "Thandi Mokoena", position: "Junior Software Developer", date: "2026-11-18", status: "Submitted" },
    { id: 2, name: "Sipho Nkosi", position: "Junior Software Developer", date: "2026-11-17", status: "Submitted" },
    { id: 3, name: "Aisha Patel", position: "Marketing Assistant", date: "2026-11-16", status: "Shortlisted" },
  ]);

  const updateStatus = (applicant, status) => {
    setApplicants((current) =>
      current.map((item) =>
        item.id === applicant.id ? { ...item, status } : item,
      ),
    );
    showToast(`${applicant.name} marked as ${status}.`);
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">Employer account</span>
          <h1>Manage Applicants</h1>
        </div>
      </div>

      <div className="dashboard-card table-card">
        <div className="applications-table">
          <div className="table-row applicant-table table-head">
            <span>Applicant</span>
            <span>Position</span>
            <span>Date</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {applicant=applicant}
          {applicants.map((applicant) => (
            <div className="table-row applicant-table" key={applicant.id}>
              <strong>{applicant.name}</strong>
              <span>{applicant.position}</span>
              <span>{applicant.date}</span>
              <span className="status status-submitted">{applicant.status}</span>
              <div className="table-actions">
                <button onClick={() => updateStatus(applicant, "Shortlisted")}>
                  Shortlist
                </button>
                <button onClick={() => updateStatus(applicant, "Interview")}>
                  Interview
                </button>
                <button onClick={() => updateStatus(applicant, "Unsuccessful")}>
                  Unsuccessful
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ navigate }) {
  return (
    <div className="dashboard-content">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">Administrator</span>
          <h1>Platform Dashboard</h1>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard title="Job seekers" value="1,248" />
        <StatCard title="Employers" value="186" />
        <StatCard title="Job listings" value="342" />
        <StatCard title="Active vacancies" value="278" />
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="card-heading">
            <h2>Pending actions</h2>
          </div>
          <div className="pending-list">
            <button onClick={() => navigate("admin-management")}>
              <span>12 employer verifications</span>
              <strong>Review</strong>
            </button>
            <button onClick={() => navigate("admin-management")}>
              <span>8 reported advertisements</span>
              <strong>Investigate</strong>
            </button>
            <button onClick={() => navigate("admin-management")}>
              <span>5 listings awaiting approval</span>
              <strong>Approve</strong>
            </button>
          </div>
        </section>

        <section className="dashboard-card">
          <div className="card-heading">
            <h2>Recent activity</h2>
          </div>
          <div className="activity-list">
            <p><strong>New employer:</strong> GreenBridge Energy</p>
            <p><strong>Listing submitted:</strong> Financial Analyst</p>
            <p><strong>Job reported:</strong> Marketing internship</p>
          </div>
        </section>
      </div>
    </div>
  );
}

function AdminManagementPage({ showToast }) {
  const [tab, setTab] = useState("users");

  const tabContent = {
    users: ["Thandi Mokoena", "Sipho Nkosi", "Aisha Patel"],
    employers: ["CapeTech Solutions", "Ubuntu Brands", "Mzansi Health"],
    jobs: ["Junior Software Developer", "Marketing Assistant", "Remote Data Analyst"],
    reports: ["Suspicious employer profile", "Duplicate vacancy", "Misleading salary"],
  };

  const act = (action, item) => {
    showToast(`${action}: ${item}`);
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">Administrator</span>
          <h1>Platform Management</h1>
        </div>
      </div>

      <div className="dashboard-card management-card">
        <div className="tabs">
          {["users", "employers", "jobs", "reports", "analytics"].map((name) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => setTab(name)}
            >
              {name[0].toUpperCase() + name.slice(1)}
            </button>
          ))}
        </div>

        {tab === "analytics" ? (
          <div className="analytics-grid">
            <StatCard title="Applications this week" value="214" />
            <StatCard title="New users" value="86" />
            <StatCard title="Active listings" value="278" />
          </div>
        ) : (
          <div className="management-list">
            {tabContent[tab]?.map((item) => (
              <div className="management-row" key={item}>
                <strong>{item}</strong>
                <div>
                  {tab === "users" && (
                    <>
                      <button onClick={() => act("Suspend account", item)}>Suspend</button>
                      <button onClick={() => act("Deactivate account", item)}>Deactivate</button>
                    </>
                  )}
                  {tab === "employers" && (
                    <>
                      <button onClick={() => act("Approve employer", item)}>Approve</button>
                      <button onClick={() => act("Reject employer", item)}>Reject</button>
                    </>
                  )}
                  {tab === "jobs" && (
                    <>
                      <button onClick={() => act("Approve listing", item)}>Approve</button>
                      <button onClick={() => act("Remove listing", item)}>Remove</button>
                    </>
                  )}
                  {tab === "reports" && (
                    <>
                      <button onClick={() => act("Review report", item)}>Review</button>
                      <button onClick={() => act("Dismiss report", item)}>Dismiss</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Modal({ title, message, action, close }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={close}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="modal-title">{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={close}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={action}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;