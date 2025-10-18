FROM node:18-alpine
WORKDIR /app

# copy project file and restore dependencies
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# expose port
EXPOSE 3000

# set env to prod
ENV NODE_ENV=production

# health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# run app
CMD ["node", "server.js"]
