# Problem 6: Architecture

For this challenge, a specification is needed to create for a software module on backend application server.

## Table of contents
* [Overview](#overview)
* [Architecture Summary](#architecture-summary)
* [API Specification](#api-specification)
* [Execution Flow (Diagram)](#execution-flow-diagram)
* [Database Schema](#database-schema)
* [Security Mechanisms](#security-mechanisms)
* [Additional Comments & Improvement Suggestions](#additional-comments--improvement-suggestions)
  
## Overview
This module handles live score updating, score storage, and real-time scoreboard broadcasting for the website. It ensures the scoreboard always displays the top 10 highest-scoring users, updates instantly on any score change, and prevents unauthorized score manipulation.

## Architecture Summary
- REST API
  - Provide endpoints to handle registration, login, updating of score, and live scoreboard.
- WebSocket Gateway
  - This will broadcast and notify users when the top 10 scoreboard changes.
- Database Layer
  - Store users information and scores.
- Security Layer
  - Prevent unauthorized score manipulation and make sure that score updates are tied the user session.

## API Specification
### POST `/user/register`
#### Request Body
```
{
    "username": string,
    "password": string
}
```
#### Response Example
```
{
    "status": true,
    "message": "User successfully registered.",
    "data": null
}
```

### POST `/user/login`
#### Request Body
```
{
    "username": string,
    "password": string
}
```
#### Response Example
```
{
    "status": true,
    "message": "User successfully logged in.",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MWNhZmM0NmY3MzhkNGJhNzU1YTE0ZSIsInVzZXJuYW1lIjoibWFyaWEgbWFyaW1hciIsImlhdCI6MTc2MzQ4NzcyMSwiZXhwIjoxNzYzNTc0MTIxfQ.sTeQSeVND3gDIjZhkvJAuZvSgtE1pqQVNVF-ijWu_5U"
    }
}
```

### PUT `/user/score`
#### Request Header
```
  Authorization: Bearer <JWT_TOKEN>
```
#### Response Example
```
{
    "status": true,
    "message": "Score updated!",
    "data": {
        "score": 8
    }
}
```

### GET `/user/top10`
#### Response Example
```
{
    "status": true,
    "message": "Score updated!",
    "data": [
      {
        "_id": "691cafc46f738d4ba755a14e",
        "username": "maria marimar",
        "score": 8
      },
      {
          "_id": "691c98e871d1fca7c3389395",
          "username": "tester1",
          "score": 2
      },
      {
          "_id": "691caf7477c813e66d8e6f65",
          "username": "juan dela cruz",
          "score": 1
      },
      {
          "_id": "691cb01a6f738d4ba755a157",
          "username": "lucho",
          "score": 0
      }
    ]
}
```


## Execution Flow (Diagram)
### POST `/user/register`
<img width="500" height="636" alt="image" src="https://github.com/user-attachments/assets/56a01c34-101c-42ad-b289-4623abef77ae" />

### POST `/user/login`
<img width="500" height="636" alt="image" src="https://github.com/user-attachments/assets/36517868-1f15-4b81-af58-3f13f859c662" />

### PUT `/user/score`
<img width="500" height="1035" alt="image" src="https://github.com/user-attachments/assets/c2ff7e89-82d6-4bf9-b6be-ebdf50f2df25" />

### GET `/user/top10`
<img width="200" height="657" alt="image" src="https://github.com/user-attachments/assets/dd130272-ae6c-48b7-be0e-98e0a9a919cc" />

## Database Schema
### Collection: users
```
{
  "_id": string,
  "username": string,
  "password": hash,
  "score": number,
  "createdAt": date,
  "updatedAt": date,
}
```

## Security Mechanisms
1. JWT-based Authentication
- Every score update requires a valid JWT.
- User's login session expires at least for 24 hours upon creation.
2. Server-side Score Validation
- Score increments must be happen on the server not directly thorugh the client.
3. Logging & Monitoring
- Monitor invalid login or score update attempts. 
- Flag or ban users with suspicious activities.

## Additional Comments & Improvement Suggestions
1. Add Rank Based Rewards
- Implement a reward system tied to player rankings on the scoreboard.
- Players earn increasingly valuable rewards as they move up the leaderboard.
- Encourages consistent engagement and competition, motivating players to actively participate and improve their rank to obtain better rewards.
- Rewards can include in-game currency, items, badges, or exclusive perks.
2. Add Score Reset or Seasonal Leaderboards
- Boosts long-term engagement.
