var sept = require('serialport');
var http = require('http');
var serv = '9969'

http.createServer(function (req, res)
{
	if (req.url != '/push')
	{
		res.writeHead(500, {'Content-Type': 'text/plain'});
		res.end('Bad Command. Try: /push');
		
		return;
	}
	
	// Query all serial ports
	sept.list(function (err, ports)
	{
		// Go over each one
		ports.forEach(function(port)
		{
			console.log('Found port: ' + port.comName);
			
			// We are on Windows, so Arduino ports begin with COM
			if (port.comName.startsWith('COM'))
			{
				var serial = new sept(port.comName);
				var pushed = false;
				
				serial.on('open', function()
				{
					if (pushed)
						return;
					
					console.log('Opened: ' + port.comName);
					
					// send the 'tell' command
					serial.write('t');
				});
				
				serial.on('data', function (data)
				{
					// if we get 'hi' back, push the button
					if (data == 'hi')
					{
						pushed = true;
						console.log('Servo: ' + port.comName);
						
						serial.write('p');
						serial.close();
						
						res.writeHead(200, {'Content-Type': 'text/plain'});
						res.end('Pushed!');
					}
				});
				
				serial.on('error', function(err)
				{
					res.writeHead(500, {'Content-Type': 'text/plain'});
					res.end(err.message);
				})
			}
		});
	});
})
.listen(serv);
