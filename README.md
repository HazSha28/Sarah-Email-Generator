# Sarah Jewellers — Smart Email Generator

Admin panel for sending personalized occasion-based emails to customers.

## Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+

### 1. Database
```sql
CREATE DATABASE sarah_jewellers;
```
Or run `database/schema.sql` directly.

### 2. Backend
Edit `backend/src/main/resources/application.properties`:
- Set your MySQL password
- Set your Gmail SMTP credentials (use an App Password, not your real password)

```bash
cd backend
./mvnw spring-boot:run
```
Runs on http://localhost:8080

### 3. Frontend
```bash
cd frontend
npm install
npm start
```
Runs on http://localhost:3000

## Default Login
- Username: `admin`
- Password: `admin123`

## Excel Import Format
Column order: `Name | Email | Phone | Birthday | Anniversary`
- Dates should be in `YYYY-MM-DD` format or Excel date cells

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Admin login |
| GET | /api/dashboard | Dashboard stats |
| GET/POST | /api/customers | List / add customers |
| POST | /api/customers/import | Upload Excel |
| GET | /api/emails/drafts | Pending drafts |
| POST | /api/emails/drafts/{id}/send | Send a draft |
| POST | /api/emails/broadcast | Festival broadcast |
| GET/PUT | /api/templates | Email templates |

## Gmail SMTP Setup
1. Enable 2FA on your Google account
2. Go to Google Account → Security → App Passwords
3. Generate a password for "Mail"
4. Use that as `spring.mail.password` in application.properties
