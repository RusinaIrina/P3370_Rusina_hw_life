var df = document.createDocumentFragment();
var par = document.getElementsByClassName('field')[0]; // поле
var ch = document.getElementById('0'); // первая пустая клетка
var interv; // интервал

var w = Math.floor(par.offsetWidth / ch.offsetWidth); // число клеток по ширине
var h = Math.floor(par.offsetHeight / ch.offsetHeight); // число клеток по длине
par.removeChild(ch);

// генерируем поле
var e;
var c = 0; // общее кол-во клеток
for (var i = 0; i < w; ++i) {
    for (var j = 0; j < h; ++j) {
        e = document.createElement('div');
        e.className = 'empty';
        e.id = String(c);
        //e.addEventListener('click', change_class);
        e.addEventListener('mouseover', change_class);
        df.appendChild(e);
        ++c;
    }
}
par.appendChild(df);
//----------------------------------------------

// изменение типа (класса) клетки
function change_class(e) { 
    if (this.className == 'alive')
        this.className = 'empty';
    else
        this.className = 'alive';
}

// начать игру заново
function restart() {
    clearInterval(interv);
    for (i = 0; i < c; ++i) {
        e = document.getElementById(String(i));
        e.className = 'empty';
        e.addEventListener('mouseover', change_class);
    }
}

// начать игру "Жизнь"
function start() {
    for (i = 0; i < c; ++i) {
        e = document.getElementById(String(i));
        e.myData = 0; // создаем новый атрибут
        //e.removeEventListener('click', change_class);
        e.removeEventListener('mouseover', change_class);
        e.addEventListener('mouseover', murder);
        e.addEventListener('mouseout', function() { this.myData = 0 });
    }

    // время одной итерации
    var t = document.getElementById("txt").value;
    if (t < 0.1)
        t = 5;
    t *= 1000;

    interv = setInterval(step, t);
}

// убийство клетки
function murder(e) {
    this.myData = 1;
    setTimeout(check, 2000, this);
}

// проверям увели ли мышку
function check(d) {
    if (d.myData == 1) {
        d.className = 'empty';
        d.myData = 0;
    }
}

// одна итерация
function step() {
    var x, y; // координаты
    var cnt; // счетчик соседей
    
    // пересчитываем типы клеток 
    for (i = 0; i < c; ++i) {
        e = document.getElementById(String(i));
        // находим координаты клетки на поле
        y = e.id % w; // столбец
        x = Math.floor(e.id / w); // строка
        // проверяем ее соседей
        cnt = check_neighbors(x, y);
        if ((e.className == 'empty') && (cnt > 2)) 
            e.newType = 'alive'; // в клетке зародается жизнь
        else if ((e.className == 'alive') && ((cnt < 2) || (cnt > 3)))
            e.newType = 'empty'; // клетка умирает
        else 
            e.newType = e.className;
    }
    
    // меняем состояния клеток
    for (i = 0; i < c; ++i) {
        e = document.getElementById(String(i));
        e.className = e.newType;
    }
}

// проверка соседей
function check_neighbors(x, y) {
    var a = 0;
    var e1;

    if (x - 1 >= 0) {
        // (x - 1; y - 1)
        if (y - 1 >= 0) { 
            e1 = document.getElementById(String((x - 1) * w + y - 1)); 
            if (e1.className == 'alive')
                ++a;
        }

        // (x - 1; y)
        e1 = document.getElementById(String((x - 1) * w + y)); 
        if (e1.className == 'alive')
            ++a;
        
        // (x - 1; y + 1)
        if (y + 1 < w) {
            e1 = document.getElementById(String((x - 1) * w + y + 1)); 
            if (e1.className == 'alive')
                ++a;
        }
    }

    if (y - 1 >= 0) { 
        // (x; y - 1)
        e1 = document.getElementById(String(x * w + y - 1)); 
        if (e1.className == 'alive')
            ++a;

        // (x + 1; y - 1)
        if (x + 1 < h) { 
            e1 = document.getElementById(String((x + 1) * w + y - 1)); 
            if (e1.className == 'alive')
                ++a;
        }
    }

    if (x + 1 < h) { 
        // (x + 1; y)
        e1 = document.getElementById(String((x + 1) * w + y)); 
        if (e1.className == 'alive')
            ++a;

        // (x + 1; y + 1)
        if (y + 1 < h) {
            e1 = document.getElementById(String((x + 1) * w + y + 1)); 
            if (e1.className == 'alive')
                ++a;
        }
    }

    // (x; y + 1)
    if (y + 1 < h) {
        e1 = document.getElementById(String(x * w + y + 1)); 
        if (e1.className == 'alive')
            ++a;
    }

    return a;
}
