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
