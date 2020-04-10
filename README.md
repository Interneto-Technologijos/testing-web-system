# Testing WEB system

# Software you need
- Node.js

# Install dependecies
```
npm i
```

# Run tests
```
npm test
```

Linux only: Run command before running tests: `export LD_PRELOAD=$(pwd)/lib/libcurl.so.3`

# Run system

```
npm run dev
```

Open on browser:
- https://localhost:3000 - lecturer view
- https://localhost:3000/test/:id - student view