# 🧱 Product Requirements Document (PRD)
## Project Title: ChoreMate

### 1. Project Overview
**ChoreMate** is a mobile application designed to reduce conflict and confusion around shared household responsibilities.  
The app allows roommates to form a home group, enter their individual schedules, and automatically generate a fair rotation of chores.  
Using availability data, ChoreMate ensures that no roommate is overloaded, sending reminders to help keep the household organized and running smoothly.

---

### 2. Purpose & Goals
The main goal of ChoreMate is to:
- Maintain fairness and transparency in shared chores.
- Prevent misunderstandings and conflict in shared living environments.
- Use automation and scheduling to simplify coordination among roommates.

---

### 3. Target Users
| User Group | Description | Needs |
|-------------|--------------|-------|
| **College / University Roommates** | Ages 18–24, living in shared dorms or apartments | Easy onboarding, fair rotation, push reminders |
| **Young Professionals** | Ages 22–35, early career, living in shared urban apartments | Scheduling flexibility, accountability, integration with personal calendars |
| **Co-living / Intentional Communities** | 5–15+ people living collaboratively | Scalable scheduling, clear visibility, reduced conflict |
| **Families with Teens** | Parents with kids aged 12–18 | Parental control, gamified motivation, fairness tracking |

---

### 4. Usage Context
- **Platforms:** Primarily mobile (iOS & Android), optional web dashboard.
- **Environment:** Home, school, or on-the-go (to view chores, update availability, or mark tasks done).
- **Conditions:** Requires internet connectivity for syncing; allows offline marking and later sync.

---

### 5. Scope of Work (MVP)
The **Minimum Viable Product (MVP)** focuses on 10 essential user stories selected from the Analyst’s specification:

| ID | User Story | Feature |
|----|-------------|----------|
| #1 | As a new user, I want to create an account so that I can start using ChoreMate. | Account Management |
| #2 | As a user, I want to join an existing household group so that I can participate in shared chores. | Household Management |
| #6 | As a user, I want to leave a household so that I stop receiving chores and notifications when I move out. | Household Management |
| #7 | As a user, I want to enter my weekly schedule so that chores are assigned when I’m available. | Scheduling |
| #9 | As a user, I want to mark myself unavailable (e.g., vacation) so chores are reassigned while I’m gone. | Scheduling |
| #12 | As a user, I want to create a new chore so I can add tasks to the household list. | Chore Management |
| #14 | As a user, I want to edit or delete chores so that I can keep the list updated. | Chore Management |
| #16 | As a user, I want to view my upcoming chores so that I know what I need to do. | Chore Management |
| #17 | As a user, I want to mark chores as complete so that everyone knows the task is finished. | Chore Tracking |
| #19 | As a user, I want to receive push notifications for assigned chores so that I never forget them. | Notifications |

---

### 6. Technical Architecture
**Frontend:**  
- React (mobile-first web app)  
- Responsive UI with clear navigation  

**Backend:**  
- Express.js API (Node.js server)  
- Supabase (database, authentication, storage)  

**Integration:**  
- GitHub for version control and collaboration  
- Windsurf IDE for code generation, structure, and automation  

---

### 7. Success Criteria
- Users can create and join a household successfully.  
- Users can add, edit, and mark chores as complete.  
- Notifications are delivered reliably to remind users of pending tasks.  
- Interface remains simple, mobile-friendly, and easy to use.

---

### 8. Risks and Assumptions
- **Risk:** Limited engagement if reminders are too frequent or not configurable.  
- **Assumption:** Users will have consistent internet access for sync operations.  
- **Risk:** Scheduling conflicts if multiple users edit chores simultaneously.  
- **Mitigation:** Implement clear ownership rules and time-based locking in future versions.

---

### 9. Deliverables
- PRD (`prd.md`)
- Task List (`task_list.md`)
- Workspace Rules (`workspace_rules.md`)
- Hand-drawn Site Map (uploaded image)

---

### 10. References
- Level 1 Specification – Analyst Deliverable (ChoreMate)
- Complete User Story List (Annotated)
- Add complete PRD document
