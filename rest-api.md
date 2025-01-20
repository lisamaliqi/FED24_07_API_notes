# REST (API)

**RE**presentational **S**tate **T**ransfer

"Representativ lägesöverföring"

URL = Uniform Resource Locator
Path

## Entity / Resource

Egentligen vad som helst men en enskild "typ"/samling av saker.

Exempel: `books`, `todos`, `users`.

## CRUD

```text
C = Create
R = Read
U = Update
D = Delete
```

```text
HTTP Verb   Path                 Action                 CRUD     Name
----------- -------------------- ---------------------- -------- ------
GET         /users               Get all users          Read     index
GET         /users/4             Get a single user      Read     show
POST        /users               Create a new user      Create   store
PATCH/PUT   /users/4             Update a single user   Update   update
DELETE      /users/4             Delete a single user   Delete   destroy
```

## RESTful API

Stateless REST API

```text
PATCH /users/4
Authorization: Basic 456456a1ee3f:a34e5423c
```

```text
DELETE /users/4
Authorization: Basic 456456a1ee3f:a34e5423c
```
