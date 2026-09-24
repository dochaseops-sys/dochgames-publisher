import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Types
export interface SharedFile {
  id: string;
  name: string;
  category: 'game_build' | 'asset_pack' | 'doc_spec' | 'sdk_package' | 'widget_config';
  size: number;
  uploadedBy: {
    name: string;
    role: 'Publisher' | 'Game Developer' | 'DochGames Admin';
    company: string;
  };
  uploadedAt: string;
  mimeType: string;
  dataUrl?: string; // base64 or download string
  checksum: string;
  scanStatus: 'verified' | 'scanning' | 'clean';
  downloads: number;
  comments: Array<{
    id: string;
    author: string;
    role: string;
    message: string;
    timestamp: string;
  }>;
  version?: string;
  targetGameOrWidget?: string;
}

// In-memory data store for persistent live state
let sharedFiles: SharedFile[] = [
  {
    id: 'file-build-001',
    name: 'cyber_neon_racer_v1.4.2_release.zip',
    category: 'game_build',
    size: 14820000, // ~14.8MB
    uploadedBy: {
      name: 'Elena Rostova',
      role: 'Game Developer',
      company: 'Velocity Pixel Labs'
    },
    uploadedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    mimeType: 'application/zip',
    checksum: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    scanStatus: 'clean',
    downloads: 18,
    version: '1.4.2',
    targetGameOrWidget: 'Cyber Neon Racer',
    comments: [
      {
        id: 'c-1',
        author: 'DochGames Review Bot',
        role: 'DochGames Admin',
        message: 'Automated validation passed: HTML5 WebGL canvas resized correctly to 16:9 and 4:3. AudioContext unlocked on first user tap.',
        timestamp: new Date(Date.now() - 3600000 * 3.8).toISOString()
      },
      {
        id: 'c-2',
        author: 'Marcus Vance (QA Lead)',
        role: 'DochGames Admin',
        message: 'Smooth 60fps on mobile touch. Ready for widget syndication test.',
        timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString()
      }
    ]
  },
  {
    id: 'file-sdk-002',
    name: 'dochgames-widget-embed-sdk-v2.6.min.js',
    category: 'sdk_package',
    size: 245000, // 245KB
    uploadedBy: {
      name: 'DochGames Platform Team',
      role: 'DochGames Admin',
      company: 'DochGames HQ'
    },
    uploadedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    mimeType: 'application/javascript',
    checksum: 'sha256-4b825dc642cb6eb9a060e54bf8d69288fbee4904ce6243d37815fb5c4bedc2d5',
    scanStatus: 'verified',
    downloads: 142,
    version: '2.6.0',
    targetGameOrWidget: 'Global Smart Widgets',
    comments: [
      {
        id: 'c-3',
        author: 'DochGames Platform Team',
        role: 'DochGames Admin',
        message: 'Includes progressive loading, responsive slit reel and coverflow layouts with isolated iframe sandboxing.',
        timestamp: new Date(Date.now() - 3600000 * 20).toISOString()
      }
    ]
  },
  {
    id: 'file-asset-003',
    name: 'galactic_odyssey_4k_promopack.zip',
    category: 'asset_pack',
    size: 8920000,
    uploadedBy: {
      name: 'Kai Chen',
      role: 'Game Developer',
      company: 'Nebula Arcade Studio'
    },
    uploadedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    mimeType: 'application/zip',
    checksum: 'sha256-7d793037a0760186574b0282f2f435e70ec71e',
    scanStatus: 'clean',
    downloads: 9,
    version: '1.0.0',
    targetGameOrWidget: 'Galactic Odyssey',
    comments: [
      {
        id: 'c-4',
        author: 'Sarah Jenkins',
        role: 'Publisher',
        message: 'High-res key art looks crisp on our homepage hero slider banner. Thanks!',
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString()
      }
    ]
  },
  {
    id: 'file-spec-004',
    name: 'dochgames_developer_workflow_2026_spec.pdf',
    category: 'doc_spec',
    size: 1850000,
    uploadedBy: {
      name: 'DochGames Compliance',
      role: 'DochGames Admin',
      company: 'DochGames HQ'
    },
    uploadedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    mimeType: 'application/pdf',
    checksum: 'sha256-9f83c60bee85b0ce57110f55ced5fc2f3d613',
    scanStatus: 'verified',
    downloads: 230,
    version: '2026.1',
    targetGameOrWidget: 'All Partners',
    comments: []
  }
];

// Activity Feed Audit Trail
interface ActivityLog {
  id: string;
  actor: string;
  role: 'Publisher' | 'Game Developer' | 'DochGames Admin' | 'System';
  action: string;
  details: string;
  timestamp: string;
}

let activities: ActivityLog[] = [
  {
    id: 'act-srv-1',
    actor: 'Elena Rostova',
    role: 'Game Developer',
    action: 'BUILD_UPLOADED',
    details: 'Uploaded cyber_neon_racer_v1.4.2_release.zip to DochGames Real-Time CDN',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'act-srv-2',
    actor: 'DochGames Review Bot',
    role: 'System',
    action: 'VALIDATION_PASSED',
    details: 'Automated 12-point pre-flight checks passed for Cyber Neon Racer',
    timestamp: new Date(Date.now() - 3600000 * 3.8).toISOString()
  },
  {
    id: 'act-srv-3',
    actor: 'Alex Mercer',
    role: 'Publisher',
    action: 'WIDGET_PUBLISHED',
    details: 'Published "Sports & Gaming Reel" widget to gamezone-daily.com (Widget ID: wdg_9821a)',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'act-srv-4',
    actor: 'DochGames Admin',
    role: 'DochGames Admin',
    action: 'PROPERTY_VERIFIED',
    details: 'Verified domain ownership for publisher property gamezone-daily.com',
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString()
  }
];

// Setup WebSocket Server
const wss = new WebSocketServer({ server });

interface ClientInfo {
  id: string;
  ws: WebSocket;
  user?: {
    name: string;
    role: 'Publisher' | 'Game Developer' | 'DochGames Admin';
  };
}

const clients = new Map<string, ClientInfo>();

function broadcast(event: string, payload: any, senderId?: string) {
  const data = JSON.stringify({ event, payload, timestamp: new Date().toISOString() });
  for (const [id, client] of clients.entries()) {
    if (client.ws.readyState === WebSocket.OPEN) {
      // Send to all or exclude sender if needed
      client.ws.send(data);
    }
  }
}

wss.on('connection', (ws) => {
  const clientId = 'peer-' + crypto.randomBytes(4).toString('hex');
  clients.set(clientId, { id: clientId, ws });

  // Send initial state & peer count
  ws.send(JSON.stringify({
    event: 'init',
    payload: {
      clientId,
      onlineCount: clients.size,
      files: sharedFiles,
      activities
    }
  }));

  // Broadcast peer count change
  broadcast('presence:count', { onlineCount: clients.size });

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      const { event, payload } = msg;

      switch (event) {
        case 'presence:register': {
          const client = clients.get(clientId);
          if (client) {
            client.user = payload.user;
          }
          const activeUsers = Array.from(clients.values())
            .filter(c => c.user)
            .map(c => ({ id: c.id, ...c.user }));
          broadcast('presence:users', { users: activeUsers });
          break;
        }

        case 'file:upload': {
          const fileData = payload.file;
          const newFile: SharedFile = {
            id: 'file-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
            name: fileData.name,
            category: fileData.category || 'game_build',
            size: fileData.size || 0,
            uploadedBy: fileData.uploadedBy || {
              name: 'Guest Contributor',
              role: 'Game Developer',
              company: 'Independent'
            },
            uploadedAt: new Date().toISOString(),
            mimeType: fileData.mimeType || 'application/octet-stream',
            dataUrl: fileData.dataUrl || '',
            checksum: fileData.checksum || 'sha256-' + crypto.createHash('sha256').update(fileData.name + Date.now()).digest('hex').substring(0, 32),
            scanStatus: 'clean',
            downloads: 0,
            version: fileData.version || '1.0.0',
            targetGameOrWidget: fileData.targetGameOrWidget || 'General',
            comments: []
          };

          sharedFiles.unshift(newFile);

          const act: ActivityLog = {
            id: 'act-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
            actor: newFile.uploadedBy.name,
            role: newFile.uploadedBy.role,
            action: 'FILE_SHARED_REALTIME',
            details: `Shared file "${newFile.name}" (${(newFile.size / 1024).toFixed(1)} KB) in real time`,
            timestamp: new Date().toISOString()
          };
          activities.unshift(act);

          broadcast('file:uploaded', { file: newFile, activity: act });
          break;
        }

        case 'file:comment': {
          const { fileId, comment } = payload;
          const target = sharedFiles.find(f => f.id === fileId);
          if (target) {
            const newComment = {
              id: 'c-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
              author: comment.author || 'Anonymous',
              role: comment.role || 'Member',
              message: comment.message,
              timestamp: new Date().toISOString()
            };
            target.comments.push(newComment);
            broadcast('file:comment_added', { fileId, comment: newComment });
          }
          break;
        }

        case 'file:delete': {
          const { fileId, userName } = payload;
          sharedFiles = sharedFiles.filter(f => f.id !== fileId);
          const act: ActivityLog = {
            id: 'act-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
            actor: userName || 'User',
            role: 'DochGames Admin',
            action: 'FILE_REMOVED',
            details: `Removed file ID ${fileId}`,
            timestamp: new Date().toISOString()
          };
          activities.unshift(act);
          broadcast('file:deleted', { fileId, activity: act });
          break;
        }

        case 'notification:send': {
          const act: ActivityLog = {
            id: 'act-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
            actor: payload.actor || 'Platform User',
            role: payload.role || 'System',
            action: payload.action || 'EVENT',
            details: payload.details || 'System event occurred',
            timestamp: new Date().toISOString()
          };
          activities.unshift(act);
          broadcast('notification:received', { activity: act });
          break;
        }
      }
    } catch (e) {
      console.error('WebSocket message parsing error:', e);
    }
  });

  ws.on('close', () => {
    clients.delete(clientId);
    broadcast('presence:count', { onlineCount: clients.size });
    const activeUsers = Array.from(clients.values())
      .filter(c => c.user)
      .map(c => ({ id: c.id, ...c.user }));
    broadcast('presence:users', { users: activeUsers });
  });
});

// REST API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), platform: 'DochGames 2026' });
});

app.get('/api/files', (req, res) => {
  res.json(sharedFiles);
});

app.post('/api/files', (req, res) => {
  try {
    const fileData = req.body;
    const newFile: SharedFile = {
      id: 'file-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
      name: fileData.name,
      category: fileData.category || 'game_build',
      size: fileData.size || 0,
      uploadedBy: fileData.uploadedBy || {
        name: 'Guest Contributor',
        role: 'Game Developer',
        company: 'Independent'
      },
      uploadedAt: new Date().toISOString(),
      mimeType: fileData.mimeType || 'application/octet-stream',
      dataUrl: fileData.dataUrl || '',
      checksum: fileData.checksum || 'sha256-' + crypto.createHash('sha256').update(fileData.name + Date.now()).digest('hex').substring(0, 32),
      scanStatus: 'clean',
      downloads: 0,
      version: fileData.version || '1.0.0',
      targetGameOrWidget: fileData.targetGameOrWidget || 'General',
      comments: []
    };

    sharedFiles.unshift(newFile);

    const act: ActivityLog = {
      id: 'act-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
      actor: newFile.uploadedBy.name,
      role: newFile.uploadedBy.role,
      action: 'FILE_UPLOADED_REST',
      details: `Uploaded file "${newFile.name}" via API`,
      timestamp: new Date().toISOString()
    };
    activities.unshift(act);

    broadcast('file:uploaded', { file: newFile, activity: act });
    res.status(201).json(newFile);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/files/:id/comments', (req, res) => {
  const { id } = req.params;
  const target = sharedFiles.find(f => f.id === id);
  if (!target) {
    return res.status(404).json({ error: 'File not found' });
  }
  const newComment = {
    id: 'c-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
    author: req.body.author || 'Anonymous',
    role: req.body.role || 'Member',
    message: req.body.message,
    timestamp: new Date().toISOString()
  };
  target.comments.push(newComment);
  broadcast('file:comment_added', { fileId: id, comment: newComment });
  res.status(201).json(newComment);
});

app.delete('/api/files/:id', (req, res) => {
  const { id } = req.params;
  const initialLen = sharedFiles.length;
  sharedFiles = sharedFiles.filter(f => f.id !== id);
  if (sharedFiles.length === initialLen) {
    return res.status(404).json({ error: 'File not found' });
  }
  broadcast('file:deleted', { fileId: id });
  res.json({ success: true });
});

app.get('/api/activities', (req, res) => {
  res.json(activities);
});

// Mount Vite middleware for dev or serve dist in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, () => {
    console.log(`DochGames Platform Server running on port ${PORT}`);
  });
}

startServer();
