const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const messages = document.getElementById('messages');

function addMessage(text, cls, withTimestamp = true) {
  const el = document.createElement('div');
  el.className = `message ${cls || ''}`;
  el.textContent = text;
  if (withTimestamp) {
    const ts = document.createElement('span');
    ts.className = 'timestamp';
    ts.textContent = new Date().toLocaleTimeString();
    el.appendChild(ts);
  }
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
  return el;
}

function generateReply(userText) {
  if (!userText) return "I didn't get that — please say something.";
  const t = userText.toLowerCase();
  if (/\b(hi|hello|hey)\b/.test(t)) return "Hello! I'm a simple chatbot. Ask me 'time', 'date', 'joke', or say 'help'.";
  if (t.includes('time')) return `The time is ${new Date().toLocaleTimeString()}.`;
  if (t.includes('date')) return `Today's date is ${new Date().toLocaleDateString()}.`;
  if (t.includes('joke')) return "Why did the developer go broke? Because they used up all their cache!";
  if (t.includes('about')) return "I'm a tiny local chatbot built with HTML/CSS/JS. No server required.";
  if (t.includes('help')) return "Try: 'hello', 'time', 'date', 'joke', or ask any short question and I'll echo it.";
  // fallback: echo
  return `You said: "${userText}"`;
}

function showTypingAndReply(userText) {
  // show typing indicator
  const typingEl = addMessage('Bot is typing...', 'bot typing', false);
  // respond after a short delay
  const delay = 600 + Math.random() * 700;
  setTimeout(() => {
    // replace typing text with actual reply
    const reply = generateReply(userText);
    typingEl.remove();
    addMessage(reply, 'bot');
  }, delay);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  input.value = '';
  input.focus();
  showTypingAndReply(text);
});

// send on Enter (works naturally because of form); keep focus management
input.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') input.value = '';
});

// seed greeting
window.addEventListener('load', () => {
  addMessage("Hi! I'm your local chat bot. Try typing 'hello' or 'help'.", 'bot');
  input.focus();
});