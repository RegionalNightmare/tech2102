# ---------- Stage 1: Build the React app ----------
FROM node:18-alpine AS build
WORKDIR /app

# Install deps first (better layer caching)
COPY package*.json ./
RUN npm install

# Copy source and build production bundle
COPY . .
RUN npm run build

# ---------- Stage 2: Serve the build with Node ----------
FROM node:18-alpine
WORKDIR /app

# "serve" is a tiny static file server that runs on Node.js
RUN npm install -g serve

# Copy only the built artifacts from the build stage
COPY --from=build /app/build ./build

EXPOSE 3000

# Serve the React build on port 3000
CMD ["serve", "-s", "build", "-l", "3000"]
