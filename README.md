# Radius server

install nvm and then nodejs
```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
```

loads nvm
```bash
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

go to the project folder, and then install the project
```bash
cd radius-node && npm i # or I recommend pnpm
```

initialize the prism
```bash
npx prisma generate
```

run docker compose
```bash
docker compose up -d
```

get a list of containers from docker
```bash
docker ps
```