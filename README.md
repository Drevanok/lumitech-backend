<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```
## environment variables - .env

For the project to work correctly, you must create an .env file in the root of the project with the following environment variables:
```bash
# Database base configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name

# Server running port
PORT=3000

# Configuration for sending emails with Nodemailer
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_user
EMAIL_PASS=your_mailtrap_password

### Frontend URL (for CORS or redirects)
FRONT_URL=http://localhost:5173

# Secret keys for JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
```

## Firebase Admin SDK Setup

The project uses Firebase Admin for certain functionalities. To do this, you need to download the JSON credentials file from Firebase and place it in:
```bash
src/firebase/lumitech-sensors-firebase-adminsdk-fbsvc-50eb2dd997.json
```
## Endpoints
### Base URL
```bash
http://192.168.0.242:3001/
```
This IP is dynamic, it is configured in the main.ts file.
```bash
const PORT = process.env.PORT ?? 3001;
const HOST = '192.168.0.242';
```



### Auth Endpoints
```bash
http://192.168.0.242:3001/user/auth/login
http://192.168.0.242:3001/user/auth/refresh
```

### Registration and authentication
```bash
http://192.168.0.242:3001/user/register
http://192.168.0.242:3001/user/verify-email
http://192.168.0.242:3001/user/resend-verification
http://192.168.0.242:3001/user/logout
```

### User profile (requires authentication)
```bash
http://192.168.0.242:3001/user/profile
```

### Password recovery
```bash
http://192.168.0.242:3001/user/forget-password
http://192.168.0.242:3001/user/reset-password
```

### User data updates (requires authentication)
```bash
http://192.168.0.242:3001/user/change-password
http://192.168.0.242:3001/user/change-name
http://192.168.0.242:3001/user/change-lastname
http://192.168.0.242:3001/user/change-nickname
```

### IP and Data Reception
```bash
http://192.168.0.242:3001/roseta/received-ip  
http://192.168.0.242:3001/roseta/sensor-data
```

### Rosette Registration and Management (requires authentication)
```bash
http://192.168.0.242:3001/roseta/register  
http://192.168.0.242:3001/roseta/get-all-rosettes  
http://192.168.0.242:3001/roseta/change-ubication  
http://192.168.0.242:3001/roseta/remove-rosette/:mac
```


### Sensor Info and Alerts (requires authentication)
```bash
http://192.168.0.242:3001/roseta/sensor/:mac  
http://192.168.0.242:3001/roseta/alerts/:mac
```

## Project Structure: `src/`

- **app.module.ts**
  - Main application module where all core modules are imported and configured.

- **main.ts**
  - Application entry point. Starts the NestJS server instance.

- **auth/**
  - Handles all authentication and authorization logic.
    - `auth.module.ts`: Auth module configuration.
    - `controllers/`: API controllers for authentication endpoints.
    - `dto/`: Data Transfer Objects for validation and typing.
    - `guards/`: Auth guards to protect routes (e.g. JWT).
    - `interfaces/`: TypeScript interfaces related to authentication.
    - `services/`: Core authentication business logic and services.

- **common/**
  - Shared utilities, middleware, and constants.
    - Contains the rate-limiter middleware for controlling request rates per user.

- **firebase/**
  - Logic for interacting with Firebase services.
    - `firebase.module.ts`: Firebase module configuration.
    - `interface/`: TypeScript interfaces for Firebase data structures.
    - `services/`: Business logic and services for real-time database interactions (e.g. saving and retrieving user/device data).

- **roseta/**
  - Main logic for "rosetas" (smart devices).
    - `roseta.module.ts`: Roseta module configuration.
    - `controllers/`: API controllers for device management endpoints.
    - `dto/`: Data Transfer Objects for device-related operations.
    - `interface/`: TypeScript interfaces for device data.
    - `services/`: Business logic/services for device registration, user association, data transmission, etc.

- **user/**
  - User management logic.
    - `user.module.ts`: User module configuration.
    - `controllers/`: API controllers for user endpoints.
    - `dto/`: Data Transfer Objects for user data validation and typing.
    - `services/`: Business logic/services for user management.


## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
