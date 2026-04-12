# Backend API Documentation

## `POST /users/register`

Registers a new user in the system.

### Description
This endpoint creates a new user account using the provided user information. It validates required fields and checks whether the email already exists before creating the user.

### Request URL
`POST /users/register`

### Request Body (JSON)

- `firstname` (string, required): The first name of the user. Must not be empty and should be at least 3 characters long.
- `lastname` (string, optional): The last name of the user.
- `email` (string, required): The user's email address. Must be a valid email format.
- `password` (string, required): The password for the user account. Must be at least 6 characters long.

Example request body:

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "password": "securePass123"
}
```

### Responses

- `201 Created`
  - Returned when the user is successfully registered.
  - Response includes the newly created user data, excluding `password` and `refreshToken`.

- `400 Bad Request`
  - Returned when required validation fails.
  - Example reasons: missing `firstname`, invalid email format, or password shorter than 6 characters.

- `409 Conflict`
  - Returned when a user with the same email address already exists.

- `500 Internal Server Error`
  - Returned when user creation fails unexpectedly.

### Example Success Response

```json
{
  "status": 201,
  "data": {
    "_id": "645e4f5d6b89d2f7e6c12345",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "createdAt": "2026-04-10T12:34:56.789Z",
    "updatedAt": "2026-04-10T12:34:56.789Z"
  },
  "message": "user registered successfully !!"
}
```

### Notes
- Ensure `Content-Type: application/json` is set when sending the request.
- Passwords are hashed before saving.
- The endpoint is expected to be mounted under `/users` in the main server routing.

## `POST /users/login`

Logs an existing user into the system.

### Description
This endpoint authenticates a user with their email and password. On successful login, it returns the user data along with access and refresh tokens, and sets cookies for both tokens.

### Request URL
`POST /users/login`

### Request Body (JSON)

- `email` (string, required): The user's email address.
- `password` (string, required): The user's password.

Example request body:

```json
{
  "email": "john.doe@example.com",
  "password": "securePass123"
}
```

### Responses

- `200 OK`
  - Returned when credentials are valid.
  - Response includes the authenticated user data, plus `accessToken` and `refreshToken`.

- `400 Bad Request`
  - Returned when request validation fails.

- `402 Payment Required`
  - Returned when the user is not found or the password is invalid.

### Example Success Response

```json
{
  "status": 200,
  "data": {
    "user": {
      "_id": "645e4f5d6b89d2f7e6c12345",
      "firstname": "John",
      "lastname": "Doe",
      "email": "john.doe@example.com",
      "createdAt": "2026-04-10T12:34:56.789Z",
      "updatedAt": "2026-04-10T12:34:56.789Z"
    },
    "accessToken": "<jwt-access-token>",
    "refreshToken": "<jwt-refresh-token>"
  },
  "message": "user loggedIn successfully"
}
```

### Notes
- The response sets `accessToken` and `refreshToken` cookies.
- Ensure `Content-Type: application/json` is set when sending the request.
- Credentials must match an existing user account.

## `POST /users/profile`

Returns the current authenticated user's profile.

### Description
This endpoint returns the logged-in user's profile data. It requires a valid access token and uses the authenticated user from the request.

### Request URL
`POST /users/profile`

### Authentication
- Requires a valid `accessToken` sent via cookies or request headers as provided by the login flow.

### Responses

- `200 OK`
  - Returned when the access token is valid.
  - Response includes the authenticated user's profile, excluding `password` and `refreshToken`.

- `401 Unauthorized`
  - Returned when the user is not authenticated or the access token is missing/invalid.

- `402 Payment Required`
  - Returned when the authenticated user could not be found.

### Example Success Response

```json
{
  "status": 200,
  "data": {
    "_id": "645e4f5d6b89d2f7e6c12345",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "createdAt": "2026-04-10T12:34:56.789Z",
    "updatedAt": "2026-04-10T12:34:56.789Z"
  },
  "message": "user profile given!!"
}
```

## `POST /users/logout`

Logs the current user out and clears authentication cookies.

### Description
This endpoint clears the user's `accessToken` and `refreshToken` cookies and resets the refresh token stored in the database.

### Request URL
`POST /users/logout`

### Authentication
- Requires a valid `accessToken` sent via cookies or request headers.

### Responses

- `200 OK`
  - Returned when logout succeeds.
  - Response confirms the user has been logged out.

- `401 Unauthorized`
  - Returned when the user is not authenticated or the access token is missing/invalid.

### Example Success Response

```json
{
  "status": 200,
  "data": {},
  "message": "user loggedOut successfully !!"
}
```

## `POST /users/refresh-token`

Refreshes the user's access token using a valid refresh token.

### Description
This endpoint verifies the provided refresh token, issues a new access token, rotates the refresh token, and sets both tokens in cookies.

### Request URL
`POST /users/refresh-token`

### Request Body (JSON)

- `refreshToken` (string, optional): The refresh token if not sent in cookies.

### Responses

- `201 Created`
  - Returned when the refresh token is valid.
  - Response includes the new `accessToken` and `refreshToken`.

- `401 Unauthorized`
  - Returned when the refresh token is missing, invalid, expired, or does not match the stored token.

- `402 Payment Required`
  - Returned when the user linked to the refresh token cannot be found.

### Example Success Response

```json
{
  "status": 201,
  "data": {
    "accessToken": "<jwt-access-token>",
    "refreshToken": "<jwt-refresh-token>"
  },
  "message": "accessToken refreshed succesfuuly !!"
}
```

### Notes
- The endpoint accepts the refresh token in cookies or in the request body.
- It rotates the refresh token on each successful call.

## `POST /captain/register`

Registers a new captain in the system.

### Description
This endpoint creates a new captain account using the provided vehicle and profile information. It validates required fields and checks whether the email already exists before creating the captain.

### Request URL
`POST /captain/register`

### Request Body (JSON)

- `firstname` (string, required): The first name of the captain. Must be at least 3 characters long.
- `lastname` (string, optional): The last name of the captain.
- `email` (string, required): The captain's email address.
- `password` (string, required): The password for the captain account.
- `vehicle` (object, required): The vehicle details for the captain, including:
  - `color` (string, required): Vehicle color.
  - `plate` (string, required): Vehicle plate number.
  - `capacity` (number, required): Passenger capacity. Must be at least 1.
  - `vehcleType` (string, required): Vehicle type. Allowed values: `car`, `motorcycle`, `auto`.
  - `location` (object, optional): Current vehicle location.
    - `lat` (number, optional): Latitude.
    - `lng` (number, optional): Longitude.

Example request body:

```json
{
  "firstname": "Jane",
  "lastname": "Doe",
  "email": "jane.doe@example.com",
  "password": "securePass123",
  "vehicle": {
    "color": "blue",
    "plate": "ABC1234",
    "capacity": 4,
    "vehcleType": "car",
    "location": {
      "lat": 37.7749,
      "lng": -122.4194
    }
  }
}
```

### Responses

- `200 OK`
  - Returned when the captain is successfully registered.
  - Response includes the newly created captain data, excluding `password` and `refreshToken`.

- `400 Bad Request`
  - Returned when required validation fails.
  - Example reasons: missing required fields, invalid vehicle data, or strings too short.

- `402 Payment Required`
  - Returned when a captain with the same email already exists.

- `500 Internal Server Error`
  - Returned when captain creation fails unexpectedly.

### Example Success Response

```json
{
  "status": 200,
  "data": {
    "_id": "645e4f5d6b89d2f7e6c12345",
    "firstname": "Jane",
    "lastname": "Doe",
    "email": "jane.doe@example.com",
    "vehicle": {
      "color": "blue",
      "plate": "ABC1234",
      "capacity": 4,
      "vehcleType": "car",
      "location": {
        "lat": 37.7749,
        "lng": -122.4194
      }
    },
    "status": "inactive",
    "createdAt": "2026-04-12T12:34:56.789Z",
    "updatedAt": "2026-04-12T12:34:56.789Z"
  },
  "message": "captain registered successfully "
}
```

### Notes
- Ensure `Content-Type: application/json` is set when sending the request.
- Passwords are hashed before saving.
- The endpoint is mounted under `/api/v1/captain` in the main server routing.
