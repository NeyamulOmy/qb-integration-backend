# 🧠 QB Integration Backend

Backend API for QuickBooks Integration — built with **Express**, **Prisma**, and **MySQL**.

Handles:
- QuickBooks OAuth 2.0 authentication
- Invoice creation and listing
- Optional sync with QuickBooks Online

---

## ⚙️ Setup Instructions

### 1️⃣ Clone and install
```bash
git clone https://github.com/NeyamulOmy/qb-integration-backend.git
cd qb-integration-backend
npm install
```
### 2️⃣ Configure environment

Create a .env file in the project root:
```bash
NODE_ENV=development
PORT=5050
ALLOWED_ORIGINS=http://localhost:3000

DATABASE_URL="mysql://root:yourpassword@localhost:3306/invoicedb"

QBO_CLIENT_ID=YOUR_QBO_CLIENT_ID
QBO_CLIENT_SECRET=YOUR_QBO_CLIENT_SECRET
QBO_REDIRECT_URL=http://localhost:5050/auth/qbo/callback
QBO_ENV=sandbox
```
### 3️⃣ Setup database
```bash
npx prisma migrate dev --name init
# Optional visual editor
npx prisma studio
```
### 4️⃣ Run the API
```bash
npm run dev
```
Backend runs at → http://localhost:5050

Test it:
```bash
curl http://localhost:5050/health
```
### 5️⃣ QuickBooks Connect (optional)

Go to https://developer.intuit.com/

Create a QuickBooks Online App

Add redirect URI:
```bash
http://localhost:5050/auth/qbo/callback
```

Copy the Client ID and Secret into your .env

Visit:
```bash
http://localhost:5050/auth/qbo/start
```

→ authorize → success!
