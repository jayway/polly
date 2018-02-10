# polly

Amazon Polly text to speech implementation. Created, hastily, at the 2018 Örenäs competence weekend.

## Install

```sh
npm install
```

## Usage

You need AWS credentials either through environment variables or in `~/.aws/credentials`.

Example using environment variables:

```sh
export AWS_ACCESS_KEY_ID=MY_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=MY_SECRET_ACCESS_KEY
```

Then start the server:

```sh
npm start
```

Navigate to [http://localhost:3000](http://localhost:3000).
