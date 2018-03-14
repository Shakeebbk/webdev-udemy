FROM node:6.11

# Set the working directory to /app
WORKDIR /app

COPY package.json /lib

# Install any needed packages specified in package.json
RUN cd /lib && npm install

# Make port 80 available to the world outside this container
EXPOSE 80

ENV NODE_PATH=/lib/node_modules

# Run app.py when the container launches
CMD /bin/sh -c "node app.js"
