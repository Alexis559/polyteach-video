FROM node:12

WORKDIR /etc/datadog-agent

ARG DD_API_KEY
ARG GOOGLE_APPLICATION_CREDENTIALS
ARG BUCKET_NAME
ARG PROJECT_ID
ARG CONTENT_FOLER
ARG SUBTITLES_FOLER

ENV DD_SITE="datadoghq.com"
ENV DD_INSTALL_ONLY=true
RUN bash -c "$(curl -L https://raw.githubusercontent.com/DataDog/datadog-agent/master/cmd/agent/install_script.sh)"

RUN echo "logs_enabled: true\nprocess_config:\nenabled: 'disabled'" >> datadog.yaml

WORKDIR	/etc/datadog-agent/conf.d

COPY ./datadog/conf.d/nodejs.d ./nodejs.d

WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y ffmpeg
COPY . .

RUN npm install

EXPOSE 3030

CMD ./run.sh
