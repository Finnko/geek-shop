const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const moment = require("moment");

const app = express();

app.use(express.static("./public"));
app.use(bodyParser.json());

app.use("/cart", (req, res, next) => {
    if (["POST", "PATCH", "DELETE"].includes(req.method)) {
        const mapping = {
            POST: "Добавление",
            PATCH: "Редактирование",
            DELETE: "Удаление"
        };
        fs.readFile("./db/stats.json", "utf-8", (err, data) => {
            if (err) {
                return console.log(err);
            }
            const stats = JSON.parse(data);

            switch (req.method) {
                case "POST":
                    stats.push({
                        action: mapping[req.method],
                        name: req.body.name,
                        timestamp: moment().format()
                    });
                    fs.writeFile("./db/stats.json", JSON.stringify(stats), (err) => {
                        if (err) {
                            return console.log(err);
                        }
                    });
                    break;
                case "PATCH":
                case "DELETE":
                    const [, , id] = req.url.split("/");
                    fs.readFile("./db/products.json", "utf-8", (err, data) => {
                        if (err) {
                            return console.log(err);
                        }

                        const products = JSON.parse(data);
                        const product = products.find((item) => item.id === +id);
                        stats.push({
                            action: mapping[req.method],
                            name: product.name,
                            timestamp: moment().format()
                        });
                        fs.writeFile("./db/stats.json", JSON.stringify(stats), (err) => {
                            if (err) {
                                return console.log(err);
                            }
                        });
                    });
            }
        })
    }
    next();
});

app.get('/feedback', (req, res) => {
    fs.readFile('./db/feedback.json', 'utf-8', (err, data) => {
        if (err) {
            return console.log(err);
        }

        res.send(data);
    });
});

app.post('/feedback', (req, res) => {
    fs.readFile('./db/feedback.json', 'utf-8', (err, data) => {
        if (err) {
            return console.log(err);
        }

        const comment = JSON.parse(data);
        req.body.id = comment.length + 1;
        comment.push(req.body);

        fs.writeFile('./db/feedback.json', JSON.stringify(comment), (err) => {
            if (err) {
                return console.log(err);
            }

            res.send(req.body);
        });
    });
});

app.get('/feedback_approve', (req, res) => {
    fs.readFile('./db/feedback_approve.json', 'utf-8', (err, data) => {
        if (err) {
            return console.log(err);
        }

        res.send(data);
    });
});

app.post('/feedback_approve', (req, res) => {
    fs.readFile('./db/feedback_approve.json', 'utf-8', (err, data) => {
        if (err) {
            return console.log(err);
        }

        const comment = JSON.parse(data);
        comment.push(req.body);

        fs.writeFile('./db/feedback_approve.json', JSON.stringify(comment), (err) => {
            if (err) {
                return console.log(err);
            }

            res.send(req.body);
        });
    });
});

app.delete('/feedback/:id', (req, res) => {
    fs.readFile('./db/feedback.json', 'utf-8', (err, data) => {
        if (err) {
            return console.log(err);
        }

        const comment = JSON.parse(data);

        comment.splice(comment.indexOf(+req.params.id), 1);

        fs.writeFile('./db/feedback.json', JSON.stringify(comment), (err) => {
            if (err) {
                return console.log(err);
            }

            res.send(req.body);
        });
    });
});

app.get('/users', (req, res) => {
    fs.readFile('./db/users.json', 'utf-8', (err, data) => {
        if (err) {
            return console.log(err);
        }

        res.send(data);
    });
});

app.post('/users', (req, res) => {
    fs.readFile('./db/users.json', 'utf-8', (err, data) => {
        if (err) {
            return console.log(err);
        }

        const user = JSON.parse(data);
        req.body.id = user.length + 1;
        user.push(req.body);

        fs.writeFile('./db/users.json', JSON.stringify(user), (err) => {
            if (err) {
                return console.log(err);
            }

            res.send(req.body);
        });
    });
});

app.patch('/users/:id', (req, res) => {
    fs.readFile('./db/users.json', 'utf-8', (err, data) => {
        if (err) {
            return console.log(err);
        }

        let user = JSON.parse(data);

        user = user.map((item) => {
            if (item.id === +req.params.id) {
                return {...item, ...req.body};
            }

            return item;
        });

        fs.writeFile('./db/users.json', JSON.stringify(user), (err) => {
            if (err) {
                return console.log(err);
            }

            res.send(user.find((item) => item.id === +req.params.id));
        });
    });
});

app.get('/products', (req, res) => {
    fs.readFile('./db/products.json', 'utf-8', (err, data) => {
        if(err) {
            return console.log(err);
        }

        res.send(data);
    });
});

app.get('/cart', (req, res) => {
    fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
        if(err) {
            return console.log(err);
        }

        res.send(data);
    });
});

app.post('/cart', (req, res) => {
    fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
        if(err) {
            return console.log(err);
        }

        const cart = JSON.parse(data);
        cart.push(req.body);

        fs.writeFile('./db/cart.json', JSON.stringify(cart), (err) => {
            if(err) {
                return console.log(err);
            }

            res.send(req.body);
        });
    });
});

app.patch('/cart/:id', (req, res) => {
    fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
        if(err) {
            return console.log(err);
        }

        let cart = JSON.parse(data);

        cart = cart.map((item) => {
            if(item.id === +req.params.id) {
                return { ...item, ...req.body };
            }

            return item;
        });

        fs.writeFile('./db/cart.json', JSON.stringify(cart), (err) => {
            if(err) {
                return console.log(err);
            }

            res.send(cart.find((item) => item.id === +req.params.id));
        });
    });
});

app.delete('/cart/:id', (req, res) => {
    fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
        if(err) {
            return console.log(err);
        }

        let cart = JSON.parse(data);

        cart.splice(cart.indexOf(+req.params.id), 1);

        fs.writeFile('./db/cart.json', JSON.stringify(cart), (err) => {
            if(err) {
                return console.log(err);
            }

            res.send(req.body);
        });
    });
});

app.delete('/cart', (req, res) => {
    fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
        if (err) {
            return console.log(err);
        }

        let cart = JSON.parse(data);

        cart = [];

        fs.writeFile('./db/cart.json', JSON.stringify(cart), (err) => {
            if (err) {
                return console.log(err);
            }

            res.send(req.body);
        });
    });
});


app.listen(3000, () => {
    console.log('Server has been started!');
});
