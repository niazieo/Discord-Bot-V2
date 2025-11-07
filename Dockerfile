FROM node:latest

RUN mkdir -p /app
WORKDIR /app

# RUN apt-get update && apt-get install -y git 
# RUN git clone https://github.com/niazieo/Discord-Bot-V2.git /app
COPY /src /app/src

COPY package*.json /app/
RUN npm install
RUN apt-get update && apt-get upgrade

COPY .env /app

CMD ["node", "/app/src/bot.js"]