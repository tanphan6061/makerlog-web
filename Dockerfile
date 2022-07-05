# Make sure to give Docker a lot of memory, otherwise it'll just "Killed"
# It won't warn you, it simply won't npm start.
FROM node:12.19.0-alpine AS base
WORKDIR /base
COPY package*.json ./
RUN apk update && apk upgrade && \
    apk add --no-cache git
RUN npm install
COPY . .

FROM base AS build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base ./
RUN npm run build

FROM node:12.19.0-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /build/package*.json ./
COPY --from=build /build/.next ./.next
COPY --from=build /build/next.config.js next.config.js
COPY --from=build /build/postcss.config.js postcss.config.js
COPY --from=build /build/jsconfig.json jsconfig.json
COPY --from=build /build/.babelrc .babelrc
COPY --from=build /build/public ./public
RUN npm install next

EXPOSE 3000
CMD npm run start