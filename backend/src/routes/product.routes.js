import express from "express";
import ProductModel from "../model/products.model.js";
import authenticate from "../middlewares/authenticate.js";
const router = express.Router();

//get all products
router.get("/", async (req, res) => {
try{
    const products = await ProductModel.find();
    res.json(products); 
}
catch(err){
console.log(err)
}
});

//get specific product

router.get('/:id', async(req, res)=> {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
})

//create product 

router.post('/',authenticate, async (req, res) => {  

    const product = await ProductModel.create(req.body)
    res.status(201).json({
        message: "Product created",
        product: product   
    });
})

//update prodcut
router.put('/:id',authenticate, async(req, res)=> {

    const {id} = req.params;
    const product = await ProductModel.findByIdAndUpdate(id, req.body, {new:true})

   if (!product) {
  return res.status(404).json({
    success: false,
    message: "Product not found"
  });
}

res.status(201).json({
  success: true,
  product
});
})

//delete product
router.delete("/:id", authenticate ,async(req, res)=> {
    const {id} = req.params;
const response =  await ProductModel.deleteOne({_id: id})
    res.status(200).json({
        message: "product deleted",
        response
    })
})


export default router;