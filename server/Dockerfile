FROM node:14
RUN groupadd -r your_group && useradd -r -g your_group your_user
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["node", "index.js"]