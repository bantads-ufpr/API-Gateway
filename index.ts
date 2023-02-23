require("dotenv").config();
import { Response } from "express";
const express = require("express");
const jwt = require("jsonwebtoken");
var bodyParser = require("body-parser");
const axios = require("axios").default;
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

const sagaService = "http://localhost:8080";
const authService = "http://localhost:8180/auth";
const clienteService = "http://localhost:8280/cliente";
const gerenteService = "http://localhost:8380/gerente";
const contaService = "http://localhost:8480/conta";
const transacaoService = "http://localhost:8580/transacao";

function verifyJWT(req: any, res: any, next: () => void) {
    const token = req.headers["x-access-token"];
    if (!token)
        return res
            .status(401)
            .json({ auth: false, message: "Token não fornecido." });

    jwt.verify(
        token,
        process.env.SECRET,
        function (err: any, decoded: { id: any }) {
            if (err)
                return res.status(500).json({
                    auth: false,
                    message: "Falha ao autenticar o token.",
                });

            req.userId = decoded.id;
            next();
        }
    );
}

app
    // AUTH
    .post("/login", async (req: any, res: any) => {
        try {
            const response = await axios.post(`${authService}`, {
                ...req.body,
            });

            if (response.data) {
                const id = response.data.id;
                const token = jwt.sign({ id }, process.env.SECRET, {
                    expiresIn: 3000000,
                });
                return res.json({
                    auth: true,
                    token: token,
                    user: response.data,
                });
            }
            return res.json({ auth: false, message: "Login inválido!" });
        } catch (error: any) {
            return res.json({ auth: false, message: "Login inválido!" });
        }
    })
    .post("/logout", function (req: any, res: any) {
        res.json({ auth: false, token: null });
    })

    // SAGA
    .post("/cliente", verifyJWT, async (req: any, res: any) => {
        try {
            const response = await axios.post(`${sagaService}/cliente`, {
                ...req.body,
            });
            return res.json(response.data);
        } catch (error: any) {
            return res
                .status(error.status ? error.status : 400)
                .json({ ERROR: error.message });
        }
    })
    .put("/cliente/:id", verifyJWT, async (req: any, res: Response) => {
        try {
            const response = await axios.put(
                `${sagaService}/cliente/${req.params.id}`,
                {
                    ...req.body,
                }
            );

            return res.json(response.data);
        } catch (error: any) {
            return res
                .status(error.status ? error.status : 400)
                .json({ ERROR: error.message });
        }
    })
    .delete("/cliente/:id", verifyJWT, async (req: any, res: any) => {
        try {
            const response = await axios.delete(
                `${sagaService}/cliente/${req.params.id}`
            );
            return res.json(response.data);
        } catch (error: any) {
            return res
                .status(error.status ? error.status : 400)
                .json({ ERROR: error.message });
        }
    })
    .post("/gerente", verifyJWT, async (req: any, res: any) => {
        try {
            const response = await axios.post(`${sagaService}/gerente`, {
                ...req.body,
            });
            return res.json(response.data);
        } catch (error: any) {
            return res
                .status(error.status ? error.status : 400)
                .json({ ERROR: error.message });
        }
    })
    .put("/gerente/:id", verifyJWT, async (req: any, res: Response) => {
        try {
            const response = await axios.put(
                `${sagaService}/gerente/${req.params.id}`,
                {
                    ...req.body,
                }
            );

            return res.json(response.data);
        } catch (error: any) {
            return res
                .status(error.status ? error.status : 400)
                .json({ ERROR: error.message });
        }
    })
    .delete("/gerente/:id", verifyJWT, async (req: any, res: any) => {
        try {
            const response = await axios.delete(
                `${sagaService}/gerente/${req.params.id}`
            );
            return res.json(response.data);
        } catch (error: any) {
            return res
                .status(error.status ? error.status : 400)
                .json({ ERROR: error.message });
        }
    })

    // CONTA
    .put("/conta/:id", verifyJWT, async (req: any, res: any) => {
        try {
            delete req.body["id"];
            const response = await axios.put(
                `${contaService}/${req.params.id}`,
                {
                    ...req.body,
                }
            );
            return res.json(response.data);
        } catch (error: any) {
            return res
                .status(error.status ? error.status : 400)
                .json({ ERROR: error.message });
        }
    })
    .get("/conta/cliente/:id", verifyJWT, async (req: any, res: Response) => {
        try {
            const response = await axios.get(
                `${contaService}/cliente/${req.params.id}`
            );

            return res.json(response.data);
        } catch (error: any) {
            return res
                .status(error.status ? error.status : 400)
                .json({ ERROR: error.message });
        }
    })
    .get("/conta/gerente/:id", verifyJWT, async (req: any, res: Response) => {
        try {
            const response = await axios.get(
                `${contaService}/gerente/${req.params.id}`
            );

            return res.json(response.data);
        } catch (error: any) {
            return res
                .status(error.status ? error.status : 400)
                .json({ ERROR: error.message });
        }
    })
    .get(
        "/conta/gerente/:id?ativo=:ativo",
        verifyJWT,
        async (req: any, res: Response) => {
            try {
                const response = await axios.get(
                    `${contaService}/gerente/${req.params.id}&ativo=${req.params.ativo}`
                );

                return res.json(response.data);
            } catch (error: any) {
                return res
                    .status(error.status ? error.status : 400)
                    .json({ ERROR: error.message });
            }
        }
    )
    .get("/conta/:id", verifyJWT, async (req: any, res: Response) => {
        try {
            const response = await axios.get(
                `${contaService}/${req.params.id}`
            );

            return res.json(response.data);
        } catch (error: any) {
            return res
                .status(error.status ? error.status : 400)
                .json({ ERROR: error.message });
        }
    })
    .get(
        "/conta/melhores/:idGerente",
        verifyJWT,
        async (req: any, res: Response) => {
            try {
                const response = await axios.get(
                    `${contaService}/melhores/${req.params.idGerente}`
                );

                return res.json(response.data);
            } catch (error: any) {
                return res
                    .status(error.status ? error.status : 400)
                    .json({ ERROR: error.message });
            }
        }
    )

    // TRANSACAO
    .post("/transacao", verifyJWT, async (req: any, res: Response) => {
        try {
            const response = await axios.post(`${transacaoService}`, {
                ...req.body,
            });

            return res.json(response.data);
        } catch (error: any) {
            return res
                .status(error.status ? error.status : 400)
                .json({ ERROR: error.message });
        }
    })
    .get(
        "/transacao/:idCliente/:dataInicial/:dataFinal",
        verifyJWT,
        async (req: any, res: Response) => {
            try {
                const response = await axios.get(
                    `${transacaoService}/${req.params.idCliente}/${req.params.dataInicial}/${req.params.dataFinal}`
                );

                return res.json(response.data);
            } catch (error: any) {
                return res
                    .status(error.status ? error.status : 400)
                    .json({ ERROR: error.message });
            }
        }
    )

    //CLIENTE
    .get("/cliente", verifyJWT, async (req: any, res: Response) => {
        try {
            const response = await axios.get(`${clienteService}`);

            return res.json(response.data);
        } catch (error: any) {
            return res
                .status(error.status ? error.status : 400)
                .json({ ERROR: error.message });
        }
    })
    .get("/cliente/:id", verifyJWT, async (req: any, res: Response) => {
        try {
            const response = await axios.get(
                `${clienteService}/${req.params.id}`
            );

            return res.json(response.data);
        } catch (error: any) {
            return res
                .status(error.status ? error.status : 400)
                .json({ ERROR: error.message });
        }
    })
    .get(
        "/cliente/email/:email",
        verifyJWT,
        async (req: any, res: Response) => {
            try {
                const response = await axios.get(
                    `${clienteService}/email/${req.params.email}`
                );

                return res.json(response.data);
            } catch (error: any) {
                return res
                    .status(error.status ? error.status : 400)
                    .json({ ERROR: error.message });
            }
        }
    )
    .get("/cliente/cpf/:cpf", verifyJWT, async (req: any, res: Response) => {
        try {
            const response = await axios.get(
                `${clienteService}/cpf/${req.params.cpf}`
            );

            return res.json(response.data);
        } catch (error: any) {
            return res
                .status(error.status ? error.status : 400)
                .json({ ERROR: error.message });
        }
    })

    //GERENTE
    .get("/gerente", verifyJWT, async (req: any, res: Response) => {
        try {
            const response = await axios.get(`${gerenteService}`);

            return res.json(response.data);
        } catch (error: any) {
            return res
                .status(error.status ? error.status : 400)
                .json({ ERROR: error.message });
        }
    })
    .get("/gerente/:id", verifyJWT, async (req: any, res: Response) => {
        try {
            const response = await axios.get(
                `${gerenteService}/${req.params.id}`
            );

            return res.json(response.data);
        } catch (error: any) {
            return res
                .status(error.status ? error.status : 400)
                .json({ ERROR: error.message });
        }
    })
    .get(
        "/gerente/email/:email",
        verifyJWT,
        async (req: any, res: Response) => {
            try {
                const response = await axios.get(
                    `${gerenteService}/email/${req.params.email}`
                );

                return res.json(response.data);
            } catch (error: any) {
                return res
                    .status(error.status ? error.status : 400)
                    .json({ ERROR: error.message });
            }
        }
    );

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});

app.use((err: Error, res: any) => {
    res.status(500).json({ message: err.message });
});
