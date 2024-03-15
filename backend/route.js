module.exports = (app) => {
    const users = require('./user.controller.js');


    app.get('/getusername', users.getUserById);
    app.get('/products', users.getProducts);
    app.post('/cart', users.addToCart);
    app.post('/signup', users.createUser);
    app.put('/updateuser', users.updateUser);
    app.put('/products/update', users.updateProductQuantity);
    app.delete('/deleteuser', users.deleteUser);
    app.delete('/products/delete', users.deleteProduct);

}
