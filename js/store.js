/**
 * Módulo de almacenamiento y estado local (LocalStorage)
 * Garantiza persistencia 100% offline para notas, stock de farmacia, favoritos e historial.
 */

const STORAGE_KEYS = {
  FAVORITES: "asistente_clinico_favoritos",
  NOTES: "asistente_clinico_notas_v1",
  HISTORY: "asistente_clinico_historial",
  THEME: "asistente_clinico_tema"
};

export const Store = {
  // --- FAVORITOS ---
  getFavorites() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Error al leer favoritos:", e);
      return [];
    }
  },

  isFavorite(id) {
    const favs = this.getFavorites();
    return favs.includes(id);
  },

  toggleFavorite(id) {
    const favs = this.getFavorites();
    const index = favs.indexOf(id);
    let isNowFav = false;
    if (index > -1) {
      favs.splice(index, 1);
      isNowFav = false;
    } else {
      favs.push(id);
      isNowFav = true;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    } catch (e) {
      console.error("Error al guardar favoritos:", e);
    }
    return isNowFav;
  },

  // --- NOTAS Y FARMACIA LOCAL POR PATOLOGÍA ---
  getNote(diseaseId) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
      const allNotes = raw ? JSON.parse(raw) : {};
      return allNotes[diseaseId] || {
        stock: "",
        referralContact: "",
        clinicalNotes: "",
        updatedAt: null
      };
    } catch (e) {
      console.error("Error al leer nota:", e);
      return { stock: "", referralContact: "", clinicalNotes: "", updatedAt: null };
    }
  },

  saveNote(diseaseId, { stock, referralContact, clinicalNotes }) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
      const allNotes = raw ? JSON.parse(raw) : {};
      allNotes[diseaseId] = {
        stock: stock || "",
        referralContact: referralContact || "",
        clinicalNotes: clinicalNotes || "",
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(allNotes));
      return allNotes[diseaseId];
    } catch (e) {
      console.error("Error al guardar nota:", e);
      return null;
    }
  },

  getAllNotes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  },

  // --- HISTORIAL DE CONSULTA RECIENTE (TURNO) ---
  getHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  addToHistory(diseaseId) {
    try {
      let history = this.getHistory();
      // Eliminar si ya existe para moverlo al inicio
      history = history.filter(item => item.diseaseId !== diseaseId);
      history.unshift({
        diseaseId,
        timestamp: new Date().toISOString()
      });
      // Guardar máximo las 10 consultas más recientes
      history = history.slice(0, 10);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error("Error al guardar historial:", e);
    }
  },

  // --- TEMA (MODO TURNO NOCTURNO) ---
  getTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved) return saved;
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  },

  setTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (e) {
      console.error("Error guardando tema:", e);
    }
  }
};
