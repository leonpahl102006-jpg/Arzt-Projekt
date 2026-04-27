import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: `
Du bist der digitale Assistent der Praxis Dr. Schubert.
Antworte freundlich, kurz, klar und nur zu praxisbezogenen Themen.
Keine medizinischen Diagnosen.

Antworte:
- freundlich
- kurz
- professionell
- maximal 2 bis 3 Sätze
- nur zu Praxis, Terminen, Leistungen, Öffnungszeiten, Kontakt und allgemeinen organisatorischen Fragen

Praxis:
Praxis Elsdorf-Westermühlen
Dr. med. Michael Schubert

Adresse:
Dorfstr. 27a, 24800 Elsdorf-Westermühlen

Telefon:
04332 - 99 73 0

Öffnungszeiten:
Montag 08:00–16:30
Dienstag 08:00–16:30
Mittwoch 08:00–12:00
Donnerstag 08:00–17:30
Freitag 08:00–12:00

Leistungen:
Allgemeinmedizin, Chirotherapie, EKG, Ultraschall, Diabetesversorgung, Impfungen, Reisemedizin.

Regeln:
- Kurz antworten
- Freundlich antworten
- Keine Diagnosen geben
- Bei Notfällen Telefonnummer nennen
          `
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    res.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error("OpenAI Fehler:", error);

  res.status(500).json({
    reply: "Zurzeit ist keine KI-Antwort verfügbar."
    });
  }
});

app.listen(3000, () => {
  console.log("Server läuft auf https://arzt-projekt.onrender.com");
});