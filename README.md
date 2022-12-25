# CodeNative Fileserver

File server that provides the files to CodeNative frontend over a socket connection in real-time.

# Run Locally

- Clone the repo.
- Build the docker image using the ``Dockerfile``.
- ``docker run -d -p 1338:1338 -p 9080:9080 -d codenativefileserver:latest`` To spawn a container

# Tech-Stack

- Node.js
- socket-io
- node-pty
- chokidar
- Typescript
- nodemon

# Features

- Real time CRUD on files over socket.
- Real time terminal.
- Docker image is uploaded to AWS ECR and every time a new playground is created, it spawn a new container in AWS ECS using the image.

