const inputBox = document.querySelectorAll(".inputField input");
const addBtn = document.querySelectorAll(".inputField button");
const lista = document.querySelectorAll(".lista");
const deleteAllBtn = document.querySelectorAll(".footer button");
const pendingTasksNumb = document.querySelectorAll('.pendingTasks');

const compras = {
    get secao() {
        return ['refrigerados', 'higiene', 'limpeza', 'mantimentos', 'hortifruit']
    },
    lista(i) {
        return this[this.secao[i]];
    },
    items(i) {
        const items = [];
        this.lista(i).forEach(it => {
            items.push(it.item);
        });
        return items;
    },
    checks(i) {
        const checks = [];
        this.lista(i).forEach(it => {
            checks.push(it.check);
        });
        return checks;
    },
    addItem(i, item) {
        this.lista(i).push({
            item: item,
            check: false
        });
    },
    delItem(i, item) {
        this.lista(i).splice(item, 1);
    },
    checkItem(i, item, val) {
        this.lista(i)[item].check = val;
    },
    clearList(i) {
        this[this.secao[i]] = [];
    },
    loadLists(i, lista) {
        this[this.secao[i]] = lista;
    },
    get allLists() {
        return [
            this.lista(0),
            this.lista(1),
            this.lista(2),
            this.lista(3),
            this.lista(4),
        ];
    },
    refrigerados: [],
    higiene: [],
    limpeza: [],
    mantimentos: [],
    hortifruit: []
};

document.addEventListener('DOMContentLoaded', () => {
    let getLocalStorageData = localStorage.getItem('tasks');
    if (getLocalStorageData) {
        getLocalStorageData = JSON.parse(getLocalStorageData);
        getLocalStorageData.forEach((l, i) => {
            compras.loadLists(i, l);
            showTasks(i);
        });
    } else {
        return;
    }
});


inputBox.forEach((input, index) => {
    input.addEventListener('input', () => {
        if (input.value.trim().length) {
            addBtn[index].disabled = false;
        } else {
            addBtn[index].disabled = true;
        }
    });
});


addBtn.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        compras.addItem(index, inputBox[index].value);
        inputBox[index].value = '';
        btn.disabled = true;
        showTasks(index);
    });
});


function showTasks(list) {

    if (compras.items(list).length > 0) {
        deleteAllBtn[list].disabled = false;
    } else {
        deleteAllBtn[list].disabled = true;
    }
    let newLiTag = "";
    compras.items(list).forEach((element, index) => {
        newLiTag += `<li class="list-group-item"><input type="checkbox" class="boxes" id="box${list}${index}" name="box${list}${index}" onchange="check(this,${list},${index});"><label for="box${list}${index}"> ${element}</label><span class="icon" onclick="deleteTask(${list},${index})">  🗑</span></li>`;
    });
    lista[list].innerHTML = newLiTag;
    lista[list].querySelectorAll('.boxes').forEach((e, i) => {
        e.checked = compras.checks(list)[i];
        compras.checkItem(list, i, e.checked);
        if (e.checked) {
            document.querySelector(`label[for=${e.id}]`).style.textDecoration = "line-through";
        }
    })
    updatePendingTasks(list);
}

function check(that, list, item) {
    if (that.checked) {
        document.querySelector(`label[for=${that.id}]`).style.textDecoration = "line-through";
    } else {
        document.querySelector(`label[for=${that.id}]`).style.textDecoration = "none";
    }
    compras.checkItem(list, item, that.checked);
    updatePendingTasks(list);
}



function deleteTask(lista, index) {
    compras.delItem(lista, index);
    showTasks(lista);
}


deleteAllBtn.forEach((del, index) => {
    del.addEventListener('click', () => {
        compras.clearList(index);
        showTasks(index)
    });
});


function updatePendingTasks(index) {
    pendingTasksNumb[index].textContent = compras.checks(index).filter(item => item == false).length;
    localStorage.setItem('tasks', JSON.stringify(compras.allLists));
}
