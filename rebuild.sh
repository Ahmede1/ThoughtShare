#!/bin/bash

HOME="/root/ThoughtShare_Video_Sharing_Platform"


cd $HOME

/usr/bin/docker compose stop frontend backend
/usr/bin/docker compose rm -f frontend backend
/usr/bin/docker rmi thoughtshare_video_sharing_platform-frontend || true
/usr/bin/docker rmi thoughtshare_video_sharing_platform-backend || true
/usr/bin/docker compose up --build -d frontend backend
