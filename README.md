# Haproxy config editor

Web application for editing haproxy.cfg and other related files such as maps and lists.

## Setup

To start with the project run the following commands:
```shell
$ git clone https://github.com/maeek/haproxy-editor.git
$ cd haproxy-editor
$ npm run install:all
```

## Build for deployment

The app consists of 2 parts: web application and REST API. To bundle the whole app run:
```shell
$ npm run build
```

If you want to build only one component run:
```shell
$ npm run compile:client  # for frontend application
$ npm run compile:server  # for REST API
```

## Docker

First build docker image with
```shell
$ docker build --tag haproxy-editor -f deploy/Dockerfile .
```

Run container with:
```shell
$ docker run -d \
    --name haproxy-editor \
    --restart on-failure \
    -v /path/to/haproxy/configs:/configs \
    -e CONFIG_DIR=/alternative/configs/path \
    haproxy-editor
```


