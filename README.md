# PlatChasers

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API Documentation

## USER / ADMIN AUTHENTICATION OR AUTHORIZATION

### All endpoints that require authentication

All endpoints that require a current user/admin to be logged in.

- Request: endpoints that require authentication
- Error Response: Require authentication

  - Status Code: 401
  - Headers:
    - content-Type: application/json
  - Body:

  ```json
  {
    "message": "Authentication required"
  }
  ```

### All endpoints that require proper authorization

All endpoints that require authentication and the current user/admin does not have the correct role(s) or permission(s).

- Request: endpoints that require proper authorization
- Error Response: Require proper authorization

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "message": "Forbidden"
  }
  ```

  ### Get the Current User

Returns the information about the current User or Admin that is logged in.

- Require Authentication: false
- Request:

  - Method: GET
  - Route path: /session
  - Body: none

- Successful Response when there is a logged in User

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Smith",
      "email": "johnsmith@example.com",
      "username": "johnsmith",
      "games": [],
      "underReview": false,
      "isAdmin": false
    }
  }
  ```

- Successful Response when there is a logged in Client

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Smith",
      "email": "johnsmith@example.com",
      "username": "johnsmith",
      "games": [],
      "underReview": false,
      "isAdmin": true
    }
  }
  ```

- Successful Response when there is no logged in user

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": null
    }
    ```

### Log In a User

Logs in a current user with valid credentials and returns the current user's
information.

- Require Authentication: false
- Request

  - Method: POST
  - Route path: /login
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "email": "john.smith@gmail.com",
      "password": "secret password"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "johnsmith@example.com",
        "username": "johnsmith",
        "games": [],
        "underReview": false,
        "isAdmin": false
      }
    }
    ```

- Error Response: Invalid credentials

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Invalid credentials"
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "credential": "Email or username is required",
        "password": "Password is required"
      }
    }
    ```

### Sign Up a User

Creates a new User, logs them in as the current User, and returns the current User's information.

- Require Authentication: false
- Request

  - Method: POST
  - Route path: /signup
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "fname": "John",
      "lname": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith",
      "password": "secret password"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "johnsmith@example.com",
        "username": "johnsmith",
        "games": [],
        "underReview": false,
        "isAdmin": false
      }
    }
    ```

- Error response: User already exists with the specified email

  - Status Code: 500
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User already exists",
      "errors": {
        "email": "User with that email already exists"
      }
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "email": "Invalid email",
        "username": "Username is required",
        "fname": "First Name is required",
        "lname": "Last Name is required",
        "password": "Password is required"
      }
    }
    ```

### Get all Users

Return all Users

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /users
  - Body: None

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": [
        {
          "id": 1,
          "firstName": "John",
          "lastName": "Smith",
          "email": "johnsmith@example.com",
          "username": "johnsmith",
          "games": [],
          "underReview": false,
          "isAdmin": false
        }
      ]
    }
    ```

### Get details of a specific User

Return details of a User

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /users/:userId
  - Body: None

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "johnsmith@example.com",
        "username": "johnsmith",
        "games": [],
        "underReview": false,
        "isAdmin": false
      }
    }
    ```

- Error response: Couldn't find a User with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User couldn't be found"
    }
    ```

### Update a User

Updates and returns the User's information.

- Require Authentication: true
- Request

  - Method: PUT
  - Route path: /users/:userId/update
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "fname": "John",
      "lname": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith",
      "password": "secret password"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "johnsmith@example.com",
        "username": "johnsmith",
        "games": [],
        "underReview": false,
        "isAdmin": false
      }
    }
    ```

- Error response: User already exists with the specified email

  - Status Code: 500
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User already exists",
      "errors": {
        "email": "User with that email already exists"
      }
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "email": "Invalid email",
        "username": "Username is required",
        "fname": "First Name is required",
        "lname": "Last Name is required",
        "password": "Password is required"
      }
    }
    ```

### Delete a User

Deletes a User

- Require Authentication: true
- Request

  - Method: DELETE
  - Route path: /users/:userId/delete
  - Body: None

- Successful Response

- Error Response: Couldn't find a user with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User couldn't be found"
    }
    ```

## GAMES

### Get all games

Return all the games

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /games
  - Body: None

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Games": [
        {
          "id": 1,
          "title": "Kingdom Hearts",
          "description": "Disney game",
          "gamePostNums": 0,
          "gameImg": "img-string"
        }
      ]
    }
    ```

### Get Game details by id

Return details of a game based on id

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /games/:gameId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "title": "Kingdom Hearts",
      "description": "Disney game",
      "gamePostNums": 0,
      "gameImg": "img-string"
    }
    ```

- Error response: Couldn't find a Game with the specified id

  - Status Code: 404
  - Headers:
  - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Game couldn't be found"
    }
    ```

### Get all games by User

Return all games associated with a specific User.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /users/:userId/games
  - Body: None

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Games": [
        {
          "id": 1,
          "title": "Kingdom Hearts",
          "description": "Disney game",
          "gamePostNums": 0,
          "gameImg": "img-string"
        }
      ]
    }
    ```

### Create Game

Create and return a game

- Require Authentication: true
- Request

  - Method: POST
  - Route path: /games
  - Body:

    ```json
    {
      "title": "Kingdom Hearts",
      "description": "Disney game",
      "gameImg": "image url"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 3,
      "title": "Kingdom Hearts",
      "description": "Disney game",
      "gamePostsNum": 0,
      "gameImg": "image url"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "title": "Title is required",
        "description": "Description is required",
        "gameImg": "Image is required"
      }
    }
    ```

### Update Game by Id

Update and return a game by id

- Require Authentication: true
- Request

  - Method: PUT
  - Route path: /games/:gameId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "title": "Kingdom Hearts",
      "description": "Disney game",
      "gameImg": "image url"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 3,
      "title": "Kingdom Hearts",
      "description": "Disney game",
      "gamePostsNum": 0,
      "gameImg": "image url"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "title": "Title is required",
        "description": "Description is required",
        "gameImg": "Image is required"
      }
    }
    ```

- Error response: Couldn't find a Game with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Game couldn't be found"
    }
    ```

## Delete a Game by Id

Delete an existing game

- Require Authentication: true
- Request

  - Method: DELETE
  - Route path: /games/:gameId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Game with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Game couldn't be found"
    }
    ```

## GAME POSTS

### Get all posts based on game id

Return all posts based on game id

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /games/:gameId/posts
  - Body: None

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Posts": [
        {
          "id": 1,
          "gameId": 1,
          "body": "blah blah blah",
          "likes": 0,
          "dislikes": 0,
          "createdAt": "2025-01-02T15:30:00Z",
          "private": false
        },
        {
          "id": 2,
          "gameId": 1,
          "body": "bla bla bla",
          "likes": 0,
          "dislikes": 0,
          "createdAt": "2025-01-03T15:30:00Z",
          "private": false
        }
      ]
    }
    ```

- Error Response: Couldn't find any posts for this game

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "No posts for this game"
    }
    ```

### Get all public posts based on game id

Return all public posts based on game id

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /games/:gameId/posts
  - Body: None

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Posts": [
        {
          "id": 1,
          "gameId": 1,
          "body": "blah blah blah",
          "likes": 0,
          "dislikes": 0,
          "createdAt": "2025-01-02T15:30:00Z",
          "private": false
        },
        {
          "id": 2,
          "gameId": 1,
          "body": "bla bla bla",
          "likes": 0,
          "dislikes": 0,
          "createdAt": "2025-01-03T15:30:00Z",
          "private": false
        }
      ]
    }
    ```

- Error Response: Couldn't find any public posts for this game

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "No public posts for this game"
    }
    ```

### Get all private posts based on game id

Return all private posts based on game id

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /games/:gameId/posts
  - Body: None

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Posts": [
        {
          "id": 3,
          "gameId": 1,
          "body": "blah blah blah",
          "likes": 0,
          "dislikes": 0,
          "createdAt": "2025-01-02T15:30:00Z",
          "private": true
        },
        {
          "id": 4,
          "gameId": 1,
          "body": "bla bla bla",
          "likes": 0,
          "dislikes": 0,
          "createdAt": "2025-01-03T15:30:00Z",
          "private": true
        }
      ]
    }
    ```

- Error Response: Couldn't find any private posts for this game

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "No private posts for this game"
    }
    ```

## ACHIEVEMENTS

### Get all achievements based on game id

Return all the achievements based on a games id

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /games/:gameId/achievements
  - Body: None

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Achievements": [
        {
          "id": 1,
          "title": "Proud Player",
          "description": "Clear Final Mix on Proud",
          "gamePostNums": 0,
          "gameImg": "img-string"
        },
        {
          "id": 2,
          "title": "Unchanging Armor",
          "description": "Clear the game without changing equipment",
          "gamePostNums": 0,
          "gameImg": "img-string"
        }
      ]
    }
    ```

### Get achievement details by id

Return details of an achievement based on id

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /games/:gameId/achievements/:achievementId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "title": "Proud Player",
      "description": "Clear Final Mix on Proud",
      "gamePostNums": 0,
      "gameImg": "img-string"
    }
    ```

- Error response: Couldn't find an Achievement with the specified id

  - Status Code: 404
  - Headers:
  - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Achievement couldn't be found"
    }
    ```

### Create Achievement by Game Id

Create and return an achievement by game id

- Require Authentication: true
- Request

  - Method: POST
  - Route path: /games/:gameId/achievements
  - Body:

    ```json
    {
      "title": "Proud Player",
      "description": "Clear Final Mix on Proud",
      "achievementImg": "img-string"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 6,
      "title": "Proud Player",
      "description": "Clear Final Mix on Proud",
      "achievementPostNums": 0,
      "achievementImg": "img-string"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "title": "Title is required",
        "description": "Description is required",
        "achievementImg": "Image is required"
      }
    }
    ```

### Update achievement by Id

Update and return an achievement by id

- Require Authentication: true
- Request

  - Method: PUT
  - Route path: /games/:gameId/achievements/:achievementId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "title": "Proud Player",
      "description": "Clear Final Mix on Proud",
      "achievementImg": "img-string"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 6,
      "title": "Proud Player",
      "description": "Clear Final Mix on Proud",
      "achievementPostNums": 0,
      "achievementImg": "img-string"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "title": "Title is required",
        "description": "Description is required",
        "achievementImg": "Image is required"
      }
    }
    ```

- Error response: Couldn't find an Achievement with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Achievement couldn't be found"
    }
    ```

## Delete an Achievement by Id

Delete an existing achievement

- Require Authentication: true
- Request

  - Method: DELETE
  - Route path: /games/:gameId/achievements/:achievementId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find an Achievement with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Achievement couldn't be found"
    }
    ```

## ACHIEVEMENT POSTS

### Get all posts based on achievement id

Return all posts based on achievement id

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /games/:gameid/achievements/:achievementId/posts
  - Body: None

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Posts": [
        {
          "id": 1,
          "achievementId": 1,
          "body": "blah blah blah",
          "likes": 0,
          "dislikes": 0,
          "createdAt": "2025-01-02T15:30:00Z",
          "private": false
        },
        {
          "id": 2,
          "achievementId": 1,
          "body": "bla bla bla",
          "likes": 0,
          "dislikes": 0,
          "createdAt": "2025-01-03T15:30:00Z",
          "private": false
        }
      ]
    }
    ```

- Error Response: Couldn't find any posts for this achievement

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "No posts for this achievement"
    }
    ```

### Get all public posts based on achievement id

Return all public posts based on achievement id

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /games/:gameId/achievements/:achievementId/posts
  - Body: None

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Posts": [
        {
          "id": 1,
          "achievementId": 1,
          "body": "blah blah blah",
          "likes": 0,
          "dislikes": 0,
          "createdAt": "2025-01-02T15:30:00Z",
          "private": false
        },
        {
          "id": 2,
          "achievementId": 1,
          "body": "bla bla bla",
          "likes": 0,
          "dislikes": 0,
          "createdAt": "2025-01-03T15:30:00Z",
          "private": false
        }
      ]
    }
    ```

- Error Response: Couldn't find any public posts for this achievement

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "No public posts for this achievement"
    }
    ```

### Get all private posts based on achievement id

Return all private posts based on achievement id

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /achievements/:achievementId/posts
  - Body: None

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Posts": [
        {
          "id": 3,
          "achievementId": 1,
          "body": "blah blah blah",
          "likes": 0,
          "dislikes": 0,
          "createdAt": "2025-01-02T15:30:00Z",
          "private": true
        },
        {
          "id": 4,
          "achievementId": 1,
          "body": "bla bla bla",
          "likes": 0,
          "dislikes": 0,
          "createdAt": "2025-01-03T15:30:00Z",
          "private": true
        }
      ]
    }
    ```

- Error Response: Couldn't find any private posts for this achievement

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "No private posts for this achievement"
    }
    ```
