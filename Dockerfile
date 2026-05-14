# Use an official base image (Node.js with browsers and dependencies)
#It's recommended to pin to a specific version for reproducibility
FROM mcr.microsoft.com/playwright:v1.60.0-noble
# Set the working directory inside the container
WORKDIR /app
# copy package.json and package-lock.json to install dependencies
# This leverages Docker's caching, so dependencies area only resinstated if these files change
COPY package.json ./
# Install project dependencies
RUN npm install
# Copy the rest of the Playwright project files into the container
COPY . .
# Command to run Playwright tests when the container starts
# this is adjustable based on specific needs
CMD ["npx", "playwright", "test"]
