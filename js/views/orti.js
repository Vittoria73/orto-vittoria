import Store from '../store.js';

const OrtiView = {
    render() {
        const areas = Store.getAreas();
        
        let html = `
            <div class="view-header">
                <button id="back-to-home" class="btn-icon"><i class="fa-solid fa-arrow-left"></i></button>
                <h2>I Miei Orti</h2>
            </div>
            
            <div class="areas-list">
                ${areas.length === 0 ? '<p class="empty-msg">Non hai ancora aggiunto delle aree. Usa il tasto + per iniziare!</p>' : ''}
                ${areas.map(area => this.areaCard(area)).join('')}
            </div>

            <div class="add-container">
                <button id="open-add-area" class="btn-full">Aggiungi un Orto +</button>
            </div>

            <div id="modal-area" class="modal hidden">
                <div class="modal-content">
                    <h3>Nuova Area Orto</h3>
                    <div class="form-group">
                        <label>Nome (es. Rialzato 1)</label>
                        <input type="text" id="area-name" placeholder="Inserisci nome...">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Lunghezza (m)</label>
                            <input type="number" id="area-len" step="0.1" placeholder="0.0">
                        </div>
                        <div class="form-group">
                            <label>Larghezza (m)</label>
                            <input type="number" id="area-wid" step="0.1" placeholder="0.0">
                        </div>
                    </div>
                    <div id="area-calc" class="calc-preview">Superficie: 0.0 m²</div>
                    <div class="form-group">
                        <label>Mese/Anno Installazione</label>
                        <input type="month" id="area-date">
                    </div>
                    <div class="modal-actions">
                        <button id="close-modal" class="btn-text">Annulla</button>
                        <button id="save-area" class="btn-primary">Salva</button>
                    </div>
                </div>
            </div>
        `;

        return html;
    },

    areaCard(area) {
        const m2 = (area.length * area.width).toFixed(1);
        return `
            <div class="area-item-card">
                <div class="area-info">
                    <h4>${area.name}</h4>
                    <p>${area.length}m x ${area.width}m (${m2} m²)</p>
                    <span class="area-date">Installato: ${area.date}</span>
                </div>
                <button class="btn-view-history" data-id="${area.id}">Vedi Storico</button>
            </div>
        `;
    },

    initEvents() {
        // Logica per i pulsanti... (verrà chiamata da app.js)
    }
};

export default OrtiView;
