## ⚙️ Project Setup

Follow the steps below to set up and run the project locally.

---

### 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
cd <project-folder>
```

---

### 2️⃣ Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
npm install nodemailer chrono-node
npm install nodemon --save-dev
```

Create a `.env` file inside the **backend** folder and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

Run the backend server:

```bash
npm run dev
```

Backend will run on:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

### 📌 Running the Project

Run both servers at the same time.

**Terminal 1 (Backend)**

```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend)**

```bash
cd frontend
npm run dev
```
