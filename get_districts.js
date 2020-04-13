'use strict'
const axios = require('axios');
const fs = require('fs');

let rawCaseData = fs.readFileSync('cases.json');
let cases = JSON.parse(rawCaseData).rows;

var districts = {};
updateDistricts(cases)
.then(() => {
  fs.writeFileSync('districts.json', JSON.stringify(districts));
})

function updateDistricts(cases) {
  var baseUrl = 'https://ons-inspire.esriuk.com/arcgis/rest/services/Administrative_Boundaries/Counties_and_Unitary_Authorities_December_2019_Boundaries_UK_BFE/MapServer/0/query'
  var idfield = 'ctyua19cd'

  let promises = []
  cases.forEach(row => {
    if (row[0] != null && row[0] != '') {
      var where = idfield + " = '"+row[0]+"'"
      var fields = "outfields="+idfield +",lat,long"

      promises.push(getDistricts(baseUrl + '?where='+where+"&"+fields, idfield)
      .then(function(d) {
        console.log(d)
        if (d != {}) {
          districts[row[0]] = d;
        }
      }))
    }
  })
  return Promise.all(promises);
}

function getDistricts(url) {
  return new Promise((resolve, reject) => {
    axios.get(url+'&f=pjson')
    .then(res => {
      if (!res.data.features) reject()
      var d = res.data.features[0];
      if (!d) {
        resolve();
      }
      var district = {
        lat: d.attributes.lat,
        long: d.attributes.long
      }
      resolve(district);
    }) .catch(err => {
      reject(err)
    })
  })
}

function updateDistricts2(cases) {
  return new Promise((resolve, reject) => {
    var baseUrl_local = 'https://ons-inspire.esriuk.com/arcgis/rest/services/Administrative_Boundaries/Local_Authority_Districts_December_2017_Boundaries/MapServer/1/query'
    var idfield_local = 'lad17cd'
    var baseUrl_unitary = 'https://ons-inspire.esriuk.com/arcgis/rest/services/Administrative_Boundaries/Counties_and_Unitary_Authorities_December_2019_Boundaries_UK_BFE/MapServer/0/query'
    var idfield_unitary = 'ctyua19cd'

    var districtList = [];
    cases.forEach(row => {
      if (row[0] != null && row[0] != '') {
        districtList.push("'"+row[0]+"'");
      }
    })

    var where_local = idfield_local + ' IN ('+districtList.join()+')'
    var where_unitary = idfield_unitary + ' IN ('+districtList.join()+')'
    //var where = '1=1'
    var fields_local = "outfields="+idfield_local+",lat,long"
    var fields_unitary = "outfields="+idfield_unitary+",lat,long"

    var p1 = getDistricts(baseUrl_local + '?where='+where_local+"&"+fields_local)
    var p2 = getDistricts(baseUrl_unitary + '?where='+where_unitary+"&"+fields_unitary)
    Promise.all([p1, p2]).then(results => {
      resolve( {...results[0], ...results[1]} );
    })
    .catch(err => {
      reject(err);
    })
  })

}