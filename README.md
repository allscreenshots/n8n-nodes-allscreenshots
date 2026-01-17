# n8n-nodes-allscreenshots

This is an n8n community node for [Allscreenshots](https://allscreenshots.com) - a powerful API for capturing and managing website screenshots at scale.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**
2. Click **Install**
3. Enter `@allscreenshots/n8n-nodes-allscreenshots`
4. Click **Install**

### Manual Installation

```bash
npm install @allscreenshots/n8n-nodes-allscreenshots
```

## Authentication

1. Sign up at [allscreenshots.com](https://allscreenshots.com)
2. Go to **Dashboard > API Keys**
3. Create a new API key
4. In n8n, go to **Settings > Credentials > Add Credential**
5. Search for "Allscreenshots API"
6. Enter your API key

## Nodes

This package includes two nodes:

### Allscreenshots

The main node for capturing and managing screenshots.

#### Resources

| Resource | Description |
|----------|-------------|
| **Screenshot** | Capture screenshots synchronously or asynchronously |
| **Async Job** | Manage async screenshot jobs (status, result, cancel) |
| **Bulk Screenshot** | Capture up to 100 URLs in a single operation |
| **Compose** | Combine multiple screenshots into one image |
| **Usage** | Check API usage and quota status |

### Allscreenshots Trigger

Webhook trigger node for receiving notifications when screenshots are captured.

#### Supported Events

- Screenshot Completed
- Screenshot Failed
- Bulk Job Completed
- Compose Completed

## Operations

### Screenshot

| Operation | Description |
|-----------|-------------|
| **Capture** | Take a screenshot synchronously (returns image) |
| **Capture Async** | Start an async capture job (returns job ID) |

**Key Options:**
- Device presets (iPhone, Galaxy, iPad, MacBook, Desktop sizes)
- Custom viewport (width, height, scale)
- Output format (PNG, JPEG, WebP, PDF)
- Full page capture
- Element selector
- Wait options (delay, selector, network idle)
- Page modifications (dark mode, custom CSS, hide elements)
- Ad & cookie banner blocking

### Async Job

| Operation | Description |
|-----------|-------------|
| **Get Status** | Check job completion status |
| **Get Result** | Download the screenshot |
| **Cancel** | Cancel a pending job |
| **List All** | List all jobs with optional filters |

### Bulk Screenshot

| Operation | Description |
|-----------|-------------|
| **Create** | Start a bulk job (up to 100 URLs) |
| **Get Status** | Check bulk job progress |
| **List All** | List all bulk jobs |
| **Cancel** | Cancel a bulk job |

### Compose

| Operation | Description |
|-----------|-------------|
| **Create** | Compose multiple screenshots into one |
| **Get Status** | Check compose job status |
| **List Jobs** | List all compose jobs |

**Layout Options:**
- Auto (intelligent layout selection)
- Grid
- Masonry (Pinterest-style)
- Mondrian (artistic layout)

### Usage

| Operation | Description |
|-----------|-------------|
| **Get Full Stats** | Complete usage statistics with history |
| **Get Quota** | Current quota status |

## Usage Examples

### Basic Screenshot

1. Add an **Allscreenshots** node
2. Select Resource: **Screenshot**
3. Select Operation: **Capture**
4. Enter the URL to capture
5. Configure options as needed
6. Execute

### Bulk Screenshots with Notifications

1. Add a **Trigger** node (Manual, Schedule, etc.)
2. Add an **Allscreenshots** node
   - Resource: **Bulk Screenshot**
   - Operation: **Create**
   - Enter URLs (one per line)
3. Add an **Allscreenshots Trigger** node
   - Event: **Bulk Job Completed**
4. Connect to your notification service (Slack, Email, etc.)

### Compare Multiple Device Views

1. Add an **Allscreenshots** node
   - Resource: **Compose**
   - Operation: **Create**
   - Enter the same URL multiple times
   - Layout: **Grid**
2. Configure different device presets for each

## Device Presets

The node includes presets for common devices:

**Mobile:**
- iPhone 12, 12 Pro, 13, 14, 14 Pro, 15, 15 Pro, 15 Pro Max
- Samsung Galaxy S21, S23
- Google Pixel 5, 6

**Tablet:**
- iPad, iPad Pro 11", iPad Pro 12.9", iPad Air
- Samsung Galaxy Tab

**Desktop:**
- MacBook Air, MacBook Pro 14", MacBook Pro 16"
- Desktop 1920x1080 (Full HD)
- Desktop 2560x1440 (2K)
- Desktop 3840x2160 (4K)

## Development

For local development, testing, and publishing instructions, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Resources

- [Allscreenshots Website](https://allscreenshots.com)
- [API Documentation](https://docs.allscreenshots.com)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE)
