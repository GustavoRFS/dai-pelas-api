import { Router } from 'express';
import fraseSchema from '@/app/schemas/frases';
import { isValidObjectId } from 'mongoose';
const router = new Router();

router.get("/", (req, res) => {
  fraseSchema.find().then(frases => {
    if (frases) {
      return res.send(frases);
    }
    else {
      return res.status(500).send({ error: "Internal server error" });
    }
  }).catch(err => {
    console.error(err, "Erro ao listar frases");
    return res.status(500).send({ error: "Internal server error" });
  });
});

router.post("/", (req, res) => {
  const { texto, tipo } = req.body;

  if (!texto || !tipo) {
    return res.status(400).send({ error: "Bad request" });
  }

  if ((texto.search("{piranha}") == -1) && (texto.search("{corno}") == -1)) {

    return res.status(400).send({ error: "Invalid text" });
  }

  if (tipo != "LISTENING" && tipo != "STREAMING" && tipo != "PLAYING" && tipo != "WATCHING") {
    return res.status(400).send({ error: "Invalid type" });
  }

  fraseSchema.create({ texto, tipo }).then(frase => {
    if (frase) {
      return res.send(frase);
    }
    else {
      return res.status(500).send({ error: "Internal server error" });
    }
  }).catch(err => {
    console.error(err, "Erro ao adicionar frase");
    if (err.code == 11000) return res.status(409).send({ error: "Some field is not unique" });
    else return res.status(500).send({ error: "Internal server error" });
  })
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { texto, tipo } = req.body;

  if (!texto || !tipo) {
    return res.status(400).send({ error: "Bad request" });
  }

  if ((texto.search("{piranha}") == -1 && (texto.search("{corno}") == -1))) {
    return res.status(400).send({ error: "Invalid text" });
  }

  if (tipo != "LISTENING" && tipo != "STREAMING" && tipo != "PLAYING" && tipo != "WATCHING") {
    return res.status(400).send({ error: "Invalid type" });
  }


  fraseSchema.findByIdAndUpdate(id, { texto, tipo }).then(frase => {
    if (frase) {
      return res.send(frase);
    }
    else {
      return res.status(404).send({ error: "Frase not found" });
    }
  }).catch(err => {
    console.error(err, "Erro ao adicionar frase");
    if (err.code == 11000) return res.status(409).send({ error: "Some field is not unique" });
    else return res.status(500).send({ error: "Internal server error" });
  })
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    return res.status(400).send({ error: "Invalid ID" });
  }

  fraseSchema.findByIdAndRemove(id).then(frase => {
    if (frase) {
      return res.send(frase);
    }
    else {
      return res.status(404).send({ error: "Frase not found" });
    }
  }).catch(err => {
    console.error(err, "Erro ao remover frase");
    return res.status(500).send({ error: "Internal server error" });
  })
});

export default router;