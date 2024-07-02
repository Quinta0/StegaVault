# Use the official Node.js image from the Docker Hub with the latest LTS version
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the Next.js port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "dev"]