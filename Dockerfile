FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . . 
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

COPY --from=builder /app/next.config.js* ./

EXPOSE 3000

CMD ["npm", "start"]
