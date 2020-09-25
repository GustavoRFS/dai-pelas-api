function tratarNome(nome) {
  var resultado = "";
  resultado += nome[0].toUpperCase();
  for (var i = 1; i < nome.length; i++) {
    resultado += nome[i];
  }
  return resultado;
}

export { tratarNome };