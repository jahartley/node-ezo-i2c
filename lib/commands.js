'use strict';

/* 
 * EZO default i2c Values:
 * pH 0x63
 * ORP 0x62
 * D.O. 0x61
 * EC 0x64
 * CO2 0x69
 * RTD 0x66
 * PRS 0x6a
 * Flow 0x68
 * PMP 0x67
 * RGB 0x70
 */

 exports.PH = 0x63;
 exports.ORP = 0x62;
 exports.DO = 0x61;
 exports.EC = 0x64;
 exports.CO2 = 0x69;
 exports.RTD = 0x66;
 exports.PRS = 0x6a;
 exports.FLOW = 0x68;
 exports.PMP = 0x67;
 exports.RGB = 0x70;

 /*
  * ALL EZO COMMANDS: 
  * Commands 		wait	response
  * Find			400ms	1
  * i 				400ms 	1?i,dev,n (device type, firmware)
  * L,1				400ms 	1 (led on)
  * L,0				400ms	1 (led off)
  * L,?				400ms 	1?L,n (1 or 0)
  * Sleep 			none	any request wakes up
  * Status 			400ms	1?Status,l,n (reason for restart, Vcc)
  * 	(P power off, S software reset, B brown out, W watchdog, U unk)
  */
  exports.FIND = "Find";
  exports.I = "i";
  exports.L_ON = "L,1";
  exports.L_OFF = "L,0";
  exports.L_Q = "L,?";
  exports.SLEEP = "Sleep";
  exports.STATUS = "Status";
  exports.WAIT_S = 400;
  exports.WAIT_L = 1000;
 

 /*
  * PH commands:
  * Commands 		wait	response
  * Cal,mid,n    	1000ms	1	
  * Cal,low,n    	1000ms	1
  * Cal,high,n   	1000ms	1
  * Cal,clear    	400ms	1
  * Cal,?        	400ms	1?Cal,0 (default) 1?Cal,n (1 to 3 point)
  * Find			400ms	1
  * i 				400ms 	1?i,PH,n (firmware)
  * L,1				400ms 	1 (led on)
  * L,0				400ms	1 (led off)
  * L,?				400ms 	1?L,n (1 or 0)
  * R 				1000ms  1n (pH float)
  * Sleep 			none	any request wakes up
  * Slope,?			400ms	1?Slope,n,n,n (acid slope % to ideal, base %, mv from zero)
  * Status 			400ms	1?Status,l,n (reason for restart, Vcc)
  * 	(P power off, S software reset, B brown out, W watchdog, U unk)
  * T,n (temp C)	400ms 	1
  * T,?				400ms	1?T,n (current temp value)
  */
exports.PH_WRITE_CAL_MID = "Cal,mid,";
exports.PH_WRITE_CAL_LOW = "Cal,low,";
exports.PH_WRITE_CAL_HIGH = "Cal,high,";
exports.PH_WRITE_CAL_CLEAR = "Cal,clear";
exports.PH_READ_CAL_Q = "Cal,?";
exports.PH_READ = "R";
exports.PH_READ_SLOPE = "Slope,?";
exports.PH_READ_TEMP = "T,?";
exports.PH_WRITE_TEMP = "T,";
