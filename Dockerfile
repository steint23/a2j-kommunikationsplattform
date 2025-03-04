# Download and install the dependenciees for building the app
FROM node:20-alpine AS build-dependencies

WORKDIR /kompla-app
COPY package*.json ./
RUN npm ci

# Download and install the dependencies for running the app
FROM node:20-alpine AS production-dependencies

ENV NODE_ENV=production
WORKDIR /kompla-app
COPY package*.json ./
RUN npm ci

# Build the app
FROM node:20-alpine AS build

ARG COMMIT_SHA
ENV APP_VERSION=$COMMIT_SHA

# Create app directory
WORKDIR /kompla-app

# Copy the build dependencies
COPY --from=build-dependencies /kompla-app/node_modules /kompla-app/node_modules

# Required files are whitelisted in dockerignore
COPY . ./
RUN npm run build

# Final image that runs the app
FROM node:20.18.3-alpine3.21

# TODO: Check https://hub.docker.com/r/library/node/tags?name=alpine3.20
# - Remove npm update when CVE-2024-21538 is fixed (https://scout.docker.com/vulnerabilities/id/CVE-2024-21538?s=github)
RUN npm update -g npm && npm cache clean --force && \
    apk add --no-cache dumb-init && rm -rf /var/cache/apk/*


# Create tmp directory and make it writable.
# This is needed for the application to write file uploads to the tmp directory
#   before they are sent to the Justiz-Backend-API
RUN mkdir -p /tmp

USER node

# Ensure the node user has ownership and correct permissions for the tmp directory
RUN chown node:node /tmp && chmod 700 /tmp

ENV NODE_ENV=production
ENV npm_config_cache=/tmp/.npm
ARG COMMIT_SHA
ENV APP_VERSION=$COMMIT_SHA

WORKDIR /home/node/kompla-app
# Move only the files to the final image that are really needed
COPY package*.json LICENSE SECURITY.md ./
COPY --from=production-dependencies /kompla-app/node_modules/ ./node_modules/
COPY --from=build /kompla-app/build/server ./build/server
COPY --from=build /kompla-app/build/client ./build/client

EXPOSE 3000
CMD ["npm", "run", "start"]
