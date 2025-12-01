```js
/**
 * Endpoint 2: SECURE (Mitigated against SQL Injection)
 * This route uses a parameterized query (prepared statement). The user input is
 * passed as a separate argument, ensuring the database treats it as data, not code.
 * * MITIGATION: User input is bound to the $1 placeholder.
 */
```

```sql
INSERT INTO users (id, username, email) VALUES
(1,'jack','jack@example.com'),
(2, 'jackie','jackie@example.com'),
(3, 'john','john@example.com'),
(4, 'jane','jane@example.com');

INSERT INTO users (id, username, email) VALUES
  (5, 'jared',   'jared@example.com'),
  (6, 'josh',    'josh@example.com'),
  (7, 'jess',    'jess@example.com'),
  (8, 'james',   'james@example.com'),
  (9, 'julie',   'julie@example.com'),
  (10,'jill',    'jill@example.com'),
  (11,'jasmine', 'jasmine@example.com'),
  (12, 'jacob',   'jacob@example.com'),
  (13, 'joseph',  'joseph@example.com'),
  (14, 'joanna',  'joanna@example.com');

INSERT INTO users (id, username, email) VALUES
  (15, 'alice',    'alice@example.com'),
  (16, 'brandon',  'brandon@example.com'),
  (17, 'carla',    'carla@example.com'),
  (18, 'david',    'david@example.com'),
  (19, 'emily',    'emily@example.com'),
  (20, 'fiona',    'fiona@example.com'),
  (21, 'george',   'george@example.com'),
  (22, 'henry',    'henry@example.com'),
  (23, 'isabella', 'isabella@example.com'),
  (24, 'kevin',    'kevin@example.com');


UPDATE users set username = 'random' where id=1;

select * from users ;
```

```sql
delete from users

update users set name=random where id=1

```
