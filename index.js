
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes/api');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
//hel
SUPABASE_URL=https://eokfpyhrhsibcjpbzret.supabase.co
DATABASE_URL=postgresql://postgres.eokfpyhrhsibcjpbzret:oGvfIggAP6K06Qhj@aws-1-eu-west-3.pooler.supabase.com:5432/postgres