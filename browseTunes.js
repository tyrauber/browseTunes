// browseTunes :: HTML 5, 100% Javascript iTunes-like Media Player
//
// browseTunes © 2011 Ty Rauber
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// --------------------------------------------------------------------------



// BUTTON SVGS AND OTHER VARIABLES

var path = window.location.href.substring(0, window.location.href.lastIndexOf("/")+1)
var playBTN = "<svg width='30' class='playBTN' height='30' xmlns='http://www.w3.org/2000/svg'><g><title>Play</title><path id='svg_1' d='m2,4.00003l0.18752,21.37495l23.8125,-11.06249l-23.99994,-10.3125l-0.00008,0.00004z' class='svgbuttons' /></g></svg>"
var pauseBTN = "<svg width='30' class='pauseBTN' height='30' xmlns='http://www.w3.org/2000/svg'><g><title>Pause</title><rect id='svg_1' height='24' width='7' y='3' x='19.5' class='svgbuttons'/><rect id='svg_2' height='24' width='7' y='3' x='3.5' class='svgbuttons'/></g></svg>"
var forwardBTN= "<svg class='forwardBTN' width='25' height='25' xmlns='http://www.w3.org/2000/svg'><title>Forward</title><path id='svg_1' d='m3.040353,2l12.459647,11.745762l-12.6229,9.754238l-0.093317,-5.449152l6.991515,-4.466103l-6.734945,-5.466101l0,-6.118645z' class='svgbuttons'/><rect id='svg_2' height='19.500001' width='4' y='3.25' x='18' class='svgbuttons'/></g></svg>"
var rewindBTN= "<svg class='rewindBTN' width='25' height='25' xmlns='http://www.w3.org/2000/svg'><title>Forward</title><g transform='rotate(-180 12.188549995422363,13)' id='svg_7'><path id='svg_1' d='m3.040353,2l12.459647,11.745762l-12.6229,9.754238l-0.093317,-5.449152l6.991515,-4.466103l-6.734945,-5.466101l0,-6.118645z' class='svgbuttons'/><rect id='svg_2' height='19.500001' width='4' y='3.25' x='18' class='svgbuttons'/></g></g></svg>"
var setup = "<br/>Drag and drop your exported iTunes Library.xml";
var videoWindow = false;
var db;
var library;
var tagInterval = 2;
var currentObj = new Object();


var oldEvt = window.onload; window.onload = function() {
    if (oldEvt) oldEvt(); init();
}
function init(){
    var params = getParams();
    if(params["video"]){
        initVideo(params);
    }else{
        createHTML();
    }

}


function initVideo(params){
    document.body.innerHTML += "<style type='text/css'>"+generateVideoStylesheet()+"</style>";
    document.body.innerHTML += "<div id='xouter'><div id='screen'><video id='mediaPlayer' src='"+params["video"]+"'></video></div></div>";
    intb = false; var interval = setInterval(function(){
        if(!intb){
            intb = true;
            if(document.getElementById('mediaPlayer')){
                clearInterval(interval)
                load(params["id"])
            }
            intb = false;
        }
    }, 100)
}

try {
    if (window.openDatabase) {
        var dbSize = 5 * 1024 * 1024; // 5MB
        db = openDatabase("browseTunes", "1.0", "browseTunes :: HTML 5, 100% Javascript iTunes-like Media Player", dbSize);
        if (!db)
            alert("Failed to open the database on disk.  This is probably because the version was bad or there is not enough space left in this domain's quota");
    } else
        alert("Couldn't open the database.  Please try with a WebKit nightly with this feature enabled");
} catch(err) { }


function createHTML(){
    document.title = "browseTunes :: HTML 5, 100% Javascript iTunes-like Media Player";
    document.body.innerHTML = "<style type='text/css'>"+generateStylesheet()+"</style>";
    document.body.innerHTML += "<div id='header'><a href='#' onclick='rewind()' id='rewindButton'>"+rewindBTN+"</a><a href='#' onclick='play()' id='playButton'>"+playBTN+"</a><a href='#' onclick='forward()' id='forwardButton'>"+forwardBTN+"</a><div id='display'><div id='track_display'></div><div id='artist_display'></div><div id='time_display'></div><div id='time_remaining'></div><div id='progress' style='display:none;' ><a href='#' id='progress_bar' ondrag='scrubPosition(this);'></a></div><div id='logo'><span style='font-style:italic;'>js</span>Tunes</div><div id='player'></div></div><div id='search'><label>Search: </label><input type='text' id='search_field' onchange='searchFor(this.value)'/></div><div id='volume'><label>Volume:</label><a href='#' id='volume_bar' ondrag='changeVolume(this);'></a></div><div id='fileSelection'><input type='file' id='file' /></div></div><div id='content'><div id='maincols'><div id='mainleft'><ul id='genre'><li class='back'><a href='#' id='0' onclick='reloadLibrary(false);'><< Library</a></li></ul></div><div id='maincenter'><ul id='artist'></ul></div><div id='mainright'><ul id='album'></ul></div></div><div id='main'><ul id='track'></ul></div></div><div id='footer'><span style='font-style:italic;'>js</span>Tunes &copy; 2011  <a href='mailto:tyrauber@mac.com'>Ty Rauber</a> :: In loving memory of the original iTunes. </div><br/><br/><br/><div id='log'></div>";
    document.getElementById('content').innerHTML = "<div id='maincols'><div id='mainleft'><ul id='genre'><li class='back'><a href='#' id='0' onclick='reloadLibrary(false);'><< Library</a></li></ul></div><div id='maincenter'><ul id='artist'></ul></div><div id='mainright'><ul id='album'></ul></div></div><div id='main'><ul id='track'></ul></div></div>";
    prepareUploader();

}



function prepareUploader(){
    var content = document.getElementById('content');
    document.getElementById('file').onchange = function() {
        readFile(this.files[0]);
    };
    document.body.ondragenter = function() {
        document.body.style.border = '4px solid #b1ecb3';
        return false;
    };
    document.body.ondragover = function() {
        return false;
    };
    document.body.ondragleave = function() {
        return false;
    };

    document.body.ondrop = function(event) {
        document.body.style.border = '0px solid transparent';
        readFile(event.dataTransfer.files[0]);
        return false;
    };

}


function readFile(file) {

    if(file.type == "text/xml"){
        readXML(file);
    }else if(file.type == "audio/mpeg"){
        document.getElementById('track_display').innerHTML = 'Unable to read ' + file.fileName;
    }else if(file.type == "video/mp4" || file.type == "video/x-m4v" || file.type == "video/quicktime"){
        document.getElementById('track_display').innerHTML = 'Unable to read ' + file.fileName;
    }else{
        document.getElementById('track_display').innerHTML = 'Unable to read ' + file.fileName;
    }
    
}


function readXML(file){
    var reader = new FileReader();
    reader.onload = function(event) {
        loadLibrary(event.target.result);
    };
    reader.onerror = function() {
        document.getElementById('track_display').innerHTML = 'Unable to read ' + file.fileName;
    };
    reader.readAsText(file);
}

function getMigration(type){
    if(type == "genre"){
        var sql = "CREATE TABLE genres (id INTEGER NOT NULL PRIMARY KEY, name TEXT UNIQUE)"
    }else if(type == "artist"){
        var sql = "CREATE TABLE artists (id INTEGER NOT NULL PRIMARY KEY, name TEXT UNIQUE, genre_id INTEGER)"
    }else if(type == "album"){
        var sql =  "CREATE TABLE albums (id INTEGER NOT NULL PRIMARY KEY, name TEXT UNIQUE, genre_id INTEGER, artist_id INTEGER)"
    }else if(type == "track"){
        var sql = "CREATE TABLE tracks (id INTEGER NOT NULL PRIMARY KEY, genre TEXT, genre_id INTEGER, artist TEXT, artist_id INTEGER, album TEXT, album_id INTEGER, name TEXT, time TEXT, number REAL, url TEXT, kind TEXT, width TEXT, height TEXT, permalink TEXT UNIQUE)"
    }
    return sql;
}


function prepareDB(){
    var params = getParams();
    if(params["video"] == null){
        type = ["genre","artist","album","track"]
        for(var x in type){
            migrateDB(type[x])
        }
    }
 
}

function migrateDB(type){
    db.transaction(function(tx) {
        tx.executeSql("SELECT COUNT(*) FROM "+type+"s", [], function(result) {
            reloadLibrary(type)
        }, function(tx, error) {
            document.getElementById('track_display').innerHTML = setup;
            tx.executeSql(getMigration(type), []);
        });

    });
}

function reloadLibrary(type){
    if(!type){type = ["genre", "artist", "album", "track"]}else{type =[type]}
    for(var y in type){
        if(type[y] == "genre"){
            document.getElementById(type[y]).innerHTML ="<li class='back'><a href='#' id='0' onclick='reloadLibrary(false);'><< Library</a></li>"
        }else{
            document.getElementById(type[y]).innerHTML =""
        }
        if(type[y] == "track"){
            loadTracks(false);
        }else{
            loadTags(type[y], false);
        }
    }
}

function loadLibrary(data){
    parser=new DOMParser(); xml=parser.parseFromString(data,"text/xml");
    library = xml.documentElement.childNodes[1].getElementsByTagName("dict");
    document.getElementById("track_display").innerHTML = "Importing iTunes"
    document.getElementById("artist_display").innerHTML = "Please wait while we import your iTunes Library."
    document.getElementById('progress').style.display = "block";
    importTrack(1)
}

function importTrack(i){

    if(i >= library.length){
              
        clearDisplay();
        return;
    }else{
        getTrack(library[i])
        document.getElementById('progress_bar').style.width = ((i / library.length)*100 +"%")
        document.getElementById('time_display').innerHTML = i;
        document.getElementById('time_remaining').innerHTML = "-"+(library.length-i);
    }
    var ib= false;

    if(currentObj && currentObj["name"] != null){
      
        var intv = setInterval(function(){
            if(!ib){
                ib = true;
                if(currentObj && !currentObj["genre_id"]){newTag(currentObj, 'genre');}
                if(currentObj && currentObj["genre_id"] && !currentObj["artist_id"]){newTag(currentObj, 'artist');}
                if(currentObj && currentObj["genre_id"] && currentObj["artist_id"] && !currentObj["album_id"]){newTag(currentObj, 'album');}

                if(currentObj && currentObj["genre_id"]&& currentObj["artist_id"] && currentObj["album_id"]){
                    newTrack(currentObj)
                }
                if(currentObj && currentObj["genre_id"]&& currentObj["artist_id"] && currentObj["album_id"] && currentObj["track_id"]){
                    clearInterval(intv)
                    importTrack(++i)
                }
                ib=false;
            }
        }, tagInterval)
    }else{
        importTrack(++i)
    }

}


function searchFor(string){  
    type = ["genre", "artist", "album", "track"]
    var result = false;
    for(var y in type){
        searchDB(type[y], string)
    }
}

function searchDB(table, string){
    db.readTransaction(function(tx) {
        tx.executeSql("SELECT * FROM "+table+"s WHERE name LIKE '%"+string+"%'", [], function (tx, result) {
            if(result.rows.length != 0){
                select(table+"_"+result.rows.item(0).id, table)

            }
        });
    })
}


db.onSuccess = function(tx, result, currentObj, ul, li) {
    if(result.rows.length == 0){
        currentObj[ul.id+"_id"] = result.insertId;
        ul.appendChild(li.li);
    }
}


db.onError = function(tx, result, currentObj, ul, li){
    if(ul.id == "track"){var name = li.nameField.innerHTML;
    }else{name = li.link.innerHTML;}
    db.readTransaction(function(tx) {
        tx.executeSql('SELECT id FROM '+ul.id+'s WHERE name = ?', [name], function (tx, result) {
            if(result.rows.length != 0){
                currentObj[ul.id+"_id"] =  result.rows.item(0).id;
            }
        });
    })
};

function getTrack(obj){
    var keys = obj.childNodes
    currentObj ={"genre_id": false, "artist_id":false, "album_id":false, "track_id":false, "protected":false, "purchased":false}
    var series= false;
    for(var i=0; i<= keys.length; i++){
        if (keys[i] && keys[i]!=undefined && i >= 1){
            if (keys[i].tagName == "key" && keys[i].hasChildNodes()){
                if (keys[i].textContent == "Genre"){
                    currentObj["genre"] = keys[i+1].textContent
                }
                if (keys[i].textContent == "Movie"){
                    currentObj["genre"] = "Movies";
                }
                if (keys[i].textContent == "Artist"){
                    currentObj["artist"] = keys[i+1].textContent
                }
                if (keys[i].textContent == "Series"){
                    series = true;
                    currentObj["artist"] = keys[i+1].textContent
                }
                if (keys[i].textContent == "Name"){
                    currentObj["name"] = keys[i+1].textContent      
                }
                if (keys[i].textContent == "Album"){
                    currentObj["album"] = keys[i+1].textContent
                }
                if (keys[i].textContent == "Disc Number"){
                    currentObj["album"] = currentObj["album"]+" "+keys[i+1].textContent
                }

                if (keys[i].textContent == "Season"){
                    series = true;
                    currentObj["album"] = "Season "+keys[i+1].textContent
                }

                if (keys[i].textContent == "Total Time"){
                    currentObj["time"] = keys[i+1].textContent
                }
                if (keys[i].textContent == "Track Number"){
                    currentObj["number"] = keys[i+1].textContent
                }
                if (keys[i].textContent == "Location"){

                    var loc = keys[i+1].textContent;
                    currentObj["url"] = loc;
                }
                if (keys[i].textContent == "Protected"){
                    currentObj["protected"] = keys[i+1].tagName
                }
                if (keys[i].textContent == "Purchased"){
                    currentObj["protected"] = keys[i+1].tagName
                }
                if (keys[i].textContent == "Kind"){
                    var kind = keys[i+1].textContent;
                    if(kind== "mpeg audio file" || kind == "MPEG audio file"){
                        currentObj["kind"] = "AUDIO";
                    }else if(kind== "QuickTime movie file" || kind == "MPEG-4 video file"){
                        currentObj["kind"] = "VIDEO";
                    }
                }
                if (keys[i].textContent == "Video Width"){
                    currentObj["width"] = keys[i+1].textContent
                }
                if (keys[i].textContent == "Video Height"){
                    currentObj["height"] = keys[i+1].textContent
                }
            }
        }
    }


    if(series == true){
        currentObj["genre"] = "TV Shows";
        currentObj["album"] = currentObj["artist"]+" - "+currentObj["album"]
    }


    if(!currentObj["protected"] && !currentObj["purchased"] && currentObj["genre"] != undefined  && currentObj["artist"] != undefined && currentObj["album"] != undefined && currentObj["name"] != undefined){
        return currentObj;
    }else{
        currentObj = null;
        return false;
    }

}


function loadTracks(id){
    if(!id){
        var query = "SELECT id, genre, genre_id, artist, artist_id, album, album_id, name, time, number, url, kind, height, width FROM tracks"
    }else{
        id = id.split("_")
        var query = "SELECT id, genre, genre_id, artist, artist_id, album, album_id, name, time, number, url, kind, height, width FROM tracks WHERE "+id[0]+"_id = "+id[1]
    }
    ul = document.getElementById('track')
    db.transaction(function(tx) {
        tx.executeSql(query, [], function(tx, result) {
            for (var i = 0; i < result.rows.length; ++i) {
                var row = result.rows.item(i);
                var track = new Track();
                track._id = row['id'];
                track.id = "track_"+row['id'];
                track.genre = row['genre'];
                track.genre_id = row['genre_id'];
                track.artist = row['artist'];
                track.artist_id = row['artist_id'];
                track.album = row['album'];
                track.album_id = row['album_id'];
                track.name = row['name'];
                track.time = row['time'];
                track.number = row['number'];
                track.url = row['url'];
                track.kind = row['kind'];
                track.height = row['height'];
                track.width = row['width'];
                track.onClick =  track.id;
                
                var cls = "item "+getOddOrEven(track._id)
                cls += " genre_"+track.genre_id+" artist_"+track.artist_id+" album_"+track.album_id
                track.cls = cls;
                ul.appendChild(track.li)
            }


        }, function(tx, error) {
            alert('Failed to retrieve tracks from database - ' + error.message);
            return;
        });
    });

}



function newTrack(obj){
  
    var track = new Track();

    track.name = obj["name"];
    track.genre = obj["genre"];
    track.genre_id = obj["genre_id"];
    track.artist = obj["artist"];
    track.artist_id = obj["artist_id"];
    track.album = obj["album"];
    track.album_id = obj["album_id"];
    track.time = formatTime(obj["time"]/1000);
    track.number = obj["number"];
    track.url = obj["url"];
    track.kind = obj["kind"];
    track.width = obj["width"];
    track.height = obj["height"];
    if(obj["number"] && obj["number"] != undefined && obj["number"] != null){
        track.permalink = track.genre_id+"_"+track.artist_id+"_"+track.album_id+"_"+track.number;
    }else{
        track.permalink = track.genre_id+"_"+track.artist_id+"_"+track.album_id+"_"+makePermalink(track.name);
    }

    var cls = "item "+getOddOrEven(track.order)
    cls += " genre_"+track.genre_id+" artist_"+track.artist_id+" album_"+track.album_id
    track.cls = cls;
    track.saveAsNew();
}

function Track(){

    var ul = document.getElementById('track')

    var self = this;
    var li = document.createElement('li');
    this.li= li;

    var link = document.createElement('a');
    link.setAttribute('href', '#');
    this.link = link;
    li.appendChild(link);

    var name = document.createElement('span');
    name.className = "name";
    this.nameField = name;
    this.link.appendChild(name);

    var artist = document.createElement('span');
    artist.className = "artist";
    this.artistField = artist;
    this.link.appendChild(artist);

    var album = document.createElement('span');
    album.className = "album";
    this.albumField = album;
    this.link.appendChild(album);

    var time = document.createElement('span');
    time.className = "time";
    this.timeField = time;
    this.link.appendChild(time);

    return this;
}



Track.prototype = {

    get _id(){return this.li.getAttribute('_id')},
    set _id(x){this.li.setAttribute('_id',x)},
    get id(){return this.li.id},
    set id(x){this.li.id =x},
    get cls(){return this.li.className},
    set cls(x){this.li.className = x},
    get genre(){return this.link.getAttribute('genre')},
    set genre(x){this.link.setAttribute('genre',x)},
    get artist(){return this.artistField.innerHTML;},
    set artist(x){this.artistField.innerHTML = x;},
    get album(){return this.albumField.innerHTML;},
    set album(x){this.albumField.innerHTML = x;},
    get name(){return this.nameField.innerHTML;},
    set name(x){this.nameField.innerHTML = x;},
    get time(){return this.timeField.innerHTML;},
    set time(x){this.timeField.innerHTML = x},
    get number(){return this.link.getAttribute('number')},
    set number(x){this.link.setAttribute('number', x)},
    get url(){return this.link.getAttribute('rel')},
    set url(x){this.link.setAttribute('rel', x)},
    get kind(){return this.link.getAttribute('kind')},
    set kind(x){this.link.setAttribute('kind', x)},
    get height(){return this.link.getAttribute('height');},
    set height(x){this.link.setAttribute('height', x)},
    get width(){return this.link.getAttribute('width');},
    set width(x){this.link.setAttribute('width', x);},
    
    set onClick(x){this.link.setAttribute('onclick', 'select("'+x+'", "track")');},

    saveAsNew: function(){
        var track = this;
        var ul = document.getElementById('track');
        var query = "INSERT INTO tracks (genre, genre_id, artist, artist_id, album, album_id, name, time, number, url, kind, height, width, permalink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var fields = [track.genre, track.genre_id, track.artist, track.artist_id, track.album, track.album_id, track.name, track.time, track.number, track.url, track.kind, track.height, track.width, track.permalink]

        if(query){
            db.transaction(function (tx, result){

                tx.executeSql(query, fields,
                function (tx, result) {

                    db.onSuccess(tx,result,currentObj,ul,track);
                },
                function (tx, result) {

                    db.onError(tx,result,currentObj,ul,track);
                })});
        }
      
    },
}

function getFields(type){
    if(type == 'genre'){
        var fields = "id, name"
    }else if(type == 'artist'){
        var fields = "id, name, genre_id"
    }else if(type == 'album'){
        var fields = "id, name, genre_id, artist_id"
    }
    return fields;
}

function loadTags(type, id){
    var ul = document.getElementById(type)
    var fields = getFields(type);
    if(!id){
        var query = "SELECT "+fields+" FROM "+type+"s ORDER BY name ASC"
    }else{
        id = id.split("_")
        var query = "SELECT "+fields+" FROM "+type+"s WHERE "+id[0]+"_id = "+id[1]+" ORDER BY name ASC"
    }
    db.transaction(function(tx) {
        tx.executeSql(query, [], function(tx, result) {
            for (var i = 0; i < result.rows.length; ++i) {
                var row = result.rows.item(i);
                var tag = new Tag();
                tag._id = row['id'];
               
                tag.id = type+"_"+row['id'];
                tag.name = row['name'];
                tag.type = type;
                if(row['genre_id']){tag.genre_id = row['genre_id'];}
                if(row['artist_id']){tag.artist_id = row['artist_id'];}
                tag.onClick =  tag.id, type;

                var cls = "item "+getOddOrEven(i)
                if(row['artist_id']){ cls += " genre_"+row['genre_id']+" artist_"+row['artist_id']
                }else if(row['genre_id']){cls += " genre_"+row['genre_id']}
                tag.cls = cls

                ul.appendChild(tag.li)
            }


        }, function(tx, error) {
            alert('Failed to retrieve '+type+' from database - ' + error.message);
            return;
        });
    });
}

function newTag(obj, type){
    var tag = new Tag(type);
    if(type == 'album'){
        tag.genre_id = obj["genre_id"]
        tag.artist_id = obj["artist_id"]
        cls += " genre_"+tag.genre_id+" artist_"+tag.artist_id

    }else if(type == 'artist'){
        tag.genre_id = obj["genre_id"]
        cls += " genre_"+tag.genre_id
    }
    var cls = "item "+getOddOrEven(tag._id)
    var id = type+"_"+tag._id;
    tag.id = id;
    tag.onClick = id;
    tag.type = type;
    tag.name = obj[type]

    tag.cls = cls;
   
    tag.saveAsNew();

}
function Tag(type){
    var self = this;
    var ul = document.getElementById(type)
    var li = document.createElement('li');
    this.li= li;
    var link = document.createElement('a');
    link.setAttribute('href', '#')
    this.link = link;
    li.appendChild(link)
    return this;
}


Tag.prototype = {

    get _id(){return this.li.getAttribute('_id')},
    set _id(x){this.li.setAttribute('_id',x)},
    get id(){return this.li.id},
    set id(x){this.li.id = x},
    get name(){return this.link.innerHTML;},
    set name(x){this.link.innerHTML = x;},
    set onClick(x){this.link.setAttribute('onclick', 'select("'+x+'", "'+this.type+'")');},
    get cls(){return this.li.className},
    set cls(x){this.li.className = x},


    saveAsNew: function(){
        var tag = this;
        var ul =  document.getElementById(this.type);
        if(tag.type== 'genre'){
            var query = "INSERT INTO "+tag.type+"s (name) VALUES (?)";
            var fields = [tag.name]
            
        }else if(tag.type== 'artist'){
            var query = "INSERT INTO "+tag.type+"s (name, genre_id) VALUES (?, ?)";
            var fields = [tag.name, tag.genre_id]
        }else if(tag.type== 'album'){
            var query = "INSERT INTO "+tag.type+"s (name, genre_id, artist_id) VALUES (?, ?, ?)";
            var fields = [tag.name, tag.genre_id, tag.artist_id]
        }
        if(query){
            db.transaction(function (tx, result){
                
                tx.executeSql(query, fields,
                function (tx, result) {
                    
                    db.onSuccess(tx,result,currentObj,ul,tag);
                },
                function (tx, result) {
                 
                    db.onError(tx,result,currentObj,ul,tag);
                })});
        }

    },
}


function getParams(){
    var url = window.location.toString();
    url.match(/\?(.+)$/);
    var p = RegExp.$1;
    var p = p.split("&");
    var params = {};

    for(var i=0;i<p.length;i++){
        var tmp = p[i].split("=");
        params[tmp[0]] = unescape(tmp[1]);
    }
    return params;
}


function formatTime(seconds) {
    seconds = Math.round(seconds);
    minutes = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
}

var isEven = function(someNumber){
    return (someNumber%2 == 0) ? true : false;
};

function getOddOrEven(i){
    if(isEven(i)== true){
        var cls='even'
    }else{
        cls='odd'
    }
    return cls;
}

function getClasses(track, opt){
    var cls ="";
    var lists =["genre","artist","album"]
    for (var x in lists){
        cls += makeID(track[lists[x]])+" ";
        if(opt== lists[x]){
            return cls;
        }
    }
    return cls;
}
function makePermalink(val){
    if(val){
        var id = val
        .toLowerCase() // change everything to lowercase
        .replace(/^\s+|\s+$/g, "") // trim leading and trailing spaces
        .replace(/[_|\s]+/g, "-") // change all spaces and underscores to a hyphen
        .replace(/[^a-z0-9-]+/g, "") // remove all non-alphanumeric characters except the hyphen
        .replace(/[-]+/g, "-") // replace multiple instances of the hyphen with a single instance
        .replace(/^-+|-+$/g, "") // trim leading and trailing hyphens
        ;
        return id;
    }
}

function mediaPlayer(){
    if(!document.getElementById('mediaPlayer') && videoWindow && !videoWindow.closed){
        return videoWindow.document.getElementById('mediaPlayer')
    }else if(document.getElementById('mediaPlayer')){
        return document.getElementById('mediaPlayer')
    }else{
        return false;
    }
}

function reloadPlayer(li){
    var track = li.childNodes[0]
    var kind = track.getAttribute('kind')
    var url = track.getAttribute('rel')
    if(kind == "AUDIO"){
        if(videoWindow && !videoWindow.closed){
            videoWindow.close();
        }
        if(!document.getElementById('mediaPlayer')){
            document.getElementById('player').innerHTML = "<audio id='mediaPlayer' src='#'></audio>"
            videoWindow = false;
        }
    }else if(kind == "VIDEO"){
        if(!videoWindow && document.getElementById('mediaPlayer')){
            if(document.getElementById('mediaPlayer').playing){
                document.getElementById('mediaPlayer').stop();
            }
            document.getElementById('player').innerHTML = "";
        }
        videoWindow = window.open(window.location+"?video="+track.getAttribute('rel')+"&id="+li.id, "videoWindow", "status = 1, height="+track.getAttribute('height')+", width="+track.getAttribute('width')+", resizable = 0, toolbar = 0, personalbar=0" )
        var timer = setInterval(function() {
            if(videoWindow.closed) {
                clearInterval(timer);videoWindow = false;
            }
        }, 1000);
    }

}

function load(li){

    var kind =  li.childNodes[0].getAttribute('kind')
    if(mediaPlayer() == false || mediaPlayer().tagName != kind){
        reloadPlayer(li);
    }
    var ldtmr = setInterval(function() {
        if(mediaPlayer() != false){

            mediaPlayer().setAttribute('src', li.childNodes[0].getAttribute('rel'));
            mediaPlayer().setAttribute('num', li.getAttribute('num'));
            mediaPlayer().setAttribute('current', li.id);
            mediaPlayer().load()
            clearInterval(ldtmr);
        }
    }, 100);
    var playtmr = setInterval(function() {
        if(mediaPlayer().readyState >0){
            clearInterval(playtmr);
            if(videoWindow != false){
                videoWindow.focus();
            }
            updateDisplay(li.childNodes[0])
            updateTime();
            play();
        }
    }, 100);
}

function showAll(){
    var el = document.getElementsByTagName('li')
    for (var i=0;i< el.length;i++){
        el[i].className =  el[i].className.replace( /(?:^|\s)selected(?!\S)/ , '')
    }
}

function highlight(li){
    if(li){
        var cls = li.className.replace("item even", "").replace("item odd", "").slice(1).replace(/\s+/g, " ").split(" ")
        if(cls[0] != " "){
            for(var x in cls){
                l = document.getElementById(cls[x])
                if(l){
                    l.className = 'selected '+l.className.replace(/\s+/g, " ");
                }
            }
        }
    }
}

function select(id,type){

    var li = document.getElementById(id);

    if(type == "genre"){
        var l = [["artist", li.id],["album", li.id],["track", li.id]]
    }else if(type == "artist"){
        var l = [["album", li.id],["track", li.id]];
    }else if(type == "album"){
        var l = [["track", li.id]];
    } else if(type == "track"){
        load(li);
    }
    for(var x in l){
        selectList(l[x][0], l[x][1])
    }
    showAll();
    highlight(li);
    li.className = 'selected '+li.className.replace(/\s+/g, " ");
}
function selectList(list, current){
    var ul = document.getElementById(list)
    ul.innerHTML = ""
    if(list == "genrer"){}
    if(list == "track"){
        loadTracks(current)
    }else{
        loadTags(list, current)
    }

}


function continuedPlayback(){
    mediaPlayer().addEventListener('ended',nextHandler,false);
    function nextHandler(e) {
        if(!e) {
            e = window.event;
        }
        forward();
    }
}

function changeVolume(m) {
    var p = m.parentNode;
    var val = window.event.clientX-p.offsetLeft;
    var per = val/p.offsetWidth
    var log = document.getElementById('track_display')
    if(val > 0 && val < p.offsetWidth){
        m.setAttribute('ondragend', 'mediaPlayer().volume = '+per)
        document.getElementById('volume_bar').style.width = per*100+"%"
    }
}

function scrubPosition(m) {
    var p = m.parentNode;
    var val = window.event.clientX-p.offsetWidth;
    if(val > 0 && val < p.offsetWidth){
        var per = (val/p.offsetWidth)*100;
        var time = mediaPlayer().duration*(val/p.offsetWidth)
        m.setAttribute('title', formatTime(time))
        m.setAttribute('ondragend', 'mediaPlayer().currentTime = '+time)
        document.getElementById('progress_bar').style.width = per+"%"
    }

}

function updateTime(){
    mediaPlayer().addEventListener('timeupdate',playHandler,false);

    function playHandler(e) {
        if(!e) {
            e = window.event;
        }

        document.getElementById('progress').style.display = "block";
        document.getElementById('time_display').innerHTML = formatTime(mediaPlayer().currentTime);
        document.getElementById('time_remaining').innerHTML = "-"+formatTime(mediaPlayer().duration-mediaPlayer().currentTime);
        document.getElementById('progress_bar').style.width = ((mediaPlayer().currentTime / mediaPlayer().duration)*100 +"%")
    }

}

function updateDisplay(string){
    var tags = string.getElementsByTagName('span')
    document.title = "browseTunes | Now Playing :  "+tags[0].innerHTML+" - "+tags[1].innerHTML+" - "+tags[2].innerHTML
    document.getElementById('track_display').innerHTML = tags[0].innerHTML
    document.getElementById('artist_display').innerHTML = tags[1].innerHTML+" - "+tags[2].innerHTML
}


function play(){
    if (mediaPlayer().paused){
        document.getElementById('playButton').innerHTML= pauseBTN;
        mediaPlayer().play();
        continuedPlayback();
    }else{
        document.getElementById('playButton').innerHTML = playBTN;
        mediaPlayer().pause();
    }
}


function rewind(){
    var ul = document.getElementById('track')
    var li = ul.getElementsByClassName('selected')[0]
    if(li && li.previousSibling.getAttribute('class').split(" ")[0] != "hidden"){
        select(li.previousSibling.id, 'track')
    }
}


function forward(){
    var ul = document.getElementById('track')
    var li = ul.getElementsByClassName('selected')[0]
    if(li && li.nextSibling.getAttribute('class').split(" ")[0] != "hidden"){
        select(li.nextSibling.id, 'track')
    }
}


function generateVideoStylesheet(){
    var css = "\n\tbody{background-color: #000000; margin: 0px auto; padding: 0;}"
    css += "\n\t#xouter{height:100%;width:100%;display:table;vertical-align:middle; background-color: #000000;}"
    css += "\n\t#screen {text-align: center;position:relative;vertical-align:middle;display:table-cell;}"
    css += "\n\t#mediaPlayer {width:100%;text-align: center;margin-left:auto;margin-right:auto;}"
    return css;
}

function generateStylesheet(){
    // CORE POSITIONING CSS
    var css = "\n\t html{height: 100%; overflow:hidden; background-color: #000;}"
    css += "\n\tbody {position: relative;height: 100%; margin: 0;padding: 0;color: #555555;font-family: Helvetica, sans-serif, verdana, arial;font-size: 12px; background-color:  #96999D;}"
    css += "\n\t#header{height: 100px;position:relative;border-top: 1px solid #727579;"+fade('top','#ffffff', '#777777')+"}"
    css += "\n\t#content{background-color: #ffffff; border-top: 1px solid #727579; border-bottom: 1px solid #727579;z-index: 10;display: block;position:absolute;height:auto; bottom:20px; left: 0; right: 0; top: 100px;}"
    css += "\n\t#footer{text-align:center; position:absolute; bottom: 0px; height: 20px; width:100%;} #footer a:link{color: #f9f9f9;}"
    css += "\n\t#display{height: 80px; overflow:hidden;width:50%; margin: 10px auto; padding: 0; background-color: #E0E3C7;-moz-border-radius: 15px; border-radius: 15px;border: 2px solid #727579; text-align: center; position: relative;}"

    // COLUMN POSITIONING
    css += "\n\tul#track{overflow:auto;height:100%;}"
    css += "\n\t#maincols{height: 30%; width: auto; border-bottom: 1px solid #727579;position:relative;}"
    css += "\n\t#main{height: 70%;position: relative;}"
    css += "\n\t#mainleft, #maincenter, #mainright{width: 33.3%;overflow:auto;height:100%;z-index:300; top: 0px;position: absolute;}"
    css += "\n\t#maincenter{margin: 0% 33.4% 0 33.4%; }"
    css += "\n\t#mainleft{border-right: 1px solid #727579;left: 0px; margin-right: 1px;}"
    css += "\n\t#mainright{border-left: 1px solid #727579;right: 0px;margin-left: 1px;}"

    // LISTS
    css += "\n\tul{margin:0px auto;padding: 0; position:relative;}"
    css += "\n\tul li{list-style-type:none; padding: 5px;}"
    css += "\n\tul li.even{background-color: #fff;}"
    css += "\n\tul li.odd{background-color: #F4F6FA;}"
    css += "\n\tul li.back{background-color: #E6EAF2;}"
    css += "\n\tul li.selected{background-color: #D1D9E8;}"

    // THEME
    css +=  "\n\t#track_display,#artist_display, #time_display{position: relative;z-index: 400;} #track_display{font-size: 200%; font-weight: bold;} #artist_display{font-size: 140%;}"
    css +=  "\n\t#time_remaining, #time_display{position:absolute; bottom: 5px;} #time_display{left: 20px} #time_remaining{right:20px;}"
    css +=  "\n\t#progress{width:70%; height: 10px; border: 1px solid #999999; padding: 1px; position: absolute; z-index: 400; bottom: 5px; left: 15%;}"
    css +=  "\n\t#progress_bar{height: 10px; background-color: #999999; position: relative; z-index: 400; display:block;cursor: move;  border-right: 2px solid #555;}"
    css +=  "\n\t#volume{width:140px;position:absolute; right: 20px; top: 40px; height: 10px; border: 1px solid #999999; padding: 1px; z-index: 400;}"
    css +=  "\n\t#volume_bar{height: 10px; background-color: #999999; position: relative; z-index: 400; display:block;cursor: move; border-right: 2px solid #555;}"
    css +=  "\n\t#volume label{position:absolute; left: -50px;}"
    css +=  "\n\t#fileSelection{width:180px;position:absolute; right: 20px; top: 70px;}"

    css += "\n\tspan.time, span.artist, span.album, span.name,span.number{display:inline-block; width: 29%;} span.time{width:10%}"
    css += "\n\ta:link{text-decoration:none;color: #999999;}"
    css += "\n\t#footer a:link{text-decoration:none;color: #555555;}"
    css += "\n\t#buttons{position: relative; z-index: 400;};#buttons button{float: left;}"
    css += "\n\t#logo{position: absolute; top: -2px; left: 50%; margin-left: -130px; font-size: 500%;font-weight:bold; letter-spacing:12px; color:#CCCFBA;-webkit-user-select: none;}; .j{font-style:italic;}"
    css += "\n\t.svgbuttons{stroke-width:1px; stroke:#555555; fill:#999999;}"
    css += "\n\ta#playButton{z-index:600;position: absolute;top: 15px; left: 100px; font-size: 300%; font-weight:bold;width:60px; height:60px;-moz-border-radius: 30px; border-radius: 30px;display:block; text-align:center;border: 1px solid #727579;color:#555555;"+fade('top','#777777', '#ffffff')+"; fill:#777777;}"
    css += "\n\ta#playButton .playBTN{margin-top: 15px; margin-left: 5px;}a#playButton .pauseBTN{margin-top: 15px; margin-left: 0px;}"
    css += "\n\ta#rewindButton,a#forwardButton{z-index:600;position: absolute; top: 25px; font-size: 100%; font-weight:bold;width:40px; height:40px;-moz-border-radius: 20px; border-radius: 20px;display:block; text-align:center;border: 1px solid #727579;color:#555555;"+fade('top','#777777', '#ffffff')+"; fill:#777777;}"
    css += "\n\ta#rewindButton{left:50px;}a#forwardButton{left:170px;} a#rewindButton .rewindBTN, a#forwardButton .forwardBTN{margin-top: 5px;}"
    css += "\n\t#saveas{position:absolute; right: 20px; top: 0px;}"
    css += "\n\t#search{position:absolute; right: 20px; top: 15px;} #search_field{width: 140px;}"
    css += "\n\t.hidden{display:none;}"
    css += "\n\th1,h2,p,hr{margin:10px 20% 0 20%}"

    return css;

}

function clearDisplay(){
    document.getElementById("track_display").innerHTML= ""
    document.getElementById("artist_display").innerHTML = ""
    document.getElementById('time_display').innerHTML = ""
    document.getElementById('time_remaining').innerHTML = ""
    document.getElementById('progress').style.display = "none";
}

// fade(position, start, end); stylish greyscale fade;
function fade(position, start, end){
    var css = "background-image: linear-gradient("+position+", "+start+" 0%, #"+end+" 100%);\n\
                    background-image: -o-linear-gradient("+position+","+start+" 0%, "+end+" 100%);\n\
                    background-image: -moz-linear-gradient("+position+","+start+" 0%, "+end+" 100%);\n\
                    background-image: -webkit-linear-gradient("+position+", "+start+" 0%, "+end+" 100%);\n\
                    background-image: -ms-linear-gradient("+position+", "+start+" 0%, "+end+" 100%);\n\
                    background-image: -webkit-gradient(linear,"+position+",bottom,color-stop(0, "+start+"),color-stop(1, "+end+"));"
    return css;
}

addEventListener('load', prepareDB, false);