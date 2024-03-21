FROM node:10-alpine

WORKDIR /opt/testing-web-system

ADD node_modules node_modules/
ADD api api/
ADD app/dist app/dist/
ADD .env .

EXPOSE 3000

CMD ["node", "api/index"]
