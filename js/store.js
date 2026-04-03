// store.js - Gestione persistenza dati in LocalStorage

const STORE_KEY = 'orto_vittoria_data';

const defaultData = {
    areas: [],       // { id, name, length, width, date }
    plantTypes: [],  // { id, name, category }
    plantings: []    // { id, areaId, plantId, quantity, startDate, endDate, active }
};

const Store = {
    data: null,

    init() {
        const saved = localStorage.getItem(STORE_KEY);
        if (saved) {
            this.data = JSON.parse(saved);
        } else {
            this.data = defaultData;
            this.save();
        }
    },

    save() {
        localStorage.setItem(STORE_KEY, JSON.stringify(this.data));
    },

    // --- GESTIONE AREE ---
    getAreas() { return this.data.areas; },
    
    addArea(area) {
        area.id = Date.now().toString();
        this.data.areas.push(area);
        this.save();
        return area;
    },

    // --- GESTIONE PIANTE ---
    getPlantTypes() { return this.data.plantTypes; },
    
    // Ritorna le coltivazioni aggregate per una specifica pianta
    getPlantStats(plantId) {
        const history = this.data.plantings.filter(p => p.plantId === plantId);
        const totalQuantity = history.reduce((sum, p) => sum + Number(p.quantity), 0);
        const involvedAreas = [...new Set(history.map(p => {
            const area = this.data.areas.find(a => a.id === p.areaId);
            return area ? area.name : 'Area sconosciuta';
        }))];

        return {
            history,
            totalQuantity,
            involvedAreas
        };
    },

    // Aggiungi una nuova coltivazione
    addPlanting(planting) {
        planting.id = Date.now().toString();
        this.data.plantings.push(planting);
        this.save();
        return planting;
    }
};

// Inizializza subito
Store.init();
export default Store;
