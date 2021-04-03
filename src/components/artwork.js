import React, { useRef } from 'react';

var artworks = []
var indexIterator = 0;

export function getArtworksFromAPI() {
    var ids = [];
    console.log("Starting API IDrequest ...")
    //let IDrequestURL = 'https://api.artic.edu/api/v1/images?limit=2';
    // https://api.artic.edu/api/v1/artworks/27992?fields=id,title,image_id
    let IDrequestURL = 'https://api.artic.edu/api/v1/artworks?limit=20'
    let IDrequest = new XMLHttpRequest();
    IDrequest.open('GET', IDrequestURL);
    IDrequest.responseType = 'json';
    IDrequest.send();

    IDrequest.onload = function() {
        const result = IDrequest.response;
        for (var item in result.data) {
            ids.push("https://www.artic.edu/iiif/2/" + result.data[item].image_id + "/full/843,/0/default.jpg")
        }
        artworks = [...ids]
    }
}

export function getArtworkIDs() {
    return artworks;
}

export function getArtworkID(index) {
    return artworks[index];
    incrementIndexIterator()
}

export function getNextArtworkUrl() {
    var result = 'https://www.artic.edu/iiif/2/' + artworks[indexIterator] + '/full/843,/0/default.jpg'
    incrementIndexIterator()
    return result;
}

export function getIndexIterator() {
    return indexIterator;
}

export function setIndexIterator(val) {
    indexIterator = val;
}

export function incrementIndexIterator() {
    indexIterator += 1;
}

export function getImagefromID(id) {
    let ImageRequestURL = 'https://www.artic.edu/iiif/2/' + id + '/full/843,/0/default.jpg'
    let ImageRequest = new XMLHttpRequest();
    ImageRequest.open('GET', ImageRequestURL);
    ImageRequest.responseType = 'json';
    ImageRequest.send();

    ImageRequest.onload = function() {
        const result = ImageRequest.response;
        console.log(ImageRequest)
        
    }
}

