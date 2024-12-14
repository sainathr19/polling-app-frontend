FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./


RUN npm install --production=false

COPY . .

ARG NEXT_PUBLIC_BACKEND_BASE_URL


RUN touch .env
RUN echo "NEXT_PUBLIC_BACKEND_BASE_URL=${NEXT_PUBLIC_BACKEND_BASE_URL}" >> .env 

RUN cat .env

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

COPY --from=builder /app/next.config.js* ./


COPY --from=builder /app/.env .env

EXPOSE 3000

CMD ["npm", "start"]
