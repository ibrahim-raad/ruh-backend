#!/bin/bash
npm run -s migrations
if [ $? = 0 ]; then
  npm run -s migrations:generate
  if [ $? = 1 ]; then
    echo
    echo -e "\e[32mEverything is fine! No new migrations to be added.\e[0m"
    exit 0
  fi
  echo
  echo -e "\e[31mAdding new migrations:"
  git add src/migrations
  git diff --name-only --cached | grep '\-migration.ts'
  echo -e "\e[0m"
  git add src/migrations
fi
