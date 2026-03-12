# 🚗 Car Rental System – Full Stack Web Application
**Java Spring Boot REST API + React + Tailwind CSS**

Converted from the original Java Swing desktop application.

---

## 📁 Project Structure

```
carrental-web/
├── backend/                          ← Spring Boot REST API
│   ├── pom.xml
│   └── src/main/java/com/carrental/
│       ├── CarRentalApplication.java  ← Entry point
│       ├── config/
│       │   └── SecurityConfig.java    ← JWT + CORS config
│       ├── controller/
│       │   ├── AuthController.java    ← POST /api/auth/login|register
│       │   ├── CarController.java     ← CRUD /api/cars
│       │   ├── BookingController.java ← CRUD /api/bookings
│       │   └── AdminController.java   ← GET /api/admin/*
│       ├── model/                     ← JPA Entities (from Swing models)
│       │   ├── User.java
│       │   ├── CarCompany.java
│       │   ├── CarVariant.java
│       │   ├── Location.java
│       │   ├── Customer.java
│       │   ├── Car.java
│       │   ├── Booking.java
│       │   └── Payment.java
│       ├── repository/                ← Spring Data JPA (replaces DAOs)
│       │   └── Repositories.java
│       ├── dto/
│       │   └── Dtos.java              ← Request/Response DTOs
│       └── security/
│           ├── JwtUtils.java          ← Token generation/validation
│           └── UserDetailsServiceImpl.java
│
└── frontend/                         ← React + Tailwind CSS
    ├── package.json
    ├── tailwind.config.js
    └── src/
        ├── App.jsx                   ← Routes + Auth guards
        ├── index.css                 ← Tailwind + global styles
        ├── context/
        │   └── AuthContext.jsx       ← Login state management
        ├── services/
        │   └── api.js                ← Axios API client
        ├── layouts/
        │   └── DashboardLayout.jsx   ← Sidebar + responsive layout
        ├── pages/
        │   ├── auth/
        │   │   ├── LoginPage.jsx
        │   │   └── RegisterPage.jsx
        │   ├── admin/
        │   │   ├── AdminDashboard.jsx
        │   │   ├── AdminCars.jsx
        │   │   ├── AdminBookings.jsx
        │   │   └── AdminCustomers.jsx
        │   └── customer/
        │       ├── CustomerDashboard.jsx
        │       ├── BrowseCars.jsx
        │       ├── BookingPage.jsx
        │       └── MyBookings.jsx
        └── components/               ← (add reusable components here)
```

---

## 🔄 Swing → Spring Boot Conversion Map

| Swing Class         | Web Equivalent                              |
|---------------------|---------------------------------------------|
| `UserDAO`           | `UserRepository` (Spring Data JPA)          |
| `CarDAO`            | `CarRepository` + `CarController`           |
| `BookingDAO`        | `BookingRepository` + `BookingController`   |
| `SessionManager`    | `JwtUtils` + `AuthContext` (React)          |
| `LoginForm.java`    | `LoginPage.jsx`                             |
| `DashboardForm.java`| `DashboardLayout.jsx` + Admin/Customer pages|
| `CarForm.java`      | `AdminCars.jsx`                             |
| `BookingForm.java`  | `BookingPage.jsx`                           |

---

## ⚙️ Setup Instructions

### Prerequisites
- Java JDK 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

---

### Step 1 – Database Setup
```sql
-- Run the original database_schema.sql from the Swing project
mysql -u root -p < database_schema.sql
```

Spring Boot with `ddl-auto=update` will auto-create/update tables on first run.

---

### Step 2 – Backend Setup

**Update DB credentials** in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/car_rental_db?...
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

**Run the backend:**
```bash
cd backend
mvn spring-boot:run
```
Backend starts at: `http://localhost:8080`

---

### Step 3 – Frontend Setup

```bash
cd frontend
npm install
npm start
```
Frontend starts at: `http://localhost:3000`

The `"proxy": "http://localhost:8080"` in package.json routes all `/api/*` calls to Spring Boot.

---

### Step 4 – Default Login
| Role     | Username | Password   |
|----------|----------|------------|
| Admin    | `admin`  | `admin123` |
| Customer | Register via UI |    |

---

## 🌐 API Endpoints

### Auth (Public)
```
POST   /api/auth/login            Body: { username, password, role }
POST   /api/auth/register         Body: { username, password, fullName, email, ... }
```

### Cars
```
GET    /api/cars/available        Public – list available cars
GET    /api/cars                  Admin – all cars
GET    /api/cars/{id}             Public – car detail
POST   /api/admin/cars            Admin – add car
PUT    /api/admin/cars/{id}       Admin – update car
DELETE /api/admin/cars/{id}       Admin – delete car
```

### Bookings
```
GET    /api/bookings              Admin – all bookings
GET    /api/bookings/my           Customer – own bookings
POST   /api/bookings              Auth – create booking
PUT    /api/bookings/{id}/status  Admin – update status
DELETE /api/bookings/{id}         Auth – cancel booking
```

### Admin
```
GET    /api/admin/dashboard       Stats: cars, customers, bookings, revenue
GET    /api/admin/customers       All customers
GET    /api/admin/companies       CRUD car companies
GET    /api/admin/locations       CRUD locations
```

---

## 🔐 Authentication Flow

```
1. User POSTs to /api/auth/login
2. Spring Security validates username + password
3. JwtUtils generates a signed JWT token
4. Frontend stores token in localStorage
5. Every subsequent request includes: Authorization: Bearer <token>
6. JwtAuthFilter validates token on each request
7. Spring Security sets user context for @PreAuthorize checks
```

---

## 🏗️ Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Backend    | Java 17, Spring Boot 3.2           |
| Security   | Spring Security + JWT (jjwt)       |
| Database   | MySQL 8 + Spring Data JPA          |
| Frontend   | React 18 + React Router v6         |
| Styling    | Tailwind CSS 3                     |
| HTTP Client| Axios                              |
| Toasts     | react-hot-toast                    |
| Icons      | lucide-react                       |
