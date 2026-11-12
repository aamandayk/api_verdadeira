// npm init -> cria o pacote inicial API
// npm i express
const express = require("express")
const app = express()
app.use(express.json())
const port = 3000

// npm i mysql2
const db = require("./db")

// ================= ROTAS DE AULA =================

// GET /aula
app.get("/aula", async (req, res) => {
  try {
    const resultado = await db.pool.query("SELECT * FROM aula")
    res.status(200).json(resultado[0])
  } catch (erro) {
    res.status(500).json({ erro: erro.message })
  }
})

// POST /aula
app.post("/aula", async (req, res) => {
  try {
    const dados = req.body
    const resultado = await db.pool.query(
      "INSERT INTO aula (serie, turma, componente, professor) VALUES (?, ?, ?, ?)",
      [dados.serie, dados.turma, dados.componente, dados.professor]
    )
    res.status(201).json({
      resultado: "Aula cadastrada, ID = " + resultado[0].insertId
    })
  } catch (erro) {
    res.status(500).json({ erro: erro.message })
  }
})

// DELETE /aula/:id
app.delete("/aula/:id", async (req, res) => {
  try {
    const id = req.params.id
    const [resultado] = await db.pool.query("DELETE FROM aula WHERE id = ?", [id])
    
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Aula não encontrada" })
    }

    res.status(200).json({ resultado: "Aula deletada com sucesso" })
  } catch (erro) {
    res.status(500).json({ erro: erro.message })
  }
})

// ================= ROTAS DE HORÁRIO =================

// POST /horario
app.post("/horario", async (req, res) => {
  try {
    const dados = req.body
    // ATENÇÃO: Verifique se a coluna da chave estrangeira no seu banco se chama "id_aula" ou "aula_id"
    const resultado = await db.pool.query(
      "INSERT INTO horario (dia, hora, id_aula) VALUES (?, ?, ?)",
      [dados.dia, dados.hora, dados.id_aula]
    )
    res.status(201).json({
      resultado: "Horário cadastrado, ID = " + resultado[0].insertId
    })
  } catch (erro) {
    // Se tentar inserir um id_aula que não existe na tabela aula, o MySQL bloqueia e retorna o erro aqui
    res.status(500).json({ erro: erro.message })
  }
})

// GET /horario/:dia
app.get("/horario/:dia", async (req, res) => {
  try {
    const dia = req.params.dia
    const resultado = await db.pool.query(
      "SELECT * FROM horario WHERE dia = ?",
      [dia]
    )
    res.status(200).json(resultado[0])
  } catch (erro) {
    res.status(500).json({ erro: erro.message })
  }
})

// DELETE /horario/:id
app.delete("/horario/:id", async (req, res) => {
  try {
    const id = req.params.id
    const [resultado] = await db.pool.query("DELETE FROM horario WHERE id = ?", [id])

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Horário não encontrado" })
    }

    res.status(200).json({ resultado: "Horário deletado com sucesso" })
  } catch (erro) {
    res.status(500).json({ erro: erro.message })
  }
})

// ================= INICIAR SERVIDOR =================

app.listen(port, () => {
  console.log("API rodando na porta " + port)
})