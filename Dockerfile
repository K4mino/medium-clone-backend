FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci
RUN npm install pg --save

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install pg --save
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]