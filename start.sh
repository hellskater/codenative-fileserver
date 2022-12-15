#!/bin/bash
pm2 start npm --name "socket" -- start
cd /home/coder/app
static-server