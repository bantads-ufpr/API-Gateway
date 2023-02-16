import express, { response, Response } from "express";
const axios = require("axios").default;
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const sagaService = "http://saga:8080";
const authService = "http://auth:8180/auth";
const clienteService = "http://cliente:8280/cliente";
const gerenteService = "http://gerente:8380/gerente";
const contaService = "http://conta:8480/conta";
const transacaoService = "http://transacao:8580/transacao";

app
    // SAGA
    .put("/conta/saque/:id", async (req: any, res: any) => {
        try {
            const response = await axios.put(
                `${sagaService}/conta/saque/${req.params.id}`,
                {
                    ...req.body,
                }
            );
            return res.json(response.data);
        } catch (error: any) {
            return res.status(error.response.status).json(error.response.data);
        }
    })
    .put("/conta/deposito/:id", async (req: any, res: any) => {
        try {
            const response = await axios.put(
                `${sagaService}/conta/deposito/${req.params.id}`,
                {
                    ...req.body,
                }
            );
            return res.json(response.data);
        } catch (error: any) {
            return res.status(error.response.status).json(error.response.data);
        }
    })
    .put("/conta/transferencia?idOrigem=:idOrigem&idDestino=:idDestino", async (req: any, res: any) => {
        try {
            const response = await axios.put(
                `${sagaService}/conta/transferencia
                ?idOrigem=${req.params.idOrigem}
                &idDestino=${req.params.idDestino}`,
                {
                    ...req.body,
                }
            );
            return res.json(response.data);
        } catch (error: any) {
            return res.status(error.response.status).json(error.response.data);
        }
    })
    .post("/cliente", async (req: any, res: any) => {
        try {
            const response = await axios.post(`${sagaService}/cliente`, {
                ...req.body,
            });
            return res.json(response.data);
        } catch (error: any) {
            return res.status(error.response.status).json(error.response.data);
        }
    })
    .put("/cliente/:id", async (req: any, res: Response) => {
        try {
            const response = await axios.put(
                `${sagaService}/cliente/${req.params.id}`,
                {
                    ...req.body,
                }
            );

            return res.json(response.data);
        } catch (error: any) {
            return res.status(error.response.status).json(error.response.data);
        }
    })
    .delete("/cliente/:id", async (req: any, res: any) => {
        try {
            const response = await axios.delete(
                `${sagaService}/cliente/${req.params.id}`
            );
            return res.json(response.data);
        } catch (error: any) {
            return res.status(error.response.status).json(error.response.data);
        }
    })
    .post("/gerente", async (req: any, res: any) => {
        try {
            const response = await axios.post(`${sagaService}/gerente`, {
                ...req.body,
            });
            return res.json(response.data);
        } catch (error: any) {
            return res.status(error.response.status).json(error.response.data);
        }
    })
    .put("/gerente/:id", async (req: any, res: Response) => {
        try {
            const response = await axios.put(
                `${sagaService}/gerente/${req.params.id}`,
                {
                    ...req.body,
                }
            );

            return res.json(response.data);
        } catch (error: any) {
            return res.status(error.response.status).json(error.response.data);
        }
    })
    .delete("/gerente/:id", async (req: any, res: any) => {
        try {
            const response = await axios.delete(
                `${sagaService}/gerente/${req.params.id}`
            );
            return res.json(response.data);
        } catch (error: any) {
            return res.status(error.response.status).json(error.response.data);
        }
    })

    // COMPOSITION
    // tem que arrumar ainda as chamadas
    .get("/cliente/melhores/:idGerente", async (req: any, res: Response) => {
        try {
            const response = await axios.get(
                `/melhores/${req.params.idGerente}`
            );

            return res.json(response.data);
        } catch (error: any) {
            return res.status(error.response.status).json(error.response.data);
        }
    })
    .get("/cliente?cpf=:cpf", async (req: any, res: Response) => {
        try {
            const response = await axios.get(
                `/cliente?cpf=${req.params.cpf}`
            );

            return res.json(response.data);
        } catch (error: any) {
            return res.status(error.response.status).json(error.response.data);
        }
    })
    .get("/cliente/:idGerente", async (req: any, res: Response) => {
        try {
            const response = await axios.get(
                `/cliente/${req.params.idGerente}`
            );

            return res.json(response.data);
        } catch (error: any) {
            return res.status(error.response.status).json(error.response.data);
        }
    })
    .get("/gerente", async (req: any, res: Response) => {
        try {
            const response = await axios.get(`${sagaService}/gerente`);

            return res.json(response.data);
        } catch (error: any) {
            return res.status(error.response.status).json(error.response.data);
        }
    })

    // CONTA
    .get("/conta?idCliente=:id", async (req: any, res: Response) => {
        try {
            const response = await axios.get(
                `${contaService}?idCliente=${req.params.id}`
            );

            return res.json(response.data);
        } catch (error: any) {
            return res.status(error.response.status).json(error.response.data);
        }
    })
    .get("/conta?idGerente=:id", async (req: any, res: Response) => {
        try {
            const response = await axios.get(
                `${contaService}?idGerente=${req.params.id}`
            );

            return res.json(response.data);
        } catch (error: any) {
            return res.status(error.response.status).json(error.response.data);
        }
    })
    .get(
        "/conta?idGerente=:id&ativo=false",
        async (req: any, res: Response) => {
            try {
                const response = await axios.get(
                    `${contaService}?idGerente=${req.params.id}&ativo=false`
                );

                return res.json(response.data);
            } catch (error: any) {
                return res
                    .status(error.response.status)
                    .json(error.response.data);
            }
        }
    )
    .get("/conta/:id", async (req: any, res: Response) => {
        try {
            const response = await axios.get(
                `${contaService}/${req.params.id}`
            );

            return res.json(response.data);
        } catch (error: any) {
            return res.status(error.response.status).json(error.response.data);
        }
    })

    // TRANSACAO
    .get(
        "/transacao?idCliente=:idCliente&dataInicial=:dataInicial&dataFinal=:dataFinal",
        async (req: any, res: Response) => {
            try {
                const response = await axios.get(
                    `${transacaoService}
                    ?idCliente=${req.params.idCliente}
                    &dataInicial=${req.params.dataInicial}
                    &dataFinal=${req.params.dataFinal}`
                );

                return res.json(response.data);
            } catch (error: any) {
                return res
                    .status(error.response.status)
                    .json(error.response.data);
            }
        }
    )

    //CLIENTE
    .get("/cliente/:id", async (req: any, res: Response) => {
        try {
            const response = await axios.get(
                `${clienteService}/${req.params.id}`
            );

            return res.json(response.data);
        } catch (error: any) {
            return res.status(error.response.status).json(error.response.data);
        }
    })
    .get("/cliente/email/:email", async (req: any, res: Response) => {
        try {
            const response = await axios.get(
                `${clienteService}/email/${req.params.email}`
            );

            return res.json(response.data);
        } catch (error: any) {
            return res.status(error.response.status).json(error.response.data);
        }
    })

    //GERENTE
    .get("/gerente/:id", async (req: any, res: Response) => {
        try {
            const response = await axios.get(
                `${gerenteService}/${req.params.id}`
            );

            return res.json(response.data);
        } catch (error: any) {
            return res.status(error.response.status).json(error.response.data);
        }
    })
    .get("/gerente/email/:email", async (req: any, res: Response) => {
        try {
            const response = await axios.get(
                `${gerenteService}/email/${req.params.email}`
            );

            return res.json(response.data);
        } catch (error: any) {
            return res.status(error.response.status).json(error.response.data);
        }
    });

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});

app.use((err: Error, res: any) => {
    res.status(500).json({ message: err.message });
});
