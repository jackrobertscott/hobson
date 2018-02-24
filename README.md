# hobson

> Lightweight, minimalistic approach to fully functioning RESTful endpoints.

[![Build Status](https://travis-ci.org/jackrobertscott/hobson.svg?branch=master)](https://travis-ci.org/jackrobertscott/hobson) [![npm version](https://badge.fury.io/js/hobson.svg)](https://badge.fury.io/js/hobson) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Get up and running with a fully functioning CRUD api with minimum configuration. Simply set add your schema to a resource and attach it to your app.

## Features

RESTful endpoint features:

- Optional CRUD endpoints provided by default
- Custom endpoints can be added
- Endpoints are protected by default
- Provide permission functions to allow access
- Mongoose model schemas
- Pre and post hooks to all endpoints

## Install

Get started by installing hobson and mongoose. Mongoose is required as it gives us awesome schema validation features.

```sh
npm i -S hobson mongoose
```

## Usage

Takes advantage of the awesome powers of mongoose for defining schemas and models.

```js
import mongoose from 'mongoose';

export const messageSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// custom mongoose functions, virtual properties, and more...

export default messageSchema;
```

Create the resource.

```js
import { Resource } from 'hobson';
import messageSchema from './messageSchema';

const messageResource = new Resource({
  name: 'message',
  schema: messageSchema,
});

// other cool things...

messageResource.compile().attach(app);
```

Call the endpoints like you would on a regular RESTful api.

| Type          |             | Endpoint           | Example                             |
|---------------|-------------|--------------------|-------------------------------------|
| `find`        | get         | `/cats`            | `/cats?filter[color]=white`         |
| `findOne`     | get         | `/cats/:catId`     | `/cats/5a8ed7fabf4aabad60e41247`    |
| `create`      | post        | `/cats`            | `/cats`                             |
| `update`      | patch       | `/cats/:catId`     | `/cats/5a8ed7fabf4aabad60e41247`    |
| `remove`      | delete      | `/cats/:catId`     | `/cats/5a8ed7fabf4aabad60e41247`    |

Disable any default endpoints when defining the resource.

```js
const messageResource = new Resource({
  name: 'message',
  schema: messageSchema,
  disable: ['find', 'remove'], // disabled
});
```

Create custom endpoints.

```js
messageResource.addEndpoint('talkSmack', {
  path: '/talk/smack',
  method: 'get',
  handler: () => 'Yo mama!',
});
```

Routes are **protected by default**. Provide permission functions to give access to your users.

```js
messageResource
  .addPermission('find', ({ user }) => {
    return true; // access given to everyone
  })
  .addPermission('talkSmack', ({ user }) => {
    return user.role === ROLE_ADMIN; // access given to only admins
  });
```

Provide hooks to your endpoints which will be run before and after the main handler. There is also a helpful `context` object which you can use to assign data to and access through out your function chain.

```js
messageResource
  .addPreHook('talkSmack', ({ context }) => {
    context.appendMessage = 'Hi Fred,';
  })
  .addPostHook('talkSmack', ({ data, context }) => {
    console.log(context.appendMessage, data); // Hi Fred, Yo mama!
  })
```

Use old express middleware too. This will be run before all other functions.

```js
messageResource.addMiddleware('talkSmack', (req, res, next) => {
  req.example = 'Make sure your old middleware functions call next()';
  next();
});
```

## Endpoint Standards

Endpoints should return information is a specific format that is easy to read on the client.

The following standards are inspired by the work done on JSend. See there standards [here](https://labs.omniti.com/labs/jsend).

### Success

```json
{
  "status": "success",
  "code": 200,
  "data": {
    "messages": [{
      "_id": "110297391319273",
      "content": "This is a good message.",
    }, {
      "_id": "110297391319273",
      "content": "This is another message.",
    }],
  }
}
```

### Failed

```json
{
  "status": "fail",
  "code": 400,
  "message": "There was a validation error.",
  "data": {
    "title": {
      "message": "Path `title` is required.",
      "kind": "required",
      "path": "title",
    },
    "magic.wands": {
      "message": "Path `magic.wands` (10) is less than minimum allowed value (1000).",
      "kind": "min",
      "path": "magic.wands",
      "value": 10,
    }
  }
}
```

### Error

```json
{
  "status": "error",
  "code": 500,
  "message": "The server pooped itself.",
}
```

## Maintainers

- [Jack Scott](https://github.com/jackrobertscott)
- [Thomas Rayden](https://github.com/thomasraydeniscool)

## License

MIT