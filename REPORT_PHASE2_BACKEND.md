# Department of Computer Science and Information Technology

# CSCI426: Advanced Web Programming — Project Phase 2 Report (Backend)

**Project Title:** Ruh Therapy — Backend API  
**Student Name:** Ibrahim Raad  
**Date:** 31-Dec-2025

---

## 1. Objective

This phase delivers the backend development portion of the Ruh Therapy project: a secure Node.js API with database integration, CRUD operations, and authentication, suitable for powering a real-world web application.

---

## 2. Project Overview

Ruh Therapy is a mental-health platform. The **web dashboard** is used by administrators and therapists to manage users, settings, patients, and sessions. This repository contains the **NestJS backend** that provides:

- A REST API consumed by the web dashboard
- Authentication and authorization
- Database persistence and business logic
- Documentation via Swagger

---

## 3. Technologies Used

- **Node.js Backend Framework:** NestJS 11 (TypeScript)
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT (access token) + refresh token cookie
- **Authorization:** Role-based access control (RBAC)
- **Validation:** `class-validator`, `class-transformer`
- **API Documentation:** Swagger (`/api`)
- **Email Notifications:** Resend (verification + password reset)
- **Logging:** Pino (`nestjs-pino`)

---

## 4. System Design (High Level)

- **Client–Server Model:** The web dashboard sends HTTP requests to the backend API.
- **Layered Backend Architecture:**
  - **Controllers:** Define API endpoints and request/response DTOs.
  - **Services:** Contain business logic and database operations.
  - **Entities:** Define database schema and relationships.
  - **Guards/Interceptors/Filters:** Enforce security and centralized error handling.
- **Documentation:** Swagger is generated automatically from controllers/DTO metadata.

---

## 5. Database Integration & Relationships

The backend uses **PostgreSQL + TypeORM**, with entities under `src/domain/**`.

### Example Related Entities (Meets “2 related entities” requirement)

- **`User` ↔ `Patient`**
  - `Patient.user` is a required relation to a `User` (each patient record belongs to a user account).
- **`TherapyCase` ↔ `Session`**
  - `Session.therapy_case` links sessions to a therapy case.

These relationships demonstrate proper relational modeling and foreign keys in the database layer.

---

## 6. Functional Requirements Coverage

### 6.1 Authentication (Login/Signup)

Implemented under `/api/v1/auth`:

- `POST /api/v1/auth/register` (signup)
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/verify-email`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`

### 6.2 CRUD Operations (Database)

CRUD operations are implemented across multiple domain modules. Below is one representative example that demonstrates create, list (with pagination/search), read, update, delete, and restore patterns:

- **Sessions module:** `/api/v1/sessions`
  - `POST /api/v1/sessions`
  - `GET /api/v1/sessions`
  - `GET /api/v1/sessions/:id`
  - `PATCH /api/v1/sessions/:id`
  - `DELETE /api/v1/sessions/:id`
  - `PATCH /api/v1/sessions/restore/:id`

### 6.3 Data Validation

Input validation is enforced globally using NestJS `ValidationPipe` with:

- **Transformation enabled** (DTOs automatically convert types)
- **Whitelist enabled** (unexpected fields are removed)

This improves reliability and security for all endpoints.

### 6.4 Error Handling

Errors are handled in a consistent way using centralized filters:

- **Database errors** (e.g., unique constraint violation) are converted into meaningful HTTP responses.
- **Service validation errors** are returned as `400 Bad Request` with a list of validation messages.

---

## 7. Key Code Snippets (Backend)

> Note: Snippets below are short excerpts showing the key parts relevant to requirements (authentication, CRUD, DB integration, validation, and error handling).

### 7.1 Authentication Controller (Register/Login/Refresh)

This controller provides login/signup and refresh-token functionality. It returns an **access token** and stores the **refresh token** in an **httpOnly cookie**.

```ts
// src/domain/auth/auth.controller.ts
@ApiTags('Auth')
@Controller('/api/v1/auth')
export class AuthController {
  @Post('register')
  @Public()
  async signup(
    @Body() input: SignupUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthOutput> {
    const { user, tokens } = await this.service.signup(
      this.mapper.toModel(input),
    );
    res.cookie('refreshToken', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
    });
    return {
      user: this.mapper.toOutput(user),
      tokens: { access_token: tokens.access_token },
    };
  }

  @Post('refresh-token')
  @Public()
  async refreshToken(@Req() req: Request): Promise<{ access_token: string }> {
    const token = req.cookies['refreshToken'] as string;
    if (!token) throw new UnauthorizedException('Refresh token not found');
    const tokens = await this.service.refreshToken(token);
    return { access_token: tokens.access_token };
  }
}
```

### 7.2 Example CRUD Controller (Sessions)

The Sessions controller demonstrates CRUD operations using standard REST patterns.

```ts
// src/domain/sessions/session.controller.ts
@ApiTags('Sessions')
@Controller('/api/v1/sessions')
export class SessionController {
  @Post()
  async create(@Body() input: CreateSession): Promise<SessionOutput> {
    const created = await this.service.create(this.mapper.toModel(input));
    return this.mapper.toOutput(created);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SessionOutput> {
    return this.mapper.toOutput(await this.service.one({ id }));
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateSession,
  ) {
    const existing = await this.service.one({ id });
    return this.mapper.toOutput(
      await this.service.update(existing, this.mapper.toModel(input, existing)),
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remove({ id });
    return { message: 'Session deleted' };
  }
}
```

### 7.3 Database Configuration (TypeORM + Postgres)

The database module configures TypeORM to connect to Postgres and automatically loads all entities.

```ts
// src/database/database.module.ts
TypeOrmModule.forRootAsync({
  useFactory: () => ({
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: [
      path.join(
        __dirname,
        '..',
        'domain',
        '**',
        '*.entity.{ts,js,audit.ts,audit.js}',
      ),
    ],
  }),
});
```

### 7.4 Example Relationship (Patient belongs to User)

This illustrates a relational design requirement: **two related entities** with a foreign key.

```ts
// src/domain/patients/entities/patient.entity.ts
@Entity('patients')
export class Patient extends AbstractEntity {
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
```

### 7.5 Global Validation Pipe

Global validation ensures requests are sanitized and validated consistently across all controllers.

```ts
// src/pipes/validation-pipe.factory.ts
const options: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
};
export const ValidationFactory = {
  createGlobal: () => new ValidationPipe(options),
};
```

### 7.6 Database Error Handling Filter (Postgres → HTTP)

This filter maps common Postgres errors (like unique constraint violations) to the correct HTTP status code.

```ts
// src/filters/query-failed.error.filter.ts
@Catch(QueryFailedError)
export class QueryFailedErrorFilter implements ExceptionFilter {
  catch(
    exception: QueryFailedError & {
      driverError: { code?: string; detail?: string };
    },
    host: ArgumentsHost,
  ) {
    const errorCode = exception.driverError.code;
    switch (errorCode) {
      case '23505': // unique_violation
        throw new ConflictException([
          'This resource conflicts with another resource',
        ]);
      default:
        throw new InternalServerErrorException([
          'An unexpected database error occurred',
        ]);
    }
  }
}
```

### 7.7 Role-Based Access Control (RBAC)

Routes can require roles (e.g., admin-only endpoints). The guard checks the authenticated user role.

```ts
// src/guards/permissions.guard.ts
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.get<UserRole[] | UserRole>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!required) return true;
    const user = context
      .switchToHttp()
      .getRequest<{ user: { role: UserRole } }>().user;
    if (user.role === UserRole.ADMIN) return true;
    return Array.isArray(required)
      ? required.includes(user.role)
      : user.role === required;
  }
}
```

---

## 8. Screenshots

Screenshots of the web UI (which consumes this backend API) are included in the repository under `./screenshots`:

- Landing page (`./screenshots/landing.png`)
- Login (`./screenshots/login.png`)
- Admin dashboard (`./screenshots/admin-dashboard.png`)
- Mobile view (`./screenshots/mobile.png`)

---

## 9. Conclusion & Future Scope

This phase delivered a functional backend with authentication, role-based authorization, database CRUD operations, validation, and consistent error handling. The API is documented via Swagger and is ready to support the full Ruh Therapy platform.

**Future scope**:

- Add more automated testing (unit + e2e) for critical flows.
- Expand therapist workflows and patient tracking features.
- Enhance observability (metrics/tracing) and production hardening (rate limiting, stricter CORS, etc.).
