import moment from 'moment'
import axios from 'axios'
import districts from '@/districts.json'
export default class CovidDataInterface {
  data = {};

  loadData(prevDays) {
    var fetches = [];
    for (var i=0; i<prevDays; i++) {
      var date = moment().subtract(i, 'days').format('YYYY-MM-DD');
      fetches.push(
        this.updateCases(date).then(res => {
          this.data[res.date] = res.data
        })
      );
    }
    return Promise.all(fetches);
  }

  getData = function(date) {
    return new Promise((resolve, reject) => {
      if (this.data[date]) {
        resolve(this.data[date]);
      } else {
        this.updateCases(date).then(res => {
          this.data[res.date] = res.data;
          resolve(res.data);
        })
        .catch(err => reject(err))
      }
    })
  }

  /* Update Cases from Tom White's datasette instance */
  updateCases = function(date) {
    return new Promise((resolve, reject) => {
      var where = "date = '" + date +"'"
      axios.get(`https://covid-19-uk-datasette-65tzkjlxkq-ew.a.run.app/covid-19-uk.json?sql=
        select date,AreaCode,TotalCases
        from cases 
        where `+where+`
        group by date,AreaCode`)
      .then(res => {
        var data = [];
        res.data.rows.forEach(row => {
          var district = districts[row[1]];
          if (district) {
            var cases = row[2];
            data.push({
              'lat': district.lat,
              'lng': district.long,
              'cases': this.parseCases(cases)
            })
          }
        })
        resolve({date: date, data:data});
      })
      .catch(err => reject(err));
    })
  }

  parseCases = function(n) {
    if (n === "1 to 4") {
      return 2.5
    } else {
      return parseInt(n)
    }
  }
}