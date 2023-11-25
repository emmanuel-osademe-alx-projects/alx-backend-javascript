import express from 'express';
import mapRoutes from './routes';

const app = express();
const PORT = 1245;

mapRoutes(app);
app.listen(PORT, () => process.stdout.write(`Server listening on PORT ${PORT}`));

export default app;
// module.exports = app;
