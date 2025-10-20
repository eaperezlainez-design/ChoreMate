# ✅ Task List – ChoreMate MVP

This document breaks down the development tasks for ChoreMate based on the “Kept” user stories from the Analyst’s Complete User Story List.  
Each task includes a short description and acceptance criteria defining when the task is considered complete.

---

## 🏠 Account & Household Management

### **User Story #1 – Create Account**
**Task:** Build a registration form for new users to create an account.  
**Acceptance Criteria:**
- User can enter name, email, and password.
- Data is stored securely in the database (Supabase).
- A success message confirms account creation.

---

### **User Story #2 – Join Household**
**Task:** Allow users to join an existing household group via code or link.  
**Acceptance Criteria:**
- User can enter or click an invite code/link.
- System verifies the code and adds the user to the household.
- User sees household dashboard after joining.

---

### **User Story #6 – Leave Household**
**Task:** Enable users to leave a household and stop receiving chores/notifications.  
**Acceptance Criteria:**
- “Leave Household” button is available in settings.
- Confirmation message is shown before leaving.
- User is removed from the group and no longer receives reminders.

---

## 🕒 Scheduling & Availability

### **User Story #7 – Enter Weekly Schedule**
**Task:** Create a scheduling interface where users input available days/times.  
**Acceptance Criteria:**
- User can select days and time slots.
- Data is saved to Supabase and linked to their account.
- App uses this data to assign chores fairly.

---

### **User Story #9 – Mark Unavailable (Vacation Mode)**
**Task:** Add a temporary “Unavailable” toggle for users going on vacation.  
**Acceptance Criteria:**
- User can mark themselves unavailable for certain dates.
- System automatically reassigns chores to others during that period.
- Availability resets when the date range ends.

---

## 🧹 Chore Management

### **User Story #12 – Create Chore**
**Task:** Build a form for adding new chores to the household list.  
**Acceptance Criteria:**
- User enters chore title, description, and assignee.
- New chore appears in the group chore list.
- Data is saved to the database.

---

### **User Story #14 – Edit/Delete Chores**
**Task:** Allow users to modify or remove chores from the list.  
**Acceptance Criteria:**
- “Edit” and “Delete” options available per chore.
- Updates immediately reflected in the UI and database.
- Deletion requires confirmation.

---

### **User Story #16 – View Upcoming Chores**
**Task:** Display a dashboard of upcoming assigned chores.  
**Acceptance Criteria:**
- Users see a list of upcoming chores by date.
- Shows who is responsible for each chore.
- Data syncs correctly with Supabase.

---

### **User Story #17 – Mark Chores as Complete**
**Task:** Enable users to mark chores as completed.  
**Acceptance Criteria:**
- “Mark Complete” button available per chore.
- Completed chores are visually distinct (e.g., checkmark or strikethrough).
- System updates chore status in database.

---

## 🔔 Notifications

### **User Story #19 – Receive Push Notifications**
**Task:** Implement push notifications for assigned chores.  
**Acceptance Criteria:**
- User receives notifications when new chores are assigned.
- Notifications include chore name and due date.
- Works on both desktop and mobile.

---

## 📦 Notes
- All data interactions use the Supabase API.
- Front-end: React (mobile-first)
- Back-end: Express API for business logic and routing
- Testing: Verify that acceptance criteria are met before marking a feature complete.
- Add complete Task List document
