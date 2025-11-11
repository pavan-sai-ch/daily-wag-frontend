# Use the official Node.js 20 image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json first
# This takes advantage of Docker's layer caching
COPY package*.json ./

# Install all project dependencies
RUN npm install

# Copy the rest of your project's code into the container
COPY . .

# Expose port 5173, which is the default port for Vite
EXPOSE 5173

# The command to run your app
# We add "--" "--host" "0.0.0.0" so that the Vite server
# is accessible from outside the container (e.g., from your browser)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]