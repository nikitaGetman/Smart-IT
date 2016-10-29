$.ajax({url: '239.255.255.250:1900',
			  beforeSend: function(a, b){
				  console.log('BEFORE SEND:');
				  console.log(a);
			  },
			  async: false,
			  dataType: 'jsonp',
			  crossDomain: true,
			  timeout: 10000,
			  xhrFields: {
      				withCredentials: true
   			    },
			  headers: {
				  "HOST": "239.255.255.250:1900",
				  "MAN": "ssdp:discover",
				  "MX": "3",
				  "ST": "udap:rootservice",
				  "USER_AGENT": "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)"
			  },
              success: function(data){
					console.log('SUCCESS:');
					console.log(data);
              },
			  error: function(e){
				  console.log('ERROR:');
				  console.log(e);
			  }
      });