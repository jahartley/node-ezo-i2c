'use strict';

const i2c = require('i2c-bus');
const cmds = require('./commands');

//functions
const delay = duration => new Promise(resolve => setTimeout(resolve, duration));

// ezo api

class ezo {
  constructor(options) {
    // eslint-disable-next-line no-param-reassign
    //this.sensors = [];

  }

  /*
   * Main API
 */

 //phWriteCalMid
 	phWriteCalMid(userAdd, cal) {
 		return this._checkAdd(userAdd).
 		then((resp) => {
 			if (cal.parseFloat() > 8 || cal.parseFloat() < 6) throw new Error(`mid cal value ${cal} out of range`)
 			this._cal(resp, cmds.PH_WRITE_CAL_MID, cal)
 		}).catch(console.log)
 	}
 //phWriteCalLow
 	phWriteCalLow(userAdd, cal) {
 		return this._checkAdd(userAdd).
 		then((resp) => {
 			if (cal.parseFloat() > 6) throw new Error(`low cal value ${cal} out of range`)
 			this._cal(resp, cmds.PH_WRITE_CAL_LOW, cal)
 		}).catch(console.log)
 	}
 //phWriteCalHigh
 	phWriteCalHigh(userAdd, cal) {
 		return this._checkAdd(userAdd).
 		then((resp) => {
 			if (cal.parseFloat() < 8) throw new Error(`high cal value ${cal} out of range`)
 			this._cal(resp, cmds.PH_WRITE_CAL_HIGH, cal)
 		}).catch(console.log)
 	}
 //phWriteCalClear
 	phWriteCalClear(userAdd) {
 		return this._checkAdd(userAdd).
 		then((resp) => this._request(resp, cmds.PH_WRITE_CAL_CLEAR)).
 		catch(console.log)
 	}
 //phReadCal
 	phReadCal(userAdd) {
 		return this._checkAdd(userAdd).
 		then((resp) => this._request(resp, cmds.PH_READ_CAL_Q)).
 		catch(console.log)
 	}
 //phReadSlope
 	phReadSlope(userAdd) {
 		return this._checkAdd(userAdd).
 		then((resp) => this._request(resp, cmds.PH_READ_SLOPE)).
 		catch(console.log)
 	}
 //phReadTemp
 	phReadTemp(userAdd) {
 		return this._checkAdd(userAdd).
 		then((resp) => this._request(resp, cmds.PH_READ_TEMP)).
 		catch(console.log)
 	}

 //phWriteTemp
 	phWriteTemp(userAdd, temp) {
 		return this._checkAdd(userAdd).
 		then((resp) => this._request(resp, cmds.PH_WRITE_TEMP + temp.toString())).
 		catch(console.log)
 	}

  //orpWriteCal
 	orpWriteCal(userAdd, cal) {
 		return this._checkAdd(userAdd).
 		then((resp) => this._cal(resp, cmds.ORP_WRITE_CAL, cal)).
 		catch(console.log)
 	}

 //orpReadCal
 	orpReadCal(userAdd) {
 		return this._checkAdd(userAdd).
 		then((resp) => this._request(resp, cmds.ORP_READ_CAL)).
 		catch(console.log)
 	}


 //info(userAdd) 
 	info(userAdd) {
 		return this._checkAdd(userAdd).
 		then((resp) => this._request(resp, cmds.I)).
 		//then((resp) => {
 		//	console.log(resp);
 		//	if (typeof resp === 'undefined') {throw new Error(`info(${userAdd}) failed`)}}).
 		catch(console.log)
 	}

 //find(userAdd) 
 	find(userAdd) {
 		return this._checkAdd(userAdd).
 		then((resp) => this._request(resp, cmds.FIND)).
 		catch(console.log)
  	}
 
 //status(userAdd) 
 	status(userAdd) {
		return this._checkAdd(userAdd).
		then((resp) => this._request(resp, cmds.STATUS)).
		catch(console.log)
 	}

 //read(userAdd) 
 	read(userAdd) {
		return this._checkAdd(userAdd).
		then((resp) => this._read(resp)).
		catch(console.log)
 	}

 // cal
 	_cal(add, cmd, cal) {
 		return new Promise((resolve, reject) => {
 			//console.log(`_info ${add}`);
 			var buf = Buffer.alloc(10)
 			this._i2cWrite(add, cmd + cal.toString()).
 			then(() => delay(cmds.WAIT_L)).
 			then(() => this._i2cRead(add, buf)).
 			then((resp) => {
 				//console.log(resp);
 				//console.log(resp[0]);
 				if (resp[0] != 1) reject(new Error(`_info ezo response not ok i2c address:${add}`));
 				if (resp[1] != 0) {resolve(resp.toString('utf8', 1, resp.indexOf(0)))} else {
 					resolve('ok')
 				}
 			}).
 			catch(console.log);
 		});

 	}



 //check address
 	_checkAdd(userAdd) {
 		return new Promise((resolve, reject) => {
 			//console.log(`_checkAdd ${userAdd}`);
 			var add = 0;
 			if (typeof userAdd === 'string') {
 				var tmp = userAdd.toUpperCase();
 				add = cmds.DEVICE[tmp];
 				if (typeof add === 'number') {
 					resolve(add);
 				} else {
 					reject(`_checkAdd ${tmp} dosent match any known device`);
 				}
 			} else if (typeof userAdd === 'number' && userAdd < 255 && userAdd > 0) {
 				resolve(userAdd);
 			} else {
 				reject('_checkAdd type error');
 			}
 		});
 	}

 //request
 	_request(add, cmd) {
 		return new Promise((resolve, reject) => {
 			var buf = Buffer.alloc(25)
 			this._i2cWrite(add, cmd).
 			then(() => delay(cmds.WAIT_S)).
 			then(() => this._i2cRead(add, buf)).
 			then((resp) => {
  				if (resp[0] != 1) reject(new Error(`_request ezo response not ok i2c address:${add} cmd: ${cmd}`));
 				if (resp[1] != 0) {resolve(resp.toString('utf8', 1, resp.indexOf(0)))} else {
 					resolve('ok')
 				}
 			}).
 			catch(console.log);
 		});


 	}

 /*/info (which device)
 	_info(add) {
 		return new Promise((resolve, reject) => {
 			//console.log(`_info ${add}`);
 			var buf = Buffer.alloc(15)
 			this._i2cWrite(add, cmds.I).
 			then(() => delay(cmds.WAIT_S)).
 			then(() => this._i2cRead(add, buf)).
 			then((resp) => {
 				//console.log(resp);
 				//console.log(resp[0]);
 				if (resp[0] != 1) reject(new Error(`_info ezo response not ok i2c address:${add}`));
 				resolve(resp.toString('utf8', 1, resp.indexOf(0)))
 			}).
 			catch(console.log);
 		});
 	}

 //find (which device)
 	_find(add) {
 		return new Promise((resolve, reject) => {
 			var buf = Buffer.alloc(1)
 			this._i2cWrite(add, cmds.FIND).
 			then(() => delay(cmds.WAIT_S)).
 			then(() => this._i2cRead(add, buf)).
 			then((resp) => {
 				//console.log(resp);
 				//console.log(resp[0]);
 				if (resp[0] != 1) reject(new Error(`_find ezo response not ok i2c address:${add}`));
				resolve("blinking")
			}).
 			catch(console.log);
 		});
 	}

 //status (which device)
 	_status(add) {
 		return new Promise((resolve, reject) => {
 			var buf = Buffer.alloc(20)
 			this._i2cWrite(add, cmds.STATUS).
 			then(() => delay(cmds.WAIT_S)).
 			then(() => this._i2cRead(add, buf)).
 			then((resp) => {
 				//console.log(resp);
 				//console.log(resp[0]);
 				if (resp[0] != 1) reject(new Error(`_status ezo response not ok i2c address:${add}`));
 				resolve(resp.toString('utf8', 1))
 			}).
 			catch(console.log);
 		});
 	}
 	*/
 //_read (which device)
 	_read(add) {
 		return new Promise((resolve, reject) => {
 			var buf = Buffer.alloc(10)
 			this._i2cWrite(add, cmds.READ).
 			then(() => delay(cmds.WAIT_L)).
 			then(() => this._i2cRead(add, buf)).
 			then((resp) => {
 				//console.log(resp);
 				//console.log(resp[0]);
 				if (resp[0] != 1) reject(new Error(`_read ezo response not ok i2c address:${add}`));
 				resolve(resp.toString('utf8', 1, resp.indexOf(0)))
 			}).
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
  	    			if (resp.bytesWritten != buf.length) reject(new Error(`_i2cWrite bytes written dosent match buf.lenght i2c address:${add}`)); 
  	    			//console.log(resp); //testing only
  	    			//{ bytesWritten: 1, buffer: <Buffer 69> }
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
