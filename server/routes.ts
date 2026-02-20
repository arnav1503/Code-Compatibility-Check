import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

// ================= KNOWLEDGE =================

const science: Record<string, string> = {
    "gravity": "Force that pulls objects toward Earth.",
    "photosynthesis": "Plants make food using sunlight.",
    "atom": "Smallest unit of matter.",
    "energy": "Ability to do work."
};

const grammar: Record<string, string> = {
    "noun": "Naming word.",
    "verb": "Action word.",
    "adjective": "Describes a noun."
};

const countries: Record<string, any> = {
    "india": {"capital":"New Delhi","population":1428000000,"gdp":3.7},
    "china": {"capital":"Beijing","population":1412000000,"gdp":17.7},
    "usa": {"capital":"Washington D.C.","population":331000000,"gdp":26.9}
};

const facts = [
    "Earth revolves around the Sun.",
    "Humans have 206 bones.",
    "Water boils at 100 degrees Celsius."
];

const OWNER_INFO = `My owner is Arnav Raj Singh.
Born on 15 March.
A visionary child who loves coding.
Dev Supreme 👑`;

async function processMessage(msg: string): Promise<string> {
    const q = msg.toLowerCase();

    if (["exit", "quit", "bye"].includes(q)) {
        return "Goodbye Dev Supreme 👑";
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
            return `${c.charAt(0).toUpperCase() + c.slice(1)} | Capital: ${d.capital} | GDP: $${d.gdp}T`;
        }
    }

    // KNOWLEDGE
    for (const db of [science, grammar]) {
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
