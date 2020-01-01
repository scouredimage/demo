'use strict';

const request = require('request')
const https = require('https')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function usage() {
  const { stdout } = await exec("cat /proc/meminfo")
  let memInfoSplits = stdout.split(/[\n: ]/).filter(val => val.trim())
  const available = parseInt(memInfoSplits[1])
  const used =  parseInt(memInfoSplits[19])
  return used / available * 100
}

var arr = []
async function allocate(percent) {
  var i = 0
  while (i < 3) {
    i++
    const used = await usage()
    if (used >= percent) {
      break
    }
    arr.push({buff: Buffer.alloc(1024 * 1024)})
  }
}

async function fortune() {
  return new Promise((resolve, reject) => {
    request('https://api.ef.gy/fortune', (error, response, body) => {
      if (error || (response && response.statusCode !== 200)) {
        return reject(new Error(error || response.statusCode))
      }
      return resolve(body)
    })
  })
}

async function httpsFortune() {
  const options = {
    hostname: 'api.ef.gy',
    port: 443,
    path: '/fortune',
    method: 'GET'
  }
  return new Promise((resolve, reject) => {
    https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      resp.on('end', () => {
        return resolve(data)
      })
    }).on("error", (err) => {
      return reject(err)
    })
  })
}

module.exports.hello = async (event, context) => {
  //try {
  //  throw new Error('i died')
  //} catch (error) {
  //  context.captureError(error)
  //}
  //throw new Error('i died')
  const message = await httpsFortune()
  //await allocate(60)

  return {
    statusCode: 200,
    body: JSON.stringify({
      message,
      input: event,
    }),
  };
};
