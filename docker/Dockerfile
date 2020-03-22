FROM python:3.9.0a4-buster

WORKDIR /usr/src/app

COPY ./ ./

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 80/tcp
EXPOSE 80/udp

CMD [ "python", "./start.py" ]
