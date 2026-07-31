# Fireblade Barber Booking System

A full-stack appointment booking system built with React, Supabase, PostgreSQL, and Resend. Customers can choose a barber and service, view availability, reserve an appointment, and optionally receive an email confirmation.

## Project at a glance

- **Frontend:** React component design, state management, effects, and explicit loading, error, empty, and success states
- **Data model:** Relational PostgreSQL tables for barbers, services, barber-service relationships, and bookings
- **Availability:** Dynamic booking dates and duration-aware time-slot calculations
- **Correctness:** Database-level overlap protection that remains safe when customers submit simultaneously
- **Backend API:** A Supabase Edge Function validates requests, loads trusted data, and owns the booking workflow
- **Security:** Row-Level Security, server-side secrets, layered validation, foreign keys, and database constraints
- **Integration:** Optional booking-confirmation emails through Resend, with provider message IDs and delivery-state tracking
- **Code organization:** Separation between UI components, frontend service adapters, and reusable utility functions

## Architecture

```text
React booking interface
        |
        v
Frontend service adapters
        |
        v
Supabase Edge Function
        |
        +--> PostgreSQL tables, triggers, and constraints
        |
        +--> Resend email API
```

The browser handles presentation and user interaction. The Edge Function acts as the trusted API boundary, while PostgreSQL remains the final authority for relationships and appointment conflicts. Email delivery is treated as an optional side effect, so a provider failure does not remove a valid booking.

## Screenshots

Front page

![alt text]({F44F6FC3-5783-47C8-98CA-D2703D4A8572}.png)

Booking form

![alt text]({C3A7D0A3-95B5-42B1-B005-4D3F42793A37}.png)

Dynamiclly generated dates and retriving booked times for the barber from the Database

![alt text]({433DD4DC-51E2-4EA8-B584-B880F1C8D4BA}.png)

Booking confirmation

![alt text]({FA1AC9C2-6DD3-49F7-9C8E-CBD827CA9C3A}.png)

Bookings table

![alt text]({AAFF1A90-0E9D-46FF-8682-C89329A69928}.png)

Barber table

![alt text]({8BF31B81-7687-4448-987D-5E35057A8C0D}.png)

## How it works

Barbers are loaded from Supabase when the application starts. After a customer selects a barber and date, the application fetches that barber's booked times and disables unavailable options. A confirmed appointment is then inserted into the database.

## Technology

- React 19
- JavaScript
- Vite
- Supabase
- PostgreSQL
- CSS

## Project structure

```text
src/
├── components/   User-interface components
├── services/     Supabase queries and mutations
├── utils/        Date and time transformations
├── App.jsx       Application state and screen coordination
└── supabaseClient.js
```

## Challenges and lessons

### Time representation

JavaScript `Date` objects serialize as UTC. Because this prototype models the wall-clock time of one local barber shop, appointments are stored as timezone-free local date-times. A multi-location version should instead store UTC together with each shop's timezone.

### Race conditions

Checking availability before inserting is not enough: two customers could see the same slot as available and submit at nearly the same time. The database uniqueness constraint resolves this race safely, while React translates the PostgreSQL conflict into a useful customer message.

### Remote data is more than an array

Database-backed UI needs explicit loading, error, empty, and success states. Modeling those states separately prevents indefinite loading screens and misleading empty interfaces.

## Current limitations

- Appointment times are currently predefined.
- There is no cancellation workflow or barber dashboard.
- Anonymous booking creation needs additional anti-spam protection for production.
- The database prevents identical start times, but does not yet model overlaps between services of different durations.

## Next steps

- Generate time slots from opening hours and appointment duration
- Add services, prices, and duration-based availability
- Add authenticated barber/admin tools
- Add automated tests for date generation, availability, and booking conflicts
