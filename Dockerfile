FROM node:22.14-alpine3.21 AS base
ENV TZ=Europe/Prague \
    NODE_ENV=production

WORKDIR /measurement
RUN npm install -g pnpm@10.6.5

COPY package.json pnpm-lock.yaml ./
RUN pnpm i --prod --frozen-lockfile

FROM base AS dev
ENV NODE_ENV=development
RUN echo y | pnpm i --frozen-lockfile

EXPOSE 3000
