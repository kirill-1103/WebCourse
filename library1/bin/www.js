let app = require('../app');
let port = process.env.PORT || '3002';
app.set('port', port);
app.listen(port);

