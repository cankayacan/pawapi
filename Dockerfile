# Build stage
FROM mcr.microsoft.com/playwright:v1.52.0-jammy AS base

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

# Production stage
FROM mcr.microsoft.com/playwright:v1.52.0-jammy

WORKDIR /app

COPY --from=base /app .

# Optional: install only chromium if not already preinstalled
# RUN npx playwright install chromium

EXPOSE 4000

CMD [ "yarn", "start:prod" ]
