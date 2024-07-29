## Set up-

Node version - v18.19.1
npm version - 9.2.0

```console
npm install
npm run dev
```

### Docker

```console
docker build -t meetus-ui .
```

```console
docker run -d -p 5000:5000 -w /app -v "$(pwd):/app" meetus-ui
```
