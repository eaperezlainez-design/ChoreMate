# ⚙️ Workspace Rules – ChoreMate

These rules define the standards and workflow for the ChoreMate project.  
They ensure consistent collaboration, organization, and maintainable code throughout the development process.

---

## 🧭 1. Repository Structure

ChoreMate/
│
├── README.md
└── docs/
    ├── prd.md
    ├── task_list.md
    └── workspace_rules.md

All development, documentation, and versioning are managed through **GitHub** and **Windsurf**.

---

## 🧩 2. Branching Strategy
To maintain a clean and stable workflow:

- `main` → stable production branch  
- `dev` → integration and testing branch  
- `feature-*` → for developing individual features (e.g., `feature-login`, `feature-notifications`)

**Workflow:**
1. Create a new feature branch from `dev`.  
2. Commit and push your changes.  
3. Open a pull request (PR) to merge into `dev`.  
4. Once tested, merge `dev` into `main`.

---

## 🧱 3. Commit Guidelines
Every commit should clearly explain what was changed.  

✅ **Good examples:**
- Add complete PRD document  
- Implement user login form  
- Fix notification scheduling bug  

❌ **Avoid vague messages like:**
- update stuff  
- fixed it  
- changes  

If multiple updates are related, commit them in logical chunks (e.g., documentation, backend, UI).

---

## 🧪 4. Testing & Validation
Before marking any feature as complete:
- Verify **all acceptance criteria** from `task_list.md` are met.  
- Test functionality manually in Windsurf or browser environment.  
- Check database connections (Supabase) and UI responsiveness.

---

## 🔐 5. Environment Variables
- Store API keys and credentials in a **`.env` file** (never upload it to GitHub).  
- Example:

SUPABASE_URL=
SUPABASE_KEY=

- Windsurf and local environments should use secure variables.

---

## 🧰 6. Coding Standards
- Use **clear, consistent naming conventions**:
  - Functions: `camelCase`
  - Components: `PascalCase`
  - Files/Folders: `kebab-case`
- Add comments where logic isn’t obvious.
- Keep code readable (indentation, spacing, organization).

---

## 🧾 7. Documentation
- Update the `README.md` when major features or structures change.  
- All documents (`prd.md`, `task_list.md`, `workspace_rules.md`) should remain synchronized with project updates.  
- Include screenshots or diagrams when helpful (especially for the site map).

---

## 🧑‍💻 8. Instructor Visibility
- Repository must remain **public** during evaluation.  
- All commits must include your name or username.  
- Instructor should be able to view all changes via GitHub commit history.

---

## 🚀 9. Project Milestones
1. **Scaffolding** – repo setup, docs, and site map (current phase)  
2. **Prototype 1** – base functionality for account, chores, and schedule  
3. **Prototype 2** – testing, notifications, and polish  
4. **Final Delivery** – fully working app with clean repo and documentation

---

## 💬 10. Communication
- Use Trello for tracking milestones and feedback.  
- Use Slack for coordination and quick updates.  
- Keep messages professional, concise, and goal-oriented.

---

*Following these rules will ensure clean collaboration, reproducible work, and successful delivery of the ChoreMate application.*
