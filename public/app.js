const API_KEY = "AIzaSyCPdCk6mymaZlpUeuUUA7CRdS1rT_6ATmg";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const MODEL_CANDIDATES = ["gemini-1.5-flash", "gemini-1.5-flash-latest"];

const chat = document.getElementById("chat");
const chatForm = document.getElementById("chatForm");
const promptInput = document.getElementById("prompt");
const statusText = document.getElementById("status");
const clearBtn = document.getElementById("clearBtn");
const sendBtn = document.getElementById("sendBtn");
const messageTemplate = document.getElementById("messageTemplate");

const conversation = [
  {
    role: "model",
    parts: [
      {
        text: "You are @NLS, a helpful, friendly, and concise chatbot that mirrors ChatGPT's tone.",
      },
    ],
  },
];

function addMessage({ role, text }) {
  const clone = messageTemplate.content.cloneNode(true);
  const messageEl = clone.querySelector(".message");
  const metaEl = clone.querySelector(".message__meta");
  const contentEl = clone.querySelector(".message__content");

  messageEl.classList.add(role);
  metaEl.textContent = role === "user" ? "You" : "@NLS";
  contentEl.textContent = text;

  chat.appendChild(clone);
  chat.scrollTop = chat.scrollHeight;
}

function setStatus(message, isBusy = false) {
  statusText.textContent = message;
  sendBtn.disabled = isBusy;
  promptInput.disabled = isBusy;
}

async function requestCompletion(model, contents) {
  const response = await fetch(`${API_BASE}/${model}:generateContent?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 512,
      },
    }),
  });

  return response;
}

async function sendMessage(userText) {
  conversation.push({ role: "user", parts: [{ text: userText }] });

  let lastError;
  for (const model of MODEL_CANDIDATES) {
    const response = await requestCompletion(model, conversation);
    if (response.ok) {
      const data = await response.json();
      const reply =
        data.candidates?.[0]?.content?.parts?.map((part) => part.text).join("") ||
        "I'm not sure how to respond to that.";
      conversation.push({ role: "model", parts: [{ text: reply }] });
      return reply;
    }

    const errorText = await response.text();
    lastError = new Error(`Request failed: ${response.status} ${errorText}`);
    if (response.status !== 404) {
      break;
    }
  }

  throw lastError || new Error("Request failed.");
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const userText = promptInput.value.trim();
  if (!userText) {
    return;
  }

  addMessage({ role: "user", text: userText });
  promptInput.value = "";

  setStatus("@NLS is thinking...", true);

  try {
    const reply = await sendMessage(userText);
    addMessage({ role: "assistant", text: reply });
    setStatus("Ready");
  } catch (error) {
    addMessage({
      role: "assistant",
      text: `Something went wrong. ${error.message}`,
    });
    setStatus("Error - please try again");
  }
});

clearBtn.addEventListener("click", () => {
  chat.innerHTML = "";
  conversation.splice(1);
  setStatus("Ready");
});

promptInput.addEventListener("input", () => {
  promptInput.style.height = "auto";
  promptInput.style.height = `${promptInput.scrollHeight}px`;
});

addMessage({
  role: "assistant",
  text: "Hi! I'm @NLS. Ask me anything, and I'll answer using the Gemini API.",
});
