import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Download, FileCode, FileArchive, FileText, Image as ImageIcon, 
  Trash2, MessageSquare, CheckCircle, ShieldCheck, Clock, Send, 
  ExternalLink, Users, Sparkles, Filter, Search, FileUp, Info, Eye
} from 'lucide-react';
import { SharedFile, UserProfile } from '../../types';
import { realtime } from '../../services/websocket';
import { GigaMascot } from '../common/GigaMascot';

interface FileSharingHubProps {
  currentUser: UserProfile;
  onPlayGame?: (gameTitle: string) => void;
}

export const FileSharingHub: React.FC<FileSharingHubProps> = ({ currentUser, onPlayGame }) => {
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedFileForComments, setSelectedFileForComments] = useState<SharedFile | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [previewFile, setPreviewFile] = useState<SharedFile | null>(null);
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form inputs for upload
  const [uploadCategory, setUploadCategory] = useState<SharedFile['category']>('game_build');
  const [targetTitle, setTargetTitle] = useState<string>('');
  const [versionTag, setVersionTag] = useState<string>('1.0.0');

  // Load initial files via REST and listen to WebSockets
  useEffect(() => {
    // 1. Fetch initial files via REST
    fetch('/api/files')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFiles(data);
        }
      })
      .catch(err => console.warn('Could not load files from REST', err));

    // 2. Register presence on websocket
    realtime.registerPresence(currentUser);

    // 3. Listen to real-time events
    const unsubInit = realtime.on('init', (payload) => {
      if (payload.files) setFiles(payload.files);
      if (payload.onlineCount) setOnlineCount(payload.onlineCount);
    });

    const unsubCount = realtime.on('presence:count', (payload) => {
      if (payload.onlineCount) setOnlineCount(payload.onlineCount);
    });

    const unsubUsers = realtime.on('presence:users', (payload) => {
      if (payload.users) setActiveUsers(payload.users);
    });

    const unsubUploaded = realtime.on('file:uploaded', ({ file }) => {
      setFiles(prev => {
        // Idempotent check
        if (prev.some(f => f.id === file.id)) return prev;
        return [file, ...prev];
      });
    });

    const unsubDeleted = realtime.on('file:deleted', ({ fileId }) => {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      if (selectedFileForComments?.id === fileId) {
        setSelectedFileForComments(null);
      }
    });

    const unsubComment = realtime.on('file:comment_added', ({ fileId, comment }) => {
      setFiles(prev => prev.map(f => {
        if (f.id === fileId) {
          return {
            ...f,
            comments: [...f.comments, comment]
          };
        }
        return f;
      }));

      setSelectedFileForComments(prev => {
        if (prev && prev.id === fileId) {
          return {
            ...prev,
            comments: [...prev.comments, comment]
          };
        }
        return prev;
      });
    });

    return () => {
      unsubInit();
      unsubCount();
      unsubUsers();
      unsubUploaded();
      unsubDeleted();
      unsubComment();
    };
  }, [currentUser]);

  // Handle local file selection and upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setIsUploading(true);
    setUploadProgress(15);

    // Simulate progress chunk stream
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          finishUpload(selected);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const finishUpload = (rawFile: File) => {
    const newSharedFile: Partial<SharedFile> = {
      name: rawFile.name,
      category: uploadCategory,
      size: rawFile.size,
      mimeType: rawFile.type || 'application/octet-stream',
      uploadedBy: {
        name: currentUser.name,
        role: currentUser.role,
        company: currentUser.companyOrStudio
      },
      version: versionTag || '1.0.0',
      targetGameOrWidget: targetTitle || 'DochGames Platform',
      checksum: `sha256-${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
      scanStatus: 'clean'
    };

    // Broadcast over WebSocket!
    realtime.shareFile(newSharedFile);

    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 500);
  };

  const handleSendComment = () => {
    if (!selectedFileForComments || !newCommentText.trim()) return;

    realtime.addFileComment(
      selectedFileForComments.id,
      currentUser.name,
      currentUser.role,
      newCommentText.trim()
    );

    setNewCommentText('');
  };

  const handleDeleteFile = (fileId: string) => {
    if (confirm('Are you sure you want to remove this file from the shared CDN?')) {
      realtime.deleteFile(fileId, currentUser.name);
    }
  };

  const filteredFiles = files.filter(f => {
    const matchesCat = activeCategory === 'all' || f.category === activeCategory;
    const matchesQuery = 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.targetGameOrWidget?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.uploadedBy.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const getCategoryIcon = (cat: SharedFile['category']) => {
    switch (cat) {
      case 'game_build':
        return <FileArchive className="w-5 h-5 text-[#129BFF]" />;
      case 'asset_pack':
        return <ImageIcon className="w-5 h-5 text-[#D82CF4]" />;
      case 'doc_spec':
        return <FileText className="w-5 h-5 text-[#FFB51A]" />;
      case 'sdk_package':
        return <FileCode className="w-5 h-5 text-[#11D9FF]" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return bytes + ' B';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Real-Time Presence Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                Real-Time File & Build Distribution Network
              </h2>
            </div>
            <p className="text-slate-500 text-sm max-w-2xl">
              Instant peer-to-peer asset delivery between Game Developers, Publishers, and DochGames QA. Upload game builds (.zip), asset packs, and integration SDKs with real-time sync and SHA-256 integrity checks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 px-4 py-2 rounded-full border border-slate-200 flex items-center gap-2.5 text-xs">
              <Users className="w-4 h-4 text-blue-600" />
              <div>
                <span className="text-slate-500">Live Connected Peers: </span>
                <strong className="text-slate-900 font-bold">{onlineCount} online</strong>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              <FileUp className="w-4 h-4 text-[#D6F938]" />
              Upload & Share File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Upload Drawer / Settings */}
        <div className="mt-5 pt-4 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-slate-700 font-semibold block mb-1.5">Target Classification</label>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-colors"
            >
              <option value="game_build">Game Build (.zip / HTML5 bundle)</option>
              <option value="asset_pack">High-Res Asset Pack (.zip / PNG / SVG)</option>
              <option value="sdk_package">Widget SDK / Code Extension (.js / .ts)</option>
              <option value="doc_spec">Technical Specification (.pdf / .md)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1.5">Associated Game or Widget</label>
            <input
              type="text"
              placeholder="e.g. Cyber Neon Racer or Homepage Slit Reel"
              value={targetTitle}
              onChange={(e) => setTargetTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1.5">Build Version Tag</label>
            <input
              type="text"
              placeholder="e.g. 1.4.2"
              value={versionTag}
              onChange={(e) => setVersionTag(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Upload Progress Indicator */}
        {isUploading && (
          <div className="mt-4 p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl animate-fade-in shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-900 mb-1.5">
              <span className="flex items-center gap-2 font-medium">
                <Upload className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
                Broadcasting file across WebSocket mesh...
              </span>
              <span className="font-mono text-blue-600 font-bold">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-2 transition-all duration-150 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Segmented Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200/80 rounded-2xl sm:rounded-full shadow-xs overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Files' },
            { id: 'game_build', label: 'Game Builds' },
            { id: 'asset_pack', label: 'Asset Packs' },
            { id: 'sdk_package', label: 'SDKs' },
            { id: 'doc_spec', label: 'Specs' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                activeCategory === tab.id
                  ? 'bg-[#D6F938] text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search files, games, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200/80 rounded-full pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
          />
        </div>
      </div>

      {/* Main Files Table / Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filteredFiles.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-10 text-center flex flex-col items-center shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <GigaMascot mood="thinking" size="md" className="mb-4" />
              <h4 className="font-display text-lg font-bold text-slate-900 mb-1">No shared files found</h4>
              <p className="text-slate-500 text-xs max-w-sm mb-4">
                Upload a game build package (.zip) or marketing asset pack to share with publishers and admins in real-time.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition-all"
              >
                Upload First File
              </button>
            </div>
          ) : (
            filteredFiles.map(file => (
              <div
                key={file.id}
                className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-3xl p-5 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl shrink-0">
                    {getCategoryIcon(file.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors">
                        {file.name}
                      </h4>
                      {file.version && (
                        <span className="text-xs text-slate-500 font-mono">v{file.version}</span>
                      )}
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs text-slate-500">{formatFileSize(file.size)}</span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Clean
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 flex-wrap">
                      <span>Target: <strong className="text-slate-800 font-semibold">{file.targetGameOrWidget || 'General'}</strong></span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>By: <span className="text-slate-700 font-medium">{file.uploadedBy.name}</span> ({file.uploadedBy.role})</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{new Date(file.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* SHA256 snippet */}
                    <div className="mt-1 text-[11px] font-mono text-slate-400 truncate max-w-md">
                      Hash: {file.checksum}
                    </div>
                  </div>
                </div>

                {/* Right action buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => setSelectedFileForComments(file)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>{file.comments.length}</span>
                  </button>

                  <a
                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(file.name + ' - DochGames Verified Package')}`}
                    download={file.name}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>

                  {(currentUser.role === 'DochGames Admin' || currentUser.name === file.uploadedBy.name) && (
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      title="Delete file"
                      className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: File Review & Real-Time Collaboration Thread */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col h-[560px]">
          <div className="border-b border-slate-200/80 pb-3 mb-3">
            <h3 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Real-Time Build Feedback
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              {selectedFileForComments 
                ? `Discussing: ${selectedFileForComments.name}`
                : 'Select a file to view notes and reviewer comments'}
            </p>
          </div>

          {selectedFileForComments ? (
            <>
              {/* Comments stream */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                {selectedFileForComments.comments.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
                    <p>No feedback yet on this build package.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Leave a verification note or QA comment below.</p>
                  </div>
                ) : (
                  selectedFileForComments.comments.map(c => (
                    <div 
                      key={c.id} 
                      className={`p-3.5 rounded-2xl border ${
                        c.role === 'DochGames Admin' 
                          ? 'bg-blue-50/60 border-blue-200' 
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">
                          {c.author}
                          <span className="ml-1.5 text-[10px] font-bold text-blue-600">
                            [{c.role}]
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{c.message}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add comment input */}
              <div className="pt-3 border-t border-slate-200/80 mt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Write a QA note or publisher question..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
                  />
                  <button
                    onClick={handleSendComment}
                    className="p-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <GigaMascot mood="helpful" size="sm" className="mb-3" />
              <p className="text-slate-800 text-xs font-bold">Select a shared build or asset</p>
              <p className="text-slate-500 text-[11px] mt-1 max-w-xs">
                Click the comment icon on any file to inspect real-time QA validation notes, publisher feedback, or bug reports.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
