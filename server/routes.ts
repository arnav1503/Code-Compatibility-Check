import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

// ================= KNOWLEDGE =================

const science: Record<string, string> = {
    "gravity": "Force that pulls objects toward Earth.",
    "gurutvakarshan": "Prithvi ki taraf khinchne wala bal.",
    "photosynthesis": "Plants make food using sunlight.",
    "prakash sanshleshan": "Paudhe suraj ki roshni se khana banate hain.",
    "atom": "Smallest unit of matter. Consists of protons, neutrons, and electrons.",
    "parmanu": "Padarth ki sabse chhoti ikai.",
    "energy": "Ability to do work. It comes in many forms like kinetic, potential, and thermal.",
    "urja": "Kaam karne ki kshamta.",
    "dna": "Deoxyribonucleic acid, the molecule that carries genetic instructions.",
    "speed of light": "Approximately 299,792,458 meters per second.",
    "prakash ki gati": "Lagbhag 29,97,92,458 meter prati second.",
    "black hole": "A region of spacetime where gravity is so strong that nothing can escape.",
    "periodic table": "A tabular display of the chemical elements, organized by atomic number.",
    "cell": "The basic structural, functional, and biological unit of all known organisms.",
    "koshika": "Jeev ki sabse chhoti ikai."
};

const grammar: Record<string, string> = {
    "noun": "Naming word for a person, place, thing, or idea.",
    "sangya": "Kisi vyakti, vastu ya sthan ka naam.",
    "verb": "Action word or state of being.",
    "kriya": "Kaam hone ka pata chalta hai.",
    "adjective": "Describes or modifies a noun.",
    "visheshan": "Sangya ki visheshta batane wale shabd.",
    "adverb": "Describes or modifies a verb, adjective, or another adverb.",
    "kriya visheshan": "Kriya ki visheshta batane wale shabd.",
    "pronoun": "A word that takes the place of a noun.",
    "sarvanam": "Sangya ke sthan par aane wale shabd.",
    "preposition": "Shows relationship between a noun/pronoun and another part of the sentence.",
    "conjunction": "Joins words, phrases, or clauses together.",
    "interjection": "A word or phrase used to express strong emotion."
};

const geography: Record<string, string> = {
    "mount everest": "The highest mountain on Earth, located in the Himalayas.",
    "amazon river": "The largest river by discharge volume of water in the world.",
    "amazon nadi": "Duniya ki sabse badi nadi.",
    "pacific ocean": "The largest and deepest of Earth's oceanic divisions.",
    "prashant mahasagar": "Duniya ka sabse bada mahasagar.",
    "sahara desert": "The largest hot desert in the world, located in Africa.",
    "sahara registan": "Duniya ka sabse bada registan.",
    "nile": "Longest river in Africa, historically considered the longest in the world.",
    "neel nadi": "Duniya ki sabse lambi nadi."
};

const countries: Record<string, any> = {
    "india": {"capital":"New Delhi","population":1428000000,"gdp":3.7, "currency": "Indian Rupee", "hindi": "Bharat"},
    "bharat": {"capital":"Nayi Dilli","population":1428000000,"gdp":3.7, "currency": "Bhartiya Rupaya"},
    "china": {"capital":"Beijing","population":1412000000,"gdp":17.7, "currency": "Yuan", "hindi": "Cheen"},
    "cheen": {"capital":"Beijing","population":1412000000,"gdp":17.7, "currency": "Yuan"},
    "usa": {"capital":"Washington D.C.","population":331000000,"gdp":26.9, "currency": "US Dollar", "hindi": "Amrika"},
    "amrika": {"capital":"Washington D.C.","population":331000000,"gdp":26.9, "currency": "Dollar"},
    "uk": {"capital":"London","population":67000000,"gdp":3.1, "currency": "Pound Sterling"},
    "germany": {"capital":"Berlin","population":83000000,"gdp":4.4, "currency": "Euro"},
    "japan": {"capital":"Tokyo","population":125000000,"gdp":4.2, "currency": "Yen"},
    "france": {"capital":"Paris","population":68000000,"gdp":3.0, "currency": "Euro"},
    "brazil": {"capital":"Brasilia","population":214000000,"gdp":2.1, "currency": "Real"}
};

const facts = [
    "Earth revolves around the Sun.",
    "Prithvi Surya ke charon or ghoomti hai.",
    "Humans have 206 bones.",
    "Manushya ke sharir mein 206 haddiyan hoti hain.",
    "Water boils at 100 degrees Celsius.",
    "Pani 100 degree Celsius par ubalta hai.",
    "Honey never spoils. Archaeologists have found edible honey in ancient Egyptian tombs.",
    "Shahad kabhi kharab nahi hota.",
    "Octopuses have three hearts.",
    "Octopus ke teen dil hote hain.",
    "Bananas are berries, but strawberries aren't.",
    "Kela ek berry hai.",
    "A day on Venus is longer than a year on Venus.",
    "Venus par ek din uske ek saal se bada hota hai.",
    "The heart of a shrimp is located in its head.",
    "Shrimp ka dil uske sir mein hota hai.",
    "It is impossible for most people to lick their own elbow."
];

const OWNER_INFO = `My owner is Arnav Raj Singh.
Born on 15 March.
A visionary child who loves coding.
Dev Supreme 👑

Mere malik Arnav Raj Singh hain.
Unka janam 15 March ko hua tha.
Woh ek pratibhashali bachhe hain jinhe coding pasand hai.`;

const SKILLS = [
  "Voice Interaction (Speak & Listen)",
  "Complex Math Calculations",
  "Country Data (Capital, Population, GDP, Currency)",
  "Science & Grammar Knowledge",
  "Geography Facts",
  "Learning New Information (X is Y)",
  "Random Fun Facts",
  "Hindi Support"
];

async function processMessage(msg: string): Promise<string> {
    const q = msg.toLowerCase();

    if (["exit", "quit", "bye", "alvida"].includes(q)) {
        return "Goodbye Dev Supreme 👑 | Alvida!";
    }

    if (q.includes("skill") || q.includes("what can you do") || q.includes("kya kar sakte ho")) {
      return "I have many skills! I can help with: " + SKILLS.join(", ") + ".";
    }

    // OWNER
    const ownerKeys = ["owner","creator","who made you","who created you","arnav", "malik", "kisne banaya"];
    if (ownerKeys.some(k => q.includes(k))) {
        return OWNER_INFO;
    }

    // COUNTRY
    for (const c in countries) {
        if (q.includes(c)) {
            const d = countries[c];
            const isHindi = ["kaun", "kya", "kitni", "rajdhani", "abadi"].some(k => q.includes(k));
            
            if (q.includes("capital") || q.includes("rajdhani")) {
              return isHindi ? `${c.charAt(0).toUpperCase() + c.slice(1)} ki rajdhani ${d.capital} hai.` : `The capital of ${c.charAt(0).toUpperCase() + c.slice(1)} is ${d.capital}.`;
            }
            if (q.includes("population") || q.includes("abadi") || q.includes("jansankhya")) {
              return isHindi ? `${c.charAt(0).toUpperCase() + c.slice(1)} ki abadi ${d.population.toLocaleString()} hai.` : `${c.charAt(0).toUpperCase() + c.slice(1)} population is ${d.population.toLocaleString()}.`;
            }
            if (q.includes("gdp")) {
              return `${c.charAt(0).toUpperCase() + c.slice(1)} GDP is $${d.gdp}T.`;
            }
            if (q.includes("currency") || q.includes("mudra")) {
              return isHindi ? `${c.charAt(0).toUpperCase() + c.slice(1)} ki mudra ${d.currency} hai.` : `The currency of ${c.charAt(0).toUpperCase() + c.slice(1)} is ${d.currency}.`;
            }
            return `${c.charAt(0).toUpperCase() + c.slice(1)} | Capital: ${d.capital} | GDP: $${d.gdp}T | Currency: ${d.currency}`;
        }
    }

    // KNOWLEDGE
    for (const db of [science, grammar, geography]) {
        for (const k in db) {
            if (q.includes(k)) return db[k];
        }
    }

    // MATH
    try {
        if (["+", "-", "*", "/", "plus", "minus", "multiply", "divide"].some(op => q.includes(op))) {
            let sanitized = q.replace(/plus/g, '+').replace(/minus/g, '-').replace(/multiply/g, '*').replace(/divide/g, '/');
            sanitized = sanitized.replace(/[^0-9+\-*/(). ]/g, '');
            if (sanitized && sanitized.length >= 1) {
                const result = new Function(`return ${sanitized}`)();
                if (!isNaN(result)) {
                  return String(result);
                }
            }
        }
    } catch (e) {
        // ignore math errors
    }

    // MEMORY
    const mem = await storage.getMemory(q);
    if (mem) {
        return mem.value;
    }

    // LEARN
    if (q.includes(" is ") || q.includes(" matlab ")) {
        const separator = q.includes(" is ") ? " is " : " matlab ";
        const parts = q.split(separator);
        if (parts.length === 2 && parts[0].trim() && parts[1].trim()) {
            await storage.upsertMemory({ key: parts[0].trim(), value: parts[1].trim() });
            return q.includes(" matlab ") ? "Samajh gaya! 📚" : "Learned 📚";
        }
    }

    // FACT
    if (q.includes("fact") || q.includes("tathya") || q.includes("jankari")) {
        return facts[Math.floor(Math.random() * facts.length)];
    }

    if (q.includes("namaste") || q.includes("hello") || q.includes("hi")) {
        return "Hi! How are you? | Namaste! Kaise hain aap?";
    }

    if (q.includes("i am fine") || q.includes("main thik hoon") || q.includes("thik hoon")) {
        return "Glad to hear that! How can I help you today? | Yeh sunkar khushi hui! Main aaj aapki kya madad kar sakta hoon?";
    }

    if (q.includes("how are you") || q.includes("kaise ho") || q.includes("kaise hain")) {
        return "I am functioning at peak efficiency, thank you! How are you? | Main bilkul thik hoon, dhanyavad! Aap kaise hain?";
    }

    return "I am still learning. Ask something else 🚀 | Main abhi seekh raha hoon. Kuch aur puchein.";
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post(api.chat.send.path, async (req, res) => {
    try {
      const input = api.chat.send.input.parse(req.body);
      const response = await processMessage(input.message);
      res.json({ response });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return httpServer;
}
