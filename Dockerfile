FROM node:10-alpine

WORKDIR /opt/testing-web-system

ADD api /opt/testing-web-system/api/
ADD app/src /opt/testing-web-system/app/src/
ADD .env /opt/testing-web-system/
ADD package.json /opt/testing-web-system/
ADD webpack.config.js /opt/testing-web-system/
RUN npm i
RUN npm run webpack
RUN npm i --production

EXPOSE 3000

CMD ["node", "api/index"]
