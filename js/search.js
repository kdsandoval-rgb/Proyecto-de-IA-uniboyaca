/**
 * Motor de búsqueda predictiva y filtrado clínico
 */

import { Store } from "./store.js";

// Función utilitaria para normalizar texto (elimina tildes, signos y pasa a minúsculas)
export function normalizeText(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export class SearchEngine {
  constructor(diseases) {
    this.diseases = diseases;
    this.index = this.buildIndex(diseases);
  }

  buildIndex(diseases) {
    return diseases.map(disease => {
      const searchTerms = [
        disease.name,
        disease.shortName,
        disease.category,
        disease.categoryLabel,
        disease.sivigila.code,
        disease.sivigila.priorityBadge,
        disease.triad?.title || "",
        ...(disease.triad?.components || []),
        ...(disease.symptoms || []),
        ...(disease.redFlags || []),
        disease.definition,
        ...(disease.zeroMinute?.steps?.map(s => `${s.action} ${s.detail}`) || [])
      ].join(" ");

      return {
        id: disease.id,
        disease,
        normalizedSearchable: normalizeText(searchTerms),
        normalizedName: normalizeText(disease.name),
        normalizedShortName: normalizeText(disease.shortName),
        normalizedSivigilaCode: normalizeText(disease.sivigila.code)
      };
    });
  }

  search(query, activeFilter = "all") {
    const normQuery = normalizeText(query);
    const favorites = Store.getFavorites();

    // 1. Filtrar por categoría o condición especial
    let pool = this.index.filter(item => {
      const d = item.disease;
      switch (activeFilter) {
        case "sivigila_inmediato":
          return d.sivigila.isImmediate === true;
        case "urgencias":
          return d.category === "urgencias" || d.urgencyLevel === "critica";
        case "infecciosas":
          return d.category === "infecciosas";
        case "favoritos":
          return favorites.includes(d.id);
        case "all":
        default:
          return true;
      }
    });

    // 2. Si no hay término de búsqueda, retornar todo el pool
    if (!normQuery) {
      return pool.map(item => item.disease);
    }

    // 3. Dividir consulta en palabras clave
    const tokens = normQuery.split(/\s+/).filter(t => t.length > 0);

    // 4. Evaluar y rankear coincidencias
    const results = [];

    for (const item of pool) {
      let score = 0;
      let allTokensMatch = true;

      for (const token of tokens) {
        if (!item.normalizedSearchable.includes(token)) {
          allTokensMatch = false;
          break;
        }

        // Ponderación por relevancia
        if (item.normalizedShortName === token) {
          score += 100;
        } else if (item.normalizedShortName.startsWith(token)) {
          score += 60;
        } else if (item.normalizedName.includes(token)) {
          score += 40;
        }

        if (item.normalizedSivigilaCode.includes(token)) {
          score += 50;
        }

        if (item.disease.triad && normalizeText(item.disease.triad.title).includes(token)) {
          score += 30;
        }
      }

      if (allTokensMatch) {
        score += 10;
        results.push({ disease: item.disease, score });
      }
    }

    // Ordenar por mayor score descendente
    results.sort((a, b) => b.score - a.score);
    return results.map(r => r.disease);
  }
}
