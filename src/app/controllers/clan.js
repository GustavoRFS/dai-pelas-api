import { Router } from 'express';
import clanSchema from '@/app/schemas/clan';
import { isValidObjectId } from 'mongoose';
import { tratarNome } from '@/utils/functions';

const router = new Router();

router.post("/", (req, res) => {
  var { nome, discordId } = req.body;

  if (!nome) {
    return res.status(400).send({ error: "Bad request" });
  }

  nome = tratarNome(nome)

  clanSchema.create({ nome, discordId }).then(user => {
    if (user) {
      return res.send(user);
    }
    else {
      return res.status(500).send({ error: "Internal server error" });
    }
  }).catch(err => {
    console.error(err, `\n Erro ao adicionar alguem`);
    if (err.code == 11000) return res.status(409).send({ error: "Some field is not unique" });
    else return res.status(500).send({ error: "Internal server error" });
  })
});

router.get("/", (req, res) => {
  clanSchema.find().then(clan => {
    if (clan) {
      return res.send(clan);
    }
    else {
      return res.status(500).send({ error: "Internal server error" });
    }
  }).catch(err => {
    console.error(err, `\n Erro ao listar clan`);
    return res.status(500).send({ error: "Internal server error" });
  })
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send({ error: "Bad request" });
  }
  if (!isValidObjectId(id)) {
    return res.status(400).send({ error: "Invalid Id" });
  }

  var { nome, discordId } = req.body;

  nome = tratarNome(nome);

  await clanSchema.findByIdAndUpdate(id, { nome, discordId }).then(corno => {
    if (corno) {
      return res.send(corno);
    }
    else {
      return res.status(400).send({ error: "Corno not found" });
    }
  }).catch(err => {
    console.error(err, `\n Erro ao editar membro`);
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
    return res.status(400).send({ error: "Invalid Id" });
  }

  clanSchema.findByIdAndRemove(id).then(corno => {
    if (corno) {
      return res.send(corno);
    }
    else {
      return res.status(404).send({ error: "Corno not found" });
    }
  }).catch(err => {
    console.error(err, `\n Erro ao remover membro`);
    return res.status(500).send({ error: "Internal server error" });
  })
});

//IMAGENS:

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send({ error: "Bad request" });
  }
  if (!isValidObjectId(id)) {
    return res.status(400).send({ error: "Invalid ID" });
  }

  clanSchema.findById(id).select("+imagens").then(corno => {
    if (corno) {
      return res.send(corno);
    }
    else {
      return res.status(404).send({ error: "Corno not found" });
    }
  }).catch(err => {
    console.error(err, `\n Erro ao obter corno específico`);
    return res.status(500).send({ error: "Internal server error" });
  });
});

router.post("/:id", (req, res) => {
  const id = req.params.id;
  const { url } = req.body;

  if (!url) {
    return res.status(400).send({ error: "Bad request" });
  }

  if (!id) {
    return res.status(400).send({ error: "Id not provided" });
  }

  if (!isValidObjectId(id)) {
    return res.status(400).send({ error: "Invalid corno ID" })
  }

  clanSchema.findById(id).select('+imagens').then((corno) => {
    if (corno) {
      corno.imagens.push(url);
      corno.save();
      return res.send(corno);
    }
    else {
      return res.status(404).send({ error: "Corno not found" });
    }
  }).catch((err) => {
    console.error(err, "Erro ao adicionar imagem do corno");
    if (err.code == 11000) return res.status(409).send({ error: "Some field is not unique" });
    else return res.status(500).send({ error: "Internal server error" });
  })
});

router.delete("/:id/:index", (req, res) => {
  const { id, index } = req.params;

  if (!id || !index) {
    return res.status(400).send({ error: "Bad request" });
  }
  if (!isValidObjectId(id)) {
    return res.status(400).send({ error: "Invalid corno ID" });
  }

  clanSchema.findById(id).select('+imagens').then((corno) => {
    if (corno) {
      if (corno.imagens.length <= index || index < 0) {
        return res.status(400).send({ error: "Index out of range" });
      }
      else {
        corno.imagens.splice(index, 1);
        corno.save();
        return res.send(corno);
      }
    }
    else {
      return res.status(404).send({ error: "Corno not found" });
    }
  }).catch((err) => {
    console.error(err, "Erro a remover imagem de um corno");
    return res.status(500).send({ error: "Internal server error" });
  });
});

export default router;