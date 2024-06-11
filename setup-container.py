import subprocess
import os
import sys

def generate_docker_compose(db_name, collection_name, json_file_path, collection_name2, json_file_path2):
    json_file_path = os.path.abspath(json_file_path)
    json_file_path2 = os.path.abspath(json_file_path2)

    docker_compose_template = f"""
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
  mongo-seed:
    image: mongo:latest
    volumes:
      - {json_file_path}:/datasets/dataset1.json
      - {json_file_path2}:/datasets/dataset2.json
    command: >
      /bin/bash -c "mongoimport --host mongodb -d {db_name} -c {collection_name} --type json --file /datasets/dataset1.json --jsonArray && 
      mongoimport --host mongodb -d {db_name} -c {collection_name2} --type json --file /datasets/dataset2.json --jsonArray"
"""
    with open("docker-compose.yml", "w") as f:
        f.write(docker_compose_template)

def start_container():
    subprocess.run(["docker-compose", "up", "-d"], check=True)

if __name__ == "__main__":
    if len(sys.argv) != 6:
        print("Usage: python script.py <db_name> <collection_name> <json_file_path> <collection_name2> <json_file_path2>")
        sys.exit(1)

    db_name = sys.argv[1]
    collection_name = sys.argv[2]
    json_file_path = sys.argv[3]
    collection_name2 = sys.argv[4]
    json_file_path2 = sys.argv[5]
    
    generate_docker_compose(db_name, collection_name, json_file_path, collection_name2, json_file_path2)
    start_container()
