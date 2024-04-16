const Product = require("../models/Product");
const User = require("../models/User");
const auth = require("../auth");

// [CREATE PRODUCT]
module.exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl } = req.body;

    const existingProduct = await Product.findOne({
      name: { $regex: new RegExp("^" + name + "$", "i") },
    });
    if (existingProduct) {
      return res.status(400).send({ error: "Product already exists" });
    }

    let newProduct = new Product({
      name: name,
      description: description,
      price: price,
      inventoryStock: stock,
      imageUrl: imageUrl || "",
    });

    return newProduct
      .save()
      .then((product) =>
        res
          .status(201)
          .send({ message: "The product was created successfully", product })
      )
      .catch((err) => {
        console.error("Error in saving: ", err);
        return res.status(500).send({ error: "Error in save" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [UPDATE PRODUCT INFO]
module.exports.updateProductInfo = (req, res) => {
  const productId = req.params.productId;
  const { name, description, price, stock, imageUrl } = req.body;

  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }

      product.name = name;
      product.description = description;
      product.price = price;
      product.inventoryStock = stock;
      product.imageUrl = imageUrl || product.imageUrl;

      return product.save();
    })
    .then(updatedProduct => {
      res.status(200).send({ message: "Product updated successfully", product: updatedProduct });
    })
    .catch(error => {
      console.error("Error updating product:", error);
      res.status(500).send({ message: "Internal server error" });
    });
};


// [ACTIVATE PRODUCT]
module.exports.activateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).send({ message: "Product not Found" });
    } else if (product.isActive) {
      return res.status(409).send({ message: "Product is already Active" });
    }

    product.isActive = true;
    const updatedProduct = await product.save();
    res.status(200).send({ message: "Product Successfully Activated", product: updatedProduct });
  } catch (error) {
    console.error("Error Activating Product:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// [ARCHIVE PRODUCT]
module.exports.archiveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).send({ message: "Product Not Found" });
    } else if (!product.isActive) {
      return res.status(409).send({ message: "Product is already Archived" });
    }

    product.isActive = false;
    await product.save();

    res.status(200).send({ message: "Product Successfully Deactivated", product });
  } catch (error) {
    console.error("Error Deactivating Product:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};


// [GET ALL PRODUCT]
module.exports.getAllProduct = (req, res) => {

	return Product.find({})
	.then(product => {

		if(product.length > 0){
		    return res.status(200).send({ product });
		}
		else{			
		    return res.status(200).send({ message: 'No product found.' });
		}

	})
	.catch(err => {

		console.error("Error in finding all product", err);

		return res.status(500).send({ error: "Error finding product"});

	});

};

// [GET ALL ACTIVE]
module.exports.getAllActive = (req, res) => {

	Product.find({ isActive: true })
	.then(product => {
		if (product.length > 0){
		    return res.status(200).send({ product });
		}
		else {
		    return res.status(200).send({message: "There are no product at the moment."})
		}
	})
	.catch(err => {

		console.error("Error in finding active product: ", err);
		return res.status(500).send({ error: "Error in finding active product"})

	});

};

// [GET PRODUCT - SPECIFIC]
module.exports.getProduct = (req, res) => {
	const productId = req.params.productId;

	Product.findById(productId)
	.then(product => {
		if (!product) {
			return res.status(404).send({ error: 'Product not found' });
		}
		return res.status(200).send({ product });
	})
	.catch(err => {
		console.error("Error in fetching the product: ", err)
		return res.status(500).send({ error: 'Failed to fetch product' });
	})
};

// [SEARCH PRODUCT BY NAME]
module.exports.searchProductsByName = async (req, res) => {
    try {
  
        console.log(req.body);
  
      const { name } = req.body;
  
      const products = await Product.find({
        name: { $regex: name, $options: "i" }
      });
  
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
// [SEARCH BY PRICE]
module.exports.searchProductsByPriceRange = async (req, res) => {
  try {
      console.log(req.body)
        
    const { minPrice, maxPrice } = req.body;

    if (!minPrice || !maxPrice) {
      return res.status(400).json({ error: 'Both minPrice and maxPrice are required in the request body.' });
    }

    const products = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice }
    });

    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};