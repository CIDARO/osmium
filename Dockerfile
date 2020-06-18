FROM node:10

RUN apt-get update
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.2.list
RUN apt-get install -y apt-transport-https cron
RUN apt-get update
RUN apt-get install -y --allow-unauthenticated mongodb-org-tools
WORKDIR /usr/local/osmium
COPY . .
RUN npm install -g
RUN chmod +x startAgent.sh
RUN ./startAgent.sh
ENTRYPOINT ["/bin/bash"]