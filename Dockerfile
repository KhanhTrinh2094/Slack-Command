FROM node:6.12

LABEL Maintainer = "Trinh Nguyen <trinh.nguyen@simplypost.com>" \
      Vendor="Trinh Nguyen" \
      License=MIT \
      Version=1.0.0

# Build app

WORKDIR $HOME/app
COPY package.json $HOME/app/
RUN npm install
COPY . $HOME/app/

EXPOSE 20300

CMD [ "npm", "start" ]
