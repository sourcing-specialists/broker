import axios from 'axios'
const url = process.env.VUE_APP_API_ENDPOINT

const getCurrencies = function() {
  return new Promise( (resolve, reject) => {
    axios.get(url + 'currencies')
    .then( resp => {
      resolve(resp.data.data)
    })
    .catch( error => {
      reject(error)
    })
  })
}

const getLanguages = function() {
  return new Promise( (resolve, reject) => {
    axios.get(url + 'languages')
    .then( resp => {
      resolve(resp.data.data)
    })
    .catch( error => {
      reject(error)
    })
  })
}

const getIncoterms = function() {
  return new Promise( (resolve) => {
    resolve(['FOB', 'DDP', 'REVOOLOOP'])
  })
}

const getCargos = function() {
  return new Promise( (resolve, reject) => {
    axios.get(url + 'cargo/get')
    .then( resp => {
      resolve(resp.data.data)
    })
    .catch( error => {
      reject(error)
    })
  })
}

export {
  getCurrencies,
  getIncoterms,
  getLanguages,
  getCargos
}