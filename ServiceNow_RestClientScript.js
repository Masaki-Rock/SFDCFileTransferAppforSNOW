var recordSysId ="851a98902fa6201046b7f5ecf699b631";
var sparator = "20210204";
var mark = 'attachedfile 10MB';

var simpleDateFormat = 'dd MMMM yyyy HH:mm:ss.SSS';

//log('Job Start', "");

try {
    var r = new sn_ws.RESTMessageV2('x_578847_mule_rest.Mule_Caller', 'Mulu Get Caller');
    r.setRequestHeader('jwt', createJWT());
	r.setRequestHeader('Content-Type', 'multipart/form-data; charset=utf-8; boundary=' + sparator);
	r.setRequestBody(createReqBody(sparator));
	
	var starttime = new GlideDateTime();
    starttime.setDisplayValue(simpleDateFormat);
	log('httpStatus', "Send Message!! " + starttime.getDisplayValue());
	
    var response = r.execute();
	
	var endtime = new GlideDateTime();
    endtime.setDisplayValue(simpleDateFormat);
	
    var responseBody = response.getBody();
    var httpStatus = response.getStatusCode();
	//log('responseBody', "" + responseBody);
	
	log('httpStatus', "Recieve Message!! " + httpStatus + " : " + endtime.getDisplayValue());
} catch (ex) {
    var message = ex.message;
	log('message', "" + message);
}

function createReqBody(sparator) {
	//log('Record Start', recordSysId);
	var bm = '';
	
	var ir = new GlideRecord('incident');
	ir.addQuery('sys_id', recordSysId);
	ir.query();
	while (ir.next()) {

		var obj = new Object();
		obj.number = "" + ir.number;
		obj.caller_id = "" + ir.caller_id;
		obj.short_description = "" + ir.short_description;
		obj.opened_at = "" + ir.opened_at;
		
		bm += "--" + sparator + '\r\n';
		bm += 'Content-Disposition: form-data; name="applications"\r\n';
		bm += 'Content-Type: application/json\r\n';
		bm += '\r\n';
		bm += JSON.stringify(obj);
		bm += '\r\n';
	}
	//log('Request body ', '\r\n' + bm);

	var ar = new GlideRecord('sys_attachment');
	ar.addQuery('table_sys_id', recordSysId);
    ar.query();
	while(ar.next()){
		var sar = new GlideSysAttachment();
		var content = sar.getContent(ar);
		
		bm += "--" + sparator + '\r\n';
		bm += 'Content-Disposition: form-data; name="files"; filename="' + ar.file_name + '"\r\n';
		bm += 'Content-Type: ' + ar.content_type + '\r\n';
		bm += '\r\n';
		bm += content;
		bm += '\r\n';
		//log('Attachment File', bm);
	}
	bm += "--" + sparator + '--\r\n';
	//log('Request body ', '\r\n' + bm);
	return bm;
}

function createJWT() {
    var jwtAPI = new sn_auth.GlideJWTAPI();
    var headerJSON = {};
    var header = JSON.stringify(headerJSON);
    var payloadJSON = {};
    var payload = JSON.stringify(payloadJSON);
    var jwtProviderSysId = "f96bf8a02f12201046b7f5ecf699b6b0";
    var jwt = jwtAPI.generateJWT(jwtProviderSysId, null, null);
	return jwt;
}

function log(marker, msg) {
	gs.info('>>> ' + marker + ' ' + mark + '... ' + msg);
}