# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json .
COPY package-lock.json .
COPY /public/ .
COPY /sockets/ .

RUN npm install --omit=dev

# Bundle app source
COPY . .

# Expose port 
EXPOSE 80

# Start app
CMD ["npm", "start"]
