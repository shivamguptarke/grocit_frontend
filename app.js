const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const ejs = require('ejs');
const check_authentication = require(__dirname + '/middlewares/check_auth.js')
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const Category = require(__dirname + '/db_models/CategorySchema.js');
const SubCategory = require(__dirname + '/db_models/SubCategorySchema.js').SubCategoryModel;
const Product = require(__dirname + '/db_models/ProductSchema.js');
const Variant = require(__dirname + '/db_models/VariantSchema.js').VariantModel;
const AdminModel  = require(__dirname + '/db_models/AdminSchema.js');
const Country  = require(__dirname + '/db_models/CountrySchema.js');
const State  = require(__dirname + '/db_models/StateSchema.js');
const City  = require(__dirname + '/db_models/CitySchema.js');
const countryRouter  = require(__dirname + '/api/countryStateCity.js');
const categoryRouter  = require(__dirname + '/api/category.js');
const productRouter  = require(__dirname + '/api/product.js');

const multer = require('multer');
const { response } = require("express");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null,uniqueSuffix + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage });

const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use('/api', countryRouter);
app.use('/api', categoryRouter);
app.use('/api', productRouter);
app.set('views', [path.join(__dirname, 'views'),path.join(__dirname, 'views/misc/'),path.join(__dirname, 'views/category/'),path.join(__dirname, 'views/products/')]);

app.use(session({
    secret: process.env.password_secret_key,
    resave: false,
    saveUninitialized: false,
   // cookie: { secure: true }
}))

app.use(passport.initialize());
app.use(passport.session());
//
//mongoose.connect('mongodb+srv://newuser:newuser@cluster0.dark2.mongodb.net/grocit_db?retryWrites=true&w=majority');
mongoose.connect(process.env.DB_CONNECT);

const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'kitty kitty meow from server' });
kitty.save().then(() => console.log("meow"));

passport.use(AdminModel.createStrategy());
passport.serializeUser(AdminModel.serializeUser());
passport.deserializeUser(AdminModel.deserializeUser());

app.listen(process.env.PORT, console.log("server is up and running at ${process.env.PORT}"));

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/dashboard", check_authentication, (req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    Category.find({}, function(err, itemsArray){
        if (err){
            console.log(err);
        }
        else{
            res.render("dashboard", {itemsArray: itemsArray, name: req.user.name});
            console.log(itemsArray);
        } 
    });
})

//---------PRODUCTS----------

app.get("/products", check_authentication, (req, res) => {
    Product.find({}, function(err, products){
        if (err){
            console.log(err);
        }
        else{
            res.render("products", {loadProducts: products, name: req.user.name});
            console.log(products);
        } 
    });
})

app.route("/AddProduct")
    .get(check_authentication, (req, res) => {
        Category.find({}, function(err, itemsArray){
            if (err){
                console.log(err);
            }
            else{
                res.render("AddProduct", {itemsArray: itemsArray});
                console.log(itemsArray);
            }
        });
    })
    .post(check_authentication, upload.array('productImage', 5), (req, res) => {
        var body = req.body;
        console.log(body);
        var productImages = [];
        req.files.forEach((f)=>{productImages.push(f.filename);})

        var newProduct = new Product({
            "name" : body.name,
            "subcategoryid" : "asjkdlhas dj",
            "quantity" : body.quantity,
            "description" : body.description,
            "imageUrl" :   "/uploads/",
            "imageName" :  productImages,
            "status" : body.status,
        });
        newProduct.save(
            function (err) {
            if (err) {
                res.send(err);
            }else
            {
                res.redirect("/products");
            }
          }
        );
    })


    
//---------PRODUCTS VARIANTS----------

app.get("/variants", check_authentication, (req, res) => {
    Product.find({}, function(err, products){
        if (err){
            console.log(err);
        }
        else{
            res.render("variants", {loadProducts: products, name: req.user.name});
            console.log(products);
        } 
    });
})

app.route("/AddVariant")
    .get(check_authentication, (req, res) => {
        Product.find({}, function(err, itemsArray){
            if (err){
                console.log(err);
            }
            else{
                res.render("AddVariant", {itemsArray: itemsArray});
                console.log(itemsArray);
            }
        });
    })
    .post(check_authentication, upload.array('productImage', 5), (req, res) => {
        var body = req.body;
        console.log(body);
        var productImages = [];
        req.files.forEach((f)=>{productImages.push(f.filename);})

        var newVariant = new Variant({
            "packagingSize" : body.packagingSize,
            "productid" : body.productid,
            "quantity" : body.quantity,
            "mrp" : body.price,
            "dprice" : body.dprice,
            "description" : body.description,
            "imageUrl" :   "/uploads/",
            "imageName" :  productImages,
            "status" : body.status,
        });
        Product.findOneAndUpdate({ _id: body.productid },
            { 
                "$push": {
                    "variants": newVariant
                }
            },
            function(err,doc) {
                if (err) {
                    console.log(err);
                }else
                {
                    newVariant.save(
                        function (err) {
                            if (err) {
                                res.send(err);
                            }else
                            {
                                res.redirect("/variants");
                            }
                        }
                    );
                    console.log(doc);
                }    
            }
        );
    })

app.route("/editVariant/:pid/:vid")
.get(check_authentication, (req, res) => {
    console.log(req.params);
    Product.findById({ _id : req.params.pid}, function(err, product){
        if (err){
            console.log(err);
        }
        else{
            product.variants.forEach( v => {
                console.log("finding --- variant" + v._id + "       " +  req.params.vid);
                if(v._id == req.params.vid)
                {
                    console.log( "found --" + v);
                    res.render("editVariant", {product: product, variant: v});
                }
            })
            //console.log(product);
        }
    });
})
.post(check_authentication, upload.array('productImage', 5), (req, res) => {
    var body = req.body;
    if(req.files.length>0)
    {
        var productImages = [];
        req.files.forEach((f)=>{productImages.push(f.filename);});
        Product.findOneAndUpdate({ "_id": body.productid , "variants._id": body.variantid},
            { 
                "variants.$.packagingSize": body.packagingSize,
                "variants.$.quantity": body.quantity,
                "variants.$.mrp": body.price,
                "variants.$.dprice": body.dprice,
                "variants.$.description": body.description,
                "variants.$.imageName": productImages,
                "variants.$.status": body.status,
            },
            function(err,doc) {
                if (err) {
                    console.log(err);
                }else
                {                  
                    Variant.findOneAndUpdate({_id: body.variantid},{
                            "packagingSize": body.packagingSize,
                            "quantity": body.quantity,
                            "mrp": body.price,
                            "dprice": body.dprice,
                            "description": body.description,
                            "imageName": productImages,
                            "status": body.status,
                        },
                        function (err) {
                            if (err) {
                                res.send(err);
                            }else
                            {
                                res.redirect("/variants");
                            }
                        }
                    );
                    console.log(doc);
                }    
            }
        );
        
    }else{
        Product.findOneAndUpdate({ "_id": body.productid , "variants._id": body.variantid},
            { 
                "variants.$.packagingSize": body.packagingSize,
                "variants.$.quantity": body.quantity,
                "variants.$.mrp": body.price,
                "variants.$.dprice": body.dprice,
                "variants.$.description": body.description,
                "variants.$.status": body.status,
            },
            function(err,doc) {
                if (err) {
                    console.log(err);
                }else
                {
                    Variant.findOneAndUpdate({_id: body.variantid},{
                            "packagingSize": body.packagingSize,
                            "quantity": body.quantity,
                            "mrp": body.price,
                            "dprice": body.dprice,
                            "description": body.description,
                            "status": body.status,
                        },
                        function (err) {
                            if (err) {
                                res.send(err);
                            }else
                            {
                                res.redirect("/variants");
                            }
                        }
                    );
                    console.log(doc);
                }    
            }
        );
    }
})

app.get("/viewVariant/:pid/:vid", check_authentication, (req, res) => {
    Product.findById({ _id : req.params.pid}, function(err, product){
        if (err){
            console.log(err);
        }
        else{
            product.variants.forEach( v => {
                console.log("finding --- variant" + v._id + "       " +  req.params.vid);
                if(v._id == req.params.vid)
                {
                    console.log( "found --" + v);
                    res.render("viewVariant", {product: product, variant: v});
                }
            })
            //console.log(product);
        }
    });
})

//---------CATEGORY----------

app.get("/category", check_authentication, (req, res) => {
    Category.find({}, function(err, itemsArray){
        if (err){
            console.log(err);
        }
        else{
            res.render("category", {itemsArray: itemsArray});
            console.log(itemsArray);
        } 
    });
})

app.route("/addCategory")
    .get(check_authentication, (req, res) => {
        res.render("addCategory");
    })
    .post(check_authentication, upload.single('categoryImage'), (req, res) => {
        var body = req.body;
        console.log(body);

        var newCategory = new Category({
            "name" : body.name,
            "description" : body.description,
            "image" :   "/uploads/" + req.file.filename,
            "status" : body.status,
        });
        newCategory.save(
            function (err) {
            if (err) {
                console.log(err);
                res.send(err);
            }else
            {
                res.redirect("/category");
            }
          }
        );
    })

//---------SUBCATEGORY----------

    app.get("/subCategory", check_authentication, (req, res) => {
        Category.find({}, function(err, itemsArray){
            if (err){
                console.log(err);
            }
            else{
                res.render("subCategory", {itemsArray: itemsArray});
                console.log(itemsArray);
            } 
        });
    })
    
    app.route("/addSubCategory")
        .get(check_authentication, (req, res) => {
            Category.find({}, function(err, itemsArray){
                if (err){
                    console.log(err);
                }
                else{
                    res.render("addSubCategory", {itemsArray: itemsArray});
                    console.log(itemsArray);
                } 
            });
        })
        .post(check_authentication, upload.single('subCategoryImage'), (req, res) => {
            var body = req.body;
            console.log(body);
    
            var newSubCategory = new SubCategory({
                "name" : body.name,
                "categoryid" : body.categoryid,
                "description" : body.description,
                "image" :   "/uploads/" + req.file.filename,
                "status" : body.status,
            });
            Category.findOneAndUpdate({ _id: body.categoryid },{ "$push": {"subcategory": newSubCategory}}, function(err,doc) {
                if (err) {console.log(err);}
                else {
                    newSubCategory.save(
                        function (err) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        }else
                        {
                            res.redirect("/subCategory");
                        }
                    }
                    );
                    console.log(doc);
                }    
            });
        })    

//---------LOGIN----------

app.route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post((req, res, next) => {
        try{
            passport.authenticate('local', function(err, admin, info) {
                console.log("auth log ----> " + err + " ------------ " + admin + " ---------- " + info)
                if (err) {
                return next(err); // will generate a 500 error
                }
                if (! admin) {
                return res.send(401,{ success : false, message : 'authentication failed' });
                }
                req.login(admin, function(err){
                if(err){
                    return next(err);
                }
                return res.redirect("/dashboard");        
                });
            })(req, res, next);
        } catch (error) {
            console.log(error);
        }
    })

//---------REGISTER----------

app.route("/register")
    .get((req, res) => {
        res.render("register");
    })
    .post((req, res) => {
        try{
            AdminModel.register({username: req.body.username, name: req.body.name, phone: req.body.phone}, req.body.password, function(err, admin){
                if(err){
                    console.log(err);
                    res.redirect("/register");
                }else{
                    console.log('here' + admin);
                    passport.authenticate('local')(req, res, function () {
                        console.log(res);
                        res.redirect("/dashboard");
                    });
                }
            })
        } catch (error) {
            console.log(error);
        }
    })

//---------LOGOUT----------

app.get("/logout", (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
})

//---------COUNTRY----------

app.get("/country", check_authentication, (req, res) => {
    Country.find({}, function(err, itemsArray){
        if (err){
            console.log(err);
        }
        else{
            res.render("country", {itemsArray: itemsArray});
            console.log(itemsArray);
        } 
    });
})

app.route("/addCountry")
    .get(check_authentication, (req, res) => {
        res.render("addCountry");
    })
    .post(check_authentication, (req, res) => {
        var body = req.body;
        console.log(body);

        var newCountry = new Country({
            "name" : body.name,
            "code" : body.code,
            "status" : body.status,
        });
        newCountry.save(
            function (err) {
            if (err) {
                console.log(err);
                res.send(err);
            }else
            {
                res.redirect("/country");
            }
          }
        );
    })


//---------STATE----------

app.get("/state", check_authentication, (req, res) => {
    State.find({}, function(err, itemsArray){
        if (err){
            console.log(err);
        }
        else{
            res.render("state", {itemsArray: itemsArray});
            console.log(itemsArray);
        } 
    });
})

app.route("/addState")
    .get(check_authentication, (req, res) => {
        Country.find({}, function(err, itemsArray){
            if (err){
                console.log(err);
            }
            else{
                res.render("addState", {itemsArray: itemsArray});
                console.log(itemsArray);
            } 
        });
    })
    .post(check_authentication, (req, res) => {
        var body = req.body;
        console.log(body);

        var newState = new State({
            "name" : body.name,
            "countryid" : body.countryid,
            "status" : body.status,
        });
        newState.save(
            function (err) {
            if (err) {
                console.log(err);
                res.send(err);
            }else
            {
                res.redirect("/state");
            }
          }
        );
    })

//---------CITY----------

app.get("/city", check_authentication, (req, res) => {
    City.find({}, function(err, itemsArray){
        if (err){
            console.log(err);
        }
        else{
            res.render("city", {itemsArray: itemsArray});
            console.log(itemsArray);
        } 
    });
})

app.route("/addCity")
    .get(check_authentication, (req, res) => {
        Country.find({}, function(err, itemsArray){
            if (err){
                console.log(err);
            }else{
                State.find({}, function(err, stateArray){
                    if (err){
                        console.log(err);
                    }
                    else{
                        res.render("addCity", {itemsArray: itemsArray, stateArray: stateArray});
                        console.log(stateArray);
                    } 
                });
            } 
        });
    })
    .post(check_authentication, (req, res) => {
        var body = req.body;
        console.log(body);

        var newCity = new City({
            "name" : body.name,
            "stateid" : body.stateid,
            "pincode" : body.pincode,
            "status" : body.status,
        });
        newCity.save(
            function (err) {
            if (err) {
                console.log(err);
                res.send(err);
            }else
            {
                res.redirect("/city");
            }
          }
        );
    })
