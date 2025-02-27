FROM postgres
ENV POSTGRES_PASSWORD docker
ENV POSTGRES_DB forecast
EXPOSE 5432
COPY forecasts.sql /docker-entrypoint-initdb.d/