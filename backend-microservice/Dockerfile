# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire app source code
COPY . .

# Expose the app's port
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
