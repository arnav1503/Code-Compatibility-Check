import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

// ================= KNOWLEDGE =================

const science: Record<string, string> = {
    "gravity": "Force that pulls objects toward Earth.",
    "photosynthesis": "Plants make food using sunlight.",
    "atom": "Smallest unit of matter. Consists of protons, neutrons, and electrons.",
    "energy": "Ability to do work. It comes in many forms like kinetic, potential, and thermal.",
    "dna": "Deoxyribonucleic acid, the molecule that carries genetic instructions.",
    "speed of light": "Approximately 299,792,458 meters per second.",
    "black hole": "A region of spacetime where gravity is so strong that nothing can escape.",
    "periodic table": "A tabular display of the chemical elements, organized by atomic number.",
    "cell": "The basic structural, functional, and biological unit of all known organisms."
};

const grammar: Record<string, string> = {
    "noun": "Naming word for a person, place, thing, or idea.",
    "verb": "Action word or state of being.",
    "adjective": "Describes or modifies a noun.",
    "adverb": "Describes or modifies a verb, adjective, or another adverb.",
    "pronoun": "A word that takes the place of a noun.",
    "preposition": "Shows relationship between a noun/pronoun and another part of the sentence.",
    "conjunction": "Joins words, phrases, or clauses together.",
    "interjection": "A word or phrase used to express strong emotion."
};

const geography: Record<string, string> = {
    "mount everest": "The highest mountain on Earth, located in the Himalayas.",
    "amazon river": "The largest river by discharge volume of water in the world.",
    "pacific ocean": "The largest and deepest of Earth's oceanic divisions.",
    "sahara desert": "The largest hot desert in the world, located in Africa.",
    "nile": "Longest river in Africa, historically considered the longest in the world."
};

const countries: Record<string, any> = {
    "india": {"capital":"New Delhi","population":1428000000,"gdp":3.7, "currency": "Indian Rupee"},
    "china": {"capital":"Beijing","population":1412000000,"gdp":17.7, "currency": "Yuan"},
    "usa": {"capital":"Washington D.C.","population":331000000,"gdp":26.9, "currency": "US Dollar"},
    "uk": {"capital":"London","population":67000000,"gdp":3.1, "currency": "Pound Sterling"},
    "germany": {"capital":"Berlin","population":83000000,"gdp":4.4, "currency": "Euro"},
    "japan": {"capital":"Tokyo","population":125000000,"gdp":4.2, "currency": "Yen"},
    "france": {"capital":"Paris","population":68000000,"gdp":3.0, "currency": "Euro"},
    "brazil": {"capital":"Brasilia","population":214000000,"gdp":2.1, "currency": "Real"}
};

const facts = [
    "Earth revolves around the Sun.",
    "Humans have 206 bones.",
    "Water boils at 100 degrees Celsius.",
    "Honey never spoils. Archaeologists have found edible honey in ancient Egyptian tombs.",
    "Octopuses have three hearts.",
    "Bananas are berries, but strawberries aren't.",
    "A day on Venus is longer than a year on Venus.",
    "The heart of a shrimp is located in its head.",
    "It is impossible for most people to lick their own elbow."
];

const OWNER_INFO = `My owner is Arnav Raj Singh.
Born on 15 March.
A visionary child who loves coding.
Dev Supreme 👑`;

const SKILLS = [
  "Voice Interaction (Speak & Listen)",
  "Complex Math Calculations",
  "Country Data (Capital, Population, GDP, Currency)",
  "Science & Grammar Knowledge",
  "Geography Facts",
  "Learning New Information (X is Y)",
  "Random Fun Facts"
];

async function processMessage(msg: string): Promise<string> {
    const q = msg.toLowerCase();

    if (["exit", "quit", "bye"].includes(q)) {
        return "Goodbye Dev Supreme 👑";
    }

    if (q.includes("skill") || q.includes("what can you do")) {
      return "I have many skills! I can help with: " + SKILLS.join(", ") + ".";
    }

    // OWNER
    const ownerKeys = ["owner","creator","who made you","who created you","arnav"];
    if (ownerKeys.some(k => q.includes(k))) {
        return OWNER_INFO;
    }

    // COUNTRY
    for (const c in countries) {
        if (q.includes(c)) {
            const d = countries[c];
            if (q.includes("capital")) return `The capital of ${c.charAt(0).toUpperCase() + c.slice(1)} is ${d.capital}.`;
            if (q.includes("population")) return `${c.charAt(0).toUpperCase() + c.slice(1)} population is ${d.population.toLocaleString()}.`;
            if (q.includes("gdp")) return `${c.charAt(0).toUpperCase() + c.slice(1)} GDP is $${d.gdp}T.`;
            if (q.includes("currency")) return `The currency of ${c.charAt(0).toUpperCase() + c.slice(1)} is ${d.currency}.`;
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
        if (["+", "-", "*", "/"].some(op => q.includes(op))) {
            const sanitized = q.replace(/[^0-9+\-*/(). ]/g, '');
            if (sanitized && sanitized.length >= 3) {
                // simple math evaluation
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
    if (q.includes(" is ")) {
        const parts = q.split(" is ");
        if (parts.length === 2 && parts[0].trim() && parts[1].trim()) {
            await storage.upsertMemory({ key: parts[0].trim(), value: parts[1].trim() });
            return "Learned 📚";
        }
    }

    // FACT
    if (q.includes("fact")) {
        return facts[Math.floor(Math.random() * facts.length)];
    }

    return "I am still learning. Ask something else 🚀";
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
