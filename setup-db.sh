docker stop todolistapi-db && docker rm todolistapi-db
docker run -d --name todolistapi-db -p 27017:27017 -v todolistapi-db-data:/data/db -e MONGO_INITDB_ROOT_USERNAME="admin" -e MONGO_INITDB_ROOT_PASSWORD="ultimatesecret" mongo:6
