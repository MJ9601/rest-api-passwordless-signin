## Project overview

This project consists of simple UI with frontend framework `Next` and `restapi` backend server (`express version 5.0.0 beta`). The main focus of this project is on backend server where the client can signin with email and password and server will verify client email through sending mail. In this <i>api</i> client is able to change his/her password through email confirmation. Futhermore, the backend server also provides passwordless signin also through email confirmation. The email confirmation will be handled using `nodemailer` module.
After confirmation of client's mail, his/her account will be verified and sessions will be created for login process. The `accessToken` and `refreshToken` will be created using `jsonwebtoken` and get attached to cookies in response.

## Getting Started


<b>Server:</b>
To run the server in development mode at the server directory use following commad

```bash
yarn dev
or
npm dev
```
The server will be running on PORT `8080` and it is accessable in [http://localhost:8080](http://localhost:8080).

<b>UI</b>

To run the UI in development mode at the ui directory use following commad

```bash
yarn dev
or
npm dev
```

The ui will be running on PORT `3000` and it is accessable through [http://localhost:3000](http://localhost:3000) url.

## Tech in Use

The both ui and server are writtin in <code>Typescript</code>. In the following lines the Tech which have been used to create ui and server are listed:

<b>Server</b>

The Tech the use in the server are:

```bash
Typescript,
express,
mongoose,
cookie-parser,
cors,
nodemailer,
zod,

```

<b>Ui</b>

A simple login Ui is choose for this project since the main focus of it is on the backend, so only Tech required is <i>Next</i> with <code>SSR</code>.

## Project Status

Started, under development.
