# 🏫 Smart Campus Operations Hub
### IT3030 – Programming Applications and Frameworks | Assignment 2026
**SLIIT Faculty of Computing**

---

## 📌 Module 2 – Booking Management System
**Developed by:** M.M.A.Indupa | IT23552142

This module handles the complete lifecycle of campus resource bookings — from creation to approval, rejection, cancellation, and check-in. It also includes an AI-powered chatbot assistant and an analytics dashboard.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 21, Spring Boot 4.0.4 |
| Database | MySQL |
| Frontend | React 18, Tailwind CSS 3 |
| AI Chatbot | OpenRouter API (meta-llama/llama-3.1-8b-instruct:free) |
| Email | JavaMail (Gmail SMTP) |
| QR Code | qrcode.react |
| Charts | Recharts |
| Build Tool | Maven |

---

## 📁 Project Structure

```
PAF-Final/
├── backend/backend/
│   └── src/main/java/backend/Module_2/
│       ├── Controller/
│       │   ├── BookingsController.java     ← Booking REST API
│       │   └── ChatController.java         ← AI Chatbot API
│       ├── Service/
│       │   ├── BookingsServices.java       ← Service interface
│       │   ├── BookingsServiceImpl.java    ← Business logic
│       │   └── EmailsService.java          ← Email notifications
│       ├── Repository/
│       │   └── BookingsRepository.java     ← JPA queries
│       ├── Model/
│       │   └── Bookings.java               ← Entity
│       ├── dto/
│       │   ├── BookingsRequest.java        ← Input DTO
│       │   └── BookingsResponse.java       ← Output DTO
│       ├── Enums/
│       │   └── BookingsStatus.java         ← PENDING/APPROVED/REJECTED/CANCELLED
│       └── Exception/
│           └── GlobalExceptionsHandler.java
│
└── frontend/src/M2/
    ├── api/
    │   └── bookingApi.js                   ← All API calls
    ├── components/
    │   ├── Navbar.js                       ← Navigation bar
    │   ├── StatusBadge.js                  ← Status color badge
    │   └── ChatBot.js                      ← AI chatbot widget
    └── pages/
        ├── BookingForm.js                  ← Create booking
        ├── BookingList.js                  ← All bookings table
        ├── BookingDetail.js                ← Single booking view
        ├── MyBookings.js                   ← User bookings
        ├── AdminPanel.js                   ← Admin approve/reject
        ├── CheckIn.js                      ← QR code check-in
        └── Analytics.js                   ← Dashboard charts
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Java 21
- Node.js v18+ (or v22 with craco)
- MySQL 8+
- Maven

### 1. Database Setup
```sql
CREATE DATABASE courseweb;
```

### 2. Backend Setup
```bash
cd backend/backend
```

Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/courseweb
spring.datasource.username=root
spring.datasource.password=your_password

spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password

openai.router.key=your_openrouter_api_key
openai.model=meta-llama/llama-3.1-8b-instruct:free
```

Run the backend:
```bash
./mvnw spring-boot:run
```
Backend starts at: `http://localhost:8080`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend starts at: `http://localhost:3000`

---

## 🔗 API Endpoints

Base URL: `http://localhost:8080`

### Booking Endpoints

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| POST | `/api/bookings` | Create new booking | 201 |
| GET | `/api/bookings` | Get all bookings | 200 |
| GET | `/api/bookings?status=PENDING` | Filter by status | 200 |
| GET | `/api/bookings/{id}` | Get booking by ID | 200 |
| GET | `/api/bookings/user/{userId}` | Get bookings by user | 200 |
| PUT | `/api/bookings/{id}/approve` | Approve booking | 200 |
| PUT | `/api/bookings/{id}/reject` | Reject with reason | 200 |
| PUT | `/api/bookings/{id}/cancel` | Cancel booking | 200 |
| DELETE | `/api/bookings/{id}` | Delete booking | 204 |

### Chatbot Endpoint

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| POST | `/api/chat/ask` | AI chatbot message | 200 |

---

## 📋 API Request Examples

### Create Booking
```http
POST /api/bookings
Content-Type: application/json

{
  "userId": 1,
  "resourceId": 3,
  "bookingDate": "2026-05-10",
  "startTime": "09:00:00",
  "endTime": "11:00:00",
  "userEmail": "user@gmail.com",
  "purpose": "Team meeting",
  "attendees": 10
}
```

### Reject Booking
```http
PUT /api/bookings/1/reject
Content-Type: application/json

{
  "reason": "Venue not available on this date"
}
```

### Chatbot
```http
POST /api/chat/ask
Content-Type: application/json

{
  "message": "How do I create a booking?",
  "history": []
}
```

---

## 🔄 Booking Workflow

```
User submits booking
        ↓
    PENDING
        ↓
Admin reviews
   ↙        ↘
APPROVED   REJECTED
   ↓       (with reason)
CANCELLED
(by user)
```

- System **automatically prevents conflicts** — same resource cannot be double-booked
- **Email notifications** sent on: booking received, approved, rejected
- **QR code** generated for approved bookings for venue check-in

---

## 🖥️ Frontend Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with quick actions |
| `/book` | BookingForm | Submit new booking request |
| `/bookings` | BookingList | View all bookings with status filter |
| `/bookings/:id` | BookingDetail | View single booking, cancel or delete |
| `/my-bookings` | MyBookings | View all bookings, search by User ID |
| `/admin` | AdminPanel | Approve, reject, cancel, delete bookings |
| `/checkin/:id` | CheckIn | QR code check-in for approved bookings |
| `/analytics` | Analytics | Charts: status breakdown, peak hours, trends |

---

## ✨ Additional Features (Innovation)

### 📱 QR Code Check-In
- Approved bookings generate a unique QR code
- QR contains booking ID, user, resource, date and time
- Shows green verified screen for APPROVED, red screen for other statuses
- Access via Booking Detail page → "QR Check-In" button

### 📊 Analytics Dashboard
- Total bookings stat cards
- Booking status breakdown (Pie chart)
- Top booked resources (Bar chart)
- Peak booking hours (Bar chart)
- Daily bookings trend (Bar chart)

### 🤖 AI Chatbot
- Floating chat widget on every page
- Powered by OpenRouter (meta-llama free model)
- Trained to only answer Smart Campus booking questions
- Maintains conversation history for context
- Suggested quick questions on first open

---

## 🗄️ Database Schema

### `bookings` table

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT (PK) | Auto increment |
| user_id | BIGINT | User reference |
| resource_id | BIGINT | Resource reference |
| booking_date | DATE | Date of booking |
| start_time | TIME | Start time |
| end_time | TIME | End time |
| user_email | VARCHAR | User email |
| purpose | VARCHAR | Booking purpose |
| attendees | INT | Number of attendees |
| status | ENUM | PENDING/APPROVED/REJECTED/CANCELLED |
| rejection_reason | VARCHAR | Reason if rejected (nullable) |

---

## 🧪 Testing

Run backend tests:
```bash
cd backend/backend
./mvnw test
```

### Postman Test Order
1. `POST /api/bookings` → create, note `id`
2. `GET /api/bookings` → confirm created
3. `GET /api/bookings?status=PENDING` → filter
4. `PUT /api/bookings/{id}/approve` → approve
5. `POST /api/bookings` with same resource/time → expect 400 conflict
6. `PUT /api/bookings/{id}/reject` with reason
7. `PUT /api/bookings/{id}/cancel`
8. `DELETE /api/bookings/{id}` → expect 204
9. `POST /api/chat/ask` → test chatbot

---

## 👤 Individual Contribution – Module 2

| Feature | Backend | Frontend |
|---------|---------|----------|
| Booking CRUD | ✅ | ✅ |
| Conflict Detection | ✅ | ✅ |
| Approve / Reject / Cancel | ✅ | ✅ |
| Email Notifications | ✅ | — |
| Admin Panel | ✅ | ✅ |
| QR Code Check-In | — | ✅ |
| Analytics Dashboard | — | ✅ |
| AI Chatbot | ✅ | ✅ |

---

## 📝 Notes

- Tailwind CSS v3 with CRACO is used to support CRA on Node.js v22
- OpenRouter free tier used for AI — no billing required
- All booking endpoints are open (no auth) for demo purposes
- `spring.jpa.hibernate.ddl-auto=update` auto-creates tables on first run
