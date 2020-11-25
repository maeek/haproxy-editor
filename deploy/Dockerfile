FROM nginx

ENV API_PORT=8080
ENV CONFIG_DIR=/configs
ENV PROXY_IP=127.0.0.1

WORKDIR /tmp

RUN apt update \
    && apt upgrade -y \
    && curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh \
    && chmod +x nodesource_setup.sh \
    && ./nodesource_setup.sh \
    && rm -rf /tmp/nodesource_setup.sh \
    && apt install -y nodejs build-essential git

COPY . /tmp/haproxy-editor
COPY ./deploy/nginx.conf /etc/nginx/nginx.conf 

WORKDIR /tmp/haproxy-editor

RUN npm run install:all \
    && npm run build:docker \
    && cp -r build/server/* /srv/ \
    && cp -r build/client/* /usr/share/nginx/html/ \
    && rm -rf /tmp/haproxy-editor

WORKDIR /srv

VOLUME [ "/configs" ]

EXPOSE 80

CMD nginx ; node /srv/index.js
