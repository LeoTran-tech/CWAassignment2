# assi2/api/Dockerfile

# Use the image with the latest LTS version of Node.js
FROM node:lts
   
   # some Node packages like sqlite3 need to compile native code
   RUN apt-get update && apt-get install -y python3 make g++
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   
   # copy code to the container
   COPY . .
   
   # use port 3000 for the container
   EXPOSE 3000
   CMD ["npm", "run", "dev"]