FROM ubuntu

COPY build/cicada /usr/bin/
VOLUME [ "/data", "/config" ]
CMD cicada start -c /config/cicada.json --data /data --port 80
EXPOSE 80

LABEL org.opencontainers.image.title="cicada" \
  org.opencontainers.image.authors="mebtte<hi@mebtte.com>" \
  org.opencontainers.image.url="https://github.com/mebtte/cicada"
