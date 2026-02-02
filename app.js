const storageKey = "createx-data";

const initialData = {
  users: [],
  posts: [],
  stories: [],
  messages: {},
  currentUserId: null,
};

const state = loadState();

const elements = {
  app: document.getElementById("app"),
  auth: document.getElementById("auth"),
  signupForm: document.getElementById("signupForm"),
  loginForm: document.getElementById("loginForm"),
  logoutBtn: document.getElementById("logoutBtn"),
  currentUser: document.getElementById("currentUser"),
  navLinks: document.querySelectorAll(".nav-link"),
  viewTitle: document.getElementById("viewTitle"),
  viewSubtitle: document.getElementById("viewSubtitle"),
  views: {
    feed: document.getElementById("feedView"),
    stories: document.getElementById("storiesView"),
    messages: document.getElementById("messagesView"),
    profile: document.getElementById("profileView"),
    settings: document.getElementById("settingsView"),
  },
  composer: document.getElementById("composer"),
  openComposer: document.getElementById("openComposer"),
  closeComposer: document.getElementById("closeComposer"),
  postForm: document.getElementById("postForm"),
  feed: document.getElementById("feed"),
  profileFeed: document.getElementById("profileFeed"),
  storyTemplate: document.getElementById("storyTemplate"),
  postTemplate: document.getElementById("postTemplate"),
  stories: document.getElementById("stories"),
  openStory: document.getElementById("openStory"),
  threadList: document.getElementById("threadList"),
  threadTemplate: document.getElementById("threadTemplate"),
  threadHeader: document.getElementById("threadHeader"),
  threadBody: document.getElementById("threadBody"),
  messageForm: document.getElementById("messageForm"),
  profileCard: document.getElementById("profileCard"),
  profileForm: document.getElementById("profileForm"),
  newMessageUser: document.getElementById("newMessageUser"),
  startChat: document.getElementById("startChat"),
};

const viewMeta = {
  feed: ["For You", "Discover posts tailored to you"],
  stories: ["Stories", "Short moments from the community"],
  messages: ["Messages", "Chat securely with friends"],
  profile: ["Profile", "Your public Createx presence"],
  settings: ["Settings", "Manage your account"],
};

let activeThread = null;

function loadState() {
  const stored = localStorage.getItem(storageKey);
  if (!stored) {
    return structuredClone(initialData);
  }
  try {
    return { ...structuredClone(initialData), ...JSON.parse(stored) };
  } catch (error) {
    console.error("Failed to load state", error);
    return structuredClone(initialData);
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString();
}

function currentUser() {
  return state.users.find((user) => user.id === state.currentUserId) || null;
}

function ensureDemoUsers() {
  if (state.users.length > 0) return;
  const demoUsers = [
    {
      id: crypto.randomUUID(),
      name: "Nova Han",
      email: "nova@createx.app",
      password: "createx",
      displayName: "Nova",
      bio: "Designing friendly social spaces.",
      avatar: "",
    },
    {
      id: crypto.randomUUID(),
      name: "Kai Li",
      email: "kai@createx.app",
      password: "createx",
      displayName: "Kai",
      bio: "Product thinker and storyteller.",
      avatar: "",
    },
  ];
  state.users.push(...demoUsers);

  const now = Date.now();
  state.posts.push(
    {
      id: crypto.randomUUID(),
      authorId: demoUsers[0].id,
      caption: "Welcome to Createx — your AI-inspired social space.",
      image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
      createdAt: now - 1000 * 60 * 60,
      likes: [],
      comments: [],
    },
    {
      id: crypto.randomUUID(),
      authorId: demoUsers[1].id,
      caption: "Sharing a glimpse behind the scenes.",
      image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=1200&q=80",
      createdAt: now - 1000 * 60 * 30,
      likes: [],
      comments: [],
    }
  );

  state.stories.push(
    {
      id: crypto.randomUUID(),
      authorId: demoUsers[0].id,
      caption: "Morning focus session.",
      createdAt: now - 1000 * 60 * 20,
    },
    {
      id: crypto.randomUUID(),
      authorId: demoUsers[1].id,
      caption: "Sketching new ideas.",
      createdAt: now - 1000 * 60 * 10,
    }
  );

  state.messages = {
    [demoUsers[0].id]: {
      [demoUsers[1].id]: [
        {
          senderId: demoUsers[0].id,
          body: "Excited to build Createx together!",
          createdAt: now - 1000 * 60 * 5,
        },
      ],
    },
  };

  saveState();
}

function renderAuth() {
  const isLoggedIn = Boolean(state.currentUserId);
  elements.auth.classList.toggle("hidden", isLoggedIn);
  elements.app.classList.toggle("hidden", !isLoggedIn);
  if (isLoggedIn) {
    renderCurrentUser();
    renderView("feed");
  }
}

function renderCurrentUser() {
  const user = currentUser();
  if (!user) return;
  elements.currentUser.textContent = `${user.displayName || user.name} · ${user.email}`;
}

function renderView(view) {
  Object.entries(elements.views).forEach(([key, section]) => {
    section.classList.toggle("hidden", key !== view);
  });
  elements.navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.view === view);
  });
  const [title, subtitle] = viewMeta[view];
  elements.viewTitle.textContent = title;
  elements.viewSubtitle.textContent = subtitle;

  if (view === "feed") renderFeed();
  if (view === "stories") renderStories();
  if (view === "messages") renderThreads();
  if (view === "profile") renderProfile();
  if (view === "settings") renderSettings();
}

function renderFeed() {
  const posts = [...state.posts].sort((a, b) => b.createdAt - a.createdAt);
  elements.feed.innerHTML = "";
  posts.forEach((post) => elements.feed.appendChild(createPostCard(post)));
}

function renderProfile() {
  const user = currentUser();
  if (!user) return;
  elements.profileCard.innerHTML = `
    <h3>${user.displayName || user.name}</h3>
    <p>${user.bio || "Tell the world about yourself."}</p>
    <span>${user.email}</span>
  `;

  const posts = state.posts.filter((post) => post.authorId === user.id);
  elements.profileFeed.innerHTML = "";
  posts.forEach((post) => elements.profileFeed.appendChild(createPostCard(post)));
}

function renderSettings() {
  const user = currentUser();
  if (!user) return;
  elements.profileForm.displayName.value = user.displayName || "";
  elements.profileForm.bio.value = user.bio || "";
  elements.profileForm.avatar.value = user.avatar || "";
}

function renderStories() {
  const stories = [...state.stories].sort((a, b) => b.createdAt - a.createdAt);
  elements.stories.innerHTML = "";
  stories.forEach((story) => {
    const template = elements.storyTemplate.content.cloneNode(true);
    const author = findUser(story.authorId);
    template.querySelector(".story-author").textContent = author?.displayName || author?.name;
    template.querySelector(".story-caption").textContent = story.caption;
    elements.stories.appendChild(template);
  });
}

function renderThreads() {
  const user = currentUser();
  if (!user) return;

  const threads = Object.keys(state.messages[user.id] || {});
  elements.threadList.innerHTML = "";

  renderNewMessageUsers(user.id);

  threads.forEach((threadUserId) => {
    const template = elements.threadTemplate.content.cloneNode(true);
    const threadUser = findUser(threadUserId);
    template.querySelector(".thread-name").textContent = threadUser?.displayName || threadUser?.name;
    const messages = state.messages[user.id][threadUserId] || [];
    const lastMessage = messages[messages.length - 1];
    template.querySelector(".thread-preview").textContent = lastMessage?.body || "No messages yet";
    const button = template.querySelector(".thread-item");
    button.addEventListener("click", () => openThread(threadUserId));
    elements.threadList.appendChild(button);
  });

  if (threads.length === 0) {
    elements.threadList.innerHTML = "<p class=\"muted\">No conversations yet. Start one from a profile.</p>";
    elements.threadHeader.textContent = "";
    elements.threadBody.innerHTML = "";
    activeThread = null;
  } else if (!activeThread) {
    openThread(threads[0]);
  }
}

function renderNewMessageUsers(currentUserId) {
  const users = state.users.filter((user) => user.id !== currentUserId);
  elements.newMessageUser.innerHTML = "";
  if (users.length === 0) {
    const option = document.createElement("option");
    option.textContent = "No other users yet";
    option.disabled = true;
    option.selected = true;
    elements.newMessageUser.appendChild(option);
    return;
  }
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.displayName || user.name;
    elements.newMessageUser.appendChild(option);
  });
}

function openThread(userId) {
  activeThread = userId;
  const threadUser = findUser(userId);
  elements.threadHeader.textContent = threadUser?.displayName || threadUser?.name;
  renderThreadMessages();
}

function renderThreadMessages() {
  const user = currentUser();
  if (!user || !activeThread) return;
  const messages = state.messages[user.id]?.[activeThread] || [];
  elements.threadBody.innerHTML = "";
  messages.forEach((message) => {
    const bubble = document.createElement("div");
    bubble.className = `message ${message.senderId === user.id ? "self" : ""}`;
    bubble.textContent = message.body;
    elements.threadBody.appendChild(bubble);
  });
  elements.threadBody.scrollTop = elements.threadBody.scrollHeight;
}

function createPostCard(post) {
  const template = elements.postTemplate.content.cloneNode(true);
  const author = findUser(post.authorId);
  template.querySelector(".post-author").textContent = author?.displayName || author?.name;
  template.querySelector(".post-meta").textContent = formatTime(post.createdAt);
  template.querySelector(".post-caption").textContent = post.caption;
  const image = template.querySelector(".post-image");
  if (post.image) {
    image.src = post.image;
    image.alt = post.caption;
    image.classList.add("active");
  }
  const likeBtn = template.querySelector(".like-btn");
  const likeCount = likeBtn.querySelector("span");
  likeCount.textContent = post.likes.length;
  likeBtn.addEventListener("click", () => toggleLike(post.id));

  const comments = template.querySelector(".comments");
  comments.innerHTML = "";
  post.comments.forEach((comment) => {
    const authorName = findUser(comment.authorId)?.displayName || "Unknown";
    const entry = document.createElement("p");
    entry.textContent = `${authorName}: ${comment.body}`;
    comments.appendChild(entry);
  });

  const commentForm = template.querySelector(".comment-form");
  commentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = commentForm.comment;
    addComment(post.id, input.value.trim());
    input.value = "";
  });

  return template;
}

function toggleLike(postId) {
  const user = currentUser();
  if (!user) return;
  const post = state.posts.find((entry) => entry.id === postId);
  if (!post) return;
  const liked = post.likes.includes(user.id);
  post.likes = liked ? post.likes.filter((id) => id !== user.id) : [...post.likes, user.id];
  saveState();
  renderFeed();
  renderProfile();
}

function addComment(postId, body) {
  const user = currentUser();
  if (!user || !body) return;
  const post = state.posts.find((entry) => entry.id === postId);
  if (!post) return;
  post.comments.push({
    id: crypto.randomUUID(),
    authorId: user.id,
    body,
    createdAt: Date.now(),
  });
  saveState();
  renderFeed();
  renderProfile();
}

function addPost(caption, image) {
  const user = currentUser();
  if (!user) return;
  state.posts.push({
    id: crypto.randomUUID(),
    authorId: user.id,
    caption,
    image: image || "",
    createdAt: Date.now(),
    likes: [],
    comments: [],
  });
  saveState();
  renderFeed();
  renderProfile();
}

function addStory(caption) {
  const user = currentUser();
  if (!user) return;
  state.stories.unshift({
    id: crypto.randomUUID(),
    authorId: user.id,
    caption,
    createdAt: Date.now(),
  });
  saveState();
  renderStories();
}

function addMessage(recipientId, body) {
  const user = currentUser();
  if (!user) return;
  if (!state.messages[user.id]) state.messages[user.id] = {};
  if (!state.messages[user.id][recipientId]) state.messages[user.id][recipientId] = [];
  state.messages[user.id][recipientId].push({
    senderId: user.id,
    body,
    createdAt: Date.now(),
  });
  if (!state.messages[recipientId]) state.messages[recipientId] = {};
  if (!state.messages[recipientId][user.id]) state.messages[recipientId][user.id] = [];
  state.messages[recipientId][user.id].push({
    senderId: user.id,
    body,
    createdAt: Date.now(),
  });
  saveState();
  renderThreads();
  renderThreadMessages();
}

function findUser(userId) {
  return state.users.find((user) => user.id === userId) || null;
}

function signUp({ name, email, password }) {
  const existing = state.users.find((user) => user.email === email);
  if (existing) {
    alert("Account already exists. Please log in.");
    return;
  }
  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
    displayName: name,
    bio: "",
    avatar: "",
  };
  state.users.push(user);
  state.currentUserId = user.id;
  saveState();
  renderAuth();
}

function logIn({ email, password }) {
  const user = state.users.find((entry) => entry.email === email && entry.password === password);
  if (!user) {
    alert("Invalid credentials. Try again.");
    return;
  }
  state.currentUserId = user.id;
  saveState();
  renderAuth();
}

function logOut() {
  state.currentUserId = null;
  saveState();
  renderAuth();
}

function setupEvents() {
  elements.navLinks.forEach((link) => {
    link.addEventListener("click", () => renderView(link.dataset.view));
  });

  elements.signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(elements.signupForm));
    signUp(data);
    elements.signupForm.reset();
  });

  elements.loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(elements.loginForm));
    logIn(data);
    elements.loginForm.reset();
  });

  elements.logoutBtn.addEventListener("click", logOut);

  elements.openComposer.addEventListener("click", () => {
    elements.composer.classList.add("active");
  });

  elements.closeComposer.addEventListener("click", () => {
    elements.composer.classList.remove("active");
  });

  elements.postForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(elements.postForm));
    addPost(data.caption.trim(), data.image.trim());
    elements.postForm.reset();
    elements.composer.classList.remove("active");
  });

  elements.openStory.addEventListener("click", () => {
    const caption = prompt("Story caption");
    if (caption) addStory(caption.trim());
  });

  elements.profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const user = currentUser();
    if (!user) return;
    const data = Object.fromEntries(new FormData(elements.profileForm));
    user.displayName = data.displayName.trim();
    user.bio = data.bio.trim();
    user.avatar = data.avatar.trim();
    saveState();
    renderProfile();
    renderCurrentUser();
  });

  elements.messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = elements.messageForm.message;
    if (!activeThread) {
      alert("Select a conversation first.");
      return;
    }
    addMessage(activeThread, input.value.trim());
    input.value = "";
  });

  elements.startChat.addEventListener("click", () => {
    const user = currentUser();
    if (!user) return;
    const userId = elements.newMessageUser.value;
    if (!userId) return;
    if (!state.messages[user.id]) state.messages[user.id] = {};
    if (!state.messages[user.id][userId]) {
      state.messages[user.id][userId] = [];
    }
    saveState();
    openThread(userId);
    renderThreads();
  });
}

function bootstrap() {
  ensureDemoUsers();
  setupEvents();
  renderAuth();
}

bootstrap();
