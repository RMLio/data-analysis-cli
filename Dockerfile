FROM ubuntu:15.10
ARG SCRIPT

#ENV SCRIPT scripts/run.sh

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -y nodejs

CMD mkdir key-discovery-cli
WORKDIR key-discovery-cli
ADD . .
ADD $SCRIPT ./run.sh

CMD bash -C ./run.sh