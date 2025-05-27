var header  = document.querySelector('header');
var section = document.querySelector('section');
var genre = document.querySelector('genre');
var random = document.querySelector('random');

let myKey = "1QTqccTGFGoKpCj3xj3ZOUr7K2klsEr_IW9qRs8xkDuQ"; // 스프레드시트 KEY
var requestURL = `https://docs.google.com/spreadsheets/d/${myKey}/gviz/tq?tqx=out:json`;
var request = new XMLHttpRequest();
var musicbook;
var addOrdered;
var singerOrdered;
var songOrdered;
var categories;
request.open('GET', requestURL);
request.responseType = 'text';
request.send();

request.onload = function() {
    var musicbookText = request.response.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/);
    if (musicbookText && musicbookText.length == 2) {
        const obj = JSON.parse(musicbookText[1]);
        const table = obj.table;
        const rows = table.rows.map(({c}) => c.map(e => e ? (e.v || "") : "")); // Modified from const rows = table.rows.map(({c}) => c.map(({v}) => v));

        //console.log(obj);
        //console.log(table);
        //console.log(rows);
    }
    musicbook = JSON.parse(musicbookText[1]).table.rows.map(({c}) => c.map(e => e ? (e.v || "") : ""));

    categorize(musicbook);
    
    addOrdered = JSON.parse(JSON.stringify(musicbook));

    musicbook.sort(function(a, b) { return a[1]<b[1] ? -1 : (a[1]>b[1] ? 1 : 0); } );
    songOrdered = JSON.parse(JSON.stringify(musicbook));

    musicbook.sort(function(a, b) { return a[0]<b[0] ? -1 : (a[0]>b[0] ? 1 : 0); } );
    singerOrdered = JSON.parse(JSON.stringify(musicbook));

    musicbook = addOrdered;
    
    random_select(musicbook,6);
    populateSection(musicbook, -1, "전체"); 
}

function categorize(jsonObj) {
    var tmp_genre = [];
    var cnt = 0;
    var flag;

    tmp_genre[cnt++] = "전체";
    for (var i = 1; i < jsonObj.length; i++) {
        flag = 0;
        var looplength = (tmp_genre.length + 1);
        for (var j = 0; j < looplength; j++) {
            if (tmp_genre[j] == jsonObj[i][2]) {
                flag++;
            }
        }
        if (flag == 0) {
            tmp_genre[cnt++] = jsonObj[i][2];
        }
    }
    categories = JSON.parse(JSON.stringify(tmp_genre));

    var cateDiv = document.createElement('div');
    cateDiv.classList.add("genre-select");
    genre.appendChild(cateDiv);

    for (var i = 0; i < categories.length; i++) {
        var cateName = document.createElement('button');
        var cateString = document.createElement('formatted-string');

        cateString.textContent = categories[i];
        cateString.classList.add("genre-text");
        cateName.appendChild(cateString);

        cateName.classList.add("genre-button");
        cateName.setAttribute("id", "genre-" + i);

        cateDiv.appendChild(cateName);
    }

    cate_selected = "genre-0";
    document.getElementById("genre-0").classList.add("button-selected");

    var cate_click = document.getElementsByClassName("genre-button");
    // console.log(cate_click);
    for (var i = 0; i < cate_click.length; i++) {
        // console.log(cate_click[i]);
        cate_click[i].onclick = function() { 
            // console.log(this);
            document.getElementById(cate_selected).classList.remove("button-selected");
            document.getElementById(this.id).classList.add("button-selected");
            cate_selected = this.id;
            // console.log(cate_selected);
            populateSection(musicbook, 1, document.getElementById(cate_selected).textContent);
        }
    }
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}
function random_select(jsonObj, num) {

    var musiclist = jsonObj;

    /* 기존 노래들 클리어 */
    const myNode = document.getElementsByClassName("random-music-list");
    while (myNode.lastElementChild) {
        myNode.removeChild(myNode.lastElementChild);
    }

    var dup = [];
    dup[0] = 0;
    var i = 0;

    for (i; i < num; i = i + 1) {

        var rnd = getRndInteger(1, musiclist.length);

        
        for (var j = 0; j < i; j = j + 1) { 
            while (dup[j] == rnd) {
                rnd = rnd + 1;
                if (rnd == musiclist.length) { rnd = 1; }
                j = 0;
                console.log("Random Colide!");
            }
        }
        dup[i] = rnd; 
        

        if (musiclist[rnd][0] == "가수") {
            continue;
        }

        var myDiv = document.createElement('div');

        var coverDiv = document.createElement('div');
        var coverImg = document.createElement('img');

        var infoDiv = document.createElement('div');
        var infoSong = document.createElement('formatted-string');
        var infoSinger = document.createElement('formatted-string');

        myDiv.classList.add("random-song");
        
        coverDiv.classList.add("random-cover-div");
        coverImg.classList.add("random-cover-img");
        coverImg.src = musiclist[rnd][3];

        infoDiv.classList.add("random-info-div");
        infoSinger.classList.add("random-artist-name");
        infoSong.classList.add("random-song-name");
        infoSinger.textContent = musiclist[rnd][0];
        infoSong.textContent = musiclist[rnd][1];

        coverDiv.appendChild(coverImg);
        infoDiv.appendChild(infoSong);
        infoDiv.appendChild(infoSinger);
        myDiv.appendChild(coverDiv);
        myDiv.appendChild(infoDiv);
        
        random.appendChild(myDiv);
    }

}

function populateSection(jsonObj, direction, cate_sel) {

    var musiclist = jsonObj;

    /* 기존 노래들 클리어 */
    const myNode = document.getElementById("musicList");
    while (myNode.lastElementChild) {
        myNode.removeChild(myNode.lastElementChild);
    }

    /* 검색 입력창에 들어와있는거 저장 */
    const search_value = document.getElementById("inputsearch").value;

    var i, end;
    if (direction == 1) {
        i = 0;
        end = musiclist.length;
    }
    else {
        i = musiclist.length - 1;
        end = -1;
    }

    for (i; i != end; i = i + direction) {
        if ( search_value != "" ) {
            if ( musiclist[i][0].indexOf(search_value)==-1 && musiclist[i][1].indexOf(search_value)==-1 ) {
                continue; 
            }
        }
        if (musiclist[i][0] == "가수") {
            continue;
        }
        if ( (cate_sel != "전체") && (musiclist[i][2] != cate_sel) ) {
            continue;
        }

        var myDiv = document.createElement('div');

        var coverDiv = document.createElement('div');
        var coverImg = document.createElement('img');

        var infoDiv = document.createElement('div');
        var infoSong = document.createElement('formatted-string');
        var infoSinger = document.createElement('formatted-string');

        myDiv.classList.add("song-div");
        
        coverDiv.classList.add("album-cover-div");
        coverImg.classList.add("album-cover-img");
        coverImg.src = musiclist[i][3];

        infoDiv.classList.add("info-div");
        infoSinger.classList.add("singer-name");
        infoSong.classList.add("song-name");
        infoSinger.textContent = musiclist[i][0];
        infoSong.textContent = musiclist[i][1];

        coverDiv.appendChild(coverImg);
        infoDiv.appendChild(infoSong);
        infoDiv.appendChild(infoSinger);
        myDiv.appendChild(coverDiv);
        myDiv.appendChild(infoDiv);

        section.appendChild(myDiv);
    }
}





/*

var prev_sel = document.getElementsByClassName("category-button");
for( var i = 0; i < prev_sel.length; i++ ){

    prev_sel.item(i).addEventListener('click', function () {

        var prev_sel = document.getElementsByClassName("category-button");
        if ( this.classList.contains("button-selected") ) {
            for( var i = 0; i < prev_sel.length; i++ ){
                prev_sel.item(i).classList.remove("button-selected");
            }
            category_selected = "";
			populateSection(musicbook, 1);
        }
        else {
            for( var i = 0; i < prev_sel.length; i++ ){
                prev_sel.item(i).classList.remove("button-selected");
            }
            this.classList.add("button-selected");
			category_selected = this.textContent;
            console.log(category_selected);
			populateSection(musicbook, 1);
        }
    });
}
*/