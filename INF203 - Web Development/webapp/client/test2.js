function getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
}

function show(){
    document.getElementById("MAINSHOW").innerHTML = "";
    var xmlhttp, text;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', '../../Slices');
    xmlhttp.onload = function(){
        text = this.responseText;
        var obj = document.getElementById("MAINSHOW");
        obj.textContent = text; 
    }
    xmlhttp.send();
    
}

function add(){
    document.getElementById("SUBMITADD").style.visibility = "visible";
    document.getElementById("colorTF").style.visibility = "visible";
    document.getElementById("valueTF").style.visibility = "visible";
    document.getElementById("titleTF").style.visibility = "visible";
}

function remove(){
    document.getElementById("VALIDREM").style.visibility = "visible";
    document.getElementById("indexTF").style.visibility = "visible";
}

function clear(){
    document.getElementById("MAINSHOW").innerHTML = "";
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', '../../clear');
    xmlhttp.send();
}

function restore(){
    document.getElementById("MAINSHOW").innerHTML = "";
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', '../../restore');
    xmlhttp.send();
}

function submitadd(){
    document.getElementById("MAINSHOW").innerHTML = "";
    var title = document.getElementById("titleTF").value;
    var value = document.getElementById("valueTF").value;
    var color = document.getElementById("colorTF").value;

    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', '../../add?title='+title+'&value='+value+'&color='+color);
    xmlhttp.send();
}

function validrem(){
    document.getElementById("MAINSHOW").innerHTML = "";
    var index = document.getElementById("indexTF").value
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', '../../remove?index='+(new Number(index)).toString());
    xmlhttp.send();
}

function piechart(){
    var div = document.getElementById("piediv");
    div.innerHTML = ""
    var xmlhttp, svg_slices;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', '../../PieChart');
    xmlhttp.onload = function(){
        svg_slices = this.responseText;
        div.innerHTML = svg_slices;
    }
    xmlhttp.send();
}

function localpiechart(){
    document.getElementById("MAINSHOW").innerHTML = "";
    var xmlhttp, text_slices;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', '../../Slices');
    xmlhttp.onload = function(){
        text_slices = this.responseText;
        var slices = JSON.parse(text_slices)
        var pie_div = document.getElementById("piediv");
        if (pie_div.childElementCount!=0){
            pie_div.innerHTML="";
        }
        var piesvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        piesvg.setAttribute("id", "piechart");
        piesvg.setAttribute('viewBox', "-1 -1 2 2");
        piesvg.setAttribute("height", 500);
        piesvg.setAttribute("width", 500);
        //piesvg.style.transform = "rotate(-0.25turn)"

        var value_tot = 0;
        for(var slice of slices) {
            value_tot += new Number(slice.value);
        }
        var cum = 0;
        for (var slice of slices) {
            var percent = slice.value/value_tot;
            var [x_start, y_start] = getCoordinatesForPercent(cum);
            //var [x_title, y_title] = getCoordinatesForPercent(cum + percent/2);
      
            cum += percent;
            
            var [x_end, y_end] = getCoordinatesForPercent(cum);
            var largeArcFlag = percent > .5 ? 1 : 0;
            var pathData = [
                `M ${x_start} ${y_start}`,
                `A 1 1 0 ${largeArcFlag} 1 ${x_end} ${y_end}`,
                `L 0 0`,
              ].join(' ');
            var pathpie = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathpie.setAttribute('d', pathData);
            pathpie.setAttribute('fill', slice.color);
            piesvg.appendChild(pathpie);
      
          }
          pie_div.appendChild(piesvg)
    }
    xmlhttp.send();
}