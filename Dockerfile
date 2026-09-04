FROM node:22-slim
WORKDIR /app

ENV HUSKY=0
ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run validate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
