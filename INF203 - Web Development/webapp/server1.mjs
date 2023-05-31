"use strict";

import {createServer} from "http";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { extname } from "path";
import { parse, unescape } from "querystring";
import { parse as urlparse } from "url";
// process requests
var visited="";
const port=process.argv[2];

function escapeHtml(str) {
    return str.replace(/[&<>"'\/]/g, function(match) {
      switch (match) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#039;';
        case '/': return '&#x2F;';
        default: return match;
      }
    });
}

function getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
}

function webserver( request, response ) {
    const {url}=request;
    var parse_url=urlparse(request.url);
    if(url=='/end'){
        response.setHeader("Content-Type", "text/html; charset=utf-8");  
        response.end("<!doctype html><html><body>The server will stop now.</body></html>");
        process.exit(0);
    }
    else if(url.startsWith('/WWW')){
        const filePath='.'+url.substring(4);
        const extension=extname(filePath).slice(1);
        let contentType;
        if(existsSync(filePath)){
            switch(extension){
                case "txt":
                    contentType="text/plain";
                    break;
                case "html":
                    contentType="text/html";
                    break;
                case "css":
                    contentType="text/css";
                    break;
                case "js" || "JS" || "mjs":
                    contentType="application/javascript";
                    break;
                case "png":
                    contentType="image/png";
                    break;
                case "jpeg" || "jpg":
                    contentType="image/jpeg";
                    break;
                default:
                    contentType="text/html"
            }
            try{
            const contents=readFileSync(filePath); 
            response.setHeader("Content-Type", contentType+"; charset=utf-8"); 
            response.end(contents);
            }catch(err){
                console.error(err);
            }
            
        }else{
            console.log("404");
            response.statusCode=404;
            response.end("<!doctype html><html><body>404 Not Found</body></html>");
        }
    }
    else if(url.startsWith("/Slices")){
        if (!existsSync("storage.json")) {
            response.writeHeader(404);
            response.end()
          }
        else {
            var contents = readFileSync("storage.json")
            response.writeHeader(200, { 'Content-Type': 'application/json' })
            response.write(contents);
            response.end();
        }
    }
    else if(url.startsWith("/add?")){
        var parse_query = parse(parse_url.query);
        if (parse_query.value == ""|| parse_query.title == "" ||parse_query.color=="" ){
            response.writeHeader(400, { 'Content-Type': 'text/html' } );
            response.write("There is a problem with the format of the request")
            response.end()  
        }
        else if (existsSync("storage.json")){
            var contents = JSON.parse(readFileSync("storage.json"));
            contents.push({title: parse_query.title, color: parse_query.color, value: parse_query.value});
            writeFileSync("storage.json", JSON.stringify(contents));
            response.writeHeader(200);
            response.end();
        }
        else {
            var contents = [{title: parse_query.title, color: parse_query.color, value: parse_query.value}];
            writeFileSync("storage.json", JSON.stringify(contents));
            response.writeHeader(200);
            response.end()
        }
    }
    else if(url.startsWith("/remove?")){
        if (!existsSync("storage.json")) {
            response.writeHeader(404);
            response.end()
          }
        else{
            parse_query = parse(parse_url.query);
            var contents = JSON.parse(readFileSync("storage.json"));
            contents.splice(parse_query.index, 1);
            writeFileSync("storage.json", JSON.stringify(contents));
            response.writeHeader(200);
            response.end();
        }
    }
    else if(url.startsWith("/clear")){
        writeFileSync("storage.json", JSON.stringify([]))
        response.writeHeader(200);
        response.end();
    }
    else if(url.startsWith("/restore")){
        if (!existsSync("storage.json")) {
            response.writeHeader(404);
            response.end()
        }
        else{
            var contents = JSON.parse(readFileSync("storage.json"));
            contents = contents.slice(0,3);
            writeFileSync("storage.json", JSON.stringify(contents));
            response.writeHeader(200);
            response.end();
        }
    }
    else if(url.startsWith("/PieChart")){
        var slices = JSON.parse(readFileSync("storage.json"));
        var rep = '<svg id="piechart" viewBox="-1 -1 2 2" height=500 width=500>';
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
            rep += '<path d="' + pathData + '" fill="' + slice.color + '"></path>';
        }
        rep+='</svg>'
        response.writeHeader(200, {"Content-Type": "image/svg+xml"});
        response.write(rep);
        response.end();
    }
    else{
        response.setHeader("Content-Type", "text/html; charset=utf-8");  
        response.end("<!doctype html><html><body>Server works!</body></html>");
    }
}

// create server object
const server = createServer(webserver);

// server listens
server.listen(port, (err) => {});