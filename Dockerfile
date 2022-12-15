FROM ubuntu

RUN apt-get update -y

RUN apt-get upgrade -y

RUN apt-get install nodejs -y

RUN apt-get install git -y

RUN apt-get install npm -y

RUN npm i -g static-server --unsafe-perm=true

COPY . /root/app

WORKDIR /root/app

RUN npm i

RUN npm run build

RUN adduser coder

USER coder

WORKDIR /home/coder

RUN git clone https://github.com/codedamn-classrooms/html-playground-starter.git app

USER root

RUN npm install pm2 -g

WORKDIR /home/coder

RUN mkdir temp

WORKDIR /root/app

EXPOSE 1338
EXPOSE 9080

COPY start.sh /
RUN chmod +x /start.sh

ENTRYPOINT ["/start.sh"]
