FROM postgres
ENV POSTGRES_PASSWORD docker
ENV POSTGRES_DB forcast
EXPOSE 5432
COPY forcasts.sql /docker-entrypoint-initdb.d/