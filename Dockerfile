FROM node:alpine
WORKDIR /src
COPY ["package.json",  "package-lock.json", "./"]
RUN npm install
COPY . .
CMD ["npm", "run", "start"]