# JobConnect SA

## Overview

JobConnect SA is a South African recruitment platform that connects job seekers with employers.

The platform allows users to:

- Create job seeker or employer accounts
- Search and apply for vacancies
- Upload and manage CVs
- Track application statuses
- Publish and manage job advertisements
- Review, shortlist and interview applicants
- Manage users, employers, listings and reports

---

## Technologies

- HTML
- CSS
- JavaScript
- React
- React Native
- Node.js
- Express.js
- PostgreSQL
- Git
- GitHub
- Figma

---

## User Roles

### Job Seeker

Job seekers can:

- Create an account
- Build a professional profile
- Upload a CV
- Search and save vacancies
- Submit applications
- Track application statuses
- Receive notifications

### Employer

Employers can:

- Register a company
- Create and manage job vacancies
- View applications
- Download applicant CVs
- Shortlist candidates
- Invite candidates to interviews
- Update application statuses

### Administrator

Administrators can:

- Manage job seeker accounts
- Manage employer accounts
- Verify employers
- Approve or reject job listings
- Remove inappropriate advertisements
- Investigate reports
- View platform statistics
- Suspend or deactivate accounts

---

## Public Pages

| Page | Description |
|---|---|
| Home | Main landing page with search, categories and featured jobs |
| Browse Jobs | Search and filter available vacancies |
| Job Details | View complete vacancy information |
| Companies | View registered companies |
| About & Contact | Platform information, FAQ and contact form |
| Login | Account authentication |
| Registration | Job seeker or employer account registration |
| Forgot Password | Send password reset instructions |

---

## Job Seeker Pages

| Page | Description |
|---|---|
| Job Seeker Dashboard | Overview of applications, saved jobs and profile |
| Profile & CV | Manage personal information and upload CV |
| Saved Jobs | View and manage saved vacancies |
| My Applications | Track application progress and statuses |

---

## Employer Pages

| Page | Description |
|---|---|
| Employer Dashboard | View vacancy and application statistics |
| Company Profile | Manage company information |
| Manage Vacancies | Create, edit, publish, close or delete vacancies |
| Manage Applicants | Review and update job applications |

---

## Administrator Pages

| Page | Description |
|---|---|
| Admin Dashboard | View platform statistics and pending actions |
| Admin Management | Manage users, employers, listings, reports and analytics |

---

## Application Statuses

- **Submitted** – The application was successfully received
- **Under Review** – The employer is reviewing the application
- **Shortlisted** – The candidate is being considered further
- **Interview** – The candidate has been invited to an interview
- **Successful** – The candidate was selected
- **Unsuccessful** – The candidate was not selected

---

## Main Features

- Responsive React user interface
- Role-based dashboards
- User authentication
- Job searching and filtering
- Saved job functionality
- CV uploads
- Job applications
- Employer applicant management
- Application status updates
- Notifications
- Employer verification
- Job reporting
- Administrator moderation
- Mobile navigation

---

## Navigation

### Public Navigation

- Home
- Jobs
- Companies
- About
- Login
- Register

### Job Seeker Navigation

- Dashboard
- My Profile
- My CV
- Saved Jobs
- Applications
- Find Jobs
- Settings
- Logout

### Employer Navigation

- Dashboard
- Company Profile
- Manage Vacancies
- Manage Applicants
- Settings
- Logout

### Administrator Navigation

- Dashboard
- Users
- Employers
- Job Listings
- Reports
- Analytics
- Logout

---

## Example Application Process

1. A job seeker finds a vacancy.
2. The job seeker selects **Apply Now**.
3. The system checks whether the user is logged in.
4. The user completes their profile if necessary.
5. The user uploads or selects a CV.
6. The user submits the application.
7. The application is saved in the database.
8. The employer receives the application.
9. The application appears in the job seeker dashboard.
10. The employer updates the application status.

---

## Example Employer Process

1. The employer logs in.
2. The employer posts a vacancy.
3. The vacancy is saved or published.
4. Job seekers submit applications.
5. The employer opens **Manage Applicants**.
6. The employer views candidate information and CVs.
7. The employer shortlists or rejects candidates.
8. The application status is updated.
9. The job seeker receives a notification.

---

## Project Architecture

```text
React Web Application
        |
        | REST API
        |
Node.js + Express.js
        |
        | SQL
        |
PostgreSQL Database
        |
Secure CV File Storage
```

An optional React Native application can communicate with the same backend API.

---

## Database Tables

| Table | Information Stored |
|---|---|
| Users | ID, name, email, password hash and role |
| Job Seekers | Profile, education, qualifications, skills and experience |
| Employers | Company information and verification status |
| Jobs | Job title, description, location, salary and closing date |
| Applications | Applicant ID, job ID, submission date and status |
| Saved Jobs | Job seeker ID and saved job ID |
| CV Documents | File reference and document owner |
| Notifications | Message, recipient ID and read status |
| Categories | Job categories such as IT, Finance and Marketing |

---

## Recommended Database Relationships

- A user can have one job seeker or employer profile.
- An employer can publish multiple vacancies.
- A job seeker can submit multiple applications.
- One application connects a job seeker to a vacancy.
- A job seeker can save multiple vacancies.
- A vacancy can receive multiple applications.
- An employer can only manage applications submitted to its own vacancies.

---

## Security Requirements

The system should include:

- Password hashing
- User authentication
- Role-based access control
- Protected API endpoints
- Server-side permission checks
- Secure CV file storage
- Input validation
- Prevention of duplicate applications
- Database parameterisation
- Account deactivation
- POPIA-conscious data handling

An employer must never be able to access the administrator dashboard merely by entering an admin URL. Administrator access must be verified by the backend.

---

## POPIA Considerations

The application should:

- Explain why personal information is collected
- Obtain appropriate consent
- Collect only necessary information
- Protect CVs and contact details
- Prevent unauthorised access
- Allow users to access or correct their information
- Provide account deletion
- Implement clear data retention rules
- Use fictional data during development
- Never upload real CVs without permission

---

## Planned Enhancements

- Job recommendation system
- Transparent skills matching
- Application analytics
- Employer recruitment analytics
- Email notifications
- CV builder
- Province and city filters
- Remote job filters
- Internship and learnership filters
- Graduate programme filters
- Entry-level job filters
- React Native mobile application

---

## Project Structure

```text
jobconnect-sa/
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
├── server/
│   ├── src/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── package.json
├── mobile/
├── database/
├── docs/
└── README.md
```

---

## Development Roadmap

### Phase 1: Planning

- Finalise requirements
- Identify user roles
- Create database and API specifications
- Create a sitemap
- Define all workflows

### Phase 2: UI/UX Design

- Design the homepage
- Design authentication pages
- Design job seeker dashboards
- Design employer dashboards
- Design administrator dashboards
- Create Figma prototypes
- Test responsive layouts

### Phase 3: Frontend Development

- Set up React
- Create reusable components
- Build navigation
- Build page layouts
- Connect frontend components to API requests
- Implement responsive and accessible design

### Phase 4: Backend Development

- Set up Node.js and Express
- Configure PostgreSQL
- Create authentication
- Implement role permissions
- Add job management
- Add applications
- Add CV uploads
- Add notifications
- Add reporting and moderation

### Phase 5: Testing

- Test registration and login
- Test password reset
- Test job filtering
- Test duplicate application prevention
- Test role permissions
- Test CV uploads
- Test employer workflows
- Test administrator workflows
- Test on mobile, tablet and desktop

---

## Local Setup

A typical setup process will include:

```bash
npm install
npm run dev
```

The backend setup may include:

```bash
npm install
npm run dev
```

Example environment variables:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/jobconnect
JWT_SECRET=replace-with-a-secure-secret
CLIENT_URL=http://localhost:5173
```

Never commit real database credentials or authentication secrets to GitHub.

---

## Testing Accounts

Use only fictional test information while developing.

Example roles:

- Job seeker
- Employer
- Administrator

---

## Git Setup

```bash
git init
git add .
git commit -m "Initial JobConnect SA project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jobconnect-sa.git
git push -u origin main
```

---

## License

Add an appropriate license before distributing or publishing the project.

---

## Project Author

JobConnect SA

A South African recruitment platform built to connect job seekers with employment opportunities.
````