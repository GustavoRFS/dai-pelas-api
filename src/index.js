import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);

import { parentes, clan, frases, plays, paginas } from "@/app/controllers/index.js";

app.use("/parentes", parentes);
app.use("/clan", clan);
app.use("/frases", frases);
app.use("/plays", plays);
app.use("/instagram", paginas);

app.listen(process.env.PORT, () => {
  console.log(`Servidor da API do DAI PELAS rodando na porta ${process.env.PORT}`);
});