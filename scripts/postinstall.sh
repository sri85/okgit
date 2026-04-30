#!/usr/bin/env bash
mkdir -p ~/.git-cli/
if [ ! -f ~/.git-cli/config.json ]; then
  echo "{\"hosting_provider_choice\":\"\",\"personnel_access_token\":\"\",\"organization_username\":\"\",\"repo\":\"\"}" > ~/.git-cli/config.json
fi
