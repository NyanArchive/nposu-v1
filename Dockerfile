FROM node:16-alpine
RUN npm install --location=global pnpm
WORKDIR /app
COPY . .
RUN pnpm install
ENTRYPOINT ["pnpm", "start"]