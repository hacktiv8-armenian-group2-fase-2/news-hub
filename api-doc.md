# NEWS HUB-server

​
List of available endpoints:
​
- `POST /register`
- `POST /login`

And routes below need authentication
- `POST /favorites`
- `GET /favorites`
- `DELETE /favorites/:id`
- `GET /news`

### POST /register

Request:

- data:

```json
{
  "email": "string",
  "password": "string"
}
```

Response:

- status: 201
- body:
  ​

```json
{
  "id": "integer",
  "email": "string"
}
```

### POST /login

Request:

- data:

```json
{
  "email": "string",
  "password": "string"
}
```

Response:

- status: 200
- body:
  ​

```json
{
  "access_token": "string"
}
```

### POST /favorites
Request:

- headers: access_token

- data:

```json
{
    "title":"Test Title",
    "description": "Test description",
    "url": "http://testurl.com",
    "imageUrl": "http://testurl.com/abc",
    "publishedAt": "2021/06/10"
}
```

​Response:

- status: 201
- body:
  ​

```json
{
    "id": 1,
    "title": "Test Title",
    "description": "Test description",
    "url": "http://testurl.com",
    "imageUrl": "http://testurl.com/abc",
    "publishedAt": "2021-06-09T17:00:00.000Z",
    "userid": 1,
    "updatedAt": "2021-06-09T19:23:41.351Z",
    "createdAt": "2021-06-09T19:23:41.351Z"
}
```

### GET /favorites

Description: Get all favorites from current user logged

Request:

- headers:
  - access_token: string

Response:

- status: 200
- body:
  ​

```json
[
    {
        "id": 1,
        "title": "Test Title",
        "description": "Test description",
        "url": "http://testurl.com",
        "imageUrl": "http://testurl.com/abc",
        "publishedAt": "2021-06-09T17:00:00.000Z",
        "userid": 1,
        "updatedAt": "2021-06-09T19:23:41.351Z",
        "createdAt": "2021-06-09T19:23:41.351Z"
    }
]
```

### DELETE /favorites/:id

description: 
  Delete one of the current logged in user password. (cannot delete another user password)

Request:

- headers: access_token
- params: 
  - id: integer (required)

Response:

- status: 200
- body:

```json
{
    "message": "favorite news success to delete"
}
```

### GET /news

Description: Get all news

Request:

- headers:
  - access_token: string

Response:

- status: 200
- body:
  ​

```json
[
    {
        "title": "Wamenag Apresiasi Dubes Saudi Klarifikasi Informasi Terkait Ibadah Haji 2021 - Kompas.com - Nasional Kompas.com",
        "description": "'Langkah Dubes sangat positif dan patut kita apresiasi,' kata Zainut Tauhid Saadi.  Halaman all",
        "url": "https://nasional.kompas.com/read/2021/06/09/22352721/wamenag-apresiasi-dubes-saudi-klarifikasi-informasi-terkait-ibadah-haji-2021",
        "imageUrl": "https://asset.kompas.com/crops/Wl-FGO7SwiPo5XcUg-WaW59n214=/33x196:1671x1288/780x390/filters:watermark(data/photo/2020/03/10/5e6775ae18c31.png,0,-0,1)/data/photo/2020/01/27/5e2e73631aaa1.jpg",
        "publishedAt": "2021-06-09T15:35:00Z"
    }
]
```