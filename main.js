/**
 * Created by Takito on 25.02.2016.
 */
var PATH_TO_JSON = 'json/posts.json';
var TITLE_MAX_LENGTH = 50;
var BODY_MAX_LENGTH = 250;
var TAG_MAX_LENGTH = 30;

function loadJSONFile(url, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(JSON.parse(xobj.responseText));
        }
    };
    xobj.send(null);

}
function parseTags(tags)
{
    s = '';
    for(elem in tags)
    {
        s += '<button class="btn btn-xs btn-default">';
        s += tags[elem];
        s += '</button>';
    }
    return s;
}
function removeElem(id)
{
    var tempArr = JSON.parse(localStorage["myData"]);
    for(elem in tempArr)
    {
        if (tempArr[elem].id == id)
        {
            tempArr.splice(elem, 1);
            break;
        }
    }
    localStorage["myData"] = tempArr;
    main(tempArr);
}
function addElem(record){
    var tempArr = JSON.parse(localStorage["myData"]);
    var lastID = 1; lastIndex = -1;
    for(el in tempArr)
    {
        if (lastID < tempArr[el].id)
            lastID = tempArr[el].id;
        lastIndex = el;
    }
    record.id = ++lastID;
    tempArr[++lastIndex] = record;
    console.log(tempArr);
    main(tempArr);
}
function insertControls(id)
{
    return controlsTxt = '<div class="controls">' +
        '<button class="btn btn-danger btn-mini" onclick="removeElem('+id+')">удалить</button></div>';
}

function main(arr) {
    localStorage["myData"] = JSON.stringify(arr);
    var s = '';
    for(elem in arr)
    {
        var id = arr[elem].id;
        s += '<article>';
        s += '<header><h3>' + arr[elem].title + '</h3></header>';
        s += '<section><p>' + arr[elem].body + '</p></section>';
        s += '<footer><div class="tags">' + parseTags(arr[elem].tags) + '</div></footer>';
        s += insertControls(id);
        s += '</article>';
    }
    var posts = document.getElementById('posts');
    posts.innerHTML = s;
}

if (!('localStorage' in window && window['localStorage'] !== null)){
    throw new Error("Browser doesn't support localStorage ");
}

if (undefined == localStorage["myData"]) {
    loadJSONFile(PATH_TO_JSON, main);
}
else
{
    main(JSON.parse(localStorage["myData"]));
}

// Validation
function validate(fieldName, value)
{
    var isValid = true;
    var errMessage = {
        'title': 'Не может быть пустым или длиннее ' + TITLE_MAX_LENGTH + ' символов',
        'body': 'Не может быть пустым или длиннее ' + BODY_MAX_LENGTH + ' символов',
        'tags': 'Поле не может быть пустым или содержать тег длиннее ' + TAG_MAX_LENGTH + ' символов'
    };
    switch(fieldName){
        case "title":
            isValid = (value && value.length > 0 && value.length < TITLE_MAX_LENGTH);
            break;
        case "body":
            isValid = (value && value.length > 0 && value.length < BODY_MAX_LENGTH);
            break;
        case "tags":
            var arr = value.split(',');
            if (!arr || arr.length == 0)
            {
                isValid == false;
                break;
            }
            for(el in arr)
            {
                isValid = (arr[el].length > 0 && arr[el].length < TAG_MAX_LENGTH);
                if (!isValid) break;
            }
            break;
    }
    if (!isValid)
    {
        var el = document.getElementById(fieldName+'_error');
        el.innerHTML = errMessage[fieldName];
        el.style.display = "inline";
    }
    return isValid;

}
function hideFormErrors(arr)
{
    for (el in arr)
    {
        document.getElementById(arr[el]+"_error").style.display = "none";
    }
}
function processForm(e) {
    if (e.preventDefault) e.preventDefault();
    var fields = ['title', 'body', 'tags'];
    hideFormErrors(fields);
    var isValid = true;
    var elements = e.target.elements;
    var newEl = {};
    for(field in fields)
    {
        if (!validate(fields[field], elements[fields[field]].value)){
            isValid = false;
        }
        if (fields[field] == 'tags')
        {
            newEl[fields[field]] = elements[fields[field]].value.split(',');
        }
        else
        {
            newEl[fields[field]] = elements[fields[field]].value;
        }
    }
    if (isValid)
    {
        addElem(newEl);
    }
    return false;
}

var form = document.getElementById('post-add');
if (form.attachEvent) {
    form.attachEvent("submit", processForm);
} else {
    form.addEventListener("submit", processForm);
}



