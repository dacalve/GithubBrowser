//var buffer = require('buffer');
var AsyncStorage = require('react-native').AsyncStorage;
var _ = require('lodash');
var encoding = require('NativeModules').Encoding;


const authKey = 'auth';
const userKey = 'user';

class AuthService {
    getAuthInfo(cb){
    	console.log('getAuthInfo...')
        AsyncStorage.multiGet([authKey, userKey], (err, val)=> {

            if(err){
            	console.log('Error = ' + err);
                return cb(err);
            }

            if(!val){
            	console.log('no val');
                return cb();
            }

            //var zippedObj = _.zipObject(val);

            //if(!zippedObj[authKey]){
            if((val[0].length != 2) && (val[1].length != 2)) {
            	console.log('no auth val');
                return cb();
            }
            var auth = val[0][1];
            var user = val[1][1];
            console.log('auth=' + auth);
            console.log('user=' + user);
            var authInfo = {
                header: {
                    Authorization: 'Basic ' + auth //get the value of the auth key
                },
                user: user //get the value of "user" key.
            }

            return cb(null, authInfo);
        });
    }

    login(creds, cb){
    	console.log('Entering login with creds: username=' + creds.username + ' password=' + creds.password);
    	var authStr = creds.username + ':' + creds.password;
    	//using buffer
        //var b = new buffer.Buffer(authStr);
        //var encodedAuth = b.toString('base64');

        encoding.base64Encode(authStr, (encodedAuth) => {

        	console.log('inside encoding.base64Encode callback');
	        fetch('https://api.github.com/user',{
	            headers: {
	                'Authorization' : 'Basic ' + encodedAuth
	            }
	        })
	        .then((response)=> {
	        	console.log('inside .then(response) response.status=' + response.status);
	            if(response.status >= 200 && response.status < 300){
	                return response;
	            }

	            throw {
	                badCredentials: response.status == 401,
	                unknownError: response.status != 401
	            }
	        })
	        .then((response)=> {
	        	console.log('inside 2nd .then(response) response.status=' + response.status);
	            return response.json();
	        })
	        .then((results)=> {
	        	console.log('inside .then(results) ' + JSON.stringify(results));
	        	console.log('storing user: ' + JSON.stringify(results).login);
	            AsyncStorage.multiSet([
	                [authKey, encodedAuth],
	                [userKey, results["login"] ]//JSON.stringify(results)]
	            ], (err)=> {
	                if(err){
	                    throw err;
	                }

	                return cb({success: true});
	            })
	        })
	        .catch((err)=> {
	            return cb(err);
	        });

        });


    }
}

module.exports = new AuthService();