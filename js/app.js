/**
 * Asistente Clínico para Médico Rural (Primer Nivel)
 * Controlador Principal de la Aplicación (SPA)
 */

import { DISEASES } from "./data/diseases.js";
import { SIVIGILA_EVENTS } from "./data/sivigila.js";
import { Store } from "./store.js";
import { SearchEngine } from "./search.js";

// Inicializar motor de búsqueda
const searchEngine = new SearchEngine(DISEASES);

// Estado de la interfaz
let activeFilter = "all";
let activeSivFilter = "all";
let currentDisease = null;
let currentView = "directory";

// Elementos DOM
const elements = {
  // Buscador y filtros
  searchInput: document.getElementById("clinical-search-input"),
  searchClearBtn: document.getElementById("search-clear-btn"),
  filterChips: document.querySelectorAll(".filter-chip[data-filter]"),
  diseaseGrid: document.getElementById("disease-grid"),
  resultsCount: document.getElementById("results-count"),
  resultsFilterBadge: document.getElementById("results-filter-badge"),

  // Navegación de vistas
  navTabs: document.querySelectorAll(".nav-tab-btn"),
  viewDirectory: document.getElementById("view-directory"),
  viewSivigila: document.getElementById("view-sivigila"),
  viewNotes: document.getElementById("view-notes"),

  // Directorio SIVIGILA
  sivigilaSearch: document.getElementById("sivigila-table-search"),
  sivigilaFilterChips: document.querySelectorAll(".filter-chip[data-siv-filter]"),
  sivigilaTableBody: document.getElementById("sivigila-table-body"),

  // Notas globales
  allNotesContainer: document.getElementById("all-notes-container"),

  // Ficha Clínica Modal
  sheetModal: document.getElementById("sheet-modal"),
  modalCloseBtn: document.getElementById("modal-close-btn"),
  modalSivBanner: document.getElementById("modal-sivigila-banner"),
  modalTitle: document.getElementById("modal-disease-title"),
  modalCategory: document.getElementById("modal-disease-category"),
  modalFavBtn: document.getElementById("modal-fav-btn"),
  modalNotesBtn: document.getElementById("modal-notes-btn"),
  modalPrintBtn: document.getElementById("modal-print-btn"),
  modalTriadBox: document.getElementById("modal-triad-box"),
  sheetTabBtns: document.querySelectorAll(".sheet-tab-btn"),
  sheetTabPanes: document.querySelectorAll(".tab-pane"),

  // Paneles de Ficha
  tabOverviewDef: document.getElementById("tab-overview-def"),
  tabOverviewEpidem: document.getElementById("tab-overview-epidem"),
  tabOverviewExtra: document.getElementById("tab-overview-extra"),
  tabSymptomsList: document.getElementById("tab-symptoms-list"),
  tabRedFlagsList: document.getElementById("tab-red-flags-list"),
  tabDiagContext: document.getElementById("tab-diag-context"),
  tabDiagTests: document.getElementById("tab-diag-tests"),
  tabDiagCriteria: document.getElementById("tab-diag-criteria"),
  tabZeroTimeline: document.getElementById("tab-zero-timeline"),
  tabZeroWarningsList: document.getElementById("tab-zero-warnings-list"),
  tabTreatmentContent: document.getElementById("tab-treatment-content"),

  // Drawer de notas locales
  notesDrawer: document.getElementById("notes-drawer"),
  notesDrawerClose: document.getElementById("notes-drawer-close"),
  notesDrawerSubtitle: document.getElementById("notes-drawer-subtitle"),
  notesInputStock: document.getElementById("notes-input-stock"),
  notesInputContact: document.getElementById("notes-input-contact"),
  notesInputClinical: document.getElementById("notes-input-clinical"),
  notesSaveStatus: document.getElementById("notes-save-status"),

  // Info Modal & Theme
  infoModal: document.getElementById("info-modal"),
  infoModalBtn: document.getElementById("info-modal-btn"),
  infoModalClose: document.getElementById("info-modal-close"),
  themeToggleBtn: document.getElementById("theme-toggle-btn"),
  themeIcon: document.getElementById("theme-icon"),
  toastContainer: document.getElementById("toast-container"),
  brandLink: document.getElementById("brand-link")
};

// ==========================================================================
// RENDERIZADO DE LA GRILLA DE ENFERMEDADES
// ==========================================================================
function renderDiseaseGrid(diseases) {
  if (!elements.diseaseGrid) return;
  elements.diseaseGrid.innerHTML = "";

  if (diseases.length === 0) {
    elements.diseaseGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3>No se encontraron patologías</h3>
        <p>Intenta con otro término de búsqueda, síntoma o elimina los filtros aplicados.</p>
        <button class="filter-chip active" id="btn-reset-search" style="margin: 0 auto;">Ver todas las patologías</button>
      </div>
    `;
    const resetBtn = document.getElementById("btn-reset-search");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        elements.searchInput.value = "";
        setActiveFilter("all");
      });
    }
    updateResultsMeta(0);
    return;
  }

  const favorites = Store.getFavorites();

  diseases.forEach(d => {
    const isFav = favorites.includes(d.id);
    const note = Store.getNote(d.id);
    const hasNotes = Boolean(note.stock || note.referralContact || note.clinicalNotes);

    const card = document.createElement("article");
    card.className = "disease-card";
    card.setAttribute("data-id", d.id);

    // Badges
    const sivBadgeClass = d.sivigila.isImmediate ? "badge-immediate" : "badge-weekly";
    const sivBadgeText = d.sivigila.isImmediate 
      ? `🚨 Notificación Inmediata (${d.sivigila.code})` 
      : `📋 Semanal (${d.sivigila.code})`;

    card.innerHTML = `
      <div>
        <div class="card-top">
          <div class="card-badges">
            <span class="badge ${sivBadgeClass}">${sivBadgeText}</span>
            <span class="badge badge-category">${d.categoryLabel}</span>
          </div>
          <button class="fav-btn ${isFav ? 'active' : ''}" data-fav-id="${d.id}" title="${isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
            ★
          </button>
        </div>

        <h3 class="card-title" style="margin: 0.75rem 0 0.4rem 0;">${d.name}</h3>
        <p class="card-desc">${d.definition}</p>

        ${d.triad ? `
          <div class="card-triad-preview" style="margin-top: 0.75rem;">
            <strong>${d.triad.title}</strong>
            ${d.triad.components[0]}
          </div>
        ` : ''}
      </div>

      <div class="card-footer">
        <div>
          ${hasNotes ? `
            <span class="has-notes-indicator" title="Tiene notas de farmacia registradas">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Notas guardadas
            </span>
          ` : '<span style="color: var(--text-light); font-size: 0.75rem;">Sin notas locales</span>'}
        </div>
        <button class="btn-open-sheet" data-open-sheet="${d.id}">
          Ver Ficha Completa
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    `;

    // Eventos de la tarjeta
    const favBtn = card.querySelector(`[data-fav-id="${d.id}"]`);
    if (favBtn) {
      favBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isNow = Store.toggleFavorite(d.id);
        favBtn.classList.toggle("active", isNow);
        showToast(isNow ? `⭐ Agregado a favoritos del turno` : `Removido de favoritos`);
        if (activeFilter === "favoritos") {
          performSearch();
        }
      });
    }

    const openBtn = card.querySelector(`[data-open-sheet="${d.id}"]`);
    if (openBtn) {
      openBtn.addEventListener("click", () => openSheetModal(d.id));
    }

    card.addEventListener("click", (e) => {
      if (e.target.closest(".fav-btn") || e.target.closest(".btn-open-sheet")) return;
      openSheetModal(d.id);
    });

    elements.diseaseGrid.appendChild(card);
  });

  updateResultsMeta(diseases.length);
}

function updateResultsMeta(count) {
  if (!elements.resultsCount) return;
  const filterNames = {
    all: "todas las patologías",
    sivigila_inmediato: "eventos SIVIGILA Inmediatos (<24h)",
    urgencias: "urgencias y minuto cero",
    infecciosas: "enfermedades infecciosas / tropicales",
    favoritos: "favoritos del turno"
  };

  elements.resultsCount.textContent = `Mostrando ${count} ${count === 1 ? 'patología' : 'patologías'} (${filterNames[activeFilter] || 'filtradas'})`;
}

// ==========================================================================
// BÚSQUEDA Y FILTRADO
// ==========================================================================
function performSearch() {
  const query = elements.searchInput.value;
  elements.searchClearBtn.classList.toggle("visible", Boolean(query));
  const results = searchEngine.search(query, activeFilter);
  renderDiseaseGrid(results);
}

function setActiveFilter(filter) {
  activeFilter = filter;
  elements.filterChips.forEach(chip => {
    chip.classList.toggle("active", chip.dataset.filter === filter);
  });
  performSearch();
}

// ==========================================================================
// MODAL DE FICHA CLÍNICA ESTRUCTURADA
// ==========================================================================
export function openSheetModal(diseaseId) {
  const d = DISEASES.find(item => item.id === diseaseId);
  if (!d) return;

  currentDisease = d;
  Store.addToHistory(d.id);

  // 1. Banner SIVIGILA
  const isImm = d.sivigila.isImmediate;
  elements.modalSivBanner.className = `sivigila-banner ${isImm ? 'banner-immediate' : 'banner-weekly'}`;
  elements.modalSivBanner.innerHTML = `
    <div class="sivigila-banner-left">
      <span class="sivigila-pill">${isImm ? 'Alerta SIVIGILA Inmediata' : 'Reporte SIVIGILA Semanal'}</span>
      <strong>Código INS: ${d.sivigila.code}</strong> &bull; ${d.sivigila.periodicity}
    </div>
    <div style="font-size: 0.78rem; font-weight: 600;">
      ${isImm ? '⏱️ Reporte telefónico/radial &lt; 24h obligatorio' : '📅 Reporte en archivo plano semanal'}
    </div>
  `;

  // 2. Cabecera
  elements.modalTitle.textContent = d.name;
  elements.modalCategory.textContent = `${d.categoryLabel} &bull; Urgencia: ${d.urgencyLevel.toUpperCase()}`;

  // Botón favorito en modal
  const isFav = Store.isFavorite(d.id);
  elements.modalFavBtn.classList.toggle("active", isFav);
  elements.modalFavBtn.onclick = () => {
    const isNow = Store.toggleFavorite(d.id);
    elements.modalFavBtn.classList.toggle("active", isNow);
    showToast(isNow ? `⭐ Agregado a favoritos` : `Removido de favoritos`);
    performSearch();
  };

  // Botón notas en modal
  elements.modalNotesBtn.onclick = () => openNotesDrawer(d.id);

  // Botón imprimir
  elements.modalPrintBtn.onclick = () => window.print();

  // 3. Tríada Patognomónica
  if (d.triad) {
    elements.modalTriadBox.style.display = "block";
    elements.modalTriadBox.innerHTML = `
      <div class="triad-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>
        ${d.triad.title}
      </div>
      <ul class="triad-list">
        ${d.triad.components.map(c => `<li>${c}</li>`).join("")}
      </ul>
      ${d.triad.alertText ? `<div class="triad-alert-note">${d.triad.alertText}</div>` : ""}
    `;
  } else {
    elements.modalTriadBox.style.display = "none";
  }

  // 4. Pestaña 1: Definición y Epidemiología
  elements.tabOverviewDef.textContent = d.definition;
  elements.tabOverviewEpidem.textContent = d.epidemiology;

  let extraHtml = "";
  if (d.phases) {
    extraHtml += `
      <div class="content-section" style="margin-top: 1rem;">
        <div class="section-title">Fases Evolutivas de la Enfermedad</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem;">
          ${d.phases.map(p => `
            <div class="content-box" style="border-left: 3px solid var(--primary-600);">
              <strong style="color: var(--primary-800);">${p.name}</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">${p.duration}</div>
              <p style="font-size: 0.85rem;">${p.desc}</p>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }
  if (d.typesInColombia) {
    extraHtml += `
      <div class="content-section" style="margin-top: 1rem;">
        <div class="section-title">Familias y Especies de Serpientes en Colombia</div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${d.typesInColombia.map(t => `
            <div class="content-box">
              <strong style="color: var(--primary-700);">${t.snake} (${t.freq} de casos)</strong>
              <p style="font-size: 0.88rem; margin-top: 0.2rem;">${t.clinic}</p>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }
  elements.tabOverviewExtra.innerHTML = extraHtml;

  // 5. Pestaña 2: Signos, Síntomas & Red Flags
  elements.tabSymptomsList.innerHTML = d.symptoms.map(s => `<li>${s}</li>`).join("");
  elements.tabRedFlagsList.innerHTML = d.redFlags.map(rf => `<li>${rf}</li>`).join("");

  // 6. Pestaña 3: Diagnóstico Rural
  elements.tabDiagContext.textContent = d.diagnosis.ruralContext;
  elements.tabDiagTests.innerHTML = d.diagnosis.tests.map(t => `<li>${t}</li>`).join("");
  elements.tabDiagCriteria.textContent = d.diagnosis.classificationCriteria || d.diagnosis.severityClassification || "";

  // 7. Pestaña 4: Minuto Cero (Acciones Críticas)
  elements.tabZeroTimeline.innerHTML = d.zeroMinute.steps.map(s => `
    <div class="timeline-step">
      <div class="step-number">${s.order}</div>
      <div class="step-content">
        <div class="step-action">${s.action}</div>
        <div class="step-detail">${s.detail}</div>
      </div>
    </div>
  `).join("");

  elements.tabZeroWarningsList.innerHTML = d.zeroMinute.warnings.map(w => `<li>${w}</li>`).join("");

  // 8. Pestaña 5: Tratamiento Escalonado
  let treatHtml = "";
  if (d.treatment.outpatient) {
    treatHtml += `
      <div class="content-section">
        <div class="section-title">Manejo Ambulatorio (Primer Nivel)</div>
        <div class="content-box" style="white-space: pre-line;">${d.treatment.outpatient}</div>
      </div>
    `;
  }
  if (d.treatment.hospitalized) {
    treatHtml += `
      <div class="content-section">
        <div class="section-title">Manejo Hospitalario en Observación de Urgencias</div>
        <div class="content-box" style="white-space: pre-line;">${d.treatment.hospitalized}</div>
      </div>
    `;
  }
  if (d.treatment.antivenomDosing) {
    treatHtml += `
      <div class="content-section">
        <div class="section-title" style="color: var(--alert-primary);">Dosificación de Suero Antiofídico Polivalente INS</div>
        <div class="content-box" style="white-space: pre-line; border-left: 4px solid var(--alert-primary);">${d.treatment.antivenomDosing}</div>
      </div>
    `;
  }
  if (d.treatment.vivaxScheme) {
    treatHtml += `
      <div class="content-section">
        <div class="section-title">Esquema para Plasmodium vivax (Cloroquina + Primaquina)</div>
        <div class="content-box" style="white-space: pre-line;">${d.treatment.vivaxScheme}</div>
      </div>
    `;
  }
  if (d.treatment.falciparumScheme) {
    treatHtml += `
      <div class="content-section">
        <div class="section-title">Esquema para Plasmodium falciparum (Arteméter/Lumefantrina)</div>
        <div class="content-box" style="white-space: pre-line;">${d.treatment.falciparumScheme}</div>
      </div>
    `;
  }
  if (d.treatment.firstLineScheme) {
    treatHtml += `
      <div class="content-section">
        <div class="section-title">Esquema Terapéutico Estandarizado</div>
        <div class="content-box" style="white-space: pre-line;">${d.treatment.firstLineScheme}</div>
      </div>
    `;
  }
  if (d.treatment.antiviralScheme) {
    treatHtml += `
      <div class="content-section">
        <div class="section-title">Terapia Antiviral (Aciclovir)</div>
        <div class="content-box" style="white-space: pre-line;">${d.treatment.antiviralScheme}</div>
      </div>
    `;
  }
  elements.tabTreatmentContent.innerHTML = treatHtml;

  // Reset a la primera pestaña
  switchSheetTab("tab-overview");

  // Mostrar modal
  elements.sheetModal.classList.add("open");
  elements.sheetModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

export function closeSheetModal() {
  elements.sheetModal.classList.remove("open");
  elements.sheetModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function switchSheetTab(targetTabId) {
  elements.sheetTabBtns.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === targetTabId);
  });
  elements.sheetTabPanes.forEach(pane => {
    pane.classList.toggle("active", pane.id === targetTabId);
  });
}

// ==========================================================================
// DRAWER DE NOTAS Y STOCK LOCAL POR PATOLOGÍA
// ==========================================================================
function openNotesDrawer(diseaseId) {
  const d = DISEASES.find(item => item.id === diseaseId);
  if (!d) return;

  elements.notesDrawerSubtitle.textContent = d.name;
  const currentNote = Store.getNote(diseaseId);

  elements.notesInputStock.value = currentNote.stock || "";
  elements.notesInputContact.value = currentNote.referralContact || "";
  elements.notesInputClinical.value = currentNote.clinicalNotes || "";

  // Guardado reactivo en input
  const handleAutoSave = () => {
    Store.saveNote(diseaseId, {
      stock: elements.notesInputStock.value,
      referralContact: elements.notesInputContact.value,
      clinicalNotes: elements.notesInputClinical.value
    });
    elements.notesSaveStatus.style.opacity = "1";
    setTimeout(() => {
      elements.notesSaveStatus.style.opacity = "0.7";
    }, 1500);
  };

  elements.notesInputStock.oninput = handleAutoSave;
  elements.notesInputContact.oninput = handleAutoSave;
  elements.notesInputClinical.oninput = handleAutoSave;

  elements.notesDrawer.classList.add("open");
  elements.notesDrawer.setAttribute("aria-hidden", "false");
}

function closeNotesDrawer() {
  elements.notesDrawer.classList.remove("open");
  elements.notesDrawer.setAttribute("aria-hidden", "true");
  // Actualizar tarjeta en grilla si cambió
  performSearch();
  if (currentView === "notes") {
    renderAllNotesView();
  }
}

// ==========================================================================
// DIRECTORIO SIVIGILA (VISTA DEDICADA)
// ==========================================================================
function renderSivigilaTable() {
  if (!elements.sivigilaTableBody) return;
  const query = (elements.sivigilaSearch?.value || "").toLowerCase().trim();

  let filtered = SIVIGILA_EVENTS.filter(ev => {
    if (activeSivFilter === "immediate" && !ev.isImmediate) return false;
    if (activeSivFilter === "weekly" && ev.isImmediate) return false;
    if (query) {
      return ev.code.includes(query) || ev.name.toLowerCase().includes(query) || ev.description.toLowerCase().includes(query);
    }
    return true;
  });

  elements.sivigilaTableBody.innerHTML = filtered.map(ev => {
    const isImm = ev.isImmediate;
    return `
      <tr>
        <td>
          <span class="badge ${isImm ? 'badge-immediate' : 'badge-weekly'}">
            ${ev.code}
          </span>
        </td>
        <td>
          <strong>${ev.name}</strong>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.15rem;">${ev.description}</div>
        </td>
        <td>
          <span style="font-weight: 700; color: ${isImm ? 'var(--alert-primary)' : 'var(--info-primary)'};">
            ${ev.periodicity}
          </span>
        </td>
        <td>${ev.timeLimit}</td>
        <td>${ev.channel}</td>
        <td>
          ${ev.clinicalSheetId ? `
            <button class="btn-open-sheet" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" data-open-sheet="${ev.clinicalSheetId}">
              Abrir Ficha
            </button>
          ` : `<span style="font-size: 0.75rem; color: var(--text-light);">Normativo</span>`}
        </td>
      </tr>
    `;
  }).join("");

  // Vincular botones de abrir ficha
  elements.sivigilaTableBody.querySelectorAll("[data-open-sheet]").forEach(btn => {
    btn.addEventListener("click", () => {
      openSheetModal(btn.dataset.openSheet);
    });
  });
}

// ==========================================================================
// VISTA: MIS NOTAS Y STOCK GLOBAL
// ==========================================================================
function renderAllNotesView() {
  if (!elements.allNotesContainer) return;
  const allNotes = Store.getAllNotes();
  const diseasesWithNotes = DISEASES.filter(d => {
    const n = allNotes[d.id];
    return n && (n.stock || n.referralContact || n.clinicalNotes);
  });

  if (diseasesWithNotes.length === 0) {
    elements.allNotesContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <h3>No tienes notas registradas aún</h3>
        <p>Abre cualquier ficha clínica y haz clic en el ícono de notas para registrar el stock de farmacia de tu centro de salud o teléfonos de ambulancia local.</p>
        <button class="btn-open-sheet" style="margin: 0 auto;" id="btn-go-to-catalog">Ir al catálogo de patologías</button>
      </div>
    `;
    const btnGo = document.getElementById("btn-go-to-catalog");
    if (btnGo) {
      btnGo.addEventListener("click", () => switchView("directory"));
    }
    return;
  }

  elements.allNotesContainer.innerHTML = diseasesWithNotes.map(d => {
    const n = allNotes[d.id];
    return `
      <article class="disease-card">
        <div>
          <div class="card-top">
            <span class="badge badge-category">${d.categoryLabel}</span>
            <button class="btn-open-sheet" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" data-edit-note="${d.id}">
              Editar Notas
            </button>
          </div>
          <h3 class="card-title" style="margin: 0.5rem 0 0.75rem 0;">${d.name}</h3>

          ${n.stock ? `
            <div style="margin-bottom: 0.6rem;">
              <span class="form-label" style="font-size: 0.7rem; color: var(--primary-700);">📦 Stock en Farmacia:</span>
              <p style="font-size: 0.85rem; background: var(--bg-subtle); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">${n.stock}</p>
            </div>
          ` : ''}

          ${n.referralContact ? `
            <div style="margin-bottom: 0.6rem;">
              <span class="form-label" style="font-size: 0.7rem; color: var(--primary-700);">📞 Contactos de Remisión:</span>
              <p style="font-size: 0.85rem; background: var(--bg-subtle); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">${n.referralContact}</p>
            </div>
          ` : ''}

          ${n.clinicalNotes ? `
            <div>
              <span class="form-label" style="font-size: 0.7rem; color: var(--primary-700);">📝 Notas Clínicas:</span>
              <p style="font-size: 0.85rem; background: var(--bg-subtle); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">${n.clinicalNotes}</p>
            </div>
          ` : ''}
        </div>

        <div class="card-footer">
          <span style="font-size: 0.72rem; color: var(--text-muted);">
            Actualizado: ${n.updatedAt ? new Date(n.updatedAt).toLocaleDateString() : 'Reciente'}
          </span>
          <button class="btn-open-sheet" data-open-sheet="${d.id}">
            Ver Ficha
          </button>
        </div>
      </article>
    `;
  }).join("");

  elements.allNotesContainer.querySelectorAll("[data-edit-note]").forEach(btn => {
    btn.addEventListener("click", () => openNotesDrawer(btn.dataset.editNote));
  });

  elements.allNotesContainer.querySelectorAll("[data-open-sheet]").forEach(btn => {
    btn.addEventListener("click", () => openSheetModal(btn.dataset.openSheet));
  });
}

// ==========================================================================
// CONTROL DE VISTAS (SPA ROUTING)
// ==========================================================================
function switchView(viewName) {
  currentView = viewName;

  elements.navTabs.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });

  elements.viewDirectory.style.display = viewName === "directory" ? "block" : "none";
  elements.viewSivigila.style.display = viewName === "sivigila" ? "block" : "none";
  elements.viewNotes.style.display = viewName === "notes" ? "block" : "none";

  if (viewName === "directory") {
    performSearch();
  } else if (viewName === "sivigila") {
    renderSivigilaTable();
  } else if (viewName === "notes") {
    renderAllNotesView();
  }
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================
function showToast(message) {
  if (!elements.toastContainer) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  elements.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 200);
  }, 2500);
}

// ==========================================================================
// INICIALIZACIÓN Y EVENT LISTENERS
// ==========================================================================
function init() {
  // 1. Configurar tema inicial
  const savedTheme = Store.getTheme();
  Store.setTheme(savedTheme);
  updateThemeIcon(savedTheme);

  elements.themeToggleBtn.addEventListener("click", () => {
    const current = Store.getTheme();
    const next = current === "dark" ? "light" : "dark";
    Store.setTheme(next);
    updateThemeIcon(next);
    showToast(`Modo ${next === 'dark' ? 'Turno Nocturno activado 🌙' : 'Claro activado ☀️'}`);
  });

  function updateThemeIcon(theme) {
    if (theme === "dark") {
      elements.themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
    } else {
      elements.themeIcon.innerHTML = '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>';
    }
  }

  // 2. Buscador en tiempo real
  elements.searchInput.addEventListener("input", performSearch);
  elements.searchClearBtn.addEventListener("click", () => {
    elements.searchInput.value = "";
    elements.searchInput.focus();
    performSearch();
  });

  // 3. Chips de filtro
  elements.filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      setActiveFilter(chip.dataset.filter);
    });
  });

  // 4. Navegación entre vistas
  elements.navTabs.forEach(tab => {
    tab.addEventListener("click", () => switchView(tab.dataset.view));
  });

  if (elements.brandLink) {
    elements.brandLink.addEventListener("click", (e) => {
      e.preventDefault();
      switchView("directory");
      setActiveFilter("all");
    });
  }

  // 5. Filtros y búsqueda en directorio SIVIGILA
  elements.sivigilaFilterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      elements.sivigilaFilterChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeSivFilter = chip.dataset.sivFilter;
      renderSivigilaTable();
    });
  });

  if (elements.sivigilaSearch) {
    elements.sivigilaSearch.addEventListener("input", renderSivigilaTable);
  }

  // 6. Modal Ficha Clínica
  elements.modalCloseBtn.addEventListener("click", closeSheetModal);
  elements.sheetModal.addEventListener("click", (e) => {
    if (e.target === elements.sheetModal) closeSheetModal();
  });

  elements.sheetTabBtns.forEach(btn => {
    btn.addEventListener("click", () => switchSheetTab(btn.dataset.tab));
  });

  // 7. Drawer de Notas
  elements.notesDrawerClose.addEventListener("click", closeNotesDrawer);
  elements.notesDrawer.addEventListener("click", (e) => {
    if (e.target === elements.notesDrawer) closeNotesDrawer();
  });

  // 8. Modal de Información
  elements.infoModalBtn.addEventListener("click", () => {
    elements.infoModal.classList.add("open");
  });
  elements.infoModalClose.addEventListener("click", () => {
    elements.infoModal.classList.remove("open");
  });
  elements.infoModal.addEventListener("click", (e) => {
    if (e.target === elements.infoModal) elements.infoModal.classList.remove("open");
  });

  // 9. Atajos de teclado (Esc para cerrar modales, / para buscar)
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (elements.notesDrawer.classList.contains("open")) {
        closeNotesDrawer();
      } else if (elements.sheetModal.classList.contains("open")) {
        closeSheetModal();
      } else if (elements.infoModal.classList.contains("open")) {
        elements.infoModal.classList.remove("open");
      }
    } else if (e.key === "/" && document.activeElement !== elements.searchInput && !elements.sheetModal.classList.contains("open")) {
      e.preventDefault();
      elements.searchInput.focus();
    }
  });

  // 10. Service Worker PWA (Offline)
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(err => {
        console.warn("ServiceWorker no disponible en este contexto:", err);
      });
    });
  }

  // Render inicial
  performSearch();
}

// Ejecutar al cargar el DOM
document.addEventListener("DOMContentLoaded", init);
