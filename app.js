const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const con = require('./config');
const { use } = require('express/lib/router');
const res = require('express/lib/response');
const req = require('express/lib/request');
const app = express();
app.use(express.urlencoded({extended: true}));
app.listen(process.ENV.PORT || 5509);
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));

app.get('/user',(req,res)=>{
    con.query('SELECT * FROM user', (e,result) => {
        if(e) res.send('DB ERROR');
        else res.send(JSON.stringify(result));
    });
});

app.post('/user',(req,res) => {
    let user = req.body;
    con.query(`INSERT INTO 
    user(login,password,email,balance)
    VALUES('${user.login}','${user.password}','${user.email}',0)`,
    (e,result) => {
        if(e) res.send(e);
        else{
            let user_id = user_id.insert_id;
            con.query(`INSERT INTO cart(user_id) VALUES(${user_id})`,(e,result)=>{
                if(e) res.send(e);
                else res.redirect('index.html');
            })
        }
    })
});

app.get('/product',(req,res)=>{
    if(req.cookies.token){
        let token = req.cookies.token;
        con.query(`SELECT * FROM user WHERE token = '${token}'`,(e,result)=>{
            console.log(result);
            if(e) res.send(e)
            else if(result.length > 0){
                con.query('SELECT * FROM product', (e,result) => {
                    if(e) res.send(e);
                    else res.send(JSON.stringify(result));
                });
            }
            else{
                res.status(401).send('Error 401 Please Login')
            }
        })
    }
});

app.post('/product',(req,res) => {
    let product = req.body;
    con.query(`INSERT INTO 
    product(name,price,description,img)
    VALUES('${product.name}',${product.price},'${product.description}','${product.img}')`,
    (e,result) => {
        if(e) res.send(e);
        else res.send('SUCCESS');
    })
});


app.post('/login' , (req , res)=>{ 
    let user = req.body; 
    console.log(user);
    con.query(`SELECT * FROM user WHERE login = "${user.login}"`, 
    (error, result) => { 
        if (error)  
            res.status(501).send('DataBase ErroR ' + error); 
        else 
        if(result.length > 0){ 
            if (result[0].password == user.password) { 
                auth(result[0].id, res);
            } 
            else res.status(401).send("Wrong Pass");  
        } 
        else res.status(401).send("Wrong Login");                 
}) 
});


function auth(id,res) {
    let token = generateToken();
    con.query(`UPDATE user SET token = '${token}' WHERE id = ${id}`,
    (error,result) => {
        if(error) res.status(500).send(error);
        else res.status(200).send(token);
    });
}

function generateToken() {
    return crypto.randomBytes(64).toString('hex');
}

app.get('/logout',(req,res)=>{
    res.clearCookie('token');
    res.redirect('index.html');
});

app.get('/deleteCartProduct' , (req,res) =>{
let id = req.query.id;
con.query(`DELETE FROM cart_product WHERE id = ${id}`,(e)=>{
    if(e){
        res.send(e)
    }
    else{
        res.redirect("/shop.html")
    }
})

})


app.get('/buy',(req,res)=>{ 
    let id = req.query.id; 
    let token = req.cookies.token; 
    con.query(`SELECT * FROM user WHERE token = '${token}'`, (e, result)=>{ 
        if(e) res.status(500).end(); 
        else { 
            let userId = result[0].id; 
            con.query(`SELECT * FROM cart WHERE user_id = ${userId}`, (e, result)=>{ 
                if(e) res.status(500).send(e); 
                else { 
                    let cartId = result[0].id; 
                    con.query(`INSERT INTO cart_product(cart_id,product_id) 
                     VALUES(${cartId},${id})`,(e,result)=>{ 
                        if(e) res.status(500).send(e); 
                        else { 
                            res.status(201).redirect('/shop.html'); 
                        } 
                    }) 
                } 
            }) 
        } 
    }) 
}) 
 
app.get('/cart', (req,res)=>{ 
    let token = req.cookies.token; 
    con.query(`SELECT * FROM user WHERE token = '${token}'`, (e, result)=>{ 
        if(e) res.status(500).send(e); 
        else { 
            let userId = result[0].id; 
            con.query(`SELECT * FROM cart WHERE user_id = ${userId}`, (e, result)=>{ 
                if(e) res.status(500).send(e); 
                else { 
                    let cartId = result[0].id; 
                    con.query(`SELECT * FROM cart_product WHERE cart_id = ${cartId}`, (e,cp)=>{ 
                        if(e) res.status(500).send(e); 
                        con.query(`SELECT * FROM product`, (e,products)=>{ 
                            let a = []; 
                            cp.forEach((p)=>{ 
                                let productId = p.product_id; 
                                let product = products.find((pp)=>pp.id == productId); 
                                let cartProduct = { 
                                    id: p.id, 
                                    product: product 
                                } 
                                sum += product.price; //new
                                a.push(cartProduct); 
                            })
                            res.status(200).send(a);
                        }) 
                    }) 
                } 
            }); 
        } 
    }); 
})


app.get('/order',(req,res) => {

});