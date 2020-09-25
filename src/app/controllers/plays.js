import { Router } from 'express';
import playSchema from '@/app/schemas/plays';
import { isValidObjectId } from 'mongoose';

const router = new Router();

router.get('/', (req, res) => {
  playSchema.find().then((plays) => {
    if (plays) {
      return res.send(plays);
    }
    else {
      return res.status(500).send({ error: "Internal server error" });
    }
  }).catch(err => {
    console.error(err, "Erro ao obter plays");
    return res.status(500).send({ error: "Internal server error" });
  });
});

router.post('/', (req, res) => {
  const { url, autores } = req.body;

  if (!url || !autores) {
    return res.status(400).send({ error: "Bad request" });
  }

  if (url.search("/") == -1 && url.search(".") == -1) {
    return res.status(400).send({ error: "Invalid URL" });
  }

  playSchema.create({ url, autores }).then((play) => {
    if (play) {
      return res.send(play);
    }
    else {
      return res.status(500).send({ error: "Internal server error" });
    }
  }).catch(err => {
    console.error(err, "Erro ao add play");
    if (err.code == 11000) return res.status(409).send({ error: "Some field is not unique" });
    else return res.status(500).send({ error: "Internal server error" });
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;

  const { url, autores } = req.body;

  if (!id || !isValidObjectId(id) || !url || !autores) {
    return res.status(400).send({ error: "Bad request" });
  }

  if (url.search("/") == -1 && url.search(".") == -1) {
    return res.status(400).send({ error: "Invalid URL" });
  }

  playSchema.findByIdAndUpdate(id, { url, autores }).then((play) => {
    if (play) {
      return res.send(play);
    }
    else {
      return res.status(500).send({ error: "Internal server error" });
    }
  }).catch(err => {
    console.error(err, "Erro ao add play");
    if (err.code == 11000) return res.status(409).send({ error: "Some field is not unique" });
    else return res.status(500).send({ error: "Internal server error" });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    return res.status(400).send({ error: "Bad request" });
  }

  playSchema.findByIdAndRemove(id).then((play) => {
    if (play) {
      return res.send(play);
    }
    else {
      return res.status(404).send({ error: "Play not found" });
    }
  }).catch((err) => {
    console.error(err, "Erro ao remover play");
    return res.status(500).send({ error: "Internal server error" });
  });
});

export default router;