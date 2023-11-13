#!/bin/bash

if [ -f ".env" ]; then
  echo "The .env file already exists"
else
  cp .env.example .env
  echo ".env file has been created from .env.example"
fi
