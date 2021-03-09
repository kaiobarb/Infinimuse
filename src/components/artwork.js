import React, { useRef } from 'react';

export function testAPI() {
    console.log("Starting API IDrequest ...")
    let IDrequestURL = 'https://api.artic.edu/api/v1/images?limit=2';
    let IDrequest = new XMLHttpRequest();
    IDrequest.open('GET', IDrequestURL);
    IDrequest.responseType = 'json';
    IDrequest.send();

    IDrequest.onload = function() {
        var ids = [];
        const result = IDrequest.response;

        for (var item in result) {
            ids.push(item)
        }
        console.log(result)
    }
}
