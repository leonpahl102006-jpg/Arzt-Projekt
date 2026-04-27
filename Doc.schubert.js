const input = document.getElementById("user-input");
const button = document.getElementById("send-btn");
const chatMessages = document.getElementById("chat-messages");
const toggleButton = document.getElementById("chat-toggle");
const chatBox = document.getElementById("chat-box");
const chatHint = document.getElementById("chat-hint");

let chatOpen = false;

toggleButton.addEventListener("click", () => {
  chatOpen = !chatOpen;

  if (chatOpen) {
    chatBox.style.display = "flex";
    toggleButton.textContent = "✖";
    chatHint.style.display = "none";
  } else {
    chatBox.style.display = "none";
    toggleButton.textContent = "💬";
    chatHint.style.display = "block";
  }
});

button.addEventListener("click", sendMessage);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  const userText = input.value.trim();

  if (userText === "") return;

  addMessage(userText, "user-message");
  input.value = "";

  const localReply = getBotReply(userText);

  if (localReply) {
    addMessage(localReply, "bot-message");
  } else {
    askServer(userText);
  }
}

function addMessage(text, className) {
  const message = document.createElement("div");
  message.className = className;
  message.textContent = text;

  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotReply(userText) {
  const text = normalizeText(userText);
  const answers = [];

  if (hasAny(text, ["hallo", "hey", "moin", "guten tag"])) {
    answers.push("Hallo 👋 Wie kann ich Ihnen helfen?");
  }

  if (hasAny(text, ["oeffnungszeiten", "sprechzeiten", "offen", "geoeffnet", "uhrzeit"])) {
    answers.push("Die Sprechzeiten sind: Montag 08:00–16:30, Dienstag 08:00–16:30, Mittwoch 08:00–12:00, Donnerstag 08:00–17:30 und Freitag 08:00–12:00.");
  }

  if (hasAny(text, ["telefon", "nummer", "anrufen", "kontakt", "fax"])) {
    answers.push("Sie erreichen die Praxis telefonisch unter 04332 - 99 73 0. Die Faxnummer lautet 04332 - 99 73 33.");
  }

  if (hasAny(text, ["adresse", "standort", "anfahrt", "wo ist", "wo befindet"])) {
    answers.push("Die Praxis befindet sich in der Dorfstr. 27a, 24800 Elsdorf-Westermühlen.");
  }

  if (hasAny(text, ["termin", "terminvereinbarung", "voranmeldung", "buchen"])) {
    answers.push("Um telefonische Terminvereinbarung wird gebeten. Bitte rufen Sie dafür unter 04332 - 99 73 0 an.");
  }

  if (hasAny(text, ["leistung", "leistungen", "angebot", "behandlung"])) {
    answers.push("Die Praxis bietet unter anderem Vorsorgeuntersuchungen, Impfungen, Reisemedizin, kleine Operationen, Chirotherapie, EKG, Ultraschall und diabetische Grundversorgung an.");
  }

  if (hasAny(text, ["notfall", "dringend", "akut", "sofort"])) {
    answers.push("Bei Notfällen kontaktieren Sie bitte direkt die Praxis telefonisch unter 04332 - 99 73 0. In lebensbedrohlichen Notfällen wählen Sie bitte 112.");
  }

  if (answers.length > 0) {
    return removeDuplicates(answers).join("\n\n");
  }

  return null;
}

async function askServer(userText) {
  const waitingMessage = document.createElement("div");
  waitingMessage.className = "bot-message";
  waitingMessage.textContent = "Einen Moment bitte...";
  chatMessages.appendChild(waitingMessage);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const response = await fetch("https://arzt-projekt.onrender.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userText
      })
    });

    console.log("Server Status:", response.status);

    const data = await response.json();
    console.log("Server Antwort:", data);

    waitingMessage.remove();

    if (data.reply) {
      addMessage(data.reply, "bot-message");
    } else {
      addMessage("Der Server hat keine passende Antwort zurückgegeben.", "bot-message");
    }
  } catch (error) {
    console.error("Fetch Fehler:", error);

    waitingMessage.remove();
    addMessage("Der Server konnte nicht erreicht werden. Bitte prüfen Sie die Konsole.", "bot-message");
  }
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss")
    .replace(/[.,!?;:()]/g, "");
}

function hasAny(text, keywords) {
  return keywords.some((keyword) => text.includes(normalizeText(keyword)));
}

function removeDuplicates(array) {
  return [...new Set(array)];
}