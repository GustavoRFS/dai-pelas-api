import { Router } from 'express';
import instagramSchema from '@/app/schemas/paginas';
import { isValidObjectId } from 'mongoose';
const router = new Router();

router.get('/', (req, res) => {
  instagramSchema.find().then(paginas => {
    if (paginas) {
      return res.send(paginas);
    }
    else {
      return res.status(500).send({ error: "Internal server error" });
    }
  }).catch(err => {
    console.error(err, "Erro ao listar paginas do instagram");
    return res.status(500).send({ error: "Internal server error" });
  });
});

router.post('/', (req, res) => {
  const { nome, url } = req.body;

  if (!nome || !url || url.toLowerCase().search("instagram.com/") == -1) {
    return res.status(400).send({ error: "Bad request" });
  }

  instagramSchema.create({ nome, url }).then(pagina => {
    if (pagina) {
      return res.send(pagina);
    }
    else {
      return res.status(500).send({ error: "Internal server error" });
    }
  }).catch(err => {
    console.error(err, "Erro ao adicionar pagina do instagram");
    if (err.code == 11000) return res.status(409).send({ error: "Some field is not unique" });
    else return res.status(500).send({ error: "Internal server error" });
  })
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nome, url } = req.body;

  if (!id || !isValidObjectId(id) || !nome || !url || url.toLowerCase().search("instagram.com/") == -1) {
    return res.status(400).send({ error: "Bad request" });
  }

  instagramSchema.findByIdAndUpdate(id, { nome, url }).then(pagina => {
    if (pagina) {
      return res.send(pagina);
    }
    else {
      return res.status(404).send({ error: "Instagram page not found" });
    }
  }).catch(err => {
    console.error(err, "Erro ao editar pagina do instagram");
    if (err.code == 11000) return res.status(409).send({ error: "Some field is not unique" });
    else return res.status(500).send({ error: "Internal server error" });
  })
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    return res.status(400).send({ error: "Bad request" });
  }

  instagramSchema.findByIdAndRemove(id).then(pagina => {
    if (pagina) {
      return res.send(pagina);
    }
    else {
      return res.status(404).send({ error: "Instagram page not found" });
    }
  }).catch(err => {
    console.error(err, "Erro ao remover pagina do instagram")
  });
});

export default router;