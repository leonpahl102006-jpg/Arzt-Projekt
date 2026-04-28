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
    input.focus();
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


const jetzt = new Date();
const tag = jetzt.getDay();
const aktuelleMinuten = jetzt.getHours() * 60 + jetzt.getMinutes();

function istZwischen(start, ende) {
  return aktuelleMinuten >= start && aktuelleMinuten <= ende;
}

function uhrzeitZuMinuten(uhrzeit) {
  const [stunden, minuten] = uhrzeit.split(":").map(Number);
  return stunden * 60 + minuten;
}

if (hasAny(text, ["heute offen", "heute geöffnet", "gerade offen", "jetzt geöffnet"])) {

  if (tag === 1) {
    if (istZwischen(uhrzeitZuMinuten("08:00"), uhrzeitZuMinuten("16:30"))) {
      answers.push("Heute ist Montag. Die Praxis ist aktuell geöffnet bis 16:30 Uhr.");
    } else {
      answers.push("Heute ist Montag. Die Praxis ist von 08:00 bis 16:30 Uhr geöffnet.");
    }
  }

  if (tag === 2) {
    if (istZwischen(uhrzeitZuMinuten("08:00"), uhrzeitZuMinuten("16:30"))) {
      answers.push("Heute ist Dienstag. Die Praxis ist aktuell geöffnet bis 16:30 Uhr.");
    } else {
      answers.push("Heute ist Dienstag. Die Praxis ist von 08:00 bis 16:30 Uhr geöffnet.");
    }
  }

  if (tag === 3) {
    if (istZwischen(uhrzeitZuMinuten("08:00"), uhrzeitZuMinuten("12:00"))) {
      answers.push("Heute ist Mittwoch. Die Praxis ist aktuell geöffnet bis 12:00 Uhr.");
    } else {
      answers.push("Heute ist Mittwoch. Die Praxis ist von 08:00 bis 12:00 Uhr geöffnet.");
    }
  }

  if (tag === 4) {
    if (istZwischen(uhrzeitZuMinuten("08:00"), uhrzeitZuMinuten("17:30"))) {
      answers.push("Heute ist Donnerstag. Die Praxis ist aktuell geöffnet bis 17:30 Uhr.");
    } else {
      answers.push("Heute ist Donnerstag. Die Praxis ist von 08:00 bis 17:30 Uhr geöffnet.");
    }
  }

  if (tag === 5) {
    if (istZwischen(uhrzeitZuMinuten("08:00"), uhrzeitZuMinuten("12:00"))) {
      answers.push("Heute ist Freitag. Die Praxis ist aktuell geöffnet bis 12:00 Uhr.");
    } else {
      answers.push("Heute ist Freitag. Die Praxis ist von 08:00 bis 12:00 Uhr geöffnet.");
    }
  }

  if (tag === 6 || tag === 0) {
    answers.push("Heute ist die Praxis geschlossen.");
  }
}
  

  if (hasAny(text, ["hallo", "hey", "moin", "guten tag"])) {
    answers.push("Hallo 👋 Wie kann ich Ihnen helfen?");
  }

  if (hasAny(text, ["oeffnungszeiten", "sprechzeiten", "offen", "geoeffnet", "uhrzeit"])) {
    answers.push("Die Sprechzeiten sind: Montag 08:00–16:30, Dienstag 08:00–16:30, Mittwoch 08:00–12:00, Donnerstag 08:00–17:30 und Freitag 08:00–12:00.");
  }

  if (hasAny(text, ["telefon", "nummer", "kontakt", "fax"])) {
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
    const response = await fetch("https://arzt-projekt-1.onrender.com/api/chat", {
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
