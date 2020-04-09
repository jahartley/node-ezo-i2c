'use strict';

const i2c = require('i2c-bus');
const cmds = require('./commands');

//functions
const delay = duration => new Promise(resolve => setTimeout(resolve, duration));

// ezo api

class ezo {
  constructor(options) {
    // eslint-disable-next-line no-param-reassign
    this.sensors = [];

  }

  /*
   * Main API
   */
 // PH info
 	phInfo() {
 		return this._info(cmds.PH)
 	}


 //info (which device)
 	_info(add) {
 		return new Promise((resolve, reject) => {
 			var buf = Buffer.alloc(15)
 			this._i2cWrite(add, cmds.I).
 			then(() => delay(cmds.WAIT_S)).
 			then(() => this._i2cRead(add, buf)).
 			then((resp) => (resolve(resp.toString('utf8', 1)))).
 			catch(console.log);
 		});
 	}



 //i2cWrite (i2c Address, data(string or number))   	
  	_i2cWrite(add, data) {
  		return new Promise((resolve, reject) => {
  	  		var buf = Buffer.from(data);
  	  		i2c.openPromisified(1).
  	    	then(i2c1 => i2c1.i2cWrite(add, buf.length, buf).
  	    		then((resp) => {
  	    			i2c1.close(); 
  	    			console.log(resp); //testing only
  	    		}).
  	    		then(() => (resolve()))
 	    	).catch(console.log);
  		});
 	}
 
 //i2cRead (i2c address, buffer sized for max read)
    _i2cRead(add, buf) {
  		return new Promise((resolve, reject) => {
  			i2c.openPromisified(1).
  			then(i2c1 => i2c1.i2cRead(add, buf.length, buf).
          		then(_ => i2c1.close()).
          		then(() => (resolve(buf)))
        	).catch(console.log);  
  		});
  	}


}


Object.assign(ezo);

module.exports = ezo;
