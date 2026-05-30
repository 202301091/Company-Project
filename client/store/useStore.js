import { create } from 'zustand';
export const useStore = create((set) => ({
  me: null,
  setMe: (user) => set({ me: user }),
  // Online Collaborators list
  activeUsers: [],
  setActiveUsers: (users) => set({ activeUsers: users }),
  addUser: (user) => set((state) => {
    if (state.activeUsers.some(u => u.id === user.id || u.socketId === user.id)) {
      return {};
    }
    return { activeUsers: [...state.activeUsers, user] };
  }),
  removeUser: (userId) => set((state) => ({
    activeUsers: state.activeUsers.filter(u => u.id !== userId && u.socketId !== userId)
  })),
  // Other users' shared cursors
  cursors: {},
  updateCursor: (socketId, cursorData) => set((state) => ({
    cursors: {
      ...state.cursors,
      [socketId]: cursorData
    }
  })),
  removeCursor: (socketId) => set((state) => {
    const newCursors = { ...state.cursors };
    delete newCursors[socketId];
    return { cursors: newCursors };
  }),

  // Collaborative Chat Widget
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, msg]
  })),

  typingUsers: {},
  setTypingStatus: (username, isTyping) => set((state) => ({
    typingUsers: {
      ...state.typingUsers,
      [username]: isTyping
    }
  })),

  // Dynamic Workspace activity stream logs
  activities: [],
  setActivities: (activities) => set({ activities }),
  addActivity: (act) => set((state) => {
    const updated = [act, ...state.activities];
    return { activities: updated.slice(0, 30) }; // Keep top 30
  }),


  // Global shared counter
  counter: 0,
  setCounter: (counter) => set({ counter }),

  // Global theme synchronization
  theme: 'dark',
  setTheme: (theme) => set({ theme }),

  // Features voting widget counts
  votes: {
    agents: 0,
    collaboration: 0,
    designer: 0,
    canvas: 0
  },
  setVotes: (votes) => set({ votes }),

  // Pointer heatmap coordinates for live heatmap overlay
  heatmapPoints: [],
  addHeatmapPoint: (point) => set((state) => {
    // Keep last 150 points to prevent lagging
    const updated = [...state.heatmapPoints, { ...point, id: Math.random().toString(), age: Date.now() }];
    if (updated.length > 150) updated.shift();
    return { heatmapPoints: updated };
  }),
  clearOldHeatmapPoints: () => set((state) => {
    const now = Date.now();

    // Filter out points older than 15 seconds
    const filtered = state.heatmapPoints.filter(p => now - p.age < 15000);
    return { heatmapPoints: filtered };
  })
}));
