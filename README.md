# Tinyhouse Client

Fullstack Typescript, React and GraphQL Application. This app made by follow this amazing course https://www.newline.co/tinyhouse. This only hold on frontend-side if you wonder the server-side located here: https://github.com/alrasyidin/tinyhouse-server. You can also visit the final application that has been deployed on the heroku platform here: https://tinyhouse-app-v2.herokuapp.com.

## Technology

- React
- React Router DOM
- GraphQL with Apollo Client
- Ant Design
- Typescript

## Features

- Integration sign-in / sign-up with Google OAuth.
- Upload and integrate Image with Cloudinary API.
- Browse listing base on geolocation search request.
- Filter and sort listing on certain condition
- Create listing
- Integraton online payment with Stripe API

## Usage

### Env Variable

create .env variable at the top of root project like this:

```
REACT_APP_SERVER_URL=
REACT_APP_S_CLIENT_ID=
REACT_APP_S_PUBLISHABLE_KEY=
```

server url is your server api, client id and publisable key is value from Stripe API.

### Client

```
npm install
npm run codegen:schema
npm run codegen:generate
npm run start
```

Codegen only can be running with after you start the development server. you can start development server base on this guide [here](https://github.com/alrasyidin/tinyhouse-server).

## Screenshot

![landing page](https://i.postimg.cc/05yKq0NQ/1.png)
![listings page](https://i.postimg.cc/BvJQBJL6/2.png)
![user profile page](https://i.postimg.cc/yYSdVQCV/3.png)
![listing detail page](https://i.postimg.cc/HkwkMrLR/4.png)
![create listing page](https://i.postimg.cc/mgfrhYT7/5.png)
