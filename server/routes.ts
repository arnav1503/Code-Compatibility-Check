import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

// ================= KNOWLEDGE =================

const science: Record<string, string> = {
    "gravity": "Gravity: The force that pulls objects toward Earth. | Gurutvakarshan: Prithvi ki taraf khinchne wala bal.",
    "gurutvakarshan": "Gurutvakarshan: Prithvi ki taraf khinchne wala bal. | Gravity: The force that pulls objects toward Earth.",
    "photosynthesis": "Photosynthesis: Plants make food using sunlight. | Prakash Sanshleshan: Paudhe suraj ki roshni se khana banate hain.",
    "prakash sanshleshan": "Prakash Sanshleshan: Paudhe suraj ki roshni se khana banate hain. | Photosynthesis: Plants make food using sunlight.",
    "atom": "Atom: Smallest unit of matter. | Parmanu: Padarth ki sabse chhoti ikai.",
    "parmanu": "Parmanu: Padarth ki sabse chhoti ikai. | Atom: Smallest unit of matter.",
    "energy": "Energy: Ability to do work. | Urja: Kaam karne ki kshamta.",
    "urja": "Urja: Kaam karne ki kshamta. | Energy: Ability to do work.",
    "dna": "DNA: Deoxyribonucleic acid, the molecule that carries genetic instructions.",
    "speed of light": "Speed of Light: Approximately 299,792,458 meters per second. | Prakash ki gati: Lagbhag 29,97,92,458 meter prati second.",
    "prakash ki gati": "Prakash ki gati: Lagbhag 29,97,92,458 meter prati second.",
    "black hole": "Black Hole: A region of spacetime where gravity is so strong that nothing can escape.",
    "periodic table": "Periodic Table: A tabular display of the chemical elements.",
    "cell": "Cell: The basic structural, functional, and biological unit of all known organisms. | Koshika: Jeev ki sabse chhoti ikai.",
    "koshika": "Koshika: Jeev ki sabse chhoti ikai. | Cell: The basic structural, functional, and biological unit of all known organisms."
};

const grammar: Record<string, string> = {
    "noun": "Noun: Naming word for a person, place, or thing. | Sangya: Kisi vyakti, vastu ya sthan ka naam.",
    "sangya": "Sangya: Kisi vyakti, vastu ya sthan ka naam. | Noun: Naming word for a person, place, or thing.",
    "verb": "Verb: Action word or state of being. | Kriya: Kaam hone ka pata chalta hai.",
    "kriya": "Kriya: Kaam hone ka pata chalta hai. | Verb: Action word or state of being.",
    "adjective": "Adjective: Describes or modifies a noun. | Visheshan: Sangya ki visheshta batane wale shabd.",
    "visheshan": "Visheshan: Sangya ki visheshta batane wale shabd. | Adjective: Describes or modifies a noun.",
    "adverb": "Adverb: Describes or modifies a verb. | Kriya Visheshan: Kriya ki visheshta batane wale shabd.",
    "kriya visheshan": "Kriya Visheshan: Kriya ki visheshta batane wale shabd. | Adverb: Describes or modifies a verb.",
    "pronoun": "Pronoun: A word that takes the place of a noun. | Sarvanam: Sangya ke sthan par aane wale shabd.",
    "sarvanam": "Sarvanam: Sangya ke sthan par aane wale shabd. | Pronoun: A word that takes the place of a noun.",
    "preposition": "Preposition: Shows relationship between words.",
    "conjunction": "Conjunction: Joins words or phrases together.",
    "interjection": "Interjection: Expresses strong emotion."
};

const geography: Record<string, string> = {
    "mount everest": "Mount Everest: The highest mountain on Earth, located in the Himalayas. | Mount Everest: Duniya ki sabse unchi choti.",
    "amazon river": "Amazon River: The largest river by volume. | Amazon Nadi: Duniya ki sabse badi nadi.",
    "amazon nadi": "Amazon Nadi: Duniya ki sabse badi nadi. | Amazon River: The largest river by volume.",
    "pacific ocean": "Pacific Ocean: The largest and deepest ocean. | Prashant Mahasagar: Duniya ka sabse bada mahasagar.",
    "prashant mahasagar": "Prashant Mahasagar: Duniya ka sabse bada mahasagar. | Pacific Ocean: The largest and deepest ocean.",
    "sahara desert": "Sahara Desert: The largest hot desert. | Sahara Registan: Duniya ka sabse bada registan.",
    "sahara registan": "Sahara Registan: Duniya ka sabse bada registan. | Sahara Desert: The largest hot desert.",
    "nile": "Nile: Longest river in the world. | Neel Nadi: Duniya ki sabse lambi nadi.",
    "neel nadi": "Neel Nadi: Duniya ki sabse lambi nadi. | Nile: Longest river in the world."
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
    "Earth revolves around the Sun. | Prithvi Surya ke charon or ghoomti hai.",
    "Humans have 206 bones. | Manushya ke sharir mein 206 haddiyan hoti hain.",
    "Water boils at 100 degrees Celsius. | Pani 100 degree Celsius par ubalta hai.",
    "Honey never spoils. | Shahad kabhi kharab nahi hota.",
    "Octopuses have three hearts. | Octopus ke teen dil hote hain.",
    "Bananas are berries, but strawberries aren't. | Kela ek berry hai.",
    "A day on Venus is longer than a year on Venus. | Venus par ek din uske ek saal se bada hota hai.",
    "The heart of a shrimp is located in its head. | Shrimp ka dil uske sir mein hota hai.",
    "It is impossible for most people to lick their own elbow."
];

const OWNER_INFO = `My owner is Arnav Raj Singh. Born on 15 March. A visionary child who loves coding. Dev Supreme 👑

Mere malik Arnav Raj Singh hain. Unka janam 15 March ko hua tha. Woh ek pratibhashali bachhe hain jinhe coding pasand hai.`;

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
            // Detect if question is in Hindi
            const isHindi = ["kaun", "kya", "kitni", "rajdhani", "abadi", "mudra", "batao", "hai"].some(k => q.includes(k)) || 
                           ["bharat", "cheen", "amrika"].includes(c);
            
            if (q.includes("capital") || q.includes("rajdhani")) {
              return isHindi ? `${c.charAt(0).toUpperCase() + c.slice(1)} ki rajdhani ${d.capital} hai.` : `The capital of ${c.charAt(0).toUpperCase() + c.slice(1)} is ${d.capital}.`;
            }
            if (q.includes("population") || q.includes("abadi") || q.includes("jansankhya")) {
              return isHindi ? `${c.charAt(0).toUpperCase() + c.slice(1)} ki abadi ${d.population.toLocaleString()} hai.` : `${c.charAt(0).toUpperCase() + c.slice(1)} population is ${d.population.toLocaleString()}.`;
            }
            if (q.includes("gdp")) {
              return isHindi ? `${c.charAt(0).toUpperCase() + c.slice(1)} ki GDP $${d.gdp}T hai.` : `${c.charAt(0).toUpperCase() + c.slice(1)} GDP is $${d.gdp}T.`;
            }
            if (q.includes("currency") || q.includes("mudra")) {
              return isHindi ? `${c.charAt(0).toUpperCase() + c.slice(1)} ki mudra ${d.currency} hai.` : `The currency of ${c.charAt(0).toUpperCase() + c.slice(1)} is ${d.currency}.`;
            }
            return isHindi ? 
                `${c.charAt(0).toUpperCase() + c.slice(1)} | Rajdhani: ${d.capital} | GDP: $${d.gdp}T | Mudra: ${d.currency}` :
                `${c.charAt(0).toUpperCase() + c.slice(1)} | Capital: ${d.capital} | GDP: $${d.gdp}T | Currency: ${d.currency}`;
        }
    }

    // KNOWLEDGE
    for (const db of [science, grammar, geography]) {
        for (const k in db) {
            if (q.includes(k)) {
                const val = db[k];
                // If input key is Hindi, or common Hindi question words are present
                const isHindiInput = ["kaun", "kya", "batao", "hai"].some(word => q.includes(word)) || 
                                   ["gurutvakarshan", "parmanu", "urja", "koshika", "sangya", "kriya", "visheshan", "sarvanam"].some(word => q.includes(word));
                
                // If it's a Hindi key, it should probably return Hindi if possible
                // We'll check if the value itself looks like Hindi (has common words)
                return val; 
            }
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

    // GREETINGS
    const greetings = ["namaste", "hello", "hi", "hey", "hola"];
    if (greetings.some(g => q.startsWith(g) || q.includes(" " + g))) {
        if (q.includes("namaste")) return "Namaste! Kaise hain aap?";
        return "Hi! How are you?";
    }

    if (q.includes("kaise ho") || q.includes("kaise hain") || q.includes("how are you")) {
        if (q.includes("kaise")) return "Main bilkul thik hoon, dhanyavad! Aap kaise hain?";
        return "I am functioning at peak efficiency, thank you! How are you?";
    }

    if (q.includes("thik hoon") || q.includes("badhiya") || q.includes("fine") || q.includes("good")) {
        if (q.includes("thik") || q.includes("badhiya")) return "Yeh sunkar khushi hui! Main aaj aapki kya madad kar sakta hoon?";
        return "Glad to hear that! How can I help you today?";
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
