let express = require("express");

let router = express.Router();
let client = require("../configs/redis");

let Product = require("../model.js/product_model");
const { body, validationResult } = require("express-validator");

router.get("", async (req, res) => {
  try {
    client.get("product", async function (error, fetchproduct) {
      try {
        if (fetchproduct) {
          let products = JSON.parse(fetchproduct);
          res.status(200).send({ products, redis: true });
        } else {
          let products = await Product.find().lean().exec();
          res.status(200).send({ products: products, redis: false });
        }
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post(
  "",
  body("name").not().isEmpty().withMessage("Name can not be empty"),
  async (req, res) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        res.status(400).send({ error: error.array() });
      }
      let product = await Product.create(req.body);

      let products = await Product.find().lean().exec();
      client.set("product", JSON.stringify(products));

      res.status(200).send({ products: products });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

router.get("/:id", async (req, res) => {
    try {
        client.get(`product.${req.params.id}`,async function(err,fetchproduct){
            if(fetchproduct){
                let products = JSON.parse(fetchproduct)
                return res.status(200).send({products,redis:true})
            }
            else{
                let product = await Product.findById(req.params,id).lean().exec()
                client.set(`product.${req.params.id}`,JSON.stringify(product))
                return res.status(200).send({product:product,redis:false})
            }
        })
    } catch (error) {
        res.send({error:error.message})
    }
});

router.patch("/:id", async (req, res) => {
  try {
    let product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();

    let products = await Product.find().lean().exec();
    client.set(`product.${req.params.id}`, JSON.stringify(product));
    client.set("product", JSON.stringify(products));

    res.status(200).send({ product: product });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let product = await Product.findByIdAndDelete(req.params.id).lean().exec();

    let products = await Product.find().lean().exec();

    client.del(`product.${req.params.id}`);

    client.set("product", JSON.stringify(products));

    res.status(200).send({ product: product });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
