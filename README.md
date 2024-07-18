# Perustiedot

Vaihteeksi no-brainer Python/Node/Vue/Nginx/MySQL/Docker "microservice"hässäkkä, joka lukee yleisimpiä kotimaisia RSS uutisfeedejä, tallentaa uusimmat uutiset kantaan eniten käytettyine sanoineen ja kategorioineen. Jokainen uutislähde on oma konttinsa.

Ekstrasimppeli Vue frontti, jossa canvakseen räjäytetään 50 eniten käytettyä sanaa.

Aika alkoi loppumaan, joten tehnyt frontille / public restille sen kummempaa. Muutenkin jäi kesken, mutta ihan saa kyllä näinkin toimivana rullaamaan taustalle.

# python_rrs_reader

Simppeli palikka, joka lukee `feedparser`illa RRS feedin. Iteroi uutiset ja lähettää ne halutussa muodossa nodejs_inner_restille. Rivit lähetetään yksitellen, on oletettu että RRS feedin lukuväli on esim. 15min jonka aikana ei kovin montaa uutista yhdestä lähteestä tule.

```
python3 -m venv venv
```

```
source venv/bin/activate
```

```
pip install -r requirements.txt
```

```
python3 main.py
```

```
deactivate
```

# nodejs_inner_rest

Ottaa vastaan python_rss_readerilta POST sanomaa tallentaen uutisrivit MySQL kantaan `knex`iä käyttäen. Asynkkinä myös päivittää uutisotsikoista löydetyt sanat ja kategoriat kantaan.

Hallitsee myös tietokantamigraatiot.

```
npm install
```

```
npm run dev
```

```
npx knex migrate:latest
```

# nodejs_public_rest

Ottaa vastaan GETiä, tarkoitettu lähinnä fronttia varten. Palauttaa tietokannasta 50 eniten uutisotsikoista ilmennyttä sanaa (tietokantariviä).

Nginx ohjannee sanomat /apista tälle kontille porttiin 3000.

```
npm install
```

```
npm run dev
```

## .env_is

reader_is konttia varten.

```
touch .env_is
```

```
MAIN_INTERVAL_SECONDS=300
FEED_URL=https://www.is.fi/rss/tuoreimmat.xml
NODEJS_INNER_REST_URL=http://inner_rest:3000
```

## .env_yle

reader_yle konttia varten.

```
touch .env_yle
```

```
MAIN_INTERVAL_SECONDS=300
FEED_URL=https://feeds.yle.fi/uutiset/v1/majorHeadlines/YLE_UUTISET.rss
NODEJS_INNER_REST_URL=http://inner_rest:3000
```

## .env_mtv

reader_mtv konttia varten.

```
touch .env_mtv
```

```
MAIN_INTERVAL_SECONDS=300
FEED_URL=https://api.mtvuutiset.fi/mtvuutiset/api/feed/rss/uutiset_uusimmat
NODEJS_INNER_REST_URL=http://inner_rest:3000
```

## container_secret_mysql_password.txt

mysql konttia varten.

```
touch container_secret_mysql_password.txt
```

```
foobar
```

## container_secret_mysql_root_password.txt

mysql konttia varten.

```
touch container_secret_mysql_root_password.txt
```

```
foobarsecret
```

## .env

Lähinnä kehittämistä varten. Ei pitäisi olla käytössä konteissa.

```
touch .env
```

```
MYSQL_CONTAINER_HOST=localhost
MYSQL_CONTAINER_PORT=3306
MYSQL_CONTAINER_DATABASE=rss_reader_db
MYSQL_CONTAINER_USER=rss_reader_user
MYSQL_CONTAINER_PASSWORD=foobar

MAIN_INTERVAL_SECONDS=15
FEED_URL=https://www.is.fi/rss/tuoreimmat.xml
NODEJS_INNER_REST_URL=http://localhost:3000

```

## vue/.env

Hox: käytä porttia kehittäessä.

```
touch vue/.env
```

```
VITE_PUBLIC_API_URL=http://localhost/api
```

## nginx.conf

Juureen. Ohjaa pyynnöt Vuelle ja nodejs_public_restille. Ei tarvita kehittäessä, vaan konttia varten.

```
touch nginx.conf
```

```
upstream api_containers {
  server public_rest:3000;
}

# Configuration for the server
server {
  client_max_body_size 1M;
  listen 80;

  location ~ /\.env {
        deny all;
        access_log off;
        log_not_found off;
    }

  location / {
    root /app;
    index index.html;
    try_files $uri /index.html;
  }

  # Proxying the connections
  location /api {
    proxy_pass http://api_containers;
  }
}

```

## docker-compose.yml

Juureen.

```
touch docker-compose.yml
```

```
services:
  mysql:
    build:
      context: .
      dockerfile: mysql.Dockerfile
    container_name: mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD_FILE: /run/secrets/db_root_password
      MYSQL_DATABASE: rss_reader_db
      MYSQL_USER: rss_reader_user
      MYSQL_PASSWORD_FILE: /run/secrets/db_password
    ports:
      - '3306:3306'
    volumes:
      - ./mysql_data:/var/lib/mysql:rw
    networks:
      - pyrrs_network
    secrets:
      - db_password
      - db_root_password

  inner_rest:
    build:
      context: .
      dockerfile: inner_rest.Dockerfile
    container_name: inner_rest
    depends_on:
      - mysql
    restart: unless-stopped
    volumes:
      - ./.env_inner_rest/:/app/.env/
    networks:
      - pyrrs_network
    logging:
      options:
        max-size: '5m'
        max-file: '10'

  public_rest:
    build:
      context: .
      dockerfile: public_rest.Dockerfile
    container_name: public_rest
    depends_on:
      - mysql
    restart: unless-stopped
    volumes:
      - ./.env_public_rest/:/app/.env/
    networks:
      - pyrrs_network
    logging:
      options:
        max-size: '5m'
        max-file: '10'

  nginx:
    build:
      context: .
      dockerfile: nginx.Dockerfile
    container_name: nginx
    depends_on:
      - public_rest
    ports:
      - '80:80'
    volumes:
      - ./vue/.env/:/usr/src/app/.env/
      - ./nginx.conf/:/etc/nginx/conf.d/default.conf
    restart: unless-stopped
    networks:
      - pyrrs_network

  reader_yle:
    build:
      context: .
      dockerfile: reader.Dockerfile
    container_name: reader_yle
    depends_on:
      - inner_rest
    restart: unless-stopped
    volumes:
      - ./storage:/app/storage
      - ./.env_yle:/app/.env
    logging:
      options:
        max-size: '5m'
        max-file: '10'
    networks:
      - pyrrs_network

  reader_is:
    build:
      context: .
      dockerfile: reader.Dockerfile
    container_name: reader_is
    depends_on:
      - inner_rest
    restart: unless-stopped
    volumes:
      - ./storage:/app/storage
      - ./.env_is:/app/.env
    logging:
      options:
        max-size: '5m'
        max-file: '10'
    networks:
      - pyrrs_network

  reader_mtv:
    build:
      context: .
      dockerfile: reader.Dockerfile
    container_name: reader_mtv
    depends_on:
      - inner_rest
    restart: unless-stopped
    volumes:
      - ./storage:/app/storage
      - ./.env_mtv:/app/.env
    logging:
      options:
        max-size: '5m'
        max-file: '10'
    networks:
      - pyrrs_network

networks:
  pyrrs_network:

secrets:
  db_password:
    file: container_secret_mysql_password.txt
  db_root_password:
    file: container_secret_mysql_root_password.txt


```
