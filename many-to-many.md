# Many to many relations

## GET /books/12

```json
{
  "id": 12,
  "title": "Get Rich Quick",
  "pages": 1,
  "authors": [
    {
      "id": 8,
      "name": "Mrs Beast",
    }
  ]
}
```

## POST /books/12/authors

```json
{
  "id": 8
}
```

```json
[
  {
    "id": 7
  },
  {
    "id": 8
  }
]
```


POST /authors
DELETE /authors/:authorId

POST /books/:bookId/authors
DELETE /books/:bookId/authors/:authorId

## DELETE /books/13/authors/9

