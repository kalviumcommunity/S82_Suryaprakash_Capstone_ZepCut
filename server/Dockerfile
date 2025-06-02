# Use Node.js base image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Set environment (optional)
ENV NODE_ENV=production

# Expose the port your app runs on
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
