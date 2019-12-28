class Tool {
    constructor(setting) {
        this.name = setting.name;
    }
    apply() {

    }
}

class Service {
    constructor(setting) {
        this.name = setting.name;
        this.disable = setting.disable || false;
    }
    collapseMenu(mainMenu, e) {
        mainMenu.isExpand = false;
        document.getElementById('context-menu').innerHTML = '';
    }
}

class FileSystem extends Service {
    constructor(setting) {
        super(setting);
    }
    get docTemplate() {
        const doc = document.createElement('div');
        
        doc.className = 'doc'
        doc.innerHTML = '<div class="context"><div class="editor" contenteditable="true" spellcheck="true"></div></div>';
        return doc;
    }
    execute(service) {
        switch (service.name) {
            case 'new':
                service.create();
                break;
            case 'open':
                service.read();
                break;
            case 'close':
                service.delete();
                break;
            case 'save':
                service.store();
                break;
            default:
                break;
        }
    }
    create() {
        const docs = document.getElementsByClassName('doc');
        const doceditor = document.getElementById('doceditor');
        let editor;

        if (docs[0]) {
            for (let i = 0; i < docs.length; ++i) {
                docs[i].remove();
            }
            doceditor.appendChild(this.docTemplate);
        } else {
            doceditor.appendChild(this.docTemplate);
        }
        editor = document.getElementsByClassName('editor')[0]
        editor.focus();
    }
    read() {

    }
    store() {

    }
    delete() {
        const docs = document.getElementsByClassName('doc');
        
        if (docs[0]) {
            for (let i = 0; i < docs.length; ++i) {
                docs[i].remove();
            }
        }
    }
}

class Menu {
    constructor(setting) {
        this.name = setting.name;
        this.isExpand = false;
        this.items = setting.items;
        this.context = setting.context || 'context-menu';
        this.top = setting.top || 0;
        this.left = setting.left || 0;
    }
    get template() {
        return `<ul class="menu">
            ${this.items.reduce((str, item) => str += `<li class="${item.disable ? 'disable' : ''}" id="${item.name}">${item.name.replace(/^\w/, c => c.toUpperCase())}</li>`, '')}
        </ul>`
    }
}

class MainMenu extends Menu {
    constructor(setting) {
        super(setting);
    }
    expandMenu(menu, e) {
        const ctx = document.getElementById(menu.context);

        if (menu.isExpand) {
            menu.isExpand = false;
            ctx.innerHTML = '';
        } else {
            // adjust context panel position and show
            menu.isExpand = true;
            ctx.style.top = e.target.offsetTop * 2 + e.target.offsetHeight + 'px';
            ctx.style.left = e.target.offsetLeft + 'px';
            ctx.innerHTML = menu.template;
            menu.items.forEach(item => {
                if (!item.disable) {
                    document.getElementById(item.name).addEventListener('click', item.collapseMenu.bind(null, menu));
                    document.getElementById(item.name).addEventListener('click', item.execute.bind(null, item));
                }
            });
        }
    }
}

class SubMenu extends Menu {
    constructor(setting) {
        super(setting);
    }
}

class ContextMenu extends Menu {
    constructor(setting) {
        super(setting);
    }
}

class DocumentEditorManager {
    constructor(setting) {
        this.fontSizeList = setting.fontSizeArr || [12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
        this.menus = setting.menus || [
            new MainMenu({name: 'file', items: [
                new FileSystem({name: 'new'}),
                new FileSystem({name: 'open', disable: true}),
                new FileSystem({name: 'close'}),
                new FileSystem({name: 'save', disable: true})
            ]})
        ];
    }
    init() {
        // add tools function
        const tools = document.getElementsByClassName('tool');

        for (let i = 0; i < tools.length; ++i) {
            tools[i].addEventListener('click', e => {
                const editor = document.getElementsByClassName('editor');
                document.execCommand(tools[i].id, false, tools[i].dataset.value);
                editor[editor.length - 1].focus();
            })
        }
        // create main menu bar view
        document.getElementById('menu-bar').innerHTML = this.menus.reduce((str, menu) => {
            return str += `<li class="menu-item">
                <button id="${menu.name}">
                    ${menu.name.replace(/^\w/, c => c.toUpperCase())}
                </button>
            </li>`
        }, '');
        this.menus.forEach(menu => {
            document.getElementById(menu.name).addEventListener('click', menu.expandMenu.bind(null, menu));
        });
        
    }
}

let manager = new DocumentEditorManager({});

manager.init();