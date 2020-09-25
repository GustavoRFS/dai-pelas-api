import { Router } from 'express';
import parenteSchema from '@/app/schemas/parente';
import { isValidObjectId } from 'mongoose';
import { tratarNome } from '@/utils/functions';
const router = new Router();

router.post("/", (req, res) => {
  var { nome, mae } = req.body;

  if (!nome || mae == undefined) {
    return res.status(400).send({ error: "Bad request" });
  }

  nome = tratarNome(nome);

  parenteSchema.create({ nome, mae }).then((parente) => {
    if (parente) {
      return res.send(parente);
    }
    else {
      return res.status(500).send({ error: "Internal server error" });
    }
  }).catch(err => {
    console.error(err, `\n Erro ao adicionar parente`);
    if (err.code == 11000) return res.status(409).send({ error: "Some field is not unique" });
    else return res.status(500).send({ error: "Internal server error" });
  })
});

router.get("/", (req, res) => {
  parenteSchema.find().then(parentes => {
    if (parentes) {
      return res.send(parentes)
    }
    else {
      return res.status(500).send({ error: "Internal server error" });
    }
  }).catch(err => {
    console.error(err, `\n Erro ao listar parentes`)
    return res.status(500).send({ error: "Internal server error" });
  })
})

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { nome, mae } = req.body;

  if (!nome || mae == undefined) {
    return res.status(400).send({ error: "Bad request" });
  }

  parenteSchema.findByIdAndUpdate(id, { nome, mae }).then(parente => {
    if (parente) {
      return res.send(parente)
    }
    else {
      return res.status(404).send({ error: "Parente not found" });
    }
  }).catch(err => {
    console.error(err, `\n Erro ao editar parentes`);
    if (err.code == 11000) return res.status(409).send({ error: "Some field is not unique" });
    else return res.status(500).send({ error: "Internal server error" });
  })
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send({ error: "Bad request" });
  }
  if (!isValidObjectId(id)) {
    return res.status(400).send({ error: "Invalid id" });
  }

  parenteSchema.findByIdAndRemove(id).then(parente => {
    if (parente) {
      return res.send(parente);
    }
    else {
      return res.status(404).send({ error: "Parente not found" });
    }
  }).catch(err => {
    console.error(err, `\n Erro ao apagar parente`);
    return res.status(500).send({ error: "Internal server error" });
  })
});

export default router;