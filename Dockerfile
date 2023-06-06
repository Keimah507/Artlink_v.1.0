FROM node:18

#create app dir
WORKDIR /src/app

#install app dependecies
COPY package*.json ./

RUN npm install

#Bundle app source
COPY . .

EXPOSE 5000

CMD ["npm", "start"]