import Store from './js/store.js';
import OrtiView from './js/views/orti.js';

const App = {
    homeView: document.getElementById('home-view'),
    dynamicView: document.getElementById('dynamic-view'),
    navItems: document.querySelectorAll('.nav-item'),
    fab: document.getElementById('main-fab'),

    init() {
        // Imposta lo stato iniziale sulla history
        history.replaceState({ view: 'home' }, '', '#home');
        
        // Intercetta il tasto indietro (fisico o gesture) e naviga internamente all'app
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.view) {
                this.showView(event.state.view, false);
            } else {
                this.showView('home', false);
            }
        });

        this.initNavigation();
        this.initHomeButtons();
        
        console.log("App L'orto di Vittoria inizializzata.");
    },

    // Gestione navigazione tra Home e altre sezioni
    showView(viewName, pushHistory = true) {
        const supportedViews = ['home', 'orti'];
        
        if (!supportedViews.includes(viewName)) {
            alert("Funzionalità '" + viewName + "' in arrivo nelle prossime versioni!");
            return;
        }

        if (pushHistory) {
            // Evita di pushare la stessa view se ci siamo già
            if (!history.state || history.state.view !== viewName) {
                history.pushState({ view: viewName }, '', `#${viewName}`);
            }
        }

        if (viewName === 'home') {
            this.homeView.classList.remove('hidden');
            this.dynamicView.classList.add('hidden');
            this.updateActiveNav('home');
        } else if (viewName === 'orti') {
            this.homeView.classList.add('hidden');
            this.dynamicView.classList.remove('hidden');
            this.dynamicView.innerHTML = OrtiView.render();
            this.initOrtiEvents();
        }
    },

    updateActiveNav(viewName) {
        this.navItems.forEach(nav => {
            if (nav.dataset.view === viewName) nav.classList.add('active');
            else nav.classList.remove('active');
        });
    },

    initNavigation() {
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.showView(item.dataset.view);
            });
        });

        this.fab.addEventListener('click', () => {
            alert("Azione rapida: Cosa vuoi aggiungere oggi?");
        });
    },

    initHomeButtons() {
        document.getElementById('btn-orti').addEventListener('click', () => this.showView('orti'));
        document.getElementById('btn-raccolte').addEventListener('click', () => alert("Sezione Raccolte in arrivo!"));
        document.getElementById('btn-meteo').addEventListener('click', () => alert("Registro Meteo Storico: sbloccato al primo collegamento internet!"));
    },

    // Logica specifica per la vista Orti
    initOrtiEvents() {
        const modal = document.getElementById('modal-area');
        
        document.getElementById('back-to-home').addEventListener('click', () => this.showView('home'));
        
        document.getElementById('open-add-area').addEventListener('click', () => {
            modal.classList.remove('hidden');
        });

        document.getElementById('close-modal').addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        // Calcolo m2 in tempo reale
        const lenInput = document.getElementById('area-len');
        const widInput = document.getElementById('area-wid');
        const calcPrev = document.getElementById('area-calc');

        const updateCalc = () => {
            const l = parseFloat(lenInput.value) || 0;
            const w = parseFloat(widInput.value) || 0;
            calcPrev.innerText = `Superficie: ${(l * w).toFixed(1)} m²`;
        };

        lenInput.addEventListener('input', updateCalc);
        widInput.addEventListener('input', updateCalc);

        // Salvataggio
        document.getElementById('save-area').addEventListener('click', () => {
            const name = document.getElementById('area-name').value;
            const length = parseFloat(lenInput.value);
            const width = parseFloat(widInput.value);
            const date = document.getElementById('area-date').value;

            if (!name || !length || !width || !date) {
                alert("Per favore, compila tutti i campi!");
                return;
            }

            Store.addArea({ name, length, width, date });
            modal.classList.add('hidden');
            this.showView('orti', false); // Ricarica la vista senza modificare la history
        });
    }
};

App.init();
