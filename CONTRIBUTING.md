# Contributing to n8n-nodes-allscreenshots

## Prerequisites

- Node.js v20.19+
- Docker (recommended for testing)
- npm

## Build

```bash
# Install dependencies
npm install

# Build the node
npm run build
```

## Test Locally with Docker (Recommended)

```bash
# Start n8n with your custom node
docker run -it --rm \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -v $(pwd)/dist:/home/node/.n8n/custom/n8n-nodes-allscreenshots/dist \
  -v $(pwd)/package.json:/home/node/.n8n/custom/n8n-nodes-allscreenshots/package.json \
  n8nio/n8n
```

Open **http://localhost:5678** and search for "Allscreenshots" in the nodes panel.

## Test Locally with npm link (Alternative)

```bash
# 1. Create a global link for your node package
npm link

# 2. Install n8n globally (if not already)
npm install -g n8n

# 3. Link your custom node to n8n's custom nodes directory
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
npm link n8n-nodes-allscreenshots

# 4. Start n8n
n8n start
```

## Development Workflow

1. Make changes to the TypeScript files in `nodes/` or `credentials/`
2. Run `npm run build` to compile
3. Restart the Docker container or n8n to see changes

For continuous rebuilding during development:
```bash
npm run watch
```
