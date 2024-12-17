import cors from 'cors';
import crypto from 'crypto';
import express from 'express';

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

const role = {
    normal: 0,
    admin: 1
};

const sessions = {};
const users = {};
const products = {};

const generateUserId = function () {
    let id = 2;
    return () => id++;
}();

const generateProductId = function () {
    let id = 1;
    return () => id++;
}();

users[1] = { username: 'admin', password: 'admin', role: role.admin, firstName: 'admin', lastName: 'admin', nationalCode: '1111', mobile: '09999999', id: 1 };

app.post('/api/auth', (req, res) => {
    for (const userId in users) {
        if (users[userId].username === req.body.username && users[userId].password === req.body.password) {
            const sessionId = crypto.randomUUID();
            sessions[sessionId] = { userId: userId };
            res.json({ sessionId });
            return;
        }
    }
    res.status(400).send('User not found');
});

app.get('/api/users/current', (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).send('Authentication is required');
        return;
    }

    const session = sessions[req.headers.authorization];
    if (!session) {
        res.status(403).send('Session is invalid');
        return;
    }

    const user = { ...users[session.userId] };
    delete user.password;  
    res.json(user);
});

app.post('/api/users', (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).send('Authentication is required');
        return;
    }

    const session = sessions[req.headers.authorization];
    if (!session) {
        res.status(403).send('Session is invalid');
        return;
    }

    if (users[session.userId].role !== role.admin) {
        res.status(403).send('User role must be admin');
        return;
    }

    let user = {
        id: generateUserId(),
        role: req.body.role,
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationalCode: req.body.nationalCode,
        mobile: req.body.mobile
    };

    users[user.id] = user;

    res.json(user);
});

app.put('/api/users', (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).send('Authentication is required');
        return;
    }

    const session = sessions[req.headers.authorization];
    if (!session) {
        res.status(403).send('Session is invalid');
        return;
    }

    if (users[session.userId].role !== role.admin) {
        res.status(403).send('User role must be admin');
        return;
    }

    let user = {
        id: req.body.id,
        role: req.body.role,
        username: req.body.username,
        password: req.body.password,    
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationalCode: req.body.nationalCode,
        mobile: req.body.mobile
    };

    users[user.id] = user;

    res.json(user);
});

app.get('/api/users', (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).send('Authentication is required');
        return;
    }

    const session = sessions[req.headers.authorization];
    if (!session) {
        res.status(403).send('Session is invalid');
        return;
    }

    // if (users[session.userId].role !== role.admin) {
    //     res.status(403).send('User role must be admin');
    //     return;
    // }

    const userList = Object.values(users)

    res.json(userList);
});

app.get('/api/users/:id', (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).send('Authentication is required');
        return;
    }

    const session = sessions[req.headers.authorization];
    if (!session) {
        res.status(403).send('Session is invalid');
        return;
    }

    if (users[session.userId].role !== role.admin && session.userId !== req.params.id) {
        res.status(403).send('You can only edit your own user information or be an admin');
        return;
    }

    const user = users[req.params.id];
    if (!user) {
        res.status(404).send('User not found');
        return;
    }

    res.json(user);
});

app.delete('/api/users/:id', (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).send('Authentication is required');
        return;
    }

    const session = sessions[req.headers.authorization];
    if (!session) {
        res.status(403).send('Session is invalid');
        return;
    }

    if (users[session.userId].role !== role.admin) {
        res.status(403).send('User role must be admin');
        return;
    }

    const userId = req.params.id;
    if (!users[userId]) {
        res.status(404).send('User not found');
        return;
    }

    delete users[userId];
    res.json({ message: `User with ID ${userId} has been deleted successfully` });
});

app.post('/api/products', (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).send('Authentication is required');
        return
    }

    const session = sessions[req.headers.authorization];
    if (!session) {
        res.status(403).send('Session is invalid');
        return;
    }

    let product = {
        id: generateProductId(),
        name: req.body.name,
        code: req.body.code,
        weight: req.body.weight
    };

    products[product.id] = product;

    res.json(product);
});

app.put('/api/products', (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).send('Authentication is required');
        return;
    }

    const session = sessions[req.headers.authorization];
    if (!session) {
        res.status(403).send('Session is invalid');
        return;
    }

    let product = {
        id: req.body.id,
        name: req.body.name,
        code: req.body.code,
        weight: req.body.weight
    };

    products[product.id] = product;

    res.json(product);
});

app.get('/api/products', (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).send('Authentication is required');
        return;
    }

    const session = sessions[req.headers.authorization];
    if (!session) {
        res.status(403).send('Session is invalid');
        return;
    }
    const productList = Object.values(products)

    res.json(productList);
});

app.get('/api/products/:id', (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).send('Authentication is required');
        return;
    }

    const session = sessions[req.headers.authorization];
    if (!session) {
        res.status(403).send('Session is invalid');
        return;
    }


    const product = products[req.params.id];
    if (!product) {
        res.status(404).send('Product not found');
        return;
    }

    res.json(product);
});

app.delete('/api/products/:id', (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).send('Authentication is required');
        return;
    }

    const session = sessions[req.headers.authorization];
    if (!session) {
        res.status(403).send('Session is invalid');
        return;
    }

    const productId = req.params.id;
    if (!products[productId]) {
        res.status(404).send('Product not found');
        return;
    }

    delete products[productId];
    res.json({ message: `Product with ID ${productId} has been deleted successfully` });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
