# JWT Refresh Tokens

| Time     | Request Payload       | Endpoint      | Response                                                     |
|----------|-----------------------|---------------|--------------------------------------------------------------|
| 09:15:00 | username/password     | POST /login   | access_token (15min, 09:30:00), refresh_token (1h, 10:15:00) |
| 09:20:00 | access_token          | GET /profile  | 200 OK                                                       |
| 09:33:22 | access_token          | GET /profile  | 401 Unauthorized                                             |
| 09:33:23 | refresh_token         | POST /refresh | new_access_token (15min, 09:48:23)                           |
| 09:33:24 | new_access_token      | GET /profile  | 200 OK                                                       |
| 09:55:00 | access_token          | GET /profile  | 401 Unauthorized                                             |
| 09:55:01 | refresh_token         | POST /refresh | new_new_access_token (15min, 10:10:01)                       |
| 09:55:02 | new_new_access_token  | GET /profile  | 200 OK                                                       |
