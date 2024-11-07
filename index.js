// Model
class FormModel {
    constructor() {
        this.data = {};
    }

    setField(fieldName, value) {
        this.data[fieldName] = value;
    }

    resetFields() {
        this.data = {};
    }

    getData() {
        return this.data;
    }
}

// Klasa bazowa Component
class Component {
    constructor() {
        this.components = [];
    }

    add(component) {
        this.components.push(component);
    }

    render() {
        throw new Error("Method 'render()' must be implemented.");
    }

    reset() {
        this.components.forEach(child => child.reset());
    }
}

// Klasa Header
class Header extends Component {
    constructor(title) {
        super();
        this.title = title;
    }

    render() {
        const header = document.createElement('div');
        header.className = 'header mb-3';
        const heading = document.createElement('h3');
        heading.textContent = this.title;
        header.appendChild(heading);
        return header;
    }
}

// Klasa Footer
class Footer extends Component {
    constructor() {
        super();
    }

    render() {
        const footer = document.createElement('div');
        footer.className = 'footer mt-3';
        const resetButton = new Button('Reset', 'reset');
        const submitButton = new Button('Submit', 'submit');

        footer.appendChild(resetButton.render());
        footer.appendChild(submitButton.render());

        return footer;
    }
}

// Klasa Input
class Input extends Component {
    constructor(placeholder = "", type = "text") {
        super();
        this.placeholder = placeholder;
        this.type = type;
    }

    render() {
        const input = document.createElement('input');
        input.type = this.type;
        input.className = 'form-control mb-2';
        input.placeholder = this.placeholder;
        this.element = input;
        return input;
    }

    reset() {
        if (this.element) {
            this.element.value = '';
        }
    }
}

// Klasa Select
class Select extends Component {
    constructor(name, options = []) {
        super();
        this.name = name;
        this.options = options;
    }

    render() {
        const select = document.createElement('select');
        select.className = 'form-select mb-2';
        select.setAttribute('data-group-name', this.name);

        this.options.forEach(optionValue => {
            const option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionValue;
            select.appendChild(option);
        });

        this.element = select;
        return select;
    }

    reset() {
        if (this.element) {
            this.element.selectedIndex = 0;
        }
    }
}

// Klasa Button
class Button extends Component {
    constructor(label, type = "button") {
        super();
        this.label = label;
        this.type = type;
    }

    render() {
        const button = document.createElement('button');
        button.type = this.type;
        button.className = 'btn btn-secondary me-2';
        button.textContent = this.label;
        this.element = button;
        return button;
    }
}

// Klasa SearchGroup
class SearchGroup extends Component {
    constructor(name, options = []) {
        super();
        this.name = name;
        this.select = new Select(this.name, options);
        this.input = new Input("Search...");
    }

    render() {
        const group = document.createElement('div');
        group.className = 'search-group mb-3';

        group.appendChild(this.select.render());
        group.appendChild(this.input.render());

        return group;
    }

    getValues() {
        return {
            selectValue: this.select.element.value,
            inputValue: this.input.element.value,
        };
    }

    isValid() {
        const { selectValue, inputValue } = this.getValues();
        return selectValue !== '' && inputValue.trim() !== '';
    }

    reset() {
        this.select.reset();
        this.input.reset();
    }
}

// Klasa DateRangeGroup
class DateRangeGroup extends Component {
    constructor(name, options = []) {
        super();
        this.name = name;
        this.select = new Select(name, options);
        this.startDateInput = new Input("Start Date", "date");
        this.endDateInput = new Input("End Date", "date");
    }

    render() {
        const group = document.createElement('div');
        group.className = 'date-range-group mb-3';
        group.appendChild(this.select.render());
        group.appendChild(this.startDateInput.render());
        group.appendChild(this.endDateInput.render());

        return group;
    }

    getValues() {
        return {
            selectValue: this.select.element.value,
            startDate: this.startDateInput.element.value,
            endDate: this.endDateInput.element.value,
        };
    }

    isValid() {
        const { selectValue, startDate, endDate } = this.getValues();
        return (
            selectValue !== '' &&
            startDate.trim() !== '' &&
            endDate.trim() !== ''
        );
    }

    reset() {
        this.select.reset();
        this.startDateInput.reset();
        this.endDateInput.reset();
    }
}

// Klasa Form
class Form extends Component {
    constructor() {
        super();
    }

    render() {
        const form = document.createElement('form');
        this.components.forEach(child => {
            form.appendChild(child.render());
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Zapobiega odświeżaniu strony
        });

        return form;
    }
}

// FormBuilder
class FormBuilder {
    constructor() {
        this.form = new Form();
    }

    addComponent(component) {
        if (!(component instanceof Component)) {
            throw new Error("Component must inherit from the Component class.");
        }
        this.form.add(component);
        return this;
    }

    build() {
        return this.form;
    }
}

// Klasa View (Widok)
class View {
    constructor() {
        this.form = this.createForm();  // Formularz tworzony raz w konstruktorze
        this.formRendered = this.form.render();
    }

    // Tworzymy formularz za pomocą budowniczego
    createForm() {
        const formBuilder = new FormBuilder()
            .addComponent(new Header("Advanced Search Form"))
            .addComponent(new SearchGroup('SearchGroup', ["Name", "Email", "Username"]))
            .addComponent(new DateRangeGroup('DateRangeGroup', ["Order Date", "Delivery Date"]))
            .addComponent(new Footer());

        return formBuilder.build();  // Formularz tworzony raz
    }

    // Renderowanie formularza oraz dodatkowych elementów widoku (np. tabeli)
    render() {
        const container = document.createElement('div');

        // Dodanie formularza do DOM tylko raz
        container.appendChild(this.formRendered);

        // Dodanie elementów dodatkowych (np. tabeli z danymi)
        const dataTable = document.createElement('div');
        dataTable.className = 'data-table mt-3';
        dataTable.textContent = 'Tabela danych do wyświetlenia';
        container.appendChild(dataTable);

        // Dodanie wszystkiego do body
        document.body.appendChild(container);
    }

    // Resetowanie formularza
    reset() {
        this.form.reset();  // Resetowanie formularza
    }

    // Pobieranie danych formularza
    getFormData() {
        return this.form.getData();
    }

    // Metoda pozwalająca przypisać zdarzenia formularza do metod kontrolera
    setOnSubmitCallback(callback) {
        this.formRendered.addEventListener('submit', (e) => {
            e.preventDefault();
            callback();  // Wywołanie metody kontrolera
        });
    }

    setOnResetCallback(callback) {
        this.formRendered.addEventListener('reset', (e) => {
            e.preventDefault();
            callback();  // Wywołanie metody kontrolera
        });
    }

    // Ustawienie nasłuchiwań na zmiany wartości input
    setOnInputChangeCallback(callback) {
        this.formRendered.addEventListener('input', (e) => {
            const input = e.target;
            // Sprawdzamy, czy zmieniony element to input
            if (input.tagName.toLowerCase() === 'input') {
                callback(input.placeholder, input.value);  // Przekazanie placeholdera i wartości
            }
        });
    }

    setOnSelectChangeCallback(callback) {
        this.formRendered.addEventListener('change', (e) => {
            const select = e.target;
            // Sprawdzamy, czy zmieniony element to select
            if (select.tagName.toLowerCase() === 'select') {
                const groupName = select.getAttribute('data-group-name');
                callback(groupName, select.value);  // Przekazanie grupy oraz wybranej wartości
            }
        });
    }
}


// Kontroler
class FormController {
    constructor() {
        this.model = new FormModel();
        this.view = new View();
        this.initialize();
    }

    initialize() {
        this.view.render();  // Renderowanie formularza przez widok

        // Ustawianie metod kontrolera jako callbacków dla formularza
        this.view.setOnSubmitCallback(this.handleSubmit.bind(this));
        this.view.setOnResetCallback(this.handleReset.bind(this));
        this.view.setOnInputChangeCallback(this.handleInputChange.bind(this));
        this.view.setOnSelectChangeCallback(this.handleSelectChange.bind(this));
    }

    // Obsługuje wysłanie formularza
    handleSubmit() {
        const isValid = this.validateForm();
        if (isValid) {
            console.log('Form submitted with data:', this.model.getData());
        } else {
            alert('Form validation failed. Please check your inputs.');
        }
    }

    // Obsługuje resetowanie formularza
    handleReset() {
        this.model.resetFields();
        this.view.reset();  // Resetowanie formularza w widoku
    }

    // Obsługuje zmiany w polach input
    handleInputChange(placeholder, value) {
        this.model.setField(placeholder, value);  // Zmiana wartości w modelu
    }

    // Obsługuje zmiany w polach select
    handleSelectChange(groupName, value) {
        // Zapisujemy wartość `select` dla danej grupy (np. SearchGroup, DateRangeGroup)
        this.model.setField(groupName, value);
    }

    // Walidacja formularza
    validateForm() {
        const groups = this.view.form.components.filter(
            comp => comp instanceof SearchGroup || comp instanceof DateRangeGroup
        );
        for (const group of groups) {
            if (!group.isValid()) {
                return false;
            }
        }
        return true;
    }
}



// Inicjalizacja aplikacji
new FormController();
