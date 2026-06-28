# Walkthrough - College Event Planning & Certificate Automation Portal

We have built the full-stack College Event Planning & Certificate Automation Portal according to the requested specifications. 

## Completed Changes

### 📁 Codebase Structure
The project is scaffolded into a standard client-server architecture:
- [client/](file:///c:/Users/varun/Downloads/Eventra/client): React + Vite + Tailwind CSS v4 frontend.
- [server/](file:///c:/Users/varun/Downloads/Eventra/server): Node.js + Express + Mongoose backend.

---

### 🎨 Design & Styling (Strict Color Constraint)
We have fully respected the color named constraint: **no hex codes or RGB/HSL/RGBA functions are used anywhere in the code.**
- **Tailwind configuration in CSS:** Customized in [index.css](file:///c:/Users/varun/Downloads/Eventra/client/src/index.css) using Tailwind v4 `@theme` properties:
  - `--color-maroon: maroon;`
  - `--color-lightgray: lightgray;`
  - `--color-white: white;`
  - `--color-black: black;`
  - Button hover effects are created using Tailwind's `hover:opacity-90` classes rather than introducing new hex codes.
- **Certificate generation styling:** Completed using **PDFKit** in [certificateController.js](file:///c:/Users/varun/Downloads/Eventra/server/controllers/certificateController.js). Color fills use standard CSS names directly (e.g. `doc.fillColor('maroon')` or `doc.strokeColor('lightgray')`).

---

### 💻 Client Features (React.js)
1. **Routing ([App.jsx](file:///c:/Users/varun/Downloads/Eventra/client/src/App.jsx)):** Managed using `react-router-dom` with a base layout, custom route guards ([ProtectedRoute.jsx](file:///c:/Users/varun/Downloads/Eventra/client/src/components/ProtectedRoute.jsx)), and auth context ([AuthContext.jsx](file:///c:/Users/varun/Downloads/Eventra/client/src/context/AuthContext.jsx)).
2. **Landing Page ([Home.jsx](file:///c:/Users/varun/Downloads/Eventra/client/src/pages/Home.jsx)):** Features a maroon/white hero, CTA links, features summary, upcoming events (falling back to local mock data if the API is offline), and an about/contact form.
3. **Public Event Pages ([TechnicalEvents.jsx](file:///c:/Users/varun/Downloads/Eventra/client/src/pages/TechnicalEvents.jsx) & [NonTechnicalEvents.jsx](file:///c:/Users/varun/Downloads/Eventra/client/src/pages/NonTechnicalEvents.jsx)):** Cards showing descriptions, times, venues, and a register button. Creative/cultural pages support tab filtering (All, Individual, Team).
4. **Registration Flow ([RegistrationModal.jsx](file:///c:/Users/varun/Downloads/Eventra/client/src/components/RegistrationModal.jsx)):**
   - Automatically pre-populates logged-in student info.
   - Restricts duplicate registrations (via controller checks).
   - Supports team registrations (dynamically adding members, inputting roll numbers, branch, and emails).
5. **Auth pages ([Login.jsx](file:///c:/Users/varun/Downloads/Eventra/client/src/pages/Login.jsx) & [Signup.jsx](file:///c:/Users/varun/Downloads/Eventra/client/src/pages/Signup.jsx)):** Fully responsive, allowing signups for student and admin roles.
6. **Student Dashboard:**
   - [MyRegistrations.jsx](file:///c:/Users/varun/Downloads/Eventra/client/src/pages/MyRegistrations.jsx): Displays registered events, attendance statuses (`pending`, `present`, `absent`), and lists team details if applicable.
   - [MyCertificates.jsx](file:///c:/Users/varun/Downloads/Eventra/client/src/pages/MyCertificates.jsx): Displays issued certificates and opens the PDF blob directly.
   - [Profile.jsx](file:///c:/Users/varun/Downloads/Eventra/client/src/pages/Profile.jsx): Edit student academic credentials.
7. **Admin Dashboard:**
   - [AdminDashboard.jsx](file:///c:/Users/varun/Downloads/Eventra/client/src/pages/admin/AdminDashboard.jsx): View aggregate counts and recent logins.
   - [ManageEvents.jsx](file:///c:/Users/varun/Downloads/Eventra/client/src/pages/admin/ManageEvents.jsx): Create/Edit/Delete event cards.
   - [ManageStudents.jsx](file:///c:/Users/varun/Downloads/Eventra/client/src/pages/admin/ManageStudents.jsx): Search student lists, toggle attendance states, and download CSV roster spreadsheets.
   - [GenerateCertificates.jsx](file:///c:/Users/varun/Downloads/Eventra/client/src/pages/admin/GenerateCertificates.jsx): Mark merit positions and bulk-generate PDFs.

---

### ⚙️ Server Features (Node.js + Express)
1. **Controllers & Routes:**
   - [authController.js](file:///c:/Users/varun/Downloads/Eventra/server/controllers/authController.js): Secure logins with JWT and password matching using bcryptjs.
   - [eventController.js](file:///c:/Users/varun/Downloads/Eventra/server/controllers/eventController.js): REST endpoints for event scheduling.
   - [registrationController.js](file:///c:/Users/varun/Downloads/Eventra/server/controllers/registrationController.js): Handles team member uniqueness checks and leader associations.
   - [certificateController.js](file:///c:/Users/varun/Downloads/Eventra/server/controllers/certificateController.js): Serves student certificates list, maps positions, and streams landscape A4 credential PDFs on-demand.
2. **Models:**
   - [User.js](file:///c:/Users/varun/Downloads/Eventra/server/models/User.js)
   - [Event.js](file:///c:/Users/varun/Downloads/Eventra/server/models/Event.js)
   - [Registration.js](file:///c:/Users/varun/Downloads/Eventra/server/models/Registration.js)
   - [Certificate.js](file:///c:/Users/varun/Downloads/Eventra/server/models/Certificate.js)

---

## How to Verify and Run

### 1. Configure MongoDB URI
Since local MongoDB was not running on `127.0.0.1:27017` during seeding, you should provide your target MongoDB database connection string:
- Open [server/.env](file:///c:/Users/varun/Downloads/Eventra/server/.env) and edit the `MONGO_URI` field:
  ```
  MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/eventra
  ```

### 2. Seed Database
Run the seeder script to populate initial mock events:
```bash
# In the project root directory
node server/seed.js
```

### 3. Launch the Backend Server
Start the Express server:
```bash
# In the project root directory
cd server
node server.js
```
The server will boot on `http://localhost:5000`.

### 4. Launch the Frontend Application
Start the Vite React development server:
```bash
# In another terminal window, from the project root
cd client
npm run dev
```
Open `http://localhost:5173` to explore the portal!

### 5. Recommended Verification Flow
1. Open the landing page and navigate through "Technical Events" or "Non-Technical Events".
2. **Sign Up an Admin:**
   - Click "Sign Up", select "Account Role" as **Administrator**. Submit the form.
   - This opens the Admin Dashboard.
   - Go to **Manage Events** and create a new event.
3. **Sign Up a Student:**
   - Sign out of the admin account.
   - Click "Sign Up", keep role as **Student**, enter Roll Number (e.g. `CS101`), Branch, and email. Submit.
   - Go to "Technical Events", click **Register Now** on any event. Select **Team Registration**, enter a Team Name, and add a team member details. Click Submit.
4. **Mark Attendance:**
   - Log back into the Administrator account.
   - Go to **Students** tab, filter by the registered event.
   - Notice the student's registration appears with their team member details.
   - Click the green **Checkmark** button next to the student's entry to mark them as **Present**.
   - (Optionally, click **Export CSV List** to download the roster).
5. **Bulk Issue Certificates:**
   - Go to **Certificates** tab, select the event.
   - Select the checkbox next to the student. Select type as **Merit** and write position as `1st Place`.
   - Click **Bulk Generate** button.
6. **Download Certificate:**
   - Log back into the Student account.
   - Go to **My Certificates** tab.
   - Click **Download Certificate** and verify the PDF rendering layout.
