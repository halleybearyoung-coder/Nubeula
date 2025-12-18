import React, { useState, useEffect, useRef } from 'react';
import { 
  Hash, 
  Settings, 
  Mic, 
  Headphones, 
  Plus, 
  Search, 
  Bell, 
  Pin, 
  Users, 
  HelpCircle, 
  Gift, 
  Sticker, 
  Smile, 
  SendHorizontal,
  Menu,
  X,
  Cookie,
  Compass,
  MessageSquare,
  Upload,
  Check,
  Bot,
  MoreVertical,
  Phone,
  Video,
  UserPlus,
  Inbox,
  Rocket,
  LogOut,
  Shield,
  Globe,
  Trash,
  Copy,
  Edit2,
  Camera,
  Volume2,
  PhoneOff,
  Signal
} from 'lucide-react';

// --- Mock Data ---

const INITIAL_DISCOVERABLE = [
  { id: 'm1', name: 'Midgar', icon: 'M', color: 'bg-indigo-500', description: 'The city of Mako energy.' },
  { id: 'm2', name: 'Avalanche', icon: 'A', color: 'bg-emerald-500', description: 'Eco-warriors fighting for the planet.' },
  { id: 'm3', name: 'Shinra Electric', icon: 'S', color: 'bg-red-500', description: 'Powering the world, protecting the future.' },
  { id: 'm4', name: 'Genshin Impact', icon: 'G', color: 'bg-pink-500', description: 'Step into Teyvat.' },
  { id: 'm5', name: 'React Developers', icon: 'R', color: 'bg-cyan-500', description: 'A community for React.js enthusiasts.' },
  { id: 'm6', name: 'Valorant', icon: 'V', color: 'bg-rose-500', description: 'A 5v5 character-based tactical shooter.' },
  { id: 'm7', name: 'Austin and Halley Community', icon: 'AH', color: 'bg-orange-500', description: 'The official community for Austin and Halley.' },
];

const DEFAULT_CHANNELS_TEMPLATE = [
  { id: 'gen', name: 'general', type: 'text' },
  { id: 'ann', name: 'announcements', type: 'text' },
  { id: 'voi', name: 'voice-chat', type: 'voice' },
];

const INITIAL_USERS = [
  { 
    id: 'u1', 
    name: 'Cloud Strife', 
    status: 'online', 
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cloud', // Bot Avatar
    isBot: true,
    isVerified: true,
    activity: 'Playing Final Fantasy VII'
  },
  { id: 'u2', name: 'Tifa Lockhart', status: 'idle', avatar: 'bg-red-400', activity: 'Mixing drinks' },
  { id: 'u3', name: 'Barret Wallace', status: 'dnd', avatar: 'bg-stone-600', activity: 'Saving the planet' },
  { id: 'u4', name: 'Aerith Gainsborough', status: 'offline', avatar: 'bg-pink-300', activity: '' },
];

// DM List - subset of users for the sidebar
const INITIAL_DMS = [
  { id: 'dm1', userId: 'u2', unread: 0 },
  { id: 'dm2', userId: 'u3', unread: 2 },
];

const SERVER_COLORS = [
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-red-500',
  'bg-pink-500',
  'bg-cyan-500',
  'bg-yellow-500',
  'bg-purple-500',
];

// --- Sticker Data ---
const ROCKY_STICKERS = [
  { id: 'rocky_wave', icon: '👋', label: 'Wave' },
  { id: 'rocky_love', icon: '❤️', label: 'Love' },
  { id: 'rocky_cool', icon: '😎', label: 'Cool' },
  { id: 'rocky_hype', icon: '🔥', label: 'Hype' },
  { id: 'rocky_sleep', icon: '💤', label: 'Sleep' },
  { id: 'rocky_angry', icon: '😠', label: 'Angry' },
  { id: 'rocky_party', icon: '🎉', label: 'Party' },
];

// --- Components ---

const AsteroidLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Rock Body */}
    <path d="M19.5 9.5C19.5 9.5 21 7.5 21 6C21 4.5 19.5 3 18 3C16.5 3 14.5 4.5 14.5 4.5L10.5 2.5L5.5 5.5L3.5 10.5L2.5 15.5L5.5 20.5L10.5 21.5L16.5 20.5L20.5 16.5L21.5 11.5L19.5 9.5Z" />
    {/* Craters for texture */}
    <circle cx="5.5" cy="8.5" r="1" fill="rgba(0,0,0,0.15)" />
    <circle cx="18.5" cy="13.5" r="1.5" fill="rgba(0,0,0,0.15)" />
    {/* The Face */}
    <circle cx="8.5" cy="11.5" r="1.5" fill="#2b2d31" />
    <circle cx="15.5" cy="11.5" r="1.5" fill="#2b2d31" />
    <path d="M10 15.5C10 15.5 11 17 14 15.5" stroke="#2b2d31" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const RockySticker = ({ icon, size = "w-32 h-32" }) => (
  <div className={`${size} relative flex items-center justify-center transition-transform hover:scale-105 select-none`}>
    <AsteroidLogo className="w-full h-full text-[#5865F2]" />
    <div className="absolute -bottom-1 -right-1 text-[2em] leading-none filter drop-shadow-lg transform rotate-12">
      {icon}
    </div>
  </div>
);

const Avatar = ({ user, className = "w-8 h-8", textSize = "text-xs", statusIndicator = false }) => {
  const isImage = user.avatar.startsWith('http') || user.avatar.startsWith('data:');
  const statusColors = {
    online: 'bg-green-500',
    idle: 'bg-yellow-500',
    dnd: 'bg-red-500',
    offline: 'bg-gray-500',
  };

  return (
    <div className="relative inline-block">
      {isImage ? (
        <img 
          src={user.avatar} 
          alt={user.name} 
          className={`${className} rounded-full object-cover bg-gray-700`} 
        />
      ) : (
        <div className={`${className} rounded-full ${user.avatar} flex items-center justify-center ${textSize} font-bold text-gray-800`}>
          {user.name[0]}
        </div>
      )}
      {statusIndicator && (
         <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[3px] border-[#2b2d31] ${statusColors[user.status]}`} />
      )}
    </div>
  );
};

const BotTag = ({ verified }) => (
  <span className="ml-1.5 bg-[#5865F2] text-white text-[10px] px-1.5 rounded-[4px] flex items-center h-[15px] font-bold select-none leading-none pb-px align-middle">
    {verified && <Check size={8} strokeWidth={4} className="mr-0.5" />}
    BOT
  </span>
);

const ServerIcon = ({ server, active, onClick }) => (
  <div className="relative group flex items-center justify-center mb-2 w-full cursor-pointer" onClick={onClick}>
    {/* Active Indicator */}
    <div className={`absolute left-0 bg-white rounded-r-lg transition-all duration-200 
      ${active ? 'h-10 w-1 top-3' : 'h-2 w-1 top-5 opacity-0 group-hover:opacity-100 group-hover:h-5'}`} 
    />
    
    {/* Icon */}
    <div className={`w-12 h-12 flex items-center justify-center rounded-3xl transition-all duration-200 overflow-hidden text-white font-bold text-lg
      ${active ? 'bg-indigo-500 rounded-2xl' : 'bg-gray-700 group-hover:bg-indigo-500 group-hover:rounded-2xl'} ${!active && !server.img && server.color ? '' : (server.color || '')}`}>
       
       {server.img ? (
         <img src={server.img} alt={server.name} className="w-full h-full object-cover" />
       ) : (
         <div className={`w-full h-full flex items-center justify-center ${active ? server.color : 'bg-gray-700 group-hover:' + server.color}`}>
            {server.icon ? server.icon : server.name[0]}
         </div>
       )}
    </div>

    {/* Tooltip (simplified) */}
    <div className="absolute left-16 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
      {server.name}
    </div>
  </div>
);

const ActionIcon = ({ icon: Icon, color, onClick, tooltip }) => (
  <div className="relative group flex items-center justify-center mb-2 w-full cursor-pointer" onClick={onClick}>
    <div className={`w-12 h-12 flex items-center justify-center rounded-3xl transition-all duration-200 overflow-hidden text-green-500 bg-gray-700 hover:text-white hover:${color} hover:rounded-2xl`}>
      <Icon size={24} className="transition-colors" />
    </div>
    <div className="absolute left-16 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
      {tooltip}
    </div>
  </div>
);

const ChannelItem = ({ channel, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center px-2 py-1.5 mx-2 rounded cursor-pointer group transition-colors
      ${active ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
  >
    <Hash size={20} className="mr-1.5 text-gray-400" />
    <span className={`truncate font-medium ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
      {channel.name}
    </span>
  </div>
);

const DMItem = ({ user, active, onClick, unread }) => (
  <div 
    onClick={onClick}
    className={`flex items-center px-2 py-2 mx-2 rounded cursor-pointer group transition-colors
      ${active ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
  >
    <div className="mr-3">
        <Avatar user={user} className="w-8 h-8" statusIndicator={true} />
    </div>
    <div className="flex-1 min-w-0">
        <span className={`truncate font-medium block ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
        {user.name}
        {user.isBot && <BotTag verified={user.isVerified} />}
        </span>
    </div>
    {unread > 0 && (
        <div className="bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full h-4 flex items-center justify-center">
            {unread}
        </div>
    )}
  </div>
);

const UserItem = ({ user }) => {
  return (
    <div className="flex items-center px-2 py-2 mx-2 rounded hover:bg-gray-700 cursor-pointer opacity-90 hover:opacity-100 group">
      <div className="mr-3">
        <Avatar user={user} className="w-8 h-8" statusIndicator={true} />
      </div>
      <div className="flex-1">
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-200 mr-1 group-hover:underline">{user.name}</div>
          {user.isBot && <BotTag verified={user.isVerified} />}
        </div>
        {user.activity && (
             <div className="text-xs text-gray-400 truncate max-w-[140px]">{user.activity}</div>
        )}
      </div>
    </div>
  );
};

const Message = ({ message, user, isMentioned }) => {
  if (!user) return null;
  
  const isSticker = message.content.startsWith('::sticker::');
  const stickerData = isSticker ? ROCKY_STICKERS.find(s => s.id === message.content.replace('::sticker::', '')) : null;

  // Function to highlight mentions in text
  const renderContent = () => {
    if (isSticker && stickerData) {
        return <RockySticker icon={stickerData.icon} />;
    }

    if (!isMentioned) return message.content;
    
    // Simple split to wrap the specific mention
    const parts = message.content.split(/(@\S+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return <span key={i} className="bg-[#3c4270] text-[#c9cdfb] rounded px-1 cursor-pointer hover:bg-[#5865f2] hover:text-white transition-colors font-medium">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className={`group flex px-4 py-1 -mx-4 ${isMentioned ? 'bg-[#3c4270]/10 border-l-2 border-[#faa61a] pl-[14px]' : 'hover:bg-gray-700/30'}`}>
      <div className="mr-4 mt-0.5 cursor-pointer hover:opacity-80 flex-shrink-0">
         <Avatar user={user} className="w-10 h-10" textSize="text-sm" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-white hover:underline cursor-pointer flex items-center">
            {user.name}
            {user.isBot && <BotTag verified={user.isVerified} />}
          </span>
          <span className="text-xs text-gray-400 pt-0.5">
            {message.timestamp}
          </span>
        </div>
        <div className={`text-gray-300 whitespace-pre-wrap break-words leading-relaxed ${isMentioned ? 'text-white' : ''}`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// --- Main Application ---

export default function DiscordClone() {
  const [appState, setAppState] = useState('welcome'); // 'welcome' | 'cookies' | 'app'
  const [servers, setServers] = useState([]); 
  const [discoverableServers, setDiscoverableServers] = useState(INITIAL_DISCOVERABLE);
  const [activeServerId, setActiveServerId] = useState(null); // null = Home/DM View
  
  // Navigation State
  const [activeChannelId, setActiveChannelId] = useState('gen');
  const [activeDMId, setActiveDMId] = useState('friends'); // 'friends' or userId
  const [dms, setDms] = useState(INITIAL_DMS);

  const [messages, setMessages] = useState({});
  const [inputMessage, setInputMessage] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showUserList, setShowUserList] = useState(true);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: 'me', name: 'You', avatar: 'bg-indigo-400', status: 'online', banner: 'bg-indigo-500', about: 'Just a space traveler.', email: '' });
  
  // Onboarding Form State
  const [tempUsername, setTempUsername] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [tempAvatar, setTempAvatar] = useState(null);
  const onboardingFileInputRef = useRef(null);

  // Voice State
  const [voiceState, setVoiceState] = useState({ connected: false, channelId: null, serverId: null, stream: null });
  const [micVolume, setMicVolume] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Modal States
  const [activeModal, setActiveModal] = useState(null); 
  const [settingsTab, setSettingsTab] = useState('overview'); // 'overview' | 'roles' | 'community'
  const [userSettingsTab, setUserSettingsTab] = useState('account'); // 'account' | 'profiles'
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  // Form States
  const [newServerName, setNewServerName] = useState('');
  const [newServerColor, setNewServerColor] = useState(SERVER_COLORS[0]);
  const [newServerIcon, setNewServerIcon] = useState(null);
  
  // New Feature States
  const [newChannelName, setNewChannelName] = useState('');
  const [channelToEdit, setChannelToEdit] = useState(null); // New State
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleColor, setNewRoleColor] = useState(SERVER_COLORS[0]);

  const fileInputRef = useRef(null);
  const userAvatarInputRef = useRef(null);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Derived state
  const activeServer = servers.find(s => s.id === activeServerId);
  // Messages context key: different if in server or DM
  const contextKey = activeServer ? activeChannelId : activeDMId;
  const currentMessages = messages[contextKey] || [];

  // Bot Ping Listener
  useEffect(() => {
    if (!currentMessages.length) return;
    const lastMsg = currentMessages[currentMessages.length - 1];
    
    // Check if I sent "!ping"
    if (lastMsg.userId === 'me' && lastMsg.content.trim() === '!ping') {
        const timer = setTimeout(() => {
            const botMsg = {
                id: Date.now(),
                userId: 'u1', // Cloud Strife Bot
                content: `@${currentUser.name} Pong! 🚀`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prev => ({
                ...prev,
                [contextKey]: [...(prev[contextKey] || []), botMsg]
            }));
        }, 800);
        return () => clearTimeout(timer);
    }
  }, [currentMessages, contextKey, currentUser.name]);

  useEffect(() => {
    if (appState === 'app') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages, contextKey, appState]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      userId: 'me',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => ({
      ...prev,
      [contextKey]: [...(prev[contextKey] || []), newMessage]
    }));
    setInputMessage('');
    setShowStickerPicker(false);
  };

  const handleSendSticker = (stickerId) => {
    const newMessage = {
      id: Date.now(),
      userId: 'me',
      content: `::sticker::${stickerId}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => ({
      ...prev,
      [contextKey]: [...(prev[contextKey] || []), newMessage]
    }));
    setShowStickerPicker(false);
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
        if (showStickerPicker && !event.target.closest('.sticker-picker-container')) {
            setShowStickerPicker(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showStickerPicker]);

  const getUser = (id) => {
    if (id === 'me') return currentUser;
    return INITIAL_USERS.find(u => u.id === id);
  };

  const handleOnboardingAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = () => {
    if (!tempEmail.trim() || !tempPassword.trim() || !tempUsername.trim()) return;
    
    setCurrentUser(prev => ({ 
        ...prev, 
        name: tempUsername, 
        email: tempEmail, 
        avatar: tempAvatar || 'bg-indigo-400' 
    }));
    setAppState('cookies');
  };

  // --- Handlers for Modals/Creation ---

  const openCreateModal = () => {
    setNewServerName(`${currentUser.name}'s Server`);
    setNewServerColor(SERVER_COLORS[Math.floor(Math.random() * SERVER_COLORS.length)]);
    setNewServerIcon(null);
    setActiveModal('create');
  };

  const finalizeCreateServer = () => {
    if (!newServerName.trim()) return;
    const newId = Date.now();
    const newServer = {
      id: newId,
      name: newServerName,
      icon: newServerName.trim()[0].toUpperCase(),
      color: newServerColor,
      img: newServerIcon,
      ownerId: 'me',
      channels: [...DEFAULT_CHANNELS_TEMPLATE],
      roles: [{ id: 'r1', name: 'Owner', color: 'text-yellow-500' }],
      isCommunity: false
    };
    
    setServers([...servers, newServer]);
    setActiveServerId(newId);
    setMessages(prev => ({
        ...prev,
        'gen': [{ id: 1, userId: 'u1', content: 'Welcome to your new server! Beep boop.', timestamp: 'Now' }]
    }));
    setActiveModal(null);
  };

   const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewServerIcon(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentUser(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const joinServer = (server) => {
    if (!servers.find(s => s.id === server.id)) {
        // Ensure joined servers have the structure we expect
        const joinedServer = {
            ...server,
            channels: server.channels || [...DEFAULT_CHANNELS_TEMPLATE],
            roles: server.roles || [],
            ownerId: 'other'
        };
        setServers([...servers, joinedServer]);
    }
    setActiveServerId(server.id);
    setActiveModal(null);
  };

  const handleLeaveServer = (serverId) => {
    if (window.confirm("Are you sure you want to leave this server?")) {
        setServers(prev => prev.filter(s => s.id !== serverId));
        setActiveServerId(null);
        if (voiceState.serverId === serverId) {
            handleDisconnectVoice();
        }
    }
  };

  const handleJoinVoice = async (channelId, serverId) => {
      if (voiceState.connected && voiceState.channelId === channelId) return;
      
      try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Setup Audio Analysis
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        
        analyserRef.current.fftSize = 32;
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Animation Loop for Volume
        const updateVolume = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            
            // Calculate average volume
            let sum = 0;
            for(let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
            }
            const average = sum / bufferLength;
            
            // Normalize somewhat (0-100 range roughly)
            setMicVolume(average);
            animationFrameRef.current = requestAnimationFrame(updateVolume);
        };
        
        updateVolume();
        setVoiceState({ connected: true, channelId, serverId, stream });

      } catch (err) {
        console.error("Mic Error:", err);
        alert("Could not access microphone. Voice features will be visual only.");
        setVoiceState({ connected: true, channelId, serverId, stream: null });
      }
  };
  const createChannel = async () => {
    if (!newChannelName.trim() || !activeServer) return;
    const newChan = { id: 'c-' + Date.now(), name: newChannelName.toLowerCase().replace(/\s+/g, '-'), type: 'text' };
    const updatedChannels = [...(activeServer.channels || []), newChan];
    
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'servers', activeServer.id), {
        channels: updatedChannels
    });
    setActiveModal(null);
    setNewChannelName('');
  };

  const updateChannel = async () => {
    if (!activeServer || !channelToEdit || !newChannelName.trim()) return;
    const updatedChannels = activeServer.channels.map(c => 
        c.id === channelToEdit.id ? { ...c, name: newChannelName.toLowerCase().replace(/\s+/g, '-') } : c
    );
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'servers', activeServer.id), { channels: updatedChannels });
    setActiveModal(null);
    setNewChannelName('');
    setChannelToEdit(null);
  };

  const deleteChannel = async () => {
    if (!activeServer || !channelToEdit) return;
    if (confirm(`Are you sure you want to delete #${channelToEdit.name}? This cannot be undone.`)) {
        const updatedChannels = activeServer.channels.filter(c => c.id !== channelToEdit.id);
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'servers', activeServer.id), { channels: updatedChannels });
        if (activeChannelId === channelToEdit.id) setActiveChannelId(updatedChannels[0]?.id || 'gen');
        setActiveModal(null);
        setChannelToEdit(null);
    }
  };

  const openCreateChannelModal = () => {
      setNewChannelName('');
      setActiveModal('createChannel');
  };

  const openEditChannelModal = (channel, e) => {
      e.stopPropagation();
      setChannelToEdit(channel);
      setNewChannelName(channel.name);
      setActiveModal('editChannel');
  };

  const addRole = () => {
    if (!newRoleName.trim()) return;
    setServers(prev => prev.map(s => {
        if (s.id === activeServerId) {
            return {
                ...s,
                roles: [...(s.roles || []), { id: Date.now(), name: newRoleName, color: newRoleColor.replace('bg-', 'text-') }]
            };
        }
        return s;
    }));
    setNewRoleName('');
  };

  const toggleCommunity = () => {
    const server = servers.find(s => s.id === activeServerId);
    if (!server) return;
    
    const isCommunity = !server.isCommunity;
    
    // Update server state
    setServers(prev => prev.map(s => {
        if (s.id === activeServerId) return { ...s, isCommunity };
        return s;
    }));

    // Add/Remove from Discoverable
    if (isCommunity) {
        setDiscoverableServers(prev => [...prev, { ...server, description: 'A newly discovered community.' }]);
    } else {
        setDiscoverableServers(prev => prev.filter(s => s.id !== activeServerId));
    }
  };

  const openSettingsModal = () => {
    const server = servers.find(s => s.id === activeServerId);
    if (!server) return;
    setNewServerName(server.name);
    setNewServerColor(server.color || SERVER_COLORS[0]);
    setNewServerIcon(server.img || null);
    setSettingsTab('overview');
    setActiveModal('settings');
  };

  const saveServerSettings = () => {
    if (!newServerName.trim()) return;

    setServers(prev => prev.map(s => {
      if (s.id === activeServerId) {
        return {
          ...s,
          name: newServerName,
          icon: newServerName.trim()[0].toUpperCase(),
          color: newServerColor,
          img: newServerIcon
        };
      }
      return s;
    }));
    setActiveModal(null);
  };

  const handleLogout = () => {
      if (window.confirm("Are you sure you want to log out?")) {
          setAppState('welcome');
          setCurrentUser({ id: 'me', name: 'You', avatar: 'bg-indigo-400', status: 'online', banner: 'bg-indigo-500', about: '', email: '' });
          setTempUsername('');
          setTempEmail('');
          setTempPassword('');
          setTempAvatar(null);
          setActiveModal(null);
          setServers([]);
      }
  };

  // --- Views ---

  const renderSidebarContent = () => {
    if (activeServer) {
        // --- SERVER SIDEBAR ---
        const isOwner = activeServer.ownerId === 'me';
        return (
            <>
                <div className="h-12 px-4 flex items-center justify-between shadow-sm hover:bg-gray-700/30 cursor-pointer transition-colors border-b border-gray-900/20 group">
                    <h1 className="font-bold truncate">{activeServer.name}</h1>
                    <div className="flex items-center">
                         <UserPlus 
                            size={18}
                            className="text-gray-400 hover:text-green-400 mr-2 opacity-50 hover:opacity-100 transition-all"
                            onClick={(e) => { e.stopPropagation(); alert(`Invite link for ${activeServer.name} copied!`); }}
                            title="Invite People"
                         />
                         {isOwner && (
                           <Settings
                              size={18} 
                              className="text-gray-400 hover:text-white mr-2 opacity-50 hover:opacity-100 transition-all" 
                              onClick={(e) => { 
                                  e.stopPropagation(); 
                                  openSettingsModal();
                              }} 
                              title="Server Settings"
                           />
                         )}
                         <LogOut 
                            size={18} 
                            className="text-gray-400 hover:text-red-400 mr-2 opacity-50 hover:opacity-100 transition-all" 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                handleLeaveServer(activeServer.id); 
                            }} 
                            title="Leave Server"
                         />
                         <X size={20} className="md:hidden cursor-pointer" onClick={() => setShowMobileSidebar(false)} />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto py-3 custom-scrollbar">
                    <div className="px-4 mb-2 flex items-center justify-between group text-gray-400 hover:text-gray-300 cursor-pointer">
                        <span className="text-xs font-bold uppercase tracking-wide">Channels</span>
                        {isOwner ? (
                             <Plus size={14} className="opacity-0 group-hover:opacity-100" onClick={openCreateChannelModal} />
                        ) : <div />}
                    </div>
                    <div className="space-y-[2px]">
                        {(activeServer.channels || DEFAULT_CHANNELS_TEMPLATE).map(channel => (
                        <div key={channel.id} className="group/channel relative">
                            <div 
                                onClick={() => {
                                    if (channel.type === 'voice') {
                                        handleJoinVoice(channel.id, activeServer.id);
                                    } else {
                                        setActiveChannelId(channel.id);
                                        if (window.innerWidth < 768) setShowMobileSidebar(false);
                                    }
                                }}
                                className={`flex items-center px-2 py-1.5 mx-2 rounded cursor-pointer group transition-colors
                                ${(activeChannelId === channel.id && channel.type !== 'voice') || (voiceState.channelId === channel.id && channel.type === 'voice') ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
                            >
                                {channel.type === 'voice' ? <Volume2 size={20} className="mr-1.5 text-gray-400 shrink-0" /> : <Hash size={20} className="mr-1.5 text-gray-400 shrink-0" />}
                                <span className={`truncate font-medium flex-1 ${(activeChannelId === channel.id && channel.type !== 'voice') || (voiceState.channelId === channel.id && channel.type === 'voice') ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                    {channel.name}
                                </span>
                                {isOwner && (
                                    <Settings 
                                        size={14} 
                                        className="opacity-0 group-hover/channel:opacity-100 text-gray-400 hover:text-white ml-2 shrink-0 transition-opacity"
                                        onClick={(e) => openEditChannelModal(channel, e)}
                                    />
                                )}
                            </div>
                            
                            {/* Render Users in Voice Channel */}
                            {channel.type === 'voice' && (
                                <div className="ml-8 mr-2 mt-1 space-y-1">
                                    {Object.values(allUsers).filter(u => u.voiceServerId === activeServer.id && u.voiceChannelId === channel.id).map(u => (
                                        <div key={u.uid} className="flex items-center group cursor-pointer py-0.5 rounded px-1 hover:bg-gray-700/50">
                                            <Avatar user={u} className="w-6 h-6" textSize="text-[10px]" />
                                            <span className={`ml-2 text-sm truncate ${u.uid === user?.uid ? 'text-green-400 font-bold' : 'text-gray-400 group-hover:text-gray-300'}`}>
                                                {u.name}
                                            </span>
                                            <div className="ml-auto flex space-x-1">
                                                {u.isMuted && <MicOff size={12} className="text-red-400" />}
                                                {u.isDeafened && <Headphones size={12} className="text-red-400" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        ))}
                    </div>
                </div>
                
                {/* Voice Status Panel */}
                {voiceState.connected && (
                    <div className="bg-[#232428] border-b border-[#1e1f22] px-2 py-2 flex items-center">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center text-green-500 font-bold text-xs mb-0.5">
                                {/* Dynamic Voice Visualizer */}
                                <div className="flex items-end space-x-[2px] h-3 mr-2">
                                    <div className="w-[3px] bg-green-500 rounded-t-sm transition-all duration-75" style={{ height: `${Math.max(20, Math.min(100, micVolume * 1.5))}%` }}></div>
                                    <div className="w-[3px] bg-green-500 rounded-t-sm transition-all duration-75" style={{ height: `${Math.max(20, Math.min(100, micVolume * 0.8))}%` }}></div>
                                    <div className="w-[3px] bg-green-500 rounded-t-sm transition-all duration-75" style={{ height: `${Math.max(20, Math.min(100, micVolume * 1.2))}%` }}></div>
                                </div>
                                <span>Voice Connected</span>
                            </div>
                            <div className="text-xs text-gray-400 truncate">
                                {servers.find(s => s.id === voiceState.serverId)?.channels.find(c => c.id === voiceState.channelId)?.name || 'Voice Channel'} / {servers.find(s => s.id === voiceState.serverId)?.name}
                            </div>
                        </div>
                        <div 
                            className="p-1.5 hover:bg-gray-700 rounded cursor-pointer text-gray-300 hover:text-white"
                            onClick={handleDisconnectVoice}
                            title="Disconnect"
                        >
                            <PhoneOff size={18} />
                        </div>
                    </div>
                )}
            </>
        );
    } else {
        // --- HOME / DM SIDEBAR ---
        return (
            <>
                <div className="h-12 px-4 flex items-center shadow-sm border-b border-gray-900/20">
                    <button className="w-full text-left text-gray-400 bg-[#1e1f22] text-sm px-2 py-1 rounded hover:text-gray-200 transition-colors">
                        Find or start a conversation
                    </button>
                    <X size={20} className="md:hidden cursor-pointer ml-2" onClick={() => setShowMobileSidebar(false)} />
                </div>
                <div className="flex-1 overflow-y-auto py-3 custom-scrollbar">
                    {/* Friends Button */}
                    <div 
                        onClick={() => setActiveDMId('friends')}
                        className={`flex items-center px-2 py-2 mx-2 mb-4 rounded cursor-pointer group transition-colors ${activeDMId === 'friends' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
                    >
                         <div className="w-8 h-8 flex items-center justify-center mr-3">
                             <Users size={24} />
                         </div>
                         <span className="font-medium">Friends</span>
                    </div>

                    <div className="px-4 mb-2 flex items-center justify-between group text-gray-400 hover:text-gray-300">
                        <span className="text-xs font-bold uppercase tracking-wide">Direct Messages</span>
                        <Plus size={14} className="cursor-pointer" />
                    </div>
                    
                    <div className="space-y-[2px]">
                        {dms.map(dm => {
                            const user = getUser(dm.userId);
                            return (
                                <DMItem 
                                    key={dm.id} 
                                    user={user} 
                                    active={activeDMId === user.id}
                                    unread={dm.unread}
                                    onClick={() => {
                                        setActiveDMId(user.id);
                                        if (window.innerWidth < 768) setShowMobileSidebar(false);
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            </>
        )
    }
  };

  const renderMainContent = () => {
    // 1. FRIENDS LIST VIEW
    if (!activeServer && activeDMId === 'friends') {
        return (
            <div className="flex-1 bg-[#313338] flex flex-col min-w-0">
                {/* Friends Header */}
                <header className="h-12 px-4 flex items-center shadow-sm flex-shrink-0 border-b border-black/20 bg-[#313338]">
                    <div className="flex items-center text-gray-400 mr-4">
                        <Users size={24} className="mr-3" />
                        <span className="font-bold text-white mr-4">Friends</span>
                    </div>
                    <div className="h-6 w-px bg-gray-600 mr-4"></div>
                    <div className="flex space-x-4">
                        <button className="text-white bg-gray-600/50 px-2 py-0.5 rounded hover:bg-gray-600">Online</button>
                        <button className="text-gray-400 hover:text-gray-200 px-2 py-0.5 rounded hover:bg-gray-700">All</button>
                        <button className="text-gray-400 hover:text-gray-200 px-2 py-0.5 rounded hover:bg-gray-700">Pending</button>
                        <button className="text-gray-400 hover:text-gray-200 px-2 py-0.5 rounded hover:bg-gray-700">Blocked</button>
                        <button className="text-white bg-green-600 px-2 py-0.5 rounded hover:bg-green-700 font-medium">Add Friend</button>
                    </div>
                     <div className="ml-auto flex items-center space-x-3 text-gray-300">
                        <Inbox size={24} className="cursor-pointer hover:text-gray-200" />
                        <HelpCircle size={24} className="cursor-pointer hover:text-gray-200" />
                    </div>
                </header>
                
                {/* Friends List Body */}
                <div className="flex-1 p-8 flex flex-col">
                     <div className="text-xs font-bold text-gray-400 uppercase mb-4">Online — {INITIAL_USERS.filter(u => u.status !== 'offline').length}</div>
                     {INITIAL_USERS.filter(u => u.status !== 'offline').map(user => (
                         <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded border-t border-gray-800 cursor-pointer group">
                             <div className="flex items-center">
                                 <Avatar user={user} className="w-9 h-9" statusIndicator={true} />
                                 <div className="ml-3">
                                     <div className="font-bold text-white flex items-center">
                                         {user.name}
                                         {user.isBot && <BotTag verified={user.isVerified} />}
                                     </div>
                                     <div className="text-xs text-gray-400">{user.activity || user.status}</div>
                                 </div>
                             </div>
                             <div className="flex items-center space-x-2">
                                 <div className="w-9 h-9 rounded-full bg-[#2b2d31] flex items-center justify-center text-gray-400 hover:text-gray-200 group-hover:bg-[#1e1f22]">
                                     <MessageSquare size={18} />
                                 </div>
                                 <div className="w-9 h-9 rounded-full bg-[#2b2d31] flex items-center justify-center text-gray-400 hover:text-gray-200 group-hover:bg-[#1e1f22]">
                                     <MoreVertical size={18} />
                                 </div>
                             </div>
                         </div>
                     ))}
                     
                     {/* "Empty" State with ROCKY THE ASTEROID */}
                     <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col items-center justify-center text-center opacity-70">
                         <div className="w-48 h-48 bg-gray-700/50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                             <AsteroidLogo className="w-24 h-24" />
                         </div>
                         <p className="text-gray-500">Rocky is floating in space... waiting for more friends.</p>
                     </div>
                </div>
            </div>
        );
    }
    
    // 2. CHAT VIEW (Server OR DM)
    const isDM = !activeServer;
    // Fix: Updated to check for activeServer channels or fallback to template
    const activeChannel = activeServer?.channels?.find(c => c.id === activeChannelId) || DEFAULT_CHANNELS_TEMPLATE[0];
    const targetName = isDM ? getUser(activeDMId)?.name : activeChannel.name;
    const targetIcon = isDM ? '@' : '#';

    return (
        <div className="flex-1 bg-[#313338] flex flex-col min-w-0">
             <header className="h-12 px-4 flex items-center shadow-sm flex-shrink-0 border-b border-black/20 bg-[#313338]">
                <Menu className="mr-4 md:hidden text-gray-300 cursor-pointer" onClick={() => setShowMobileSidebar(!showMobileSidebar)} />
                <span className="text-gray-400 mr-2 text-2xl font-light">{targetIcon}</span>
                <h3 className="font-bold text-white mr-4">{targetName}</h3>
                {isDM && getUser(activeDMId)?.status && (
                     <div className={`w-2.5 h-2.5 rounded-full mr-2 ${getUser(activeDMId).status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                )}
                
                <div className="ml-auto flex items-center space-x-4 text-gray-300">
                    {isDM && <Phone size={24} className="cursor-pointer hover:text-gray-200" />}
                    {isDM && <Video size={24} className="cursor-pointer hover:text-gray-200" />}
                    {!isDM && <Search size={24} className="cursor-pointer hover:text-gray-200 hidden sm:block" />}
                    <Bell size={24} className="cursor-pointer hover:text-gray-200" />
                    <Pin size={24} className="cursor-pointer hover:text-gray-200 hidden sm:block" />
                    <Users 
                      size={24} 
                      className={`cursor-pointer transition-colors ${showUserList ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`} 
                      onClick={() => setShowUserList(!showUserList)}
                    />
                </div>
             </header>

             {/* Messages */}
             <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col px-4 pt-4" ref={chatContainerRef}>
                  <div className="mt-auto mb-6">
                        {isDM ? (
                             <div className="mb-4">
                                 <Avatar user={getUser(activeDMId)} className="w-20 h-20" textSize="text-3xl" />
                                 <h1 className="text-3xl font-bold text-white mt-4 mb-1">{getUser(activeDMId)?.name}</h1>
                                 <p className="text-gray-400 text-sm">This is the beginning of your direct message history with <span className="font-bold">{getUser(activeDMId)?.name}</span>.</p>
                             </div>
                        ) : (
                             <>
                                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                    <Hash size={40} className="text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-2">Welcome to #{targetName}!</h1>
                                <p className="text-gray-400">This is the start of the #{targetName} channel.</p>
                             </>
                        )}
                  </div>
                  
                  <div className="flex flex-col space-y-4 pb-4">
                        {currentMessages.map((msg) => (
                        <Message 
                            key={msg.id} 
                            message={msg} 
                            user={getUser(msg.userId)} 
                            isMentioned={msg.content.includes(`@${currentUser.name}`) || msg.content.includes('@everyone')}
                        />
                        ))}
                        <div ref={messagesEndRef} />
                  </div>
             </div>

             {/* Input */}
             <div className="px-4 pb-6 pt-2 flex-shrink-0">
                <div className="bg-[#383a40] rounded-lg p-2.5 flex items-center shadow-sm">
                    <div className="bg-gray-400 rounded-full p-1 mr-3 cursor-pointer hover:text-white text-gray-800 transition-colors">
                        <Plus size={16} className="text-[#383a40]" strokeWidth={3} />
                    </div>
                    <form className="flex-1" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder={`Message ${targetIcon}${targetName}`}
                            className="w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none font-light"
                        />
                    </form>
                    <div className="flex items-center space-x-3 text-gray-400 ml-3">
                        <Gift size={24} className="cursor-pointer hover:text-gray-200 hidden sm:block" />
                        
                        <div className="relative sticker-picker-container">
                            <Sticker 
                                size={24} 
                                className={`cursor-pointer transition-colors ${showStickerPicker ? 'text-indigo-400' : 'hover:text-gray-200'}`} 
                                onClick={() => setShowStickerPicker(!showStickerPicker)}
                            />
                            {showStickerPicker && (
                                <div className="absolute bottom-10 right-0 w-80 bg-[#2b2d31] rounded-lg shadow-2xl border border-[#1e1f22] p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-bold text-gray-300 text-xs uppercase">Rocky Stickers</h4>
                                        <div className="bg-[#5865F2] px-2 py-0.5 rounded text-[10px] text-white font-bold">NEW</div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {ROCKY_STICKERS.map(sticker => (
                                            <div 
                                                key={sticker.id}
                                                className="aspect-square bg-[#1e1f22] rounded hover:bg-[#404249] cursor-pointer flex items-center justify-center p-2 transition-colors relative group"
                                                onClick={() => handleSendSticker(sticker.id)}
                                            >
                                                <RockySticker icon={sticker.icon} size="w-full h-full" />
                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                                                    {sticker.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Smile size={24} className="cursor-pointer hover:text-gray-200" />
                        {inputMessage.length > 0 && (
                            <SendHorizontal 
                                size={24} 
                                className="cursor-pointer text-indigo-400 hover:text-indigo-300" 
                                onClick={handleSendMessage}
                            />
                        )}
                    </div>
                </div>
             </div>
        </div>
    );
  };

  // --- Initial Welcome Logic ---
  if (appState === 'welcome') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#313338] text-white overflow-hidden relative">
        {/* Background Textures */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <AsteroidLogo className="absolute top-20 left-20 w-32 h-32 text-[#2b2d31] opacity-50 -rotate-12" />
            <AsteroidLogo className="absolute bottom-20 right-20 w-48 h-48 text-[#2b2d31] opacity-50 rotate-45" />
        </div>

        <div className="text-center space-y-6 p-8 w-full max-w-lg bg-[#2b2d31] rounded-xl shadow-2xl relative z-10 border border-[#1e1f22] animate-in fade-in zoom-in-95 duration-300">
          <div className="flex flex-col items-center">
             <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <AsteroidLogo className="w-10 h-10 text-white" />
             </div>
             <h1 className="text-2xl font-bold tracking-tight mb-1">Create an Account</h1>
             <p className="text-gray-400 text-sm">Join Nebula today!</p>
          </div>
          
          <div className="w-full space-y-4 text-left">
             {/* Profile Picture Upload */}
             <div className="flex justify-center mb-4">
                <div 
                    className="relative group cursor-pointer"
                    onClick={() => onboardingFileInputRef.current?.click()}
                >
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-4 border-[#1e1f22] bg-[#1e1f22] transition-colors group-hover:border-indigo-500/50`}>
                        {tempAvatar ? (
                            <img src={tempAvatar} alt="Upload" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-white">
                                <Camera size={28} className="mb-1" />
                                <span className="text-[10px] uppercase font-bold">Upload</span>
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-[#5865F2] rounded-full p-1.5 border-[3px] border-[#2b2d31]">
                        <Plus size={14} className="text-white" strokeWidth={3} />
                    </div>
                    <input type="file" ref={onboardingFileInputRef} className="hidden" accept="image/*" onChange={handleOnboardingAvatarUpload} />
                </div>
             </div>

             {/* Inputs */}
             <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Email <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-[#1e1f22] text-white rounded-md border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
                  required
                />
             </div>

             <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Display Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-[#1e1f22] text-white rounded-md border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
                  required
                />
             </div>

             <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Password <span className="text-red-500">*</span></label>
                <input 
                  type="password" 
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-[#1e1f22] text-white rounded-md border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
                  required
                />
             </div>

             <button 
                onClick={handleRegister} 
                disabled={!tempEmail.trim() || !tempPassword.trim() || !tempUsername.trim()}
                className={`w-full py-3 mt-4 rounded-md font-bold text-white transition-all shadow-md transform ${(!tempEmail.trim() || !tempPassword.trim() || !tempUsername.trim()) ? 'bg-[#5865F2] opacity-50 cursor-not-allowed' : 'bg-[#5865F2] hover:bg-[#4752c4] hover:scale-[1.02]'}`}
             >
               Continue
             </button>
             
             <div className="text-[10px] text-gray-400 mt-2 text-center">
                By registering, you agree to Nebula's Terms of Service.
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'cookies') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#313338] text-white p-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
        <div className="bg-[#2b2d31] p-8 md:p-10 rounded-xl shadow-2xl max-w-md w-full text-center space-y-6 relative z-10 border border-gray-800">
          <div className="flex justify-center mb-2">
             <div className="bg-gray-800 p-4 rounded-full">
                <Cookie size={40} className="text-yellow-500" />
             </div>
          </div>
          <h2 className="text-2xl font-bold">Cookies Required</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Welcome to Nebula, <span className="text-white font-bold">{currentUser.name}</span>! We use space cookies.
          </p>
          <div className="pt-2">
            <button onClick={() => setAppState('app')} className="w-full px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-md font-bold transition-all shadow-md active:transform active:scale-95">
              Accept Cookies
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- APP RENDER ---
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden select-none relative">
      
      {/* 1. Server List */}
      <nav className="w-[72px] bg-gray-900 flex flex-col items-center py-3 overflow-y-auto hide-scrollbar z-20 shadow-md">
        <div 
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer mb-2 hover:rounded-xl hover:bg-indigo-500 ${activeServerId === null ? 'bg-indigo-500 rounded-xl' : 'bg-[#313338] text-white'}`} 
            onClick={() => setActiveServerId(null)}
        >
          <AsteroidLogo className="w-8 h-8" />
        </div>
        
        <div className="w-8 h-[2px] bg-gray-700 rounded-full mb-2"></div>
        
        {servers.map(server => (
          <ServerIcon 
            key={server.id} 
            server={server} 
            active={activeServerId === server.id} 
            onClick={() => setActiveServerId(server.id)}
          />
        ))}

        <ActionIcon icon={Plus} color="bg-green-600" onClick={openCreateModal} tooltip="Add a Server" />
        <ActionIcon icon={Compass} color="bg-green-600" onClick={() => setActiveModal('discover')} tooltip="Explore" />
      </nav>

      {/* 2. Secondary Sidebar (Channels or DMs) */}
      <div className={`w-60 bg-[#2b2d31] flex flex-col min-w-0 transition-all duration-300 absolute md:relative z-10 h-full ${showMobileSidebar ? 'left-[72px]' : '-left-64 md:left-0'}`}>
         
         {/* Sidebar Content */}
         {renderSidebarContent()}

         {/* User Status Footer */}
         <div className="bg-[#232428] p-2 flex items-center mt-auto flex-shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-2 cursor-pointer hover:opacity-80">
                <Avatar user={currentUser} className="w-8 h-8" statusIndicator={true} />
            </div>
            <div className="flex-1 min-w-0 mr-1">
                <div className="text-sm font-bold truncate text-white">{currentUser.name}</div>
                <div className="text-xs text-gray-400 truncate">#1337</div>
            </div>
            <div className="flex items-center">
                <div className="p-1.5 hover:bg-gray-700 rounded cursor-pointer text-gray-300"><Mic size={18} /></div>
                <div className="p-1.5 hover:bg-gray-700 rounded cursor-pointer text-gray-300"><Headphones size={18} /></div>
                <div 
                    className="p-1.5 hover:bg-gray-700 rounded cursor-pointer text-gray-300"
                    onClick={() => {
                        setUserSettingsTab('account');
                        setActiveModal('userSettings');
                    }}
                >
                    <Settings size={18} />
                </div>
            </div>
         </div>
      </div>

      {/* 3. Main Content (Chat or Friends List) */}
      {renderMainContent()}

      {/* 4. User List (Right Sidebar - Only for Servers) */}
      {showUserList && activeServer && (
        <div className="w-60 bg-[#2b2d31] hidden lg:flex flex-col flex-shrink-0 overflow-y-auto custom-scrollbar p-3 border-l border-gray-900/20">
            <h2 className="text-xs font-bold text-gray-400 uppercase mb-4 px-2 tracking-wide">
                Online — {INITIAL_USERS.filter(u => u.status !== 'offline').length + 1}
            </h2>
            <UserItem user={currentUser} />
            {INITIAL_USERS.filter(u => u.status !== 'offline').map(user => (
                <UserItem key={user.id} user={user} />
            ))}
            <h2 className="text-xs font-bold text-gray-400 uppercase mt-6 mb-4 px-2 tracking-wide">
                Offline — {INITIAL_USERS.filter(u => u.status === 'offline').length}
            </h2>
            {INITIAL_USERS.filter(u => u.status === 'offline').map(user => (
                <UserItem key={user.id} user={user} />
            ))}
        </div>
      )}
      
       {/* 5. Profile / Activity (Right Sidebar - Only for Home/Friends) */}
       {showUserList && !activeServer && (
         <div className="w-[360px] bg-[#2b2d31] hidden xl:flex flex-col flex-shrink-0 overflow-y-auto custom-scrollbar p-4 border-l border-gray-900/20">
            <h2 className="text-xl font-bold mb-4">Active Now</h2>
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
                <p className="font-bold text-gray-400 mb-2">It's quiet for now...</p>
                <p className="text-sm text-gray-500 px-8">When a friend starts an activity—like playing a game or hanging out on voice—we'll show it here!</p>
            </div>
         </div>
       )}

      {/* --- MODALS --- */}
      {activeModal === 'create' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white text-gray-800 rounded-lg shadow-2xl w-full max-w-md overflow-hidden relative">
                <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><X size={24} /></button>
                <div className="p-6 text-center">
                    <h2 className="text-2xl font-bold mb-2">Customize Your Server</h2>
                    <p className="text-gray-500 text-sm mb-6">Give your new server a personality with a name and an icon.</p>
                    <div className="flex justify-center mb-6">
                        <div 
                           className={`w-24 h-24 rounded-full ${newServerColor} flex items-center justify-center text-white text-4xl font-bold relative border-4 border-white shadow-sm cursor-pointer hover:opacity-90 overflow-hidden bg-cover bg-center`}
                           onClick={() => fileInputRef.current?.click()}
                           style={{ backgroundImage: newServerIcon ? `url(${newServerIcon})` : 'none' }}
                        >
                            {!newServerIcon && (newServerName.trim() ? newServerName.trim()[0].toUpperCase() : <Upload size={32} />)}
                            <div className="absolute top-0 right-0 bg-red-500 rounded-full p-1.5 border-2 border-white z-10"><Plus size={12} className="text-white" strokeWidth={4} /></div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </div>
                    </div>
                    <div className="text-left mb-6">
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Server Name</label>
                        <input type="text" className="w-full bg-gray-200 p-2.5 rounded border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800" value={newServerName} onChange={(e) => setNewServerName(e.target.value)} placeholder="Enter a server name" />
                    </div>
                     {/* Color Picker added to Create Modal for consistency */}
                     <div className="text-left mb-6">
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Server Color</label>
                        <div className="flex space-x-2">
                            {SERVER_COLORS.map(color => (
                                <div 
                                    key={color} 
                                    className={`${color} w-8 h-8 rounded-full cursor-pointer hover:scale-110 transition-transform flex items-center justify-center`}
                                    onClick={() => {
                                      setNewServerColor(color);
                                      // Optional: keep image if set, or clear it
                                    }}
                                >
                                    {newServerColor === color && !newServerIcon && <Check size={16} className="text-white" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 p-4 flex justify-between items-center">
                    <button onClick={() => setActiveModal(null)} className="text-gray-500 hover:underline font-medium text-sm">Back</button>
                    <button onClick={finalizeCreateServer} className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-2.5 rounded shadow-sm font-medium transition-colors">Create</button>
                </div>
            </div>
        </div>
      )}

      {/* Settings Modal (Reusing similar layout to Create) */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white text-gray-800 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden relative flex h-[500px]">
                {/* Sidebar */}
                <div className="w-48 bg-gray-100 p-4 flex flex-col border-r border-gray-200">
                     <h3 className="font-bold text-xs uppercase text-gray-500 mb-2">{activeServer.name}</h3>
                     <button onClick={() => setSettingsTab('overview')} className={`text-left px-2 py-1.5 rounded text-sm mb-1 ${settingsTab === 'overview' ? 'bg-gray-200 font-bold' : 'hover:bg-gray-200'}`}>Overview</button>
                     <button onClick={() => setSettingsTab('roles')} className={`text-left px-2 py-1.5 rounded text-sm mb-1 flex items-center justify-between ${settingsTab === 'roles' ? 'bg-gray-200 font-bold' : 'hover:bg-gray-200'}`}>Roles <Shield size={14}/></button>
                     <button onClick={() => setSettingsTab('community')} className={`text-left px-2 py-1.5 rounded text-sm mb-1 flex items-center justify-between ${settingsTab === 'community' ? 'bg-gray-200 font-bold' : 'hover:bg-gray-200'}`}>Community <Globe size={14}/></button>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 flex flex-col overflow-y-auto relative">
                     <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><X size={24} /></button>
                     
                     {settingsTab === 'overview' && (
                         <>
                            <h2 className="text-2xl font-bold mb-6">Server Overview</h2>
                            <div className="flex items-start space-x-6">
                                <div className="flex-shrink-0">
                                    <div 
                                    className={`w-24 h-24 rounded-full ${newServerColor} flex items-center justify-center text-white text-4xl font-bold relative border-4 border-white shadow-sm cursor-pointer hover:opacity-90 overflow-hidden bg-cover bg-center`}
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{ backgroundImage: newServerIcon ? `url(${newServerIcon})` : 'none' }}
                                    >
                                        {!newServerIcon && (newServerName.trim() ? newServerName.trim()[0].toUpperCase() : <Upload size={32} />)}
                                        <div className="absolute top-0 right-0 bg-gray-500 rounded-full p-1.5 border-2 border-white z-10"><Plus size={12} className="text-white" strokeWidth={4} /></div>
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </div>
                                </div>
                                <div className="flex-1">
                                     <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Server Name</label>
                                     <input type="text" className="w-full bg-gray-200 p-2.5 rounded border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 mb-4" value={newServerName} onChange={(e) => setNewServerName(e.target.value)} />
                                     
                                     <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Server Color</label>
                                     <div className="flex space-x-2">
                                        {SERVER_COLORS.map(color => (
                                            <div key={color} className={`${color} w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform flex items-center justify-center`} onClick={() => setNewServerColor(color)}>
                                                {newServerColor === color && !newServerIcon && <Check size={12} className="text-white" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button onClick={saveServerSettings} className="mt-auto self-end bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded shadow-sm font-medium transition-colors w-fit ml-auto">Save Changes</button>
                         </>
                     )}

                     {settingsTab === 'roles' && (
                         <>
                             <h2 className="text-2xl font-bold mb-2">Roles</h2>
                             <p className="text-gray-500 text-sm mb-6">Create roles to organize your server members.</p>
                             
                             <div className="flex space-x-2 mb-6">
                                 <input type="text" placeholder="New Role Name" className="flex-1 bg-gray-200 p-2 rounded text-sm" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} />
                                 <div className="flex space-x-1">
                                     {SERVER_COLORS.slice(0, 3).map(color => (
                                         <div key={color} className={`${color} w-9 h-9 rounded cursor-pointer flex items-center justify-center`} onClick={() => setNewRoleColor(color)}>
                                             {newRoleColor === color && <Check size={14} className="text-white" />}
                                         </div>
                                     ))}
                                 </div>
                                 <button onClick={addRole} className="bg-indigo-500 text-white px-4 rounded text-sm">Add</button>
                             </div>

                             <div className="space-y-2">
                                 {(activeServer.roles || []).map(role => (
                                     <div key={role.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                                         <div className="flex items-center">
                                             <div className={`w-3 h-3 rounded-full mr-2 ${role.color.replace('text-', 'bg-')}`}></div>
                                             <span className={`font-medium ${role.color.replace('text-', 'text-')}`}>{role.name}</span>
                                         </div>
                                         <Trash size={14} className="text-gray-400 hover:text-red-500 cursor-pointer" />
                                     </div>
                                 ))}
                                 {(!activeServer.roles || activeServer.roles.length === 0) && <p className="text-gray-400 text-sm italic">No roles yet.</p>}
                             </div>
                         </>
                     )}

                     {settingsTab === 'community' && (
                         <>
                             <h2 className="text-2xl font-bold mb-4">Community Settings</h2>
                             <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-4">
                                 <div className="flex items-center justify-between mb-2">
                                     <div className="font-bold text-indigo-900">Enable Community</div>
                                     <div 
                                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${activeServer.isCommunity ? 'bg-green-500' : 'bg-gray-300'}`}
                                        onClick={toggleCommunity}
                                     >
                                         <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${activeServer.isCommunity ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                     </div>
                                 </div>
                                 <p className="text-sm text-indigo-800">
                                     {activeServer.isCommunity 
                                        ? "Your server is publicly visible in Discovery! People can find and join your server."
                                        : "Enable this to allow your server to appear in Server Discovery."}
                                 </p>
                             </div>
                         </>
                     )}
                </div>
            </div>
        </div>
      )}

      {/* User Settings Modal */}
      {activeModal === 'userSettings' && (
        <div className="fixed inset-0 bg-[#313338] z-50 flex animate-in fade-in duration-200">
            {/* Sidebar */}
            <div className="w-[300px] bg-[#2b2d31] flex flex-col items-end pt-16 pb-4 px-4 border-r border-[#1e1f22]">
                <div className="w-48">
                    <h3 className="font-bold text-xs uppercase text-gray-400 mb-2 px-2">User Settings</h3>
                    <div 
                        onClick={() => setUserSettingsTab('account')}
                        className={`px-2 py-1.5 rounded cursor-pointer mb-1 font-medium ${userSettingsTab === 'account' ? 'bg-[#404249] text-white' : 'text-gray-400 hover:bg-[#35373c] hover:text-gray-200'}`}
                    >
                        My Account
                    </div>
                    <div 
                        onClick={() => setUserSettingsTab('profiles')}
                        className={`px-2 py-1.5 rounded cursor-pointer mb-1 font-medium ${userSettingsTab === 'profiles' ? 'bg-[#404249] text-white' : 'text-gray-400 hover:bg-[#35373c] hover:text-gray-200'}`}
                    >
                        Profiles
                    </div>
                    <div className="h-px bg-gray-700 my-2 mx-2"></div>
                    <div 
                        onClick={handleLogout}
                        className="px-2 py-1.5 rounded cursor-pointer mb-1 font-medium text-red-400 hover:bg-[#35373c] flex items-center justify-between group"
                    >
                        Log Out
                        <LogOut size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-[#313338] pt-16 px-10 overflow-y-auto relative custom-scrollbar">
                <div className="max-w-[700px]">
                    <div className="absolute top-16 right-10 flex flex-col items-center group cursor-pointer" onClick={() => setActiveModal(null)}>
                        <div className="w-9 h-9 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-400 group-hover:border-white group-hover:text-white transition-colors">
                            <X size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 mt-1 uppercase group-hover:text-white transition-colors">Esc</span>
                    </div>

                    {userSettingsTab === 'account' && (
                        <div className="animate-in slide-in-from-bottom-4 duration-300">
                            <h2 className="text-xl font-bold text-white mb-6">My Account</h2>
                            
                            {/* Profile Card Preview */}
                            <div className="bg-[#2b2d31] rounded-lg overflow-hidden mb-8">
                                <div className={`h-24 ${currentUser.banner || 'bg-indigo-500'}`}></div>
                                <div className="px-4 pb-4 relative">
                                    <div className="absolute -top-10 left-4">
                                        <div className="p-1.5 bg-[#2b2d31] rounded-full inline-block">
                                            <Avatar user={currentUser} className="w-20 h-20" textSize="text-3xl" statusIndicator={true} />
                                        </div>
                                    </div>
                                    <div className="ml-28 pt-3 flex justify-between items-center">
                                        <div className="text-xl font-bold text-white">{currentUser.name}</div>
                                        <button 
                                            onClick={() => setUserSettingsTab('profiles')}
                                            className="bg-[#5865F2] hover:bg-[#4752c4] text-white px-4 py-1.5 rounded text-sm font-medium transition-colors"
                                        >
                                            Edit User Profile
                                        </button>
                                    </div>
                                    
                                    {/* Info Cards */}
                                    <div className="mt-6 bg-[#1e1f22] rounded-lg p-4 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Display Name</div>
                                                <div className="text-gray-200">{currentUser.name}</div>
                                            </div>
                                            <button className="bg-[#313338] hover:bg-[#404249] text-gray-200 px-4 py-1.5 rounded text-sm font-medium">Edit</button>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Username</div>
                                                <div className="text-gray-200">{currentUser.name.toLowerCase().replace(/\s/g, '')}</div>
                                            </div>
                                            <button className="bg-[#313338] hover:bg-[#404249] text-gray-200 px-4 py-1.5 rounded text-sm font-medium">Edit</button>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Email</div>
                                                <div className="text-gray-200">{currentUser.email || '********@gmail.com'}</div>
                                            </div>
                                            <button className="bg-[#313338] hover:bg-[#404249] text-gray-200 px-4 py-1.5 rounded text-sm font-medium">Edit</button>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Phone Number</div>
                                                <div className="text-gray-200">********99</div>
                                            </div>
                                            <button className="bg-[#313338] hover:bg-[#404249] text-gray-200 px-4 py-1.5 rounded text-sm font-medium">Edit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-700 pt-6">
                                <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">Password and Authentication</h3>
                                
                                {isChangingPassword ? (
                                    <div className="bg-[#1e1f22] p-4 rounded-lg mb-4 border border-[#404249]">
                                        <h4 className="text-sm font-bold text-white mb-4">Change Password</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Current Password</label>
                                                <input 
                                                    type="password" 
                                                    className="w-full bg-[#2b2d31] p-2 rounded border border-black/20 focus:border-[#5865F2] focus:outline-none text-white text-sm transition-colors"
                                                    value={passwordForm.current}
                                                    onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">New Password</label>
                                                <input 
                                                    type="password" 
                                                    className="w-full bg-[#2b2d31] p-2 rounded border border-black/20 focus:border-[#5865F2] focus:outline-none text-white text-sm transition-colors"
                                                    value={passwordForm.new}
                                                    onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Confirm New Password</label>
                                                <input 
                                                    type="password" 
                                                    className="w-full bg-[#2b2d31] p-2 rounded border border-black/20 focus:border-[#5865F2] focus:outline-none text-white text-sm transition-colors"
                                                    value={passwordForm.confirm}
                                                    onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                                                />
                                            </div>
                                            <div className="flex justify-end space-x-2 pt-2">
                                                <button 
                                                    onClick={() => setIsChangingPassword(false)}
                                                    className="text-gray-300 hover:underline text-sm px-3 py-2"
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    onClick={handleChangePassword}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setIsChangingPassword(true)}
                                        className="bg-[#5865F2] hover:bg-[#4752c4] text-white px-4 py-2 rounded text-sm font-medium transition-colors mb-4"
                                    >
                                        Change Password
                                    </button>
                                )}
                                
                                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 mt-4">Account Removal</h3>
                                <button className="border border-red-500 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded text-sm font-medium transition-colors">Delete Account</button>
                            </div>
                        </div>
                    )}

                    {userSettingsTab === 'profiles' && (
                        <div className="animate-in slide-in-from-bottom-4 duration-300">
                            <h2 className="text-xl font-bold text-white mb-6">Profiles</h2>
                            
                            <div className="flex space-x-8">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Display Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-[#1e1f22] p-2.5 rounded border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 mb-6" 
                                        value={currentUser.name} 
                                        onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                                    />

                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-2">About Me</label>
                                    <textarea 
                                        className="w-full bg-[#1e1f22] p-2.5 rounded border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 mb-6 h-24 resize-none" 
                                        value={currentUser.about}
                                        onChange={(e) => setCurrentUser({...currentUser, about: e.target.value})}
                                        placeholder="Tell us about yourself!"
                                    />

                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Avatar</label>
                                    <div className="flex items-center space-x-4 mb-6">
                                        <button 
                                            className="bg-[#5865F2] hover:bg-[#4752c4] text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                                            onClick={() => userAvatarInputRef.current?.click()}
                                        >
                                            Change Avatar
                                        </button>
                                        <button 
                                            className="text-gray-300 hover:underline text-sm"
                                            onClick={() => setCurrentUser({...currentUser, avatar: 'bg-indigo-400'})}
                                        >
                                            Remove Avatar
                                        </button>
                                        <input type="file" ref={userAvatarInputRef} className="hidden" accept="image/*" onChange={handleUserAvatarUpload} />
                                    </div>

                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Banner Color</label>
                                    <div className="flex space-x-2 mb-6">
                                        {SERVER_COLORS.map(color => (
                                            <div 
                                                key={color} 
                                                className={`${color} w-8 h-8 rounded-full cursor-pointer hover:scale-110 transition-transform flex items-center justify-center`}
                                                onClick={() => setCurrentUser({...currentUser, banner: color})}
                                            >
                                                {currentUser.banner === color && <Check size={16} className="text-white" />}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Status</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['online', 'idle', 'dnd', 'offline'].map(status => (
                                            <div 
                                                key={status} 
                                                className={`p-2 rounded cursor-pointer border flex items-center ${currentUser.status === status ? 'border-[#5865F2] bg-[#5865F2]/10' : 'border-transparent bg-[#1e1f22] hover:bg-[#2b2d31]'}`}
                                                onClick={() => setCurrentUser({...currentUser, status})}
                                            >
                                                <div className={`w-3 h-3 rounded-full mr-2 ${status === 'online' ? 'bg-green-500' : status === 'idle' ? 'bg-yellow-500' : status === 'dnd' ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                                                <span className="capitalize text-gray-300 text-sm font-medium">{status === 'dnd' ? 'Do Not Disturb' : status === 'offline' ? 'Invisible' : status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="w-[300px]">
                                    <div className="text-xs font-bold text-gray-400 uppercase mb-2">Preview</div>
                                    <div className="bg-[#2b2d31] rounded-lg overflow-hidden shadow-lg border border-[#1e1f22] relative group">
                                        <div className={`h-16 ${currentUser.banner || 'bg-indigo-500'}`}></div>
                                        <div className="px-4 pb-4 pt-10 relative">
                                            <div className="absolute -top-8 left-4 p-1.5 bg-[#2b2d31] rounded-full">
                                                <Avatar user={currentUser} className="w-20 h-20" textSize="text-3xl" statusIndicator={true} />
                                            </div>
                                            <div className="text-lg font-bold text-white mb-1">{currentUser.name}</div>
                                            <div className="text-gray-400 text-xs mb-3">{currentUser.name.toLowerCase()}</div>
                                            
                                            <div className="h-px bg-gray-700 mb-3"></div>
                                            
                                            <div className="text-xs font-bold text-gray-400 uppercase mb-1">About Me</div>
                                            <div className="text-sm text-gray-300 text-sm">{currentUser.about || "Just a space traveler."}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
      
      {/* Create Channel Modal */}
      {activeModal === 'createChannel' && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-[#313338] text-white rounded-lg shadow-2xl w-full max-w-md p-6">
                 <h2 className="text-xl font-bold mb-2">Create Channel</h2>
                 <p className="text-gray-400 text-sm mb-4">in {activeServer?.name}</p>
                 <div className="mb-4">
                     <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Channel Name</label>
                     <div className="flex items-center bg-[#1e1f22] rounded p-2">
                         <Hash size={20} className="text-gray-400 mr-2" />
                         <input type="text" className="bg-transparent flex-1 focus:outline-none text-white placeholder-gray-500" placeholder="new-channel" value={newChannelName} onChange={(e) => setNewChannelName(e.target.value)} />
                     </div>
                 </div>
                 <div className="flex justify-end space-x-2">
                     <button onClick={() => setActiveModal(null)} className="px-4 py-2 hover:underline text-sm">Cancel</button>
                     <button onClick={createChannel} className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 rounded font-medium text-sm">Create Channel</button>
                 </div>
            </div>
          </div>
      )}

      {/* Edit Channel Modal */}
      {activeModal === 'editChannel' && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-[#313338] text-white rounded-lg shadow-2xl w-full max-w-md p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Edit Channel</h2>
                    <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                 </div>
                 
                 <div className="mb-6">
                     <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Channel Name</label>
                     <div className="flex items-center bg-[#1e1f22] rounded p-2">
                         <Hash size={20} className="text-gray-400 mr-2" />
                         <input 
                            type="text" 
                            className="bg-transparent flex-1 focus:outline-none text-white placeholder-gray-500" 
                            placeholder="channel-name" 
                            value={newChannelName} 
                            onChange={(e) => setNewChannelName(e.target.value)} 
                         />
                     </div>
                 </div>

                 <div className="flex justify-between items-center pt-2">
                     <button 
                        onClick={deleteChannel}
                        className="px-4 py-2 text-red-500 border border-red-500/50 hover:bg-red-500/10 rounded font-medium text-sm flex items-center"
                     >
                        <Trash size={14} className="mr-2" />
                        Delete Channel
                     </button>
                     <div className="flex space-x-2">
                        <button onClick={() => setActiveModal(null)} className="px-4 py-2 hover:underline text-sm">Cancel</button>
                        <button onClick={updateChannel} className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded font-medium text-sm">Save Changes</button>
                     </div>
                 </div>
            </div>
          </div>
      )}

      {activeModal === 'discover' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
             <div className="bg-[#313338] text-white rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden relative">
                <div className="relative h-48 bg-gradient-to-r from-indigo-900 to-purple-900 flex flex-col items-center justify-center text-center p-6 flex-shrink-0">
                    <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 p-2 rounded-full backdrop-blur-sm"><X size={24} /></button>
                    <h2 className="text-3xl font-bold mb-2">Find your community on Nebula</h2>
                    <div className="mt-6 w-full max-w-lg relative">
                        <input type="text" placeholder="Explore communities..." className="w-full py-3 px-4 pl-10 rounded bg-black/40 border-none focus:outline-none focus:ring-2 focus:ring-white/20 placeholder-gray-400 text-white" />
                        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-[#313338] custom-scrollbar">
                    <h3 className="text-xl font-bold mb-4">Featured Communities</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {discoverableServers.map(server => (
                            <div key={server.id} className="bg-[#2b2d31] rounded-lg overflow-hidden hover:shadow-xl hover:bg-[#232428] transition-all group border border-gray-800">
                                <div className={`h-24 ${server.color} relative`}>
                                    <div className="absolute -bottom-6 left-4 border-4 border-[#2b2d31] rounded-2xl group-hover:border-[#232428] transition-colors">
                                        <div className={`w-12 h-12 flex items-center justify-center bg-gray-700 text-white font-bold rounded-xl text-lg`}>
                                            {server.img ? <img src={server.img} className="w-full h-full object-cover rounded-xl"/> : server.icon}
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-8 px-4 pb-4">
                                    <h4 className="font-bold mb-1">{server.name}</h4>
                                    <p className="text-xs text-gray-400 mb-4 h-8">{server.description}</p>
                                    <button onClick={() => joinServer(server)} className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-xs font-bold transition-colors">Join</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
             </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background-color: #2b2d31; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #1a1b1e; border-radius: 4px; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
